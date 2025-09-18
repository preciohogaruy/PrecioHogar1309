
'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, List, Shapes } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/producto", label: "Productos", icon: List },
  { href: "/admin/categorias", label: "Categorías", icon: Shapes },
];

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
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

        <nav className="border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors",
                                isActive 
                                    ? "border-primary text-primary" 
                                    : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground"
                            )}
                        >
                            <link.icon className="w-4 h-4" />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
      </div>
    </header>
  );
}
