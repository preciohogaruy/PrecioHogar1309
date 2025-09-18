"use client";

import { Button } from '@/components/ui/button';
import { Package, Trash2 } from 'lucide-react';

interface ImageConverterActionsProps {
  onDownloadZip: () => void;
  onClearAll: () => void;
  hasFiles: boolean;
}

export default function ImageConverterActions({ onDownloadZip, onClearAll, hasFiles }: ImageConverterActionsProps) {
  if (!hasFiles) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Button onClick={onDownloadZip} disabled={!hasFiles}>
        <Package className="mr-2 h-4 w-4" />
        Descargar todo (.zip)
      </Button>
      <Button variant="outline" onClick={onClearAll}>
        <Trash2 className="mr-2 h-4 w-4" />
        Limpiar todo
      </Button>
    </div>
  );
}
