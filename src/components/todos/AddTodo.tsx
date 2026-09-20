import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AddTodoProps {
  onAdd: (text: string) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (trimmed.length === 0) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
        aria-label="New todo text"
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition-colors duration-200 focus:border-blue-600 focus:outline-none"
      />
      <Button type="submit">Add</Button>
    </form>
  )
}

export default AddTodo
