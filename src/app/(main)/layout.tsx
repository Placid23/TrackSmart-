'use client';
import { AppHeader } from '@/components/layout/app-header';
import { DesktopSidebar } from '@/components/layout/desktop-sidebar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { CartProvider } from '@/lib/providers/cart-provider';
import { CartSheet } from '@/components/cart/cart-sheet';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';
import { useAuth } from '@/lib/providers/firebase-provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import useIdleTimeout from '@/hooks/use-idle-timeout';
import { useCallback } from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleIdle = useCallback(() => {
    auth.signOut().then(() => {
      toast({
        title: 'Session Expired',
        description: 'You have been logged out due to inactivity.',
      });
      router.push('/login');
    });
  }, [auth, router, toast]);

  // Set timeout to 5 minutes (300,000 milliseconds)
  useIdleTimeout(handleIdle, 300000);

  return (
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
  );
}
