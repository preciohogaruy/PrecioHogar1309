
"use client"

import type React from "react"
import { useState } from "react"

import { useCart } from "@/contexts/CartContext"
import productsData from "@/contexts/productos.json"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Notification } from "@/components/admin/Notification"
import { ProductControls } from "@/components/admin/ProductControls"
import { ProductTable } from "@/components/admin/ProductTable"
import { ProductModal } from "@/components/admin/ProductModal"

// Initial products data from JSON file
const initialProducts = productsData.products.map((p, index) => ({
  id: p.id,
  slug: p.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
  name: p.title,
  category: p.category,
  price: p.price,
  originalPrice: null, // JSON doesn't have originalPrice
  image: p.image,
  rating: p.rating,
  reviews: (p.id.charCodeAt(0) % 50) + 10, // Consistent random-like number
  isNew: p.badge === 'Nuevo',
  isBestSeller: p.badge === 'Más Vendido',
  description: p.description,
  inStock: p.quantity > 0,
  stockQuantity: p.quantity,
  isActive: true,
}))

const categories = ["Todos", ...Array.from(new Set(productsData.products.map((p) => p.category)))]

export type Product = (typeof initialProducts)[0]
export type NotificationType = { type: "success" | "error"; message: string }

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [showInactive, setShowInactive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [notification, setNotification] = useState<NotificationType | null>(null)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    const matchesStatus = showInactive || product.isActive
    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleAddProduct = (formData: any) => {
    const newProduct = {
      ...formData,
      id: `NEW-${Math.random().toString(36).substr(2, 9)}`,
      slug: generateSlug(formData.name),
      rating: 4.5,
      reviews: 0,
      isActive: true,
    }
    setProducts([...products, newProduct])
    showNotification("success", "Producto agregado exitosamente")
    closeModal()
  }

  const handleUpdateProduct = (formData: any) => {
    if (!editingProduct) return
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...formData,
              slug: generateSlug(formData.name),
            }
          : p,
      ),
    )
    showNotification("success", "Producto actualizado exitosamente")
    closeModal()
  }

  const openModal = (product?: Product) => {
    setEditingProduct(product || null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const toggleProductStatus = (id: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
    const product = products.find((p) => p.id === id)
    showNotification("success", `Producto ${product?.isActive ? "desactivado" : "activado"} exitosamente`)
  }

  const deleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id))
      showNotification("success", "Producto eliminado exitosamente")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <Notification notification={notification} />

      <main className="container mx-auto px-6 py-8">
        <ProductControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          openModal={openModal}
        />

        <ProductTable
          products={filteredProducts}
          formatPrice={formatPrice}
          openModal={openModal}
          toggleProductStatus={toggleProductStatus}
          deleteProduct={deleteProduct}
        />
      </main>

      <ProductModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        editingProduct={editingProduct}
        categories={categories}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        showNotification={showNotification}
      />
    </div>
  )
}
