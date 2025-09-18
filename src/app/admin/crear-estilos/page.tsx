import { StyleGeneratorForm } from '@/components/admin/crear-estilos/StyleGeneratorForm';

export default function CreateStylePage() {
  return (
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
  );
}
