
import { ImageIcon, LayoutDashboardIcon, List, Shapes } from 'lucide-react';
import HomePageHeader from '@/components/inicio/HomePageHeader';
import ToolCard from '@/components/inicio/ToolCard';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-6 py-8">
        <header className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-4">
                Bienvenido a tu Panel de Control
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Selecciona una de las herramientas a continuación para comenzar a gestionar tu aplicación de manera eficiente.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <ToolCard
            href="/imagen"
            icon={<ImageIcon className="w-8 h-8 text-primary" />}
            title="Mejorar Imagen"
            description="Optimiza tus imágenes convirtiéndolas al formato WebP para mejorar la velocidad de carga de tu sitio."
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
      </main>
    </div>
  );
}
