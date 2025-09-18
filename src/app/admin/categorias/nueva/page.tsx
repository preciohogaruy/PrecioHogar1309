
import { CategoryForm } from '@/components/admin/categorias/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Crear Nueva Categoría</h2>
        </div>
        <div className="p-6">
            <CategoryForm />
        </div>
      </div>
    </div>
  );
}
