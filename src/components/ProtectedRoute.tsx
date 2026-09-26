import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, initializing } = useSupabaseAuth()

  if (initializing) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
        Checking your session…
      </p>
    )
  }

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  return children
}
