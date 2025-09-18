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
import { generateImagePrompt, type GenerateImagePromptOutput } from '@/ai/flows/generate-image-prompt-flow';
import { generateImageDescription } from '@/ai/flows/generate-description-flow';
import { Loader2, Sparkles, Copy, Check, Wand2, Image as ImageIcon, Milestone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import profiles from '@/ai/flows/image-prompt-profiles.json';

const promptFormSchema = z.object({
  componentType: z.string().min(1, 'Debes seleccionar un componente.'),
  userDescription: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  resolution: z.string().optional(),
  aspectRatio: z.string().optional(),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;

// Cargar los perfiles una vez
const loadedProfiles = profiles as Record<string, any>;
const componentTypes = Object.keys(loadedProfiles);

const colorPalette = [
    { name: "Naranja Vibrante", value: "hsl(35, 100%, 58%)" },
    { name: "Azul Cielo", value: "hsl(205, 90%, 55%)" },
    { name: "Azul Oscuro", value: "hsl(215, 60%, 40%)" },
    { name: "Blancos y Grises Claros", value: "hsl(210, 40%, 98%)" },
];

export function PromptGeneratorForm() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<GenerateImagePromptOutput | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      componentType: '',
      userDescription: '',
      resolution: 'none',
      aspectRatio: 'none',
    },
  });

  const handleSuggestDescription = async () => {
    const componentType = form.getValues('componentType');
    if (!componentType) {
      form.setError('componentType', { message: 'Selecciona un componente primero.' });
      return;
    }
    setIsSuggesting(true);
    try {
      const contextProfile = loadedProfiles[componentType] || loadedProfiles["Default"];
      const result = await generateImageDescription({ componentType, contextProfile });
      form.setValue('userDescription', result.description);
      form.clearErrors('userDescription');
      toast({
        title: 'Sugerencia Lista',
        description: 'Se ha generado una descripción creativa para ti.',
      });
    } catch (error) {
      console.error('Error suggesting description:', error);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudo generar la sugerencia. Inténtalo de nuevo.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (values: PromptFormValues) => {
    setIsGenerating(true);
    setGeneratedPrompts(null);
    try {
      // Filtrar valores opcionales que son 'none'
      const optionalValues: { resolution?: string; aspectRatio?: string } = {};
      if (values.resolution && values.resolution !== 'none') {
        optionalValues.resolution = values.resolution;
      }
      if (values.aspectRatio && values.aspectRatio !== 'none') {
        optionalValues.aspectRatio = values.aspectRatio;
      }

      const result = await generateImagePrompt({
        ...values,
        ...optionalValues
      });

      setGeneratedPrompts(result);
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

  const handleCopy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    toast({
      title: 'Copiado',
      description: `El prompt de ${key} ha sido copiado.`,
    });
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Milestone className="w-6 h-6 text-primary"/>
                        <CardTitle>Paso 1: Describe tu Idea</CardTitle>
                    </div>
                    <CardDescription>Selecciona un componente, describe la imagen que tienes en mente (o deja que la IA te ayude) y ajusta los detalles técnicos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="componentType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Componente del Proyecto *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un componente o escena" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {componentTypes.map((type) => (
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
                            name="userDescription"
                            render={({ field }) => (
                                <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Descripción de la Imagen *</FormLabel>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={handleSuggestDescription}
                                        disabled={isSuggesting}
                                        className="text-primary hover:bg-primary/10"
                                    >
                                        {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />}
                                        <span className="ml-2">Sugerir con IA</span>
                                    </Button>
                                </div>
                                <FormControl>
                                    <Textarea placeholder="Ej: Un set de herramientas modernas y elegantes sobre una mesa de trabajo limpia y ordenada." rows={4} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="resolution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Resolución (Opcional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Predeterminada" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">Predeterminada</SelectItem>
                                    <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                                    <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                                    <SelectItem value="1024x1024">1024x1024 (Cuadrado)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="aspectRatio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Aspect Ratio (Opcional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Predeterminado" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">Predeterminado</SelectItem>
                                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                                    <SelectItem value="1:1">1:1 (Cuadrado)</SelectItem>
                                    <SelectItem value="4:3">4:3 (Estándar)</SelectItem>
                                    <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>


                        <div className="flex justify-end pt-4 border-t">
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground"
                            disabled={isGenerating || isSuggesting}
                        >
                            {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                            <Wand2 className="w-4 h-4 mr-2" />
                            )}
                            {isGenerating ? 'Generando...' : 'Generar Prompts'}
                        </Button>
                        </div>
                    </form>
                    </Form>
                </CardContent>
            </Card>

            <AnimatePresence>
                {isGenerating && (
                     <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                             <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-6 h-6 text-primary animate-spin"/>
                                    <CardTitle>Generando Magia...</CardTitle>
                                </div>
                                <CardDescription>La IA está creando los prompts optimizados. Por favor, espera un momento.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-40">
                                <p className="text-muted-foreground">Creando escena detallada y prompts finales...</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {generatedPrompts && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                             <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Milestone className="w-6 h-6 text-green-600"/>
                                    <CardTitle className="text-green-900 dark:text-green-300">Paso 2: Prompts Generados</CardTitle>
                                </div>
                                <CardDescription className="text-green-800 dark:text-green-400">Aquí están los prompts optimizados para cada plataforma. ¡Listos para copiar y usar!</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-blue-500" />
                                    <span>Prompt para Gemini (Nano Banana)</span>
                                </CardTitle>
                                <CardDescription>Optimizado para un estilo fotográfico y cinematográfico.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <Textarea
                                        readOnly
                                        value={generatedPrompts.geminiPrompt}
                                        className="bg-muted font-mono text-sm h-32"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                                        onClick={() => handleCopy('Gemini', generatedPrompts.geminiPrompt)}
                                    >
                                        {copiedStates['Gemini'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                    <span>Prompt para Whisk de Google</span>
                                </CardTitle>
                                <CardDescription>Estructurado en Asunto, Escena y Estilo para máxima precisión.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <Textarea
                                        readOnly
                                        value={generatedPrompts.whiskPrompt}
                                        className="bg-muted font-mono text-sm h-48"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                                        onClick={() => handleCopy('Whisk', generatedPrompts.whiskPrompt)}
                                    >
                                        {copiedStates['Whisk'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Paleta de Colores</CardTitle>
                <CardDescription>La IA usará estos colores como base para generar las imágenes.</CardDescription>
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
    </div>
  );
}
