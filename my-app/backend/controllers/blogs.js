const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

// Route tietokannassa olevien blogien ja niiden tietojen noutamiseen.
blogsRouter.get('/', async (request, response) => {
    // Kuhunkin blogiin lisätään sen lisänneen henkilön tiedot.
    const blogs = await Blog
        .find({}).populate('user', {name: 1, username:1})
    
    response.json(blogs)
})

// Route uuden blogin lisäämiseksi tietokantaan.
blogsRouter.post('/', userExtractor, async (request, response, next) => {
    const body = request.body
    
    // Tarkastetaan userExtractor-middlewaren avulla
    // pyynnön lähettäneen käyttäjän velvollisuus.
    const user = request.user

    // Palautetaan 401 Unauthorized -statuskoodi ja
    // virheilmoitus käyttäjän ollessa epäkelvollinen.
    if (!user) {
        return response.status(401).json({
            error: 'Missing or Invalid Token.'
        })
    }

    // Uusi blogiolio.
    const blog = new Blog({
        title: body.title,
        author: body.author,
        user: user._id,
        url: body.url,
        likes: body.likes
    })

    // Tallennetaan blogi tietokantaan, lisätään blogi käyttäjän
    // kirjoittamien blogien listaan ja tallennetaan myös sen tiedot.
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    // Palautetaan 201 Created -statuskoodi 
    // ja tallennettu blogiolio.
    response.status(201).json(savedBlog)
})

// Route tietokannassa olevan blogin poistamiseksi.
blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {

    // Pyynnön tehneen käyttäjän kelvollisuus.
    const user = request.user

    if (!user) {
        return response.status(401).json({
            error: 'Missing or Invalid Token.'
        })
    }

    // Haetaan blogi tietokannasta.
    const blog = await Blog.findById(request.params.id)

    // Jos blogia ei ole, esim. jos se on jo poistettu,
    // palautetaan 404 Not Found -statuskoodi ja virheilmoitus.
    if (!blog) {
        return response.status(404).json({
            error: 'Blog not found.'
        })
    }
    // Blogin poisto hyväksytään vain jos sillä ei ole ainuttakaan
    // tallennettua/linkitettyä kirjoittajaa (esim. testitapaukset)
    // tai jos blogin kirjoittaja täsmää poistopyynnön tekijään.
    else if (!blog.user || blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)

        return response.status(204).end()
    }
    // Jos pyynnön tekijä ei täsmää blogin kirjoittajaan, estetään
    // poisto, palautetaan 403 Forbidden -statuskoodi ja virheilmoitus. 
    response.status(403).json({
        error: 'Deletion forbidden, this blog is not yours.'
    })
})

// Route tietokannassa olevan blogin päivittämiseen.
blogsRouter.put('/:id', async (request, response, next) => {
    const blog = new Blog(request.body)

    // Luodaan uusi blogiolio pyynnön mukana tulleista tiedoista.
    const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
    
    // Haetaan tietokannasta pyynnön mukana tullutta id:tä vastaava
    // blogiolio ja korvataan sen tiedot päivitetyllä oliolla.
    const returnedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedBlog,
        { new: true }
    )
    
    // Palautetaan päivitetty blogi.
    response.json(returnedBlog)
})

module.exports = blogsRouter