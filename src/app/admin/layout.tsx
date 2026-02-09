'use client';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PanelLeft } from 'lucide-react';


function AdminHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
             <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Admin Menu</SheetTitle>
                </SheetHeader>
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            <div className="flex-1">
                 <h1 className="font-headline text-xl font-bold text-primary">Admin Dashboard</h1>
            </div>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Return to Student View
            </Link>
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
    return (
         <div className="flex h-screen w-full items-center justify-center bg-background">
            <p>Redirecting...</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
             <AdminSidebar />
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
            <AdminHeader />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
            </main>
        </div>
    </div>
  );
}
