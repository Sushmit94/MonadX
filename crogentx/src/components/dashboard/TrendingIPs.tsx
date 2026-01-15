'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Crown, Star } from 'lucide-react';

interface AgentItem {
  agentId: string;
  name: string;
  count: number;
  volume: number;
}

interface TrendingIPsProps {
  topAgents: AgentItem[];
}

export default function TrendingIPs({ topAgents }: TrendingIPsProps) {

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 1:
        return <Star className="h-5 w-5 text-zinc-400" />;
      case 2:
        return <Star className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Top AI Agents</h3>
      </div>

      {topAgents.length > 0 ? (
        <div className="space-y-3">
          {topAgents.slice(0, 10).map((agent, index) => (
            <div
              key={agent.agentId}
              className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8">
                {getMedalIcon(index) || (
                  <span className="text-sm font-semibold text-zinc-500">
                    #{index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {agent.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {agent.volume.toFixed(2)} MON volume
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{agent.count}</p>
                  <p className="text-xs text-zinc-500">transactions</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          No agent data available
        </div>
      )}
    </Card>
  );
}
