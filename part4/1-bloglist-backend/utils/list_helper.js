const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sumLikes, blog) => {
    return sumLikes + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((maxLike, blog) => {
    return maxLike.likes > blog.likes ? maxLike : blog
  }, {})
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

const mostBlogs = (blogs) => {
  const blogsCountByAuthor = _.countBy(blogs, 'author')
  const mostBlogAuthor = Object.keys(blogsCountByAuthor).reduce((prev, curr) => {
    return ((!prev) || (blogsCountByAuthor[prev] < blogsCountByAuthor[curr])) ? curr : prev
  }, null)
  return {
    author: mostBlogAuthor,
    blogs: blogsCountByAuthor[mostBlogAuthor]
  }
}

const mostLikes = (blogs) => {
  const blogsGroupByAuthor = _.groupBy(blogs, 'author')
  let mostLikes = 0
  let authorWithMostLikes = ''
  console.log(blogsGroupByAuthor)
  _.forEach(blogsGroupByAuthor, (value, key) => {
    const sumOfLikes = value.map(b => b.likes).reduce((sum, curr) => {
      return sum + curr
    }, 0)
    // console.log(`current author with most likes is ${authorWithMostLikes} with ${mostLikes}`)
    // console.log(`sum of likes for ${key} is ${sumOfLikes}`)
    if (sumOfLikes > mostLikes) {
      mostLikes = sumOfLikes
      authorWithMostLikes = key
    }
  })
  return {
    author: authorWithMostLikes,
    likes: mostLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}