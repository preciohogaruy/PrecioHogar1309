# Guía de Imágenes del Proyecto

Este documento detalla todas las imágenes necesarias para el proyecto, incluyendo sus ubicaciones, tamaños recomendados y formatos.

## Estructura de Carpetas

Todas las imágenes deben colocarse dentro de la carpeta `public/`. Se recomienda la siguiente estructura:

```
public/
├── assets/
├── banners/
├── categorias/
├── fondos/
├── icons/
└── logotienda.png
└── logotienda_blanco.svg
```

---

## 1. Logotipos

| Archivo | Ubicación | Tamaño Recomendado | Formato | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `logotienda.png` | `public/` | 128x128 px | PNG | Cabecera del panel de administración. |
| `logotienda_blanco.svg` | `public/` | Vectorial | SVG | Logo principal en la web y página de registro. |
| `logo_horizontal_inicio_con_fondo.svg`| `public/fondos/` | Vectorial | SVG | Incrustado en imágenes generadas por la herramienta "Mejorar Imagen". |

---

## 2. Banners Decorativos

Estas imágenes se usan como fondos y elementos visuales clave.

| Archivo | Ubicación | Tamaño Recomendado | Formato | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `banner_1.jpg` | `public/banners/` | 1920x1080 px | JPG | Fondo de la sección principal (HeroSection). |
| `banner_2.png` | `public/banners/` | 1920x600 px | PNG/JPG | Cabecera de la página de listado de productos. |
| `banner_3.jpg` | `public/banners/` | 1920x800 px | JPG | Fondo de la sección de llamada a la acción (CtaSection). |
| `banner_4.jpg` | `public/banners/` | 1920x800 px | JPG | Fondo de la sección de suscripción al boletín. |
| `banner_registro.jpg`| `public/banners/` | 800x1200 px | JPG | Banner vertical en la página de registro (solo para escritorio). |

---

## 3. Iconos de Aplicación (PWA)

Estos iconos son cruciales para la experiencia de "instalar" la web como una aplicación en dispositivos móviles y de escritorio. Deben ubicarse en `public/icons/`.

| Archivo | Tamaño | Formato | Propósito |
| :--- | :--- | :--- | :--- |
| `icon-72x72.png` | 72x72 px | PNG | Icono para Android (versiones antiguas). |
| `icon-96x96.png` | 96x96 px | PNG | Icono para Android (versiones antiguas). |
| `icon-128x128.png` | 128x128 px | PNG | Icono estándar. |
| `icon-144x144.png` | 144x144 px | PNG | Icono para Tile de Windows. |
| `icon-152x152.png` | 152x152 px | PNG | Icono para iPad (pantalla no-retina). |
| `icon-192x192.png` | 192x192 px | PNG | Icono principal de PWA. **Debe ser "maskable"**. |
| `icon-384x384.png` | 384x384 px | PNG | Icono de mayor resolución. |
| `icon-512x512.png` | 512x512 px | PNG | Icono para la pantalla de bienvenida (splash screen) de Android. |
| `apple-touch-icon.png` | 180x180 px | PNG | Icono para la pantalla de inicio de iOS. |

---

## 4. Imágenes de Contenido y Assets

| Archivo | Ubicación | Tamaño Recomendado | Formato | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `muebles.png` | `public/assets/` | 600x450 px | PNG | Imagen de muebles con fondo transparente en `CtaSection`. |
| `fondo_productos.svg` | `public/fondos/` | Vectorial | SVG | Fondo para las imágenes generadas con la herramienta "Mejorar Imagen". |

---

## 5. Imágenes de Categorías

Estas imágenes se utilizan para representar visualmente cada categoría de producto en diferentes partes del sitio.

| Archivo | Ubicación | Tamaño Recomendado | Formato | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `baño.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Baño". |
| `dormitorio.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Dormitorio". |
| `herramientas.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Herramientas". |
| `otros.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Otros". |
| `cuidado-personal.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Cuidado Personal". |
| `hogar.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Hogar". |
| `cocina.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Cocina". |
| `tecnologia.jpg` | `public/categorias/` | 512x512 px | JPG | Imagen para la categoría "Tecnología". |

---

## 6. Imágenes de Productos

Las imágenes de los productos se gestionan desde el panel de administración y se guardan en la base de datos. Sin embargo, para una carga inicial de datos (`seed`), puedes colocar imágenes de ejemplo en `public/productos/` y referenciarlas en tus archivos de seeding.

*   **Recomendación**: Utiliza imágenes cuadradas con una resolución de al menos `800x800` píxeles para asegurar una buena calidad en los zooms y vistas de detalle.

---

## 7. Prompt para Generación de Imágenes con IA

Para mantener una coherencia visual en todas las imágenes generadas por inteligencia artificial (como Midjourney, DALL-E, etc.), utiliza el siguiente prompt como base.

### Prompt Base

```
Fotografía de producto profesional para e-commerce, [descripción del producto o concepto], con una paleta de colores que mezcla azul marino (navy blue), azul/púrpura vibrante y acentos en amarillo dorado. El producto debe estar bien iluminado, con un enfoque nítido sobre un fondo minimalista de color blanco o gris claro. Estilo limpio, moderno y de alta calidad, con sombras suaves.
```

### Paleta de Colores del Proyecto

*   **Principal**: Azul marino (navy blue), azul/púrpura vibrante.
*   **Acento**: Amarillo dorado brillante.
*   **Neutrales**: Blancos puros, grises claros.

### Ejemplos de Aplicación

*   **Para un banner**: `Banner cinematográfico para e-commerce de productos del hogar, mostrando una sala de estar moderna. Paleta de colores de azul marino, púrpura vibrante y acentos en amarillo dorado, con iluminación cálida y profesional.`
*   **Para una categoría**: `Icono visual para categoría 'Tecnología', una composición abstracta con formas geométricas y circuitos. Paleta de colores de azul marino, azul/púrpura vibrante y acentos en amarillo dorado, estilo minimalista y futurista.`
*   **Para un producto**: `Fotografía de producto profesional para e-commerce de un set de herramientas manuales organizadas sobre una superficie de madera. Paleta de colores de azul marino, gris y acentos en amarillo dorado, fondo limpio y moderno.`
```
