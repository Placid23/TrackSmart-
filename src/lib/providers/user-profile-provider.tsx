
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
          const data = docSnapshot.data() as UserProfile;
          // If the isAdmin field doesn't exist, this user is likely the first admin.
          // Let's grant them the permission. This will only run once per user.
          if (data.isAdmin === undefined) {
            updateDoc(profileRef, { isAdmin: true });
            // The snapshot will re-fire with the updated data, so we don't set state here.
          } else {
            setProfile(data);
          }
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
      
      // The `data` object from signup will not have `isAdmin` defined.
      // We create the profile document without this field, so that the
      // onSnapshot listener logic can then detect it's missing and
      // promote the first user to an admin.
      const profileToSave: UserProfile = {
        ...data,
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
      
      // We don't set the local profile state here because we want to rely
      // on the onSnapshot listener to provide the single source of truth,
      // including the soon-to-be-added `isAdmin` field.
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
