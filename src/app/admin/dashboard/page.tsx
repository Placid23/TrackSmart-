'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Receipt, DollarSign, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  // Hard-coded placeholder values for the dashboard overview
  const stats = {
    totalUsers: 1254,
    activeUsersToday: 86,
    totalRevenue: 452300,
    totalOrders: 276,
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          A high-level summary of activity on TrackSmart+.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total users registered on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (Today)</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeUsersToday.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Users with at least one order today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (Last 30d)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total transaction value in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders (Last 30d)</CardTitle>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total number of orders in the last 30 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
