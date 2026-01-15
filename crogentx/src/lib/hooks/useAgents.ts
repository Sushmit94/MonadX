// Custom hook for fetching AI agents
'use client';

import useSWR from 'swr';
import { AIAgent } from '../cronos/types';
import { fetchAgents } from '../cronos/queries';

export function useAgents() {
  const { data, error, isLoading, mutate } = useSWR<AIAgent[]>(
    'agents',
    fetchAgents,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return {
    agents: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
}
