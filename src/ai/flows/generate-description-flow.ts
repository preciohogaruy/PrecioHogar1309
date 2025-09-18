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

// Hacer el esquema flexible para aceptar diferentes estructuras de perfil.
const ImagePromptProfileSchema = z.record(z.any());


const GenerateImageDescriptionInputSchema = z.object({
  componentType: z.string().describe('El componente o tipo de escena para la que se necesita la imagen (ej: Hero Section, Product Card).'),
  contextProfile: ImagePromptProfileSchema.describe('El perfil de contexto creativo que guía a la IA.'),
});
export type GenerateImageDescriptionInput = z.infer<typeof GenerateImageDescriptionInputSchema>;

const GenerateImageDescriptionOutputSchema = z.object({
  description: z.string().describe('Una descripción de imagen sugerida, creativa y concisa, basada en el brief creativo.'),
});
export type GenerateImageDescriptionOutput = z.infer<typeof GenerateImageDescriptionOutputSchema>;

export async function generateImageDescription(input: GenerateImageDescriptionInput): Promise<GenerateImageDescriptionOutput> {
  return generateImageDescriptionFlow(input);
}

const descriptionGeneratorPrompt = ai.definePrompt({
  name: 'descriptionGeneratorPrompt',
  input: { schema: GenerateImageDescriptionInputSchema },
  output: { schema: GenerateImageDescriptionOutputSchema },
  prompt: `Eres un director de arte para la tienda de e-commerce "PrecioHogar".
Tu tarea es generar una idea de imagen creativa y concisa (máximo 30 palabras) para un componente específico, basándote en un brief creativo.

**BRIEF CREATIVO:**
{{#if contextProfile.escena_ilustrada}}
- **Estilo de Ilustración:** "{{contextProfile.escena_ilustrada.estilo}}".
- **Concepto:** Describe una escena con el personaje "{{contextProfile.escena_ilustrada.sujeto_principal.descripcion}}" en un entorno amigable y moderno.
{{else}}
- **Estilo y Atmósfera:** Apunta a un estilo "{{contextProfile.style}}" y una atmósfera "{{contextProfile.mood}}".
{{#if contextProfile.products_showcased.length}}
- **Productos a mostrar:** La imagen debe incluir: {{#each contextProfile.products_showcased}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{else}}
  {{#if contextProfile.products_showcased}}
- **Productos a mostrar:** La imagen debe incluir una selección de productos del catálogo de la tienda.
  {{/if}}
{{/if}}
{{#if contextProfile.offer}}
- **Promoción:** La imagen debe evocar la oferta "{{contextProfile.offer.discount}}".
{{/if}}
{{/if}}

**Componente de la Aplicación:** {{{componentType}}}

Ahora, basándote en toda esta información, genera una descripción creativa y atractiva para la imagen.
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
