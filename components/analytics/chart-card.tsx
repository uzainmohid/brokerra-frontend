'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function ChartCard({ title, description, children, className, action }: ChartCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-0.5">{description}</CardDescription>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}

// Custom tooltip for recharts
export function CustomTooltip({ active, payload, label, formatter }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  formatter?: (value: number) => string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-[rgba(15,26,53,0.98)] backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      {label && <p className="text-xs text-white/40 mb-1.5">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-white/60">{entry.name}:</span>
          <span className="text-xs font-semibold text-white">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
