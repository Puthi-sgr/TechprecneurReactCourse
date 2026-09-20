import type { Todo } from '@/types'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: number) => void
}

export function TodoList({ todos, onToggle }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
        Nothing here yet.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center gap-3 px-4 py-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label={`Toggle "${todo.text}"`}
            className="h-4 w-4 cursor-pointer accent-blue-600"
          />
          <span
            className={`text-sm transition-colors duration-200 ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}
          >
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default TodoList
