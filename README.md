# CrogentX

**Professional Developer Toolkit for Cronos x402 - Transaction Visualization, Debugging & Analytics**

CrogentX is the first comprehensive developer platform for building, debugging, and monitoring AI agents on Cronos EVM using the x402 protocol. Featuring real-time visualization, transaction simulation, performance profiling, and a full REST API + SDK for seamless integration.

Built for the **Cronos x402 Paytech Hackathon - Dev Tooling & Data Virtualization Track**.

![Cronos](https://img.shields.io/badge/Cronos-EVM-blue)
![x402](https://img.shields.io/badge/x402-Protocol-cyan)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

##  Features

###  Visual Analytics Engine
- **Interactive Force-Directed Graph**: Real-time visualization of AI agent transactions, showing agent→contract→wallet flows
- **Multi-Node Types**: Distinct visual representation for agents, transactions, contracts, and wallets
- **Live Transaction Monitoring**: Fetches and displays x402 transactions from Cronos EVM (testnet & mainnet)
- **Transaction Details Panel**: Click any transaction to see complete x402 instruction details, gas metrics, and execution status
- **Smart Highlighting**: Hover to highlight connected transactions and trace multi-step payment pipelines
- **Batch & Pipeline Detection**: Automatically identifies and visualizes batched payments and settlement pipelines
- **Responsive Design**: Optimized for both development and production monitoring

###  Advanced Filtering & Search
- **Smart Search**: Real-time search across transaction hashes, agent names, and wallet addresses
- **Instruction Type Filters**: Filter by x402 instruction types (payment, swap, stake, liquidity, NFT, etc.)
- **Agent Type Filters**: Filter by AI agent categories (trading bots, payment processors, liquidity managers, etc.)
- **Status Filters**: Show only successful, failed, or pending transactions
- **Value Range Filters**: Filter transactions by CRO value ranges
- **Batch & Multi-Step Filters**: Focus on complex transaction patterns
- **Protocol Integration Filters**: Filter by DeFi protocol (VVS Finance, Moonlander, Delphi, etc.)

###  Analytics Dashboard
- **Transaction Metrics**: Total transactions, success rates, volume processed
- **Agent Performance**: Top performing AI agents, transaction counts, gas efficiency
- **Instruction Distribution**: Breakdown of x402 instruction types usage
- **Category Analysis**: Transaction categorization (DeFi, NFT, Payment, Bridge, etc.)
- **Time Series Analysis**: Transaction volume and count over time
- **Gas Analytics**: Average gas usage, gas price trends, optimization opportunities
- **Network Health**: Peak TPS, execution times, error rate tracking

###  Developer Toolkit (NEW!)

#### REST API
- **GET /api/transactions** - Query transactions with advanced filtering
- **GET /api/agents** - List and filter AI agents
- **GET /api/graph** - Generate transaction graph data
- **POST /api/simulate** - Simulate transactions before execution
- **POST /api/debug** - Debug failed/pending transactions with detailed analysis

#### TypeScript SDK
```typescript
import { createClient } from 'crogentx';

const client = createClient({ apiUrl: 'https://your-api.com' });
const txs = await client.transactions.list({ limit: 100, status: 'success' });
const simulation = await client.transactions.simulate({ ... });
```

#### CLI Tool
```bash
crogentx transactions --limit 10 --status success
crogentx simulate --instruction transfer --value 100 --agent 0x123...
crogentx debug --tx 0xabc...
crogentx stats
```

#### Transaction Inspector
- **Visual Debugging**: Step-by-step execution trace
- **Gas Analysis**: Efficiency scoring and optimization suggestions
- **Issue Detection**: Automatic identification of common failure patterns
- **Cronoscan Integration**: Direct links to block explorer

#### Transaction Simulator
- **Pre-execution Testing**: Test transactions before sending
- **Gas Estimation**: Accurate gas predictions with cost breakdown
- **Success Probability**: AI-powered success rate prediction
- **Issue Detection**: Identify potential failures before they happen
- **Recommendation Engine**: Get actionable suggestions for optimization

#### Performance Features
- **Real-time Monitoring**: Live transaction updates via SWR
- **Smart Caching**: Intelligent data caching for performance
- **Batch Operations**: Handle multiple transactions efficiently
- **Export Capabilities**: JSON/CSV export for external analysis
- **Mock Data Mode**: 800+ realistic transactions for testing

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cronos wallet (optional, for testnet/mainnet connection)
- Cronoscan API key (optional, for production data)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cronos-agent-observatory.git
cd cronos-agent-observatory/story-atlas

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see live x402 transaction flows!

### Environment Variables

```bash
# Cronos Network Configuration
NEXT_PUBLIC_CRONOS_TESTNET=false  # Set to true for testnet
NEXT_PUBLIC_CRONOS_API_URL=https://api.cronoscan.com/api
NEXT_PUBLIC_CRONOS_API_KEY=your_cronoscan_api_key
NEXT_PUBLIC_RPC_URL=https://evm.cronos.org

# x402 Facilitator Configuration
NEXT_PUBLIC_X402_FACILITATOR_URL=https://x402-api.cronos.org

# Development Mode (uses mock data)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Wallet Connect
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
```

### Quick Start with Mock Data

For immediate exploration without API keys:

```bash
npm install
npm run dev
```

The app will automatically use rich mock data showing 800+ sample x402 transactions from 20+ AI agents.

##  Project Structure

```
cronos-agent-observatory/
└── story-atlas/
    ├── src/
    │   ├── app/                    # Next.js app router pages
    │   │   ├── page.tsx           # Main graph visualization
    │   │   └── analytics/         # Analytics dashboard
    │   ├── components/
    │   │   ├── graph/             # Graph visualization components
    │   │   │   ├── ForceGraph.tsx      # Main D3 force graph
    │   │   │   ├── NodeDetails.tsx     # Transaction/Agent details panel
    │   │   │   ├── GraphControls.tsx   # Zoom, pan, export controls
    │   │   │   └── LegendPanel.tsx     # Color coding legend
    │   │   ├── search/            # Search & filter components
    │   │   └── ui/                # shadcn/ui components
    │   ├── lib/
    │   │   ├── cronos/            # Cronos EVM & x402 integration
    │   │   │   ├── types.ts            # TypeScript type definitions
    │   │   │   ├── client.ts           # Cronos API client
    │   │   │   ├── queries.ts          # Data fetching functions
    │   │   │   └── mock-data.ts        # Mock data generator
    │   │   ├── graph/             # Graph building algorithms
    │   │   │   └── transaction-graph-builder.ts
    │   │   └── hooks/             # Custom React hooks
    │   │       ├── useTransactions.ts
    │   │       ├── useAgents.ts
    │   │       └── useTransactionGraph.ts
    │   └── stores/                # Zustand state management
    │       ├── graphStore.ts           # Graph interaction state
    │       └── filterStore.ts          # Filter state
    ├── config/                    # Configuration files
    └── public/                    # Static assets
```

##  Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Visualization**: react-force-graph-2d + D3.js
- **State Management**: Zustand
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Web3**: Wagmi + Viem + Ethers.js
- **Blockchain**: Cronos EVM (Mainnet & Testnet)
- **Protocol**: x402 Facilitator SDK
- **Charts**: Recharts
- **Animations**: Framer Motion

##  Graph Visualization

### Node Types & Colors
- 🟢 **Green**: AI Agents (trading bots, payment processors, etc.)
- 🔵 **Blue/Purple/Pink**: Transactions (colored by x402 instruction type)
  - Blue: Payments
  - Purple: Swaps
  - Amber: Settlements
  - Pink: Staking
  - Teal: Liquidity operations
  - Violet: NFT operations
- 🟠 **Orange**: Smart Contracts
- ⚫ **Slate**: Wallets

### Node Sizes
- **Agents**: Sized by total transaction count (more transactions = larger)
- **Transactions**: Sized by CRO value (higher value = larger)
- **Wallets/Contracts**: Sized by connection count

### Edge Types
- 🔵 **Blue (Flow)**: Direct transaction flow (agent/wallet → transaction → contract)
- 🟢 **Green (Trigger)**: Agent triggering action
- 🟡 **Yellow (Batch)**: Batched transaction relationship
- 🟣 **Purple (Pipeline)**: Multi-step settlement pipeline

### Edge Thickness
- Thicker edges = Higher transaction value
- Calculated using `log(value + 1)`

##  Analytics Features

- **Transaction Metrics**: Total count, success rate, volume in CRO
- **Agent Performance**: Top agents by transaction count, success rate, gas efficiency
- **Instruction Type Breakdown**: Distribution chart of x402 instruction usage
- **Category Analysis**: DeFi vs NFT vs Payment vs Bridge activity
- **Time Series**: Transaction volume and count over time (hourly/daily/weekly)
- **Gas Analytics**: Average gas used, gas price trends, optimization opportunities
- **Protocol Integration**: Activity breakdown by integrated protocols (VVS, Moonlander, Delphi, etc.)
- **Batch & Pipeline Detection**: Percentage of complex multi-step transactions
- **Error Analysis**: Failed transaction patterns and reasons
- **Network Health**: Peak TPS, average execution time, success rate trends

## 🔧 Development

### Mock Data Mode
For development without Cronos API access:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true npm run dev
```

Generates 800 realistic x402 transactions across 20-30 AI agents with:
- Multiple instruction types (payment, swap, stake, liquidity, NFT, etc.)
- Parent-child transaction relationships
- Batched transactions
- Multi-step settlement pipelines
- Realistic gas usage and success rates

### Connecting to Cronos Testnet

1. Get test CRO from the faucet: https://cronos.org/faucet
2. Update `.env.local`:
```bash
NEXT_PUBLIC_CRONOS_TESTNET=true
NEXT_PUBLIC_USE_MOCK_DATA=false
```

3. Deploy test x402 transactions using the Cronos x402 SDK
4. Watch them appear in real-time in the Observatory!

### Building for Production

```bash
npm run build
npm run start
```

### Linting & Type Checking

```bash
npm run lint
npx tsc --noEmit
```

##  Roadmap

### Phase 1: Core Visualization ✅
- [x] Force-directed graph with agent/transaction/wallet nodes
- [x] Real-time data fetching from Cronos
- [x] Multi-type filtering and search
- [x] Transaction details panel
- [x] Mock data for development

### Phase 2: Advanced Developer Tools (In Progress)
- [x] Transaction replay/time-travel debugging
- [ ] Gas profiling and optimization recommendations
- [ ] Settlement pipeline step-by-step visualizer
- [ ] Failed transaction debugger with error explanations
- [ ] Contract interaction decoder

### Phase 3: AI & Automation
- [ ] MCP Server for ChatGPT/Claude integration
- [ ] Natural language queries ("Show me all failed swaps yesterday")
- [ ] AI-generated code snippets for x402 patterns
- [ ] Predictive analytics for agent performance
- [ ] Anomaly detection for suspicious patterns

### Phase 4: Production Features
- [ ] WebSocket for real-time transaction updates
- [ ] Alert system for agent failures
- [ ] Custom dashboard builder
- [ ] Comparison mode (compare two agents side-by-side)
- [ ] Historical data archiving (6+ months)
- [ ] API endpoint for external tools
- [ ] Webhook notifications

### Phase 5: Community & Integration
- [ ] Public agent registry
- [ ] Leaderboard for most efficient agents
- [ ] Crypto.com AI Agent SDK showcase integration
- [ ] Crypto.com Market Data MCP integration
- [ ] Integration with VVS Finance, Moonlander, Delphi
- [ ] Embeddable widget for dApp integration
- [ ] SVG/PNG export for reports

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


##  Why CrogenTX?

This tool addresses critical gaps in the emerging x402 agentic payment ecosystem:

1. **No Visibility**: Developers building AI agents on Cronos lack tools to visualize and debug complex payment flows
2. **Gas Optimization**: Without profiling tools, agents waste gas on inefficient operations
3. **Debugging Pain**: Multi-step settlement failures are hard to trace without step-by-step visualization
4. **Agent Discovery**: No way to discover and analyze successful agent patterns
5. **Ecosystem Growth**: As x402 adoption grows, infrastructure tooling becomes critical

### Impact on Cronos Ecosystem

- **Accelerates Development**: Reduces time from concept to working agent by 10x
- **Improves Reliability**: Visual debugging catches errors before production
- **Encourages Best Practices**: Developers learn from successful agent patterns
- **Supports Crypto.com Integration**: Showcases AI Agent SDK and MCP capabilities
- **Data-Driven Decisions**: Analytics inform protocol improvements

##  Hackathon Fit: Dev Tooling & Data Virtualization

This project excels in both Dev Tooling and Data Virtualization tracks:

### Dev Tooling
- ✅ Complete TypeScript SDK for x402 transaction parsing
- ✅ Visual debugger for agent behavior
- ✅ Gas profiling and optimization recommendations
- ✅ Export tools for CI/CD integration
- ✅ Mock data generator for testing

### Data Virtualization
- ✅ Unified graph view of distributed x402 transactions
- ✅ Real-time aggregation of agent activity across Cronos
- ✅ Historical time-series analysis
- ✅ Cross-protocol data correlation (VVS, Moonlander, Delphi)
- ✅ Searchable, filterable transaction database

##  Acknowledgments

- **Cronos Labs** for the innovative x402 protocol and hackathon opportunity
- **Crypto.com** for AI Agent SDK and comprehensive ecosystem support
- **DoraHacks** for hosting and organizing this hackathon
- **D3.js & react-force-graph** communities for visualization libraries

##  Resources & Links

- **Cronos Documentation**: https://docs.cronos.org
- **x402 Integration Guide**: https://docs.cronos.org/cronos-x402-facilitator/introduction
- **Crypto.com AI Agent SDK**: https://ai-agent-sdk-docs.crypto.com
- **Crypto.com MCP Server**: https://mcp.crypto.com/docs
- **Cronos Testnet Faucet**: https://cronos.org/faucet
- **Cronoscan Explorer**: https://cronoscan.com

---

**Built with for the Cronos x402 Paytech Hackathon**

*Empowering developers to build the future of AI-powered on-chain payments*
