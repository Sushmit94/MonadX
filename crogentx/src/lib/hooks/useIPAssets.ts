// Custom hook for fetching IP assets with SWR
'use client';

import useSWR from 'swr';
import { IPAsset, IPStats } from '../story-protocol/types';
import { fetchIPAssets, fetchIPAssetById, fetchIPStats, searchIPAssets } from '../story-protocol/queries';

export function useIPAssets(params?: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}) {
  const key = params ? ['ip-assets', JSON.stringify(params)] : 'ip-assets';
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetchIPAssets(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    assets: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useIPAsset(ipId: string | null) {
  const { data, error, isLoading } = useSWR(
    ipId ? ['ip-asset', ipId] : null,
    () => ipId ? fetchIPAssetById(ipId) : null,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    asset: data,
    isLoading,
    isError: error,
  };
}

export function useIPStats() {
  const { data, error, isLoading } = useSWR(
    'ip-stats',
    fetchIPStats,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}

export function useSearchIPs(query: string) {
  const { data, error, isLoading } = useSWR(
    query ? ['search', query] : null,
    () => query ? searchIPAssets(query) : [],
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    results: data || [],
    isLoading,
    isError: error,
  };
}
