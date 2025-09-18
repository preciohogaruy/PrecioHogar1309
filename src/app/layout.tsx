import type React from "react";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { CartProvider } from "@/contexts/CartContext";
import { CartSidebar } from "@/components/CartSidebar";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const siteUrl = "https://preciohogaruy.netlify.app";

export const metadata: Metadata = {
  title: {
    default: "PrecioHogar - Calidad y Ahorro para tu Casa",
    template: "%s | PrecioHogar",
  },
  description: "Encuentra los mejores productos para tu hogar a precios increíbles. Calidad, variedad y las mejores ofertas en electrodomésticos, muebles, decoración y más.",
  metadataBase: new URL(siteUrl),
  keywords: ["hogar", "decoración", "muebles", "electrodomésticos", "cocina", "baño", "dormitorio", "ofertas", "comprar online"],
  authors: [{ name: "PrecioHogar Team", url: siteUrl }],
  creator: "PrecioHogar Team",
  publisher: "PrecioHogar",
  manifest: "/manifest.json", 
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "PrecioHogar - Calidad y Ahorro para tu Casa",
    description: "Encuentra los mejores productos para tu hogar a precios increíbles. Calidad, variedad y las mejores ofertas.",
    siteName: "PrecioHogar",
    images: [{
      url: `${siteUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: "Productos de PrecioHogar",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrecioHogar - Calidad y Ahorro para tu Casa",
    description: "Las mejores ofertas en productos para tu hogar están en PrecioHogar.",
    images: [`${siteUrl}/twitter-image.jpg`],
    creator: "@preciohogar",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Suspense fallback={null}>
              <CartProvider>
                {children}
                <CartSidebar />
              </CartProvider>
            </Suspense>
            <Toaster />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
