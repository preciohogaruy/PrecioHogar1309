import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
        <h1 className="font-headline text-4xl font-bold md:text-6xl">
          Calidad y Estilo, Sin Romper la Alcancía
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl">
          En PrecioHogar, creemos que un hogar hermoso no debería ser un lujo. Descubre nuestros productos de alta calidad a precios que te encantarán.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="#">Hace tu pedido</Link>
        </Button>
      </div>
    </section>
  );
}
