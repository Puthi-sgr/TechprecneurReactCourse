import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import type { HabitWithLogs } from '@/types'

interface HabitCardProps {
  habit: HabitWithLogs
  doneToday: boolean
  busy: boolean
  onToggle: (habit: HabitWithLogs) => Promise<void>
  onSaveEdit: (habitId: string, values: { name: string; description: string }) => Promise<void>
  onDelete: (habitId: string) => Promise<void>
}

const inputClass =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none'

export function HabitCard({
  habit,
  doneToday,
  busy,
  onToggle,
  onSaveEdit,
  onDelete,
}: HabitCardProps) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(habit.name)
  const [editDescription, setEditDescription] = useState(habit.description ?? '')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = editName.trim()
    if (trimmedName.length === 0) return
    await onSaveEdit(habit.id, { name: trimmedName, description: editDescription.trim() })
    setEditing(false)
  }

  if (editing) {
    return (
      <form
        onSubmit={handleEditSubmit}
        className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm"
      >
        <h2 className="text-base font-semibold text-gray-900">Edit habit</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor={`edit-name-${habit.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id={`edit-name-${habit.id}`}
              type="text"
              required
              maxLength={80}
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor={`edit-description-${habit.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id={`edit-description-${habit.id}`}
              type="text"
              maxLength={200}
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setEditName(habit.name)
                setEditDescription(habit.description ?? '')
                setEditing(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{habit.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            doneToday
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {doneToday ? 'Done today' : 'Not done today'}
        </span>
      </div>

      <p className="mt-1 min-h-5 text-sm text-gray-500">
        {habit.description ?? 'No description'}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        {habit.daily_logs.length}{' '}
        {habit.daily_logs.length === 1 ? 'log' : 'logs'} · added{' '}
        {new Date(habit.created_at).toLocaleDateString()}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          variant={doneToday ? 'secondary' : 'default'}
          size="sm"
          disabled={busy}
          onClick={() => void onToggle(habit)}
        >
          {busy ? 'Working…' : doneToday ? 'Undo today' : 'Mark done today'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => {
            setConfirmingDelete(false)
            setEditing(true)
          }}
        >
          Edit
        </Button>
        {confirmingDelete ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              disabled={busy}
              onClick={() => void onDelete(habit.id)}
            >
              {busy ? 'Deleting…' : 'Really delete?'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            disabled={busy}
            onClick={() => setConfirmingDelete(true)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
