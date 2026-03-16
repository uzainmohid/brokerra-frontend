'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  changeLabel?: string
  highlight?: boolean
  delay?: number
}

function KpiCard({ title, value, subtitle, change, changeLabel, highlight, delay = 0 }: KpiCardProps) {
  const positive = change !== undefined && change > 0
  const negative = change !== undefined && change < 0
  const neutral  = change !== undefined && change === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        'relative bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border rounded-2xl px-5 py-4 overflow-hidden',
        highlight
          ? 'border-emerald-500/25 shadow-[0_0_30px_rgba(16,185,129,0.08)]'
          : 'border-white/8'
      )}
    >
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      )}
      <div className="text-xs text-white/35 mb-2">{title}</div>
      <div className={cn(
        'text-2xl font-bold mb-1',
        highlight ? 'text-emerald-400' : 'text-white'
      )}>
        {value}
      </div>
      {subtitle && <div className="text-xs text-white/30">{subtitle}</div>}
      {change !== undefined && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs font-medium',
          positive ? 'text-emerald-400' : negative ? 'text-red-400' : 'text-white/30'
        )}>
          {positive ? <TrendingUp className="w-3 h-3" />
            : negative ? <TrendingDown className="w-3 h-3" />
            : <Minus className="w-3 h-3" />}
          {positive ? '+' : ''}{change}% {changeLabel || 'vs last month'}
        </div>
      )}
    </motion.div>
  )
}

export function AnalyticsKpiRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Total Revenue Generated"
        value={formatCurrency(32400000)}
        subtitle="Brokerage commissions this quarter"
        change={24}
        highlight
        delay={0}
      />
      <KpiCard
        title="Avg Time to Close"
        value="18 days"
        subtitle="From first contact to deal close"
        change={-12}
        changeLabel="faster vs last month"
        delay={0.06}
      />
      <KpiCard
        title="Lead Response Rate"
        value="94.2%"
        subtitle="Leads contacted within 24hrs"
        change={3}
        delay={0.12}
      />
      <KpiCard
        title="Pipeline Coverage"
        value="4.8×"
        subtitle="Pipeline value vs monthly target"
        change={8}
        delay={0.18}
      />
    </div>
  )
}
