'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Store, History, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants, Button } from '@/components/ui/button';
import { useUser } from '@/lib/hooks/use-user';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '@/lib/providers/firebase-provider';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/stores', icon: Store, label: 'Stores' },
  { href: '/reports', icon: History, label: 'Order History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { profile, isLoading } = useUserProfile();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex w-64 border-r flex-col">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href);
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
      <div className="mt-auto p-4 border-t border-border">
        {isLoading ? (
          <div className="flex items-center gap-3">
             <Skeleton className="h-10 w-10 rounded-full" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
             </div>
          </div>
        ) : profile ? (
            <div className="flex items-center justify-between">
              <Link href="/profile">
                <div className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:underline">{profile.fullName}</span>
                        <span className="text-xs text-muted-foreground">Student</span>
                    </div>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
        ) : null}
      </div>
    </aside>
  );
}
