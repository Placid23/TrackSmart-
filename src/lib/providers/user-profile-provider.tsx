
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '@/lib/hooks/use-user';
import { useFirestore } from '@/lib/providers/firebase-provider';
import type { UserProfile } from '@/lib/types';

interface UserProfileContextType {
  profile: UserProfile | null | undefined;
  isLoading: boolean;
  error: Error | undefined;
  createProfile: (data: UserProfile) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: userLoading, error: userError } = useUser();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (userLoading) {
      return;
    }
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    const profileRef = doc(firestore, 'users', user.uid);
    const unsubscribe = onSnapshot(
      profileRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setProfile(docSnapshot.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setProfileLoading(false);
      },
      (error) => {
        console.error('UserProfileProvider snapshot error:', error);
        setProfileError(error);
        setProfile(null);
        setProfileLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore, userLoading]);

  const createProfile = useCallback(
    async (data: UserProfile) => {
      if (!firestore || !data.uid) return;
      const profileToSave: UserProfile = {
        ...data,
        isAdmin: data.isAdmin || false,
        notificationSettings: data.notificationSettings || {
          mealReminders: true,
          paymentAlerts: true,
          orderStatus: false,
          freeMealReminder: false,
        },
        status: data.status || 'Active',
      };
      const userDoc = doc(firestore, 'users', data.uid);
      await setDoc(userDoc, profileToSave);
      setProfile(profileToSave);
    },
    [firestore]
  );

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user || !firestore) return;
      const profileRef = doc(firestore, 'users', user.uid);
      await updateDoc(profileRef, data);
      setProfile((prev) => (prev ? { ...prev, ...data } : null) as UserProfile);
    },
    [user, firestore]
  );

  const value = {
    profile: profile,
    isLoading: userLoading || profileLoading,
    error: userError || profileError,
    createProfile,
    updateProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}
