// TypeScript types for Monad x402 Transactions and AI Agent Activities

// Core x402 Transaction Types
export interface X402Transaction {
  id: string;
  txHash: string;
  blockNumber: number;
  blockTimestamp: number;
  from: string; // Agent or wallet address
  to: string; // Contract or recipient address
  value: string; // Amount in MON
  gasUsed: string;
  gasPrice: string;
  status: 'success' | 'failed' | 'pending';
  
  // x402 Specific
  instructionType: X402InstructionType;
  agentId?: string;
  agentName?: string;
  settlementPipeline?: SettlementStep[];
  batchId?: string; // For batched transactions
  parentTxHash?: string; // For multi-step flows
  childTxHashes?: string[]; // For transactions that spawn other transactions
  
  // Metadata
  metadata?: TransactionMetadata;
  
  // Analytics
  executionTime?: number; // ms
  errorReason?: string;
  
  // Relationships for graph
  relatedTransactions?: string[]; // Connected transaction IDs
}

export type X402InstructionType = 
  | 'payment' 
  | 'settlement' 
  | 'swap' 
  | 'stake' 
  | 'liquidity_add' 
  | 'liquidity_remove'
  | 'batch_payment'
  | 'conditional_payment'
  | 'recurring_payment'
  | 'cross_chain_bridge'
  | 'nft_mint'
  | 'nft_transfer'
  | 'contract_call'
  | 'multi_sig'
  | 'governance_vote';

export interface SettlementStep {
  step: number;
  action: string;
  contract: string;
  status: 'pending' | 'completed' | 'failed';
  gasUsed?: string;
  timestamp?: number;
}

export interface TransactionMetadata {
  description?: string;
  tags?: string[];
  protocol?: string; // e.g., 'VVS Finance', 'Moonlander', 'Delphi'
  category?: TransactionCategory;
  aiModel?: string; // AI model that triggered it
  confidence?: number; // AI decision confidence 0-1
  userIntent?: string; // Original user instruction
}

export type TransactionCategory = 
  | 'defi' 
  | 'nft' 
  | 'payment' 
  | 'bridge' 
  | 'governance' 
  | 'gaming' 
  | 'social';

// AI Agent Types
export interface AIAgent {
  id: string;
  name: string;
  address: string;
  type: AgentType;
  owner: string;
  createdAt: number;
  
  // Stats
  totalTransactions: number;
  successRate: number; // 0-100
  totalVolume: string; // Total MON processed
  avgGasUsed: string;
  
  // Behavior
  primaryInstructions: X402InstructionType[];
  integrations: string[]; // Connected protocols
  
  // Status
  isActive: boolean;
  lastActivity?: number;
}

export type AgentType = 
  | 'trading_bot' 
  | 'payment_processor' 
  | 'liquidity_manager' 
  | 'portfolio_rebalancer'
  | 'yield_optimizer'
  | 'nft_sniper'
  | 'governance_delegate'
  | 'bridge_operator'
  | 'custom';

// Graph Visualization Types
export interface GraphNode {
  id: string; // Transaction hash or agent address
  type: 'transaction' | 'agent' | 'contract' | 'wallet';
  name: string;
  
  // Core data
  address?: string;
  timestamp: number;
  
  // Transaction specific
  txHash?: string;
  instructionType?: X402InstructionType;
  value?: string;
  status?: 'success' | 'failed' | 'pending';
  
  // Agent specific
  agentId?: string;
  agentType?: AgentType;
  
  // Graph metrics
  connectionCount: number;
  incomingCount: number;
  outgoingCount: number;
  
  // Visual properties (set by force graph)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  
  // Analytics
  totalVolume: number;
  gasEfficiency?: number;
}

export interface GraphEdge {
  source: string; // Node ID
  target: string; // Node ID
  type: 'flow' | 'trigger' | 'batch' | 'pipeline';
  
  // Transaction data
  txHash?: string;
  value?: string;
  timestamp?: number;
  
  // Visual properties
  width?: number;
  color?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Filter & Search Types
export interface FilterOptions {
  searchQuery?: string;
  instructionTypes?: X402InstructionType[];
  agentTypes?: AgentType[];
  categories?: TransactionCategory[];
  status?: ('success' | 'failed' | 'pending')[];
  dateRange?: {
    start: number;
    end: number;
  };
  minValue?: number;
  maxValue?: number;
  agentIds?: string[];
  protocols?: string[];
  onlyBatched?: boolean;
  onlyMultiStep?: boolean;
}

// Analytics & Stats Types
export interface TransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalVolume: string;
  totalGasUsed: string;
  avgGasPrice: string;
  
  // By instruction type
  instructionDistribution: { [key in X402InstructionType]?: number };
  
  // By category
  categoryDistribution: { [key in TransactionCategory]?: number };
  
  // Time series
  transactionsOverTime: { date: string; count: number; volume: string }[];
  
  // Top performers
  topAgents: { agentId: string; name: string; txCount: number; volume: string }[];
  mostUsedInstructions: { type: X402InstructionType; count: number }[];
  
  // Network metrics
  avgExecutionTime: number;
  peakTps: number; // Transactions per second
}

// API Response Types
export interface MonadAPIResponse<T> {
  data: T;
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
}

export interface TransactionQueryParams {
  limit?: number;
  offset?: number;
  from?: string; // Address
  to?: string; // Address
  startBlock?: number;
  endBlock?: number;
  instructionType?: X402InstructionType;
  agentId?: string;
}