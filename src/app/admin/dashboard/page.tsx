
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Receipt, DollarSign, Activity, Loader2, AlertCircle } from 'lucide-react';
import { collection, collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { useFirestore } from '@/lib/providers/firebase-provider';
import { startOfMonth, startOfDay } from 'date-fns';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';

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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Total Users
        const usersRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersRef).catch(err => {
          if (err.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: usersRef.path,
              operation: 'list'
            }));
          }
          throw err;
        });
        const totalUsers = usersSnapshot.size;

        // 2. Transactions (Last 30 Days)
        const thirtyDaysAgo = startOfMonth(new Date());
        const transactionsRef = collectionGroup(firestore, 'transactions');
        const transactionsQuery = query(
          transactionsRef,
          where('date', '>=', thirtyDaysAgo.toISOString())
        );
        
        const transactionsSnapshot = await getDocs(transactionsQuery).catch(err => {
          if (err.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: 'collectionGroup(transactions)',
              operation: 'list'
            }));
          }
          throw err;
        });

        let totalRevenue = 0;
        let totalOrders = transactionsSnapshot.size;
        const activeUsersTodaySet = new Set<string>();
        const todayStr = startOfDay(new Date()).toISOString();

        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();
          totalRevenue += data.amount || 0;
          if (data.date >= todayStr) {
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
        console.error('Admin Dashboard Fetch Error:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [firestore, retryCount]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 max-w-2xl mx-auto mt-8">
        <div className="flex items-center gap-3 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-bold">Access Denied or Connection Error</h2>
        </div>
        <p className="text-muted-foreground mb-4">{error}</p>
        <div className="bg-background/50 p-4 rounded-lg border text-sm space-y-2 mb-6">
          <p><strong>Troubleshooting Steps:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Verify your document at <code>users/[YOUR_UID]</code> has <code>isAdmin: true</code> (Boolean type).</li>
            <li>Sign out and sign back in to refresh your authentication token.</li>
            <li>Ensure you have a stable internet connection.</li>
          </ul>
        </div>
        <Button onClick={() => setRetryCount(prev => prev + 1)} variant="outline">
          Retry Connection
        </Button>
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
