// Enhanced realistic mock data for Monad x402 transactions
import { X402Transaction, AIAgent, X402InstructionType, AgentType, TransactionCategory } from './types';

export const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

// Realistic agent names by type
const AGENT_NAMES = {
  trading_bot: [
    'AlphaTrader Pro', 'DeFi Arbitrage Bot', 'Market Maker Elite', 'Momentum Trader',
    'Grid Trading Bot', 'Scalper AI', 'Swing Trade Master', 'Trend Follower'
  ],
  payment_processor: [
    'PayFlow Agent', 'SettleMint Pro', 'InstaPay Bot', 'BatchPay Processor',
    'StreamPay Agent', 'PayGate AI', 'Swift Settle', 'CashFlow Manager'
  ],
  liquidity_manager: [
    'LiquidityOpt Bot', 'AMM Manager Pro', 'Pool Rebalancer', 'LP Optimizer',
    'Yield Harvester', 'Range Manager', 'Capital Allocator', 'Liquidity Sniper'
  ],
  portfolio_rebalancer: [
    'PortfolioSync', 'Asset Balancer Pro', 'Risk Manager Bot', 'Diversifier AI',
    'Index Rebalancer', 'Tactical Allocator', 'Portfolio Guardian', 'Balance Keeper'
  ],
  yield_optimizer: [
    'Yield Maximizer', 'APY Hunter', 'Compound Master', 'Farm Rotator',
    'Staking Optimizer', 'Rewards Harvester', 'Yield Aggregator', 'Farm Manager'
  ],
  nft_sniper: [
    'NFT Sniper Pro', 'Mint Master', 'Floor Sweeper', 'Rare Hunter',
    'Collection Tracker', 'Flip Master', 'Mint Bot Elite', 'NFT Trader AI'
  ],
  governance_delegate: [
    'DAO Voter', 'Governance Bot', 'Proposal Analyzer', 'Vote Delegate',
    'Protocol Guardian', 'Community Rep', 'Stake Voter', 'DAO Manager'
  ],
  bridge_operator: [
    'Bridge Master', 'Cross-Chain Relay', 'Bridge Arbitrage', 'Chain Connector',
    'Multi-Chain Bot', 'Bridge Optimizer', 'Asset Bridger', 'Chain Hopper'
  ]
};

// Monad-native DeFi protocols (hypothetical - update with real protocols when available)
const PROTOCOLS = [
  'MonadSwap', 'MonadLend', 'MonadBridge', 'MonadStake', 'MonadVault',
  'VelocityDEX', 'MonadFarm', 'LiquidMon', 'MonadPool', 'FastSwap'
];

// Helper to generate random addresses
const randomAddress = () => `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`;
const randomTxHash = () => `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`;

// Instruction type distributions (realistic weights)
const INSTRUCTION_WEIGHTS: { type: X402InstructionType; weight: number; category: TransactionCategory }[] = [
  { type: 'payment', weight: 25, category: 'payment' },
  { type: 'swap', weight: 20, category: 'defi' },
  { type: 'settlement', weight: 15, category: 'payment' },
  { type: 'liquidity_add', weight: 10, category: 'defi' },
  { type: 'liquidity_remove', weight: 8, category: 'defi' },
  { type: 'stake', weight: 7, category: 'defi' },
  { type: 'batch_payment', weight: 5, category: 'payment' },
  { type: 'nft_mint', weight: 3, category: 'nft' },
  { type: 'nft_transfer', weight: 3, category: 'nft' },
  { type: 'conditional_payment', weight: 2, category: 'payment' },
  { type: 'cross_chain_bridge', weight: 1, category: 'bridge' },
  { type: 'governance_vote', weight: 1, category: 'governance' },
];

function getRandomInstruction() {
  const totalWeight = INSTRUCTION_WEIGHTS.reduce((sum, i) => sum + i.weight, 0);
  let random = Math.random() * totalWeight;
  for (const instruction of INSTRUCTION_WEIGHTS) {
    random -= instruction.weight;
    if (random <= 0) return instruction;
  }
  return INSTRUCTION_WEIGHTS[0];
}

