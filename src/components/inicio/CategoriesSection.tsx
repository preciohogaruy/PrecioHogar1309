
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getCategories, type CategoryWithIcon } from "@/lib/categorias";

export async function CategoriesSection() {
  const categories = await getCategories();
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-16">
          <h2 className="section-title">Productos para cada rincón de tu hogar</h2>
          <p className="section-subtitle">
            Desde la cocina hasta el dormitorio, tenemos todo lo que necesitas para crear el hogar de tus sueños.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.slice(0, 4).map((item, index) => (
            <div key={index} className="ingredient-card group">
              <div className="icon-container-lg">
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="ingredient-title">{item.name.toUpperCase()}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <Link href="/productos">
          <Button className="btn-primary group">
            VER TODOS LOS PRODUCTOS
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
