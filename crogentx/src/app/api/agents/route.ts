import { NextRequest, NextResponse } from 'next/server';
import { fetchAgents } from '@/lib/cronos/queries';

/**
 * GET /api/agents
 * Query AI agents on Cronos x402
 * 
 * Query Parameters:
 * - limit: number (default: 50)
 * - type: string (agent type filter)
 * - minBalance: number
 * - active: boolean (only active agents)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      limit: parseInt(searchParams.get('limit') || '50'),
      type: searchParams.get('type') || undefined,
      minBalance: searchParams.get('minBalance') ? parseFloat(searchParams.get('minBalance')!) : undefined,
      active: searchParams.get('active') === 'true' ? true : undefined,
    };

    const agents = await fetchAgents();

    let filtered = agents;

    if (params.type) {
      filtered = filtered.filter(agent => agent.type === params.type);
    }

    if (params.minBalance !== undefined) {
      filtered = filtered.filter(agent => parseFloat(agent.totalVolume) >= params.minBalance!);
    }

    if (params.active) {
      filtered = filtered.filter(agent => agent.isActive === true);
    }

    const limited = filtered.slice(0, params.limit);

    return NextResponse.json({
      success: true,
      data: limited,
      count: limited.length,
      total: filtered.length,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch agents',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
