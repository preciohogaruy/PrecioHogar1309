import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Precio Hogar',
    short_name: 'PrecioHogar',
    description: 'Descubre nuestra amplia gama de productos para el hogar con los mejores precios del mercado.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#5c6bc0',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}