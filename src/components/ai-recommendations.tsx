'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getRecommendationsAction } from '@/app/actions';
import type { ProductRecommendationsOutput } from '@/ai/flows/product-recommendations-flow';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export function AiRecommendations({ product }: { product: Product }) {
  const [recommendations, setRecommendations] = useState<
    ProductRecommendationsOutput['recommendations']
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      const result = await getRecommendationsAction({
        productName: product.name,
        productDescription: product.description,
        category: product.category,
        price: product.price,
      });
      setRecommendations(result);
      setIsLoading(false);
    }
    fetchRecommendations();
  }, [product]);

  if (isLoading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">También te podría gustar</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 text-center">También te podría gustar</h3>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {recommendations.map((rec, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-4 gap-4">
                    <div className="relative w-full aspect-square">
                        <Image
                            src={rec.imageUrl}
                            alt={rec.name}
                            fill
                            className="rounded-md object-cover"
                        />
                    </div>
                    <div className="text-center">
                        <h4 className="font-semibold">{rec.name}</h4>
                        <p className="text-sm text-muted-foreground">${rec.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
