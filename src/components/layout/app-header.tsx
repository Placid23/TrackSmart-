'use client';

import Link from 'next/link';
import { Bell, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CouponWallet } from '@/components/coupon-wallet';
import { useCart } from '@/lib/hooks/use-cart';
import { Badge } from '@/components/ui/badge';

export function AppHeader() {
  const { totalItems, setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-primary"
            >
              <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l10-10A1 1 0 0 0 22 11Z" />
              <path d="M7 7h.01" />
            </svg>
            <span className="font-headline text-2xl font-bold text-primary hidden sm:inline-block">
              TrackSmart+
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden md:flex"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
            <span className="sr-only">Open Cart</span>
          </Button>
          <CouponWallet />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
