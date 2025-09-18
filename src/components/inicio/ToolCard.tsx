
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
}

export default function ToolCard({ href, icon, title, description, linkText }: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full hover:border-primary transition-colors duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            {icon}
            <CardTitle className="text-2xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            {description}
          </CardDescription>
          <div className="flex items-center text-primary font-semibold group-hover:underline">
            <span>{linkText}</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
