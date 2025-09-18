"use client";

import { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import 'react-image-crop/dist/ReactCrop.css';

import FileUploader from '@/components/file-uploader';
import ImageList from '@/components/image-list';
import ImageConverterActions from './ImageConverterActions';
import { useToast } from "@/hooks/use-toast";
import type { ConvertedFile, WebPVariant } from '@/app/types/image';
import ImageCropper from './ImageCropper';

const SIZES = {
  large: 1024,
  medium: 512,
  icon: 128,
};

export default function ImageConverterContainer() {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<{file: File, dataUrl: string} | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      convertedFiles.forEach(file => {
        URL.revokeObjectURL(file.previewUrl);
        URL.revokeObjectURL(file.webp.large.url);
        URL.revokeObjectURL(file.webp.medium.url);
        URL.revokeObjectURL(file.webp.icon.url);
      });
    };
  }, [convertedFiles]);

  const resizeAndConvertToWebP = (imageBlob: Blob, size: number): Promise<WebPVariant> => {
    return new Promise((resolve, reject) => {
      const mainImage = new Image();
      mainImage.src = URL.createObjectURL(imageBlob);
      mainImage.onload = () => {
        URL.revokeObjectURL(mainImage.src);

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('No se pudo obtener el contexto del canvas.'));
        }

        const backgroundImage = new Image();
        backgroundImage.src = '/fondos/fondo_productos.svg';
        backgroundImage.onload = () => {
          ctx.drawImage(backgroundImage, 0, 0, size, size);
          
          // Allocate space for the footer, e.g., 20% of the height
          const footerHeight = size * 0.25; 
          const productAreaHeight = size - footerHeight;

          const aspectRatio = mainImage.width / mainImage.height;
          let drawWidth = productAreaHeight * aspectRatio;
          let drawHeight = productAreaHeight;

          if (drawWidth > size) {
              drawWidth = size;
              drawHeight = size / aspectRatio;
          }
          
          const x = (size - drawWidth) / 2;
          const y = (productAreaHeight - drawHeight) / 2;

          ctx.drawImage(mainImage, x, y, drawWidth, drawHeight);

          const footerImage = new Image();
          footerImage.src = '/fondos/logo_horizontal_inicio_con_fondo.svg';
          footerImage.onload = () => {
            const footerY = size - footerHeight;
            ctx.drawImage(footerImage, 0, footerY, size, footerHeight);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  return reject(new Error('Error al convertir la imagen compuesta.'));
                }
                const webpUrl = URL.createObjectURL(blob);
                resolve({
                  blob: blob,
                  size: blob.size,
                  url: webpUrl,
                });
              },
              'image/webp',
              0.85
            );
          };
          footerImage.onerror = () => reject(new Error('No se pudo cargar la imagen del footer.'));
        };
        backgroundImage.onerror = () => reject(new Error('No se pudo cargar la imagen de fondo.'));
      };
      mainImage.onerror = () => {
        URL.revokeObjectURL(mainImage.src);
        reject(new Error('No se pudo cargar la imagen para redimensionar.'));
      };
    });
  };
  
  const handleFiles = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop({ file, dataUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCropComplete = useCallback(async (croppedBlob: Blob | null) => {
    if (!croppedBlob || !imageToCrop) {
      setImageToCrop(null);
      return;
    }

    setIsConverting(true);
    setImageToCrop(null);

    const existingIds = new Set(convertedFiles.map(f => f.id));
    const fileId = `${imageToCrop.file.name}-${imageToCrop.file.lastModified}`;

    if (existingIds.has(fileId)) {
      toast({
        variant: "destructive",
        title: "Archivo duplicado",
        description: `La imagen "${imageToCrop.file.name}" ya ha sido agregada.`,
      });
      setIsConverting(false);
      return;
    }

    try {
      const [large, medium, icon] = await Promise.all([
        resizeAndConvertToWebP(croppedBlob, SIZES.large),
        resizeAndConvertToWebP(croppedBlob, SIZES.medium),
        resizeAndConvertToWebP(croppedBlob, SIZES.icon),
      ]);
      
      const newFile: ConvertedFile = {
        id: fileId,
        originalName: imageToCrop.file.name,
        originalSize: imageToCrop.file.size,
        previewUrl: URL.createObjectURL(croppedBlob),
        webp: { large, medium, icon },
      };

      setConvertedFiles(prev => [...prev, newFile]);

    } catch (error: any) {
      console.error('Conversion error:', error);
      toast({
        variant: "destructive",
        title: "Error de Conversión",
        description: error.message || `No se pudo convertir la imagen "${imageToCrop.file.name}".`,
      });
    }

    setIsConverting(false);
  }, [imageToCrop, convertedFiles, toast]);


  const handleRemove = (id: string) => {
    setConvertedFiles(files => {
      const fileToRemove = files.find(f => f.id !== id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
        URL.revokeObjectURL(fileToRemove.webp.large.url);
        URL.revokeObjectURL(fileToRemove.webp.medium.url);
        URL.revokeObjectURL(fileToRemove.webp.icon.url);
      }
      return files.filter(f => f.id !== id);
    });
  };

  const handleClearAll = () => {
    convertedFiles.forEach(file => {
      URL.revokeObjectURL(file.previewUrl);
      URL.revokeObjectURL(file.webp.large.url);
      URL.revokeObjectURL(file.webp.medium.url);
      URL.revokeObjectURL(file.webp.icon.url);
    });
    setConvertedFiles([]);
  };

  const handleDownloadZip = async () => {
    if (convertedFiles.length === 0) return;
    const zip = new JSZip();
    
    convertedFiles.forEach(file => {
      const baseName = file.originalName.replace(/\.[^/.]+$/, "");
      zip.file(`large/${baseName}_1024.webp`, file.webp.large.blob);
      zip.file(`medium/${baseName}_512.webp`, file.webp.medium.blob);
      zip.file(`icon/${baseName}_128.webp`, file.webp.icon.blob);
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
      {imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop.dataUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
        />
      )}

      <FileUploader onFiles={handleFiles} isConverting={isConverting} />
      <ImageConverterActions 
        onDownloadZip={handleDownloadZip}
        onClearAll={handleClearAll}
        hasFiles={convertedFiles.length > 0}
      />
      {convertedFiles.length > 0 && (
        <ImageList files={convertedFiles} onRemove={handleRemove} />
      )}
    </div>
  );
};
