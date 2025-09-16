
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getProducts } from "@/lib/products"
import { getCategories } from "@/lib/categorias"
import type { Product as ProductType, Category } from "@prisma/client"

import { AdminHeader } from "@/components/admin/AdminHeader"
import { Notification } from "@/components/admin/Notification"
import { ProductControls } from "@/components/admin/ProductControls"
import { ProductTable } from "@/components/admin/ProductTable"
import { ProductModal, type ProductFormData } from "@/components/admin/ProductModal"

// Extend ProductType to include category name
export type ProductWithCategory = ProductType & { category: { name: string } }

export type Product = ProductWithCategory & {
  slug: string
  originalPrice: number | null
  reviews: number
}

export type NotificationType = { type: "success" | "error"; message: string }

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [showInactive, setShowInactive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [notification, setNotification] = useState<NotificationType | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [{ products: productsData }, categoriesData] = await Promise.all([getProducts(), getCategories()])

        const formattedProducts: Product[] = productsData.map((p: ProductType & { category: Category }) => ({
          ...p,
          slug: p.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          originalPrice: null, // This can be adjusted if your DB supports it
          reviews: Math.floor(Math.random() * 200),
          category: { name: p.category.name }, // Ensure category object with name is passed
        }))

        setProducts(formattedProducts)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        showNotification("error", "Error al cargar los datos.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category.name === selectedCategory
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

  const handleAddProduct = (formData: ProductFormData) => {
    const newProduct: Product = {
      ...formData,
      id: Math.floor(Math.random() * 10000), // temp id
      productId: `NEW-${Math.random().toString(36).substr(2, 9)}`,
      slug: generateSlug(formData.name),
      rating: 4.5,
      reviews: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: formData.name, // Ensure title is set
      category: { name: formData.category },
      categoryId: categories.find(c => c.name === formData.category)?.id || 0,
      image: formData.image,
      originalPrice: formData.originalPrice,
    }
    setProducts([...products, newProduct])
    showNotification("success", "Producto agregado exitosamente")
    closeModal()
    // Here you would typically call an API to save the new product to the database
  }

  const handleUpdateProduct = (formData: ProductFormData) => {
    if (!editingProduct) return

    const updatedProduct: Product = {
      ...editingProduct,
      ...formData,
      title: formData.name,
      slug: generateSlug(formData.name),
      category: { name: formData.category },
    }

    setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
    showNotification("success", "Producto actualizado exitosamente")
    closeModal()
    // Here you would typically call an API to update the product in the database
  }

  const openModal = (product?: Product) => {
    setEditingProduct(product || null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const toggleProductStatus = (id: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
    const product = products.find((p) => p.id === id)
    showNotification("success", `Producto ${product?.isActive ? "desactivado" : "activado"} exitosamente`)
    // API call to update status
  }

  const deleteProduct = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id))
      showNotification("success", "Producto eliminado exitosamente")
      // API call to delete product
    }
  }

  const categoryNames = ["Todos", ...categories.map((c) => c.name)]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando panel de administración...</p>
      </div>
    )
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
          categories={categoryNames}
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
        categories={categoryNames}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        showNotification={showNotification}
      />
    </div>
  )
}
