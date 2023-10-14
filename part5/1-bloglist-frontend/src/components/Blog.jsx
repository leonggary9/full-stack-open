import { useState } from 'react'

const Blog = ({ blog, username, updateBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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

  const details = (
    <div>
      <div className='url'>{blog.url}</div>
      <div className='likes'>likes {blog.likes}<button className='likeButton' onClick={() => addLike(blog)}>like</button></div>
      <div className='username'>{blog.user.name}</div>
      { username === blog.user.username ? <button onClick={() => deleteBlog(blog)}>delete</button> : '' }
    </div>
  )

  return (
    <>
      <div style={blogStyle}>
        <div className='titleAuthor'>{blog.title} - {blog.author}</div>
        <button className='showDetailsButton' onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'view'}</button>
        { showDetails ? details : ''}
      </div>
    </>
  )}

export default Blog