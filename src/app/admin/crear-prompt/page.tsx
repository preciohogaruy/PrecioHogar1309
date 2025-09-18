import { AdminHeader } from '@/components/admin/AdminHeader';
import { PromptGeneratorForm } from '@/components/admin/crear-prompt/PromptGeneratorForm';

export default function CreatePromptPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Generador de Prompts con IA
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Crea prompts optimizados para generar imágenes consistentes con la identidad visual de tu marca.
                </p>
            </header>
            <PromptGeneratorForm />
        </div>
      </main>
    </div>
  );
}
