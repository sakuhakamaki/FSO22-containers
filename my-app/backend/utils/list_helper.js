const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((likes, blog) => likes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))

    // Huomioidaan mahdollinen tyhjä taulukko.
    return blogs.length === 0
        ? 0
        : blogs.find((blog) => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
    // Haetaan blogien kirjoittajat ja lasketaan kunkin kirjoittamien blogien
    // lukumäärä. Tehdään näistä avain-hyötykuorma -pareja, joissa avaimena
    // kirjoittaja ja hyötykuormana kirjoitettujen blogien määrä.
    const authors = lodash.countBy(blogs, 'author')
    const pairs = lodash.toPairs(authors)

    // Määritetään muodostetuista pareista se kirjoittaja, jolla on 
    // suurin määrä kirjoitettuja blogeja. Hyödynnetään last-metodia, 
    // joka vastaa kunkin parin toisena/viimeisenä olevaa alkiota, 
    // tässä tilanteessa blogien määrää.
    const author = lodash.maxBy(pairs, lodash.last)

    // Huomioidaan mahdollinen tyhjä taulukko.
    return blogs.length === 0
        ? 0
        :{
            "author": author[0],
            "blogs": author[1] 
        }
}

const mostLikes = (blogs) => {
    // Ryhmitetään parametrina saatu taulukko mappiin, jossa avaimena
    // kukin taulukossa esiintyvää kirjoittaja. Kunkin kirjoittaja-avaimen
    // hyötykuormana ovat ne blogitaulukon alkiot, joissa kirjoittaja esiintyy.
    const authorsAndInfo = lodash.groupBy(blogs, 'author')

    // Muovataan ryhmitetyt tiedot uuteen taulukkoon, jonka alkioina tieto
    // kirjoittajasta ja kirjoittajan yhteensä keräämien tykkäysten lukumäärä.
    const authorsAndLikes = lodash.map(authorsAndInfo, (info, author) => ({
        author: author,
        likes: lodash.sumBy(info, 'likes')
    }))

    // Haetaan ja palautetaan taulukosta se kirjoittaja-alkio, 
    // jolla on eniten kerättyjä tykkäyksiä.
    const author = lodash.maxBy(authorsAndLikes, 'likes')

    // Huomioidaan mahdollinen tyhjä taulukko.
    return blogs.length === 0
        ? 0
        : author
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}