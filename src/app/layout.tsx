
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { FirebaseProvider } from '@/lib/providers/firebase-provider';
import { UserProvider } from '@/lib/hooks/use-user';
import { AppGuard } from '@/components/layout/app-guard';
import { UserProfileProvider } from '@/lib/providers/user-profile-provider';

export const metadata: Metadata = {
  title: 'TrackSmart+',
  description: 'Smart Financial Tracking for Students',
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(225 55% 32%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(195 55% 52%)' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseProvider>
            <UserProvider>
              <UserProfileProvider>
                <AppGuard>{children}</AppGuard>
                <Toaster />
              </UserProfileProvider>
            </UserProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
