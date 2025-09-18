
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { createCategory, updateCategory } from '@/app/actions/categories';

const categoryFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  tag: z.string().length(3, 'El tag debe tener exactamente 3 caracteres.').regex(/^[A-Z]+$/, 'El tag solo debe contener letras mayúsculas.'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditMode = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      tag: category?.tag || '',
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    if (isEditMode) {
        formData.append('id', String(category.id));
    }
    Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const action = isEditMode ? updateCategory : createCategory;
    const result = await action(formData);

    if (result?.error) {
        setServerError(result.error);
        toast({
            variant: 'destructive',
            title: `Error al ${isEditMode ? 'actualizar' : 'crear'} la categoría`,
            description: result.error,
        });
        setIsSubmitting(false);
    } else {
        toast({
          title: 'Éxito',
          description: `Categoría ${isEditMode ? 'actualizada' : 'creada'} correctamente.`,
        });
        router.push('/admin/categorias');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
        {serverError && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error del Servidor</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
            </Alert>
        )}

        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                <Input placeholder="Ej: Hogar y Jardín" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Descripción *</FormLabel>
                <FormControl>
                <Textarea placeholder="Descripción de la categoría..." rows={4} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Tag (3 letras mayúsculas) *</FormLabel>
                <FormControl>
                <Input 
                    placeholder="Ej: HOG" 
                    {...field} 
                    maxLength={3} 
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <div className="flex justify-end pt-8 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Categoría')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
