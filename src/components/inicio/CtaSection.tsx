"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
    return (
        <section className="py-24 bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-6">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-secondary to-blue-900/50 shadow-2xl">
                    <div className="absolute inset-0 opacity-10">
                        <Image 
                            src="/banners/banner_3.jpg"
                            alt="Fondo abstracto"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
                        <div className="md:w-1/2 text-white text-center md:text-left mb-8 md:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Renueva tu Hogar, Renueva tu Vida</h2>
                            <p className="text-lg text-white/80 mb-8">
                                No esperes más para darle a tu hogar el estilo que se merece. Explora nuestras colecciones y encuentra la inspiración que necesitas.
                            </p>
                            <Link href="/productos">
                                <Button
                                    size="lg"
                                    className="bg-white text-secondary hover:bg-gray-100 py-4 px-8 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                                >
                                    Explorar Colecciones
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <div className="md:w-1/2 flex justify-center md:justify-end">
                            <div className="relative w-[300px] h-[225px] md:w-[400px] md:h-[300px] mt-8 md:mt-0">
                                <Image 
                                    src="/assets/muebles.png"
                                    alt="Muebles modernos"
                                    fill
                                    className="object-contain transform md:scale-125 md:translate-x-10 "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
