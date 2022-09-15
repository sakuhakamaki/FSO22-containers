const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

// Route tietokantaan tallennettujen käyttäjien noutamiseen.
usersRouter.get('/', async (request, response) => {
    // Jokaisen käyttäjänm tiedoissa näytetään 
    // kyseisen kirjoittajan kirjoittamat blogit listana.
    const users = await User
        .find({}).populate('blogs', {title: 1, author: 1, url: 1})
    
    response.json(users)
})

// Route uuden käyttäjän tallentamiseksi tietokantaan.
usersRouter.post('/', async (request, response) => {
    const body = request.body

    // Tarkistetaan löytyykö tietokannasta 
    // jo pyynnön mukaista käyttäjänimeä.
    const existingUser = await User.findOne({username: body.username})
    
    // Jos käyttäjänimi ei ole uniikki, palautetaan 
    // 400 Bad Request -statuskoodi ja virheilmoitus.
    if (existingUser) {
        return response.status(400).json({
            error: 'Username must be unique.'
        })
    }
    // Jos käyttäjänimi ja/tai salasana puuttuvat, palautetaan 
    // 400 Bad Request -statuskoodi ja virheilmoitus.
    if (body.password === undefined ||
        body.username === undefined) {
        return response.status(400).json({
            error: 'Missing username or password.'
        })
    }
    // Jos salasana ei ole riittävän pitkä, palautetaan 
    // 400 Bad Request -statuskoodi ja virheilmoitus.
    else if (body.password.length < 3) {
        return response.status(400).json({
            error: 'Password must be atleast 3 characters long.'
        })
    }
    // Salataan käyttäjän antama salasana.
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    // Uusi käyttäjäolio.
    const user = new User({
        username: body.username,
        passwordHash,
        name: body.name
    })
    // Tallennetaan käyttäjä tietokantaan.
    const savedUser = await user.save()

    // Vastataan 201 Created -statuskoodilla 
    // ja palautetaan tallennettu käyttäjä.
    response.status(201).json(savedUser)
})

module.exports = usersRouter