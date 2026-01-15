import { NextRequest, NextResponse } from 'next/server';
import { fetchTransactions, fetchAgents } from '@/lib/cronos/queries';
import { buildTransactionGraph } from '@/lib/graph/transaction-graph-builder';

/**
 * GET /api/graph
 * Generate transaction graph data for visualization
 * 
 * Query Parameters:
 * - limit: number (default: 200)
 * - agentId: string (filter by specific agent)
 * - instructionType: string
 * - minValue: number
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      limit: parseInt(searchParams.get('limit') || '200'),
      agentId: searchParams.get('agentId') || undefined,
      instructionType: searchParams.get('instructionType') || undefined,
      minValue: searchParams.get('minValue') ? parseFloat(searchParams.get('minValue')!) : undefined,
    };

    // Fetch data
    const transactions = await fetchTransactions({ limit: params.limit });
    const agents = await fetchAgents();

    // Apply filters
    let filtered = transactions;
    
    if (params.agentId) {
      filtered = filtered.filter(tx => tx.agentId === params.agentId);
    }

    if (params.instructionType) {
      filtered = filtered.filter(tx => tx.instructionType === params.instructionType);
    }

    if (params.minValue !== undefined) {
      filtered = filtered.filter(tx => parseFloat(tx.value) >= params.minValue!);
    }

    // Build graph
    const graphData = buildTransactionGraph(filtered, agents);

    return NextResponse.json({
      success: true,
      data: graphData,
      stats: {
        nodes: graphData.nodes.length,
        edges: graphData.edges.length,
        transactions: filtered.length,
        agents: agents.length,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        filters: params,
      },
    });
  } catch (error) {
    console.error('Error generating graph:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate graph',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
