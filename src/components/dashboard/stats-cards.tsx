'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { TrendingUp, TrendingDown, Ticket, Banknote, Minus } from 'lucide-react';
import { useMemo } from 'react';

interface StatsCardsProps {
  transactions: Transaction[];
  monthlyAllowance: number;
}

export function StatsCards({ transactions, monthlyAllowance }: StatsCardsProps) {
  const { totalSpent, budgetRemaining, couponSavings, spendingTrend } = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const lastMonthDate = new Date(today);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const lastMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === lastMonth && transactionDate.getFullYear() === lastMonthYear;
    });

    const totalSpent = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalSpentLastMonth = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

    let spendingTrend = 0;
    if (totalSpentLastMonth > 0) {
      spendingTrend = ((totalSpent - totalSpentLastMonth) / totalSpentLastMonth) * 100;
    } else if (totalSpent > 0) {
      spendingTrend = 100;
    }

    const budgetRemaining = monthlyAllowance - totalSpent;
    const couponSavings = currentMonthTransactions
      .filter(t => t.couponUsed)
      .reduce((sum, t) => sum + (t.couponAmount || 0), 0);
      
    return { totalSpent, budgetRemaining, couponSavings, spendingTrend };
  }, [transactions, monthlyAllowance]);

  const budgetUtilization = monthlyAllowance > 0 ? (totalSpent / monthlyAllowance) * 100 : 0;

  const stats = [
    {
      title: 'Total Spent (This Month)',
      value: `₦${totalSpent.toLocaleString()}`,
      icon: spendingTrend > 0 ? TrendingUp : spendingTrend < 0 ? TrendingDown : Minus,
      color: spendingTrend > 0 ? 'text-red-500' : spendingTrend < 0 ? 'text-green-500' : 'text-muted-foreground',
      trend: spendingTrend,
    },
    {
      title: 'Budget Remaining',
      value: `₦${budgetRemaining.toLocaleString()}`,
      icon: budgetRemaining >= 0 ? TrendingUp : TrendingDown,
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
      {stats.map((stat, index) => (
        <Card key={stat.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.trend !== undefined && (
              <p className="text-xs text-muted-foreground">
                {stat.trend === 0
                  ? 'No change from last month'
                  : (
                    <>
                      <span className={`font-medium ${stat.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {Math.abs(stat.trend).toFixed(1)}%
                      </span>
                      {` ${stat.trend > 0 ? 'more' : 'less'} than last month`}
                    </>
                  )
                }
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
