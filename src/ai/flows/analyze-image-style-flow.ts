'use server';
/**
 * @fileOverview Un agente de IA para analizar el estilo visual de una imagen y generar un perfil de contexto.
 *
 * - analyzeImageStyle - Una función que extrae las características de estilo de una imagen.
 * - AnalyzeImageStyleInput - El tipo de entrada para la función analyzeImageStyle.
 * - AnalyzeImageStyleOutput - El tipo de retorno para la función analyzeImageStyle.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeImageStyleInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "Una foto para analizar, como un data URI que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnalyzeImageStyleInput = z.infer<typeof AnalyzeImageStyleInputSchema>;

const AnalyzeImageStyleOutputSchema = z.object({
  style: z.string().describe('El estilo artístico o fotográfico general de la imagen (ej: "Fotografía de producto cinematográfica", "Minimalista y limpio", "Estilo escandinavo rústico").'),
  composition: z.string().describe('La composición de la imagen (ej: "Primer plano con fondo desenfocado (bokeh)", "Composición simétrica centrada", "Regla de los tercios con mucho espacio negativo").'),
  lighting: z.string().describe('El tipo de iluminación utilizado (ej: "Luz natural suave y difusa desde una ventana lateral", "Iluminación de estudio dramática con sombras marcadas", "Luz dorada del atardecer").'),
  mood: z.string().describe('La atmósfera o emoción que transmite la imagen (ej: "Cálido, acogedor y hogareño", "Elegante, moderno y sofisticado", "Fresco, sereno y tranquilo").'),
  extras: z.string().optional().describe('Detalles adicionales o elementos clave que definen la estética (ej: "Uso de texturas naturales como madera y lino", "Enfoque en detalles metálicos brillantes", "Paleta de colores análogos con acentos de alto contraste").'),
});
export type AnalyzeImageStyleOutput = z.infer<typeof AnalyzeImageStyleOutputSchema>;

export async function analyzeImageStyle(input: AnalyzeImageStyleInput): Promise<AnalyzeImageStyleOutput> {
  return analyzeImageStyleFlow(input);
}

const analyzeImageStylePrompt = ai.definePrompt({
  name: 'analyzeImageStylePrompt',
  input: { schema: AnalyzeImageStyleInputSchema },
  output: { schema: AnalyzeImageStyleOutputSchema },
  prompt: `Eres un director de arte experto con un ojo excepcional para el detalle. Tu tarea es analizar la imagen proporcionada y descomponer su estética visual en un perfil de estilo estructurado.

  Observa la imagen y extrae la siguiente información:
  1.  **Estilo (style):** ¿Cuál es el estilo general? (Ej: cinematográfico, minimalista, rústico, etc.)
  2.  **Composición (composition):** ¿Cómo están dispuestos los elementos? (Ej: regla de los tercios, primer plano, simetría, etc.)
  3.  **Iluminación (lighting):** ¿Cómo es la luz? (Ej: natural, de estudio, suave, dramática, etc.)
  4.  **Atmósfera (mood):** ¿Qué sensación o emoción transmite? (Ej: acogedor, elegante, fresco, etc.)
  5.  **Extras:** ¿Hay algún detalle recurrente o definitorio? (Ej: uso de texturas, paleta de colores específica, etc.)

  Devuelve la información en un formato JSON estricto.

  Imagen a Analizar: {{media url=imageDataUri}}`,
});

const analyzeImageStyleFlow = ai.defineFlow(
  {
    name: 'analyzeImageStyleFlow',
    inputSchema: AnalyzeImageStyleInputSchema,
    outputSchema: AnalyzeImageStyleOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeImageStylePrompt(input);
    return output!;
  }
);
