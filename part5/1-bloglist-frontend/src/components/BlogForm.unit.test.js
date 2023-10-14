import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container

  const mockCreate = jest.fn()

  const blogToCreate = {
    title: 'test title',
    author: 'test author',
    url: 'test url'
  }

  beforeEach(() => {
    container = render(<BlogForm createBlog={mockCreate}/>).container
  })

  test('createBlog event handler is called when new blog is created', async () => {
    const user = userEvent.setup()
    const titleInput = container.querySelector('.titleInput')
    const authorInput = container.querySelector('.authorInput')
    const urlInput = container.querySelector('.urlInput')

    await user.type(titleInput, blogToCreate.title)
    await user.type(authorInput, blogToCreate.author)
    await user.type(urlInput, blogToCreate.url)

    const submitFormButton = container.querySelector('.submitFormButton')
    await user.click(submitFormButton)

    expect(mockCreate.mock.calls).toHaveLength(1)
    // console.log(mockCreate.mock.calls[0][0])
    expect(mockCreate.mock.calls[0][0]).toStrictEqual(blogToCreate)
  })
})