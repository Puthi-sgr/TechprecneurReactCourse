export interface HabitRecord {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  daily_logs?: Array<{ id: string; log_date: string; completed: boolean }>
}

export interface HabitInput {
  name: string
  description: string
}

export function normalizeHabitInput(name: string, description: string): HabitInput {
  const normalizedName = name.trim()
  if (normalizedName.length === 0) throw new Error('Enter a habit name.')
  if (normalizedName.length > 80) throw new Error('Habit names must be 80 characters or fewer.')
  return { name: normalizedName, description: description.trim() }
}

export function getLocalDateString(date = new Date()): string {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`
}
