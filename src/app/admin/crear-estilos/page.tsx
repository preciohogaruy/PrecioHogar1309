import { AdminHeader } from '@/components/admin/AdminHeader';
import { StyleGeneratorForm } from '@/components/admin/crear-estilos/StyleGeneratorForm';

export default function CreateStylePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Extractor de Estilos de Imagen con IA
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Sube una imagen de referencia para que la IA analice su estilo, composición, iluminación y atmósfera. Genera un perfil JSON listo para usar en tus prompts.
                </p>
            </header>
            <StyleGeneratorForm />
        </div>
      </main>
    </div>
  );
}
