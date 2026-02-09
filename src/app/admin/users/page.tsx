
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const placeholderUsers = [
  {
    id: 'usr_1',
    fullName: 'Alex Doe',
    email: 'alex.doe@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'usr_2',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Student',
    status: 'Active',
  },
  {
    id: 'usr_3',
    fullName: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    role: 'Student',
    status: 'Suspended',
  },
   {
    id: 'usr_4',
    fullName: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'Student',
    status: 'Active',
  },
   {
    id: 'usr_5',
    fullName: 'Chris Lee',
    email: 'chris.lee@example.com',
    role: 'Student',
    status: 'Active',
  },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          User Management
        </h1>
        <p className="text-muted-foreground">
          View, manage, and edit user roles and permissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all registered users on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {user.fullName.split(' ').map(n => n[0]).join('') || <User />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <span className="font-medium">{user.fullName}</span>
                         <span className="text-xs text-muted-foreground">{user.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'Active' ? 'default' : 'outline'}
                      className={
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {user.role === 'Admin'
                            ? 'Demote to Student'
                            : 'Promote to Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {user.status === 'Active'
                            ? 'Suspend Account'
                            : 'Unsuspend Account'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
