import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  let container

  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'www.testurl.com',
    likes: 20,
    user: {
      username: 'test username',
      name: 'name',
      id: '1'
    }
  }
  const username = 'test username'
  const mockUpdate = jest.fn()
  const mockDelete = jest.fn()

  beforeEach(() => {
    container = render(<Blog
      blog={blog}
      username={username}
      updateBlog={mockUpdate}
      deleteBlog={mockDelete}
    />).container
  })

  test('renders title and author but not url and likes', () => {
    const titleAndAuthor = container.querySelector('.titleAuthor')
    expect(titleAndAuthor).toHaveTextContent(`${blog.title} - ${blog.author}`)

    const url = container.querySelector('.url')
    expect(url).toBeNull()
    const likes = container.querySelector('.likes')
    expect(likes).toBeNull()
  })

  test('url and likes are shown when show details button is clicked', async () => {
    const user = userEvent.setup()
    const showDetailsButton = container.querySelector('.showDetailsButton')
    await user.click(showDetailsButton)

    const url = container.querySelector('.url')
    expect(url).toHaveTextContent(blog.url)
    const likes = container.querySelector('.likes')
    expect(likes).toHaveTextContent(blog.likes)
  })

  test('when like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const showDetailsButton = container.querySelector('.showDetailsButton')
    await user.click(showDetailsButton)
    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdate.mock.calls).toHaveLength(2)
    // console.log(mockUpdate.mock)
    // expect(mockUpdate.mock.calls[0][0]).toStrictEqual({
    //   ...blog,
    //   likes: blog.likes+1
    // })
    // expect(mockUpdate.mock.calls[0][1]).toStrictEqual({
    //   ...blog,
    //   likes: blog.likes+1
    // })
  })
})

