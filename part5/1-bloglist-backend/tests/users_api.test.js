const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async() => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
}, 100000)

describe('when creating new user', () => {
  test('valid user is created successfully', async () => {
    const newUser = {
      username: 'newuser',
      name: 'newname',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersInDB = await helper.usersInDB()
    expect(usersInDB).toHaveLength(helper.initialUsers.length + 1)

    const targetUser = usersInDB.find(u => u.username === newUser.username)
    expect(targetUser).toBeDefined()
  }, 100000)

  test('user without username cannot be created', async () => {
    const newUserWithoutUsername = {
      name: 'newname',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUserWithoutUsername)
      .expect(400)

    const usersInDB = await helper.usersInDB()
    expect(usersInDB).toHaveLength(helper.initialUsers.length)
  }, 100000)

  test('user with username of length less than 3 cannot be created', async () => {
    const newUserWithoutUsername = {
      name: 'newname',
      username: 'ur',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUserWithoutUsername)
      .expect(400)

    const usersInDB = await helper.usersInDB()
    expect(usersInDB).toHaveLength(helper.initialUsers.length)
  }, 100000)

  test('user without password cannot be created', async () => {
    const newUserWithoutPassword = {
      name: 'newname',
      username: 'username'
    }

    const response = await api
      .post('/api/users')
      .send(newUserWithoutPassword)
      .expect(400)

    expect(response.body.error).toBe('password of minimum length 3 is required')

    const usersInDB = await helper.usersInDB()
    expect(usersInDB).toHaveLength(helper.initialUsers.length)
  }, 100000)

  test('user with password of length less than 3 cannot be created', async () => {
    const newUserWithShortPassword = {
      name: 'newname',
      username: 'username',
      password: 'pw'
    }

    const response = await api
      .post('/api/users')
      .send(newUserWithShortPassword)
      .expect(400)

    expect(response.body.error).toBe('password of minimum length 3 is required')

    const usersInDB = await helper.usersInDB()
    expect(usersInDB).toHaveLength(helper.initialUsers.length)
  }, 100000)
})

