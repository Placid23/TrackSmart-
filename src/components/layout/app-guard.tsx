'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';

export function AppGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const prevUserRef = useRef(user);
  const prevProfileRef = useRef(profile);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return; // Wait until loading is complete
    }

    const prevUser = prevUserRef.current;
    const prevProfile = prevProfileRef.current;

    // Transition 1: User was created and now has a profile
    if (user && !prevProfile && profile) {
      toast({
        title: `Welcome, ${profile.fullName.split(' ')[0]}!`,
        description: 'Your account has been successfully created.',
      });
    }
    // Transition 2: User logged in (and already had a profile)
    else if (!prevUser && user && profile) {
      toast({
        title: `Welcome back, ${profile.fullName.split(' ')[0]}!`,
        description: "You've successfully logged in.",
      });
    }

    // Update refs for the next render
    prevUserRef.current = user;
    prevProfileRef.current = profile;


    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!user && !isAuthPage) {
      // If not logged in and not on an auth page, redirect to login
      router.replace('/login');
    } else if (user && !profile && pathname !== '/profile') {
      // If logged in but no profile, and not on profile page, redirect to profile
      router.replace('/profile');
    } else if (user && profile && isAuthPage) {
      // If logged in with profile and on an auth page, redirect based on role
      if (profile.isAdmin) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, profile, isUserLoading, isProfileLoading, pathname, router, toast]);

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
