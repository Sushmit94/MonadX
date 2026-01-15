# MonagentX

**Professional Developer Toolkit for Monad x402 — Transaction Visualization, Debugging & Analytics**

MonagentX is a comprehensive developer platform for building, debugging, and monitoring AI agents on **Monad EVM** using the **x402 protocol**. It provides real-time visualization, transaction simulation, performance analytics, and a full REST API + SDK to power agent-native, pay-per-use applications.

Built for the **Monad x402 Ecosystem & Agentic Commerce Stack**.

![Monad](https://img.shields.io/badge/Monad-EVM-purple)
![x402](https://img.shields.io/badge/x402-Protocol-cyan)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Features

### 🔍 Visual Analytics Engine
- **Interactive Force-Directed Graph**  
  Real-time visualization of AI agent payment flows on Monad (agent → transaction → contract → wallet)
- **Multi-Node Types**  
  Distinct visual entities for agents, transactions, smart contracts, and wallets
- **Live x402 Monitoring**  
  Fetches and displays x402-facilitated transactions from Monad (testnet & mainnet)
- **Transaction Details Panel**  
  Inspect x402 instructions, execution status, value transferred, and gas metrics
- **Smart Highlighting**  
  Hover-based graph traversal to trace multi-step agent payment pipelines
- **Batch & Pipeline Detection**  
  Automatically identifies batched micropayments and settlement chains
- **High-FPS Rendering**  
  Optimized for Monad’s high-throughput transaction volume

---

### 🧠 Advanced Filtering & Search
- Smart search by transaction hash, agent ID, or wallet
- x402 instruction-type filters (payment, swap, settlement, liquidity, NFT)
- Agent category filters (market makers, API brokers, autonomous services)
- Status filters (success / failed / pending)
- Value range filters (MON)
- Batch & multi-step pipeline focus
- Protocol-level filtering

---

### 📊 Analytics Dashboard
- Transaction count, success rate, MON volume
- Top agents by throughput and gas efficiency
- x402 instruction distribution
- Category analysis (payments, DeFi, NFTs, infra)
- Time-series analytics
- Gas usage trends
- Network health metrics

---

## 🧰 Developer Toolkit

### REST API
- `GET /api/transactions` — Query x402 transactions
- `GET /api/agents` — List detected AI agents
- `GET /api/graph` — Graph-ready transaction data
- `POST /api/simulate` — Pre-execution simulation
- `POST /api/debug` — Debug failed or pending transactions

---

### TypeScript SDK
```ts
import { createClient } from 'monagentx';

const client = createClient({ apiUrl: 'https://your-api.com' });

const txs = await client.transactions.list({ limit: 100 });
const simulation = await client.transactions.simulate({
  instruction: 'payment',
  value: 1.2
});
