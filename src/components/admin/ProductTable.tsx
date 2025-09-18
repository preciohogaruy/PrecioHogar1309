
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, EyeOff, Package } from "lucide-react"
import type { Product } from "@prisma/client";

interface ProductTableProps {
  products: Product[]
  formatPrice: (price: number) => string
  openEditPage: (id: number) => void
  toggleProductStatus: (id: string, currentStatus: boolean) => void
  deleteProduct: (id: string) => void
}

export function ProductTable({
  products,
  formatPrice,
  openEditPage,
  toggleProductStatus,
  deleteProduct,
}: ProductTableProps) {

  const getImageUrl = (image: string | null) => {
    if (image && (image.startsWith('http') || image.startsWith('/') || image.startsWith('data:'))) {
      return image;
    }
    return "/logotienda.svg";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Productos ({products.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className={`hover:bg-gray-50 ${!product.isActive ? "opacity-60" : ""}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <Image
                        src={getImageUrl(product.image)}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{product.title}</div>
                      {product.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {product.badge}
                          </span>
                        )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{product.productId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm ${product.quantity > 0 ? "text-gray-900" : "text-red-600"}`}>
                      {product.quantity}
                    </span>
                    {product.quantity <= 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Agotado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditPage(product.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProductStatus(String(product.id), product.isActive)}
                      className={
                        product.isActive
                          ? "text-gray-600 hover:text-gray-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProduct(String(product.id))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros o agregar un nuevo producto.</p>
        </div>
      )}
    </div>
  )
}
