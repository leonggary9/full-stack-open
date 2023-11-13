import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useNavigate
} from 'react-router-dom'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'
import { useState } from 'react'

const Blog = ({ blog, username }) => {
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(b => b.id !== updatedBlog.id).concat(updatedBlog))
      setSuccessNotification(`updated ${updatedBlog.title} by ${updatedBlog.author}`)
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (deletedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(b => b.id !== deletedBlog.id))
      setSuccessNotification(`deleted ${deletedBlog.title} by ${deletedBlog.author}`)
      navigate('/')
    }
  })

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(b => b.id !== updatedBlog.id).concat(updatedBlog))
      setSuccessNotification('added comment')
    }
  })

  const updateBlog = async (blogToBeUpdated) => {
    updateBlogMutation.mutate(blogToBeUpdated)
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog)
    }
  }

  const addLike = async () => {
    const blogToBeUpdated = {
      ...blog,
      likes: blog.likes + 1
    }
    console.log('adding like', blogToBeUpdated)
    updateBlog(blogToBeUpdated)
  }

  const addComment = async () => {
    setComment('')
    addCommentMutation.mutate({
      blog, comment
    })
  }

  if (!blog) {
    return null
  }

  return (
    <>
      <div className='blog'>
        <h2 className='titleAuthor'>{blog.title}</h2>
        <a href={blog.url} className='url'>{blog.url}</a>
        <div className='likes'>likes {blog.likes}<button className='likeButton' onClick={() => addLike()}>like</button></div>
        <div className='username'>added by {blog.user.name}</div>
        { username === blog.user.username ? <button className='deleteButton' onClick={() => deleteBlog()}>delete</button> : '' }
        <h2>comments</h2>
        <input type="text" value={comment} onChange={event => setComment(event.target.value)}></input>
        <button type="submit" onClick={() => addComment()}>add comment</button>
        <ul>
          {
            blog.comments.map(c => <li key={c.id}>{c.comment}</li>)
          }
        </ul>
      </div>
    </>
  )}

export default Blog