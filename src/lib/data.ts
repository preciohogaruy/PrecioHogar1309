import type { Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    throw new Error(`Image with id "${id}" not found.`);
  }
  return image;
};

export const categories: Product['category'][] = ['Living Room', 'Bedroom', 'Kitchen'];

export const products: Product[] = [
  {
    id: 'lr-01',
    name: 'Sofá Azul Moderno',
    description: 'Un sofá azul elegante y cómodo, perfecto para cualquier sala de estar moderna. Tapizado con tela de alta calidad y construido para durar.',
    price: 499.99,
    category: 'Living Room',
    image: getImage('sofa-1'),
  },
  {
    id: 'lr-02',
    name: 'Sillón Amarillo',
    description: 'Un sillón vibrante que añade un toque de color a tu espacio. Su diseño ergonómico proporciona un excelente soporte.',
    price: 249.99,
    category: 'Living Room',
    image: getImage('chair-1'),
  },
  {
    id: 'lr-03',
    name: 'Mesa de Centro de Madera',
    description: 'Mesa de centro de madera maciza con un diseño minimalista. Ofrece un amplio espacio en la superficie para tus necesidades diarias.',
    price: 149.99,
    category: 'Living Room',
    image: getImage('table-1'),
  },
  {
    id: 'bd-01',
    name: 'Cama con Marco de Madera',
    description: 'Una cama resistente y elegante con un marco de madera de primera calidad. Diseñada para un sueño reparador y un estilo atemporal.',
    price: 399.99,
    category: 'Bedroom',
    image: getImage('bed-1'),
  },
  {
    id: 'bd-02',
    name: 'Cómoda Blanca',
    description: 'Cómoda espaciosa con un acabado blanco limpio. Cuenta con múltiples cajones para todas tus necesidades de almacenamiento.',
    price: 299.99,
    category: 'Bedroom',
    image: getImage('dresser-1'),
  },
  {
    id: 'bd-03',
    name: 'Lámpara de Noche Elegante',
    description: 'Una lámpara de noche moderna que proporciona una iluminación ambiental cálida. Perfecta para leer antes de dormir.',
    price: 79.99,
    category: 'Bedroom',
    image: getImage('lamp-1'),
  },
  {
    id: 'kt-01',
    name: 'Juego de Cubiertos Dorados',
    description: 'Eleva tu experiencia gastronómica con este lujoso juego de cubiertos dorados. Incluye tenedores, cuchillos, cucharas y cucharitas.',
    price: 89.99,
    category: 'Kitchen',
    image: getImage('cutlery-1'),
  },
  {
    id: 'kt-02',
    name: 'Juego de Platos de Cerámica',
    description: 'Juego de platos de cerámica duraderos y elegantes. Aptos para microondas y lavavajillas para tu comodidad.',
    price: 69.99,
    category: 'Kitchen',
    image: getImage('plate-1'),
  },
  {
    id: 'kt-03',
    name: 'Olla de Cocina Moderna',
    description: 'Una olla de cocina de alta calidad con superficie antiadherente. Esencial para cualquier cocina moderna.',
    price: 129.99,
    category: 'Kitchen',
    image: getImage('pot-1'),
  },
];
