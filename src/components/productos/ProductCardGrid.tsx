
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, Heart, ArrowRight } from "lucide-react"
import type { Product as ProductType, Category } from "@prisma/client"

type Product = ProductType & { category: Category, reviews?: number, originalPrice?: number | null }

interface ProductCardGridProps {
  product: Product
  formatPrice: (price: number) => string
  handleAddToCart: (product: Product) => void
}

export function ProductCardGrid({ product, formatPrice, handleAddToCart }: ProductCardGridProps) {
    const slug = product.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const reviews = product.reviews || Math.floor(Math.random() * 200);
    const isNew = product.badge === "Nuevo";
    const isBestSeller = product.badge === 'Más Vendido';
    const isInStock = product.quantity > 0;
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl shadow-blue-200/50 transition-all duration-500 overflow-hidden">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">NUEVO</span>
          )}
          {isBestSeller && (
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              MÁS VENDIDO
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleAddToCart(product)}
            disabled={!isInStock}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {isInStock ? "Agregar al Carrito" : "Agotado"}
          </Button>
        </div>

        {!isInStock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">AGOTADO</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">{product.category.name}</span>
        </div>

        <Link href={`/productos/${slug}`}>
          <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

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

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <Link href={`/productos/${slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              Ver Detalles
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
