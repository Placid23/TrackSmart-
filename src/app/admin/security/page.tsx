
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const placeholderLogins = [
  { user: 'Alex Doe', ip: '192.168.1.10', time: '2 mins ago', status: 'Success' },
  { user: 'jane.smith@example.com', ip: '10.0.0.5', time: '5 mins ago', status: 'Success' },
  { user: 'sam.wilson@example.com', ip: '172.16.0.23', time: '10 mins ago', status: 'Failed' },
  { user: 'sam.wilson@example.com', ip: '172.16.0.23', time: '11 mins ago', status: 'Failed' },
  { user: 'sam.wilson@example.com', ip: '172.16.0.23', time: '12 mins ago', status: 'Failed' },
];

const placeholderAlerts = [
  {
    id: 'alert-1',
    description: 'Multiple failed login attempts for user sam.wilson@example.com from IP 172.16.0.23.',
    severity: 'High',
  },
  {
    id: 'alert-2',
    description: 'Admin role granted to alex.doe@example.com by root.',
    severity: 'Medium',
  },
];

export default function SecurityPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Security & Access Control
        </h1>
        <p className="text-muted-foreground">
          Monitor login activity and manage platform security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Security Alerts</CardTitle>
          <CardDescription>
            High-priority events that may require your attention.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {placeholderAlerts.map(alert => (
            <Alert key={alert.id} variant={alert.severity === 'High' ? 'destructive' : 'default'}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {alert.severity} Severity Alert
              </AlertTitle>
              <AlertDescription>
                {alert.description}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
          <CardDescription>
            A log of the most recent user login attempts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderLogins.map((login, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{login.user}</TableCell>
                  <TableCell>{login.ip}</TableCell>
                  <TableCell>{login.time}</TableCell>
                  <TableCell>
                    <Badge variant={login.status === 'Success' ? 'default' : 'destructive'}
                     className={
                        login.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {login.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access Control Management</CardTitle>
            <CardDescription>
              Manage user roles and permissions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
              <ShieldCheck className="h-10 w-10 text-muted-foreground"/>
              <div>
                <p>User roles determine access levels. You can promote users to Admins or suspend accounts from the User Management page.</p>
                <Button variant="link" className="p-0 h-auto">Go to User Management</Button>
              </div>
          </CardContent>
        </Card>

    </div>
  );
}
