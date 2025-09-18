'use client';

import { useState, type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, ShieldAlert } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

const CORRECT_PASSWORD = '123456789';

export function Login({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Acceso Restringido</CardTitle>
          <CardDescription>
            Por favor, ingresa la contraseña para acceder al panel de administración.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="text-center"
                autoFocus
              />
               {error && (
                <div className="flex items-center text-sm text-destructive font-medium">
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  <p>{error}</p>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
              Acceder
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
