'use client';

import { useCallback } from 'react';
import { collection, query, orderBy, addDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import type { Transaction } from '@/lib/types';
import { useFirestore } from '../providers/firebase-provider';
import { useUser } from './use-user';

export function useTransactions() {
  const firestore = useFirestore();
  const { user } = useUser();
  
  const transactionsRef = user ? collection(firestore, 'users', user.uid, 'transactions') : null;
  const transactionsQuery = transactionsRef ? query(transactionsRef, orderBy('date', 'desc')) : null;

  const [transactions, isLoading, error] = useCollectionData(transactionsQuery, {
      idField: 'id',
  });

  const addTransaction = useCallback(
    async (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
      if (!transactionsRef) return;
      try {
        await addDoc(transactionsRef, {
          ...newTransaction,
          date: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to add transaction', error);
      }
    },
    [transactionsRef]
  );
  
  return { 
      transactions: (transactions as Transaction[] | undefined) || [], 
      isLoading, 
      error,
      addTransaction 
    };
}
