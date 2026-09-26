import { useEffect, useState } from 'react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { OfflineBanner } from '@/components/OfflineBanner'
import { UpdateToast } from '@/components/UpdateToast'

const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const UserDetailPage = lazy(() => import('@/pages/UserDetailPage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))
const SupabasePages = lazy(() => import('@/pages/SupabasePages'))

function App() {
  const [installEvent, setInstallEvent] = useState<(Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }) | null>(null)

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> })
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const installApp = () => {
    if (!installEvent) return
    void installEvent.prompt().then(() => installEvent.userChoice).finally(() => setInstallEvent(null))
  }

  return (
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <OfflineBanner />
            <UpdateToast />
            {installEvent && <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-xl ring-1 ring-gray-200"><span className="text-sm font-medium">Install Habit Tracker</span><div className="flex gap-3"><button className="text-sm text-gray-600" onClick={() => setInstallEvent(null)}>Later</button><button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" onClick={installApp}>Install</button></div></div>}
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
              <header className="border-b border-gray-200 pb-8">
                <p className="mb-2 text-sm font-medium text-gray-500">Learning log</p>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Course app
                </h1>
                <div className="mt-4">
                  <ErrorBoundary section="Navigation">
                    <NavBar />
                  </ErrorBoundary>
                </div>
              </header>

              <main className="mt-8">
                <Suspense fallback={<p className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600" role="status">Loading page…</p>}>
                <Routes>
                  <Route path="/" element={<Navigate to="/shop" replace />} />
                  <Route path="/shop" element={<ProductsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/:id" element={<UserDetailPage />} />
                  <Route path="/login" element={<SupabasePages />} />
                  <Route path="/signup" element={<SupabasePages />} />
                  <Route path="/tracker" element={<SupabasePages />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                </Suspense>
              </main>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
  )
}

export default App
