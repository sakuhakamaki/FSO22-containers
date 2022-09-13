import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

describe('Testing <Todo />', () => {
  const testTodo = {
    text: 'Testing Todo-component!',
    done: false,
  }

  test('Component renders right content and works as intended', async () => {
    const onClickDelete = jest.fn()
    const onClickComplete = jest.fn()

    render(
      <Todo
          todo={testTodo}
          onClickDelete={onClickDelete}
          onClickComplete={onClickComplete}
        />
    )
    
    const textLabel = screen.getByText('Testing Todo-component!')
    const stateLabel = screen.getByText('This todo is not done')
    const deleteButton = screen.getByText('Delete')
    const stateButton = screen.getByText('Set as done')

    expect(textLabel).toBeDefined()
    expect(stateLabel).toBeDefined()
    expect(deleteButton).toBeDefined()
    expect(stateButton).toBeDefined()
  })
})
