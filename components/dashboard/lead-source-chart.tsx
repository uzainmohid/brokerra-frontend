'use client'

import React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend,
} from 'recharts'
import { ChartCard, CustomTooltip } from '@/components/analytics/chart-card'
import { LeadSourceData } from '@/types'
import { getSourceColor, getSourceLabel } from '@/utils'

const FALLBACK: LeadSourceData[] = [
  { source: 'whatsapp', count: 87, percentage: 31, color: '#25d366' },
  { source: 'referral', count: 62, percentage: 22, color: '#10b981' },
  { source: 'property-portal', count: 54, percentage: 19, color: '#f59e0b' },
  { source: 'instagram', count: 38, percentage: 13, color: '#e1306c' },
  { source: 'website', count: 24, percentage: 8, color: '#6366f1' },
  { source: 'other', count: 19, percentage: 7, color: '#6b7280' },
]

interface LeadSourceChartProps {
  data?: LeadSourceData[]
}

const RADIAN = Math.PI / 180
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number
}) {
  if (percent < 0.07) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="rgba(255,255,255,0.85)" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function LeadSourceChart({ data }: LeadSourceChartProps) {
  const chartData = (data ?? FALLBACK).map(d => ({
    name: getSourceLabel(d.source as Parameters<typeof getSourceLabel>[0]),
    value: d.count,
    color: d.color || getSourceColor(d.source as Parameters<typeof getSourceColor>[0]),
  }))

  return (
    <ChartCard title="Leads by Source" description="Where your leads are coming from">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <CustomTooltip
                active={active}
                payload={payload?.map(p => ({ name: p.name as string, value: p.value as number, color: p.payload.color }))}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
        {chartData.map(item => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-white/50 truncate">{item.name}</span>
            <span className="text-xs font-semibold text-white/70 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
