'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Loader2 } from 'lucide-react';

export function AppGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return; // Wait until loading is complete
    }

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!user && !isAuthPage) {
      // If not logged in and not on an auth page, redirect to login
      router.replace('/login');
    } else if (user && !profile && pathname !== '/profile') {
      // If logged in but no profile, and not on profile page, redirect to profile
      router.replace('/profile');
    } else if (user && profile && (isAuthPage || pathname === '/profile')) {
      // If logged in with profile but on an auth or profile page, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [user, profile, isUserLoading, isProfileLoading, pathname, router]);

  // Show a global loader while we determine the route
  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is logged in without a profile, and they are trying to access something other than the profile page
  // this will show a loader until the useEffect redirects them.
  if (user && !profile && pathname !== '/profile') {
      return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is NOT logged in, and we are not on an auth page, show loader until redirect.
   if (!user && pathname !== '/login' && pathname !== '/signup') {
       return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
   }

  return <>{children}</>;
}
