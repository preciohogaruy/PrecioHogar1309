
import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Mantente al día</h2>
          <p className="text-white/90 text-lg">
            Suscríbete a nuestro newsletter para recibir ofertas exclusivas, nuevos productos y consejos para el
            hogar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Ingresa tu email" className="newsletter-input" />
            <Button className="newsletter-button">Suscribirse</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
