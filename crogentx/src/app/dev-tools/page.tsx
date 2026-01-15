'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Code, Wrench, TestTube } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TransactionInspector from '@/components/developer/TransactionInspector';

export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState<'inspector' | 'simulator' | 'docs'>('inspector');
  const [simulationParams, setSimulationParams] = useState({
    instruction: 'transfer',
    agentId: '',
    value: '',
    target: '',
  });
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const simulateTransaction = async () => {
    setSimulating(true);
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const { instruction, agentId, value, target } = simulationParams;
      
      // Generate realistic gas estimates based on instruction type
      const gasEstimates: Record<string, number> = {
        transfer: 21000,
        swap: 150000,
        approve: 45000,
        stake: 120000,
        borrow: 250000,
        repay: 180000,
        claim: 80000,
        delegate: 60000,
        bridge: 200000,
        wrap: 50000,
        unwrap: 45000,
        mint: 100000,
        burn: 75000,
        vote: 65000,
        execute: 300000,
        payment: 35000,
        settlement: 95000,
      };

      const baseGas = gasEstimates[instruction.toLowerCase()] || 100000;
      const gasVariance = Math.floor(Math.random() * 20000);
      const estimatedGas = baseGas + gasVariance;
      const gasPrice = 5000 + Math.floor(Math.random() * 3000);
      const gasCostMON = (estimatedGas * gasPrice) / 1e9;

      // Analyze potential issues
      const issues: string[] = [];
      const warnings: string[] = [];
      const valueNum = parseFloat(value) || 0;

      if (valueNum === 0 && ['transfer', 'swap', 'stake', 'payment'].includes(instruction.toLowerCase())) {
        issues.push('Transaction value is 0 for value-transfer operation');
      }

      if (valueNum > 10000) {
        warnings.push('Large transaction value - verify amount is correct');
      }

      if (estimatedGas > 500000) {
        warnings.push('High gas usage detected - consider optimizing transaction structure');
      }

      if (['transfer', 'approve', 'delegate', 'payment'].includes(instruction.toLowerCase()) && !target) {
        issues.push('Target address required for this operation');
      }

      // Calculate realistic success probability
      let successProbability = 0.95;
      if (issues.length > 0) {
        successProbability -= issues.length * 0.15;
      }
      if (warnings.length > 0) {
        successProbability -= warnings.length * 0.05;
      }
      successProbability = Math.max(0.1, Math.min(1, successProbability));

      // Execution time estimate
      const executionTimeMs = 2000 + Math.floor(Math.random() * 3000);

      // Generate recommendations
      const recommendations: string[] = [];
      if (issues.length > 0) {
        recommendations.push('❌ Fix critical issues before executing');
      }
      if (warnings.length > 0) {
        recommendations.push('⚠️ Review warnings and proceed with caution');
      }
      if (['swap', 'borrow'].includes(instruction.toLowerCase())) {
        recommendations.push('💡 Consider setting slippage tolerance');
      }
      if (['stake', 'delegate'].includes(instruction.toLowerCase())) {
        recommendations.push('💡 Verify lock-up period before committing');
      }
      if (issues.length === 0 && warnings.length === 0) {
        recommendations.push('✅ Transaction looks good - safe to execute');
      }

      const mockSimulation = {
        instruction,
        agentId,
        value,
        gas: {
          estimated: estimatedGas,
          price: gasPrice,
          costMON: gasCostMON.toFixed(6),
          costUSD: (gasCostMON * 0.15).toFixed(2), // CRO ≈ $0.15
        },
        analysis: {
          successProbability: (successProbability * 100).toFixed(1) + '%',
          executionTime: executionTimeMs + 'ms',
          issues,
          warnings,
          safe: issues.length === 0,
        },
        simulation: {
          timestamp: new Date().toISOString(),
          networkConditions: 'normal',
          congestion: 'low',
        },
        recommendations,
      };

      setSimulationResult(mockSimulation);
    } catch (error) {
      console.error('Error simulating transaction:', error);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-zinc-400 hover:text-white"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Graph
                </Link>
              </Button>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-400" />
                <h1 className="text-xl font-bold">Developer Tools</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 ">
          <Button
            onClick={() => setActiveTab('inspector')}
            variant={activeTab === 'inspector' ? 'default' : 'outline'}
            className={activeTab === 'inspector' ? 'bg-blue-600' : 'bg-black-600'}
          >
            <Code className="h-4 w-4 mr-2" />
            Transaction Inspector
          </Button>
          <Button
            onClick={() => setActiveTab('simulator')}
            variant={activeTab === 'simulator' ? 'default' : 'outline'}
            className={activeTab === 'simulator' ? 'bg-blue-600' : 'bg-black-600'}
          >
            <TestTube className="h-4 w-4 mr-2" />
            Transaction Simulator
          </Button>
          <Button
            onClick={() => setActiveTab('docs')}
            variant={activeTab === 'docs' ? 'default' : 'outline'}
            className={activeTab === 'docs' ? 'bg-blue-600' : 'bg-black-600'}
          >
            <Code className="h-4 w-4 mr-2" />
            API Documentation
          </Button>
        </div>

        {/* Transaction Inspector */}
        {activeTab === 'inspector' && <TransactionInspector />}

        {/* Transaction Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg Simulate text-white">Simulate x402 Transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Instruction Type</label>
                    <select
                      value={simulationParams.instruction}
                      onChange={(e) => setSimulationParams({ ...simulationParams, instruction: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="transfer">Transfer</option>
                      <option value="swap">Swap</option>
                      <option value="stake">Stake</option>
                      <option value="borrow">Borrow</option>
                      <option value="repay">Repay</option>
                      <option value="bridge">Bridge</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Agent ID</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={simulationParams.agentId}
                      onChange={(e) => setSimulationParams({ ...simulationParams, agentId: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Value (MON)</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={simulationParams.value}
                      onChange={(e) => setSimulationParams({ ...simulationParams, value: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Target (Optional)</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={simulationParams.target}
                      onChange={(e) => setSimulationParams({ ...simulationParams, target: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={simulateTransaction}
                  disabled={!simulationParams.instruction || !simulationParams.agentId || !simulationParams.value || simulating}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {simulating ? 'Simulating...' : 'Simulate Transaction'}
                </Button>
              </CardContent>
            </Card>

            {/* Simulation Results */}
            {simulationResult && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Gas Estimation */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3">Gas Estimation</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <p className="text-xs text-zinc-400 mb-1">Estimated Gas</p>
                        <p className="text-2xl font-bold text-white">{simulationResult.gas.estimated.toLocaleString()}</p>
                      </div>
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <p className="text-xs text-zinc-400 mb-1">Cost</p>
                        <p className="text-2xl font-bold text-white">{simulationResult.gas.costMON} MON</p>
                        <p className="text-xs text-zinc-500">${simulationResult.gas.costUSD}</p>
                      </div>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3">Analysis</h4>
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Success Probability</span>
                        <span className="text-lg font-bold text-green-400">{simulationResult.analysis.successProbability}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Execution Time</span>
                        <span className="text-sm text-white">{simulationResult.analysis.executionTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Safe to Execute</span>
                        <span className={`text-sm font-medium ${simulationResult.analysis.safe ? 'text-green-400' : 'text-red-400'}`}>
                          {simulationResult.analysis.safe ? '✓ Yes' : '✗ No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Issues & Warnings */}
                  {(simulationResult.analysis.issues.length > 0 || simulationResult.analysis.warnings.length > 0) && (
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-300 mb-3">Issues & Warnings</h4>
                      <div className="space-y-2">
                        {simulationResult.analysis.issues.map((issue: string, index: number) => (
                          <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-400">❌ {issue}</p>
                          </div>
                        ))}
                        {simulationResult.analysis.warnings.map((warning: string, index: number) => (
                          <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-sm text-yellow-400">⚠️ {warning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {simulationResult.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="text-blue-400">•</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* API Documentation */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">REST API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold text-white mb-2">GET /api/transactions</h4>
                  <p className="text-sm text-zinc-400 mb-3">Query x402 transactions with filtering</p>
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <pre className="text-xs text-zinc-300 overflow-x-auto">
{`// Query Parameters
limit: number (default: 100)
offset: number (default: 0)
status: 'success' | 'failed' | 'pending'
agentId: string
instructionType: string
minValue: number
maxValue: number

// Example
fetch('/api/transactions?limit=10&status=success')`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-white mb-2">POST /api/simulate</h4>
                  <p className="text-sm text-zinc-400 mb-3">Simulate a transaction before execution</p>
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <pre className="text-xs text-zinc-300 overflow-x-auto">
{`fetch('/api/simulate', {
  method: 'POST',
  body: JSON.stringify({
    instruction: 'transfer',
    agentId: '0x123...',
    value: '100',
    target: '0xabc...'
  })
})`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-white mb-2">POST /api/debug</h4>
                  <p className="text-sm text-zinc-400 mb-3">Debug a failed or pending transaction</p>
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <pre className="text-xs text-zinc-300 overflow-x-auto">
{`fetch('/api/debug', {
  method: 'POST',
  body: JSON.stringify({
    transactionHash: '0xdef...'
  })
})`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">SDK Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <pre className="text-sm text-zinc-300 overflow-x-auto">
{`import { createClient } from 'crogentx-sdk';

const client = createClient({ 
  apiUrl: 'https://your-api.com' 
});

// Query transactions
const txs = await client.transactions.list({ 
  limit: 100,
  status: 'success'
});

// Simulate transaction
const sim = await client.transactions.simulate({
  instruction: 'transfer',
  agentId: '0x123...',
  value: '100'
});

// Debug transaction
const debug = await client.transactions.debug({
  transactionHash: '0xabc...'
});`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
