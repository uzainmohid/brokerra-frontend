'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { ChartCard, CustomTooltip } from '@/components/analytics/chart-card'
import { formatCurrency } from '@/utils'

const FALLBACK = [
  { month: 'Oct', potential: 18500000, actual: 3900000 },
  { month: 'Nov', potential: 24200000, actual: 7200000 },
  { month: 'Dec', potential: 19800000, actual: 5500000 },
  { month: 'Jan', potential: 31000000, actual: 9100000 },
  { month: 'Feb', potential: 28700000, actual: 10400000 },
  { month: 'Mar', potential: 36400000, actual: 12800000 },
]

export function RevenuePotentialChart() {
  return (
    <ChartCard
      title="Revenue Potential"
      description="Pipeline value vs realised brokerage"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={FALLBACK} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload?.map(p => ({ name: p.name as string, value: p.value as number, color: p.color as string }))}
                label={label}
                formatter={formatCurrency}
              />
            )}
          />
          <Bar dataKey="potential" name="Pipeline value" fill="rgba(99,102,241,0.35)" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="actual" name="Realised" fill="#10b981" fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-indigo-500/40" />
          <span className="text-xs text-white/40">Pipeline value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/85" />
          <span className="text-xs text-white/40">Realised brokerage</span>
        </div>
      </div>
    </ChartCard>
  )
}
