const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1
  })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({
    ...request.body,
    author: user.name,
    user: user._id
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'invalid blog id' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'blog can only be deleted by author' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(b => b.id.toString() !== blog._id.toString())
  await user.save()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const updatedBlogpost = await Blog.findByIdAndUpdate(
    request.params.id,
    { ...request.body },
    { new: true, runValidators: true, context: 'query' })
  response.json(updatedBlogpost)
})

module.exports = blogRouter