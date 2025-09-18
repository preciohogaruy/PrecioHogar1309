
import { notFound } from 'next/navigation';
import { EditProductForm } from '@/components/admin/editar-producto/EditProductForm';
import prisma from '@/lib/db';
import type { Product } from '@prisma/client';

async function getProductById(id: number): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Editar Producto</h2>
        </div>
        <div className="p-6">
          <EditProductForm product={product} />
        </div>
      </div>
    </div>
  );
}
