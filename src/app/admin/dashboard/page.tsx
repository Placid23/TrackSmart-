
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Receipt, DollarSign, Activity, Loader2 } from 'lucide-react';
import { collection, collectionGroup, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/lib/providers/firebase-provider';
import { startOfDay, startOfMonth } from 'date-fns';

interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalRevenue: number;
  totalOrders: number;
}

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Total Users
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const totalUsers = usersSnapshot.size;

        // 2. Transactions for the last 30 days
        const thirtyDaysAgo = startOfMonth(new Date()); // Simplified to start of month for consistent reporting
        const transactionsQuery = query(
          collectionGroup(firestore, 'transactions'),
          where('date', '>=', thirtyDaysAgo.toISOString())
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);

        let totalRevenue = 0;
        let totalOrders = transactionsSnapshot.size;
        const activeUsersTodaySet = new Set<string>();
        const todayStr = startOfDay(new Date()).toISOString();

        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();
          totalRevenue += data.amount || 0;
          
          // Check if it was today
          if (data.date >= todayStr) {
            // In a real app, the path would be /users/{uid}/transactions/{tid}
            // We can extract the UID from the path
            const pathSegments = doc.ref.path.split('/');
            const uid = pathSegments[1];
            if (uid) activeUsersTodaySet.add(uid);
          }
        });

        setStats({
          totalUsers,
          activeUsersToday: activeUsersTodaySet.size,
          totalRevenue,
          totalOrders,
        });
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.message || 'Failed to load dashboard data. Please ensure you have admin permissions.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [firestore]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
        <h2 className="text-lg font-bold mb-2">Error</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm opacity-80">
          Tip: Ensure your user document in Firestore has <code>isAdmin: true</code> (Boolean) and you have signed out and back in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Real-time summary of activity on TrackSmart+ (Last 30 days).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Across the entire platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (Today)</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activeUsersToday.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Unique users with transactions today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦{stats?.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Sum of all transactions this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders (30d)</CardTitle>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-3xl font-bold">{stats?.totalOrders.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Number of orders processed this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
