'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Network, GitBranch, Zap } from 'lucide-react';

interface GraphStatsProps {
  metrics: {
    totalNodes: number;
    totalEdges: number;
    avgDegree: number;
    isolatedNodes: number;
  };
}

export default function GraphStats({ metrics }: GraphStatsProps) {
  return (
    <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
      <Card className="bg-zinc-900/90 border-zinc-800 text-white p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <Network className="h-4 w-4 text-blue-400" />
          <span className="text-xs text-zinc-400">Total Nodes</span>
        </div>
        <p className="text-2xl font-bold">{metrics.totalNodes}</p>
      </Card>

      <Card className="bg-zinc-900/90 border-zinc-800 text-white p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="h-4 w-4 text-purple-400" />
          <span className="text-xs text-zinc-400">Connections</span>
        </div>
        <p className="text-2xl font-bold">{metrics.totalEdges}</p>
      </Card>

      <Card className="bg-zinc-900/90 border-zinc-800 text-white p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-green-400" />
          <span className="text-xs text-zinc-400">Avg Degree</span>
        </div>
        <p className="text-2xl font-bold">{metrics.avgDegree.toFixed(1)}</p>
      </Card>

      {metrics.isolatedNodes > 0 && (
        <Card className="bg-zinc-900/90 border-zinc-800 text-white p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-zinc-400">Isolated</span>
          </div>
          <p className="text-2xl font-bold">{metrics.isolatedNodes}</p>
        </Card>
      )}
    </div>
  );
}
