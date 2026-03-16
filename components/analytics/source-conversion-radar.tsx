'use client'

import React from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { ChartCard, CustomTooltip } from './chart-card'

const DATA = [
  { subject: 'WhatsApp', A: 88 },
  { subject: 'Referral', A: 76 },
  { subject: 'Instagram', A: 62 },
  { subject: 'Portal', A: 54 },
  { subject: 'Website', A: 48 },
  { subject: 'Cold Call', A: 38 },
]

export function SourceConversionRadar() {
  return (
    <ChartCard title="Conversion by Source" description="Close rate % per lead source">
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.40)', fontSize: 11 }}
          />
          <Radar
            name="Conversion %"
            dataKey="A"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload?.map(p => ({ name: 'Conversion', value: p.value as number, color: '#10b981' }))}
                label={label}
                formatter={(v) => `${v}%`}
              />
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
