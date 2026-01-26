import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { TrendingUp, TrendingDown, Ticket, Banknote } from 'lucide-react';
import { useMemo } from 'react';

interface StatsCardsProps {
  transactions: Transaction[];
  monthlyAllowance: number;
}

export function StatsCards({ transactions, monthlyAllowance }: StatsCardsProps) {
  const { totalSpent, budgetRemaining, couponSavings } = useMemo(() => {
    const today = new Date();
    const currentMonthTransactions = transactions.filter(
      t => new Date(t.date).getMonth() === today.getMonth() && new Date(t.date).getFullYear() === today.getFullYear()
    );

    const totalSpent = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const budgetRemaining = monthlyAllowance - totalSpent;
    const couponSavings = currentMonthTransactions
      .filter(t => t.couponUsed)
      .reduce((sum, t) => sum + (t.couponAmount || 0), 0);
      
    return { totalSpent, budgetRemaining, couponSavings };
  }, [transactions, monthlyAllowance]);

  const budgetUtilization = monthlyAllowance > 0 ? (totalSpent / monthlyAllowance) * 100 : 0;

  const stats = [
    {
      title: 'Total Spent (This Month)',
      value: `₦${totalSpent.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-500',
    },
    {
      title: 'Budget Remaining',
      value: `₦${budgetRemaining.toLocaleString()}`,
      icon: TrendingUp,
      color: budgetRemaining >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      title: 'Budget Utilization',
      value: `${budgetUtilization.toFixed(1)}%`,
      icon: Banknote,
      color: 'text-blue-500',
    },
    {
      title: 'Coupon Savings',
      value: `₦${couponSavings.toLocaleString()}`,
      icon: Ticket,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
