const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1
  })
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    response.status(400).json({
      error: 'password of minimum length 3 is required'
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User({ username, name, passwordHash })
  const savedUser = await newUser.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter