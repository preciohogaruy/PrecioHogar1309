
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Star } from "lucide-react"

import { getProducts } from "@/lib/products"
import { Button } from "@/components/ui/button"
import type { Product, Category } from "@prisma/client"

type ProductWithCategory = Product & { category: Category }

export async function CtaSection() {
  const { products: productsData } = await getProducts()
  const products = [...productsData, ...productsData] as ProductWithCategory[]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Productos Destacados</h2>
          <p className="section-subtitle">
            Explora una selección de nuestros productos más populares y mejor valorados.
          </p>
        </div>

        <div className="relative w-full overflow-x-auto pb-4">
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className="flex-shrink-0 w-80 mx-4">
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={product.image || ''}
                        alt={product.title}
                        width={300}
                        height={300}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-800">{formatPrice(product.price)}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                    </div>

                    <Link
                      href={`/productos/${product.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")}`}
                      className="mt-4"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        Ver Detalles
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
