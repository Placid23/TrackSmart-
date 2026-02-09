'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { UserProfile, Transaction } from '@/lib/types';
import { Target } from 'lucide-react';

interface FinancialGoalCardProps {
  profile: UserProfile;
  transactions: Transaction[];
}

export function FinancialGoalCard({ profile, transactions }: FinancialGoalCardProps) {
  const { goalName, goalAmount, savings, progress } = useMemo(() => {
    const goalName = profile.financialGoal;
    const goalAmount = profile.financialGoalAmount || 0;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlySpending = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Savings are what's left from the allowance so far
    const savings = profile.monthlyAllowance - monthlySpending;
    
    // Progress should not exceed 100% and not be negative
    const progress = goalAmount > 0 ? Math.max(0, Math.min((savings / goalAmount) * 100, 100)) : 0;

    return {
      goalName,
      goalAmount,
      savings: Math.max(0, savings), // Don't show negative savings
      progress
    };
  }, [profile, transactions]);

  if (!goalAmount || goalAmount <= 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Financial Goal
                </CardTitle>
                <CardDescription>Your progress towards your current savings goal.</CardDescription>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">{goalName}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-primary">
              ₦{savings.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              / ₦{goalAmount.toLocaleString()}
            </p>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-right text-sm font-medium text-primary">{progress.toFixed(1)}% Complete</p>
        </div>
      </CardContent>
    </Card>
  );
}
