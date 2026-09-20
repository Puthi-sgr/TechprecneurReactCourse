import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'

export interface CheckoutFormValues {
  name: string
  email: string
}

interface CheckoutFormErrors {
  name?: string
  email?: string
}

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => void
}

export function validateCheckoutForm(values: CheckoutFormValues): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {}
  if (values.name.trim().length === 0) {
    errors.name = 'Name is required.'
  }
  if (!values.email.includes('@')) {
    errors.email = 'Enter a valid email address.'
  }
  return errors
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<CheckoutFormErrors>({})

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = { name, email }
    const nextErrors = validateCheckoutForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ name: name.trim(), email: email.trim() })
    setName('')
    setEmail('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6"
      noValidate
    >
      <div className="mb-4">
        <label
          htmlFor="checkout-name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="checkout-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Ada Lovelace"
          aria-invalid={errors.name !== undefined}
          className={`w-full rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 transition-colors duration-200 focus:outline-none ${
            errors.name
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-600'
          }`}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="checkout-email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="ada@example.com"
          aria-invalid={errors.email !== undefined}
          className={`w-full rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 transition-colors duration-200 focus:outline-none ${
            errors.email
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-600'
          }`}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Place order
      </Button>
    </form>
  )
}

export default CheckoutForm
