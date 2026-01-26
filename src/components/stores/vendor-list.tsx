'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Vendor, VendorItem } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useToast } from '@/hooks/use-toast';
import { useCoupon } from '@/lib/hooks/use-coupon';
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
} from '../ui/alert-dialog';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface VendorListProps {
  vendors: Vendor[];
}

const categoryImageMap: Record<string, string> = {
  'School Cafeteria': 'vendor-cafeteria',
  'Private Food Vendors': 'vendor-food',
  'Gadget Vendors': 'vendor-gadgets',
  'Health & Utility Vendors': 'vendor-health',
};

const getPlaceholderImage = (category: string) => {
  const id = categoryImageMap[category];
  return PlaceHolderImages.find(img => img.id === id);
};

export function VendorList({ vendors }: VendorListProps) {
  const { addTransaction } = useTransactions();
  const { toast } = useToast();
  const { coupon, useCouponValue } = useCoupon();
  const [useCouponSwitch, setUseCouponSwitch] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handlePurchase = (vendor: Vendor, item: VendorItem) => {
    const isCafeteria = vendor.category === 'School Cafeteria';
    const canUseCoupon = isCafeteria && coupon?.isValid;
    const applyCoupon = canUseCoupon && useCouponSwitch;
    
    let finalAmount = item.price;
    let couponAmount = 0;

    if (applyCoupon && coupon) {
      const remainingCouponValue = useCouponValue(item.price);
      couponAmount = item.price - remainingCouponValue.amountLeft;
      finalAmount = remainingCouponValue.amountLeft;
    }

    addTransaction({
      amount: finalAmount,
      vendor: vendor.name,
      vendorCategory: vendor.category,
      item: item.name,
      couponUsed: applyCoupon,
      couponAmount,
      cashUsed: Math.random() > 0.5,
    });

    toast({
      title: 'Purchase Successful',
      description: `You bought ${item.name}. You paid ₦${finalAmount.toLocaleString()}${applyCoupon ? ` (saved ₦${couponAmount.toLocaleString()})` : ''}.`,
    });

    setUseCouponSwitch(false);
  };
  
  const handleDialogChange = (open: boolean) => {
    setOpenDialog(open);
    if (!open) {
      setUseCouponSwitch(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map(vendor => (
        <Dialog key={vendor.name} onOpenChange={handleDialogChange}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-40 w-full">
                <Image
                  src={getPlaceholderImage(vendor.category)?.imageUrl || ''}
                  alt={vendor.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={getPlaceholderImage(vendor.category)?.imageHint}
                />
              </div>
              <div className="p-6 pb-2">
                <CardTitle>{vendor.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DialogTrigger asChild>
                <Button className="w-full">View Items</Button>
              </DialogTrigger>
            </CardContent>
          </Card>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{vendor.name}</DialogTitle>
              <DialogDescription>Select an item to purchase.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              {vendor.items.map(item => (
                <AlertDialog key={item.name}>
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center justify-between p-3 rounded-md hover:bg-secondary cursor-pointer">
                      <span>{item.name}</span>
                      <span className="font-semibold">₦{item.price.toLocaleString()}</span>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to buy {item.name} for ₦{item.price.toLocaleString()}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {vendor.category === 'School Cafeteria' && coupon?.isValid && coupon.value > 0 && (
                       <div className="flex items-center space-x-2 my-4">
                        <Switch id="use-coupon" onCheckedChange={setUseCouponSwitch} checked={useCouponSwitch}/>
                        <Label htmlFor="use-coupon">Use Daily Coupon (₦{coupon.value.toLocaleString()} left)?</Label>
                      </div>
                    )}
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handlePurchase(vendor, item)}>
                        Purchase
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
