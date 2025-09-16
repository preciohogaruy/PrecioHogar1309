
import { Package } from "lucide-react"
import { ProductCardGrid } from "./ProductCardGrid"
import { ProductCardList } from "./ProductCardList"
import { getProducts } from "@/lib/products"
import { ProductFilters } from "./ProductFilters"
import { PaginationComponent } from "./PaginationComponent"

export type SearchParams = {
  page?: string
  q?: string
  category?: string
  view?: "grid" | "list"
  sort?: string
}

interface ProductViewProps {
  searchParams: SearchParams
  categories: string[]
}

export async function ProductView({ searchParams, categories }: ProductViewProps) {
  const page = Number(searchParams.page) || 1
  const viewMode = searchParams.view || "grid"
  const searchTerm = searchParams.q || ""
  const selectedCategory = searchParams.category || "Todos"
  const sort = searchParams.sort

  const { products, total, totalPages } = await getProducts({
    page,
    limit: 12,
    category: selectedCategory,
    search: searchTerm,
    sort,
  })

  return (
    <section className="py-16 bg-gray-50 -mt-8 rounded-t-3xl relative z-10">
      <div className="container mx-auto px-6">
        <ProductFilters
          categories={categories}
          initialValues={{
            q: searchTerm,
            category: selectedCategory,
            view: viewMode,
            sort: sort,
          }}
        />

        <div className="mb-8">
          <p className="text-gray-600">
            Mostrando {products.length} de {total} productos
            {selectedCategory !== "Todos" && ` en ${selectedCategory}`}
          </p>
        </div>

        {products.length > 0 && viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCardGrid
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : products.length > 0 && viewMode === "list" ? (
          <div className="space-y-6">
            {products.map((product) => (
              <ProductCardList
                key={product.id}
                product={product}
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

        {totalPages > 1 && (
          <div className="mt-12">
            <PaginationComponent currentPage={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </section>
  )
}
