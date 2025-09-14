
"use client"

import { useState, useEffect } from "react"
import { Grid3X3, List, Search, Package, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import productsData from "@/contexts/productos.json"
import { ProductCardGrid } from "./ProductCardGrid"
import { ProductCardList } from "./ProductCardList"
import { ProductHero } from "./ProductHero"
import { Button } from "@/components/ui/button"

type Product = {
  id: string
  slug: string
  name: string
  category: string
  price: number
  originalPrice: number | null
  image: string
  rating: number
  reviews: number
  isNew: boolean
  isBestSeller: boolean
  description: string
  inStock: boolean
  stockQuantity: number
}

const initialProducts: Product[] = productsData.products.map((p) => ({
  id: p.id,
  slug: p.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
  name: p.title,
  category: p.category,
  price: p.price,
  originalPrice: null,
  image: p.image,
  rating: p.rating,
  reviews: 0,
  isNew: p.badge === "Nuevo",
  isBestSeller: p.badge === "Más Vendido",
  description: p.description,
  inStock: p.quantity > 0,
  stockQuantity: p.quantity,
}))

const categories = ["Todos", ...Array.from(new Set(productsData.products.map((p) => p.category)))]

const PRODUCTS_PER_PAGE = 12

export function ProductView() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(initialProducts)
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)

  const { addItem } = useCart()

  useEffect(() => {
    const updatedProducts = initialProducts.map((p) => ({
      ...p,
      reviews: Math.floor(Math.random() * 200),
    }))
    setProducts(updatedProducts)
  }, [])

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE)
  }, [selectedCategory, searchTerm])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const productsToShow = filteredProducts.slice(0, visibleCount)

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + PRODUCTS_PER_PAGE)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
    })
  }

  return (
    <>
      <ProductHero />
      <section className="py-16 bg-gray-50 -mt-8 rounded-t-3xl relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-white text-gray-600 hover:bg-blue-50 border border-blue-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-600">
              Mostrando {productsToShow.length} de {filteredProducts.length} productos
              {selectedCategory !== "Todos" && ` en ${selectedCategory}`}
            </p>
          </div>

          {productsToShow.length > 0 && viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productsToShow.map((product) => (
                <ProductCardGrid
                  key={product.id}
                  product={product}
                  formatPrice={formatPrice}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : productsToShow.length > 0 && viewMode === "list" ? (
            <div className="space-y-6">
              {productsToShow.map((product) => (
                <ProductCardList
                  key={product.id}
                  product={product}
                  formatPrice={formatPrice}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda o categorías.</p>
            </div>
          )}

          {visibleCount < filteredProducts.length && (
            <div className="mt-12 text-center">
              <Button onClick={handleLoadMore} className="btn-primary">
                <Loader2 className="w-4 h-4 mr-2 animate-spin-slow" />
                Cargar más productos
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
