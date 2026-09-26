import { Navigate, Route, Routes } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { SupabaseAuthProvider } from '@/context/SupabaseAuthProvider'
import { ProductsPage } from '@/pages/ProductsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { UserDetailPage } from '@/pages/UserDetailPage'
import { UsersPage } from '@/pages/UsersPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { TrackerPage } from '@/pages/TrackerPage'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  return (
    <SupabaseAuthProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900">
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
                <Routes>
                  <Route path="/" element={<Navigate to="/shop" replace />} />
                  <Route path="/shop" element={<ProductsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/:id" element={<UserDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/tracker"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary section="Habit tracker">
                          <TrackerPage />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </SupabaseAuthProvider>
  )
}

export default App
