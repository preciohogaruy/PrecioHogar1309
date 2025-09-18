"use client"

import Image from "next/image"

export function ProductHero() {
  return (
    <section className="relative pt-40 pb-20 text-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/banners/banner_2.png"
          alt="Banner de la sección de productos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nuestros{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              Productos
            </span>
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed">
            Descubre nuestra amplia selección de productos para el hogar con los mejores precios del mercado.
          </p>
        </div>
      </div>
    </section>
  )
}