function generateAgentName(type: AgentType): string {
  const names = (AGENT_NAMES as any)[type] || ['Custom Agent'];
  const baseName = names[Math.floor(Math.random() * names.length)];
  return Math.random() > 0.7 ? `${baseName} #${Math.floor(Math.random() * 999) + 1}` : baseName;
}

function generateDescription(instructionType: X402InstructionType, agentName: string): string {
  const descriptions: { [key in X402InstructionType]: string[] } = {
    payment: [
      `Automated payment transaction executed by ${agentName}`,
      `Direct transfer initiated by AI agent ${agentName}`,
      `Settlement payment processed via x402 protocol`
    ],
    settlement: [
      `Multi-party settlement coordinated by ${agentName}`,
      `Batch settlement executed through x402 pipeline`,
      `Automated settlement with royalty distribution`
    ],
    swap: [
      `Token swap executed on ${PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)]}`,
      `Optimized swap route found and executed by ${agentName}`,
      `DeFi swap with minimal slippage via x402`
    ],
    stake: [
      `Staking transaction on ${PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)]}`,
      `Automated staking position opened by ${agentName}`,
      `Yield farming deposit executed via x402`
    ],
    liquidity_add: [
      `Liquidity provision to ${PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)]} pool`,
      `LP position created by ${agentName}`,
      `Dual-sided liquidity added via x402 instruction`
    ],
    liquidity_remove: [
      `Liquidity withdrawal from ${PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)]}`,
      `LP position closed by ${agentName}`,
      `Automated liquidity removal and claim`
    ],
    batch_payment: [
      `Batch payment to ${Math.floor(Math.random() * 50) + 2} recipients`,
      `Payroll distribution executed by ${agentName}`,
      `Multi-recipient settlement via x402 batching`
    ],
    conditional_payment: [
      `Conditional payment executed on trigger by ${agentName}`,
      `Event-based payment released via x402`,
      `Smart payment with conditional logic`
    ],
    recurring_payment: [
      `Recurring subscription payment via ${agentName}`,
      `Automated periodic payment executed`,
      `Schedule-based payment via x402`
    ],
    cross_chain_bridge: [
      `Cross-chain bridge operation initiated by ${agentName}`,
      `Asset bridged via x402 bridge operator`,
      `Multi-chain settlement coordinated`
    ],
    nft_mint: [
      `NFT minted on Monad by ${agentName}`,
      `AI-triggered NFT creation via x402`,
      `Generative NFT minted automatically`
    ],
    nft_transfer: [
      `NFT transferred by ${agentName}`,
      `Automated NFT distribution via x402`,
      `Collection transfer executed`
    ],
    contract_call: [
      `Smart contract interaction by ${agentName}`,
      `Protocol function called via x402`,
      `Automated contract execution`
    ],
    multi_sig: [
      `Multi-signature transaction coordinated by ${agentName}`,
      `Multi-sig approval and execution via x402`,
      `Secure multi-party transaction`
    ],
    governance_vote: [
      `Governance vote cast by ${agentName}`,
      `DAO proposal vote via x402 delegate`,
      `Automated governance participation`
    ]
  };
  
  const options = descriptions[instructionType] || ['Transaction executed'];
  return options[Math.floor(Math.random() * options.length)];
}

// Generate mock AI agents
let cachedAgents: AIAgent[] | null = null;

