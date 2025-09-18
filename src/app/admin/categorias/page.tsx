
import type { Category } from "@prisma/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryClient } from "@/components/admin/categorias/CategoryClient";
import prisma from "@/lib/db";

async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-6 py-8">
        <CategoryClient initialCategories={categories} />
      </main>
    </div>
  );
}
