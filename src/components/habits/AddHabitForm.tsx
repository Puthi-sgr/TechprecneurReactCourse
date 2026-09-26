import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'

interface AddHabitFormProps {
  submitting: boolean
  onSubmit: (values: { name: string; description: string }) => Promise<void>
}

const inputClass =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none'

export function AddHabitForm({ submitting, onSubmit }: AddHabitFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (trimmedName.length === 0) return
    await onSubmit({ name: trimmedName, description: description.trim() })
    setName('')
    setDescription('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-gray-900">Add a habit</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="habit-name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Read 20 minutes"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="habit-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="habit-description"
            type="text"
            maxLength={200}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Any book counts"
            className={inputClass}
          />
        </div>
        <Button type="submit" disabled={submitting} className="h-10">
          {submitting ? 'Adding…' : 'Add habit'}
        </Button>
      </div>
    </form>
  )
}
