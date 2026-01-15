'use client';

import React, { useMemo } from 'react';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useAgents } from '@/lib/hooks/useAgents';
import StatsCards from '@/components/dashboard/StatsCards';
import LicenseDistribution from '@/components/dashboard/LicenseDistribution';
import MediaTypeChart from '@/components/dashboard/MediaTypeChart';
import TrendingIPs from '@/components/dashboard/TrendingIPs';
import IPsOverTime from '@/components/dashboard/IPsOverTime';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';

export default function AnalyticsPage() {
  const { transactions, isLoading: txLoading } = useTransactions({ limit: 1000 });
  const { agents, isLoading: agentsLoading } = useAgents();

  const isLoading = txLoading || agentsLoading;

  // Calculate comprehensive transaction stats
  const stats = useMemo(() => {
    if (transactions.length === 0) return null;

    const successfulTxs = transactions.filter(tx => tx.status === 'success');
    const failedTxs = transactions.filter(tx => tx.status === 'failed');
    const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0);
    const totalGasUsed = transactions.reduce((sum, tx) => sum + parseFloat(tx.gasUsed), 0);

    // Instruction type distribution
    const instructionDistribution: Record<string, number> = {};
    transactions.forEach(tx => {
      instructionDistribution[tx.instructionType] = (instructionDistribution[tx.instructionType] || 0) + 1;
    });

    // Category distribution
    const categoryDistribution: Record<string, number> = {};
    transactions.forEach(tx => {
      const category = tx.metadata?.category || 'unknown';
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
    });

    // Protocol distribution
    const protocolDistribution: Record<string, number> = {};
    transactions.forEach(tx => {
      const protocol = tx.metadata?.protocol || 'Unknown';
      protocolDistribution[protocol] = (protocolDistribution[protocol] || 0) + 1;
    });

    // Top agents by transaction count
    const agentTxCount: Record<string, { name: string; count: number; volume: number }> = {};
    transactions.forEach(tx => {
      if (tx.agentId) {
        if (!agentTxCount[tx.agentId]) {
          agentTxCount[tx.agentId] = { name: tx.agentName || 'Unknown', count: 0, volume: 0 };
        }
        agentTxCount[tx.agentId].count++;
        agentTxCount[tx.agentId].volume += parseFloat(tx.value);
      }
    });

    const topAgents = Object.entries(agentTxCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([id, data]) => ({ agentId: id, ...data }));

    // Transactions over time (group by day)
    const txByDate: Record<string, number> = {};
    transactions.forEach(tx => {
      const date = new Date(tx.blockTimestamp * 1000).toLocaleDateString();
      txByDate[date] = (txByDate[date] || 0) + 1;
    });

    const txOverTime = Object.entries(txByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalTransactions: transactions.length,
      successfulTransactions: successfulTxs.length,
      failedTransactions: failedTxs.length,
      successRate: (successfulTxs.length / transactions.length) * 100,
      totalVolume: totalVolume.toFixed(2),
      avgTransactionValue: (totalVolume / transactions.length).toFixed(4),
      totalGasUsed: totalGasUsed.toFixed(0),
      avgGasUsed: (totalGasUsed / transactions.length).toFixed(0),
      totalAgents: agents.length,
      activeAgents: new Set(transactions.map(tx => tx.agentId).filter(Boolean)).size,
      batchedTransactions: transactions.filter(tx => tx.batchId).length,
      multiStepTransactions: transactions.filter(tx => tx.settlementPipeline).length,
      instructionDistribution,
      categoryDistribution,
      protocolDistribution,
      topAgents,
      txOverTime,
    };
  }, [transactions, agents]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-zinc-400 hover:text-white"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Graph
                </Link>
              </Button>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <h1 className="text-xl font-bold">Monad x402 Analytics</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <motion.div 
            className="flex items-center justify-center h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              </motion.div>
              <motion.p 
                className="text-zinc-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading analytics data...
              </motion.p>
            </div>
          </motion.div>
        ) : stats ? (
          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Cards */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Transaction Overview</h2>
              <StatsCards stats={stats} />
            </section>

            {/* Charts Row 1 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LicenseDistribution data={stats.instructionDistribution} />
              <MediaTypeChart data={stats.categoryDistribution} />
            </section>

            {/* Charts Row 2 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IPsOverTime txOverTime={stats.txOverTime} />
              <TrendingIPs topAgents={stats.topAgents} />
            </section>

            {/* Key Metrics */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-2">Success Rate</p>
                  <p className="text-3xl font-bold text-green-400">
                    {stats.successRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {stats.successfulTransactions}/{stats.totalTransactions} succeeded
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-2">Avg Gas Efficiency</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {(parseFloat(stats.avgGasUsed) / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    gas per transaction
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-2">Complex Transactions</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {((stats.multiStepTransactions / stats.totalTransactions) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    multi-step pipelines
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-2">Batch Operations</p>
                  <p className="text-3xl font-bold text-amber-400">
                    {((stats.batchedTransactions / stats.totalTransactions) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    batched for efficiency
                  </p>
                </div>
              </div>
            </section>

            {/* Protocol Distribution */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Protocol Integration</h2>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(stats.protocolDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([protocol, count]) => (
                      <div key={protocol} className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">{count}</p>
                        <p className="text-xs text-zinc-500 mt-1">{protocol}</p>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </motion.div>
        ) : null}
      </main>
    </div>
  );
}
