const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'The Blog',
        author: 'Saku',
        url: 'https://theblog.com',
        likes: 8
    },
    {
        title: 'A new blog',
        author: 'Test Person',
        url: 'https://newblog.com',
        likes: 4
    },
    {
        title: 'Interesting topics',
        author: 'Boring Guy',
        url: 'https://interestingnotboring.com',
        likes: 2
    },
]

// Palauttaa tietokantaan tallennetut blogit.
const blogsInDatabase = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

// Palauttaa tietokantaan tallennetut käyttäjät.
const usersInDatabase = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDatabase,
    usersInDatabase
}