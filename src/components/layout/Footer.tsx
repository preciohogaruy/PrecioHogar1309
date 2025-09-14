
import Image from "next/image"
import Link from "next/link"

const footerLinks = [
  {
    title: "Productos",
    items: [
      { name: "Cocina", href: "#" },
      { name: "Dormitorio", href: "#" },
      { name: "Baño", href: "#" },
      { name: "Sala", href: "#" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { name: "Nuestra Historia", href: "#" },
      { name: "Calidad", href: "#" },
      { name: "Envíos", href: "#" },
      { name: "Garantía", href: "#" },
    ],
  },
  {
    title: "Soporte",
    items: [
      { name: "Contacto", href: "#" },
      { name: "WhatsApp", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Devoluciones", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Image
                  src="/logotienda.png"
                  alt="PrecioHogar Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PrecioHogar
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Los mejores productos para tu hogar con precios increíbles. Más de 10 años equipando hogares con calidad
              y confianza.
            </p>
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="social-icon">
                  <div className="w-4 h-4 bg-current rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-medium text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <a href={item.href} className="footer-link">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 PrecioHogar. Todos los derechos reservados. Hecho con ❤️ para tu hogar.
            </p>
            <Link href="/admin" className="text-gray-500 hover:text-gray-300 text-xs transition-colors duration-300">
              Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
