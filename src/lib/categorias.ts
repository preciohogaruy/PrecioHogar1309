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
  } from "lucide-react";
  
  export type CategoryWithIcon = Category & { icon: LucideIcon };

export async function getCategories(): Promise<CategoryWithIcon[]> {
  const categories = await prisma.category.findMany()

  const iconMap: { [key: string]: LucideIcon } = {
    Cocina: Utensils,
    Dormitorio: Bed,
    Baño: Bath,
    Sala: Sofa,
    Tecnología: Wifi,
    Iluminación: Lightbulb,
  };

  return categories.map(category => ({
    ...category,
    icon: iconMap[category.name] || Utensils,
  }))
}
