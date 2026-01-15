'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot, Activity, FileText, Wallet } from 'lucide-react';

export default function LegendPanel() {
  const nodeTypes = [
    { name: 'AI Agents', color: '#10b981', icon: Bot, description: 'Autonomous payment agents' },
    { name: 'Transactions', color: '#3b82f6', icon: Activity, description: 'x402 operations' },
    { name: 'Contracts', color: '#f97316', icon: FileText, description: 'Smart contracts' },
    { name: 'Wallets', color: '#64748b', icon: Wallet, description: 'User wallets' },
  ];

  const edgeTypes = [
    { name: 'Flow', color: '#475569', style: 'solid', description: 'Transaction flow' },
    { name: 'Trigger', color: '#52796f', style: 'solid', description: 'Agent action' },
    { name: 'Batch', color: '#94a3b8', style: 'dashed', description: 'Batched txs' },
    { name: 'Pipeline', color: '#6366f1', style: 'solid', description: 'Multi-step' },
  ];

  const statusIndicators = [
    { name: 'Success', color: '#10b981' },
    { name: 'Failed', color: '#ef4444' },
    { name: 'Pending', color: '#f59e0b' },
  ];

  return (
    <Card className="absolute top-16 left-6 bg-zinc-900/95 backdrop-blur-sm border-zinc-800 text-white z-10 p-4 w-72 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {/* Node Types */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-3 text-zinc-200">Node Types</h3>
        <div className="space-y-2">
          {nodeTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.name} className="flex items-start gap-3">
                <div
                  className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: type.color }}
                >
                  <Icon className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-200">{type.name}</p>
                  <p className="text-xs text-zinc-500">{type.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edge Types */}
      <div className="mb-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-semibold mb-3 text-zinc-200">Connection Types</h3>
        <div className="space-y-2">
          {edgeTypes.map((type) => (
            <div key={type.name} className="flex items-start gap-3">
              <div className="flex items-center mt-0.5 flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <line
                    x1="0"
                    y1="8"
                    x2="16"
                    y2="8"
                    stroke={type.color}
                    strokeWidth="2"
                    strokeDasharray={type.style === 'dashed' ? '2,2' : '0'}
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-200">{type.name}</p>
                <p className="text-xs text-zinc-500">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mb-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-semibold mb-3 text-zinc-200">Transaction Status</h3>
        <div className="space-y-2">
          {statusIndicators.map((status) => (
            <div key={status.name} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: status.color }}
              />
              <p className="text-xs text-zinc-400">{status.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Node Size Info */}
      <div className="pt-4 border-t border-zinc-800">
        <h4 className="text-xs font-semibold mb-2 text-zinc-400">Node Size</h4>
        <div className="space-y-1 text-xs text-zinc-500">
          <p>• Agents: by transaction count</p>
          <p>• Transactions: by MON value</p>
          <p>• Wallets/Contracts: by connections</p>
        </div>
      </div>
    </Card>
  );
}
