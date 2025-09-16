
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Award,
  ArrowRight,
  Bath,
  Bed,
  ChevronDown,
  Headphones,
  Home,
  Lightbulb,
  Mail,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sofa,
  User,
  Utensils,
  Wifi,
  X,
} from "lucide-react"

import { useCart } from "@/contexts/CartContext"
import Image from "next/image"
import { whatsappLink } from "@/lib/contacto"

export function Navbar() {
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)

  const { toggleCart, totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50
          ? "bg-white/98 backdrop-blur-xl border-b border-blue-100/50 shadow-lg shadow-blue-500/5"
          : "bg-white/95 backdrop-blur-md border-b border-blue-100"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo with enhanced animation */}
          <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <Image
                src="/logotienda.png"
                alt="PrecioHogar Logo"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              PrecioHogar
            </div>
          </Link>

          {/* Desktop Menu with dropdowns and icons */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Home */}
            <Link href="/" className="nav-link group flex items-center space-x-2">
              <Home className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <span>INICIO</span>
              <span className="nav-underline"></span>
            </Link>

            {/* Products Dropdown */}
            <div className="relative group">
              <button
                className="nav-link flex items-center space-x-2"
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <Package className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <span>PRODUCTOS</span>
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${productsDropdownOpen ? "rotate-180" : ""}`}
                />
                <span className="nav-underline"></span>
              </button>

              {/* Products Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-80 bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100/50 transition-all duration-300 ${
                  productsDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                }`}
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <a href="#cocina" className="dropdown-item group">
                      <Utensils className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-blue-600">Cocina</div>
                        <div className="text-xs text-gray-500">Electrodomésticos y utensilios</div>
                      </div>
                    </a>
                    <a href="#dormitorio" className="dropdown-item group">
                      <Bed className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-purple-600">Dormitorio</div>
                        <div className="text-xs text-gray-500">Ropa de cama y decoración</div>
                      </div>
                    </a>
                    <a href="#baño" className="dropdown-item group">
                      <Bath className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-blue-600">Baño</div>
                        <div className="text-xs text-gray-500">Accesorios y organización</div>
                      </div>
                    </a>
                    <a href="#sala" className="dropdown-item group">
                      <Sofa className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-purple-600">Sala</div>
                        <div className="text-xs text-gray-500">Muebles y decoración</div>
                      </div>
                    </a>
                    <a href="#tecnologia" className="dropdown-item group">
                      <Wifi className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-blue-600">Tecnología</div>
                        <div className="text-xs text-gray-500">Smart home y gadgets</div>
                      </div>
                    </a>
                    <a href="#iluminacion" className="dropdown-item group">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-purple-600">Iluminación</div>
                        <div className="text-xs text-gray-500">Lámparas y sistemas LED</div>
                      </div>
                    </a>
                  </div>
                  <div className="border-t border-blue-100 pt-4 mt-4">
                    <Link href="/productos" className="dropdown-cta">
                      <span>Ver todos los productos</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="nav-icon-btn group hidden sm:flex">
              <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
            </button>

            {/* User Account */}
            <button className="nav-icon-btn group hidden sm:flex">
              <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
            </button>

            <button className="nav-icon-btn group relative" onClick={toggleCart}>
              <ShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA Button - highlighted call to action */}
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide transition-all duration-300 hover:scale-105 shadow-lg group"
              style={{
                background: "linear-gradient(to right, #2563eb, #9333ea)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(to right, #1d4ed8, #7c3aed)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(to right, #2563eb, #9333ea)"
              }}
            >
              <Headphones className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              CONTACTAR POR WHATSAPP
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* Mobile Menu Button */}
            <button className="lg:hidden nav-icon-btn group" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? "max-h-screen opacity-100 py-6 border-t border-blue-100" : "max-h-0 opacity-0 py-0 overflow-hidden"
          }`}
        >
          <div className="space-y-4">
            <Link href="/" className="mobile-nav-item group">
              <Home className="w-5 h-5 text-blue-600" />
              <span>Inicio</span>
            </Link>
            <Link href="/productos" className="mobile-nav-item group">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Productos</span>
            </Link>
            <a href="#about" className="mobile-nav-item group">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Nosotros</span>
            </a>
            <a href="#contact" className="mobile-nav-item group">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>Contacto</span>
            </a>
            <div className="pt-4 border-t border-blue-100">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide transition-all duration-300 hover:scale-105 shadow-lg group"
                style={{
                  background: "linear-gradient(to right, #2563eb, #9333ea)",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(to right, #1d4ed8, #7c3aed)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(to right, #2563eb, #9333ea)"
                }}
              >
                <Headphones className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                CONTACTAR POR WHATSAPP
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
