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

      <Card className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : transactions.length > 0 ? (
                  transactions.map(t => (
                    <TableRow key={t.id}>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
