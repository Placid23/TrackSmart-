'use client';

import { useEffect, useState } from 'react';
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
import { Loader2, LogOut } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { useUser } from '@/lib/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/providers/firebase-provider';

const profileFormSchema = z.object({
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

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isLoading: isUserLoading } = useUser();
  const { profile, createProfile, updateProfile, isLoading: isProfileLoading } = useUserProfile();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      studentId: '',
      monthlyAllowance: 100000,
      mealPlan: undefined,
      financialGoal: 'Save 20% of my allowance monthly',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return;

    if (profile) {
      form.reset({
        fullName: profile.fullName,
        studentId: profile.studentId,
        monthlyAllowance: profile.monthlyAllowance,
        mealPlan: profile.mealPlan,
        financialGoal: profile.financialGoal,
      });
    } else if (user) {
      // New user (e.g., from Google Sign-In), pre-fill from auth data
      form.reset({
        fullName: user.displayName || '',
        studentId: '',
        monthlyAllowance: 100000,
        mealPlan: undefined,
        financialGoal: 'Save 20% of my allowance monthly',
      });
    }
  }, [profile, user, form, isUserLoading, isProfileLoading]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    setIsSubmitting(true);

    try {
        if (profile) {
            // Updating existing profile
            await updateProfile(data);
            toast({
                title: "Profile Updated",
                description: "Your profile information has been successfully updated.",
            });
        } else {
            // Creating new profile
            await createProfile({
                uid: user.uid,
                email: user.email!,
                ...data,
            });
            toast({
                title: "Profile Created",
                description: "Welcome! Your profile has been set up.",
            });
        }
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Profile submission error", error);
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Could not save your profile. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (isUserLoading || (!user && !isProfileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const pageTitle = profile ? "Edit Your Profile" : "Complete Your Profile";
  const pageDescription = profile ? "Update your profile information below." : "Just a few more details to get you started.";


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            {pageTitle}
          </CardTitle>
          <CardDescription>
            {pageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel>Student ID</FormLabel>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {profile ? 'Update Profile' : 'Save Profile'}
              </Button>
            </form>
          </Form>
          <Button variant="outline" className="w-full mt-4" onClick={handleLogout} disabled={isSubmitting}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
