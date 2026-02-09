
'use client';

import { useTransactions } from '@/lib/hooks/use-transactions';
import type { OrderStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const statusStyles: Record<OrderStatus, string> = {
  Placed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  'In Preparation': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  'Ready for Pickup': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
  'Picked Up': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
};

export default function ReportsPage() {
  const { transactions, isLoading } = useTransactions();

  const renderItems = (items: { name: string; quantity: number }[]) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return 'N/A';
    }
    const displayItems = items.map(i => `${i.name} (x${i.quantity})`);
    if (displayItems.join(', ').length > 50) {
      return displayItems[0] + '...';
    }
    return displayItems.join(', ');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Order History</h1>
        <p className="text-muted-foreground">A detailed log of all your expenses.</p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-card">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-card">
            <p className="text-muted-foreground">No transactions found.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="space-y-4 md:hidden">
              {transactions.map((t, index) => (
                <Card key={`${t.id}-${index}`}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-grow space-y-1">
                      <p className="font-semibold">{renderItems(t.items)}</p>
                      <p className="text-sm text-muted-foreground">{t.vendor}</p>
                       <div className="flex flex-wrap gap-2 pt-1">
                          <Badge variant="outline">{t.vendorCategory}</Badge>
                           <Badge className={cn('border', statusStyles[t.status])}>{t.status}</Badge>
                       </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        {new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-lg whitespace-nowrap">₦{t.amount.toLocaleString()}</p>
                      {t.couponUsed && <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800 border-none dark:bg-green-900/50 dark:text-green-300">Coupon</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Desktop View */}
            <Card className="hidden md:block">
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  Here is a list of all your recorded transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-center">Coupon</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t, index) => (
                          <TableRow key={`${t.id}-${index}`}>
                            <TableCell className="font-medium">
                              {new Date(t.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{renderItems(t.items)}</TableCell>
                            <TableCell>{t.vendor}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{t.vendorCategory}</Badge>
                            </TableCell>
                             <TableCell>
                               <Badge className={cn('border', statusStyles[t.status])}>{t.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              ₦{t.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              {t.couponUsed ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
