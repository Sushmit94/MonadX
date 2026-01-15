// Monad EVM Client Setup

// Define Monad Mainnet
export const monadMainnet = {
  id: 41454, // Monad Mainnet chain ID
  name: 'Monad Mainnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.monad.xyz' },
  },
  testnet: false,
};

// Define Monad Testnet
export const monadTestnet = {
  id: 10143, // Monad Testnet chain ID
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Test Monad', symbol: 'TMON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Testnet Explorer', url: 'https://testnet-explorer.monad.xyz' },
  },
  testnet: true,
};

// Configuration - Use testnet by default (switch to mainnet when ready)
export const MONAD_CHAIN = monadTestnet;

// API endpoints
export const MONAD_API_BASE_URL = 'https://api.monad.xyz/api';

// x402 Facilitator endpoint
export const X402_FACILITATOR_URL = 'https://x402-api.monad.xyz';

// Helper to fetch from Monad API
export async function fetchFromMonadAPI(endpoint: string, params?: Record<string, string>) {
  const url = new URL(endpoint, MONAD_API_BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Monad API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Helper to fetch x402 transactions
export async function fetchX402Transactions(params?: {
  address?: string;
  startBlock?: number;
  endBlock?: number;
  limit?: number;
}) {
  // In production, this calls the actual x402 facilitator API on Monad
  
  try {
    const response = await fetch(`${X402_FACILITATOR_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`x402 API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Failed to fetch x402 transactions:', error);
    throw error;
  }
}

// Helper to fetch agent information
export async function fetchAgentInfo(agentAddress: string) {
  try {
    const response = await fetch(`${X402_FACILITATOR_URL}/agents/${agentAddress}`);
    
    if (!response.ok) {
      throw new Error(`Agent API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Failed to fetch agent info:', error);
    throw error;
  }
}

// Chain configuration
export const SUPPORTED_CHAIN = MONAD_CHAIN;

// Explorer URLs
export const EXPLORER_URL = MONAD_CHAIN.blockExplorers.default.url;
export const TX_EXPLORER_URL = (txHash: string) => `${EXPLORER_URL}/tx/${txHash}`;
export const ADDRESS_EXPLORER_URL = (address: string) => `${EXPLORER_URL}/address/${address}`;

// Faucet URLs
export const TESTNET_FAUCET_URL = 'https://faucet.monad.xyz';

// RPC URLs
export const RPC_URL = MONAD_CHAIN.rpcUrls.default.http[0];