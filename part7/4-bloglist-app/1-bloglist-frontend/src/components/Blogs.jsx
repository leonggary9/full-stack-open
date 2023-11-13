import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Link
} from 'react-router-dom'
import { useUserValue } from '../UserContext'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'
import { useRef } from 'react'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'

const Blogs = ({ blogs }) => {
  const queryClient = useQueryClient()
  const blogFormRef = useRef()
  const user = useUserValue()

  const notificationDispatch = useNotificationDispatch()
  const setSuccessNotification = (payload) => {
    notificationDispatch({
      type: 'SET_SUCCESS',
      payload: payload
    })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, 5000)
  }
  const setErrorNotification = (payload) => {
    notificationDispatch({
      type: 'SET_ERROR',
      payload: payload
    })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, 5000)
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      setSuccessNotification(`${newBlog.title} by ${newBlog.author} added`)
    }
  })

  if (!blogs) {
    return <div>loading blogs...</div>
  }

  // console.log(JSON.stringify(getAllBlogsResult))

  blogs.sort((a, b) => b.likes - a.likes)

  const addBlog = async (newBlog) => {
    console.log('creating blog', newBlog)
    blogFormRef.current.toggleVisibility()
    try {
      newBlogMutation.mutate(newBlog)
    } catch(exception) {
      setErrorNotification('failed to create blog')
    }
  }

  const createBlogForm = () => (
    <Togglable buttonLabel="create new" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const linkStyle = {
    display: 'block',
    width: '100%',
    border: '1px solid #000',
    padding: '5px',
    marginTop: '10px',
  }

  return (
    <div>
      {createBlogForm()}
      {blogs.map(blog =>
        <Link style={linkStyle} key={blog.id} to={`/blogs/${blog.id}`}>{blog.title}</Link>
      )}
    </div>
  )
}

export default Blogs