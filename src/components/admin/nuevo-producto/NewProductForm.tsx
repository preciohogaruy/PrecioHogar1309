'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, Loader2, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { generateNewProductId, createProduct, checkProductExistsByDescription } from '@/app/actions/products';
import { analyzeProductImage } from '@/ai/flows/analyze-product-flow';

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
  rating: z.coerce.number().min(0).max(5, 'El rating debe estar entre 0 y 5.'),
  badge: z.string().optional(),
  productId: z.string().min(1, 'Se requiere un ID de producto.'),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría.'),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function NewProductForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isProductIdLoading, startProductIdTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      quantity: 0,
      rating: 4.5,
      badge: '',
      productId: '',
      categoryId: '',
      isActive: true,
    },
  });

  const handleCategoryChange = (categoryId: string) => {
    form.setValue('categoryId', categoryId);
    const category = categories.find(cat => String(cat.id) === categoryId);
    if (category) {
      startProductIdTransition(async () => {
        const newProductId = await generateNewProductId(category.tag);
        form.setValue('productId', newProductId);
        form.clearErrors('productId');
      });
    } else {
      form.setValue('productId', '');
    }
  }

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageAnalysis = async () => {
    if (!imageFile) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, carga una imagen primero.',
      });
      return;
    }
    setIsAnalyzing(true);
    try {
      const imageDataUri = await fileToDataUri(imageFile);
      const result = await analyzeProductImage({ imageDataUri, categories });
      
      form.setValue('title', result.title);
      form.setValue('description', result.description);

      const foundCategory = categories.find(cat => cat.name.toLowerCase() === result.categoryName.toLowerCase());
      if (foundCategory) {
        handleCategoryChange(String(foundCategory.id));
      }
      
      if (result.price) {
        form.setValue('price', result.price);
      }

      form.setValue('quantity', Math.floor(Math.random() * (180 - 150 + 1)) + 150);
      const randomRating = parseFloat((Math.random() * (5.0 - 4.4) + 4.4).toFixed(1));
      form.setValue('rating', randomRating);


      toast({
        title: 'Análisis Completado',
        description: 'Los campos han sido rellenados con la información de la IA.',
      });

    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: 'destructive',
        title: 'Error de Análisis',
        description: 'No se pudo analizar la imagen. Inténtalo de nuevo.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const descriptionExists = await checkProductExistsByDescription(values.description);

    if (descriptionExists) {
        const userConfirmed = window.confirm(
            'Advertencia: Ya existe un producto activo con esta misma descripción. ¿Deseas crearlo de todas formas?'
        );
        if (!userConfirmed) {
            setIsSubmitting(false);
            return;
        }
    }
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const result = await createProduct(formData);
    
    if (result?.error) {
        setServerError(result.error);
        toast({
            variant: 'destructive',
            title: 'Error al crear el producto',
            description: result.error,
        });
        setIsSubmitting(false);
    } else {
        toast({
          title: 'Éxito',
          description: 'Producto creado correctamente.',
        });
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        router.push('/admin/producto');
    }
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
                  <Select onValueChange={handleCategoryChange} value={field.value}>
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

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID del Producto *</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input placeholder="Se genera al elegir categoría" {...field} readOnly />
                        </FormControl>
                        {isProductIdLoading && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
              <div className="aspect-square relative w-full bg-muted rounded-lg overflow-hidden border">
                  {previewUrl ? (
                  <Image src={previewUrl} alt="Vista previa del producto" layout="fill" objectFit="contain" />
                  ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      No hay imagen
                  </div>
                  )}
              </div>
              <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleManualImageUpload}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
              />
              <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  >
                  <Upload className="w-4 h-4 mr-2" />
                  Cargar manualmente
              </Button>
               <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleImageAnalysis}
                  disabled={!imageFile || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
                </Button>
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

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="4.5" {...field} />
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                                Producto Activo
                            </FormLabel>
                            <FormMessage />
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>


        <div className="flex justify-end pt-8 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-primary to-accent hover:from-orange-500 hover:to-yellow-400 text-primary-foreground"
            disabled={isSubmitting || isProductIdLoading || isAnalyzing}
          >
            {isSubmitting || isProductIdLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Guardando...' : (isProductIdLoading ? 'Generando ID...' : 'Guardar Producto')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
