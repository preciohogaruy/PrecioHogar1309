
import { Award, Clock, Package, Shield } from "lucide-react"

const features = [
  {
    icon: <Award className="w-8 h-8 text-blue-600" />,
    title: "Calidad Garantizada",
    description: "Solo los mejores materiales para asegurar durabilidad y confort en cada producto.",
  },
  {
    icon: <Package className="w-8 h-8 text-blue-600" />,
    title: "Variedad Insuperable",
    description: "Un catálogo extenso para que siempre encuentres lo que buscas para tu espacio.",
  },
  {
    icon: <Shield className="w-8 h-8 text-blue-600" />,
    title: "Compra Segura",
    description: "Tu información está protegida. Compra con total confianza y tranquilidad.",
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-600" />,
    title: "Entrega Rápida",
    description: "Recibe tus productos en la puerta de tu casa en tiempo récord, listos para usar.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">
            ¿Por Qué Elegir{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              PrecioHogar
            </span>
            ?
          </h2>
          <p className="section-subtitle">
            Nos comprometemos a ofrecerte la mejor experiencia de compra, con productos de alta calidad y un servicio
            excepcional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group feature-card animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="icon-container group-hover:scale-110">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
