'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState, AuthStateHook } from 'react-firebase-hooks/auth';
import { useAuth } from '@/lib/providers/firebase-provider';

const UserContext = createContext<AuthStateHook | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const authState = useAuthState(auth);

  return (
    <UserContext.Provider value={authState}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  const [user, loading, error] = context;
  return { user, isLoading: loading, error };
}
