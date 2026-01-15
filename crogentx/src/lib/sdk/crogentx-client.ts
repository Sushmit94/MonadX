/**
 * CrogentX SDK - Client library for interacting with CrogentX API
 * 
 * Usage:
 * ```typescript
 * import { CrogentXClient } from 'crogentx-sdk';
 * 
 * const client = new CrogentXClient({ apiUrl: 'https://your-api.com' });
 * const transactions = await client.transactions.list({ limit: 100 });
 * ```
 */

export interface CrogentXConfig {
  apiUrl: string;
  apiKey?: string;
}

export interface TransactionQuery {
  limit?: number;
  offset?: number;
  status?: 'success' | 'failed' | 'pending';
  agentId?: string;
  instructionType?: string;
  minValue?: number;
  maxValue?: number;
  startDate?: string;
  endDate?: string;
}

export interface SimulateTransactionParams {
  instruction: string;
  agentId: string;
  value: string;
  target?: string;
  data?: any;
}

export interface DebugTransactionParams {
  transactionHash: string;
}

export class CrogentXClient {
  private apiUrl: string;
  private apiKey?: string;

  constructor(config: CrogentXConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.apiKey;
  }

  /**
   * Transaction operations
   */
  public transactions = {
    /**
     * List transactions with optional filtering
     */
    list: async (query?: TransactionQuery) => {
      return this.request('/api/transactions', {
        method: 'GET',
        query,
      });
    },

    /**
     * Get a single transaction by hash
     */
    get: async (hash: string) => {
      const result = await this.transactions.list({
        limit: 1000,
      });
      return result.data.find((tx: any) => tx.transactionHash === hash);
    },

    /**
     * Simulate a transaction before execution
     */
    simulate: async (params: SimulateTransactionParams) => {
      return this.request('/api/simulate', {
        method: 'POST',
        body: params,
      });
    },

    /**
     * Debug a failed or pending transaction
     */
    debug: async (params: DebugTransactionParams) => {
      return this.request('/api/debug', {
        method: 'POST',
        body: params,
      });
    },
  };

  /**
   * AI Agent operations
   */
  public agents = {
    /**
     * List all agents
     */
    list: async (params?: { limit?: number; type?: string; active?: boolean }) => {
      return this.request('/api/agents', {
        method: 'GET',
        query: params,
      });
    },

    /**
     * Get agent by ID
     */
    get: async (agentId: string) => {
      const result = await this.agents.list({ limit: 1000 });
      return result.data.find((agent: any) => agent.address === agentId);
    },

    /**
     * Get agent transactions
     */
    transactions: async (agentId: string, limit = 100) => {
      return this.transactions.list({ agentId, limit });
    },
  };

  /**
   * Graph operations
   */
  public graph = {
    /**
     * Get transaction graph data
     */
    get: async (params?: { limit?: number; agentId?: string; instructionType?: string }) => {
      return this.request('/api/graph', {
        method: 'GET',
        query: params,
      });
    },
  };

  /**
   * Analytics operations
   */
  public analytics = {
    /**
     * Get transaction statistics
     */
    stats: async () => {
      const transactions = await this.transactions.list({ limit: 1000 });
      const agents = await this.agents.list({ limit: 1000 });

      return this.calculateStats(transactions.data, agents.data);
    },

    /**
     * Get agent leaderboard
     */
    leaderboard: async (limit = 10) => {
      const transactions = await this.transactions.list({ limit: 1000 });
      return this.calculateLeaderboard(transactions.data, limit);
    },
  };

  /**
   * Helper: Make HTTP request
   */
  private async request(endpoint: string, options: {
    method: 'GET' | 'POST';
    query?: Record<string, any>;
    body?: any;
  }) {
    const url = new URL(this.apiUrl + endpoint);

    // Add query parameters
    if (options.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    // Make request
    const response = await fetch(url.toString(), {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Helper: Calculate statistics
   */
  private calculateStats(transactions: any[], agents: any[]) {
    const successful = transactions.filter(tx => tx.status === 'success');
    const failed = transactions.filter(tx => tx.status === 'failed');
    const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0);

    return {
      totalTransactions: transactions.length,
      successfulTransactions: successful.length,
      failedTransactions: failed.length,
      successRate: (successful.length / transactions.length) * 100,
      totalVolume: totalVolume.toFixed(2),
      avgTransactionValue: (totalVolume / transactions.length).toFixed(4),
      totalAgents: agents.length,
      activeAgents: new Set(transactions.map(tx => tx.agentId).filter(Boolean)).size,
    };
  }

  /**
   * Helper: Calculate leaderboard
   */
  private calculateLeaderboard(transactions: any[], limit: number) {
    const agentStats = new Map<string, { count: number; volume: number; name: string }>();

    transactions.forEach(tx => {
      if (tx.agentId) {
        const current = agentStats.get(tx.agentId) || { count: 0, volume: 0, name: tx.agentName || 'Unknown' };
        current.count++;
        current.volume += parseFloat(tx.value);
        agentStats.set(tx.agentId, current);
      }
    });

    return Array.from(agentStats.entries())
      .map(([agentId, stats]) => ({ agentId, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

/**
 * Convenience function to create a client
 */
export function createClient(config: CrogentXConfig): CrogentXClient {
  return new CrogentXClient(config);
}

// Types are already exported above with their declarations
