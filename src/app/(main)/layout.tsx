'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { AppHeader } from '@/components/layout/app-header';
import { DesktopSidebar } from '@/components/layout/desktop-sidebar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { CartProvider } from '@/lib/providers/cart-provider';
import { CartSheet } from '@/components/cart/cart-sheet';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';
import { Loader2 } from 'lucide-react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <CartProvider>
        <div className="relative flex min-h-screen w-full flex-col bg-background">
          <AppHeader />
          <div className="flex flex-1">
            <DesktopSidebar />
            <main className="flex-1 pb-16 md:pb-0 animate-fade-in">{children}</main>
          </div>
          <CartSheet />
          <FloatingCartButton />
          <MobileBottomNav />
        </div>
      </CartProvider>
    </AuthGuard>
  );
}
