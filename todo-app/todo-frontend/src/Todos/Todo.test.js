import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import Todo from './Todo'

describe('Todo Component', () => {
    const mockTodo = {
        id: 1,
        text: 'Test text',
        done: false
    }

    const mockDeleteTodo = jest.fn();
    const mockCompleteTodo = jest.fn();

    const todoComponent = <Todo todo={mockTodo} deleteTodo={mockDeleteTodo} completeTodo={mockCompleteTodo} />


    test('renders content', () => {
        render(todoComponent)

        const element = screen.getByText('Test text')
        expect(element).toBeDefined()
    });

    test('clicking delete button calls deleteTodo', () => {
        const { getByText } = render(todoComponent);

        const deleteButton = getByText('Delete');
        fireEvent.click(deleteButton);

        expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo);
    });

    test('clicking set as done button calls completeTodo', () => {
        const { getByText } = render(todoComponent);

        const setAsDoneButton = getByText('Set as done');
        fireEvent.click(setAsDoneButton);

        expect(mockCompleteTodo).toHaveBeenCalledWith(mockTodo);
    });
});