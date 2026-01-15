import { NextRequest, NextResponse } from 'next/server';
import { fetchTransactions } from '@/lib/cronos/queries';

/**
 * GET /api/transactions
 * Query Cronos x402 transactions with filtering and pagination
 * 
 * Query Parameters:
 * - limit: number (default: 100)
 * - offset: number (default: 0)
 * - status: 'success' | 'failed' | 'pending'
 * - agentId: string
 * - instructionType: string
 * - minValue: number
 * - maxValue: number
 * - startDate: ISO date string
 * - endDate: ISO date string
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const params: any = {
      limit: parseInt(searchParams.get('limit') || '100'),
      offset: parseInt(searchParams.get('offset') || '0'),
      status: searchParams.get('status') as 'success' | 'failed' | 'pending' | undefined,
      agentId: searchParams.get('agentId') || undefined,
      instructionType: searchParams.get('instructionType') || undefined,
      minValue: searchParams.get('minValue') ? parseFloat(searchParams.get('minValue')!) : undefined,
      maxValue: searchParams.get('maxValue') ? parseFloat(searchParams.get('maxValue')!) : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    };

    // Fetch transactions
    const transactions = await fetchTransactions(params);

    // Filter based on parameters
    let filtered = transactions;

    if (params.status) {
      filtered = filtered.filter(tx => tx.status === params.status);
    }

    if (params.agentId) {
      filtered = filtered.filter(tx => tx.agentId === params.agentId);
    }

    if (params.instructionType) {
      filtered = filtered.filter(tx => tx.instructionType === params.instructionType);
    }

    if (params.minValue !== undefined) {
      filtered = filtered.filter(tx => parseFloat(tx.value) >= params.minValue!);
    }

    if (params.maxValue !== undefined) {
      filtered = filtered.filter(tx => parseFloat(tx.value) <= params.maxValue!);
    }

    if (params.startDate) {
      const startTimestamp = new Date(params.startDate).getTime() / 1000;
      filtered = filtered.filter(tx => tx.blockTimestamp >= startTimestamp);
    }

    if (params.endDate) {
      const endTimestamp = new Date(params.endDate).getTime() / 1000;
      filtered = filtered.filter(tx => tx.blockTimestamp <= endTimestamp);
    }

    // Apply pagination
    const paginated = filtered.slice(params.offset, params.offset + params.limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        total: filtered.length,
        limit: params.limit,
        offset: params.offset,
        hasMore: params.offset + params.limit < filtered.length,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        queryParams: params,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
