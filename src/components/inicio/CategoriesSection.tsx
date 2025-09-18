
import Image from "next/image"
import { getCategories } from "@/lib/categorias"

export async function CategoriesSection() {
  const categories = await getCategories()

  return (
    <section id="categories" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">
            Explora Nuestras{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Categorías
            </span>
          </h2>
          <p className="section-subtitle">
            Encuentra todo lo que necesitas para tu hogar, organizado para tu comodidad.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                className="group ingredient-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="icon-container-lg group-hover:scale-110">
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                </div>
                <h3 className="ingredient-title">{category.name}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
