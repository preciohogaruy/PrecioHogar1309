
import { ImageIcon, List, Shapes, Sparkles, Paintbrush } from 'lucide-react';
import ToolCard from '@/components/inicio/ToolCard';

export default function AdminPage() {
  return (
    <>
        <header className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-4">
                Bienvenido a tu Panel de Control
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Selecciona una de las herramientas a continuación para comenzar a gestionar tu aplicación de manera eficiente.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <ToolCard
            href="/imagen"
            icon={<ImageIcon className="w-8 h-8 text-primary" />}
            title="Mejorar Imagen"
            description="Optimiza tus imágenes convirtiéndolas al formato WebP para mejorar la velocidad de carga de tu sitio."
            linkText="Ir a la herramienta"
          />
          <ToolCard
            href="/admin/crear-prompt"
            icon={<Sparkles className="w-8 h-8 text-primary" />}
            title="Generador de Prompts"
            description="Crea prompts para la IA de imágenes, manteniendo un estilo visual consistente en todo el proyecto."
            linkText="Ir a la herramienta"
          />
           <ToolCard
            href="/admin/crear-estilos"
            icon={<Paintbrush className="w-8 h-8 text-primary" />}
            title="Extractor de Estilos"
            description="Sube una imagen de referencia y extrae su perfil de estilo (composición, iluminación, etc.) para replicarlo."
            linkText="Ir a la herramienta"
          />
          <ToolCard
            href="/admin/producto"
            icon={<List className="w-8 h-8 text-primary" />}
            title="Gestionar Productos"
            description="Gestiona productos, revisa estadísticas y administra el contenido de tu tienda desde un solo lugar."
            linkText="Ir al panel"
          />
           <ToolCard
            href="/admin/categorias"
            icon={<Shapes className="w-8 h-8 text-primary" />}
            title="Gestionar Categorías"
            description="Crea, edita y organiza las categorías de productos de tu tienda para una mejor estructura y navegación."
            linkText="Ir al panel"
          />
        </div>
    </>
  );
}
