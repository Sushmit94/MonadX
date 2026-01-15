'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { GraphData, GraphNode, GraphEdge } from '@/lib/cronos/types';
import { useGraphStore } from '@/stores/graphStore';
import { getNodeColor, getNodeSize, getEdgeColor, getEdgeWidth } from '@/lib/graph/transaction-graph-builder';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-zinc-400">Loading graph...</div>
    </div>
  ),
});

interface ForceGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
}

export default function ForceGraph({ data, width = 800, height = 600 }: ForceGraphProps) {
  const fgRef = useRef<any>(null);
  const { selectedNode, setSelectedNode, hoveredNode, setHoveredNode, highlightedNodes } = useGraphStore();
  const [graphData, setGraphData] = useState<any>({
    nodes: data.nodes,
    links: data.edges,
  });

  useEffect(() => {
    // Transform edges to links for react-force-graph
    setGraphData({
      nodes: data.nodes,
      links: data.edges,
    });
  }, [data]);

  // Handle node click
  const handleNodeClick = (node: any) => {
    setSelectedNode(node as GraphNode);
    
    // Highlight connected nodes
    const connectedNodeIds = new Set<string>();
    connectedNodeIds.add(node.id);
    
    // Add parent and child nodes
    data.edges.forEach(edge => {
      if (edge.source === node.id) {
        connectedNodeIds.add(typeof edge.target === 'string' ? edge.target : (edge.target as any).id);
      }
      if (edge.target === node.id) {
        connectedNodeIds.add(typeof edge.source === 'string' ? edge.source : (edge.source as any).id);
      }
    });
    
    useGraphStore.setState({ highlightedNodes: connectedNodeIds });
  };

  // Handle node hover
  const handleNodeHover = (node: any) => {
    setHoveredNode(node as GraphNode | null);
  };

  // Node canvas rendering
  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Safety check for valid coordinates
    if (!node.x || !node.y || !isFinite(node.x) || !isFinite(node.y)) {
      return;
    }

    const label = node.name;
    const fontSize = 12 / globalScale;
    const nodeSize = getNodeSize(node);
    const isHighlighted = highlightedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoveredNode?.id === node.id;

    // Draw node circle with gradient for transactions
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    
    // Add subtle gradient for agent nodes
    if (node.type === 'agent' && isFinite(nodeSize)) {
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize);
      gradient.addColorStop(0, getNodeColor(node));
      gradient.addColorStop(1, '#047857'); // Darker green
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = getNodeColor(node);
    }
    ctx.fill();

    // Add border for selected/highlighted/hovered nodes
    if (isSelected || isHighlighted || isHovered) {
      ctx.strokeStyle = isSelected ? '#60a5fa' : isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = (isSelected ? 3 : isHovered ? 2.5 : 2) / globalScale;
      ctx.stroke();
    }

    // Add status indicator for transactions
    if (node.type === 'transaction' && node.status) {
      const statusColors = {
        success: '#10b981',
        failed: '#ef4444',
        pending: '#f59e0b'
      };
      const statusColor = statusColors[node.status as keyof typeof statusColors];
      if (statusColor) {
        ctx.beginPath();
        ctx.arc(node.x + nodeSize * 0.6, node.y - nodeSize * 0.6, nodeSize * 0.3, 0, 2 * Math.PI);
        ctx.fillStyle = statusColor;
        ctx.fill();
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 1.5 / globalScale;
        ctx.stroke();
      }
    }

    // Draw label with better visibility
    if (globalScale > 0.5) {
      ctx.font = `${isSelected ? 'bold' : 'normal'} ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#ffffff';
      
      // Truncate long labels
      const maxChars = 20;
      const displayLabel = label.length > maxChars ? label.substring(0, maxChars) + '...' : label;
      ctx.fillText(displayLabel, node.x, node.y + nodeSize + fontSize + 2);
      
      // Reset shadow
      ctx.shadowBlur = 0;
    }
  };

  // Link rendering with edge type coloring
  const linkCanvasObject = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const sourceNode = typeof link.source === 'string' ? null : link.source;
    const targetNode = typeof link.target === 'string' ? null : link.target;

    // Safety check for valid node positions
    if (!sourceNode || !targetNode || 
        !isFinite(sourceNode.x) || !isFinite(sourceNode.y) ||
        !isFinite(targetNode.x) || !isFinite(targetNode.y)) {
      return;
    }

    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    const isHighlighted = highlightedNodes.has(sourceId) && highlightedNodes.has(targetId);

    // Get edge color and width based on type
    const edgeColor = getEdgeColor(link);
    const edgeWidth = getEdgeWidth(link);

    // Determine link style with subtle, elegant colors
    if (isHighlighted) {
      // Highlighted edges are more visible but still subtle
      ctx.strokeStyle = edgeColor.replace(')', ', 0.8)').replace('rgb', 'rgba');
    } else {
      // Non-highlighted edges are very subtle
      const alpha = link.type === 'pipeline' ? 0.35 : link.type === 'batch' ? 0.25 : 0.2;
      ctx.strokeStyle = edgeColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    }
    ctx.lineWidth = (isHighlighted ? edgeWidth * 1.3 : edgeWidth) / globalScale;

    // Dashed line for batch transactions
    if (link.type === 'batch') {
      ctx.setLineDash([5 / globalScale, 5 / globalScale]);
    } else {
      ctx.setLineDash([]);
    }

    // Draw link
    ctx.beginPath();
    ctx.moveTo(sourceNode.x, sourceNode.y);
    ctx.lineTo(targetNode.x, targetNode.y);
    ctx.stroke();

    // Draw arrow for flow edges
    if (globalScale > 0.6 && link.type !== 'batch') {
      const arrowLength = 8 / globalScale;
      const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
      const targetSize = getNodeSize(targetNode);
      const arrowX = targetNode.x - Math.cos(angle) * (targetSize + 3);
      const arrowY = targetNode.y - Math.sin(angle) * (targetSize + 3);

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - Math.PI / 7),
        arrowY - arrowLength * Math.sin(angle - Math.PI / 7)
      );
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + Math.PI / 7),
        arrowY - arrowLength * Math.sin(angle + Math.PI / 7)
      );
      ctx.closePath();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    }

    // Reset line dash
    ctx.setLineDash([]);
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
      {data.nodes.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-zinc-400 text-lg mb-2">No x402 transactions to display</p>
            <p className="text-zinc-600 text-sm">Try adjusting your filters or check your connection</p>
          </div>
        </div>
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={width}
          height={height}
          backgroundColor="#09090b"
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onBackgroundClick={() => {
            setSelectedNode(null);
            useGraphStore.setState({ highlightedNodes: new Set() });
          }}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      )}
    </div>
  );
}
