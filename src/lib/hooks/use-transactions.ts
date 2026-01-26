'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '@/lib/types';
import { sampleTransactions } from '@/lib/data';

const TRANSACTIONS_KEY = 'tracksmart_transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(TRANSACTIONS_KEY);
      if (item) {
        setTransactions(JSON.parse(item));
      } else {
        // First time load, use sample data
        setTransactions(sampleTransactions);
        window.localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(sampleTransactions));
      }
    } catch (error) {
      console.error('Failed to load transactions from local storage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(
    (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
      try {
        setTransactions(prevTransactions => {
          const fullTransaction: Transaction = {
            ...newTransaction,
            id: `txn_${Date.now()}`,
            date: new Date().toISOString(),
          };
          const updatedTransactions = [fullTransaction, ...prevTransactions];
          window.localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
          return updatedTransactions;
        });
      } catch (error) {
        console.error('Failed to add transaction', error);
      }
    },
    []
  );

  return { transactions, isLoading, addTransaction };
}
