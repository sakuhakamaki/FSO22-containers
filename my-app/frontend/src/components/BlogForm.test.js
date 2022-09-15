import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('Testing <BlogForm />', () => {
  const testBlog = {
    title: 'Testing blog.',
    author: 'Mr. Blogtester',
    url: 'https://blogtester.com/testing'
  }

  test('Eventhandler is called with right information when creating new blog.', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('Example title')
    const authorInput = screen.getByPlaceholderText('Example author')
    const urlInput = screen.getByPlaceholderText('Example Url')

    await user.type(titleInput, 'Testing blog.')
    await user.type(authorInput, 'Mr. Blogtester')
    await user.type(urlInput, 'https://blogtester.com/testing')

    const createButton = screen.getByText('Create')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(testBlog)
  })
})