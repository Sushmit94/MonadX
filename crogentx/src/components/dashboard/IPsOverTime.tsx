'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface IPsOverTimeProps {
  txOverTime: { date: string; count: number }[];
}

export default function IPsOverTime({ txOverTime }: IPsOverTimeProps) {
  // Calculate cumulative and format for chart
  let cumulative = 0;
  const chartData = txOverTime.slice(-30).map(item => {
    cumulative += item.count;
    return {
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      daily: item.count,
      total: cumulative,
    };
  });

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Transactions Over Time</CardTitle>
      </CardHeader>
      <CardContent>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis 
              dataKey="date" 
              stroke="#a1a1aa"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#a1a1aa"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#a1a1aa' }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTotal)"
              name="Total Transactions"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          No timeline data available
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-zinc-800/50 p-3 rounded-lg">
          <p className="text-xs text-zinc-400 mb-1">Daily Average</p>
          <p className="text-xl font-bold text-white">
            {chartData.length > 0 ? (chartData.reduce((sum, d) => sum + d.daily, 0) / chartData.length).toFixed(1) : '0'}
          </p>
        </div>
        <div className="bg-zinc-800/50 p-3 rounded-lg">
          <p className="text-xs text-zinc-400 mb-1">Peak Day</p>
          <p className="text-xl font-bold text-white">
            {chartData.length > 0 ? Math.max(...chartData.map(d => d.daily)) : '0'}
          </p>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
