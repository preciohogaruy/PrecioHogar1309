'use server';
/**
 * @fileOverview Un agente de IA para generar prompts para la creación de imágenes, optimizado para múltiples plataformas.
 *
 * - generateImagePrompt - Una función que maneja la generación de prompts para imágenes.
 * - GenerateImagePromptInput - El tipo de entrada para la función.
 * - GenerateImagePromptOutput - El tipo de retorno para la función, que incluye prompts para Gemini y Whisk.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import profiles from './image-prompt-profiles.json';
import products from './productos-image-prompt.json';

// Definir el tipo para un perfil individual basado en la estructura del JSON
const ImagePromptProfileSchema = z.object({
  style: z.string(),
  composition: z.string(),
  lighting: z.string(),
  mood: z.string(),
  extras: z.string().optional(),
  offer: z.object({
    discount: z.string(),
    description: z.string()
  }).optional(),
  callToAction: z.object({
    text: z.string(),
    type: z.string()
  }).optional(),
  contact: z.object({
    phone: z.string(),
    website: z.string()
  }).optional(),
  products_showcased: z.union([z.array(z.string()), z.literal("from_catalog")]).optional()
});

type ImagePromptProfile = z.infer<typeof ImagePromptProfileSchema>;

// Cargar y validar los perfiles usando Zod
const loadedProfiles = z.record(ImagePromptProfileSchema).parse(profiles);
const productCatalog = z.array(z.object({title: z.string(), category: z.string(), description: z.string()})).parse(products);


const GenerateImagePromptInputSchema = z.object({
  componentType: z.string().describe('El componente o tipo de escena para la que se necesita la imagen (ej: Hero Section, Product Card).'),
  userDescription: z.string().describe('Una descripción simple del usuario sobre lo que debe contener la imagen.'),
});
export type GenerateImagePromptInput = z.infer<typeof GenerateImagePromptInputSchema>;

const GenerateImagePromptOutputSchema = z.object({
  geminiPrompt: z.string().describe('El prompt detallado y optimizado para un modelo como Gemini (Nano Banana), enfocado en un estilo fotográfico y cinematográfico.'),
  whiskPrompt: z.string().describe('Un prompt estructurado para Whisk de Google, detallando "asunto", "escena" y "estilo".'),
});
export type GenerateImagePromptOutput = z.infer<typeof GenerateImagePromptOutputSchema>;

export async function generateImagePrompt(input: GenerateImagePromptInput): Promise<GenerateImagePromptOutput> {
  return generateImagePromptFlow(input);
}

// Extender el input para el primer prompt para incluir el perfil de contexto
const DetailedSceneInputSchema = GenerateImagePromptInputSchema.extend({
  contextProfile: ImagePromptProfileSchema.describe('El perfil de contexto para guiar a la IA.'),
  productCatalog: z.string().optional().describe('Un listado en formato JSON de productos disponibles en el catálogo, si es necesario.'),
});

const detailedScenePrompt = ai.definePrompt({
    name: 'detailedSceneGenerator',
    input: { schema: DetailedSceneInputSchema },
    prompt: `Eres un director de arte y estratega de marketing para la tienda de e-commerce "PrecioHogar".
    Tu misión es crear un concepto visual detallado para una imagen promocional. Debes seguir un brief creativo estricto y expandir una idea simple del usuario.

    **BRIEF CREATIVO:**

    **1. Paleta de Colores Obligatoria de la Marca:**
    - Naranja vibrante (hsl(35, 100%, 58%))
    - Azul Cielo (hsl(205, 90%, 55%))
    - Azul Oscuro (hsl(215, 60%, 40%))
    - Fondos neutros: Blancos puros, grises muy claros.

    **2. Directrices de Estilo y Composición:**
    - Estilo General: {{{contextProfile.style}}}
    - Composición: {{{contextProfile.composition}}}
    - Iluminación: {{{contextProfile.lighting}}}
    - Atmósfera (Mood): {{{contextProfile.mood}}}
    {{#if contextProfile.extras}}- Detalles Clave: {{{contextProfile.extras}}}{{/if}}

    **3. Contenido del Anuncio (si aplica):**
    {{#if contextProfile.offer}}
    - Oferta a comunicar: "{{contextProfile.offer.discount}} - {{contextProfile.offer.description}}". La imagen debe reflejar esta promoción de forma atractiva.
    {{/if}}
    {{#if contextProfile.callToAction}}
    - Llamada a la Acción (CTA): La imagen debe tener un espacio visual claro para un botón con el texto "{{contextProfile.callToAction.text}}".
    {{/if}}
    
    {{#if productCatalog}}
    - Catálogo de Productos Disponibles: {{{productCatalog}}}.
    - Tarea de Selección: De este catálogo, selecciona entre 3 y 5 productos que sean coherentes con el tipo de componente "{{{componentType}}}" y la descripción del usuario. Debes integrar de forma natural y atractiva los productos seleccionados en la escena.
    {{else}}
      {{#if contextProfile.products_showcased}}
      - Productos a mostrar: Debes integrar de forma natural y atractiva los siguientes productos en la escena:
        {{#each contextProfile.products_showcased}}
        - {{{this}}}
        {{/each}}
      {{/if}}
    {{/if}}

    {{#if contextProfile.contact}}
    - Información de contacto a incluir sutilmente (si es posible, en elementos del fondo): Teléfono {{{contextProfile.contact.phone}}} y web {{{contextProfile.contact.website}}}.
    {{/if}}

    **INSTRUCCIONES:**
    A partir del componente de la aplicación y la descripción del usuario, genera un párrafo detallado que describa una escena visualmente impactante. Integra todos los elementos del brief (colores, estilo, productos, ofertas, etc.) de manera cohesiva y profesional.

    **Componente:** {{{componentType}}}
    **Descripción del Usuario:** {{{userDescription}}}

    **Párrafo de Escena Detallado:**
    `,
});

const finalPromptGenerator = ai.definePrompt({
  name: 'finalPromptGenerator',
  input: { schema: z.object({ scene: z.string(), callToActionText: z.string().optional() }) },
  output: { schema: GenerateImagePromptOutputSchema },
  prompt: `
    A partir de la siguiente descripción de escena, genera dos prompts optimizados para diferentes plataformas de IA.

    **Escena Detallada:**
    {{{scene}}}

    ---

    **1. Prompt para Gemini (Nano Banana):**
    Crea un prompt de una sola línea, **en inglés**. Debe ser altamente descriptivo, enfocado en un estilo fotográfico profesional y cinematográfico.
    Usa términos como "professional product photography", "cinematic lighting", "ultra-realistic", "4K resolution", "soft focus", "minimalist composition", etc.
    **IMPORTANTE:** Si la escena incluye un botón de llamada a la acción o cualquier texto visible, ese texto debe estar **EN ESPAÑOL**. Por ejemplo, en lugar de "SHOP NOW", usa "{{#if callToActionText}}{{{callToActionText}}}{{else}}VER MÁS{{/if}}".
    Ejemplo de prompt final: "Professional e-commerce product photography of a modern, minimalist living room... with a call-to-action button that reads 'COMPRAR AHORA' in Spanish."

    **2. Prompt para Whisk de Google:**
    Crea un prompt estructurado en tres partes: Asunto, Escena y Estilo. Sé claro y conciso en cada parte. El idioma debe ser español.
    Ejemplo:
    Asunto: Un sofá azul oscuro con almohadas naranjas.
    Escena: Un salón moderno y minimalista con una ventana grande por donde entra luz suave. La pared del fondo es gris claro. Hay un botón que dice "COMPRAR AHORA".
    Estilo: Fotografía de producto profesional para e-commerce, realista, con iluminación cinematográfica y composición limpia. Paleta de colores: azul oscuro, naranja vibrante, gris claro.

    ---
    Genera ambos prompts en el formato JSON requerido.
  `,
});


const generateImagePromptFlow = ai.defineFlow(
  {
    name: 'generateImagePromptFlow',
    inputSchema: GenerateImagePromptInputSchema,
    outputSchema: GenerateImagePromptOutputSchema,
  },
  async (input) => {
    // 1. Obtener el perfil de contexto basado en el componentType
    const profileKey = input.componentType as keyof typeof loadedProfiles;
    const contextProfile = loadedProfiles[profileKey] || loadedProfiles["Default"]; // Usar un perfil por defecto si no se encuentra

    // 2. Preparar el input para el generador de escena
    const sceneInput: z.infer<typeof DetailedSceneInputSchema> = {
      ...input,
      contextProfile,
    };
    
    // Si el perfil pide productos del catálogo, se lo pasamos
    if (contextProfile.products_showcased === "from_catalog") {
      sceneInput.productCatalog = JSON.stringify(productCatalog);
    }

    // 3. Generar la escena detallada usando el perfil de contexto
    const sceneResponse = await detailedScenePrompt(sceneInput);
    const detailedScene = sceneResponse.text;

    // 4. Usar la escena detallada para generar los prompts finales específicos de la plataforma
    const finalPromptsResponse = await finalPromptGenerator({ 
        scene: detailedScene,
        callToActionText: contextProfile.callToAction?.text
    });
    
    return finalPromptsResponse.output!;
  }
);
