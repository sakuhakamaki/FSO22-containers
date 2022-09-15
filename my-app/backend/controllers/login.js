const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Route kirjautumista varten.
loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    // Haetaan tietokannasta pyyntöä vastaava käyttäjä.
    // Jos käyttäjää ei löydy, on se epäkelvollinen. Muussa
    // tapauksessa tarkistetaan salasanan kelvollisuus.
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    // Epäkelvollisista käyttäjätunnuksesta ja/tai salasanasta
    // aiheutuu 401 Unauthorized -statuskoodi ja virheilmoitus.
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Invalid username or password.'
        })
    }
    // Käyttäjäolio.
    const userForToken = {
        username: user.username,
        id: user._id
    }
    // Luodaan ja allekirjoitetaan käyttäjälle token.
    const token = jwt.sign(userForToken, process.env.SECRET)

    // Palautetaan 200 OK -statuskoodi sekä token ja käyttäjäolio.
    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter