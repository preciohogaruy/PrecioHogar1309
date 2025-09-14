
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const collections = [
  {
    image: "https://ik.imagekit.io/precioahorro/TiendaPrecioHogar/tr:w-400,h-400/pink-collection.jpg",
    title: "ILUMINACIÓN",
    subtitle: "Lámparas LED Inteligentes",
  },
  {
    image: "https://ik.imagekit.io/precioahorro/TiendaPrecioHogar/tr:w-400,h-400/modern-skincare.jpg",
    title: "COCINA",
    subtitle: "Electrodomésticos Modernos",
  },
  {
    image: "https://ik.imagekit.io/precioahorro/TiendaPrecioHogar/tr:w-400,h-400/luxury-collection.jpg",
    title: "DORMITORIO",
    subtitle: "Ropa de Cama Premium",
  },
]

export function FinalCtaSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-16">
          <h2 className="section-title">Descubre la diferencia que nuestros productos hacen en tu hogar</h2>
          <p className="section-subtitle">
            Encuentra el hogar perfecto con nuestros productos de alta calidad y diseño elegante.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {collections.map((collection, index) => (
            <div key={index} className="collection-card group">
              <div className="aspect-square overflow-hidden rounded-3xl">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="collection-overlay">
                <div className="collection-content">
                  <h3 className="collection-title">{collection.title}</h3>
                  <p className="collection-subtitle">{collection.subtitle}</p>
                </div>
                <div className="collection-arrow">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/productos">
          <Button className="btn-primary group">
            SHOP NOW
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
