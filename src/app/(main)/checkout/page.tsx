
'use client';

import { useEffect, useState } from 'react';
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
import type { CartItem, Transaction, OrderItem } from '@/lib/types';
import Image from 'next/image';
import { CreditCard, Lock, Loader2, Wallet } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePaystackPayment } from 'react-paystack';
import { useUserProfile } from '@/lib/hooks/use-user-profile';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, isInitialized } = useCart();
  const { addTransaction } = useTransactions();
  const { coupon, useCouponValue } = useCoupon();
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { profile } = useUserProfile();

  useEffect(() => {
    if (isInitialized && cartItems.length === 0) {
      router.replace('/stores');
    }
  }, [isInitialized, cartItems, router]);

  const isCouponEligible = cartItems.some(
    item => vendors.find(v => v.name === item.vendorName)?.category === 'School Cafeteria'
  );
  const availableCouponValue = coupon && coupon.isValid ? coupon.value : 0;
  let potentialDiscount = 0;
  if (isCouponEligible && availableCouponValue > 0) {
    const cafeteriaItemsTotal = cartItems
      .filter(item => vendors.find(v => v.name === item.vendorName)?.category === 'School Cafeteria')
      .reduce((total, item) => total + item.price * item.quantity, 0);
    potentialDiscount = Math.min(cafeteriaItemsTotal, availableCouponValue);
  }
  const finalTotal = cartTotal - potentialDiscount;

  const processOrder = () => {
    // 1. Group cart items by vendor
    const ordersByVendor: { [key: string]: CartItem[] } = cartItems.reduce((acc, item) => {
        if (!acc[item.vendorName]) {
            acc[item.vendorName] = [];
        }
        acc[item.vendorName].push(item);
        return acc;
    }, {} as { [key: string]: CartItem[] });

    let totalCouponSavings = 0;

    // 2. Create one transaction per vendor
    Object.entries(ordersByVendor).forEach(([vendorName, items]) => {
        const vendor = vendors.find(v => v.name === vendorName);
        if (!vendor) return;

        const orderItems: OrderItem[] = items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let finalAmount = subtotal;
        let couponAmount = 0;
        let couponUsed = false;

        if (vendor.category === 'School Cafeteria' && subtotal > 0) {
            const { amountLeft } = useCouponValue(subtotal);
            couponAmount = subtotal - amountLeft;
            finalAmount = amountLeft;

            if (couponAmount > 0) {
                couponUsed = true;
                totalCouponSavings += couponAmount;
            }
        }
        
        // This is a type assertion because Omit is not filtering the type correctly in the calling function
        const newTransaction = {
            amount: finalAmount,
            vendor: vendorName,
            vendorCategory: vendor.category,
            items: orderItems,
            status: 'Placed',
            couponUsed,
            couponAmount,
            cashUsed: false,
        } as Omit<Transaction, 'id' | 'date'>;

        if (finalAmount > 0 || couponUsed) {
            addTransaction(newTransaction);
        }
    });
    
    clearCart();

    let toastDescription = 'Your order has been placed.';
    if (totalCouponSavings > 0) {
        toastDescription += ` You saved ₦${totalCouponSavings.toLocaleString()} with your daily coupon.`;
    }

    toast({
      title: 'Payment Successful!',
      description: toastDescription,
    });

    router.push('/dashboard');
  };
  
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: profile?.email || '',
    amount: Math.round(finalTotal * 100), // Amount in Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onPaystackSuccess = (reference: any) => {
    console.log('Paystack success reference:', reference);
    processOrder();
  };

  const onPaystackClose = () => {
    console.log('Paystack payment closed');
    toast({
      variant: 'destructive',
      title: 'Payment Canceled',
      description: 'You closed the payment window without completing it.',
    });
  };
  
  const handlePayment = () => {
    if (finalTotal <= 0) {
      processOrder();
      return;
    }

    if (paymentMethod === 'paystack') {
        if (!profile?.email || !process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
            toast({
              variant: 'destructive',
              title: 'Configuration Error',
              description: 'Paystack is not configured correctly. Please contact support.',
            });
            return;
        }
        initializePayment({ onSuccess: onPaystackSuccess, onClose: onPaystackClose });
    } else { // 'card' payment is a simulation
      processOrder();
    }
  };


  if (!isInitialized || cartItems.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getButtonText = () => {
    const methodText = paymentMethod === 'card' ? 'Card' : 'Paystack';
    if (finalTotal <= 0) {
        return 'Place Order';
    }
    return `Pay ₦${finalTotal.toLocaleString()} with ${methodText}`;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase by providing payment details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <Card className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Select your preferred payment method.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-4">
                        <Label htmlFor="payment-card" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                             <RadioGroupItem value="card" id="payment-card" />
                             <CreditCard className="h-6 w-6" />
                             <div className="grid gap-1.5">
                                 <span className="font-semibold">Card Payment</span>
                                 <span className="text-sm text-muted-foreground">Pay with your debit or credit card.</span>
                             </div>
                        </Label>
                        <Label htmlFor="payment-paystack" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                            <RadioGroupItem value="paystack" id="payment-paystack" />
                            <Wallet className="h-6 w-6"/>
                            <div className="grid gap-1.5">
                                <span className="font-semibold">Paystack</span>
                                <span className="text-sm text-muted-foreground">Pay securely using Paystack.</span>
                            </div>
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>

          {paymentMethod === 'card' && (
            <Card className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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
              </CardContent>
            </Card>
          )}

           {paymentMethod === 'paystack' && (
            <Card className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle>Pay with Paystack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You will be redirected to Paystack to complete your payment securely. Click the button below to proceed.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
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
              <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                 {potentialDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="text-muted-foreground">Coupon Discount</span>
                        <span>- ₦{potentialDiscount.toLocaleString()}</span>
                    </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total to Pay</span>
                    <span>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>
               <Button size="lg" className="w-full mt-6" onClick={handlePayment}>
                 {getButtonText()}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
