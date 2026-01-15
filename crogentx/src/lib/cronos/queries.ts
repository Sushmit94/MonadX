// Data fetching functions for Monad x402 transactions
import { X402Transaction, AIAgent, TransactionQueryParams } from './types';
import { getMockTransactions, getMockAgents, useMockData } from './mock-data';
import { fetchX402Transactions, fetchAgentInfo } from './client';

/**
 * Fetch x402 transactions from Monad
 * Falls back to mock data in development mode
 */
export async function fetchTransactions(
  params?: TransactionQueryParams
): Promise<X402Transaction[]> {
  // Use mock data if enabled or if API is not available
  if (useMockData) {
    console.log('📊 Using mock x402 transaction data');
    let transactions = getMockTransactions();
    
    // Apply filters to mock data
    if (params) {
      if (params.limit) {
        transactions = transactions.slice(0, params.limit);
      }
      if (params.from) {
        transactions = transactions.filter(tx => 
          tx.from.toLowerCase() === params.from!.toLowerCase()
        );
      }
      if (params.to) {
        transactions = transactions.filter(tx => 
          tx.to.toLowerCase() === params.to!.toLowerCase()
        );
      }
      if (params.instructionType) {
        transactions = transactions.filter(tx => 
          tx.instructionType === params.instructionType
        );
      }
      if (params.agentId) {
        transactions = transactions.filter(tx => 
          tx.agentId === params.agentId
        );
      }
    }
    
    return transactions;
  }

  // Real API call
  try {
    const response = await fetchX402Transactions(params);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch transactions, falling back to mock data:', error);
    return getMockTransactions();
  }
}

/**
 * Fetch AI agents from Monad
 * Falls back to mock data in development mode
 */
export async function fetchAgents(): Promise<AIAgent[]> {
  if (useMockData) {
    console.log('🤖 Using mock AI agent data');
    return getMockAgents();
  }

  // Real API call would go here
  try {
    // TODO: Implement real API call when endpoint is available
    return getMockAgents();
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return getMockAgents();
  }
}

/**
 * Fetch single transaction by hash
 */
export async function fetchTransactionByHash(txHash: string): Promise<X402Transaction | null> {
  if (useMockData) {
    const transactions = getMockTransactions();
    return transactions.find(tx => tx.txHash === txHash) || null;
  }

  // Real API call would go here
  try {
    const transactions = await fetchTransactions();
    return transactions.find(tx => tx.txHash === txHash) || null;
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return null;
  }
}

/**
 * Fetch single agent by address or ID
 */
export async function fetchAgent(agentIdOrAddress: string): Promise<AIAgent | null> {
  if (useMockData) {
    const agents = getMockAgents();
    return agents.find(
      a => a.id === agentIdOrAddress || a.address.toLowerCase() === agentIdOrAddress.toLowerCase()
    ) || null;
  }

  // Real API call
  try {
    const response = await fetchAgentInfo(agentIdOrAddress);
    return response.data || null;
  } catch (error) {
    console.error('Failed to fetch agent:', error);
    return null;
  }
}

/**
 * Fetch transactions for a specific agent
 */
export async function fetchAgentTransactions(agentId: string): Promise<X402Transaction[]> {
  return fetchTransactions({ agentId, limit: 1000 });
}

/**
 * Fetch related transactions (parent/child relationships)
 */
export async function fetchRelatedTransactions(txHash: string): Promise<X402Transaction[]> {
  const tx = await fetchTransactionByHash(txHash);
  if (!tx) return [];
  
  const allTransactions = await fetchTransactions();
  const relatedIds = new Set(tx.relatedTransactions || []);
  
  return allTransactions.filter(t => relatedIds.has(t.id));
}