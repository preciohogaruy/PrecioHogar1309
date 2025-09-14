
'use client';

import { Utensils, Bed, Bath, Sofa, Laptop, HeartPulse, Wrench, MoreHorizontal, LucideIcon } from "lucide-react";
import productsData from "@/contexts/productos.json";

export interface Category {
  name: string;
  icon: LucideIcon;
  description: string;
}

const iconMap: Record<string, LucideIcon> = {
  "Hogar": Sofa,
  "Tecnologia": Laptop,
  "Cuidado Personal": HeartPulse,
  "Herramientas": Wrench,
  "Otros": MoreHorizontal,
  "Cocina": Utensils,
  "Dormitorio": Bed,
  "Baño": Bath,
};

const descriptionMap: Record<string, string> = {
  "Hogar": "Todo lo que necesitas para tu casa.",
  "Tecnologia": "Lo último en tecnología y gadgets.",
  "Cuidado Personal": "Productos para tu bienestar y belleza.",
  "Herramientas": "Las mejores herramientas para tus proyectos.",
  "Otros": "Descubre una variedad de productos.",
  "Cocina": "Electrodomésticos, utensilios y accesorios.",
  "Dormitorio": "Ropa de cama, almohadas y decoración.",
  "Baño": "Accesorios, organización y productos.",
};


const uniqueCategories = [...new Set(productsData.products.map(p => p.category))];

export const categories: Category[] = uniqueCategories.map(name => ({
  name: name,
  icon: iconMap[name] || MoreHorizontal,
  description: descriptionMap[name] || "Descubre nuestros productos."
}));
