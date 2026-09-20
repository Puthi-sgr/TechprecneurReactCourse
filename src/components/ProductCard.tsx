import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import type { PublicProduct } from '@/types'

interface ProductCardProps {
  product: PublicProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      productId: product.id,
      name: product.name,
      price: product.price,
    })
  }

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-4">
          <CardTitle className="text-gray-900">{product.name}</CardTitle>
          <Badge
            className={
              product.inStock
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
            }
          >
            {product.inStock ? 'In stock' : 'Sold out'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {product.description ?? 'No description yet.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={addToCart}
          disabled={!product.inStock}
        >
          Add to cart
        </Button>
      </CardContent>
    </Card>
  )
}

export default ProductCard
