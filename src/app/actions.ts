'use server';

import {
  getProductRecommendations,
  type ProductRecommendationsInput,
} from '@/ai/flows/product-recommendations-flow';

export async function getRecommendationsAction(input: ProductRecommendationsInput) {
  try {
    const result = await getProductRecommendations(input);
    return result.recommendations ?? [];
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Return an empty array or throw a custom error to be handled by the client
    return [];
  }
}
