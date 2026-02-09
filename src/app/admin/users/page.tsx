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
import { cn } from '@/lib/utils';

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

const UserActionsDropdown = ({ user }: { user: (typeof placeholderUsers)[0] }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-haspopup="true"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
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
);


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

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {placeholderUsers.map((user) => (
          <Card key={user.id}>
             <CardContent className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.fullName.split(' ').map(n => n[0]).join('') || <User />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                     <div className="flex items-center gap-2 pt-1">
                        <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                          {user.role}
                        </Badge>
                         <Badge
                          variant={user.status === 'Active' ? 'default' : 'outline'}
                          className={cn(
                            user.status === 'Active'
                              && 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800'
                          )}
                        >
                          {user.status}
                        </Badge>
                      </div>
                  </div>
               </div>
              <UserActionsDropdown user={user} />
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Desktop View */}
      <Card className="hidden md:block">
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
                <TableHead className="text-right">
                  Actions
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
                      className={cn(
                        user.status === 'Active'
                          && 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800'
                      )}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <UserActionsDropdown user={user} />
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
