export type WebPVariant = {
  blob: Blob;
  size: number;
  url: string;
};

export type ConvertedFile = {
  id: string;
  originalName: string;
  originalSize: number;
  previewUrl: string;
  webp: {
    large: WebPVariant;
    medium: WebPVariant;
    icon: WebPVariant;
  };
};
