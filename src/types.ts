export interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
}

export interface ProductDraft {
  name: string
  price: number
}

export interface ProductFormState {
  name: string
  price: string
}

export interface ProductFormErrors {
  name?: string
  price?: string
}
