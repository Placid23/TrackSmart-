import type { Transaction, UserProfile, SpendingInsight, SpendingStatus } from './types';
import { isSameDay, startOfMonth, isWeekend } from 'date-fns';

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
  const dailyBudget = monthlyAllowance / 30;

  // --- Calculate Features ---
  const todaysTransactions = transactions.filter(t => isSameDay(new Date(t.date), today));
  const todaysSpending = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
  const todaysOrderCount = todaysTransactions.length;

  const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth(today));
  const monthlySpending = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const budgetUtilization = (monthlySpending / monthlyAllowance) * 100;
  
  const categorySpending: { [key: string]: number } = {};
    monthlyTransactions.forEach(t => {
    categorySpending[t.vendorCategory] = (categorySpending[t.vendorCategory] || 0) + t.amount;
  });

  const topCategory = Object.entries(categorySpending).sort(([, a], [, b]) => b - a)[0];

  // --- Decision Tree Rules ---

  // Rule 1: High daily spending
  if (todaysSpending > dailyBudget * 1.5) {
    score -= 40;
    advice.add('Your spending today is significantly higher than your daily average. Try to curb expenses for the rest of the day.');
  } else if (todaysSpending > dailyBudget) {
    score -= 20;
    advice.add(`You've exceeded your daily budget average. Be mindful of further purchases today.`);
  }

  // Rule 2: High monthly spending relative to time
  const dayOfMonth = today.getDate();
  const monthProgress = (dayOfMonth / 30) * 100;
  if (budgetUtilization > monthProgress + 25) { // Significantly ahead of budget
    score -= 30;
    advice.add('You are spending your monthly allowance faster than expected. Consider setting stricter limits.');
  } else if (budgetUtilization > monthProgress + 10) {
    score -= 15;
    advice.add('Your spending is trending high for the month. Keep an eye on your budget.');
  }

  // Rule 3: High order frequency
  if (todaysOrderCount > 5) {
    score -= 15;
    advice.add('Multiple small purchases can add up. Try to consolidate your orders.');
  }

  // Rule 4: Spending concentration
  if (topCategory && monthlySpending > 0) {
    const topCategoryPercentage = (topCategory[1] / monthlySpending) * 100;
    if (topCategoryPercentage > 60) {
      score -= 10;
      advice.add(`A large portion of your budget (${topCategoryPercentage.toFixed(0)}%) is going towards ${topCategory[0]}. Review if this can be optimized.`);
    }
  }

  // Rule 5: Weekend spending
  if (isWeekend(today) && todaysSpending > dailyBudget * 1.2) {
    score -= 10;
    advice.add('Weekend spending can be high. Plan your weekend budget to avoid overspending.');
  }

  // Determine final status based on score
  let status: SpendingStatus;
  if (score >= 80) {
    status = 'Good';
    if (advice.size === 0) advice.add('You are managing your budget well. Keep it up!');
  } else if (score >= 50) {
    status = 'Moderate';
    if (advice.size === 0) advice.add('Your spending is okay, but there is room for improvement.');
  } else {
    status = 'Poor';
    advice.add('You are at high risk of overspending. It is critical to review your purchases now.');
  }

  return {
    status,
    advice: Array.from(advice),
  };
}
