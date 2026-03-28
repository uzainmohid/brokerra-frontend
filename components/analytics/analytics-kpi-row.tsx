'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { AnalyticsData, Lead } from '@/types'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  changeLabel?: string
  highlight?: boolean
  delay?: number
  loading?: boolean
}

function KpiCard({ title, value, subtitle, change, changeLabel, highlight, delay = 0, loading }: KpiCardProps) {
  const positive = change !== undefined && change > 0
  const negative = change !== undefined && change < 0

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

      {loading ? (
        <div className="h-8 w-28 bg-white/8 rounded animate-pulse mb-1" />
      ) : (
        <div className={cn('text-2xl font-bold mb-1', highlight ? 'text-emerald-400' : 'text-white')}>
          {value}
        </div>
      )}

      {subtitle && <div className="text-xs text-white/30">{subtitle}</div>}

      {change !== undefined && !loading && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs font-medium',
          positive ? 'text-emerald-400' : negative ? 'text-red-400' : 'text-white/30'
        )}>
          {positive
            ? <TrendingUp className="w-3 h-3" />
            : negative
            ? <TrendingDown className="w-3 h-3" />
            : <Minus className="w-3 h-3" />}
          {positive ? '+' : ''}{change}% {changeLabel || 'vs last month'}
        </div>
      )}
    </motion.div>
  )
}

interface AnalyticsKpiRowProps {
  analytics: AnalyticsData | null
  leads: Lead[]
}

export function AnalyticsKpiRow({ analytics, leads }: AnalyticsKpiRowProps) {
  const loading = !analytics && leads.length === 0

  // ── Derive real metrics from leads + analytics ──────────────────────────
  const totalLeads      = leads.length || analytics?.overview?.totalLeads || 0
  const closedLeads     = leads.filter(l => l.status === 'closed').length
  const totalPipeline   = leads.reduce((s, l) => s + (l.budget || 0), 0)
                          || analytics?.overview?.totalRevenuePotential || 0
  const conversionRate  = totalLeads > 0
                          ? Math.round((closedLeads / totalLeads) * 100 * 10) / 10
                          : analytics?.overview?.conversionRate || 0
  const avgDeal         = closedLeads > 0
                          ? leads.filter(l => l.status === 'closed')
                                 .reduce((s, l) => s + (l.budget || 0), 0) / closedLeads
                          : analytics?.overview?.avgDealValue || 0

  // Pipeline coverage: pipeline value / avg deal as a rough multiple
  const coverage        = avgDeal > 0 ? Math.round((totalPipeline / avgDeal) * 10) / 10 : 0

  const changeTotal     = analytics?.overview?.changeFromLastMonth?.totalLeads
  const changeConv      = analytics?.overview?.changeFromLastMonth?.conversionRate

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Total Pipeline Value"
        value={formatCurrency(totalPipeline)}
        subtitle={`${totalLeads} active leads`}
        change={changeTotal}
        highlight
        delay={0}
        loading={loading}
      />
      <KpiCard
        title="Conversion Rate"
        value={`${conversionRate}%`}
        subtitle={`${closedLeads} deals closed`}
        change={changeConv}
        delay={0.06}
        loading={loading}
      />
      <KpiCard
        title="Avg Deal Value"
        value={avgDeal > 0 ? formatCurrency(avgDeal) : '—'}
        subtitle="Per closed deal"
        delay={0.12}
        loading={loading}
      />
      <KpiCard
        title="Pipeline Coverage"
        value={coverage > 0 ? `${coverage}×` : '—'}
        subtitle="Pipeline ÷ avg deal size"
        delay={0.18}
        loading={loading}
      />
    </div>
  )
}
