import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Define Cronos network
const cronos = {
  id: 25,
  name: 'Cronos',
  nativeCurrency: {
    name: 'Cronos',
    symbol: 'CRO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://evm.cronos.org'] },
    public: { http: ['https://evm.cronos.org'] },
  },
  blockExplorers: {
    default: { name: 'Cronoscan', url: 'https://cronoscan.com' },
  },
  testnet: false,
}

const cronosTestnet = {
  id: 338,
  name: 'Cronos Testnet',
  nativeCurrency: {
    name: 'Cronos',
    symbol: 'TCRO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://evm-t3.cronos.org'] },
    public: { http: ['https://evm-t3.cronos.org'] },
  },
  blockExplorers: {
    default: { name: 'Cronos Testnet Explorer', url: 'https://testnet.cronoscan.com' },
  },
  testnet: true,
}

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [cronos, cronosTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
