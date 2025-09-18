"use client"

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatBytes } from '@/lib/utils';
import { Download, Trash2, ArrowRight } from 'lucide-react';
import type { ConvertedFile, WebPVariant } from '@/app/types/image';

interface ImageListItemProps {
  file: ConvertedFile;
  onRemove: (id: string) => void;
}

const getReduction = (originalSize: number, newSize: number) => {
  if (originalSize === 0) return 0;
  return 100 - (newSize / originalSize) * 100;
};

const handleDownload = (url: string, name: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const VariantTabContent = ({ originalSize, variant, name }: { originalSize: number, variant: WebPVariant, name: string }) => {
  const reduction = getReduction(originalSize, variant.size);
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Tamaño original: <span className="font-mono">{formatBytes(originalSize)}</span></span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Nuevo tamaño:</span>
        <span className="font-mono font-bold text-foreground">{formatBytes(variant.size)}</span>
      </div>
      {reduction > 0 && (
        <Badge variant="outline" className="w-full justify-center border-primary/30 bg-primary/10 text-primary">
          Reducción del {reduction.toFixed(1)}%
        </Badge>
      )}
      <Button onClick={() => handleDownload(variant.url, name)} variant="outline" size="sm" className="w-full">
        <Download className="mr-2 h-3 w-3" />
        Descargar
      </Button>
    </div>
  );
};


const ImageListItem = ({ file, onRemove }: ImageListItemProps) => {
  const baseName = file.originalName.replace(/\.[^/.]+$/, "");

  return (
    <Card className="overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium truncate leading-tight" title={file.originalName}>
          {file.originalName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <div className="grid grid-cols-2">
          <div className="relative aspect-square bg-muted">
            <Image
              src={file.previewUrl}
              alt={`Vista previa de ${file.originalName}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              className="object-contain"
            />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <Tabs defaultValue="large" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="large" className="text-xs px-1 h-6">1024px</TabsTrigger>
                <TabsTrigger value="medium" className="text-xs px-1 h-6">512px</TabsTrigger>
                <TabsTrigger value="icon" className="text-xs px-1 h-6">128px</TabsTrigger>
              </TabsList>
              <TabsContent value="large">
                <VariantTabContent originalSize={file.originalSize} variant={file.webp.large} name={`${baseName}_1024.webp`} />
              </TabsContent>
              <TabsContent value="medium">
                <VariantTabContent originalSize={file.originalSize} variant={file.webp.medium} name={`${baseName}_512.webp`} />
              </TabsContent>
              <TabsContent value="icon">
                <VariantTabContent originalSize={file.originalSize} variant={file.webp.icon} name={`${baseName}_128.webp`} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50">
        <Button onClick={() => onRemove(file.id)} variant="ghost" size="sm" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="mr-2 h-3 w-3" />
            Quitar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageListItem;
