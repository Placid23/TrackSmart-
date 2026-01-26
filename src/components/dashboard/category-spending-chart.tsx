'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';

interface CategorySpendingChartProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function CategorySpendingChart({ transactions }: CategorySpendingChartProps) {
  const chartData = useMemo(() => {
    const categorySpending: { [key: string]: number } = {};
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
        categorySpending[t.vendorCategory] = (categorySpending[t.vendorCategory] || 0) + t.amount;
      }
    });

    const totalSpending = Object.values(categorySpending).reduce((acc, val) => acc + val, 0);
    if (totalSpending === 0) return [];

    return Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Category Spending</CardTitle>
                <CardDescription>Your spending distribution by category.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">No spending data for this month yet.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Spending</CardTitle>
        <CardDescription>Your spending distribution by category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Spent"]}
            />
            <Legend
                verticalAlign="bottom"
                height={48}
                iconType="circle"
                formatter={(value) => <span className="text-muted-foreground">{value}</span>}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={2}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + (radius + 15) * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + (radius + 15) * Math.sin(-midAngle * (Math.PI / 180));
                if (percent < 0.05) return null; // Don't render label for small slices
                return (
                  <text x={x} y={y} fill="hsl(var(--primary-foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
