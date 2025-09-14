
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecommendationModal } from './recommendation-modal';
import { Sparkles } from 'lucide-react';

export type Product = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  imageHint: string;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg font-bold flex-grow">{product.name}</CardTitle>
        <CardDescription className="text-primary font-bold text-xl mt-2">{product.price}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <RecommendationModal productName={product.name}>
          <Button variant="outline" className="w-full transition-colors duration-300 hover:bg-primary/10">
            <Sparkles className="mr-2 h-4 w-4" />
            Ver recomendaciones
          </Button>
        </RecommendationModal>
      </CardFooter>
    </Card>
  );
}
