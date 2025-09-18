'use server';
/**
 * @fileOverview Un agente de IA para generar descripciones de imágenes.
 *
 * - generateImageDescription - Una función que maneja la generación de descripciones de imágenes.
 * - GenerateImageDescriptionInput - El tipo de entrada para la función.
 * - GenerateImageDescriptionOutput - El tipo de retorno para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageDescriptionInputSchema = z.object({
  componentType: z.string().describe('El componente o tipo de escena para la que se necesita la imagen (ej: Hero Section, Product Card).'),
});
export type GenerateImageDescriptionInput = z.infer<typeof GenerateImageDescriptionInputSchema>;

const GenerateImageDescriptionOutputSchema = z.object({
  description: z.string().describe('Una descripción de imagen sugerida, creativa y concisa.'),
});
export type GenerateImageDescriptionOutput = z.infer<typeof GenerateImageDescriptionOutputSchema>;

export async function generateImageDescription(input: GenerateImageDescriptionInput): Promise<GenerateImageDescriptionOutput> {
  return generateImageDescriptionFlow(input);
}

const descriptionGeneratorPrompt = ai.definePrompt({
  name: 'descriptionGeneratorPrompt',
  input: { schema: GenerateImageDescriptionInputSchema },
  output: { schema: GenerateImageDescriptionOutputSchema },
  prompt: `Eres un asistente creativo para la tienda de e-commerce "PrecioHogar".
Tu tarea es generar una descripción de imagen breve y creativa (máximo 25 palabras) para un componente de la interfaz de usuario específico.

Componente: {{{componentType}}}

Basado en el componente, genera una idea para una imagen que sea atractiva y relevante.
Ejemplo:
- Componente: "Hero Section"
- Descripción: "Un salón moderno y luminoso con un sofá cómodo, luz natural y acentos de color naranja y azul."
- Componente: "Product Card"
- Descripción: "Un set de herramientas de alta calidad ordenadamente dispuestas sobre una superficie de madera rústica."

Ahora, genera una descripción para el componente proporcionado.
`,
});

const generateImageDescriptionFlow = ai.defineFlow(
  {
    name: 'generateImageDescriptionFlow',
    inputSchema: GenerateImageDescriptionInputSchema,
    outputSchema: GenerateImageDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await descriptionGeneratorPrompt(input);
    return output!;
  }
);
