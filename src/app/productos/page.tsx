
"use client"

import { Navbar } from "@/components/layout/Navbar"
import { ProductView } from "@/components/productos/ProductView"
import { Footer } from "@/components/layout/Footer"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <ProductView />
      </main>
      <Footer />
    </div>
  )
}
