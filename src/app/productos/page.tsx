
import { Suspense } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { ProductView } from "@/components/productos/ProductView"
import { Footer } from "@/components/layout/Footer"
import { getCategoriesWithStringIcon } from "@/lib/categorias"
import { ProductHero } from "@/components/productos/ProductHero"
import type { SearchParams } from "@/components/productos/ProductView"
import { Loader2 } from "lucide-react"

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const categories = await getCategoriesWithStringIcon()
  const categoriesWithAll = ["Todos", ...categories.map((c) => c.name)]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <ProductHero />
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          }
        >
          <ProductView searchParams={searchParams} categories={categoriesWithAll} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
