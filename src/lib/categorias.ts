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
    Cocina: Utensils,
    Dormitorio: Bed,
    Baño: Bath,
    Sala: Sofa,
    Tecnología: Wifi,
    Iluminación: Lightbulb,
};
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
    const categories = await prisma.category.findMany();
    
    return categories.map(category => ({
        ...category,
        icon: Object.keys(iconMap).find(key => iconMap[key] === (iconMap[category.name] || Utensils)) || 'Utensils'
    }));
}