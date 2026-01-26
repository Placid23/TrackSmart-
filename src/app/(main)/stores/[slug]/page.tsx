'use client';

import { useState, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { vendors } from '@/lib/data';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useCoupon } from '@/lib/hooks/use-coupon';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Vendor, VendorItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function VendorPage() {
  const params = useParams<{ slug: string }>();
  const { addTransaction } = useTransactions();
  const { toast } = useToast();
  const { coupon, useCouponValue } = useCoupon();
  const [useCouponSwitch, setUseCouponSwitch] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VendorItem | null>(null);

  const vendor: Vendor | undefined = useMemo(() => {
    if (!params.slug) return undefined;
    return vendors.find(v => v.name.toLowerCase().replace(/\s+/g, '-') === params.slug);
  }, [params.slug]);

  if (!params.slug) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) {
    notFound();
  }

  const handlePurchase = () => {
    if (!selectedItem) return;

    const isCafeteria = vendor.category === 'School Cafeteria';
    const canUseCoupon = isCafeteria && coupon?.isValid;
    const applyCoupon = canUseCoupon && useCouponSwitch;
    
    let finalAmount = selectedItem.price;
    let couponAmount = 0;

    if (applyCoupon && coupon) {
      const remainingCouponValue = useCouponValue(selectedItem.price);
      couponAmount = selectedItem.price - remainingCouponValue.amountLeft;
      finalAmount = remainingCouponValue.amountLeft;
    }

    addTransaction({
      amount: finalAmount,
      vendor: vendor.name,
      vendorCategory: vendor.category,
      item: selectedItem.name,
      couponUsed: applyCoupon,
      couponAmount,
      cashUsed: Math.random() > 0.5,
    });

    toast({
      title: 'Purchase Successful',
      description: `You bought ${selectedItem.name}. You paid ₦${finalAmount.toLocaleString()}${applyCoupon ? ` (saved ₦${couponAmount.toLocaleString()})` : ''}.`,
    });

    setUseCouponSwitch(false);
    setSelectedItem(null);
  };

  const mealTimeCategories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  const filteredItems = (category: string) => {
    if (category === 'All') return vendor.items;
    return vendor.items.filter(item => item.mealTime?.includes(category as 'Breakfast' | 'Lunch' | 'Dinner'));
  };

  const hasMealTimeItems = vendor.items.some(item => item.mealTime);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{vendor.name}</h1>
        <p className="text-muted-foreground">Browse the menu and make a purchase.</p>
      </div>

      <AlertDialog>
        {hasMealTimeItems ? (
          <Tabs defaultValue="All">
            <TabsList>
              {mealTimeCategories.map(cat => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
            {mealTimeCategories.map(cat => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredItems(cat).map(item => (
                    <AlertDialogTrigger asChild key={item.name} onClick={() => setSelectedItem(item)}>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="font-semibold text-lg">₦{item.price.toLocaleString()}</p>
                          <Button variant="outline" className="w-full mt-4">Order Now</Button>
                        </CardContent>
                      </Card>
                    </AlertDialogTrigger>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {vendor.items.map(item => (
              <AlertDialogTrigger asChild key={item.name} onClick={() => setSelectedItem(item)}>
                 <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg">₦{item.price.toLocaleString()}</p>
                    <Button variant="outline" className="w-full mt-4">Order Now</Button>
                  </CardContent>
                </Card>
              </AlertDialogTrigger>
            ))}
          </div>
        )}

        {selectedItem && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to buy {selectedItem.name} for ₦{selectedItem.price.toLocaleString()}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            {vendor.category === 'School Cafeteria' && coupon?.isValid && coupon.value > 0 && (
              <div className="flex items-center space-x-2 my-4">
                <Switch id="use-coupon" onCheckedChange={setUseCouponSwitch} checked={useCouponSwitch}/>
                <Label htmlFor="use-coupon">Use Daily Coupon (₦{coupon.value.toLocaleString()} left)?</Label>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedItem(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePurchase}>Purchase</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
}
