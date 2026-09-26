import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SupabaseSetupNotice } from '@/components/SupabaseSetupNotice'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { isSupabaseConfigured } from '@/lib/supabase'

const inputClass =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none'

export function SignupPage() {
  const { signUp } = useSupabaseAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setNotice(null)
    try {
      const { needsConfirmation } = await signUp(email.trim(), password)
      if (needsConfirmation) {
        setNotice(
          'Account created! Check your inbox for a confirmation email, then sign in.',
        )
      } else {
        navigate('/tracker', { replace: true })
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign up failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create account</h1>
      <p className="mt-1 text-sm text-gray-500">
        One account, your own private habit list.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </div>

        {error !== null && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {notice !== null && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{notice}</p>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignupPage
