export interface Product {
  id: number
  name: string
  price: number
  /** Internal unit cost — must never be rendered in the UI. */
  cost: number
  inStock: boolean
  description?: string
}

/** What the UI is allowed to render: the internal cost field is stripped. */
export type PublicProduct = Omit<Product, 'cost'>

/** Form draft: any subset of the user-editable fields. */
export type ProductDraft = Partial<Pick<Product, 'name' | 'price'>>

export interface ProductFormState {
  name: string
  price: string
}

export interface ProductFormErrors {
  name?: string
  price?: string
}
