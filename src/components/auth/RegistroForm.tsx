
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, User, Mail, Lock } from 'lucide-react';
import { registerUser } from '@/app/actions/auth';

const registroFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  email: z.string().email('Por favor, introduce un correo electrónico válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

type RegistroFormValues = z.infer<typeof registroFormSchema>;

export function RegistroForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegistroFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const result = await registerUser(formData);

    if (result?.error) {
        setServerError(result.error);
        toast({
            variant: 'destructive',
            title: 'Error en el registro',
            description: result.error,
        });
        setIsSubmitting(false);
    } else {
        toast({
          title: '¡Registro exitoso!',
          description: 'Bienvenido/a a PrecioHogar. Serás redirigido.',
        });
        router.push('/');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
        {serverError && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error del Servidor</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
            </Alert>
        )}

        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input placeholder="Ej: Maria Lopez" {...field} className="pl-10"/>
                    </FormControl>
                </div>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input type="email" placeholder="tu@correo.com" {...field} className="pl-10"/>
                    </FormControl>
                </div>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input type="password" placeholder="Mínimo 8 caracteres" {...field} className="pl-10"/>
                    </FormControl>
                </div>
                <FormMessage />
            </FormItem>
            )}
        />

        <div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSubmitting ? 'Registrando...' : 'Crear mi cuenta'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
