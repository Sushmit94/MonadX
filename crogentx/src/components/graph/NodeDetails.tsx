'use client';

import React from 'react';
import { GraphNode } from '@/lib/cronos/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Copy, Check, Activity, Bot, FileText, Wallet } from 'lucide-react';
import { useGraphStore } from '@/stores/graphStore';
import { TX_EXPLORER_URL, ADDRESS_EXPLORER_URL } from '@/lib/cronos/client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight } from '@/lib/animations';

interface NodeDetailsProps {
  node: GraphNode;
}

export default function NodeDetails({ node }: NodeDetailsProps) {
  const { setSelectedNode } = useGraphStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address?: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case 'transaction': return <Activity className="h-5 w-5" />;
      case 'agent': return <Bot className="h-5 w-5" />;
      case 'contract': return <FileText className="h-5 w-5" />;
      case 'wallet': return <Wallet className="h-5 w-5" />;
      default: return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed right-6 top-24 w-96 max-h-[calc(100vh-8rem)] overflow-y-auto z-50"
      >
        <Card className="bg-zinc-900 border-zinc-800 text-white shadow-2xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  {getNodeIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold truncate">{node.name}</h2>
                    {node.status && (
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`} />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">
                    {node.type}
                    {node.instructionType && ` • ${node.instructionType}`}
                    {node.agentType && ` • ${node.agentType}`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNode(null)}
                className="text-zinc-400 hover:text-white -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Transaction Details */}
            {node.type === 'transaction' && node.txHash && (
              <>
                <div className="mb-4">
                  <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                    Transaction Hash
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded flex-1 overflow-hidden text-ellipsis font-mono">
                      {formatAddress(node.txHash)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(node.txHash!)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 mb-1">Value</p>
                    <p className="text-lg font-bold">{node.value ? `${parseFloat(node.value).toFixed(4)} MON` : 'N/A'}</p>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 mb-1">Status</p>
                    <p className="text-lg font-bold capitalize">{node.status || 'Unknown'}</p>
                  </div>
                </div>

                {node.instructionType && (
                  <div className="mb-4">
                    <label className="text-xs text-zinc-500 uppercase tracking-wide mb-2 block">
                      Instruction Type
                    </label>
                    <div className="bg-zinc-800 px-3 py-2 rounded">
                      <span className="text-sm font-medium">{node.instructionType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Agent Details */}
            {node.type === 'agent' && (
              <>
                <div className="mb-4">
                  <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                    Agent Address
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded flex-1 overflow-hidden text-ellipsis font-mono">
                      {formatAddress(node.address)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(node.address!)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 mb-1">Transactions</p>
                    <p className="text-2xl font-bold">{node.outgoingCount || 0}</p>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 mb-1">Total Volume</p>
                    <p className="text-xl font-bold">{node.totalVolume?.toFixed(2) || 0} MON</p>
                  </div>
                </div>

                {node.agentType && (
                  <div className="mb-4">
                    <label className="text-xs text-zinc-500 uppercase tracking-wide mb-2 block">
                      Agent Type
                    </label>
                    <div className="bg-zinc-800 px-3 py-2 rounded">
                      <span className="text-sm font-medium">{node.agentType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Address Details (Contract/Wallet) */}
            {(node.type === 'contract' || node.type === 'wallet') && node.address && (
              <>
                <div className="mb-4">
                  <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                    Address
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded flex-1 overflow-hidden text-ellipsis font-mono">
                      {formatAddress(node.address)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(node.address!)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 mb-1">Incoming</p>
                    <p className="text-2xl font-bold">{node.incomingCount || 0}</p>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 mb-1">Outgoing</p>
                    <p className="text-2xl font-bold">{node.outgoingCount || 0}</p>
                  </div>
                </div>
              </>
            )}

            {/* Common Info */}
            <div className="mb-4">
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                Timestamp
              </label>
              <p className="text-sm">{formatDate(node.timestamp)}</p>
            </div>

            {node.connectionCount > 0 && (
              <div className="mb-4">
                <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                  Connections
                </label>
                <p className="text-lg font-bold">{node.connectionCount}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                asChild
              >
                <a
                  href={node.txHash ? TX_EXPLORER_URL(node.txHash) : ADDRESS_EXPLORER_URL(node.address || node.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}