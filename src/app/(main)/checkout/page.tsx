'use client';

import { useCart } from '@/lib/hooks/use-cart';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useCoupon } from '@/lib/hooks/use-coupon';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { vendors } from '@/lib/data';
import type { CartItem } from '@/lib/types';
import Image from 'next/image';
import { CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addTransaction } = useTransactions();
  const { useCouponValue } = useCoupon();
  const router = useRouter();
  const { toast } = useToast();

  if (cartItems.length === 0) {
    if (typeof window !== 'undefined') {
        router.replace('/stores');
    }
    return null;
  }

  const handleCheckout = () => {
    // Simulate payment processing
    let totalCouponSavings = 0;

    cartItems.forEach((item: CartItem) => {
      const vendor = vendors.find(v => v.name === item.vendorName);
      if (!vendor) return;

      let finalAmount = item.price * item.quantity;
      let couponAmount = 0;
      let couponUsed = false;

      if (vendor.category === 'School Cafeteria') {
        const { amountLeft } = useCouponValue(finalAmount);
        couponAmount = finalAmount - amountLeft;
        finalAmount = amountLeft;
        
        if (couponAmount > 0) {
            couponUsed = true;
            totalCouponSavings += couponAmount;
        }
      }

      // Add transaction for the amount paid out of pocket
      if (finalAmount > 0) {
          addTransaction({
            amount: finalAmount,
            vendor: item.vendorName,
            vendorCategory: vendor.category,
            item: item.name,
            couponUsed: couponUsed,
            couponAmount: couponAmount,
            cashUsed: false, // Assuming card payment
          });
      } else if (couponUsed) {
        // If the item was fully paid by coupon, still log a zero-amount transaction
         addTransaction({
            amount: 0,
            vendor: item.vendorName,
            vendorCategory: vendor.category,
            item: item.name,
            couponUsed: true,
            couponAmount: couponAmount,
            cashUsed: false,
          });
      }
    });

    clearCart();

    toast({
      title: 'Payment Successful!',
      description: `Your order has been placed. You saved ₦${totalCouponSavings.toLocaleString()} with coupons.`,
    });

    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your purchase by providing payment details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Enter your card information. This is a simulation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-10" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                             <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="cvc" placeholder="123" className="pl-10" />
                            </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input id="name" placeholder="John Doe" />
                    </div>
                     <Button size="lg" className="w-full mt-6" onClick={handleCheckout}>
                        Pay ₦{cartTotal.toLocaleString()}
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md" />
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                    </div>
                    <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
