"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative pt-32 sm:pt-48 pb-24 sm:pb-32 text-center text-white overflow-hidden bg-gray-900">
            <div className="absolute inset-0 z-0 opacity-40">
                <Image 
                    src="/banners/banner_1.png"
                    alt="Fondo de productos para el hogar"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div
                        className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 w-fit mx-auto mb-6 animate-fade-in-up"
                    >
                        <Star className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-medium">Más de 10,000 clientes satisfechos</span>
                    </div>

                    <h1 
                        className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        El Hogar de tus Sueños, a un{" "}
                        <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                            Precio Real
                        </span>
                    </h1>
                    
                    <p 
                        className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 mb-10 animate-fade-in-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        Descubre nuestra amplia gama de productos para el hogar con los mejores precios del mercado. Calidad, estilo y ahorro en un solo lugar.
                    </p>
                </div>
            </div>

            {/* Elementos decorativos flotantes */}
            <div className="absolute top-1/4 left-10 floating-element bg-accent/20 hidden md:flex" style={{ animationDelay: '1s' }}>
                <TrendingUp className="w-6 h-6 text-blue-300" />
            </div>
            <div className="absolute top-1/2 right-12 floating-element bg-primary/20 hidden md:flex" style={{ animationDelay: '1.5s' }}>
                <Star className="w-6 h-6 text-orange-300" />
            </div>
            <div className="absolute bottom-1/4 left-20 floating-element bg-yellow-500/20 hidden md:flex" style={{ animationDelay: '2s' }}>
                <ShoppingBag className="w-6 h-6 text-yellow-300" />
            </div>
        </section>
    )
}
