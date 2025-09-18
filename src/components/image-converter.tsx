"use client";

import { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';

import FileUploader from '@/components/file-uploader';
import ImageList from '@/components/image-list';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Package, Trash2 } from 'lucide-react';
import type { ConvertedFile } from '@/app/types/image';

const ImageConverter = () => {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      convertedFiles.forEach(file => URL.revokeObjectURL(file.webpUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertImageToWebP = (file: File): Promise<ConvertedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('No se pudo obtener el contexto del canvas.'));
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Error al convertir la imagen.'));
              }
              const webpUrl = URL.createObjectURL(blob);
              resolve({
                id: `${file.name}-${file.lastModified}`,
                originalName: file.name,
                originalSize: file.size,
                webpBlob: blob,
                webpSize: blob.size,
                webpUrl: webpUrl,
                previewUrl: img.src,
              });
            },
            'image/webp',
            0.8
          );
        };
        img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    });
  };
  
  const handleFiles = useCallback(async (files: File[]) => {
    setIsConverting(true);
    const newFiles: ConvertedFile[] = [];
    const existingIds = new Set(convertedFiles.map(f => f.id));

    for (const file of files) {
      const fileId = `${file.name}-${file.lastModified}`;
      if (existingIds.has(fileId)) {
          toast({
            variant: "destructive",
            title: "Archivo duplicado",
            description: `La imagen "${file.name}" ya ha sido agregada.`,
          });
          continue;
      }
      try {
        const converted = await convertImageToWebP(file);
        newFiles.push(converted);
      } catch (error) {
        console.error('Conversion error:', error);
        toast({
          variant: "destructive",
          title: "Error de Conversión",
          description: `No se pudo convertir la imagen "${file.name}".`,
        });
      }
    }
    
    setConvertedFiles(prev => [...prev, ...newFiles]);
    setIsConverting(false);
  }, [convertedFiles, toast]);

  const handleRemove = (id: string) => {
    setConvertedFiles(files => {
      const fileToRemove = files.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.webpUrl);
      }
      return files.filter(f => f.id !== id);
    });
  };

  const handleClearAll = () => {
    convertedFiles.forEach(file => URL.revokeObjectURL(file.webpUrl));
    setConvertedFiles([]);
  };

  const handleDownloadZip = async () => {
    if (convertedFiles.length === 0) return;
    const zip = new JSZip();
    convertedFiles.forEach(file => {
        const newName = file.originalName.replace(/\.[^/.]+$/, "") + ".webp";
        zip.file(newName, file.webpBlob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'imagenes-convertidas.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  return (
    <div className="space-y-6">
      <FileUploader onFiles={handleFiles} isConverting={isConverting} />
      {convertedFiles.length > 0 && (
        <>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button onClick={handleDownloadZip} disabled={convertedFiles.length === 0}>
                    <Package className="mr-2 h-4 w-4" />
                    Descargar todo (.zip)
                </Button>
                <Button variant="outline" onClick={handleClearAll}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpiar todo
                </Button>
            </div>
            <ImageList files={convertedFiles} onRemove={handleRemove} />
        </>
      )}
    </div>
  );
};

export default ImageConverter;
