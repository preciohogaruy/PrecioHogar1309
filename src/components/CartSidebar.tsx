"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

export function CartSidebar() {
  const { items, totalItems, totalPrice, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={closeCart} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-800">Carrito ({totalItems})</h2>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">Agrega algunos productos para comenzar</p>
              <Link href="/productos">
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={closeCart}
                >
                  Ver Productos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/productos/${item.slug}`} onClick={closeCart} className="block">
                      <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-primary transition-colors duration-300">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors duration-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(item.originalPrice * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-center text-sm text-red-600 hover:text-red-700 py-2 transition-colors duration-300"
                >
                  Vaciar carrito
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {/* Checkout Button */}
            <Button className="w-full bg-primary text-primary-foreground py-4 text-lg">
              Proceder al Pago
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Continue Shopping */}
            <Link href="/productos">
              <Button
                variant="outline"
                className="w-full border-orange-200 text-primary hover:bg-orange-50 bg-transparent"
                onClick={closeCart}
              >
                Continuar Comprando
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
