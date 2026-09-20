import { useState } from 'react'
import { CartPanel } from '@/components/cart/CartPanel'
import { CheckoutSummary } from '@/components/cart/CheckoutSummary'
import { CheckoutForm } from '@/components/CheckoutForm'
import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import type { ShopProduct } from '@/types'

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-busy="true">
      {[1, 2, 3, 4].map((card) => (
        <div
          key={card}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="mb-3 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}

interface ProductRowProps {
  product: ShopProduct
  onAdd: () => void
}

function ProductRow({ product, onAdd }: ProductRowProps) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow duration-200 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {product.category}
      </p>
      <h3 className="mt-1 text-sm font-semibold text-gray-900">{product.title}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {product.description.length > 90
          ? `${product.description.slice(0, 90)}…`
          : product.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </span>
        <Button variant="outline" size="sm" onClick={onAdd}>
          Add to cart
        </Button>
      </div>
    </div>
  )
}

export function ProductsPage() {
  const { data: products, loading, error } = useFetch<ShopProduct[]>(
    'https://fakestoreapi.com/products?limit=8',
  )
  const { dispatch } = useCart()

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  const filteredProducts =
    products === null
      ? null
      : products.filter((product) =>
          product.title
            .toLowerCase()
            .includes(debouncedQuery.trim().toLowerCase()),
        )

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <main className="md:col-span-2">
        <Section title="Shop">
          <div className="mb-4 space-y-2">
            <label
              htmlFor="product-search"
              className="block text-sm font-medium text-gray-700"
            >
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to filter…"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
            />
            <div className="flex gap-4 text-xs text-gray-500">
              <span>
                Raw:{' '}
                <span className="font-semibold text-gray-900">
                  {query === '' ? '—' : query}
                </span>
              </span>
              <span>
                Debounced:{' '}
                <span className="font-semibold text-blue-700">
                  {debouncedQuery === '' ? '—' : debouncedQuery}
                </span>
              </span>
            </div>
          </div>

          {loading && <ProductSkeleton />}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && filteredProducts !== null && filteredProducts.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
              No products found.
            </p>
          )}
          {filteredProducts !== null && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onAdd={() =>
                    dispatch({
                      type: 'ADD_ITEM',
                      productId: product.id,
                      name: product.title,
                      price: product.price,
                    })
                  }
                />
              ))}
            </div>
          )}
        </Section>
      </main>

      <aside>
        <CartPanel />
        <div className="mt-4">
          <CheckoutSummary />
        </div>
        <div className="mt-4">
          <CheckoutForm
            onSubmit={() => window.alert('Order placed — thank you!')}
          />
        </div>
      </aside>
    </div>
  )
}

export default ProductsPage
