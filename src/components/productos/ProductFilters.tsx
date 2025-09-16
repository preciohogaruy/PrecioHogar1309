
"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Grid3X3, List, Search, X } from "lucide-react"

interface ProductFiltersProps {
  categories: string[]
  initialValues: {
    q?: string
    category?: string
    view?: "grid" | "list"
    sort?: string
  }
}

export function ProductFilters({ categories, initialValues }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(initialValues.q || "")
  const [selectedCategory, setSelectedCategory] = useState(initialValues.category || "Todos")
  const [viewMode, setViewMode] = useState(initialValues.view || "grid")
  const [sortOption, setSortOption] = useState(initialValues.sort || "createdAt-desc")

  const updateURL = useCallback((params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    for (const key in params) {
      if (params[key]) {
        current.set(key, params[key])
      } else {
        current.delete(key)
      }
    }
    
    // Reset page on filter change
    current.set("page", "1")

    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`${pathname}${query}`)
  }, [searchParams, pathname, router])

  useEffect(() => {
    const debounce = setTimeout(() => {
      updateURL({ q: searchTerm })
    }, 500)
    return () => clearTimeout(debounce)
  }, [searchTerm, updateURL])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    updateURL({ category: category === "Todos" ? "" : category, q: searchTerm })
  }

  const handleViewChange = (view: "grid" | "list") => {
    setViewMode(view)
    updateURL({ view, category: selectedCategory === "Todos" ? "" : selectedCategory, q: searchTerm })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value
    setSortOption(newSort)
    updateURL({ sort: newSort, category: selectedCategory === "Todos" ? "" : selectedCategory, q: searchTerm })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-12">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-10 py-4 rounded-2xl border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
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

        <div className="flex items-center gap-4">
           <select 
             value={sortOption} 
             onChange={handleSortChange}
             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
           >
            <option value="createdAt-desc">Más nuevos</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating-desc">Mejor valorados</option>
           </select>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
