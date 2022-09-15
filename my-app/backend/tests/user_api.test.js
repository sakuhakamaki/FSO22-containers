const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./api_test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

describe('Adding first user to database', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('Successful creation of a new unique user (201).', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const newUser = {
            name: 'Test Person',
            username: 'testUsername',
            password: 'testPassword'
          }
      
          await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
      
          const usersAtEnd = await helper.usersInDatabase()
          expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      
          const usernames = usersAtEnd.map(user => user.username)
          expect(usernames).toContain(newUser.username)
    })
})

describe('Adding invalid users is not allowed (400 Bad Request):', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('legitpassword', 10)
        const user = new User({username: 'notAdmin', passwordHash})

        await user.save()
    })

    test('No username.', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const invalidUser = {
            name: 'Mr. Invalid',
            password: 'legit'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      
        const names = usersAtEnd.map(user => user.name)
        expect(names).not.toContain(invalidUser.name)
    })

    test('No password.', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const invalidUser = {
            name: 'Mr. Invalid',
            username: 'mrinvalid'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      
        const names = usersAtEnd.map(user => user.name)
        expect(names).not.toContain(invalidUser.name)
    })

    test('Too short username.', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const invalidUser = {
            name: 'Mr. Invalid',
            username: 'mr',
            password: 'legit'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      
        const names = usersAtEnd.map(user => user.name)
        expect(names).not.toContain(invalidUser.name)
    })

    test('Too short password.', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const invalidUser = {
            name: 'Mr. Invalid',
            username: 'mrinvalid',
            password: 'le'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      
        const names = usersAtEnd.map(user => user.name)
        expect(names).not.toContain(invalidUser.name)
    })

    test('Not unique username.', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const invalidUser = {
            name: 'Mr. Admin',
            username: 'notAdmin',
            password: 'legitpassword'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      
        const names = usersAtEnd.map(user => user.name)
        expect(names).not.toContain(invalidUser.name)
    })
})