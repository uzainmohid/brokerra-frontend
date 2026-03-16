'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { ChartCard, CustomTooltip } from './chart-card'

const DATA = [
  { week: 'W1 Aug', leads: 8 },
  { week: 'W2 Aug', leads: 12 },
  { week: 'W3 Aug', leads: 9 },
  { week: 'W4 Aug', leads: 14 },
  { week: 'W1 Sep', leads: 11 },
  { week: 'W2 Sep', leads: 18 },
  { week: 'W3 Sep', leads: 15 },
  { week: 'W4 Sep', leads: 20 },
  { week: 'W1 Oct', leads: 13 },
  { week: 'W2 Oct', leads: 16 },
  { week: 'W3 Oct', leads: 22 },
  { week: 'W4 Oct', leads: 19 },
  { week: 'W1 Nov', leads: 24 },
  { week: 'W2 Nov', leads: 28 },
  { week: 'W3 Nov', leads: 21 },
  { week: 'W4 Nov', leads: 31 },
]

const AVG = Math.round(DATA.reduce((s, d) => s + d.leads, 0) / DATA.length)

export function LeadVelocityChart() {
  return (
    <ChartCard title="Lead Velocity" description="New leads captured per week">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine
            y={AVG}
            stroke="rgba(16,185,129,0.4)"
            strokeDasharray="4 4"
            label={{ value: `Avg ${AVG}`, fill: 'rgba(16,185,129,0.6)', fontSize: 10, position: 'right' }}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip active={active} payload={payload?.map(p => ({ name: 'Leads', value: p.value as number, color: '#10b981' }))} label={label} />
            )}
          />
          <Bar
            dataKey="leads"
            name="Leads"
            fill="url(#velocityGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          />
          <defs>
            <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.5} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
