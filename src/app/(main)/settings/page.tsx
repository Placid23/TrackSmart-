
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [notifications, setNotifications] = useState({
    orderStatus: true,
    freeMeal: false,
  });

  const handleDownloadData = () => {
    // In a real app, this would generate and download user data.
    const data = { Note: "This is a placeholder for user data."};
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      // In a real app, clear all user data and navigate to a sign-up page.
      window.localStorage.clear();
      router.push('/profile');
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-foreground animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-8 max-w-4xl mx-auto">
        {/* Notifications */}
        <Card className="animate-fade-in-up" style={{ animationFillMode: 'backwards', animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="order-status" className="text-base font-medium">Order status notifications</Label>
                <p className="text-sm text-muted-foreground">Updates on your real order status.</p>
              </div>
              <Switch
                id="order-status"
                checked={notifications.orderStatus}
                onCheckedChange={(checked) => setNotifications(p => ({ ...p, orderStatus: checked }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="free-meal" className="text-base font-medium">Daily free-meal reminder</Label>
                <p className="text-sm text-muted-foreground">A daily reminder about your available free meals.</p>
              </div>
              <Switch
                id="free-meal"
                checked={notifications.freeMeal}
                onCheckedChange={(checked) => setNotifications(p => ({ ...p, freeMeal: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="animate-fade-in-up" style={{ animationFillMode: 'backwards', animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} className="h-20 flex-col gap-2 bg-background hover:bg-muted">
                <Sun /> Light Mode
              </Button>
              <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} className="h-20 flex-col gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Moon /> Dark Mode
              </Button>
              <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')} className="h-20 flex-col gap-2 bg-background hover:bg-muted">
                <Laptop /> System
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="animate-fade-in-up" style={{ animationFillMode: 'backwards', animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Manage your payment methods and subscription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Default Payment Method: <span className="font-semibold">Paystack</span></p>
            <div className="flex gap-4">
              <Button variant="secondary">Manage Saved Cards</Button>
              <Button variant="link" className="text-primary">See Last Payments</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="animate-fade-in-up" style={{ animationFillMode: 'backwards', animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Manage your account data and access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleDownloadData}>Download My Data (JSON)</Button>
            <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
