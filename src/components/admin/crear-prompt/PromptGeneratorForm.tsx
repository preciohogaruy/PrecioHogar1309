'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateImagePrompt } from '@/ai/flows/generate-image-prompt-flow';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const promptFormSchema = z.object({
  imageType: z.string().min(1, 'Debes seleccionar un tipo de imagen.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;

const imageTypes = [
  'Banner para sección principal (Hero)',
  'Banner para cabecera de página',
  'Banner para llamada a la acción (CTA)',
  'Imagen para categoría de producto',
  'Foto de producto profesional',
  'Icono para la aplicación',
  'Fondo abstracto',
];

const colorPalette = [
    { name: "Naranja Vibrante", value: "hsl(35, 100%, 58%)" },
    { name: "Azul Cielo", value: "hsl(205, 90%, 55%)" },
    { name: "Azul Oscuro", value: "hsl(215, 60%, 40%)" },
    { name: "Blanco/Gris Claro", value: "hsl(210 40% 98%)" },
];

export function PromptGeneratorForm() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      imageType: '',
      description: '',
    },
  });

  const onSubmit = async (values: PromptFormValues) => {
    setIsGenerating(true);
    setGeneratedPrompt(null);
    try {
      const result = await generateImagePrompt(values);
      setGeneratedPrompt(result.prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudo generar el prompt. Inténtalo de nuevo.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setHasCopied(true);
    toast({
      title: 'Copiado',
      description: 'El prompt ha sido copiado al portapapeles.',
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Describe tu Imagen</CardTitle>
                <CardDescription>Completa los campos para que la IA genere el prompt perfecto.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="imageType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo de Imagen *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona el propósito de la imagen" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {imageTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                {type}
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descripción Detallada *</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Ej: Un set de herramientas manuales bien organizadas sobre una superficie de madera oscura." rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="bg-primary text-primary-foreground"
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {isGenerating ? 'Generando...' : 'Generar Prompt'}
                    </Button>
                    </div>
                </form>
                </Form>
            </CardContent>
        </Card>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Paleta de Colores</CardTitle>
                    <CardDescription>La IA usará estos colores en el prompt.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {colorPalette.map(color => (
                        <div key={color.name} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.value }}></div>
                            <span className="text-sm font-medium">{color.name}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {isGenerating && (
                <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            )}

            {generatedPrompt && (
                <Card className="bg-gray-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Prompt Generado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Textarea
                                readOnly
                                value={generatedPrompt}
                                className="bg-gray-800 text-gray-200 font-mono text-sm border-gray-700 h-40"
                                rows={6}
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-gray-700"
                                onClick={handleCopy}
                            >
                                {hasCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
