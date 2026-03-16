'use client'

import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { ChartCard, CustomTooltip } from '@/components/analytics/chart-card'
import { MonthlyTrendData } from '@/types'

const FALLBACK: MonthlyTrendData[] = [
  { month: 'Aug', leads: 42, closed: 6, revenue: 3200000 },
  { month: 'Sep', leads: 58, closed: 9, revenue: 4800000 },
  { month: 'Oct', leads: 51, closed: 7, revenue: 3900000 },
  { month: 'Nov', leads: 74, closed: 13, revenue: 7200000 },
  { month: 'Dec', leads: 63, closed: 10, revenue: 5500000 },
  { month: 'Jan', leads: 89, closed: 16, revenue: 9100000 },
  { month: 'Feb', leads: 95, closed: 18, revenue: 10400000 },
  { month: 'Mar', leads: 112, closed: 22, revenue: 12800000 },
]

interface MonthlyTrendChartProps {
  data?: MonthlyTrendData[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data ?? FALLBACK

  return (
    <ChartCard
      title="Monthly Lead Trend"
      description="Leads captured vs deals closed over time"
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload?.map(p => ({
                  name: p.name as string,
                  value: p.value as number,
                  color: p.color as string,
                }))}
                label={label}
              />
            )}
          />
          <Area
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#leadsGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="closed"
            name="Closed"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#closedGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-emerald-400 rounded" />
          <span className="text-xs text-white/40">Leads captured</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-indigo-400 rounded" />
          <span className="text-xs text-white/40">Deals closed</span>
        </div>
      </div>
    </ChartCard>
  )
}
