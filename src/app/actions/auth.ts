
'use server';

import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string | null;
    const address = formData.get('address') as string | null;
    const deliveryNotes = formData.get('deliveryNotes') as string | null;

    if (!name || !email || !password) {
        return { success: false, error: 'Los campos de nombre, email y contraseña son requeridos.' };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                deliveryNotes,
            },
        });

        return { success: true, error: null };

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('email')) {
            return {
              success: false,
              error: `El correo electrónico '${email}' ya está en uso.`
            };
          }
        }
        return {
            success: false,
            error: 'No se pudo registrar el usuario. Por favor, inténtelo de nuevo más tarde.'
        };
    }
}
