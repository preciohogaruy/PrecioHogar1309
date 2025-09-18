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

const detailedScenePrompt = ai.definePrompt({
    name: 'detailedSceneGenerator',
    input: { schema: GenerateImagePromptInputSchema },
    prompt: `Eres un director de arte para la marca "PrecioHogar", una tienda de e-commerce de productos para el hogar.
    Tu tarea es expandir una idea simple en una descripción de escena rica y evocadora.

    **Paleta de Colores Obligatoria de la Marca:**
    - Naranja vibrante (hsl(42, 100%, 50%))
    - Azul cielo (hsl(205, 90%, 55%))
    - Azul oscuro (hsl(215, 60%, 40%))
    - Fondos neutros: Blancos puros, grises muy claros.

    A partir del componente de la aplicación y la descripción del usuario, genera un párrafo detallado que describa una escena visualmente atractiva.
    Incorpora la paleta de colores de forma natural. Describe la iluminación, la composición y la atmósfera.

    **Componente:** {{{componentType}}}
    **Descripción del Usuario:** {{{userDescription}}}

    **Párrafo de Escena Detallado:**
    `,
});

const finalPromptGenerator = ai.definePrompt({
  name: 'finalPromptGenerator',
  input: { schema: z.object({ scene: z.string() }) },
  output: { schema: GenerateImagePromptOutputSchema },
  prompt: `
    A partir de la siguiente descripción de escena, genera dos prompts optimizados para diferentes plataformas de IA.

    **Escena Detallada:**
    {{{scene}}}

    ---

    **1. Prompt para Gemini (Nano Banana):**
    Crea un prompt de una sola línea, en inglés. Debe ser altamente descriptivo, enfocado en un estilo fotográfico profesional y cinematográfico.
    Usa términos como "professional product photography", "cinematic lighting", "ultra-realistic", "4K resolution", "soft focus", "minimalist composition", etc.
    Ejemplo: "Professional e-commerce product photography of a modern, minimalist living room, featuring a sleek dark blue sofa (hsl(215, 60%, 40%)) with vibrant orange pillows (hsl(42, 100%, 50%)). Cinematic, soft morning light streams through a large window. Background is a clean, light gray wall (hsl(210, 40%, 98%)). Ultra-realistic, 4K resolution, depth of field."

    **2. Prompt para Whisk de Google:**
    Crea un prompt estructurado en tres partes: Asunto, Escena y Estilo. Sé claro y conciso en cada parte.
    Ejemplo:
    Asunto: Un sofá azul oscuro con almohadas naranjas.
    Escena: Un salón moderno y minimalista con una ventana grande por donde entra luz suave. La pared del fondo es gris claro.
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
    // Step 1: Generate the detailed scene description
    const sceneResponse = await detailedScenePrompt(input);
    const detailedScene = sceneResponse.text();

    // Step 2: Use the detailed scene to generate the final, platform-specific prompts
    const finalPromptsResponse = await finalPromptGenerator({ scene: detailedScene });
    
    return finalPromptsResponse.output!;
  }
);
