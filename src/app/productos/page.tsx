
import { Navbar } from "@/components/layout/Navbar"
import { ProductView } from "@/components/productos/ProductView"
import { Footer } from "@/components/layout/Footer"
import { getProducts } from "@/lib/products"
import { getCategories } from "@/lib/categorias"

export default async function ProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <ProductView initialProducts={products} initialCategories={categories} />
      </main>
      <Footer />
    </div>
  )
}
