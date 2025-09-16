
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Package,
  Check,
  MessageCircle,
} from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import type { Product, Category } from "@prisma/client"

type ProductWithCategory = Product & { category: { name: string } };

type ProductDetailViewProps = {
    product: ProductWithCategory;
    relatedProducts: ProductWithCategory[];
}

const getBadgeClass = (badge: string) => {
    switch (badge) {
        case 'Nuevo Ingreso':
            return 'bg-blue-500 text-white';
        case 'Oferta':
            return 'bg-yellow-500 text-black';
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

const sampleReviews = [
  {
    id: 1,
    user: "María González",
    rating: 5,
    date: "2024-01-15",
    comment: "Excelente producto, muy buena calidad y llegó rápido. Lo recomiendo totalmente.",
    verified: true,
  },
  {
    id: 2,
    user: "Carlos Rodríguez",
    rating: 4,
    date: "2024-01-10",
    comment: "Muy buen producto, cumple con las expectativas. El envío fue rápido.",
    verified: true,
  },
  {
    id: 3,
    user: "Ana Martínez",
    rating: 5,
    date: "2024-01-05",
    comment: "Increíble calidad, superó mis expectativas. Definitivamente volvería a comprar.",
    verified: false,
  },
]

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description")

  const { addItem, toggleCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase" && quantity < product.quantity) {
      setQuantity(quantity + 1)
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    const isInStock = product.quantity > 0;
    if (!isInStock) return

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.productId,
        slug: product.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
        name: product.title,
        price: product.price,
        image: product.image || "",
        category: product.category.name,
        inStock: isInStock,
        stockQuantity: product.quantity,
      })
    }

    setQuantity(1)
    toggleCart()
  }

  const productImages = product.image ? [product.image, product.image, product.image, product.image] : [];
  const reviewsCount = Math.floor(Math.random() * 200);

  return (
    <>
      <section className="pt-32 pb-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/productos" className="hover:text-blue-600 transition-colors duration-300">
              Productos
            </Link>
            <span>/</span>
            <span className="text-gray-800">{product.title}</span>
          </nav>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="aspect-square overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  width={600}
                  height={600}
                  priority
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      selectedImage === index ? "border-blue-600 shadow-lg" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} - Vista ${index + 1}`}
                      width={150}
                      height={150}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-blue-600 font-medium uppercase tracking-wide bg-blue-50 px-3 py-1 rounded-full">
                    {product.category.name}
                  </span>
                  {product.badge && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getBadgeClass(product.badge)}`}>
                        {product.badge}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{product.title}</h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({reviewsCount} reseñas)
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-gray-800">{formatPrice(product.price)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {product.quantity > 0 ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-medium">En stock ({product.quantity} disponibles)</span>
                    </>
                  ) : (
                    <span className="text-red-600 font-medium">Agotado</span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-800">Cantidad:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= product.quantity}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!(product.quantity > 0)}
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {product.quantity > 0 ? "Agregar al Carrito" : "Agotado"}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 py-4 bg-transparent"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Favoritos
                  </Button>

                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 py-4 bg-transparent"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                {[
                  { icon: Truck, title: "Envío Gratis", desc: "En compras mayores a $50,000" },
                  { icon: Shield, title: "Garantía", desc: "2 años de garantía oficial" },
                  { icon: RotateCcw, title: "Devoluciones", desc: "30 días para devoluciones" },
                  { icon: CreditCard, title: "Pago Seguro", desc: "Múltiples métodos de pago" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{benefit.title}</div>
                      <div className="text-xs text-gray-600">{benefit.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex border-b border-gray-200 mb-8">
              {[
                { key: "description", label: "Descripción" },
                { key: "specifications", label: "Especificaciones" },
                { key: "reviews", label: `Reseñas (${reviewsCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Descripción del Producto</h3>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">{product.description}</p>

                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Características Principales</h4>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[ "Característica 1", "Característica 2", "Característica 3", "Característica 4", "Característica 5"].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Especificaciones Técnicas</h3>
                  <div className="grid gap-4">
                    {Object.entries({
                        "Especificación 1": "Valor 1",
                        "Especificación 2": "Valor 2",
                        "Especificación 3": "Valor 3",
                      }).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-800">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">SKU: {product.productId}</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Código de producto para referencia en garantías y soporte técnico.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800">Reseñas de Clientes</h3>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Escribir Reseña
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800">{product.rating}</div>
                        <div className="flex items-center justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">{reviewsCount} reseñas</div>
                      </div>

                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-gray-600 w-8">{stars}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {stars === 5 ? 87 : stars === 4 ? 25 : stars === 3 ? 6 : stars === 2 ? 4 : 2}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {sampleReviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-gray-800">{review.user}</span>
                              {review.verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Compra verificada
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Productos Relacionados</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden rounded-t-2xl">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.title}
                      width={300}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{relatedProduct.title}</h3>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(relatedProduct.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">({Math.floor(Math.random() * 200)})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-800">{formatPrice(relatedProduct.price)}</span>

                      <Link href={`/productos/${relatedProduct.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
