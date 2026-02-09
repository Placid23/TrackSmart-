
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UtensilsCrossed, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'User Management' },
  { href: '/admin/meals', icon: UtensilsCrossed, label: 'Meal Management' },
  { href: '/admin/vendors', icon: Store, label: 'Vendor Management' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
     <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <div className="flex items-center gap-2 p-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-primary"
            >
              <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l10-10A1 1 0 0 0 22 11Z" />
              <path d="M7 7h.01" />
            </svg>
            <span className="font-headline text-2xl font-bold text-primary">
              TrackSmart+
            </span>
          </Link>
        </div>
      {navItems.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'default' }),
              'justify-start gap-3'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
