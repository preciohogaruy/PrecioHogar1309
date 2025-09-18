
import type { Category } from "@prisma/client";
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
    <CategoryClient initialCategories={categories} />
  );
}
