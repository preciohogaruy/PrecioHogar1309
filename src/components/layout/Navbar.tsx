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
} from "lucide-react"

import { useCart } from "@/contexts/CartContext"
import Image from "next/image"
import { whatsappLink } from "@/lib/contacto"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../ui/button"

export function Navbar() {
  const [scrollY, setScrollY] = useState(0)
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { toggleCart, totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinkClasses = "nav-link group flex items-center space-x-2 text-gray-800"
  const dropdownItemClasses = "dropdown-item group"

  const productCategories = [
    { href: "/productos?category=Cocina", icon: Utensils, title: "Cocina", desc: "Electrodomésticos y utensilios", color: "orange-600" },
    { href: "/productos?category=Dormitorio", icon: Bed, title: "Dormitorio", desc: "Ropa de cama y decoración", color: "blue-600" },
    { href: "/productos?category=Baño", icon: Bath, title: "Baño", desc: "Accesorios y organización", color: "orange-600" },
    { href: "/productos?category=Sala", icon: Sofa, title: "Sala", desc: "Muebles y decoración", color: "blue-600" },
    { href: "/productos?category=Tecnología", icon: Wifi, title: "Tecnología", desc: "Smart home y gadgets", color: "orange-600" },
    { href: "/productos?category=Iluminación", icon: Lightbulb, title: "Iluminación", desc: "Lámparas y sistemas LED", color: "blue-600" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50
          ? "bg-white/98 backdrop-blur-xl border-b border-gray-100/50 shadow-lg shadow-gray-500/5"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
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

          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={navLinkClasses}>
              <Home className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span>INICIO</span>
              <span className="nav-underline"></span>
            </Link>

            <div className="relative group">
              <button
                className={navLinkClasses}
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <Package className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                <span>PRODUCTOS</span>
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${productsDropdownOpen ? "rotate-180" : ""}`}
                />
                <span className="nav-underline"></span>
              </button>

              <div
                className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-primary/10 border border-primary/20 transition-all duration-300 ${
                  productsDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                }`}
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {productCategories.map((cat) => (
                      <Link key={cat.title} href={cat.href} className={`${dropdownItemClasses}`}>
                        <cat.icon className={`w-5 h-5 text-${cat.color}`} />
                        <div>
                          <div className={`font-medium text-gray-800 group-hover:text-primary`}>{cat.title}</div>
                          <div className="text-xs text-gray-500">{cat.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-primary/10 pt-4 mt-4">
                    <Link href="/productos" className="dropdown-cta" onClick={() => setProductsDropdownOpen(false)}>
                      <span>Ver todos los productos</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/registro" className={navLinkClasses}>
              <User className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span>REGISTRO</span>
              <span className="nav-underline"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="nav-icon-btn group hidden sm:flex">
              <Search className="w-5 h-5 text-gray-600 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            </button>
            <Link href="/admin">
              <button className="nav-icon-btn group hidden sm:flex">
                <User className="w-5 h-5 text-gray-600 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              </button>
            </Link>
            <button className="nav-icon-btn group relative" onClick={toggleCart}>
              <ShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium shadow-lg border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide transition-all duration-300 hover:scale-105 shadow-lg group bg-primary text-white"
            >
              <Headphones className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              CONTACTAR
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="nav-icon-btn group">
                    <Menu className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors duration-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                       <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                          <Image
                            src="/logotienda_blanco.svg"
                            alt="PrecioHogar Logo"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          PrecioHogar
                        </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-4">
                     <Link href="/" className="mobile-nav-item group" onClick={() => setMobileMenuOpen(false)}>
                        <Home className="w-5 h-5 text-primary" />
                        <span>Inicio</span>
                      </Link>
                      <Link href="/productos" className="mobile-nav-item group" onClick={() => setMobileMenuOpen(false)}>
                        <Package className="w-5 h-5 text-primary" />
                        <span>Productos</span>
                      </Link>
                      <Link href="/registro" className="mobile-nav-item group" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-5 h-5 text-primary" />
                        <span>Registro</span>
                      </Link>
                      <a href="#about" className="mobile-nav-item group" onClick={() => setMobileMenuOpen(false)}>
                        <Award className="w-5 h-5 text-primary" />
                        <span>Nosotros</span>
                      </a>
                      <a href="#contact" className="mobile-nav-item group" onClick={() => setMobileMenuOpen(false)}>
                        <Mail className="w-5 h-5 text-primary" />
                        <span>Contacto</span>
                      </a>
                      <div className="pt-4 border-t border-primary/10">
                        <Button
                          asChild
                          className="w-full bg-primary text-primary-foreground"
                        >
                          <Link
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                             onClick={() => setMobileMenuOpen(false)}
                          >
                            <Headphones className="w-4 h-4 mr-2" />
                            CONTACTAR POR WHATSAPP
                          </Link>
                        </Button>
                      </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
