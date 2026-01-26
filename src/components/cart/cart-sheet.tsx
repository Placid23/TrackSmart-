'use client';

import { useCart } from '@/lib/hooks/use-cart';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export function CartSheet() {
  const { isCartOpen, setCartOpen, cartItems, removeItem, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>Review your items before checkout.</SheetDescription>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4 -mr-6">
              <div className="flex flex-col gap-4 pr-6">
                {cartItems.map(item => (
                  <div key={item.id + item.vendorName} className="flex items-center gap-4">
                    <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover"/>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">₦{item.price.toLocaleString()} x {item.quantity}</p>
                    </div>
                    <div className="font-semibold">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <Button className="w-full" onClick={handleCheckout}>Proceed to Checkout</Button>
                <Button variant="outline" className="w-full" onClick={() => { clearCart(); setCartOpen(false); }}>Clear Cart</Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">Your cart is empty</p>
            <p className="text-muted-foreground">Add some meals to get started.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
