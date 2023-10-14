import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import ErrorNotification from './components/ErrorNotification'
import SuccessNotification from './components/SuccessNotification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
    })
  }, [])

  blogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // console.log('retrieved user', user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch(exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    blogService.setToken('')
    setUsername('')
    setPassword('')
  }

  const addBlog = async (newBlog) => {
    console.log('creating blog', newBlog)
    blogFormRef.current.toggleVisibility()
    try {
      const createdBlog = await blogService.create(newBlog)
      console.log('created', createdBlog)
      setBlogs(blogs.concat(createdBlog))
      setSuccessMessage(`${createdBlog.title} by ${createdBlog.author} added`)
    } catch(exception) {
      setErrorMessage('failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createBlogForm = () => (
    <Togglable buttonLabel="new note" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const updateBlog = async (blogToUpdate) => {
    const updatedBlog = await blogService.update(blogToUpdate)
    const newBlogs = blogs.filter(b => b.id !== updatedBlog.id).concat(updatedBlog)
    setBlogs(newBlogs)
  }

  const deleteBlog = async (blogToDelete) => {
    if (window.confirm(`Remove ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      await blogService.remove(blogToDelete)
      console.log(`deleted ${blogToDelete.title} by ${blogToDelete.author}`)
      const newBlogs = blogs.filter(b => b.id !== blogToDelete.id)
      setBlogs(newBlogs)
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage} />
        <SuccessNotification message={successMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      {
        <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>
      }

      <h2>create new</h2>
      {createBlogForm()}

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          username={user.username}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}

export default App