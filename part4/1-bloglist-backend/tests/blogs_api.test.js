const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const newUser = new User({
    username: 'testUsername',
    name: 'testName',
    passwordHash: passwordHash
  })
  const savedUser = await newUser.save()
  // console.log(savedUser)
  const updatedBlogs = helper.initialBlogs.map(b => ({
    ...b,
    user: savedUser._id
  }))
  await Blog.deleteMany({})
  // console.log(updatedBlogs)
  await Blog.insertMany(updatedBlogs)
}, 100000)

describe('when trying to get all blog posts', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('correct number of blogs are returned', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('blog posts unique identifier is named id', async() => {
    const response = await api.get('/api/blogs')
    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  }, 100000)
})

describe('when adding a new blog post', () => {
  test('a valid blog post can be added', async() => {
    const newBlogPost = {
      title: 'new_title',
      url: 'some_url',
      likes: 1
    }

    const user = await User.findOne({ username: 'testUsername' })

    const token = jwt.sign({
      username: user.username,
      id: user._id,
    }, process.env.SECRET)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogsInDB = await helper.blogsInDB()
    expect(allBlogsInDB).toHaveLength(helper.initialBlogs.length + 1)

    const targetBlogPost = allBlogsInDB.find(b => {
      return b.title === newBlogPost.title &&
      b.url === newBlogPost.url &&
      b.likes === newBlogPost.likes
    })
    expect(targetBlogPost).toBeDefined()
  }, 100000)

  test('the default value for likes is 0', async() => {
    const newBlogPost = {
      title: 'new_title',
      author: 'some_author',
      url: 'some_url'
    }

    const user = await User.findOne({ username: 'testUsername' })

    const token = jwt.sign({
      username: user.username,
      id: user._id,
    }, process.env.SECRET)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogsInDB = await helper.blogsInDB()

    const targetBlogPost = allBlogsInDB.find(b => b.title === newBlogPost.title)
    expect(targetBlogPost.likes).toBe(0)
  }, 100000)

  test('a blog post without title returns 400', async() => {
    const blogPostWithoutTitle = {
      author: 'some_author',
      url: 'some_url',
      likes: 1
    }

    const user = await User.findOne({ username: 'testUsername' })

    const token = jwt.sign({
      username: user.username,
      id: user._id,
    }, process.env.SECRET)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogPostWithoutTitle)
      .expect(400)
  }, 100000)

  test('a blog post without url returns 400', async() => {
    const blogPostWithoutUrl = {
      title: 'some_title',
      author: 'some_author',
      likes: 1
    }

    const user = await User.findOne({ username: 'testUsername' })

    const token = jwt.sign({
      username: user.username,
      id: user._id,
    }, process.env.SECRET)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogPostWithoutUrl)
      .expect(400)

  }, 100000)
})

describe('when deleting a blog post', () => {
  test('204 is returned and note is deleted', async() => {
    const blogsAtStart = await helper.blogsInDB()
    const idToDelete = blogsAtStart[Math.floor(Math.random() * blogsAtStart.length)].id

    const user = await User.findOne({ username: 'testUsername' })

    const token = jwt.sign({
      username: user.username,
      id: user._id,
    }, process.env.SECRET)

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const blogTitles = blogsAtEnd.map(b => b.title)
    expect(blogTitles).not.toContain(blogsAtStart.find(b => b.id === idToDelete).title)
  }, 100000)
})

describe('when updating a blog post', () => {
  test('number of likes is updated', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const oldBlogpost = blogsAtStart[0]
    const newBlogpost = {
      ...oldBlogpost,
      likes: oldBlogpost.likes + 10
    }

    await api
      .put(`/api/blogs/${oldBlogpost.id}`)
      .send(newBlogpost)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDB()
    const updatedBlogpost = blogsAtEnd.find(b => b.id === oldBlogpost.id)
    expect(updatedBlogpost.likes).toBe(oldBlogpost.likes + 10)
  }, 100000)
})