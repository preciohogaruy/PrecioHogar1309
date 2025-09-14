'use client';

import { products, categories } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from './product-card';
import { Armchair, BedDouble, UtensilsCrossed } from 'lucide-react';

const categoryIcons = {
    'Living Room': <Armchair className="mr-2" />,
    'Bedroom': <BedDouble className="mr-2" />,
    'Kitchen': <UtensilsCrossed className="mr-2" />,
}

export function ProductShowcase() {
  return (
    <section className="container py-12 md:py-20">
      <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
        Nuestros Productos Destacados
      </h2>
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="mx-auto mb-8 grid h-auto w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="py-2 text-base">
              {categoryIcons[category]}
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
