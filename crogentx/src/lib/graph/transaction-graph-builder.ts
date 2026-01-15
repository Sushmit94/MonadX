// Build graph data structure from x402 transactions
import { 
  X402Transaction, 
  GraphNode, 
  GraphEdge, 
  GraphData, 
  FilterOptions,
  AIAgent
} from '../cronos/types';

export function buildTransactionGraph(
  transactions: X402Transaction[], 
  agents?: AIAgent[]
): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();
  const addressNodeMap = new Map<string, GraphNode>(); // Track unique addresses

  // Create agent nodes first
  if (agents) {
    agents.forEach(agent => {
      const agentNode: GraphNode = {
        id: agent.address,
        type: 'agent',
        name: agent.name,
        address: agent.address,
        timestamp: agent.createdAt,
        agentId: agent.id,
        agentType: agent.type,
        connectionCount: 0,
        incomingCount: 0,
        outgoingCount: agent.totalTransactions,
        totalVolume: parseFloat(agent.totalVolume),
        gasEfficiency: agent.totalTransactions > 0 
          ? parseFloat(agent.avgGasUsed) / agent.totalTransactions 
          : 0
      };
      
      nodeMap.set(agent.address, agentNode);
      addressNodeMap.set(agent.address, agentNode);
    });
  }

  // Helper to get or create address node (wallet/contract)
  const getOrCreateAddressNode = (address: string, type: 'wallet' | 'contract' = 'wallet'): GraphNode => {
    if (addressNodeMap.has(address)) {
      return addressNodeMap.get(address)!;
    }
    
    const node: GraphNode = {
      id: address,
      type,
      name: type === 'wallet' 
        ? `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`
        : `Contract ${address.slice(0, 6)}...${address.slice(-4)}`,
      address,
      timestamp: Date.now() / 1000,
      connectionCount: 0,
      incomingCount: 0,
      outgoingCount: 0,
      totalVolume: 0
    };
    
    addressNodeMap.set(address, node);
    return node;
  };

  // Create transaction nodes and edges
  transactions.forEach(tx => {
    // Create transaction node
    const txNode: GraphNode = {
      id: tx.txHash,
      type: 'transaction',
      name: `${tx.instructionType} - ${tx.value} MON`,
      txHash: tx.txHash,
      timestamp: tx.blockTimestamp,
      instructionType: tx.instructionType,
      value: tx.value,
      status: tx.status,
      agentId: tx.agentId,
      connectionCount: 0,
      incomingCount: 1, // from sender
      outgoingCount: 1, // to recipient
      totalVolume: parseFloat(tx.value)
    };
    
    nodeMap.set(tx.txHash, txNode);
    
    // Get or create sender node
    const fromNode = getOrCreateAddressNode(tx.from, tx.agentId ? 'wallet' : 'wallet');
    fromNode.outgoingCount++;
    fromNode.totalVolume += parseFloat(tx.value);
    
    // Get or create recipient node
    const toNode = getOrCreateAddressNode(tx.to, 'contract');
    toNode.incomingCount++;
    toNode.totalVolume += parseFloat(tx.value);
    
    // Create edge: sender -> transaction
    edges.push({
      source: tx.from,
      target: tx.txHash,
      type: 'flow',
      txHash: tx.txHash,
      value: tx.value,
      timestamp: tx.blockTimestamp
    });
    
    // Create edge: transaction -> recipient
    edges.push({
      source: tx.txHash,
      target: tx.to,
      type: 'flow',
      txHash: tx.txHash,
      value: tx.value,
      timestamp: tx.blockTimestamp
    });
    
    // Create edges for parent-child relationships
    if (tx.parentTxHash) {
      edges.push({
        source: tx.parentTxHash,
        target: tx.txHash,
        type: 'pipeline',
        timestamp: tx.blockTimestamp
      });
    }
    
    // Create edges for batched transactions
    if (tx.relatedTransactions && tx.relatedTransactions.length > 0) {
      tx.relatedTransactions.forEach(relatedId => {
        const relatedTx = transactions.find(t => t.id === relatedId);
        if (relatedTx && relatedTx.batchId === tx.batchId) {
          edges.push({
            source: tx.txHash,
            target: relatedTx.txHash,
            type: 'batch',
            timestamp: tx.blockTimestamp
          });
        }
      });
    }
  });

  // Add all address nodes to main nodes array
  addressNodeMap.forEach(node => {
    if (!nodes.find(n => n.id === node.id)) {
      node.connectionCount = node.incomingCount + node.outgoingCount;
      nodes.push(node);
    }
  });
  
  // Add all transaction nodes
  nodeMap.forEach(node => {
    if (node.type === 'transaction') {
      nodes.push(node);
    }
  });

  return { nodes, edges };
}

