import { useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'bg-gray-900 text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export function NavBar() {
  const { user, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (trimmed.length === 0) return
    signIn(trimmed)
    setEmail('')
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <nav className="flex gap-2" aria-label="Main navigation">
        <NavLink to="/todos" className={navLinkClass}>
          Todos
        </NavLink>
        <NavLink to="/users" className={navLinkClass}>
          Users
        </NavLink>
        <NavLink to="/catalog" className={navLinkClass}>
          Catalog
        </NavLink>
      </nav>

      {user !== null ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Hi, <span className="font-semibold text-gray-900">{user.email}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSignIn} className="flex items-center gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-label="Email for sign in"
            className="h-8 w-48 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
          />
          <Button type="submit" size="sm">
            Sign in
          </Button>
        </form>
      )}
    </div>
  )
}

export default NavBar
