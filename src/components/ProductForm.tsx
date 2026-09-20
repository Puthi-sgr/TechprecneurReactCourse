import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { validateProduct } from '@/lib/validateProduct'
import type { ProductDraft, ProductFormErrors, ProductFormState } from '@/types'

const emptyForm: ProductFormState = { name: '', price: '' }

interface ProductFormProps {
  onSubmit: (draft: ProductDraft) => void
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [errors, setErrors] = useState<ProductFormErrors>({})

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, name: event.target.value }))
  }

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, price: event.target.value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateProduct(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ name: form.name.trim(), price: Number(form.price) })
    setForm(emptyForm)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4">
        <label
          htmlFor="product-name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="product-name"
          type="text"
          value={form.name}
          onChange={handleNameChange}
          placeholder="Mechanical keyboard"
          className={`w-full rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 transition-colors duration-200 focus:outline-none ${
            errors.name
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-600'
          }`}
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="mb-6">
        <label
          htmlFor="product-price"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          id="product-price"
          type="text"
          inputMode="decimal"
          value={form.price}
          onChange={handlePriceChange}
          placeholder="49.99"
          className={`w-full rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 transition-colors duration-200 focus:outline-none ${
            errors.price
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-600'
          }`}
        />
        {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
      </div>

      <Button type="submit" className="w-full">
        Add product
      </Button>
    </form>
  )
}

export default ProductForm
