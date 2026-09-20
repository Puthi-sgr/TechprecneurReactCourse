import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import type { CartLine } from '@/context/CartContext'

interface CartLineRowProps {
  line: CartLine
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

function CartLineRow({ line, onIncrement, onDecrement, onRemove }: CartLineRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{line.name}</p>
        <p className="text-sm text-gray-500">
          ${(line.price * line.quantity).toFixed(2)} · ${line.price.toFixed(2)} each
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Decrease ${line.name} quantity`}
          onClick={onDecrement}
        >
          −
        </Button>
        <span className="w-8 text-center text-sm font-semibold text-gray-900">
          {line.quantity}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Increase ${line.name} quantity`}
          onClick={onIncrement}
        >
          +
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${line.name} from cart`}
          onClick={onRemove}
        >
          ×
        </Button>
      </div>
    </li>
  )
}

export function CartPanel() {
  const { lines, dispatch } = useCart()

  return (
    <Section title="Cart">
      {lines.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Your cart is empty.
        </p>
      ) : (
        <ul className="space-y-3">
          {lines.map((line) => (
            <CartLineRow
              key={line.productId}
              line={line}
              onIncrement={() =>
                dispatch({
                  type: 'UPDATE_QUANTITY',
                  productId: line.productId,
                  quantity: line.quantity + 1,
                })
              }
              onDecrement={() =>
                dispatch({
                  type: 'UPDATE_QUANTITY',
                  productId: line.productId,
                  quantity: line.quantity - 1,
                })
              }
              onRemove={() =>
                dispatch({ type: 'REMOVE_ITEM', productId: line.productId })
              }
            />
          ))}
        </ul>
      )}
    </Section>
  )
}

export default CartPanel
