
"use client";

import { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CropIcon } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (blob: Blob | null) => void;
  onCancel: () => void;
}

function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.resolve(null);
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          resolve(null);
          return;
        }
        (blob as any).name = fileName;
        resolve(blob);
      },
      'image/jpeg',
      1
    );
  });
}

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        16 / 9, // O un aspect ratio por defecto, o dejarlo libre
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  async function handleCrop() {
    if (imgRef.current && crop?.width && crop?.height) {
      const croppedBlob = await getCroppedImg(
        imgRef.current,
        crop,
        'cropped-image.jpg'
      );
      onCropComplete(croppedBlob);
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Recortar Imagen</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            className="max-h-[70vh]"
          >
            <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Recortar" />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleCrop}>
            <CropIcon className="mr-2 h-4 w-4" />
            Recortar y Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
