import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '@/components/Section'
import type { User } from '@/types'

type DetailState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'not-found' }
  | { status: 'success'; user: User }

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetch(`https://jsonplaceholder.typicode.com/users/${id ?? ''}`)
      .then((response) => {
        if (response.status === 404) throw new Error('User not found')
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json() as Promise<User>
      })
      .then((user) => {
        if (cancelled) return
        setState({ status: 'success', user })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to load user.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <Section title={`User ${id ?? ''}`}>
      {state.status === 'loading' && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white px-4 py-6" aria-busy="true">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      )}
      {state.status === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {state.status === 'not-found' && (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No user with this id.
        </p>
      )}
      {state.status === 'success' && (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-6">
          <h3 className="text-xl font-bold text-gray-900">{state.user.name}</h3>
          <p className="mt-1 text-sm text-gray-500">@{state.user.username}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700">Email:</dt>
              <dd className="text-gray-900">{state.user.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700">Phone:</dt>
              <dd className="text-gray-900">{state.user.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700">Website:</dt>
              <dd className="text-gray-900">{state.user.website}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700">Company:</dt>
              <dd className="text-gray-900">{state.user.company.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700">Address:</dt>
              <dd className="text-gray-900">
                {state.user.address.suite}, {state.user.address.street},{' '}
                {state.user.address.city} {state.user.address.zipcode}
              </dd>
            </div>
          </dl>
        </div>
      )}
      <div className="mt-4">
        <Link
          to="/users"
          className="inline-flex h-8 items-center rounded-lg border border-gray-300 bg-white px-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
        >
          ← Back to directory
        </Link>
      </div>
    </Section>
  )
}

export default UserDetailPage
