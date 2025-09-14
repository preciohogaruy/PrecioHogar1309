
import { Shield, Truck, CreditCard, Clock, Headphones, Heart } from "lucide-react"

const features = [
  { icon: Shield, title: "CALIDAD\nGARANTIZADA", delay: "0ms" },
  { icon: Truck, title: "ENVÍO\nGRATIS", delay: "100ms" },
  { icon: CreditCard, title: "PAGO\nSEGURO", delay: "200ms" },
  { icon: Clock, title: "ENTREGA\nRÁPIDA", delay: "300ms" },
  { icon: Headphones, title: "SOPORTE\n24/7", delay: "400ms" },
  { icon: Heart, title: "HECHO CON\nAMOR", delay: "500ms" },
]

export function FeaturesSection() {
  return (
    <section id="about" className="py-20 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in-up">
            Los mejores productos para tu hogar a precios increíbles
          </h2>
          <p className="section-subtitle animate-fade-in-up animation-delay-200">
            Calidad garantizada, envío rápido y atención personalizada para hacer de tu hogar el lugar perfecto.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group animate-fade-in-up"
              style={{ animationDelay: feature.delay }}
            >
              <div className="icon-container">
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="feature-text">{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
