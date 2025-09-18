"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, Heart, ArrowRight } from "lucide-react"
import type { Product as ProductType, Category } from "@prisma/client"
import { useCart } from "@/contexts/CartContext"

type Product = ProductType & { category: Category, reviews?: number, originalPrice?: number | null }

interface ProductCardGridProps {
  product: Product
}

const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'Nuevo Ingreso':
        return 'bg-accent text-accent-foreground';
      case 'Oferta':
        return 'bg-yellow-500 text-white';
      case 'Más Vendido':
        return 'bg-green-500 text-white';
      case 'Liquidación':
        return 'bg-red-500 text-white';
      case 'Exclusivo Online':
        return 'bg-secondary text-secondary-foreground';
      case 'Pocas Unidades':
        return 'bg-primary text-primary-foreground';
      default:
        return 'hidden';
    }
  };

export function ProductCardGrid({ product }: ProductCardGridProps) {
    const slug = product.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const reviews = product.reviews || Math.floor(Math.random() * 200);
    const isInStock = product.quantity > 0;
    const { addItem } = useCart()

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
      }).format(price)
    }

    const handleAddToCart = () => {
      if (!isInStock) return
      addItem({
        id: product.productId,
        slug: slug,
        name: product.title,
        price: product.price,
        image: product.image || '',
        category: product.category.name,
        inStock: isInStock,
        stockQuantity: product.quantity,
      })
    }

  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl shadow-orange-200/50 transition-all duration-500 overflow-hidden">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            width={400}
            height={400}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getBadgeClass(product.badge)}`}>
                {product.badge}
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
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-orange-500 hover:to-yellow-400 text-primary-foreground rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
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
          <span className="text-xs text-secondary font-medium uppercase tracking-wide">{product.category.name}</span>
        </div>

        <Link href={`/productos/${slug}`}>
          <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
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
              className="border-orange-200 text-primary hover:bg-orange-50 bg-transparent"
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
