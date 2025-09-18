
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/admin/categorias/CategoryForm';
import prisma from '@/lib/db';
import type { Category } from '@prisma/client';

async function getCategoryById(id: number): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  } catch (error) {
    console.error('Error fetching category by id:', error);
    return null;
  }
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const categoryId = Number(params.id);
  if (isNaN(categoryId)) {
    notFound();
  }

  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Editar Categoría</h2>
        </div>
        <div className="p-6">
          <CategoryForm category={category} />
        </div>
      </div>
    </div>
  );
}
