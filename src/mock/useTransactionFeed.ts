import { useEffect, useCallback } from 'react';
import type { Transaction } from '../types/finance';
import { mockTransactions } from './data';

type TransactionCallback = (tx: Transaction) => void;

export function useTransactionFeed(onNew: TransactionCallback) {
  const handleNew = useCallback(onNew, []);

  useEffect(() => {
    function scheduleNext() {
      const delay = 8000 + Math.random() * 7000;
      return setTimeout(() => {
        const base = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
        handleNew({
          ...base,
          id: `live-${Date.now()}`,
          date: new Date().toISOString(),
        });
        scheduleNext();
      }, delay);
    }
    const t = scheduleNext();
    return () => clearTimeout(t as any);
  }, [handleNew]);
}