export function getMockAgents(): AIAgent[] {
  if (cachedAgents) return cachedAgents;
  
  const agents: AIAgent[] = [];
  const agentTypes: AgentType[] = [
    'trading_bot', 'payment_processor', 'liquidity_manager', 'portfolio_rebalancer',
    'yield_optimizer', 'nft_sniper', 'governance_delegate', 'bridge_operator'
  ];
  
  const now = Date.now() / 1000;
  const oneYearAgo = now - (365 * 86400);
  
  // Create 20-30 agents
  const agentCount = Math.floor(Math.random() * 11) + 20;
  
  for (let i = 0; i < agentCount; i++) {
    const type = agentTypes[Math.floor(Math.random() * agentTypes.length)];
    const name = generateAgentName(type);
    const address = randomAddress();
    
    // Power law distribution for transaction counts
    const txCount = Math.floor(Math.pow(Math.random(), 2) * 500) + 10;
    const successRate = 85 + Math.random() * 14; // 85-99%
    const volume = (Math.pow(Math.random(), 1.5) * 100000).toFixed(2);
    
    // Primary instruction types for this agent
    const primaryCount = Math.floor(Math.random() * 3) + 2;
    const primaryInstructions: X402InstructionType[] = [];
    const shuffled = [...INSTRUCTION_WEIGHTS].sort(() => Math.random() - 0.5);
    for (let j = 0; j < primaryCount; j++) {
      primaryInstructions.push(shuffled[j].type);
    }
    
    agents.push({
      id: `agent-${i}`,
      name,
      address,
      type,
      owner: randomAddress(),
      createdAt: oneYearAgo + Math.random() * 300 * 86400,
      totalTransactions: txCount,
      successRate,
      totalVolume: volume,
      avgGasUsed: (Math.random() * 100000 + 50000).toFixed(0),
      primaryInstructions,
      integrations: PROTOCOLS.slice(0, Math.floor(Math.random() * 4) + 2),
      isActive: Math.random() > 0.1, // 90% active
      lastActivity: now - Math.random() * 7 * 86400
    });
  }
  
  console.log(`✅ Generated ${agents.length} mock AI agents`);
  cachedAgents = agents;
  return agents;
}

// Generate mock x402 transactions
let cachedTransactions: X402Transaction[] | null = null;

