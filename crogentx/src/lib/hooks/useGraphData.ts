// Custom hook for graph data management
'use client';

import { useMemo } from 'react';
import { useIPAssets } from './useIPAssets';
import { buildGraphData, filterGraphData, calculateGraphMetrics } from '../graph/graph-builder';
import { FilterOptions } from '../story-protocol/types';

export function useGraphData(filters?: FilterOptions) {
  const { assets, isLoading, isError } = useIPAssets({ limit: 1000 });

  const graphData = useMemo(() => {
    if (!assets || assets.length === 0) {
      return { nodes: [], edges: [] };
    }

    const fullGraph = buildGraphData(assets);
    
    if (filters) {
      return filterGraphData(fullGraph, filters);
    }

    return fullGraph;
  }, [assets, filters]);

  const metrics = useMemo(() => {
    return calculateGraphMetrics(graphData);
  }, [graphData]);

  return {
    graphData,
    metrics,
    isLoading,
    isError,
  };
}
