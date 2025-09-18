
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProductControlsProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  categories: string[]
  showInactive: boolean
  setShowInactive: (value: boolean) => void
}

export function ProductControls({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  showInactive,
  setShowInactive,
}: ProductControlsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-auto"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "Todos" ? "Todas las categorías" : category}
              </option>
            ))}
          </select>

          {/* Show Inactive Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer mt-2 sm:mt-0">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Mostrar inactivos</span>
          </label>
        </div>

        {/* Add Product Button */}
        <Link href="/admin/producto/nuevo" className="w-full lg:w-auto">
            <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full"
            >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
            </Button>
        </Link>
      </div>
    </div>
  )
}
