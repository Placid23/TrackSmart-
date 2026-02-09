'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

const placeholderLogs = [
  {
    timestamp: '2023-06-24 10:05:12',
    admin: 'alex.doe@example.com',
    action: 'User Role Updated',
    target: 'User: jane.smith@example.com',
    details: 'Role changed from Student to Admin.',
  },
  {
    timestamp: '2023-06-24 09:45:30',
    admin: 'alex.doe@example.com',
    action: 'Meal Edited',
    target: 'Meal: Jollof Rice & Chicken',
    details: 'Price changed from ₦1500 to ₦1600.',
  },
  {
    timestamp: '2023-06-23 18:20:00',
    admin: 'System',
    action: 'Vendor Deactivated',
    target: 'Vendor: Foodies Corner',
    details: 'Vendor marked as inactive automatically due to no sales in 30 days.',
  },
    {
    timestamp: '2023-06-23 15:00:00',
    admin: 'alex.doe@example.com',
    action: 'User Suspended',
    target: 'User: sam.wilson@example.com',
    details: 'Account suspended due to policy violation.',
  },
];

export default function AuditLogPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Audit Logs
        </h1>
        <p className="text-muted-foreground">
          A chronological log of all administrative actions on the platform.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search-logs">Search Details</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="search-logs" placeholder="e.g., Jollof Rice..." className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-filter">Admin</Label>
            <Select>
              <SelectTrigger id="admin-filter">
                <SelectValue placeholder="All Admins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admins</SelectItem>
                <SelectItem value="alex.doe@example.com">alex.doe@example.com</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="action-filter">Action Type</Label>
            <Select>
              <SelectTrigger id="action-filter">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user-role-updated">User Role Updated</SelectItem>
                <SelectItem value="meal-edited">Meal Edited</SelectItem>
                 <SelectItem value="vendor-deactivated">Vendor Deactivated</SelectItem>
                 <SelectItem value="user-suspended">User Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
             <Button className="w-full">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <CardHeader className="px-0">
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
                Displaying the 4 most recent administrative actions.
            </CardDescription>
        </CardHeader>

        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
            {placeholderLogs.map((log, index) => (
                <Card key={index}>
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-4">
                            <p className="font-semibold text-primary">{log.action}</p>
                            <p className="text-xs text-muted-foreground font-mono text-right">{log.timestamp}</p>
                        </div>
                        <div className="text-sm space-y-0.5">
                            <p><span className="font-medium text-foreground/80">Target:</span> {log.target}</p>
                            <p><span className="font-medium text-foreground/80">Admin:</span> {log.admin}</p>
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">{log.details}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Desktop View */}
        <Card className="hidden md:block">
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {placeholderLogs.map((log, index) => (
                    <TableRow key={index}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>{log.admin}</TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell>{log.details}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
