
import { getProductBySlug, getProducts } from "@/lib/products";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailView } from "@/components/productos/ProductDetailView";
import type { Product, Category } from "@prisma/client";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ProductPageProps = {
    params: {
        slug: string;
    };
};

type ProductWithCategory = Product & { category: Category };

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h1>
                <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido removido.</p>
                <Link href="/productos">
                    <Button className="btn-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Productos
                    </Button>
                </Link>
                </div>
            </div>
            <Footer />
        </>
    );
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)
    .map(p => ({ ...p, category: { name: p.category.name } }));

  const productWithCategory = {
      ...product,
      category: { name: product.category.name },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailView product={productWithCategory} relatedProducts={relatedProducts} />
      <Footer />
    </div>
  );
}
