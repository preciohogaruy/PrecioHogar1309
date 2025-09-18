'use client';

import type { Category } from "@prisma/client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryTable } from "./CategoryTable";
import { deleteCategory } from "@/app/actions/categories";

interface CategoryClientProps {
  initialCategories: Category[];
}

export function CategoryClient({ initialCategories }: CategoryClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const showToast = (type: 'success' | 'error', message: string) => {
    toast({
      variant: type === 'error' ? 'destructive' : 'default',
      title: type === 'success' ? 'Éxito' : 'Error',
      description: message,
    });
  };

  const openEditPage = (categoryId: number) => {
    router.push(`/admin/categorias/editar/${categoryId}`);
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      const previousCategories = categories;
      setCategories(prev => prev.filter(c => c.id !== parseInt(id)));

      startTransition(async () => {
        const result = await deleteCategory(id);
        if (result?.error) {
          setCategories(previousCategories);
          showToast('error', result.error);
        } else {
          showToast('success', 'Categoría eliminada exitosamente');
        }
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Categorías</h2>
            <Link href="/admin/categorias/nueva">
                <Button
                className="bg-gradient-to-r from-primary to-accent hover:from-orange-500 hover:to-yellow-400 text-primary-foreground"
                >
                <Plus className="w-4 h-4 mr-2" />
                Crear Categoría
                </Button>
            </Link>
        </div>
      </div>
      <CategoryTable
        categories={categories}
        openEditPage={openEditPage}
        deleteCategory={handleDeleteCategory}
      />
    </>
  );
}
