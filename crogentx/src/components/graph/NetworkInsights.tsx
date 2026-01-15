'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Award, Network, Activity } from 'lucide-react';
import { GraphData } from '@/lib/cronos/types';
import { motion } from 'framer-motion';
import { fadeInDown } from '@/lib/animations';

interface NetworkInsightsProps {
  graphData: GraphData;
}

interface Insight {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  description: string;
}

export default function NetworkInsights({ graphData }: NetworkInsightsProps) {
  const insights = useMemo(() => {
    const nodes = graphData.nodes;
    const edges = graphData.edges;

    if (nodes.length === 0) {
      return [];
    }

    // Calculate network density
    const maxPossibleEdges = (nodes.length * (nodes.length - 1)) / 2;
    const density = maxPossibleEdges > 0 ? (edges.length / maxPossibleEdges) * 100 : 0;

    // Find most active agent (highest degree centrality)
    const degreeMap = new Map<string, number>();
    edges.forEach(edge => {
      degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
      degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
    });

    const mostActive = nodes.reduce((max, node) => {
      const degree = degreeMap.get(node.id) || 0;
      const maxDegree = degreeMap.get(max.id) || 0;
      return degree > maxDegree ? node : max;
    }, nodes[0]);

    // Calculate transaction metrics
    const transactions = nodes.filter(n => n.type === 'transaction');
    const agents = nodes.filter(n => n.type === 'agent');
    
    // Calculate average transaction value
    const avgTxValue = transactions.length > 0
      ? transactions.reduce((sum, tx) => sum + (parseFloat(tx.value || '0')), 0) / transactions.length
      : 0;

    // Calculate success rate
    const successCount = transactions.filter(tx => tx.status === 'success').length;
    const successRate = transactions.length > 0 ? (successCount / transactions.length) * 100 : 0;

    // Calculate pipeline depth (for multi-step transactions)
    const depthMap = new Map<string, number>();
    
    function calculateDepth(nodeId: string, visited: Set<string> = new Set()): number {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);

      const children = edges
        .filter(e => e.source === nodeId && e.type === 'pipeline')
        .map(e => e.target);

      if (children.length === 0) return 1;

      return 1 + Math.max(...children.map(c => calculateDepth(c, new Set(visited))));
    }

    // Calculate average pipeline depth
    const pipelineNodes = transactions.filter(tx => 
      edges.some(e => e.source === tx.id && e.type === 'pipeline')
    );
    const avgDepth = pipelineNodes.length > 0
      ? pipelineNodes.reduce((sum, n) => sum + calculateDepth(n.id), 0) / pipelineNodes.length
      : 0;

    // Find longest pipeline chain
    const maxDepth = pipelineNodes.length > 0
      ? Math.max(...pipelineNodes.map(n => calculateDepth(n.id)))
      : 0;

    const insightsData: Insight[] = [
      {
        icon: Activity,
        label: 'Success Rate',
        value: `${successRate.toFixed(1)}%`,
        color: 'text-green-400',
        description: `${successCount}/${transactions.length} succeeded`,
      },
      {
        icon: Award,
        label: 'Most Active',
        value: mostActive.name.slice(0, 15) + (mostActive.name.length > 15 ? '...' : ''),
        color: 'text-yellow-400',
        description: `${degreeMap.get(mostActive.id) || 0} connections`,
      },
      {
        icon: TrendingUp,
        label: 'Avg Tx Value',
        value: `${avgTxValue.toFixed(2)} MON`,
        color: 'text-blue-400',
        description: 'Per transaction',
      },
      {
        icon: Network,
        label: 'Pipeline Depth',
        value: maxDepth > 0 ? maxDepth : 'None',
        color: 'text-purple-400',
        description: 'Multi-step transactions',
      },
    ];

    return insightsData;
  }, [graphData]);

  if (insights.length === 0) return null;

  return (
    <motion.div
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="absolute top-6 left-1/2 -translate-x-1/2 z-10"
    >
      <Card className="bg-zinc-900/90 backdrop-blur-sm border-zinc-800 p-3">
        <div className="flex items-center gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <insight.icon className={`h-4 w-4 ${insight.color}`} />
              <div>
                <p className="text-xs text-zinc-500">{insight.label}</p>
                <p className={`text-sm font-bold ${insight.color}`}>
                  {insight.value}
                </p>
                <p className="text-xs text-zinc-600">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
