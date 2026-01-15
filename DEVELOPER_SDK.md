# CrogentX Integration Examples

## Installation

```bash
npm install crogentx
# or
yarn add crogentx
```

## Quick Start

### 1. Using the SDK

```typescript
import { createClient } from 'crogentx';

const client = createClient({ 
  apiUrl: 'https://your-crogentx-instance.com' 
});

// Query transactions
const transactions = await client.transactions.list({ 
  limit: 100,
  status: 'success'
});

console.log(`Found ${transactions.data.length} transactions`);
```

### 2. Filter Transactions

```typescript
// Get failed transactions for a specific agent
const failed = await client.transactions.list({
  status: 'failed',
  agentId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  limit: 50
});

// Get high-value transactions
const highValue = await client.transactions.list({
  minValue: 1000,
  instructionType: 'transfer'
});
```

### 3. Transaction Simulation

```typescript
// Simulate before executing
const simulation = await client.transactions.simulate({
  instruction: 'swap',
  agentId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  value: '500',
  target: '0x1234...'
});

if (simulation.simulation.analysis.safe) {
  console.log('Safe to execute!');
  console.log(`Estimated gas: ${simulation.simulation.gas.estimated}`);
  console.log(`Success probability: ${simulation.simulation.analysis.successProbability}`);
} else {
  console.error('Issues found:', simulation.simulation.analysis.issues);
}
```

### 4. Debug Failed Transactions

```typescript
const debug = await client.transactions.debug({
  transactionHash: '0xabcdef...'
});

console.log('Status:', debug.debug.status);
console.log('Execution trace:', debug.debug.trace);
console.log('Gas efficiency:', debug.debug.gas.efficiency);

// Get recommendations
debug.debug.recommendations.forEach(rec => {
  console.log('💡', rec);
});
```

### 5. Query AI Agents

```typescript
// Get all active agents
const agents = await client.agents.list({ active: true });

// Get specific agent
const agent = await client.agents.get('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

// Get agent's transactions
const agentTxs = await client.agents.transactions(agent.address, 50);
```

### 6. Analytics

```typescript
// Get overall statistics
const stats = await client.analytics.stats();
console.log('Total transactions:', stats.totalTransactions);
console.log('Success rate:', stats.successRate);
console.log('Total volume:', stats.totalVolume);

// Get agent leaderboard
const leaderboard = await client.analytics.leaderboard(10);
leaderboard.forEach((agent, index) => {
  console.log(`${index + 1}. ${agent.name} - ${agent.count} transactions`);
});
```

### 7. Graph Data

```typescript
// Get transaction graph for visualization
const graph = await client.graph.get({
  limit: 200,
  agentId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});

console.log('Nodes:', graph.data.nodes.length);
console.log('Edges:', graph.data.edges.length);

// Use with your visualization library
visualizeGraph(graph.data.nodes, graph.data.edges);
```

## CLI Usage

### Installation

```bash
npm install -g crogentx
```

### Commands

```bash
# Query transactions
crogentx transactions --limit 10 --status success

# Filter by agent
crogentx tx --agent 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# Get agents
crogentx agents --type payment --active

# Simulate transaction
crogentx simulate \
  --instruction transfer \
  --agent 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb \
  --value 100 \
  --target 0x1234...

# Debug transaction
crogentx debug --tx 0xabcdef...

# Get statistics
crogentx stats

# Get leaderboard
crogentx leaderboard --limit 10

# JSON output
crogentx transactions --json > transactions.json
```

## REST API Usage

### GET /api/transactions

```bash
curl "https://your-instance.com/api/transactions?limit=10&status=success"
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 800,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### POST /api/simulate

```bash
curl -X POST https://your-instance.com/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "instruction": "transfer",
    "agentId": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "value": "100"
  }'
```

### POST /api/debug

```bash
curl -X POST https://your-instance.com/api/debug \
  -H "Content-Type: application/json" \
  -d '{
    "transactionHash": "0xabcdef..."
  }'
```

## React Integration

```tsx
import { createClient } from 'crogentx';
import { useState, useEffect } from 'react';

const client = createClient({ apiUrl: 'https://your-instance.com' });

function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await client.transactions.list({ limit: 10 });
      setTransactions(result.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.transactionHash}>
          {tx.instructionType}: {tx.value} CRO
        </div>
      ))}
    </div>
  );
}
```

## Advanced Examples

### Monitor Agent Activity

```typescript
async function monitorAgent(agentId: string) {
  while (true) {
    const txs = await client.agents.transactions(agentId, 1);
    if (txs.data.length > 0) {
      const latest = txs.data[0];
      console.log(`New transaction: ${latest.instructionType} - ${latest.value} CRO`);
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
  }
}
```

### Batch Simulation

```typescript
async function simulateBatch(operations: any[]) {
  const results = await Promise.all(
    operations.map(op => client.transactions.simulate(op))
  );

  const safe = results.every(r => r.simulation.analysis.safe);
  const totalGas = results.reduce((sum, r) => 
    sum + r.simulation.gas.estimated, 0
  );

  return { safe, totalGas, results };
}
```

### Alert on Failed Transactions

```typescript
async function alertOnFailures() {
  const failed = await client.transactions.list({
    status: 'failed',
    limit: 100
  });

  for (const tx of failed.data) {
    const debug = await client.transactions.debug({
      transactionHash: tx.transactionHash
    });

    if (debug.debug.issues.some(i => i.severity === 'critical')) {
      // Send alert
      sendAlert(`Critical failure in ${tx.transactionHash}`);
    }
  }
}
```

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import type { 
  X402Transaction, 
  AIAgent, 
  TransactionQuery,
  SimulateTransactionParams 
} from 'crogentx';

const query: TransactionQuery = {
  limit: 100,
  status: 'success',
  agentId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
};

const params: SimulateTransactionParams = {
  instruction: 'transfer',
  agentId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  value: '100'
};
```

## Error Handling

```typescript
try {
  const result = await client.transactions.list({ limit: 10 });
  console.log(result.data);
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error appropriately
}
```

## Best Practices

1. **Use pagination** for large datasets
2. **Cache results** when appropriate
3. **Simulate before executing** critical transactions
4. **Monitor gas costs** to optimize operations
5. **Debug failures immediately** to identify patterns
6. **Use TypeScript** for better type safety
7. **Handle errors gracefully** with try-catch blocks
8. **Rate limit** your API calls appropriately

## Support

- Documentation: https://your-instance.com/docs
- GitHub: https://github.com/yourusername/crogentx
- Issues: https://github.com/yourusername/crogentx/issues
