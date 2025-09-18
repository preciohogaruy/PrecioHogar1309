import type { ReactNode } from 'react';
import { Login } from '@/components/admin/Login';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Login>
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    </Login>
  );
}
