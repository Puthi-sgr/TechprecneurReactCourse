import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/Section'
import type { User } from '@/types'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; users: User[] }

function UserSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading users">
      {[1, 2, 3, 4].map((row) => (
        <div
          key={row}
          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3"
        >
          <div className="size-10 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function UserDirectory() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json() as Promise<User[]>
      })
      .then((users) => {
        if (cancelled) return
        setState(
          users.length === 0
            ? { status: 'empty' }
            : { status: 'success', users },
        )
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to load users.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Section title="User directory">
      {state.status === 'loading' && <UserSkeleton />}
      {state.status === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {state.status === 'empty' && (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No users found.
        </p>
      )}
      {state.status === 'success' && (
        <ul className="space-y-3">
          {state.users.map((user) => (
            <li key={user.id}>
              <Link
                to={`/users/${user.id}`}
                className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-shadow duration-200 hover:shadow-md"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    {user.name}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {user.email} · @{user.username}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

export default UserDirectory
