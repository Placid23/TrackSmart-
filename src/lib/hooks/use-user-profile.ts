'use client';

import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '@/lib/hooks/use-user';
import { useFirestore } from '@/lib/providers/firebase-provider';
import type { UserProfile } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

export function useUserProfile() {
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
      docSnapshot => {
        if (docSnapshot.exists()) {
          setProfile(docSnapshot.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setProfileLoading(false);
      },
      error => {
        console.error('useUserProfile snapshot error:', error);
        setProfileError(error);
        setProfile(null);
        setProfileLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore, userLoading]);

  const createProfile = useCallback(
    async (data: UserProfile) => {
      if (!firestore) return;
      const userDoc = doc(firestore, 'users', data.uid);
      await setDoc(userDoc, data);
      setProfile(data); // Manually set state to prevent race condition
    },
    [firestore]
  );

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user || !firestore) return;
      const profileRef = doc(firestore, 'users', user.uid);
      await updateDoc(profileRef, data);
      setProfile(prev => (prev ? { ...prev, ...data } : null) as UserProfile); // Manually update state
    },
    [user, firestore]
  );

  return {
    profile: profile || undefined,
    isLoading: userLoading || profileLoading,
    error: userError || profileError,
    createProfile,
    updateProfile,
  };
}
