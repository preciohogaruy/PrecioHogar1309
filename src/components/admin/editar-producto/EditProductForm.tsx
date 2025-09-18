
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { updateProduct } from '@/app/actions/products';

const categories = [
  { id: 1, name: 'Baño', tag: 'BAN', description: 'Accesorios, organización y productos.' },
  { id: 2, name: 'Dormitorio', tag: 'DOR', description: 'Ropa de cama, almohadas y decoración.' },
  { id: 3, name: 'Herramientas', tag: 'HER', description: 'Las mejores herramientas para tus proyectos.' },
  { id: 4, name: 'Otros', tag: 'OTR', description: 'Descubre una variedad de productos.' },
  { id: 5, name: 'Cuidado Personal', tag: 'CPE', description: 'Productos para tu bienestar y belleza.' },
  { id: 6, name: 'Hogar', tag: 'HOG', description: 'Todo lo que necesitas para tu casa.' },
  { id: 7, name: 'Cocina', tag: 'COC', description: 'Electrodomésticos, utensilios y accesorios.' },
  { id: 8, name: 'Tecnologia', tag: 'TEC', description: 'Lo último en tecnología y gadgets.' },
];

const badgeOptions = [
  "Nuevo Ingreso",
  "Oferta",
  "Más Vendido",
  "Liquidación",
  "Exclusivo Online",
  "Pocas Unidades"
];

const productFormSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  price: z.coerce.number().positive('El precio debe ser un número positivo.'),
  quantity: z.coerce.number().int().min(0, 'La cantidad no puede ser negativa.'),
  badge: z.string().optional(),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría.'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductFormProps {
  product: Product;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product.title,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      badge: product.badge || '',
      categoryId: String(product.categoryId),
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.append('id', String(product.id));
    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    const result = await updateProduct(formData);

    if (result?.error) {
        setServerError(result.error);
        toast({
            variant: 'destructive',
            title: 'Error al actualizar el producto',
            description: result.error,
        });
        setIsSubmitting(false);
    } else {
        toast({
          title: 'Éxito',
          description: 'Producto actualizado correctamente.',
        });
        router.push('/admin/producto');
    }
  };
  
  const getImageUrl = (image: string | null) => {
    if (image && (image.startsWith('http') || image.startsWith('/') || image.startsWith('data:'))) {
      return image;
    }
    return "/logotienda.svg";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error del Servidor</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>ID del Producto (No editable)</FormLabel>
              <Input value={product.productId} readOnly disabled />
            </FormItem>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Acolchado 2 Plazas" {...field} />
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
                    <Textarea placeholder="Descripción detallada del producto..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Imagen del Producto (No editable)</label>
              <div className="aspect-square relative w-full bg-muted rounded-lg overflow-hidden border">
                <Image src={getImageUrl(product.image)} alt="Vista previa del producto" layout="fill" objectFit="contain" />
              </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
                control={form.control}
                name="badge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un badge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=" ">Ninguno</SelectItem>
                        {badgeOptions.map((badge) => (
                          <SelectItem key={badge} value={badge}>
                            {badge}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
            />
        </div>


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
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    