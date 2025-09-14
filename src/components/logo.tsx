import { Home } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="PrecioHogar Home">
      <div className="p-2 bg-primary rounded-full">
        <Home className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold text-foreground tracking-tight">PrecioHogar</span>
    </Link>
  );
}
