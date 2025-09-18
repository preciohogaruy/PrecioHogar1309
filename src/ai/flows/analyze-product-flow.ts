'use server';
/**
 * @fileOverview Un agente de IA para analizar imágenes de productos y generar detalles.
 *
 * - analyzeProductImage - Una función que maneja el análisis de la imagen del producto.
 * - AnalyzeProductImageInput - El tipo de entrada para la función analyzeProductImage.
 * - AnalyzeProductImageOutput - El tipo de retorno para la función analyzeProductImage.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeProductImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "Una foto de un producto, como un data URI que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  categories: z.array(z.object({ 
    id: z.number(), 
    name: z.string(), 
    tag: z.string(), 
    description: z.string().nullable() 
  }))
    .describe('Una lista de las categorías de productos disponibles.'),
});
export type AnalyzeProductImageInput = z.infer<typeof AnalyzeProductImageInputSchema>;

const AnalyzeProductImageOutputSchema = z.object({
  title: z.string().describe('Un título corto y conciso para el producto (máximo 6 palabras).'),
  description: z.string().describe('Una descripción detallada y profesional del producto.'),
  categoryName: z.string().describe('El nombre de la categoría del producto de la lista proporcionada.'),
  price: z.coerce.number().optional().describe('Si el precio es visible en la imagen (por ejemplo, cerca de un signo $ o la palabra "oferta"), extráelo como un número. Si no es visible, omite este campo.'),
});
export type AnalyzeProductImageOutput = z.infer<typeof AnalyzeProductImageOutputSchema>;

export async function analyzeProductImage(input: AnalyzeProductImageInput): Promise<AnalyzeProductImageOutput> {
  return analyzeProductImageFlow(input);
}

const analyzeProductPrompt = ai.definePrompt({
  name: 'analyzeProductPrompt',
  input: { schema: AnalyzeProductImageInputSchema },
  output: { schema: AnalyzeProductImageOutputSchema },
  prompt: `Eres un experto en catalogación de productos para una tienda de e-commerce llamada "PrecioHogar". Tu tarea es analizar la imagen de un producto y generar la información necesaria para su listado.

  Debes devolver la información en un formato JSON estricto.

  Aquí están las categorías disponibles: {{#each categories}}{{this.name}}{{#unless @last}}, {{/unless}}{{/each}}. Debes elegir la más apropiada de esta lista.

  Analiza la imagen y genera:
  1. Un 'title' (título) para el producto. Debe ser atractivo, conciso y no exceder las 6 palabras.
  2. Una 'description' (descripción) profesional y detallada. Describe sus características, materiales y posibles usos.
  3. El 'categoryName' (nombre de la categoría) exacto de la lista proporcionada que mejor se ajuste al producto.
  4. Si un 'price' (precio) es visible en la imagen (busca números cerca del símbolo '$' o la palabra 'oferta'), extráelo como un valor numérico. Si no hay precio visible, no incluyas el campo 'price' en la salida.

  Imagen del Producto: {{media url=imageDataUri}}`,
});

const analyzeProductImageFlow = ai.defineFlow(
  {
    name: 'analyzeProductImageFlow',
    inputSchema: AnalyzeProductImageInputSchema,
    outputSchema: AnalyzeProductImageOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeProductPrompt(input);
    return output!;
  }
);
