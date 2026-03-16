'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { ChartCard, CustomTooltip } from '@/components/analytics/chart-card'
import { ConversionFunnelData } from '@/types'

const FALLBACK: ConversionFunnelData[] = [
  { stage: 'New', count: 284, percentage: 100 },
  { stage: 'Contacted', count: 198, percentage: 70 },
  { stage: 'Follow-up', count: 142, percentage: 50 },
  { stage: 'Site Visit', count: 89, percentage: 31 },
  { stage: 'Negotiation', count: 54, percentage: 19 },
  { stage: 'Closed', count: 34, percentage: 12 },
]

const STAGE_COLORS = [
  '#3b82f6', '#a855f7', '#f59e0b',
  '#f97316', '#ec4899', '#10b981',
]

interface ConversionFunnelChartProps {
  data?: ConversionFunnelData[]
}

export function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  const chartData = data ?? FALLBACK

  return (
    <ChartCard
      title="Conversion Funnel"
      description="How leads flow through your pipeline stages"
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="stage"
            tick={{ fill: 'rgba(255,255,255,0.50)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload?.map(p => ({
                  name: 'Leads',
                  value: p.value as number,
                  color: p.payload.fill,
                }))}
                label={label}
              />
            )}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={18}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STAGE_COLORS[index % STAGE_COLORS.length]}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Conversion rate callout */}
      <div className="mt-3 flex items-center justify-between bg-white/3 border border-white/6 rounded-xl px-4 py-2.5">
        <span className="text-xs text-white/40">Overall conversion rate</span>
        <span className="text-sm font-bold text-emerald-400">
          {((chartData[chartData.length - 1]?.count / chartData[0]?.count) * 100).toFixed(1)}%
        </span>
      </div>
    </ChartCard>
  )
}
