
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Receipt, DollarSign, Activity, Loader2, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { collection, collectionGroup, getDocs, query, where, limit } from 'firebase/firestore';
import { useFirestore } from '@/lib/providers/firebase-provider';
import { startOfMonth, startOfDay } from 'date-fns';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [isIndexMissing, setIsIndexMissing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsIndexMissing(false);

      // 1. Total Users
      const usersRef = collection(firestore, 'users');
      const usersSnapshot = await getDocs(query(usersRef, limit(500))).catch(err => {
        if (err.code === 'permission-denied' || err.message?.includes('permissions')) {
          const permError = new FirestorePermissionError({
            path: usersRef.path,
            operation: 'list'
          });
          errorEmitter.emit('permission-error', permError);
          throw permError;
        }
        throw err;
      });
      const totalUsers = usersSnapshot.size;

      // 2. Transactions (Last 30 Days) using collectionGroup
      const thirtyDaysAgo = startOfMonth(new Date());
      const transactionsRef = collectionGroup(firestore, 'transactions');
      const transactionsQuery = query(
        transactionsRef,
        where('date', '>=', thirtyDaysAgo.toISOString())
      );
      
      const transactionsSnapshot = await getDocs(transactionsQuery).catch(err => {
        // Handle Missing Index Error
        if (err.message?.toLowerCase().includes('index') || err.code === 'failed-precondition') {
          setIsIndexMissing(true);
          throw new Error('Firestore index required for Collection Group.');
        }
        if (err.code === 'permission-denied' || err.message?.includes('permissions')) {
          const permError = new FirestorePermissionError({
            path: 'collectionGroup(transactions)',
            operation: 'list'
          });
          errorEmitter.emit('permission-error', permError);
          throw permError;
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
  }, [firestore]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, retryCount]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          Real-time summary of activity on TrackSmart+ (Current Month).
        </p>
      </div>

      {isIndexMissing && (
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
          <Info className="h-4 w-4" />
          <AlertTitle>Single Field Index Configuration Required</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Firestore requires you to enable <strong>Collection Group</strong> scope for the <code>date</code> field in your transactions.</p>
            <div className="bg-background/50 p-4 rounded-md border text-sm space-y-2">
                <p><strong>Steps to fix:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Go to the <strong>Indexes</strong> section in your Firebase Console.</li>
                    <li>Click the <strong>Single Field</strong> tab.</li>
                    <li>Click <strong>Add Exemption</strong>.</li>
                    <li>Collection ID: <code>transactions</code></li>
                    <li>Field Path: <code>date</code></li>
                    <li>Under <strong>Query Scopes</strong>, enable <strong>Collection Group</strong>.</li>
                    <li>Click <strong>Save</strong> and wait a few minutes.</li>
                </ol>
            </div>
            <Button size="sm" variant="outline" onClick={() => setRetryCount(prev => prev + 1)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Dashboard
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && !isIndexMissing && (
        <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3 text-destructive mb-4">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Data Fetch Error</h2>
          </div>
          <div className="bg-background/80 p-5 rounded-lg border shadow-sm space-y-4 mb-6">
            <code className="block p-3 bg-muted rounded text-xs overflow-x-auto whitespace-pre-wrap">
              {error}
            </code>
          </div>
          <Button onClick={() => setRetryCount(prev => prev + 1)} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers.toLocaleString() ?? '...'}</p>
            <p className="text-xs text-muted-foreground">Across the entire platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (Today)</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activeUsersToday.toLocaleString() ?? '...'}</p>
            <p className="text-xs text-muted-foreground">Unique users with transactions today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦{stats?.totalRevenue.toLocaleString() ?? '...'}</p>
            <p className="text-xs text-muted-foreground">Sum of all transactions this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders (30d)</CardTitle>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-3xl font-bold">{stats?.totalOrders.toLocaleString() ?? '...'}</p>
            <p className="text-xs text-muted-foreground">Number of orders processed this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
