'use client';

import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { Loader2 } from 'lucide-react';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { CategorySpendingChart } from '@/components/dashboard/category-spending-chart';
import { SpendingInsights } from '@/components/dashboard/spending-insights';
import { analyzeSpending } from '@/lib/decision-tree';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const spendingInsights = useMemo(() => {
    if (!profile || isTransactionsLoading) {
      return { status: 'Good' as const, advice: ['Loading insights...'] };
    }
    return analyzeSpending({ profile, transactions });
  }, [profile, transactions, isTransactionsLoading]);

  if (isProfileLoading || isTransactionsLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Welcome back, {profile?.fullName.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your financial activity this month.
        </p>
      </div>

      <StatsCards transactions={transactions} monthlyAllowance={profile?.monthlyAllowance || 0} />

      <div className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <SpendingInsights insights={spendingInsights} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <SpendingChart transactions={transactions} />
        </div>
        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
          <CategorySpendingChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
