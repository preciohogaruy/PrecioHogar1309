import type { ImagePlaceholder } from './placeholder-images';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Living Room' | 'Bedroom' | 'Kitchen';
  image: ImagePlaceholder;
}
