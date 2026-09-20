import type { ProductFormErrors, ProductFormState } from '@/types'

export function validateProduct(form: ProductFormState): ProductFormErrors {
  const errors: ProductFormErrors = {}

  const trimmedName = form.name.trim()
  if (trimmedName.length === 0) {
    errors.name = 'Product name is required.'
  }

  const price = Number(form.price)
  if (form.price.trim() === '' || Number.isNaN(price) || price <= 0) {
    errors.price = 'Price must be a number greater than zero.'
  }

  return errors
}
