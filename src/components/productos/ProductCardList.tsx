
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, ArrowRight } from "lucide-react"
import type { Product as ProductType, Category } from "@prisma/client"

type Product = ProductType & { category: Category, reviews?: number, originalPrice?: number | null }

interface ProductCardListProps {
  product: Product
  formatPrice: (price: number) => string
  handleAddToCart: (product: Product) => void
}

const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'Nuevo Ingreso':
        return 'bg-blue-500 text-white';
      case 'Oferta':
        return 'bg-yellow-500 text-white';
      case 'Más Vendido':
        return 'bg-green-500 text-white';
      case 'Liquidación':
        return 'bg-red-500 text-white';
      case 'Exclusivo Online':
        return 'bg-purple-500 text-white';
      case 'Pocas Unidades':
        return 'bg-orange-500 text-white';
      default:
        return 'hidden';
    }
  };

export function ProductCardList({ product, formatPrice, handleAddToCart }: ProductCardListProps) {
    const slug = product.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const reviews = product.reviews || Math.floor(Math.random() * 200);
    const isInStock = product.quantity > 0;
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <div className="aspect-square md:aspect-auto md:h-full overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && (
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getBadgeClass(product.badge)}`}>
                    {product.badge}
                </span>
            )}
          </div>

          {!isInStock && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">AGOTADO</span>
            </div>
          )}
        </div>

        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">{product.category.name}</span>
            </div>

            <Link href={`/productos/${slug}`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-300">
                {product.title}
              </h3>
            </Link>

            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({reviews})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleAddToCart(product)}
                disabled={!isInStock}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {isInStock ? "Agregar al Carrito" : "Agotado"}
              </Button>

              <Link href={`/productos/${slug}`}>
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  Ver Detalles
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
