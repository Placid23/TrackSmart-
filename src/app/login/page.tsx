'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/providers/firebase-provider';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,36.625,44,30.636,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // AppGuard will handle the redirect.
    } catch (error: any) {
      console.error(error);
      let description = 'An unexpected error occurred.';
      if (error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please check your credentials and try again.';
      } else {
        description = error.message || description;
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: description,
      });
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        // AppGuard will handle the redirect.
    } catch (error: any) {
        if (error.code !== 'auth/popup-closed-by-user') {
            console.error("Google sign-in error", error);
            toast({
                variant: "destructive",
                title: "Google Sign-In Failed",
                description: error.message || "Could not sign in with Google.",
            });
        }
    } finally {
        setIsGoogleLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 overflow-hidden">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="hidden md:flex flex-col justify-start pt-16 items-start text-left p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/icon.jpg" alt="TrackSmart+ Logo" width={56} height={56} className="rounded-lg"/>
            <h1 className="text-4xl font-bold font-headline text-primary">TrackSmart+</h1>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Smart spending. Better choices.</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Lock className="text-primary"/>
              <span>Automatic expense tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="text-primary"/>
              <span>Budget alerts & predictions</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="text-primary"/>
              <span>Secure student accounts</span>
            </li>
          </ul>
        </div>
        <Card className="w-full max-w-md animate-fade-in-up rounded-xl shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-foreground">
              Welcome back 👋
            </CardTitle>
            <CardDescription>
              Sign in to manage your spending and orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input type="email" placeholder="you@example.com" {...field} className="pl-10 h-11"/>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                   <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} className="pl-10 pr-10 h-11"/>
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="text-right">
                      <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full h-11" disabled={form.formState.isSubmitting || isGoogleLoading}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log In
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground pt-2 flex items-center justify-center gap-2">
                    <Lock size={12}/> Your data is securely protected with encryption.
                </p>
              </form>
            </Form>

            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                  </span>
              </div>
             </div>

              <div>
                <Button variant="outline" className="w-full h-11" onClick={handleGoogleSignIn} disabled={form.formState.isSubmitting || isGoogleLoading}>
                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                    Sign in with Google
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">Recommended for faster access</p>
              </div>


            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
