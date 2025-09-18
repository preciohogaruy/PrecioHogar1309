
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CategoryForm } from '@/components/admin/categorias/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-6 py-8">
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
      </main>
    </div>
  );
}
