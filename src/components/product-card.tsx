'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { AiRecommendations } from './ai-recommendations';
import { Badge } from './ui/badge';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-0">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={product.image.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.image.imageHint}
              />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle className="text-lg truncate">{product.name}</CardTitle>
            <Badge variant="secondary" className="w-fit">{product.category}</Badge>
          </CardHeader>
          <CardFooter>
            <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-8 p-2">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                <Image
                    src={product.image.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={product.image.imageHint}
                />
            </div>
            <div>
                <DialogHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
                    <DialogTitle className="text-3xl font-bold font-headline">{product.name}</DialogTitle>
                    <p className="text-3xl font-bold text-primary py-2">${product.price.toFixed(2)}</p>
                    <DialogDescription className="text-base text-foreground/80 pt-4">
                        {product.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-8">
                    <Button size="lg" className="w-full">
                        Hace tu pedido
                    </Button>
                </div>
            </div>
        </div>
        <AiRecommendations product={product} />
      </DialogContent>
    </Dialog>
  );
}
