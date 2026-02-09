
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Receipt } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Platform Overview
        </h1>
        <p className="text-muted-foreground">
          A high-level summary of all activity on TrackSmart+.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Across the platform</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
