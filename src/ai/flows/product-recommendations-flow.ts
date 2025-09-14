// Product recommendations flow
'use server';

/**
 * @fileOverview Provides AI-powered product recommendations based on the currently viewed product.
 *
 * - getProductRecommendations - A function that returns product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  productName: z.string().describe('The name of the product currently being viewed.'),
  productDescription: z.string().describe('The description of the product currently being viewed.'),
  category: z.string().describe('The category of the product.'),
  price: z.number().describe('The price of the product.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the recommended product.'),
      description: z.string().describe('A short description of the recommended product.'),
      price: z.number().describe('The price of the recommended product.'),
      imageUrl: z.string().describe('The URL of the recommended product image.'),
    })
  ).describe('A list of recommended products.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in providing product recommendations for an e-commerce website selling home goods.

  Based on the product the user is currently viewing, suggest related or complementary products that the user might be interested in purchasing.
  Consider the product's name, description, category, and price when generating recommendations.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Category: {{{category}}}
  Price: {{{price}}}

  Respond with a list of recommended products, including their name, description, price, and image URL.
  Ensure that the recommendations are relevant and would genuinely enhance the user's shopping experience.
  The LLM decides _when and if_ to add this information to the output. The output must conform to the schema.
  `,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
