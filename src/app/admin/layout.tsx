
'use client';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

// Basic admin header for now
function AdminHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-card">
            <div className="container mx-auto flex h-16 items-center px-4">
                <h1 className="font-headline text-xl font-bold text-primary">Admin Dashboard</h1>
            </div>
        </header>
    );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !profile?.isAdmin) {
      router.replace('/dashboard');
    }
  }, [profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.isAdmin) {
    // This will be shown briefly before the redirect happens.
    return (
         <div className="flex h-screen w-full items-center justify-center bg-background">
            <p>Redirecting...</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
    </div>
  );
}
