'use client';

import { useTransactionGraph } from '@/lib/hooks/useTransactionGraph';
import { useGraphStore } from '@/stores/graphStore';
import { useFilterStore } from '@/stores/filterStore';
import ForceGraph from '@/components/graph/ForceGraph';
import NodeDetails from '@/components/graph/NodeDetails';
import GraphControls from '@/components/graph/GraphControls';
import LegendPanel from '@/components/graph/LegendPanel';
import GraphStats from '@/components/graph/GraphStats';
import NetworkInsights from '@/components/graph/NetworkInsights';
import SearchBar from '@/components/search/SearchBar';
import FilterPanel from '@/components/search/FilterPanel';
import ActiveFilters from '@/components/search/ActiveFilters';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, BarChart3, Clock, Activity, Wrench } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const filters = useFilterStore();
  const { graphData, metrics, transactions, isLoading, isError } = useTransactionGraph(filters);
  const { selectedNode } = useGraphStore();
  
  // Advanced Features State
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  
  // Date range for time travel
  const dateRange = useMemo(() => {
    if (transactions.length === 0) return { min: Date.now() / 1000, max: Date.now() / 1000 };
    const timestamps = transactions.map(tx => tx.blockTimestamp);
    return {
      min: Math.min(...timestamps),
      max: Math.max(...timestamps),
    };
  }, [transactions]);
  
  const [currentDate, setCurrentDate] = useState(dateRange.max);

  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 100,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Update current date when date range changes
  useEffect(() => {
    setCurrentDate(dateRange.max);
  }, [dateRange.max]);
  
  // Filter graph data by time travel date
  const filteredByDate = useMemo(() => {
    if (!showTimeTravel) return graphData;
    
    const filteredNodes = graphData.nodes.filter(node => node.timestamp <= currentDate);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = graphData.edges.filter(
      edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
    
    return { nodes: filteredNodes, edges: filteredEdges };
  }, [graphData, currentDate, showTimeTravel]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CrogentX
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Monad x402 Developer Toolkit
              </p>
            </div>
            <div className="flex items-center gap-6">
              {!isLoading && (
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-zinc-500">Transactions: </span>
                    <span className="font-semibold">{metrics.totalTransactions}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Agents: </span>
                    <span className="font-semibold">{metrics.totalAgents}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Connections: </span>
                    <span className="font-semibold">{metrics.totalEdges}</span>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTimeTravel(!showTimeTravel)}
                className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                {showTimeTravel ? 'Hide' : 'Time Travel'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
              >
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
              >
                <Link href="/dev-tools">
                  <Wrench className="h-4 w-4 mr-2" />
                  Dev Tools
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3">
            <SearchBar 
              onSelectTransaction={(txHash) => {
                // Find and select the node in the graph
                const node = graphData.nodes.find(n => n.txHash === txHash);
                if (node) {
                  useGraphStore.setState({ selectedNode: node });
                }
              }}
            />
            <FilterPanel />
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters />
      </header>

      {/* Main Content */}
      <main className="relative">
        {isLoading ? (
          <motion.div 
            className="flex items-center justify-center h-screen"
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
                Loading Transactions from Agents...
              </motion.p>
            </div>
          </motion.div>
        ) : isError ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center max-w-md">
              <p className="text-red-400 text-lg mb-2">Failed to load data</p>
              <p className="text-zinc-500 text-sm">
                Please check your connection or try again later
              </p>
            </div>
          </div>
        ) : (
          <motion.div 
            className="relative"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <ForceGraph 
              data={filteredByDate} 
              width={dimensions.width}
              height={dimensions.height}
            />
            <NetworkInsights graphData={filteredByDate} />
            <LegendPanel />
            <GraphStats metrics={metrics} />
            <GraphControls graphData={graphData} />
            {selectedNode && <NodeDetails node={selectedNode} />}
          </motion.div>
        )}
      </main>
    </div>
  );
}
