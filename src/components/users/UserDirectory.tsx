import { Link } from 'react-router-dom'
import { Section } from '@/components/Section'
import { useFetch } from '@/hooks/useFetch'
import type { User } from '@/types'

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
  const { data: users, loading, error } = useFetch<User[]>(
    'https://jsonplaceholder.typicode.com/users',
  )

  return (
    <Section title="User directory">
      {loading && <UserSkeleton />}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && users !== null && users.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No users found.
        </p>
      )}
      {/* data is T | null — the `users !== null` guard is what lets .map() typecheck */}
      {users !== null && users.length > 0 && (
        <ul className="space-y-3">
          {users.map((user) => (
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
