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
import { getQueuedHabits, queueHabit, removeQueuedHabit } from '@/lib/offlineHabits'
import type { DisplayHabit } from '@/lib/offlineHabits'
import { ShareButton } from '@/components/ShareButton'

function getTodayDateString() {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function TrackerPage() {
  const { user, signOut } = useSupabaseAuth()
  const [habits, setHabits] = useState<DisplayHabit[]>([])
  const [queuedCount, setQueuedCount] = useState(0)
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
    if (user === null) return
    getQueuedHabits(user.id).then((queued) => {
      setQueuedCount(queued.length)
      setHabits((current) => [
        ...current.filter((habit) => !habit.syncPending),
        ...queued.map((habit) => ({ ...habit, daily_logs: [], syncPending: true })),
      ])
    }).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'Could not read offline habits.'))
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
  }, [loadHabits, user])

  useEffect(() => {
    if (user === null) return
    const syncQueuedHabits = async () => {
      const queued = await getQueuedHabits(user.id).catch(() => [])
      for (const habit of queued) {
        const { error: syncError } = await supabase.from('habits').insert({
          user_id: user.id, name: habit.name, description: habit.description,
        })
        if (syncError !== null) {
          setError(`Could not sync “${habit.name}”: ${syncError.message}`)
          continue
        }
        await removeQueuedHabit(habit.id)
        setHabits((current) => current.filter((row) => row.id !== habit.id))
      }
      const remaining = await getQueuedHabits(user.id).catch(() => [])
      setQueuedCount(remaining.length)
      if (remaining.length === 0) {
        const rows = await loadHabits().catch(() => null)
        if (rows !== null) setHabits(rows)
      }
    }
    window.addEventListener('online', syncQueuedHabits)
    if (navigator.onLine) void syncQueuedHabits()
    return () => window.removeEventListener('online', syncQueuedHabits)
  }, [loadHabits, user])

  const refreshHabits = useCallback(
    (withSpinner: boolean) => {
      if (withSpinner) setLoading(true)
      return loadHabits()
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
    if (!navigator.onLine) {
      const queued = {
        id: crypto.randomUUID(),
        user_id: user.id,
        name: values.name,
        description: values.description || null,
        created_at: new Date().toISOString(),
      }
      try {
        await queueHabit(queued)
        setHabits((current) => [...current, { ...queued, daily_logs: [], syncPending: true }])
        setQueuedCount((count) => count + 1)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Could not queue this habit offline.')
      } finally {
        setSubmitting(false)
      }
      return
    }
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
      await refreshHabits(false)
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
        <div className="flex gap-2"><ShareButton /><Button variant="outline" onClick={() => void handleSignOut()}>Sign out</Button></div>
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
      {queuedCount > 0 && <p role="status" className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">{queuedCount} habit{queuedCount === 1 ? '' : 's'} queued to sync when you’re online.</p>}

      <ErrorBoundary section="Habit list">
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
              <div key={habit.id} className="relative">
                <HabitCard
                  habit={habit}
                  doneToday={habit.daily_logs.some((log) => log.log_date === today && log.completed)}
                  busy={busyHabitId === habit.id}
                  onToggle={toggleToday}
                  onSaveEdit={saveEdit}
                  onDelete={deleteHabit}
                />
                {habit.syncPending && <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">Queued</span>}
            </div>
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
