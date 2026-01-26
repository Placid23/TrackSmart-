import { AppHeader } from '@/components/layout/app-header';
import { DesktopSidebar } from '@/components/layout/desktop-sidebar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { CartProvider } from '@/lib/providers/cart-provider';
import { CartSheet } from '@/components/cart/cart-sheet';
import { FloatingCartButton } from '@/components/cart/floating-cart-button';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="relative flex min-h-screen w-full flex-col bg-background">
        <AppHeader />
        <div className="flex flex-1">
          <DesktopSidebar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
        </div>
        <CartSheet />
        <FloatingCartButton />
        <MobileBottomNav />
      </div>
    </CartProvider>
  );
}
