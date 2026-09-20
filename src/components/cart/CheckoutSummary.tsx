import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

export function CheckoutSummary() {
  const { lines, dispatch } = useCart()

  const subtotal = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  )
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const shipping = itemCount > 3 ? 0 : itemCount > 0 ? 4.99 : 0
  const total = subtotal + shipping

  const checkout = () => {
    window.alert(`Order placed! ${itemCount} items for $${total.toFixed(2)}.`)
    lines.forEach((line) =>
      dispatch({ type: 'REMOVE_ITEM', productId: line.productId }),
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        Checkout summary
      </h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Subtotal ({itemCount} items)</dt>
          <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium text-gray-900">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
          <dt className="font-semibold text-gray-900">Total</dt>
          <dd className="font-bold text-gray-900">${total.toFixed(2)}</dd>
        </div>
      </dl>
      <Button className="mt-4 w-full" disabled={itemCount === 0} onClick={checkout}>
        Checkout
      </Button>
    </div>
  )
}

export default CheckoutSummary
