'use client';

import { useState, useMemo } from 'react';
import { useTransactions } from '@/lib/hooks/use-transactions';
import type { OrderStatus, VendorCategoryName } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { isAfter, subDays, startOfWeek, startOfMonth, isToday } from 'date-fns';

const statusStyles: Record<OrderStatus, string> = {
  Placed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  'In Preparation': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  'Ready for Pickup': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
  'Picked Up': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
};

export default function ReportsPage() {
  const { transactions, isLoading } = useTransactions();

  const [dateRange, setDateRange] = useState('all');
  const [vendor, setVendor] = useState('all');
  const [category, setCategory] = useState<VendorCategoryName | 'all'>('all');

  const uniqueVendors = useMemo(() => ['all', ...Array.from(new Set(transactions.map(t => t.vendor)))], [transactions]);
  const uniqueCategories = useMemo(() => ['all', ...Array.from(new Set(transactions.map(t => t.vendorCategory)))], [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);

      // Date range filter
      let dateMatch = true;
      switch (dateRange) {
        case 'today':
          dateMatch = isToday(transactionDate);
          break;
        case 'this-week':
          dateMatch = isAfter(transactionDate, startOfWeek(now));
          break;
        case 'this-month':
          dateMatch = isAfter(transactionDate, startOfMonth(now));
          break;
        case 'last-30-days':
          dateMatch = isAfter(transactionDate, subDays(now, 30));
          break;
        default: // 'all'
          dateMatch = true;
      }

      // Vendor filter
      const vendorMatch = vendor === 'all' || t.vendor === vendor;

      // Category filter
      const categoryMatch = category === 'all' || t.vendorCategory === category;

      return dateMatch && vendorMatch && categoryMatch;
    });
  }, [transactions, dateRange, vendor, category]);
  
  const resetFilters = () => {
    setDateRange('all');
    setVendor('all');
    setCategory('all');
  };

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
  
  const isFiltered = dateRange !== 'all' || vendor !== 'all' || category !== 'all';

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Order History</h1>
        <p className="text-muted-foreground">A detailed log of all your expenses.</p>
      </div>

      <Card className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-range-filter">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="date-range-filter">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vendor-filter">Vendor</Label>
            <Select value={vendor} onValueChange={setVendor} disabled={uniqueVendors.length <= 1}>
              <SelectTrigger id="vendor-filter">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {uniqueVendors.map(v => <SelectItem key={v} value={v}>{v === 'all' ? 'All Vendors' : v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as VendorCategoryName | 'all')} disabled={uniqueCategories.length <= 1}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
             <Button variant="outline" onClick={resetFilters} className="w-full" disabled={!isFiltered}>
              <X className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-card">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-card">
            <p className="text-muted-foreground">{isFiltered ? "No transactions match your filters." : "No transactions found."}</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="space-y-4 md:hidden">
              {filteredTransactions.map((t, index) => (
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
                <CardTitle>Filtered Transactions</CardTitle>
                <CardDescription>
                  Displaying {filteredTransactions.length} of {transactions.length} total transactions.
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
                        {filteredTransactions.map((t, index) => (
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
