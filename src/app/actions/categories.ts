
'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function createCategory(formData: FormData) {
    const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        tag: formData.get('tag') as string,
    };

    try {
        await prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
                tag: data.tag.toUpperCase(),
            },
        });
        revalidatePath('/admin/categorias');
        return { success: true, error: null };
    } catch (error) {
        console.error('Error creating category:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('name')) {
            return {
              success: false,
              error: `La categoría con el nombre '${data.name}' ya existe.`
            };
          }
           if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('tag')) {
            return {
              success: false,
              error: `La etiqueta '${data.tag}' ya está en uso por otra categoría.`
            };
          }
        }
        return {
            success: false,
            error: 'No se pudo crear la categoría. Verifique los datos e inténtelo de nuevo.'
        };
    }
}


export async function updateCategory(formData: FormData) {
  const id = formData.get('id') as string;
  const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      tag: formData.get('tag') as string,
  };

  try {
      await prisma.category.update({
          where: { id: parseInt(id) },
          data: {
              name: data.name,
              description: data.description,
              tag: data.tag.toUpperCase(),
          },
      });
      revalidatePath('/admin/categorias');
      return { success: true, error: null };
  } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('name')) {
          return {
            success: false,
            error: `La categoría con el nombre '${data.name}' ya existe.`
          };
        }
         if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('tag')) {
          return {
            success: false,
            error: `La etiqueta '${data.tag}' ya está en uso por otra categoría.`
          };
        }
      }
      return {
          success: false,
          error: 'No se pudo actualizar la categoría.'
      };
  }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id: parseInt(id) },
        });
        revalidatePath('/admin/categorias');
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting category:', error);
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            return {
                success: false,
                error: 'No se puede eliminar la categoría porque tiene productos asociados.'
            };
        }
        return {
            success: false,
            error: 'No se pudo eliminar la categoría.'
        };
    }
}
