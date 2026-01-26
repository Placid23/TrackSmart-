'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Ticket, Wallet } from 'lucide-react';
import { useCoupon } from '@/lib/hooks/use-coupon';
import { Card, CardContent } from './ui/card';

export function CouponWallet() {
  const { coupon, isLoading } = useCoupon();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Wallet className="h-5 w-5" />
          <span className="sr-only">Coupon Wallet</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Daily Coupon Wallet</SheetTitle>
          <SheetDescription>
            Your daily coupon for use at the school cafeteria. It refreshes every 24 hours.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8">
          {isLoading ? (
            <p>Loading coupon...</p>
          ) : coupon ? (
            <Card
              className={
                coupon.isValid
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                  : 'bg-gradient-to-br from-neutral-50 to-gray-100 border-gray-200'
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Ticket
                      className={`h-10 w-10 ${
                        coupon.isValid ? 'text-green-600' : 'text-gray-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">Coupon Value</p>
                      <p className="text-3xl font-bold font-headline">
                        ₦{coupon.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      coupon.isValid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {coupon.isValid ? 'VALID' : 'USED'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p>No coupon available. Please complete your profile.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
