'use client';

import { useTransactions } from '@/lib/hooks/use-transactions';
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

export default function ReportsPage() {
  const { transactions, isLoading } = useTransactions();

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
                      <p className="font-semibold">{t.item}</p>
                      <p className="text-sm text-muted-foreground">{t.vendor}</p>
                      <p className="text-xs text-muted-foreground pt-1">
                        {new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-lg whitespace-nowrap">₦{t.amount.toLocaleString()}</p>
                      <div className="flex flex-col items-end gap-1 mt-1">
                        <Badge variant="outline">{t.vendorCategory}</Badge>
                        {t.couponUsed && <Badge variant="secondary" className="bg-green-100 text-green-800 border-none dark:bg-green-900/50 dark:text-green-300">Coupon</Badge>}
                      </div>
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
                        <TableHead>Item</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
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
                            <TableCell>{t.item}</TableCell>
                            <TableCell>{t.vendor}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{t.vendorCategory}</Badge>
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
