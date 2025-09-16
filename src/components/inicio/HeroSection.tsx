
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Home, Zap } from "lucide-react"
import { whatsappLink } from "@/lib/contacto"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    setIsVisible(true)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden text-white">
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="https://picsum.photos/seed/home-banner/1920/1080"
          alt="Banner de productos para el hogar"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`space-y-8 transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <div className="space-y-6">
              <p className="text-white/80 text-sm uppercase tracking-wider font-medium">
                Los mejores precios para tu hogar
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Equipamos tu
                <br />
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text relative">
                  Hogar Ideal
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none">
                    <path
                      d="M0 6C50 2 100 10 150 6C200 2 250 10 300 6"
                      stroke="url(#gradient-hero)"
                      strokeWidth="2"
                      className="animate-draw"
                    />
                    <defs>
                      <linearGradient id="gradient-hero" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--accent))" />
                        <stop offset="100%" stopColor="#FB8500" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed max-w-md">
              Descubre nuestra amplia gama de productos para el hogar con los mejores precios del mercado. Desde
              electrodomésticos hasta decoración, todo lo que necesitas en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/productos">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold group">
                  VER PRODUCTOS
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                  CONTACTAR
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" fill="hsl(var(--accent))" />
                ))}
              </div>
              <p className="text-sm text-gray-300">Más de 5,000+ clientes satisfechos</p>
            </div>
          </div>

          <div
            className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            <div className="relative group">
              <div className="aspect-square overflow-hidden rounded-3xl shadow-primary-lg">
                <Image
                  src="/logotienda.png"
                  alt="Productos para el hogar con los mejores precios"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-white/10"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

               <div className="floating-element -top-4 -right-4 bg-white/20 backdrop-blur-sm hidden md:flex">
                <Home className="w-6 h-6 text-white/80" />
              </div>
              <div className="floating-element -bottom-4 -left-4 animation-delay-500 bg-white/20 backdrop-blur-sm hidden md:flex">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
