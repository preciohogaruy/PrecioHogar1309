
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg sm:rounded-xl flex items-center justify-center">
                <Image src="/logotienda_blanco.svg" alt="PrecioHogar Logo" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PrecioHogar
              </div>
            </Link>
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            <h1 className="text-base sm:text-xl font-semibold text-gray-800 hidden md:block">Panel de Administración</h1>
          </div>

          <Link href="/">
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent px-2 sm:px-3">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Sitio</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
