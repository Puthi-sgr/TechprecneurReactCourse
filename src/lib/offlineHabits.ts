import type { HabitWithLogs } from '@/types'

export interface QueuedHabit {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
}

const DB_NAME = 'habit-tracker-offline'
const STORE_NAME = 'queued-habits'

function openQueueDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withQueueStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openQueueDb()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode)
    const request = action(transaction.objectStore(STORE_NAME))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => db.close()
    transaction.onerror = () => { db.close(); reject(transaction.error) }
  })
}

export async function queueHabit(habit: QueuedHabit) {
  await withQueueStore('readwrite', (store) => store.put(habit))
}

export async function getQueuedHabits(userId: string): Promise<QueuedHabit[]> {
  const rows = await withQueueStore('readonly', (store) => store.getAll()) as QueuedHabit[]
  return rows.filter((row) => row.user_id === userId)
}

export async function removeQueuedHabit(id: string) {
  await withQueueStore('readwrite', (store) => store.delete(id))
}

export type DisplayHabit = Omit<HabitWithLogs, 'created_at'> & { created_at: string; syncPending?: boolean }
