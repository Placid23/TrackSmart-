'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/stores', icon: Store, label: 'Stores' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 border-r">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'default' }),
                'justify-start gap-3'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
