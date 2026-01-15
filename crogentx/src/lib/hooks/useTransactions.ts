// Custom hook for fetching x402 transactions
'use client';

import useSWR from 'swr';
import { X402Transaction, TransactionQueryParams } from '../cronos/types';
import { fetchTransactions } from '../cronos/queries';

interface UseTransactionsOptions extends TransactionQueryParams {
  refreshInterval?: number;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { refreshInterval = 0, ...queryParams } = options;

  const { data, error, isLoading, mutate } = useSWR<X402Transaction[]>(
    ['transactions', JSON.stringify(queryParams)],
    () => fetchTransactions(queryParams),
    {
      refreshInterval,
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    transactions: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
}
