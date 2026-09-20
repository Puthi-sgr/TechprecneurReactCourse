import { useState } from 'react'
import { ProductCard } from './components/ProductCard'
import { ProductForm } from './components/ProductForm'
import { Section } from './components/Section'
import type { Product, ProductDraft } from './types'

const initialProducts: Product[] = [
  { id: 1, name: 'Mechanical keyboard', price: 89, inStock: true },
  { id: 2, name: 'USB-C hub', price: 42.5, inStock: true },
  { id: 3, name: 'HDMI cable (2m)', price: 9.99, inStock: false },
  { id: 4, name: 'Laptop stand', price: 34, inStock: true },
]

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [inStockOnly, setInStockOnly] = useState(false)

  const visibleProducts = inStockOnly
    ? products.filter((product) => product.inStock)
    : products
  const soldOutCount = products.filter((product) => !product.inStock).length

  const addProduct = (draft: ProductDraft) => {
    const nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1
    setProducts([...products, { id: nextId, ...draft, inStock: true }])
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <header className="border-b border-gray-200 pb-8">
          <p className="mb-2 text-sm font-medium text-gray-500">Learning log</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Product catalog
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              {visibleProducts.length} products
            </span>
          </div>
          {soldOutCount > 0 && (
            <p className="mt-4 inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
              {soldOutCount} {soldOutCount === 1 ? 'product' : 'products'} sold out
            </p>
          )}
        </header>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <main className="md:col-span-2">
            <Section title="Catalog">
              <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setInStockOnly(event.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />
                In stock only
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Section>
          </main>

          <aside>
            <Section title="Add product">
              <ProductForm onSubmit={addProduct} />
            </Section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default App
