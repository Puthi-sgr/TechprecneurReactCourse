import { useRoutes } from 'react-router-dom'
import { SupabaseAuthProvider } from '@/context/SupabaseAuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { TrackerPage } from '@/pages/TrackerPage'

export default function SupabasePages() {
  const pages = useRoutes([
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    {
      path: '/tracker',
      element: <ProtectedRoute><ErrorBoundary section="Habit tracker"><TrackerPage /></ErrorBoundary></ProtectedRoute>,
    },
  ])
  return <SupabaseAuthProvider>{pages}</SupabaseAuthProvider>
}
