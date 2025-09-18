'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, User, Mail, Lock, ArrowRight, ArrowLeft, PartyPopper, Phone, MapPin, Clock } from 'lucide-react';
import { registerUser } from '@/app/actions/auth';

const registroFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  email: z.string().email('Por favor, introduce un correo electrónico válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  phone: z.string().optional(),
  address: z.string().optional(),
  deliveryNotes: z.string().optional(),
});

type RegistroFormValues = z.infer<typeof registroFormSchema>;

export function RegistroForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      deliveryNotes: '',
    },
  });

  const nextStep = async () => {
    const result = await form.trigger(["name", "email", "password"]);
    if (result) {
      setStep(2);
    }
  }

  const prevStep = () => {
    setStep(1);
  }

  const onSubmit = async (values: RegistroFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {serverError && (
                  <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
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
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-primary text-primary-foreground"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div
              key="step2"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="p-4 bg-orange-50 border-l-4 border-primary rounded-r-lg">
                <h4 className="font-semibold text-orange-800">Un último paso (¡opcional!)</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Completar tu información de envío ahora te ahorrará tiempo en futuras compras. Si prefieres, puedes omitir este paso y añadirla directamente en tu primer pedido.
                </p>
              </div>

              <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                              <Input placeholder="Tu número de contacto" {...field} className="pl-10"/>
                          </FormControl>
                      </div>
                      <FormMessage />
                  </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Dirección de Envío</FormLabel>
                      <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                              <Input placeholder="Calle, número, ciudad..." {...field} className="pl-10"/>
                          </FormControl>
                      </div>
                      <FormMessage />
                  </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="deliveryNotes"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Preferencias de Entrega</FormLabel>
                       <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                              <Textarea placeholder="Ej: Lunes a Viernes de 9 a 18 hs. Dejar en portería." {...field} className="pl-10"/>
                          </FormControl>
                      </div>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PartyPopper className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? 'Finalizando...' : 'Completar Registro'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
}
