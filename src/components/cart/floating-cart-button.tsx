'use client';

import { useCart } from '@/lib/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function FloatingCartButton() {
  const { totalItems, setCartOpen, isCartOpen } = useCart();

  if (totalItems === 0 || isCartOpen) return null;

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-50">
      <Button
        size="icon"
        className="rounded-full h-14 w-14 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingCart className="h-6 w-6" />
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full"
        >
          {totalItems}
        </Badge>
        <span className="sr-only">Open Cart</span>
      </Button>
    </div>
  );
}
