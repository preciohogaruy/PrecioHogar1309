
import type { Product } from "@prisma/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductClient } from "@/components/admin/producto/ProductClient";
import prisma from "@/lib/db";

async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-6 py-8">
        <ProductClient initialProducts={products} />
      </main>
    </div>
  );
}
