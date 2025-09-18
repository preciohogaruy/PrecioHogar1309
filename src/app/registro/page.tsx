
import Link from "next/link";
import { RegistroForm } from "@/components/auth/RegistroForm";
import Image from "next/image";

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
            <Link href="/" className="flex items-center space-x-2 mb-8 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <Image
                        src="/logotienda_blanco.svg"
                        alt="PrecioHogar Logo"
                        width={40}
                        height={40}
                        className="w-5 h-5"
                    />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    PrecioHogar
                </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear una cuenta</h1>
            <p className="text-gray-600 mb-8">
                Únete para descubrir ofertas increíbles para tu hogar.
            </p>
            <RegistroForm />
            <p className="text-center text-sm text-gray-600 mt-8">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/admin" className="font-medium text-secondary hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
        <div className="hidden md:block md:w-1/2 relative">
            <Image 
                src="/banners/banner_registro.jpg" 
                alt="Banner de registro" 
                fill
                className="object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30"></div>
        </div>
      </div>
    </div>
  );
}
