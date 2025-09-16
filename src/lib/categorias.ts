import prisma from './prisma'
import type { Category } from "@prisma/client";
import {
    Utensils,
    Bed,
    Bath,
    Sofa,
    Wifi,
    Lightbulb,
    type LucideIcon,
    type LucideProps,
  } from "lucide-react";
  
  export type CategoryWithIcon = Category & { icon: LucideIcon };
  export type CategoryWithStringIcon = Category & { icon: string };

const iconMap: { [key: string]: LucideIcon } = {
    "Hogar": Utensils,
    "Tecnología": Wifi,
    "Electrodomésticos": Lightbulb,
    "Herramientas": Sofa,
    "Muebles": Bed,
    "Juguetes": Bath,
    "Deportes": Utensils,
    "Moda": Utensils,
    "Salud y Belleza": Utensils,
    "Libros y Medios": Utensils,
    "Automotriz": Utensils,
    "Otros": Utensils,
};

const iconNameMap: { [key: string]: string } = {
  "Hogar": "Utensils",
  "Tecnología": "Wifi",
  "Electrodomésticos": "Lightbulb",
  "Herramientas": "Sofa",
  "Muebles": "Bed",
  "Juguetes": "Bath",
  "Deportes": "Utensils",
  "Moda": "Utensils",
  "Salud y Belleza": "Utensils",
  "Libros y Medios": "Utensils",
  "Automotriz": "Utensils",
  "Otros": "Utensils",
}


export const getIconForCategory = (iconName: string): React.FC<LucideProps> => {
    return iconMap[iconName] || Utensils;
}


export async function getCategories(): Promise<CategoryWithIcon[]> {
  const categories = await prisma.category.findMany()

  return categories.map(category => ({
    ...category,
    icon: iconMap[category.name] || Utensils,
  }))
}

export async function getCategoriesWithStringIcon(): Promise<CategoryWithStringIcon[]> {
    const categoriesWithIcon = await getCategories();
    
    return categoriesWithIcon.map(category => ({
        ...category,
        icon: iconNameMap[category.name] || 'Utensils'
    }));
}
