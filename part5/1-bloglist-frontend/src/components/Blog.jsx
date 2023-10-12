import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, username }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [blogState, setBlogState] = useState(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = async () => {
    const blogToBeUpdated = {
      ...blogState,
      likes: blogState.likes + 1
    }
    const updatedBlog = await blogService.update(blogToBeUpdated)
    setBlogState(updatedBlog)
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove ${blogState.title} by ${blogState.author}?`)) {
      await blogService.remove(blogState)
      console.log(`deleted ${blogState.title} by ${blogState.author}`)
      setBlogState(null)
    }
  }

  if (!blogState) {
    return null
  }

  const details = (
    <div>
      {blogState.url}<br/>
      likes {blogState.likes}<button onClick={addLike}>like</button><br/>
      {blogState.user.name}<br/>
      { username === blog.user.username ? <button onClick={deleteBlog}>delete</button> : '' }
    </div>
  )

  return (
    <>
      <div style={blogStyle}>
        {blogState.title} - {blogState.author}
        <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'view'}</button>
        { showDetails ? details : ''}
      </div>
    </>
  )}

export default Blog