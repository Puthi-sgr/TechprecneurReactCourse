import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
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
      </CardContent>
    </Card>
  )
}

export default ProductCard
