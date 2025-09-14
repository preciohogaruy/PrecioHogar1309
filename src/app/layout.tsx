import type React from "react"
import type { Metadata } from "next"
import { CartProvider } from "@/contexts/CartContext"
import { CartSidebar } from "@/components/CartSidebar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "PrecioHogar - Los mejores productos para tu hogar",
  description: "Descubre nuestra amplia gama de productos para el hogar con los mejores precios del mercado.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: sans-serif;
}
        `}</style>
      </head>
      <body>
        <Suspense fallback={null}>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </Suspense>
      </body>
    </html>
  )
}
