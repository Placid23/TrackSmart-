'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SpendingInsight, SpendingStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Lightbulb, Smile, Meh, Frown } from 'lucide-react';

interface SpendingInsightsProps {
  insights: SpendingInsight;
}

const statusConfig: { [key in SpendingStatus]: {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  textClass: string;
}} = {
  Good: {
    label: "Good Spending",
    icon: Smile,
    badgeClass: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
    textClass: "text-green-600 dark:text-green-400",
  },
  Moderate: {
    label: "Moderate Spending",
    icon: Meh,
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
    textClass: "text-yellow-600 dark:text-yellow-400",
  },
  Poor: {
    label: "Poor Spending",
    icon: Frown,
    badgeClass: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
    textClass: "text-red-600 dark:text-red-400",
  },
};

export function SpendingInsights({ insights }: SpendingInsightsProps) {
  const config = statusConfig[insights.status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Spending Insights</CardTitle>
                <CardDescription>AI-powered advice to help you save.</CardDescription>
            </div>
            <Badge className={cn("text-sm", config.badgeClass)}>
                <Icon className="mr-2 h-4 w-4" />
                {config.label}
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.advice.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
