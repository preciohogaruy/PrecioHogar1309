
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Truck, Heart } from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Calidad",
    desc: "Productos certificados y con garantía extendida",
  },
  {
    icon: Truck,
    title: "Envío Rápido",
    desc: "Entrega en 24-48 horas en toda la ciudad",
  },
  {
    icon: Heart,
    title: "Satisfacción",
    desc: "Más de 5,000 clientes satisfechos nos respaldan",
  },
]

export function ProductShowcaseSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative group order-2 lg:order-1">
            <div className="aspect-square overflow-hidden rounded-3xl shadow-primary-lg">
              <Image
                src="/banners/logo_horizontal.png"
                alt="Productos modernos para el hogar con diseño elegante"
                width={600}
                height={600}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <p className="text-primary text-sm uppercase tracking-wider font-medium">Nuestra Historia</p>
              <h2 className="section-title text-left">Más de 5 años equipando hogares</h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Desde 2020, nos dedicamos a ofrecer los mejores productos para el hogar con precios increíbles. Nuestra
              misión es hacer que cada hogar sea un lugar especial y funcional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((item, index) => (
                <div key={index} className="benefit-card group">
                  <div className="icon-container">
                    <item.icon className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button className="btn-primary group">
              CONOCER MÁS
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
