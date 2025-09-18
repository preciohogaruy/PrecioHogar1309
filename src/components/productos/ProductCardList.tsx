"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, ArrowRight } from "lucide-react"
import type { Product as ProductType, Category } from "@prisma/client"
import { useCart } from "@/contexts/CartContext"

type Product = ProductType & { category: Category, reviews?: number, originalPrice?: number | null }

interface ProductCardListProps {
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

export function ProductCardList({ product }: ProductCardListProps) {
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <div className="aspect-square md:aspect-auto md:h-full overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={300}
              height={300}
              loading="lazy"
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
              <span className="text-xs text-secondary font-medium uppercase tracking-wide">{product.category.name}</span>
            </div>

            <Link href={`/productos/${slug}`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-primary transition-colors duration-300">
                {product.title}
              </h3>
            </Link>

            <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>

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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                className="bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed w-full"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {isInStock ? "Agregar al Carrito" : "Agotado"}
              </Button>

              <Link href={`/productos/${slug}`} className="w-full">
                <Button
                  variant="outline"
                  className="border-orange-200 text-primary hover:bg-orange-50 bg-transparent w-full"
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
