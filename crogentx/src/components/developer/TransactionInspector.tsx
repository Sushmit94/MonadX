'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Copy, Check, ExternalLink } from 'lucide-react';
import { X402Transaction } from '@/lib/cronos/types';
import { TX_EXPLORER_URL } from '@/lib/cronos/client';
export default function TransactionInspector() {
  const [txHash, setTxHash] = useState('');
  const [transaction, setTransaction] = useState<X402Transaction | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inspectTransaction = async () => {
    if (!txHash) return;

    setLoading(true);
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Generate realistic transaction data based on hash
      const hashNum = parseInt(txHash.slice(2, 10), 16) || Date.now();
      const statuses = ['success', 'failed', 'pending'] as const;
      const instructions = ['payment', 'swap', 'stake', 'settlement', 'cross_chain_bridge'] as const;
      const status = statuses[hashNum % 3];
      const instruction = instructions[hashNum % 5];
      
      const mockTransaction: X402Transaction = {
        id: txHash,
        txHash: txHash,
        blockNumber: 8500000 + (hashNum % 10000),
        blockTimestamp: Date.now() / 1000 - (hashNum % 86400),
        from: `0x${hashNum.toString(16).padStart(40, '0')}`,
        to: `0x${(hashNum * 7).toString(16).padStart(40, '0')}`,
        value: ((hashNum % 1000) + 10).toString(),
        gasUsed: (21000 + (hashNum % 200000)).toString(),
        gasPrice: (5000 + (hashNum % 5000)).toString(),
        status: status,
        instructionType: instruction,
        agentId: `0x${(hashNum * 3).toString(16).padStart(40, '0')}`,
        agentName: `Agent #${hashNum % 999}`,
      };

      const mockDebugInfo = generateDebugInfo(mockTransaction, hashNum);

      setTransaction(mockTransaction);
      setDebugInfo(mockDebugInfo);
    } catch (error) {
      console.error('Error inspecting transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDebugInfo = (tx: X402Transaction, seed: number) => {
    const issues: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> = [];
    const trace: Array<{ step: string; status: string; details: string }> = [];

    if (tx.status === 'failed') {
      issues.push({
        severity: 'critical',
        message: 'Transaction execution reverted - insufficient funds or invalid instruction',
      });
      
      if (parseInt(tx.gasUsed) > 300000) {
        issues.push({
          severity: 'warning',
          message: 'High gas usage detected - consider optimizing transaction structure',
        });
      }

      trace.push({
        step: '1. Transaction submitted',
        status: 'success',
        details: `Block #${tx.blockNumber}`,
      });
      trace.push({
        step: '2. Gas estimation',
        status: 'success',
        details: `Estimated: ${tx.gasUsed} gas`,
      });
      trace.push({
        step: '3. Execution',
        status: 'failed',
        details: 'Execution reverted: out of gas or invalid state',
      });
    } else if (tx.status === 'pending') {
      issues.push({
        severity: 'info',
        message: 'Transaction is pending network confirmation',
      });
      
      trace.push({
        step: '1. Transaction submitted',
        status: 'success',
        details: 'Broadcasted to network',
      });
      trace.push({
        step: '2. Mempool',
        status: 'pending',
        details: 'Waiting for miner inclusion',
      });
    } else {
      trace.push({
        step: '1. Transaction submitted',
        status: 'success',
        details: `Block #${tx.blockNumber}`,
      });
      trace.push({
        step: '2. Gas used',
        status: 'success',
        details: `${tx.gasUsed} gas`,
      });
      trace.push({
        step: '3. Execution',
        status: 'success',
        details: `${tx.instructionType} completed successfully`,
      });
      trace.push({
        step: '4. Settlement',
        status: 'success',
        details: 'Funds settled to destination',
      });
    }

    const gasUsed = parseInt(tx.gasUsed);
    let efficiency = 'optimal';
    const suggestions: string[] = [];

    if (gasUsed > 500000) {
      efficiency = 'poor';
      suggestions.push('Consider breaking transaction into smaller operations');
    } else if (gasUsed > 300000) {
      efficiency = 'fair';
      suggestions.push('Gas usage is moderate - optimization possible');
    } else {
      suggestions.push('Gas usage is optimal for this operation type');
    }

    const recommendations: string[] = [];
    if (tx.status === 'failed') {
      recommendations.push('Review transaction parameters and agent balance');
      recommendations.push('Check target contract is correct and active');
      recommendations.push('Verify agent has sufficient permissions');
    } else if (tx.status === 'pending') {
      recommendations.push('Wait for network confirmation (typically 1-2 blocks)');
      recommendations.push('Check transaction status on Monadexplorer');
    } else {
      recommendations.push('Transaction executed successfully');
      recommendations.push('Gas usage was efficient for this operation');
    }

    return {
      status: tx.status,
      issues,
      trace,
      gas: {
        used: gasUsed,
        price: parseInt(tx.gasPrice),
        total: gasUsed * parseInt(tx.gasPrice),
        efficiency,
        suggestions,
      },
      value: {
        amount: parseFloat(tx.value),
        instructionType: tx.instructionType,
        warnings: [],
      },
      recommendations,
      timestamp: new Date().toISOString(),
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter transaction hash (0x...)"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={inspectTransaction}
              disabled={!txHash || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Inspecting...' : 'Inspect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      {transaction && debugInfo && (
        <>
          {/* Basic Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-white font-mono">{transaction.txHash.slice(0, 20)}...</code>
                    <button onClick={() => copyToClipboard(transaction.txHash)}>
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    transaction.status === 'success' ? 'bg-green-500/20 text-green-400' :
                    transaction.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {transaction.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 mb-1">Block Number</p>
                  <p className="text-sm text-white">{transaction.blockNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 mb-1">Instruction Type</p>
                  <p className="text-sm text-white">{transaction.instructionType}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 mb-1">Value</p>
                  <p className="text-sm text-white">{transaction.value} MON</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 mb-1">Gas Used</p>
                  <p className="text-sm text-white">{transaction.gasUsed}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(`${TX_EXPLORER_URL}/${transaction.txHash}`
, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Cronoscan
              </Button>
            </CardContent>
          </Card>

          {/* Debug Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Issues */}
              {debugInfo.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2">Issues</h4>
                  <div className="space-y-2">
                    {debugInfo.issues.map((issue: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          issue.severity === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
                          issue.severity === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                          'bg-blue-500/10 border border-blue-500/20'
                        }`}
                      >
                        <p className="text-sm text-white">{issue.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Trace */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-2">Execution Trace</h4>
                <div className="space-y-2">
                  {debugInfo.trace.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <span className={`text-lg ${
                        step.status === 'success' ? 'text-green-400' :
                        step.status === 'failed' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {step.status === 'success' ? '✓' : step.status === 'failed' ? '✗' : '⋯'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{step.step}</p>
                        <p className="text-xs text-zinc-400 mt-1">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gas Analysis */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-2">Gas Analysis</h4>
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Gas Used</span>
                    <span className="text-sm text-white font-mono">{debugInfo.gas.used}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Gas Price</span>
                    <span className="text-sm text-white font-mono">{debugInfo.gas.price} Gwei</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Efficiency</span>
                    <span className={`text-sm font-medium ${
                      debugInfo.gas.efficiency === 'optimal' ? 'text-green-400' :
                      debugInfo.gas.efficiency === 'fair' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {debugInfo.gas.efficiency.toUpperCase()}
                    </span>
                  </div>
                  {debugInfo.gas.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                      <p className="text-xs text-zinc-400 mb-2">Suggestions:</p>
                      {debugInfo.gas.suggestions.map((suggestion: string, index: number) => (
                        <p key={index} className="text-xs text-zinc-300">• {suggestion}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {debugInfo.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {debugInfo.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="text-blue-400">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