export function filterTransactionGraph(
  graphData: GraphData,
  filters: FilterOptions
): GraphData {
  let filteredNodes = [...graphData.nodes];

  // Search query (search by address, tx hash, agent name)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredNodes = filteredNodes.filter(
      node =>
        node.name.toLowerCase().includes(query) ||
        (node.address && node.address.toLowerCase().includes(query)) ||
        (node.txHash && node.txHash.toLowerCase().includes(query))
    );
  }

  // Instruction types
  if (filters.instructionTypes && filters.instructionTypes.length > 0) {
    filteredNodes = filteredNodes.filter(
      node => 
        node.type !== 'transaction' || 
        (node.instructionType && filters.instructionTypes!.includes(node.instructionType))
    );
  }

  // Agent types
  if (filters.agentTypes && filters.agentTypes.length > 0) {
    const agentNodeIds = new Set(
      filteredNodes
        .filter(n => n.type === 'agent' && n.agentType && filters.agentTypes!.includes(n.agentType))
        .map(n => n.id)
    );
    
    // Keep agent nodes and their transactions
    filteredNodes = filteredNodes.filter(
      node => 
        agentNodeIds.has(node.id) ||
        (node.agentId && agentNodeIds.has(node.agentId))
    );
  }

  // Transaction status
  if (filters.status && filters.status.length > 0) {
    filteredNodes = filteredNodes.filter(
      node =>
        node.type !== 'transaction' ||
        (node.status && filters.status!.includes(node.status))
    );
  }

  // Date range
  if (filters.dateRange) {
    filteredNodes = filteredNodes.filter(
      node =>
        node.timestamp >= filters.dateRange!.start &&
        node.timestamp <= filters.dateRange!.end
    );
  }

  // Value range
  if (filters.minValue !== undefined) {
    filteredNodes = filteredNodes.filter(
      node => 
        node.type !== 'transaction' || 
        (node.value && parseFloat(node.value) >= filters.minValue!)
    );
  }
  if (filters.maxValue !== undefined) {
    filteredNodes = filteredNodes.filter(
      node => 
        node.type !== 'transaction' || 
        (node.value && parseFloat(node.value) <= filters.maxValue!)
    );
  }

  // Agent IDs filter
  if (filters.agentIds && filters.agentIds.length > 0) {
    const agentIdSet = new Set(filters.agentIds);
    filteredNodes = filteredNodes.filter(
      node =>
        (node.agentId && agentIdSet.has(node.agentId)) ||
        node.type === 'agent' ||
        node.type === 'wallet' ||
        node.type === 'contract'
    );
  }

  // Only batched
  if (filters.onlyBatched) {
    filteredNodes = filteredNodes.filter(
      node =>
        node.type !== 'transaction' ||
        graphData.edges.some(e => 
          (e.source === node.id || e.target === node.id) && e.type === 'batch'
        )
    );
  }

  // Only multi-step
  if (filters.onlyMultiStep) {
    filteredNodes = filteredNodes.filter(
      node =>
        node.type !== 'transaction' ||
        graphData.edges.some(e => 
          (e.source === node.id || e.target === node.id) && e.type === 'pipeline'
        )
    );
  }

  // Filter edges to only include nodes that passed filters
  const nodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graphData.edges.filter(
    edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

export function calculateGraphMetrics(graphData: GraphData) {
  const metrics = {
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.edges.length,
    totalTransactions: graphData.nodes.filter(n => n.type === 'transaction').length,
    totalAgents: graphData.nodes.filter(n => n.type === 'agent').length,
    avgDegree: 0,
    maxDepth: 0,
    isolatedNodes: 0,
  };

  // Calculate average degree
  const degreeMap = new Map<string, number>();
  graphData.edges.forEach(edge => {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
  });

  if (degreeMap.size > 0) {
    const totalDegree = Array.from(degreeMap.values()).reduce((sum, deg) => sum + deg, 0);
    metrics.avgDegree = totalDegree / degreeMap.size;
  }

  // Count isolated nodes
  metrics.isolatedNodes = graphData.nodes.filter(node => !degreeMap.has(node.id)).length;

  return metrics;
}

// Export graph as JSON
export function exportGraphAsJSON(graphData: GraphData): string {
  return JSON.stringify(graphData, null, 2);
}

// Color coding for nodes
export function getNodeColor(node: GraphNode): string {
  // Color by node type
  if (node.type === 'agent') {
    return '#10b981'; // green - agents
  } else if (node.type === 'transaction') {
    // Color by instruction type
    const instructionColors: { [key: string]: string } = {
      payment: '#3b82f6', // blue
      swap: '#8b5cf6', // purple
      settlement: '#f59e0b', // amber
      stake: '#ec4899', // pink
      liquidity_add: '#14b8a6', // teal
      liquidity_remove: '#ef4444', // red
      batch_payment: '#6366f1', // indigo
      conditional_payment: '#06b6d4', // cyan
      nft_mint: '#a855f7', // violet
      nft_transfer: '#d946ef', // fuchsia
    };
    return instructionColors[node.instructionType || ''] || '#6b7280'; // gray default
  } else if (node.type === 'contract') {
    return '#f97316'; // orange - contracts
  } else {
    return '#64748b'; // slate - wallets
  }
}

// Size calculation for nodes
export function getNodeSize(node: GraphNode): number {
  if (node.type === 'agent') {
    // Agents sized by transaction count
    return 8 + Math.log(node.outgoingCount + 1) * 3;
  } else if (node.type === 'transaction') {
    // Transactions sized by value
    return 4 + Math.log(node.totalVolume + 1) * 1.5;
  } else {
    // Wallets/contracts sized by connection count
    return 5 + Math.log(node.connectionCount + 1) * 2;
  }
}

// Edge styling - subtle and elegant colors
export function getEdgeColor(edge: GraphEdge): string {
  const edgeColors = {
    flow: '#475569', // muted slate blue
    trigger: '#52796f', // muted sage green
    batch: '#94a3b8', // light slate
    pipeline: '#6366f1', // soft indigo
  };
  return edgeColors[edge.type] || '#3f3f46';
}

export function getEdgeWidth(edge: GraphEdge): number {
  if (edge.value) {
    // Reduced width based on transaction value - more subtle
    return 0.5 + Math.log(parseFloat(edge.value) + 1) * 0.3;
  }
  return edge.type === 'pipeline' ? 1 : 0.5;
}