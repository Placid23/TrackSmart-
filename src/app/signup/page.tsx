'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/providers/firebase-provider';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const profileFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).optional().or(z.literal('')),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional().or(z.literal('')),
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  studentId: z.string().min(1, { message: 'Student ID is required.' }),
  monthlyAllowance: z.coerce
    .number()
    .min(1, { message: 'Monthly allowance must be a positive number.' }),
  mealPlan: z.enum(['two-meal', 'three-meal', 'pay-to-eat'], {
    required_error: 'You need to select a meal plan.',
  }),
  financialGoal: z.string().min(3, { message: 'Please state a financial goal.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,36.625,44,30.636,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

export default function SignUpPage() {
  const router = useRouter();
  const auth = useAuth();
  const { createProfile } = useUserProfile();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingDone(true);
    }, 2000); // Typing animation duration
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      studentId: '',
      monthlyAllowance: 100000,
      mealPlan: undefined,
      financialGoal: 'Save 20% of my allowance monthly',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!data.email || !data.password) {
        toast({
            variant: 'destructive',
            title: 'Missing Fields',
            description: 'Email and password are required for standard sign-up.',
        });
        return;
    }
    const { email, password, ...profileData } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await createProfile({
        uid: user.uid,
        email: user.email!,
        ...profileData,
      });

      // AppGuard will handle the redirect.
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  }

  async function handleGoogleSignIn() {
    const fieldsToValidate: (keyof ProfileFormValues)[] = [
      'fullName', 'studentId', 'monthlyAllowance', 'mealPlan', 'financialGoal'
    ];
    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out your profile details before signing up with Google.",
      });
      return;
    }

    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const profileData = form.getValues();
        
        await createProfile({
          uid: user.uid,
          email: user.email!,
          fullName: profileData.fullName,
          studentId: profileData.studentId,
          monthlyAllowance: profileData.monthlyAllowance,
          mealPlan: profileData.mealPlan,
          financialGoal: profileData.financialGoal,
        });

        // AppGuard will handle the redirect.
    } catch (error: any) {
        if (error.code !== 'auth/popup-closed-by-user') {
            console.error("Google sign-in error", error);
            toast({
                variant: "destructive",
                title: "Google Sign-Up Failed",
                description: error.message || "Could not sign up with Google.",
            });
        }
    } finally {
        setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      <Card className="w-full max-w-lg animate-fade-in-up">
        <CardHeader>
           <div className="h-24 mb-2 flex flex-col items-center justify-center gap-3">
              <Image src="/icon.jpg" alt="TrackSmart+ Logo" width={48} height={48} />
              <CardTitle className={`font-headline text-2xl text-primary text-center inline-block ${typingDone ? 'animate-subtle-bounce' : 'w-[23ch] animate-typing overflow-hidden whitespace-nowrap border-r-2 border-r-primary animate-caret-blink'}`}>
                  Welcome to TrackSmart+
              </CardTitle>
            </div>
          <CardDescription className="text-center animate-fade-in-up" style={{ animationDelay: '2.1s' }}>
            Let's set up your profile to get started with smart financial tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-in-up" style={{ animationDelay: '2.2s' }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '2.3s' }}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                 <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '2.4s' }}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
              </div>
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '2.6s' }}>
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., C00123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '2.7s' }}>
                <FormField
                  control={form.control}
                  name="monthlyAllowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Allowance (₦)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50000" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your total budget for the month.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '2.8s' }}>
                <FormField
                  control={form.control}
                  name="mealPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Plan Selection</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your meal plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="two-meal">Two-Meal Plan (₦4,000/day coupon)</SelectItem>
                          <SelectItem value="three-meal">Three-Meal Plan (₦6,000/day coupon)</SelectItem>
                          <SelectItem value="pay-to-eat">Pay to Eat (No daily coupon)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>This determines your daily cafeteria coupon value.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '2.9s' }}>
                 <FormField
                  control={form.control}
                  name="financialGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Financial Goal</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Save for a new laptop" {...field} />
                      </FormControl>
                      <FormDescription>Your goal helps us give you better advice.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-2 animate-fade-in-up" style={{ animationDelay: '3.0s' }}>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isGoogleLoading}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </div>
            </form>
          </Form>

            <div className="relative my-6 animate-fade-in-up" style={{ animationDelay: '3.1s' }}>
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '3.2s' }}>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={form.formState.isSubmitting || isGoogleLoading}>
                  {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                  Sign up with Google
              </Button>
            </div>


            <div className="mt-6 text-center text-sm animate-fade-in-up" style={{ animationDelay: '3.3s' }}>
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Log In
                </Link>
              </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
