'use client';

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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const profileFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  studentId: z.string().optional(),
  monthlyAllowance: z.coerce
    .number()
    .min(1, { message: 'Monthly allowance must be a positive number.' }),
  mealPlan: z.enum(['two-meal', 'three-meal'], {
    required_error: 'You need to select a meal plan.',
  }),
  financialGoal: z.string().min(3, { message: 'Please state a financial goal.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const auth = useAuth();
  const { createProfile } = useUserProfile();
  const { toast } = useToast();

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
    const { email, password, ...profileData } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await createProfile(user.uid, {
        uid: user.uid,
        email: user.email!,
        ...profileData,
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            Welcome to TrackSmart+
          </CardTitle>
          <CardDescription>
            Let's set up your profile to get started with smart financial tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
               <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                     <FormDescription>Must be at least 6 characters long.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., C00123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      </SelectContent>
                    </Select>
                    <FormDescription>This determines your daily cafeteria coupon value.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
            <div className="mt-6 text-center text-sm">
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
