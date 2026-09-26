import { useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-base font-semibold transition-colors duration-200 ${
    isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 hover:text-gray-900'
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
        <NavLink to="/shop" className={navLinkClass}>
          Shop
        </NavLink>
        <NavLink to="/users" className={navLinkClass}>
          Users
        </NavLink>
        <NavLink to="/tracker" className={navLinkClass}>
          Habit Tracker
        </NavLink>
      </nav>

      {user !== null ? (
        <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-2 ring-1 ring-green-200">
          <span className="flex size-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            {user.email.slice(0, 1).toUpperCase()}
          </span>
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
            className="h-9 w-52 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none"
          />
          <Button type="submit" className="shadow-sm">
            Sign in
          </Button>
        </form>
      )}
    </div>
  )
}

export default NavBar
