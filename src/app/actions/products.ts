'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

/**
 * Genera un nuevo ID de producto correlativo para una categoría específica.
 * @param categoryTag - El tag de 3 letras de la categoría (ej. 'HOG').
 * @returns El nuevo ID de producto (ej. 'HOG001').
 */
export async function generateNewProductId(categoryTag: string): Promise<string> {
  const lastProduct = await prisma.product.findFirst({
    where: {
      productId: {
        startsWith: categoryTag,
      },
    },
    orderBy: {
      productId: 'desc',
    },
    select: {
      productId: true,
    },
  });

  let newNumber = 1;
  if (lastProduct) {
    const lastNumber = parseInt(lastProduct.productId.replace(categoryTag, ''), 10);
    newNumber = lastNumber + 1;
  }

  const newProductId = `${categoryTag}${String(newNumber).padStart(3, '0')}`;
  return newProductId;
}

export async function checkProductExistsByDescription(description: string): Promise<boolean> {
    const product = await prisma.product.findFirst({
      where: {
        description: {
          equals: description,
          mode: 'insensitive',
        },
        isActive: true,
      },
    });
    return !!product;
}

export async function createProduct(formData: FormData) {
    const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        quantity: Number(formData.get('quantity')),
        rating: Number(formData.get('rating')),
        badge: formData.get('badge') as string | undefined,
        productId: formData.get('productId') as string,
        categoryId: Number(formData.get('categoryId')),
        isActive: formData.get('isActive') === 'true',
    };

    const imageFile = formData.get('imageFile') as File | null;
    let imageString: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const imageBuffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      imageString = `data:${imageFile.type};base64,${base64Image}`;
    }

    try {
        await prisma.product.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                image: imageString,
                rating: data.rating,
                badge: data.badge || '',
                productId: data.productId,
                categoryId: data.categoryId,
                isActive: data.isActive,
            },
        });
        revalidatePath('/admin/producto');
        return { success: true, error: null };
    } catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('productId')) {
            return {
              success: false,
              error: `El ID de producto '${data.productId}' ya existe. Por favor, elige una categoría diferente o contacta a soporte.`
            };
          }
        }
        return {
            success: false,
            error: 'No se pudo crear el producto. Verifique los datos e inténtelo de nuevo.'
        };
    }
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      quantity: Number(formData.get('quantity')),
      badge: formData.get('badge') as string | undefined,
      categoryId: Number(formData.get('categoryId')),
  };

  try {
      await prisma.product.update({
          where: { id: parseInt(id) },
          data: {
              title: data.title,
              description: data.description,
              price: data.price,
              quantity: data.quantity,
              badge: data.badge || '',
              categoryId: data.categoryId,
          },
      });
      revalidatePath('/admin/producto');
      return { success: true, error: null };
  } catch (error) {
      console.error('Error updating product:', error);
      return {
          success: false,
          error: 'No se pudo actualizar el producto.'
      };
  }
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                isActive: !currentStatus,
            },
        });
        revalidatePath('/admin/producto');
        return { success: true, error: null };
    } catch (error) {
        console.error('Error toggling product status:', error);
        return {
            success: false,
            error: 'No se pudo cambiar el estado del producto.'
        };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });
        revalidatePath('/admin/producto');
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting product:', error);
        return {
            success: false,
            error: 'No se pudo eliminar el producto.'
        };
    }
}
