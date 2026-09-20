import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-16 text-center">
      <p className="text-5xl font-bold text-gray-300">404</p>
      <p className="mt-3 text-sm text-gray-600">
        That page doesn't exist.
      </p>
      <Link
        to="/todos"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to todos
      </Link>
    </div>
  )
}

export default NotFoundPage