export function getMockTransactions(): X402Transaction[] {
  if (cachedTransactions) return cachedTransactions;
  
  const agents = getMockAgents();
  const transactions: X402Transaction[] = [];
  const totalTx = 800; // Increased from typical counts
  
  const now = Date.now() / 1000;
  const oneMonthAgo = now - (30 * 86400);
  
  console.log(`Generating ${totalTx} mock x402 transactions...`);
  
  // Track transaction relationships for graph
  const txHashMap = new Map<string, X402Transaction>();
  
  for (let i = 0; i < totalTx; i++) {
    const txHash = randomTxHash();
    const instruction = getRandomInstruction();
    const agent = agents[Math.floor(Math.random() * agents.length)];
    
    // Success rate weighted
    const isSuccess = Math.random() < 0.92; // 92% success rate
    const status = isSuccess ? 'success' : 'failed';
    
    // Value distribution (power law)
    const value = (Math.pow(Math.random(), 2) * 10000).toFixed(4);
    
    // Gas used (realistic ranges)
    const gasUsed = (Math.random() * 200000 + 50000).toFixed(0);
    const gasPrice = (Math.random() * 50 + 10).toFixed(9); // in gwei
    
    // Execution time (ms) - Monad is FAST! 800ms finality
    const executionTime = Math.floor(Math.random() * 1200) + 300; // 300-1500ms
    
    // 20% chance of being part of a batch
    const isBatched = Math.random() < 0.2;
    const batchId = isBatched ? `batch-${Math.floor(Math.random() * 100)}` : undefined;
    
    // 15% chance of multi-step pipeline
    const isMultiStep = Math.random() < 0.15;
    let settlementPipeline = undefined;
    if (isMultiStep) {
      const steps = Math.floor(Math.random() * 3) + 2;
      settlementPipeline = Array.from({ length: steps }, (_, j) => ({
        step: j + 1,
        action: ['Approve', 'Swap', 'Transfer', 'Settle', 'Claim'][j % 5],
        contract: randomAddress(),
        status: (j < steps - 1 ? 'completed' : (isSuccess ? 'completed' : 'failed')) as any,
        gasUsed: (Math.random() * 100000 + 30000).toFixed(0),
        timestamp: oneMonthAgo + (Math.random() * 30 * 86400) + j * 30
      }));
    }
    
    // Some transactions spawn child transactions (10%)
    const hasChildren = Math.random() < 0.1 && i < totalTx - 5;
    const childCount = hasChildren ? Math.floor(Math.random() * 3) + 1 : 0;
    
    const tx: X402Transaction = {
      id: `tx-${i}`,
      txHash,
      blockNumber: 5000000 + i * 3,
      blockTimestamp: oneMonthAgo + (Math.random() * 30 * 86400),
      from: agent.address,
      to: randomAddress(),
      value,
      gasUsed,
      gasPrice,
      status,
      instructionType: instruction.type,
      agentId: agent.id,
      agentName: agent.name,
      settlementPipeline,
      batchId,
      parentTxHash: undefined,
      childTxHashes: hasChildren ? [] : undefined,
      metadata: {
        description: generateDescription(instruction.type, agent.name),
        tags: [instruction.type, agent.type, instruction.category],
        protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
        category: instruction.category,
        aiModel: ['GPT-4', 'Claude-3.5', 'Llama-3', 'Custom Model'][Math.floor(Math.random() * 4)],
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        userIntent: [
          'Optimize yield', 'Rebalance portfolio', 'Execute trade', 
          'Process payment', 'Manage liquidity', 'Harvest rewards'
        ][Math.floor(Math.random() * 6)]
      },
      executionTime,
      errorReason: !isSuccess ? ['Gas limit exceeded', 'Slippage too high', 'Insufficient balance', 'Contract reverted'][Math.floor(Math.random() * 4)] : undefined,
      relatedTransactions: []
    };
    
    transactions.push(tx);
    txHashMap.set(txHash, tx);
  }
  
  // Create parent-child relationships (10% have children)
  const parentCandidates = transactions.filter(tx => tx.childTxHashes !== undefined);
  parentCandidates.forEach(parent => {
    const childCount = Math.floor(Math.random() * 3) + 1;
    const availableChildren = transactions.filter(
      tx => !tx.parentTxHash && tx.id !== parent.id && 
      tx.blockTimestamp > parent.blockTimestamp &&
      tx.blockTimestamp < parent.blockTimestamp + 3600 // Within 1 hour
    );
    
    const selectedChildren = availableChildren
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(childCount, availableChildren.length));
    
    selectedChildren.forEach(child => {
      child.parentTxHash = parent.txHash;
      parent.childTxHashes!.push(child.txHash);
      parent.relatedTransactions!.push(child.id);
      child.relatedTransactions!.push(parent.id);
    });
  });
  
  // Add some related transactions for batches
  const batches = new Map<string, X402Transaction[]>();
  transactions.forEach(tx => {
    if (tx.batchId) {
      if (!batches.has(tx.batchId)) {
        batches.set(tx.batchId, []);
      }
      batches.get(tx.batchId)!.push(tx);
    }
  });
  
  batches.forEach(batchTxs => {
    batchTxs.forEach(tx => {
      tx.relatedTransactions = batchTxs
        .filter(other => other.id !== tx.id)
        .map(other => other.id);
    });
  });
  
  console.log(`✅ Generated ${transactions.length} mock x402 transactions`);
  console.log(`   - ${transactions.filter(tx => tx.status === 'success').length} successful`);
  console.log(`   - ${transactions.filter(tx => tx.status === 'failed').length} failed`);
  console.log(`   - ${transactions.filter(tx => tx.batchId).length} batched`);
  console.log(`   - ${transactions.filter(tx => tx.settlementPipeline).length} multi-step`);
  console.log(`   - ${parentCandidates.length} with child transactions`);
  
  cachedTransactions = transactions;
  return transactions;
}

// Clear cache for development
export function clearMockDataCache() {
  cachedAgents = null;
  cachedTransactions = null;
}