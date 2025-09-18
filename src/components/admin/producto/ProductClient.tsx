'use client';

import type { Product } from "@prisma/client";
import { useState, useTransition } from "react";
import {
  deleteProduct,
  toggleProductStatus,
} from '@/app/actions/products';
import { useToast } from "@/hooks/use-toast";
import { ProductControls } from "@/components/admin/ProductControls";
import { ProductTable } from "@/components/admin/ProductTable";
import { useRouter } from "next/navigation";


const categories = [
    { id: 1, name: 'Baño', tag: 'BAN' },
    { id: 2, name: 'Dormitorio', tag: 'DOR' },
    { id: 3, name: 'Herramientas', tag: 'HER' },
    { id: 4, name: 'Otros', tag: 'OTR' },
    { id: 5, name: 'Cuidado Personal', tag: 'CPE' },
    { id: 6, name: 'Hogar', tag: 'HOG' },
    { id: 7, name: 'Cocina', tag: 'COC' },
    { id: 8, name: 'Tecnologia', tag: 'TEC' },
];

const categoryMap = new Map(categories.map(c => [c.id, c.name]));

interface ProductClientProps {
  initialProducts: Product[];
}

export function ProductClient({ initialProducts }: ProductClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showInactive, setShowInactive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();


  const filteredProducts = products.filter(product => {
    const categoryName = categoryMap.get(product.categoryId);
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || categoryName === selectedCategory;
    const matchesStatus = showInactive || product.isActive;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    toast({
      variant: type === 'error' ? 'destructive' : 'default',
      title: type === 'success' ? 'Éxito' : 'Error',
      description: message,
    });
  };

  const openEditPage = (productId: number) => {
    router.push(`/admin/producto/editar/${productId}`);
  }


  const handleToggleProductStatus = (id: string, currentStatus: boolean) => {
    const previousProducts = products;
    setProducts(prev => prev.map(p => p.id === parseInt(id) ? {...p, isActive: !currentStatus} : p));

    startTransition(async () => {
      const result = await toggleProductStatus(id, currentStatus);
      if (result?.error) {
        setProducts(previousProducts);
        showToast('error', result.error);
      } else {
        showToast('success', `Producto ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const previousProducts = products;
      setProducts(prev => prev.filter(p => p.id !== parseInt(id)));

      startTransition(async () => {
        const result = await deleteProduct(id);
        if (result?.error) {
          setProducts(previousProducts);
          showToast('error', result.error);
        } else {
          showToast('success', 'Producto eliminado exitosamente');
        }
      });
    }
  };

  return (
    <>
      <ProductControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={['Todos', ...categories.map(c => c.name)]}
        showInactive={showInactive}
        setShowInactive={setShowInactive}
      />
      <ProductTable
        products={filteredProducts}
        formatPrice={formatPrice}
        openEditPage={openEditPage}
        toggleProductStatus={handleToggleProductStatus}
        deleteProduct={handleDeleteProduct}
      />
    </>
  );
}
