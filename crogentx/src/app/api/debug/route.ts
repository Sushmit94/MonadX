import { NextRequest, NextResponse } from 'next/server';
import { fetchTransactions } from '@/lib/cronos/queries';

/**
 * POST /api/debug
 * Debug failed or pending transactions
 * 
 * Request Body:
 * {
 *   transactionHash: string
 * }
 * 
 * Returns detailed debugging information
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionHash } = body;

    if (!transactionHash) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction hash required',
        },
        { status: 400 }
      );
    }

    // Fetch transaction
    const transactions = await fetchTransactions({ limit: 1000 });
    const tx = transactions.find(t => t.txHash === transactionHash);

    if (!tx) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction not found',
        },
        { status: 404 }
      );
    }

    // Perform detailed analysis
    const debugInfo = analyzeTransaction(tx);

    return NextResponse.json({
      success: true,
      transaction: tx,
      debug: debugInfo,
    });
  } catch (error) {
    console.error('Error debugging transaction:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Debug failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function analyzeTransaction(tx: any) {
  const issues: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> = [];
  const trace: Array<{ step: string; status: string; details: string }> = [];

  // Status analysis
  if (tx.status === 'failed') {
    issues.push({
      severity: 'critical',
      message: 'Transaction failed - check error details below',
    });

    // Common failure reasons
    if (parseFloat(tx.gasUsed) > 500000) {
      issues.push({
        severity: 'warning',
        message: 'High gas usage may indicate inefficient execution',
      });
    }

    // Trace failure
    trace.push({
      step: '1. Transaction submitted',
      status: 'success',
      details: `Submitted to network at block ${tx.blockNumber}`,
    });

    trace.push({
      step: '2. Gas estimation',
      status: 'success',
      details: `Estimated gas: ${tx.gasUsed}`,
    });

    trace.push({
      step: '3. Execution',
      status: 'failed',
      details: tx.metadata?.errorMessage || 'Execution reverted',
    });
  } else if (tx.status === 'pending') {
    issues.push({
      severity: 'info',
      message: 'Transaction is pending confirmation',
    });

    trace.push({
      step: '1. Transaction submitted',
      status: 'success',
      details: 'Waiting for network confirmation',
    });

    trace.push({
      step: '2. Mempool',
      status: 'pending',
      details: 'Transaction in mempool',
    });
  } else {
    // Success
    trace.push({
      step: '1. Transaction submitted',
      status: 'success',
      details: `Block ${tx.blockNumber}`,
    });

    trace.push({
      step: '2. Gas used',
      status: 'success',
      details: `${tx.gasUsed} gas`,
    });

    trace.push({
      step: '3. Execution',
      status: 'success',
      details: 'Transaction executed successfully',
    });

    if (tx.metadata?.settlement) {
      trace.push({
        step: '4. Settlement',
        status: 'success',
        details: `Settled: ${tx.metadata.settlement}`,
      });
    }
  }

  // Gas analysis
  const gasEfficiency = analyzeGasEfficiency(tx);
  
  // Value analysis
  const valueAnalysis = analyzeValue(tx);

  return {
    status: tx.status,
    issues,
    trace,
    gas: gasEfficiency,
    value: valueAnalysis,
    recommendations: generateDebugRecommendations(tx, issues),
    timestamp: new Date().toISOString(),
  };
}

function analyzeGasEfficiency(tx: any) {
  const gasUsed = parseFloat(tx.gasUsed);
  const gasPrice = parseFloat(tx.gasPrice);
  
  let efficiency = 'optimal';
  const suggestions: string[] = [];

  if (gasUsed > 500000) {
    efficiency = 'poor';
    suggestions.push('Consider breaking transaction into smaller operations');
  } else if (gasUsed > 300000) {
    efficiency = 'fair';
    suggestions.push('Gas usage is moderate - optimization possible');
  }

  if (gasPrice > 10000) {
    suggestions.push('High gas price - consider waiting for lower network congestion');
  }

  return {
    used: gasUsed,
    price: gasPrice,
    total: gasUsed * gasPrice,
    efficiency,
    suggestions,
  };
}

function analyzeValue(tx: any) {
  const value = parseFloat(tx.value);
  const warnings: string[] = [];

  if (value === 0 && ['transfer', 'payment'].includes(tx.instructionType)) {
    warnings.push('Zero value transfer - verify if intentional');
  }

  if (value > 10000) {
    warnings.push('Large value transfer - double check recipient');
  }

  return {
    amount: value,
    instructionType: tx.instructionType,
    warnings,
  };
}

function generateDebugRecommendations(tx: any, issues: any[]) {
  const recommendations: string[] = [];

  if (tx.status === 'failed') {
    recommendations.push('Review transaction parameters and try again');
    recommendations.push('Check agent balance and permissions');
    recommendations.push('Verify target contract is correct');
  }

  if (tx.status === 'pending') {
    recommendations.push('Wait for network confirmation (typically 1-2 blocks)');
    recommendations.push('Check transaction status on Monad Explorer');
  }

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    recommendations.push('Address critical issues before retrying');
  }

  return recommendations;
}
