'use server';
/**
 * @fileOverview Un agente de IA para generar prompts para la creación de imágenes.
 *
 * - generateImagePrompt - Una función que maneja la generación de prompts para imágenes.
 * - GenerateImagePromptInput - El tipo de entrada para la función.
 * - GenerateImagePromptOutput - El tipo de retorno para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImagePromptInputSchema = z.object({
  imageType: z.string().describe('El tipo de imagen a generar (ej: Banner, Logo, Foto de producto).'),
  description: z.string().describe('Una descripción detallada de lo que debe contener la imagen.'),
  resolution: z.string().optional().describe('La resolución deseada para la imagen (ej: "1920x1080", "4K", "8K").'),
  aspectRatio: z.string().optional().describe('La relación de aspecto de la imagen (ej: "16:9", "cuadrado", "vertical").'),
});
export type GenerateImagePromptInput = z.infer<typeof GenerateImagePromptInputSchema>;

const GenerateImagePromptOutputSchema = z.object({
  prompt: z.string().describe('El prompt detallado y optimizado para la IA de generación de imágenes.'),
});
export type GenerateImagePromptOutput = z.infer<typeof GenerateImagePromptOutputSchema>;

export async function generateImagePrompt(input: GenerateImagePromptInput): Promise<GenerateImagePromptOutput> {
  return generateImagePromptFlow(input);
}

const promptGeneratorPrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: { schema: GenerateImagePromptInputSchema },
  output: { schema: GenerateImagePromptOutputSchema },
  prompt: `Eres un experto en la creación de prompts para modelos de IA de generación de imágenes como Midjourney o DALL-E. Tu tarea es tomar una descripción simple y convertirla en un prompt detallado, profesional y efectivo.

  La marca es "PrecioHogar", una tienda de e-commerce de productos para el hogar.

  **Paleta de Colores Obligatoria del Proyecto:**
  - Naranja vibrante (hsl(35, 100%, 58%))
  - Azul cielo (hsl(205, 90%, 55%))
  - Azul oscuro (hsl(215, 60%, 40%))
  - Neutros: Blancos puros, grises claros.

  **Instrucciones:**
  1.  Toma el "Tipo de imagen", "Descripción", "Resolución" (opcional) y "Aspect Ratio" (opcional) proporcionados.
  2.  Crea un prompt que sea claro, conciso y rico en detalles visuales.
  3.  **Crucialmente, DEBES incorporar la paleta de colores del proyecto de forma natural en el prompt.** Describe cómo los colores deben interactuar.
  4.  Añade términos técnicos y artísticos que mejoren la calidad (ej: "cinematic lighting", "ultra-realistic", "soft focus", "professional product photography", "minimalist composition").
  5.  Si se proporciona 'resolution', inclúyela en el prompt (ej: "4K", "8K", "high resolution").
  6.  Si se proporciona 'aspectRatio', tradúcelo a términos que la IA entienda (ej: "16:9" -> "widescreen, cinematic", "vertical" -> "portrait aspect ratio", "cuadrado" -> "square aspect ratio").
  7.  El prompt debe estar en una sola línea de texto, en inglés para máxima compatibilidad con los modelos de IA.

  **Ejemplo de cómo transformar la entrada en un prompt:**
  -   *Entrada de Usuario:*
      -   Tipo de imagen: "Banner para sección de Herramientas"
      -   Descripción: "Varias herramientas manuales bien organizadas sobre una mesa de madera."
      -   Resolución: "4K"
      -   Aspect Ratio: "16:9"
  -   *Prompt Generado (Salida Esperada):*
      "Professional e-commerce product photography, a top-down view of a neatly organized set of hand tools on a dark wood surface, cinematic lighting creating soft shadows. The color palette elegantly mixes vibrant orange accents on some tool handles with deep sky blue and dark blue elements in the background. Minimalist composition, ultra-realistic, 4K resolution, widescreen 16:9 aspect ratio."

  **Entrada del Usuario:**
  -   Tipo de imagen: {{{imageType}}}
  -   Descripción: {{{description}}}
  {{#if resolution}}-   Resolución: {{{resolution}}}{{/if}}
  {{#if aspectRatio}}-   Aspect Ratio: {{{aspectRatio}}}{{/if}}

  Genera el prompt optimizado.`,
});

const generateImagePromptFlow = ai.defineFlow(
  {
    name: 'generateImagePromptFlow',
    inputSchema: GenerateImagePromptInputSchema,
    outputSchema: GenerateImagePromptOutputSchema,
  },
  async (input) => {
    const { output } = await promptGeneratorPrompt(input);
    return output!;
  }
);
