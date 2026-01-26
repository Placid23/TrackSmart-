'use client';

import Link from 'next/link';
import { User, Wallet, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CouponWallet } from '@/components/coupon-wallet';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Skeleton } from '../ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { profile, isLoading, clearProfile } = useUserProfile();
  const router = useRouter();

  const handleLogout = () => {
    clearProfile();
    router.push('/profile');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
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
            <span className="font-headline text-2xl font-bold text-primary hidden sm:inline-block">
              TrackSmart+
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <CouponWallet />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{profile?.fullName || 'User'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
