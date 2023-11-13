import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'

const Blog = ({ blog, username }) => {
  const queryClient = useQueryClient()

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
    }
  })

  const updateBlog = async (blogToUpdate) => {
    updateBlogMutation.mutate(blogToUpdate)
  }

  const deleteBlog = async (blogToDelete) => {
    if (window.confirm(`Remove ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      deleteBlogMutation.mutate(blogToDelete)
    }
  }

  const addLike = async (blog) => {
    const blogToBeUpdated = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(blogToBeUpdated)
  }

  if (!blog) {
    return null
  }

  return (
    <>
      <div className='blog'>
        <h2 className='titleAuthor'>{blog.title}</h2>
        <a href={blog.url} className='url'>{blog.url}</a>
        <div className='likes'>likes {blog.likes}<button className='likeButton' onClick={() => addLike(blog)}>like</button></div>
        <div className='username'>added by {blog.user.name}</div>
        { username === blog.user.username ? <button className='deleteButton' onClick={() => deleteBlog(blog)}>delete</button> : '' }
      </div>
    </>
  )}

export default Blog