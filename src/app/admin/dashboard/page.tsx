'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/lib/providers/firebase-provider';
import { collection, collectionGroup, getDocs } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Receipt, DollarSign, Activity, Loader2 } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { isToday } from 'date-fns';

interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  totalRevenue: number;
  totalOrders: number;
}

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      if (!firestore) return;

      try {
        // Fetch all users to get the total count
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const totalUsers = usersSnapshot.size;

        // Fetch all transactions from all users using a collection group query
        const transactionsGroup = collectionGroup(firestore, 'transactions');
        const transactionsSnapshot = await getDocs(transactionsGroup);
        
        const allTransactions = transactionsSnapshot.docs.map(doc => doc.data() as Transaction);
        
        const totalOrders = allTransactions.length;
        const totalRevenue = allTransactions.reduce((sum, t) => sum + t.amount, 0);

        // Calculate active users today (defined as users who made a transaction today)
        const activeUserIds = new Set<string>();
        transactionsSnapshot.forEach(doc => {
          const transactionDate = new Date(doc.data().date);
          if (isToday(transactionDate)) {
            // The path is structured as 'users/{userId}/transactions/{transactionId}'
            const pathParts = doc.ref.path.split('/');
            if (pathParts.length >= 2 && pathParts[0] === 'users') {
              const userId = pathParts[1];
              activeUserIds.add(userId);
            }
          }
        });
        const activeUsersToday = activeUserIds.size;

        setStats({
          totalUsers,
          activeUsersToday,
          totalRevenue,
          totalOrders,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminStats();
  }, [firestore]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
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
          A high-level summary of all activity on TrackSmart+.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers.toLocaleString() ?? '0'}</p>
            <p className="text-xs text-muted-foreground">Total users on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (Today)</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activeUsersToday.toLocaleString() ?? '0'}</p>
            <p className="text-xs text-muted-foreground">Users with transactions today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦{stats?.totalRevenue.toLocaleString() ?? '0'}</p>
            <p className="text-xs text-muted-foreground">Total transaction value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders Placed</CardTitle>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-3xl font-bold">{stats?.totalOrders.toLocaleString() ?? '0'}</p>
            <p className="text-xs text-muted-foreground">Total orders on the platform</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
