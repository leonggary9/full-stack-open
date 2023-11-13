import { useState, useEffect, useRef } from 'react'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContext'
import { useUserDispatch, useUserValue } from './UserContext'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

const App = () => {
  const queryClient = useQueryClient()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const notificationDispatch = useNotificationDispatch()
  const setErrorNotification = (payload) => {
    notificationDispatch({
      type: 'SET_ERROR',
      payload: payload
    })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, 5000)
  }

  const userDispatch = useUserDispatch()
  const user = useUserValue()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'LOGIN',
        payload: user
      })
      // console.log('retrieved user', user)
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      userDispatch({
        type: 'LOGIN',
        payload: user
      })
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch(exception) {
      setErrorNotification('wrong username or password')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.removeItem('loggedInUser')
    userDispatch({
      type: 'LOGOUT'
    })
    blogService.setToken('')
    setUsername('')
    setPassword('')
  }

  const getAllBlogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const getAllUsersResult = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })
  // console.log(JSON.stringify(getAllUsersResult))
  const users = getAllUsersResult.data
  const blogs = getAllBlogsResult.data

  const userMatch = useMatch('/users/:id')
  const userProfile = (userMatch && users)
    ? users.find(users => users.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blog = (blogMatch && blogs)
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null

  const padding = {
    padding: 5
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form id='login-form' onSubmit={handleLogin}>
          <div>
            username
            <input type="text" id="username" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input type="password" id="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    )
  }

  const navBarStyle = {
    backgroundColor: 'lightgrey',
    padding: '5px'
  }

  return (
    <>
      <div style={navBarStyle}>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/users">users</Link>
        <>{user.name} is logged in <button id='logout-button' onClick={handleLogout}>logout</button></>
      </div>

      <h2>Blog App</h2>
      <Notification />
      <Routes>
        <Route path="/" element={<Blogs blogs={blogs}/>} />
        <Route path="/users" element={<Users users={users}/>} />
        <Route path="/users/:id" element={<User userProfile={userProfile} />} />
        <Route path="/blogs/:id" element={<Blog blog={blog} username={user.username} />} />
      </Routes>
    </>
  )
}

export default App