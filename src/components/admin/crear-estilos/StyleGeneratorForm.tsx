'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Sparkles, Upload, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { analyzeImageStyle, type AnalyzeImageStyleOutput } from '@/ai/flows/analyze-image-style-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

const styleFormSchema = z.object({
  image: z.any().refine(file => file, 'Se requiere una imagen.'),
});

type StyleFormValues = z.infer<typeof styleFormSchema>;

export function StyleGeneratorForm() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeImageStyleOutput | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<StyleFormValues>();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue('image', file);
      setAnalysisResult(null); // Reset result when new image is uploaded
    }
  };

  const onSubmit = async (values: StyleFormValues) => {
    setIsAnalyzing(true);
    setServerError(null);
    setAnalysisResult(null);

    try {
      const imageDataUri = await fileToDataUri(values.image);
      const result = await analyzeImageStyle({ imageDataUri });
      setAnalysisResult(result);
      toast({
        title: 'Análisis Completado',
        description: 'Se ha extraído el perfil de estilo de la imagen.',
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setServerError('No se pudo analizar la imagen. Inténtalo de nuevo.');
      toast({
        variant: 'destructive',
        title: 'Error de Análisis',
        description: 'No se pudo analizar la imagen. Inténtalo de nuevo.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    const jsonString = JSON.stringify(analysisResult, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast({
      title: 'Copiado',
      description: 'El perfil JSON ha sido copiado al portapapeles.',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>1. Carga una Imagen de Referencia</CardTitle>
          <CardDescription>Selecciona una imagen cuyo estilo quieras replicar. La IA la analizará por ti.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-1/2 lg:w-1/3 space-y-4">
                  <div className="aspect-square relative w-full bg-muted rounded-lg overflow-hidden border">
                    {previewUrl ? (
                      <Image src={previewUrl} alt="Vista previa" layout="fill" objectFit="contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
                          <ImageIcon className="w-10 h-10 mb-2"/>
                          Sube una imagen para analizar
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
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
                    {previewUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                  </Button>
                </div>

                <div className="w-full sm:w-1/2 lg:w-2/3 flex flex-col justify-center items-center h-full text-center">
                    <p className="text-muted-foreground mb-4">
                        Una vez que hayas cargado una imagen, presiona el botón para que la IA extraiga su perfil de estilo.
                    </p>
                    <Button
                        type="submit"
                        disabled={!form.watch('image') || isAnalyzing}
                    >
                        {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {isAnalyzing ? 'Analizando...' : 'Analizar Estilo con IA'}
                    </Button>
                </div>
              </div>
              
              {serverError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {(isAnalyzing || analysisResult) && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>2. Perfil de Estilo Generado</CardTitle>
                <CardDescription>
                  Este es el perfil JSON extraído de la imagen. Puedes copiarlo y usarlo en tus flujos de trabajo de generación de imágenes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center h-48 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : analysisResult ? (
                  <div className="relative">
                    <Textarea
                      readOnly
                      value={JSON.stringify(analysisResult, null, 2)}
                      className="bg-muted font-mono text-sm h-72"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
