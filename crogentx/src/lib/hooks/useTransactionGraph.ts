// Custom hook for transaction graph data management
'use client';

import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useAgents } from './useAgents';
import { 
  buildTransactionGraph, 
  filterTransactionGraph, 
  calculateGraphMetrics 
} from '../graph/transaction-graph-builder';
import { FilterOptions } from '../cronos/types';

export function useTransactionGraph(filters?: FilterOptions) {
  const { transactions, isLoading: txLoading, isError: txError } = useTransactions({ limit: 1000 });
  const { agents, isLoading: agentsLoading } = useAgents();

  const graphData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { nodes: [], edges: [] };
    }

    const fullGraph = buildTransactionGraph(transactions, agents);
    
    if (filters) {
      return filterTransactionGraph(fullGraph, filters);
    }

    return fullGraph;
  }, [transactions, agents, filters]);

  const metrics = useMemo(() => {
    return calculateGraphMetrics(graphData);
  }, [graphData]);

  return {
    graphData,
    metrics,
    transactions,
    agents,
    isLoading: txLoading || agentsLoading,
    isError: txError,
  };
}
