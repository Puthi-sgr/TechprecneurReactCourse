import { Navigate, Route, Routes } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { CatalogPage } from '@/pages/CatalogPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { TodosPage } from '@/pages/TodosPage'
import { UserDetailPage } from '@/pages/UserDetailPage'
import { UsersPage } from '@/pages/UsersPage'

function App() {
  return (
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
                <NavBar />
              </div>
            </header>

            <main className="mt-8">
              <Routes>
                <Route path="/" element={<Navigate to="/todos" replace />} />
                <Route path="/todos" element={<TodosPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
