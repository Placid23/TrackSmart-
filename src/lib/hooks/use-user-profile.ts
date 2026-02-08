'use client';

import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '@/lib/hooks/use-user';
import { useFirestore } from '@/lib/providers/firebase-provider';
import { UserProfile } from '@/lib/types';
import { useCallback } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export function useUserProfile() {
  const { user, loading: userLoading, error: userError } = useUser();
  const firestore = useFirestore();

  const profileRef = user ? doc(firestore, 'users', user.uid) : null;
  const [profile, profileLoading, profileError] = useDocumentData(profileRef);

  const createProfile = useCallback(
    async (uid: string, data: Omit<UserProfile, 'uid'>) => {
      if (!firestore) return;
      const userDoc = doc(firestore, 'users', uid);
      await setDoc(userDoc, data);
    },
    [firestore]
  );
  
  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
        if (!profileRef) return;
        await updateDoc(profileRef, data);
    },
    [profileRef]
  );

  return {
    profile: profile as UserProfile | undefined,
    isLoading: userLoading || profileLoading,
    error: userError || profileError,
    createProfile,
    updateProfile,
  };
}
