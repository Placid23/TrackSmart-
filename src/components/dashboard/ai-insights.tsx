'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Lightbulb, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import {
  personalizedSpendingAdvice,
  type PersonalizedSpendingAdviceOutput,
} from '@/ai/flows/personalized-spending-advice';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import type { Transaction } from '@/lib/types';

interface AIInsightsProps {
  transactions: Transaction[];
}

export function AIInsights({ transactions }: AIInsightsProps) {
  const { profile } = useUserProfile();
  const [insights, setInsights] = useState<PersonalizedSpendingAdviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = async () => {
    if (!profile) return;
    setIsLoading(true);
    setError(null);
    setInsights(null);

    try {
      const simplifiedExpenses = transactions.map(t => ({
        amount: t.amount,
        vendorCategory: t.vendorCategory,
        couponUsed: t.couponUsed,
        cashUsed: t.cashUsed,
        date: new Date(t.date).toLocaleDateString(),
        time: new Date(t.date).toLocaleTimeString(),
      }));

      const result = await personalizedSpendingAdvice({
        expenses: simplifiedExpenses,
        monthlyAllowance: profile.monthlyAllowance,
      });
      setInsights(result);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile && transactions.length > 0) {
      getInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClassificationBadge = (classification?: 'Good' | 'Moderate' | 'Poor') => {
    switch (classification) {
      case 'Good':
        return (
          <Badge className="bg-success/20 text-success-foreground border-success hover:bg-success/30">
            <CheckCircle className="mr-2 h-4 w-4" /> Good
          </Badge>
        );
      case 'Moderate':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-400">
            <AlertTriangle className="mr-2 h-4 w-4" /> Moderate
          </Badge>
        );
      case 'Poor':
        return (
          <Badge variant="destructive" className="bg-warning/20 text-warning-foreground border-warning hover:bg-warning/30">
            <XCircle className="mr-2 h-4 w-4" /> Poor
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Financial Advisor
        </CardTitle>
        <CardDescription>Personalized advice based on your spending.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing your spending habits...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-destructive">
            <p>{error}</p>
            <Button onClick={getInsights} className="mt-4">
              Try Again
            </Button>
          </div>
        )}
        {insights && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Spending Classification</h3>
              {getClassificationBadge(insights.spendingClassification)}
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4"/>Insights</h3>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                {insights.insights}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4"/>Recommendations</h3>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                {insights.recommendations}
              </p>
            </div>
             <Button onClick={getInsights} variant="outline" size="sm" className="w-full mt-4">
              <Sparkles className="mr-2 h-4 w-4" />
              Regenerate Advice
            </Button>
          </div>
        )}
        {!isLoading && !insights && !error && (
           <div className="text-center">
             <p className="text-muted-foreground mb-4">Click to get your financial analysis.</p>
            <Button onClick={getInsights}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Advice
            </Button>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
