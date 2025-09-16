
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Save, Upload } from "lucide-react"
import { type Product } from "@/app/admin/page"

interface ProductModalProps {
  isOpen: boolean
  closeModal: () => void
  editingProduct: Product | null
  categories: string[]
  onAddProduct: (formData: any) => void
  onUpdateProduct: (formData: any) => void
  showNotification: (type: "success" | "error", message: string) => void
}

export function ProductModal({
  isOpen,
  closeModal,
  editingProduct,
  categories,
  onAddProduct,
  onUpdateProduct,
  showNotification,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Hogar",
    price: "",
    originalPrice: "",
    description: "",
    stockQuantity: "",
    badge: "Nuevo",
    isNew: false,
    isBestSeller: false,
    isActive: true,
    image: "",
  })

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setFormData({
          name: editingProduct.title,
          category: editingProduct.category.name,
          price: editingProduct.price.toString(),
          originalPrice: editingProduct.originalPrice?.toString() || "",
          description: editingProduct.description,
          stockQuantity: editingProduct.quantity.toString(),
          badge: editingProduct.badge,
          isNew: editingProduct.isNew,
          isBestSeller: editingProduct.isBestSeller,
          isActive: editingProduct.isActive,
          image: editingProduct.image || "",
        })
      } else {
        setFormData({
            name: "",
            category: "Hogar",
            price: "",
            originalPrice: "",
            description: "",
            stockQuantity: "",
            badge: "Nuevo",
            isNew: false,
            isBestSeller: false,
            isActive: true,
            image: "https://ik.imagekit.io/precioahorro/TiendaPrecioHogar/tr:w-200,h-200/placeholder.jpg",
        })
      }
    }
  }, [isOpen, editingProduct])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.description) {
      showNotification("error", "Por favor completa todos los campos obligatorios")
      return
    }
    
    let badge = "";
    if (formData.isNew) badge = "Nuevo";
    if (formData.isBestSeller) badge = "Más Vendido";


    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : null,
      quantity: Number.parseInt(formData.stockQuantity) || 0,
      description: formData.description,
      badge: badge,
      image: formData.image,
      isActive: formData.isActive,
    }

    if (editingProduct) {
      onUpdateProduct(productData)
    } else {
      onAddProduct(productData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
            </h2>
            <Button variant="outline" size="sm" onClick={closeModal}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  {categories.filter(c => c !== 'Todos').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Original (opcional)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad en Stock *</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked, isBestSeller: e.target.checked ? false: formData.isBestSeller })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Producto Nuevo</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked, isNew: e.target.checked ? false: formData.isNew })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Más Vendido</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Activo</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="/images/producto.jpg"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingProduct ? "Actualizar" : "Guardar"} Producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
