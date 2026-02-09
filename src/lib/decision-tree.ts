import type { Transaction, UserProfile, SpendingInsight, SpendingStatus } from './types';
import { isSameDay, startOfMonth } from 'date-fns';

interface DecisionTreeInput {
  profile: UserProfile;
  transactions: Transaction[];
}

export function analyzeSpending({ profile, transactions }: DecisionTreeInput): SpendingInsight {
  if (!profile || transactions.length === 0) {
    return {
      status: 'Good',
      advice: ['Start making transactions to get personalized spending advice.'],
    };
  }

  const advice: Set<string> = new Set();
  let score = 100; // Start with a perfect score

  const today = new Date();
  const monthlyAllowance = profile.monthlyAllowance;
  const dailyBudget = monthlyAllowance > 0 ? monthlyAllowance / 30 : 0;

  // --- Calculate Features ---
  const todaysTransactions = transactions.filter(t => isSameDay(new Date(t.date), today));
  const todaysSpending = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
  const todaysOrderCount = todaysTransactions.length;

  const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth(today));
  const monthlySpending = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const budgetUtilization = monthlyAllowance > 0 ? (monthlySpending / monthlyAllowance) * 100 : 0;
  
  const categorySpending: { [key: string]: number } = {};
    monthlyTransactions.forEach(t => {
    categorySpending[t.vendorCategory] = (categorySpending[t.vendorCategory] || 0) + t.amount;
  });

  const topCategory = Object.entries(categorySpending).sort(([, a], [, b]) => b - a)[0];

  const dailyBudgetUtilization = dailyBudget > 0 ? (todaysSpending / dailyBudget) * 100 : 0;

  // --- Decision Tree Rules ---

  // Rule 1: High daily spending & Risk Level
  if (dailyBudget > 0) {
    if (dailyBudgetUtilization > 80) {
      score -= 40;
      advice.add('You are at high risk of exceeding your daily budget. Limit further purchases.');
    } else if (dailyBudgetUtilization > 50) {
      score -= 20;
      advice.add('You are at medium risk of overspending today. Be mindful of your purchases.');
    }
  }

  // Rule 2: End-of-Day Forecast
  if (dailyBudget > 0) {
    const hoursPassed = new Date().getHours() + 1; // From 1 to 24 to avoid division by zero
    const endOfDayForecast = (todaysSpending / hoursPassed) * 24;
    if (endOfDayForecast > dailyBudget * 1.1) {
      score -= 15;
      const overage = endOfDayForecast - dailyBudget;
      advice.add(`At your current rate, you may exceed your daily budget by ₦${overage.toLocaleString(undefined, {maximumFractionDigits: 0})}.`);
    }
  }
  
  // Rule 3: High monthly spending relative to time
  const dayOfMonth = today.getDate();
  const monthProgress = (dayOfMonth / 30) * 100;
  if (budgetUtilization > monthProgress + 25) { // Significantly ahead of budget
    score -= 25;
    advice.add('You are spending your monthly allowance much faster than expected. Consider setting stricter limits.');
  }

  // Rule 4: Spending concentration
  if (topCategory && monthlySpending > 0) {
    const topCategoryPercentage = (topCategory[1] / monthlySpending) * 100;
    if (topCategoryPercentage > 60) {
      score -= 10;
      advice.add(`${topCategory[0]} purchases are the main contributor to your spending. Review if this can be optimized.`);
    }
  }

  // Rule 5: High order frequency
  if (todaysOrderCount > 5) {
    score -= 10;
    advice.add('Multiple small purchases can add up quickly. Try to consolidate your orders.');
  }

  // Determine final status based on score
  let status: SpendingStatus;
  if (score >= 80) {
    status = 'Good';
    if (advice.size === 0) advice.add('Your spending is on track. Keep up the good work!');
  } else if (score >= 50) {
    status = 'Moderate';
    if (advice.size === 0) advice.add('Your spending is okay, but there is room for improvement.');
  } else {
    status = 'Poor';
    // Add a generic "high risk" message if no specific advice led to the poor score
    if(advice.size === 0) {
      advice.add('You are at high risk of overspending. It is critical to review your purchases now.');
    }
  }

  return {
    status,
    advice: Array.from(advice),
  };
}
