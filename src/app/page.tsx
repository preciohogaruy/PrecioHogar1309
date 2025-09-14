import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/hero-section';
import { ProductShowcase } from '@/components/product-showcase';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductShowcase />
      </main>
      <Footer />
    </div>
  );
}
