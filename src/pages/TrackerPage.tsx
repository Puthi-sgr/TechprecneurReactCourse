import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddHabitForm } from '@/components/habits/AddHabitForm'
import { HabitCard } from '@/components/habits/HabitCard'
import { SupabaseSetupNotice } from '@/components/SupabaseSetupNotice'
import { AvatarUpload } from '@/components/habits/AvatarUpload'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { HabitWithLogs } from '@/types'

function getTodayDateString() {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function TrackerPage() {
  const { user, signOut } = useSupabaseAuth()
  const [habits, setHabits] = useState<HabitWithLogs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [busyHabitId, setBusyHabitId] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user === null) {
      setAvatarUrl(null)
      return
    }
    let active = true
    supabase.from('profiles').select('avatar_url').eq('id', user.id).maybeSingle()
      .then(({ data, error: profileError }) => {
        if (!active) return
        if (profileError !== null) {
          console.error('Could not load the profile avatar.', profileError)
          return
        }
        setAvatarUrl(data?.avatar_url ?? null)
      })
    return () => { active = false }
  }, [user])

  const loadHabits = useCallback(async (): Promise<HabitWithLogs[]> => {
    if (user === null) return []
    const { data, error: fetchError } = await supabase
      .from('habits')
      .select('*, daily_logs ( id, log_date, completed )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    if (fetchError !== null) throw new Error(fetchError.message)
    return data ?? []
  }, [user])

  useEffect(() => {
    loadHabits()
      .then((rows) => {
        setHabits(rows)
        setError(null)
        setLoading(false)
      })
      .catch((caught) => {
        setError(caught instanceof Error ? caught.message : 'Could not load your habits.')
        setLoading(false)
      })
  }, [loadHabits])

  const refreshHabits = useCallback(
    (withSpinner: boolean) => {
      if (withSpinner) setLoading(true)
      loadHabits()
        .then((rows) => {
          setHabits(rows)
          setError(null)
        })
        .catch((caught) => {
          setError(caught instanceof Error ? caught.message : 'Could not load your habits.')
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [loadHabits],
  )

  const addHabit = async (values: { name: string; description: string }) => {
    if (user === null) return
    setSubmitting(true)
    setError(null)
    try {
      const { error: insertError } = await supabase
        .from('habits')
        .insert({
          name: values.name,
          description: values.description.length > 0 ? values.description : null,
          user_id: user.id,
        })
        .select('id')
        .single()
      if (insertError !== null) throw new Error(insertError.message)
      refreshHabits(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not add the habit.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleToday = async (habit: HabitWithLogs) => {
    if (user === null) return
    setBusyHabitId(habit.id)
    setError(null)
    try {
      const today = getTodayDateString()
      const existingLog = habit.daily_logs.find((log) => log.log_date === today)
      const { error: upsertError } = await supabase
        .from('daily_logs')
        .upsert(
          {
            habit_id: habit.id,
            user_id: user.id,
            log_date: today,
            completed: !(existingLog?.completed ?? false),
          },
          { onConflict: 'habit_id,log_date' },
        )
        .select('id')
        .single()
      if (upsertError !== null) throw new Error(upsertError.message)
      refreshHabits(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update the log.')
    } finally {
      setBusyHabitId(null)
    }
  }

  const saveEdit = async (
    habitId: string,
    values: { name: string; description: string },
  ) => {
    if (user === null) return
    setBusyHabitId(habitId)
    setError(null)
    try {
      const { error: updateError } = await supabase
        .from('habits')
        .update({
          name: values.name,
          description: values.description.length > 0 ? values.description : null,
        })
        .eq('id', habitId)
        .eq('user_id', user.id)
      if (updateError !== null) throw new Error(updateError.message)
      refreshHabits(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save the habit.')
    } finally {
      setBusyHabitId(null)
    }
  }

  const deleteHabit = async (habitId: string) => {
    if (user === null) return
    setBusyHabitId(habitId)
    setError(null)
    try {
      const { error: deleteError } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user.id)
      if (deleteError !== null) throw new Error(deleteError.message)
      setHabits((previous) => previous.filter((habit) => habit.id !== habitId))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete the habit.')
    } finally {
      setBusyHabitId(null)
    }
  }

  const handleSignOut = async () => {
    setError(null)
    try {
      await signOut()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not sign out.')
    }
  }

  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />
  }

  const today = getTodayDateString()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Habit tracker</h1>
          <p className="mt-1 text-sm text-gray-500">
            Signed in as <span className="font-semibold text-gray-700">{user?.email}</span>
          </p>
        </div>
        <Button variant="outline" onClick={() => void handleSignOut()}>
          Sign out
        </Button>
      </div>

      {user !== null && (
        <AvatarUpload userId={user.id} initialAvatarUrl={avatarUrl} onSaved={setAvatarUrl} />
      )}

      {error !== null && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => refreshHabits(true)}>
            Retry
          </Button>
        </div>
      )}

      <AddHabitForm submitting={submitting} onSubmit={addHabit} />

      <ErrorBoundary section="Habit list">
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-busy="true">
          {[1, 2, 3, 4].map((card) => (
            <div
              key={card}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-3 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="mb-4 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : habits.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          No habits yet — add your first one above.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              doneToday={habit.daily_logs.some(
                (log) => log.log_date === today && log.completed,
              )}
              busy={busyHabitId === habit.id}
              onToggle={toggleToday}
              onSaveEdit={saveEdit}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}
      </ErrorBoundary>

      <ErrorBoundary section="Habit stats">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="Habit stats">
          <p className="text-sm font-medium text-gray-500">Your habits</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{habits.length}</p>
          <p className="text-sm text-gray-500">{habits.filter((habit) => habit.daily_logs.some((log) => log.log_date === today && log.completed)).length} completed today</p>
        </section>
      </ErrorBoundary>
    </div>
  )
}

export default TrackerPage
