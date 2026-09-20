import { useState } from 'react'
import { AddTodo } from './AddTodo'
import { FilterBar } from './FilterBar'
import { TodoList } from './TodoList'
import { Section } from '@/components/Section'
import type { Todo, TodoFilter } from '@/types'

const initialTodos: Todo[] = [
  { id: 1, text: 'Wire up the router', completed: true },
  { id: 2, text: 'Add the live clock effect', completed: true },
  { id: 3, text: 'Hunt three bugs', completed: false },
]

export function TodoApp() {
  // Shared state lives HERE only — children get props down, callbacks up.
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [filter, setFilter] = useState<TodoFilter>('all')

  const visibleTodos =
    filter === 'all'
      ? todos
      : todos.filter((todo) =>
          filter === 'completed' ? todo.completed : !todo.completed,
        )
  const remainingCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - remainingCount

  const addTodo = (text: string) => {
    const nextId = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
    setTodos([...todos, { id: nextId, text, completed: false }])
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  return (
    <Section title="Todos">
      <AddTodo onAdd={addTodo} />
      <TodoList todos={visibleTodos} onToggle={toggleTodo} />
      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        remainingCount={remainingCount}
        completedCount={completedCount}
        onClearCompleted={clearCompleted}
      />
    </Section>
  )
}

export default TodoApp
