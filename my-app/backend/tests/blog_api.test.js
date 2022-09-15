const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./api_test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('Saving blogs to database:', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const testerLogin = {
            name: 'Mr. Tester',
            username: 'mrtester',
            password: 'testerpassword'
        }

        await api
            .post('/api/users')
            .send(testerLogin)
            .expect('Content-Type', /application\/json/)
        
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })
    
    test('Blogs are returned as JSON.', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('Correct amount of blogs are returned.', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('Returned blogs have a field named id, not _id.', async () => {
        const response = await api.get('/api/blogs')
    
        const returnedBlog = response.body[0]
        expect(returnedBlog._id).toBeUndefined()
        expect(returnedBlog.id).toBeDefined()
    })
    
    describe('Posting a new blog:', () => {
        test('A new valid blog can be added (201).', async () => {
            const loginInfo = {
                username: 'mrtester',
                password: 'testerpassword'
            }

            const loggedTester = await api
                .post('/api/login')
                .send(loginInfo)
                .expect('Content-Type', /application\/json/)
            
            const newBlog = {
                title: 'Utilizing async/await.',
                author: 'A Waiter',
                url: 'https://asynchronizer.com',
                likes: 123
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loggedTester.body.token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDatabase()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
            
            const contents = blogsAtEnd.map(blog => blog.title)
            expect(contents).toContain(newBlog.title)
        })
        
        test('If value for likes is not given, its default value is 0 (201).', async () => {
            const loginInfo = {
                username: 'mrtester',
                password: 'testerpassword'
            }

            const loggedTester = await api
                .post('/api/login')
                .send(loginInfo)
                .expect('Content-Type', /application\/json/)
            
            const newBlog = {
                title: 'Who wants likes anyway.',
                author: 'Like H8r',
                url: 'https://iwantcomments.com'
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loggedTester.body.token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDatabase()
            const returnedBlog = blogsAtEnd[blogsAtEnd.length - 1]
        
            expect(returnedBlog.likes).toBeDefined()
            expect(returnedBlog.likes).toBe(0)
        })
        
        test('A blog without title and url is not added (400).', async () => {
            const loginInfo = {
                username: 'mrtester',
                password: 'testerpassword'
            }

            const loggedTester = await api
                .post('/api/login')
                .send(loginInfo)
                .expect('Content-Type', /application\/json/)
            
            const newBlog = {
                author: 'Liked Author',
                likes: 456
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loggedTester.body.token}`)
                .send(newBlog)
                .expect(400)
        })

        test('Not allowed without setting a token (401).', async () => {
            const loginInfo = {
                username: 'mrtester',
                password: 'testerpassword'
            }

            const loggedTester = await api
                .post('/api/login')
                .send(loginInfo)
                .expect('Content-Type', /application\/json/)
            
            const unsavedBlog = {
                title: 'I want to be saved to database.',
                author: 'Sam Saver',
                url: 'https://allowsave.com/initial',
                likes: 123
            }

            await api
                .post('/api/blogs')
                .send(unsavedBlog)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDatabase()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
                
            const contents = blogsAtEnd.map(blog => blog.title)
            expect(contents).not.toContain(unsavedBlog.title)
        })
    })
    describe('Deleting an existing blog:', () => {
        test('Success (204) with a valid id.', async () => {
            const loginInfo = {
                username: 'mrtester',
                password: 'testerpassword'
            }

            const loggedTester = await api
                .post('/api/login')
                .send(loginInfo)
                .expect('Content-Type', /application\/json/)

            const blogsAtStart = await helper.blogsInDatabase()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `bearer ${loggedTester.body.token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDatabase()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
                
            const contents = blogsAtEnd.map(blog => blog.title)
            expect(contents).not.toContain(blogToDelete.title)
        })
    })
    describe('Updating an existing blog:', () => {
        test('Updates blog successfully (200) in database.', async () => {
            const blogsAtStart = await helper.blogsInDatabase()
            const originalBlog = blogsAtStart[0]
            
            const modifiedBlog = {
                title: 'A new updated blog',
                author: 'New Person',
                url: 'https://updatedblog.com',
                likes: 456
            }

            await api
                .put(`/api/blogs/${originalBlog.id}`)
                .send(modifiedBlog)
                .expect(200)

            const blogsAtEnd = await helper.blogsInDatabase()
            const updatedBlog = blogsAtEnd[0]

            expect(updatedBlog.title).not.toBe(originalBlog.title)
            expect(updatedBlog.author).not.toBe(originalBlog.author)
            expect(updatedBlog.url).not.toBe(originalBlog.url)
            expect(updatedBlog.likes).not.toBe(originalBlog.likes)
            expect(updatedBlog.id).toBe(originalBlog.id)
        })
    })  
})

afterAll(() => {
    mongoose.connection.close()
})