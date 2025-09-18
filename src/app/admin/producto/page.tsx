
import type { Product } from "@prisma/client";
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
    <ProductClient initialProducts={products} />
  );
}
