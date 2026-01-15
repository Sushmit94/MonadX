#!/usr/bin/env node

/**
 * CrogentX CLI Tool
 * 
 * Usage:
 *   crogentx transactions --limit 10
 *   crogentx agents --type payment
 *   crogentx simulate --instruction transfer --value 100 --agent 0x123...
 *   crogentx debug --tx 0xabc...
 */

import { program } from 'commander';
import { CrogentXClient } from '../src/lib/sdk/crogentx-client';

// Initialize client
const API_URL = process.env.CROGENTX_API_URL || 'http://localhost:3000';
const client = new CrogentXClient({ apiUrl: API_URL });

program
  .name('crogentx')
  .description('CLI tool for CrogentX - Cronos x402 Transaction Analytics')
  .version('1.0.0');

// Transactions command
program
  .command('transactions')
  .alias('tx')
  .description('Query x402 transactions')
  .option('-l, --limit <number>', 'Number of transactions to fetch', '10')
  .option('-s, --status <status>', 'Filter by status (success|failed|pending)')
  .option('-a, --agent <agentId>', 'Filter by agent ID')
  .option('-i, --instruction <type>', 'Filter by instruction type')
  .option('--min-value <number>', 'Minimum transaction value')
  .option('--max-value <number>', 'Maximum transaction value')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const result = await client.transactions.list({
        limit: parseInt(options.limit),
        status: options.status,
        agentId: options.agent,
        instructionType: options.instruction,
        minValue: options.minValue ? parseFloat(options.minValue) : undefined,
        maxValue: options.maxValue ? parseFloat(options.maxValue) : undefined,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`\n✅ Found ${result.data.length} transactions:\n`);
        result.data.forEach((tx: any, index: number) => {
          console.log(`${index + 1}. ${tx.transactionHash.slice(0, 10)}...`);
          console.log(`   Status: ${tx.status}`);
          console.log(`   Type: ${tx.instructionType}`);
          console.log(`   Value: ${tx.value} CRO`);
          console.log(`   Agent: ${tx.agentName || 'Unknown'}`);
          console.log(`   Gas: ${tx.gasUsed}\n`);
        });
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Agents command
program
  .command('agents')
  .description('Query AI agents')
  .option('-l, --limit <number>', 'Number of agents to fetch', '10')
  .option('-t, --type <type>', 'Filter by agent type')
  .option('--active', 'Only show active agents')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const result = await client.agents.list({
        limit: parseInt(options.limit),
        type: options.type,
        active: options.active,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`\n✅ Found ${result.data.length} agents:\n`);
        result.data.forEach((agent: any, index: number) => {
          console.log(`${index + 1}. ${agent.name}`);
          console.log(`   Address: ${agent.address}`);
          console.log(`   Type: ${agent.type}`);
          console.log(`   Balance: ${agent.balance} CRO`);
          console.log(`   Status: ${agent.status}\n`);
        });
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Simulate command
program
  .command('simulate')
  .description('Simulate an x402 transaction')
  .requiredOption('-i, --instruction <type>', 'Instruction type (transfer, swap, etc.)')
  .requiredOption('-a, --agent <agentId>', 'Agent ID')
  .requiredOption('-v, --value <amount>', 'Transaction value in CRO')
  .option('-t, --target <address>', 'Target address')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const result = await client.transactions.simulate({
        instruction: options.instruction,
        agentId: options.agent,
        value: options.value,
        target: options.target,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        const sim = result.simulation;
        console.log('\n📊 Simulation Results:\n');
        console.log(`Instruction: ${sim.instruction}`);
        console.log(`Agent: ${sim.agentId}`);
        console.log(`Value: ${sim.value} CRO\n`);
        
        console.log('⛽ Gas Estimation:');
        console.log(`  Estimated Gas: ${sim.gas.estimated}`);
        console.log(`  Gas Price: ${sim.gas.price} Gwei`);
        console.log(`  Total Cost: ${sim.gas.costCRO} CRO ($${sim.gas.costUSD})\n`);
        
        console.log('📈 Analysis:');
        console.log(`  Success Probability: ${sim.analysis.successProbability}`);
        console.log(`  Execution Time: ${sim.analysis.executionTime}`);
        console.log(`  Safe to Execute: ${sim.analysis.safe ? '✅ Yes' : '❌ No'}\n`);
        
        if (sim.analysis.issues.length > 0) {
          console.log('❌ Issues:');
          sim.analysis.issues.forEach((issue: string) => console.log(`  - ${issue}`));
          console.log();
        }
        
        if (sim.analysis.warnings.length > 0) {
          console.log('⚠️  Warnings:');
          sim.analysis.warnings.forEach((warning: string) => console.log(`  - ${warning}`));
          console.log();
        }
        
        console.log('💡 Recommendations:');
        sim.recommendations.forEach((rec: string) => console.log(`  ${rec}`));
        console.log();
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Debug command
program
  .command('debug')
  .description('Debug a transaction')
  .requiredOption('-t, --tx <hash>', 'Transaction hash')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const result = await client.transactions.debug({
        transactionHash: options.tx,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        const debug = result.debug;
        console.log('\n🔍 Debug Information:\n');
        console.log(`Transaction: ${options.tx}`);
        console.log(`Status: ${debug.status}\n`);
        
        if (debug.issues.length > 0) {
          console.log('⚠️  Issues:');
          debug.issues.forEach((issue: any) => {
            console.log(`  [${issue.severity.toUpperCase()}] ${issue.message}`);
          });
          console.log();
        }
        
        console.log('📝 Execution Trace:');
        debug.trace.forEach((step: any) => {
          const icon = step.status === 'success' ? '✅' : step.status === 'failed' ? '❌' : '⏳';
          console.log(`  ${icon} ${step.step}`);
          console.log(`     ${step.details}`);
        });
        console.log();
        
        console.log('⛽ Gas Analysis:');
        console.log(`  Used: ${debug.gas.used}`);
        console.log(`  Efficiency: ${debug.gas.efficiency}`);
        if (debug.gas.suggestions.length > 0) {
          debug.gas.suggestions.forEach((s: string) => console.log(`  💡 ${s}`));
        }
        console.log();
        
        console.log('💡 Recommendations:');
        debug.recommendations.forEach((rec: string) => console.log(`  - ${rec}`));
        console.log();
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Stats command
program
  .command('stats')
  .description('Get transaction statistics')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const stats = await client.analytics.stats();

      if (options.json) {
        console.log(JSON.stringify(stats, null, 2));
      } else {
        console.log('\n📊 CrogentX Statistics:\n');
        console.log(`Total Transactions: ${stats.totalTransactions}`);
        console.log(`Successful: ${stats.successfulTransactions}`);
        console.log(`Failed: ${stats.failedTransactions}`);
        console.log(`Success Rate: ${stats.successRate.toFixed(2)}%\n`);
        console.log(`Total Volume: ${stats.totalVolume} CRO`);
        console.log(`Avg Transaction: ${stats.avgTransactionValue} CRO\n`);
        console.log(`Total Agents: ${stats.totalAgents}`);
        console.log(`Active Agents: ${stats.activeAgents}\n`);
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Leaderboard command
program
  .command('leaderboard')
  .description('Show top agents by transaction count')
  .option('-l, --limit <number>', 'Number of agents to show', '10')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const leaderboard = await client.analytics.leaderboard(parseInt(options.limit));

      if (options.json) {
        console.log(JSON.stringify(leaderboard, null, 2));
      } else {
        console.log('\n🏆 Top Agents:\n');
        leaderboard.forEach((agent: any, index: number) => {
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
          console.log(`${medal} ${agent.name}`);
          console.log(`   Transactions: ${agent.count}`);
          console.log(`   Volume: ${agent.volume.toFixed(2)} CRO\n`);
        });
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
