import type { ProductFormErrors, ProductFormState } from '@/types'

export function validateProduct(form: ProductFormState): ProductFormErrors {
  const errors: ProductFormErrors = {}

  const trimmedName = form.name?.trim() ?? ''
  if (trimmedName.length === 0) {
    errors.name = 'Product name is required.'
  }

  const priceText = form.price?.trim() ?? ''
  const price = Number(priceText)
  if (priceText === '' || Number.isNaN(price) || price <= 0) {
    errors.price = 'Price must be a number greater than zero.'
  }

  return errors
}
