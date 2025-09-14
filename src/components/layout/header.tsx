import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Button asChild>
          <Link href="#">Hace tu pedido</Link>
        </Button>
      </div>
    </header>
  );
}
