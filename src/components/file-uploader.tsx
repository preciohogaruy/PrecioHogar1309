"use client";

import { useState, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFiles: (files: File[]) => void;
  isConverting: boolean;
}

const FileUploader = ({ onFiles, isConverting }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const acceptedFiles = Array.from(files).filter(
      file => file.type === 'image/jpeg' || file.type === 'image/png'
    );

    if (acceptedFiles.length !== files.length) {
      toast({
        variant: 'destructive',
        title: 'Formato no válido',
        description: 'Por favor, sube solo imágenes en formato PNG o JPG.',
      });
    }

    if (acceptedFiles.length > 0) {
      onFiles(acceptedFiles);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFiles]);

  const handleClick = () => {
    if(!isConverting) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out",
        isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
        isConverting ? "cursor-wait opacity-70" : "cursor-pointer"
      )}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={isConverting}
      />
      {isConverting ? (
        <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
            <p className="text-lg text-foreground">Convirtiendo imágenes...</p>
            <p className="text-sm text-muted-foreground">Esto puede tardar unos segundos.</p>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">
            Arrastra y suelta tus imágenes aquí
          </p>
          <p className="text-muted-foreground">o haz clic para seleccionarlas</p>
          <p className="text-xs text-muted-foreground mt-2">Soporta PNG y JPG</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
