
import Image from "next/image"
import { Mail, ArrowRight } from "lucide-react"

export function NewsletterSection() {
  return (
    <section id="newsletter" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-secondary shadow-2xl p-12">
            <div className="absolute inset-0 opacity-10">
                <Image 
                    src="/banners/banner_4.jpg"
                    alt="Fondo abstracto"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="relative max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Únete a Nuestra Comunidad
                </h2>
                <p className="text-lg text-white/80 mb-8">
                    Suscríbete para recibir ofertas exclusivas, novedades y consejos de decoración directamente en tu correo.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            className="newsletter-input pl-12"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="newsletter-button flex items-center justify-center"
                    >
                        Suscribirme
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </form>
            </div>
        </div>
      </div>
    </section>
  )
}
