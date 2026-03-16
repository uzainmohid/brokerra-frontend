'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Brain, RefreshCw, AlertTriangle, TrendingUp,
  Target, Activity, Sparkles, Shield, Zap,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { AiInsightCard } from '@/components/ai-agent/ai-insight-card'
import { AiPriorityList } from '@/components/ai-agent/ai-priority-list'
import { Button } from '@/components/ui/button'
import { aiAgentApi } from '@/lib/api'
import { formatCurrency } from '@/utils'
import {
  InsightsResponse,
  PrioritiesResponse,
  PipelineHealth,
} from '@/types'
import { cn } from '@/lib/utils'

type Tab = 'insights' | 'priorities' | 'health'

function healthColor(score: number) {
  if (score >= 75) return { text: 'text-emerald-400', stroke: 'stroke-emerald-500', label: 'Excellent', bar: 'bg-emerald-500' }
  if (score >= 50) return { text: 'text-amber-400',   stroke: 'stroke-amber-500',   label: 'Moderate',  bar: 'bg-amber-500' }
  return               { text: 'text-red-400',         stroke: 'stroke-red-500',     label: 'Critical',  bar: 'bg-red-500' }
}

const STAGE_LABEL: Record<string, string> = {
  NEW: 'New', CONTACTED: 'Contacted', FOLLOW_UP: 'Follow Up',
  SITE_VISIT: 'Site Visit', NEGOTIATION: 'Negotiation',
  CLOSED: 'Closed', LOST: 'Lost',
}

const STAGE_COLOR: Record<string, string> = {
  NEW: 'bg-blue-500', CONTACTED: 'bg-purple-500', FOLLOW_UP: 'bg-amber-500',
  SITE_VISIT: 'bg-orange-500', NEGOTIATION: 'bg-pink-500',
  CLOSED: 'bg-emerald-500', LOST: 'bg-gray-500',
}

export default function AiAgentPage() {
  const [activeTab, setActiveTab]   = useState<Tab>('insights')
  const [loading, setLoading]       = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [insights, setInsights]     = useState<InsightsResponse | null>(null)
  const [priorities, setPriorities] = useState<PrioritiesResponse | null>(null)
  const [health, setHealth]         = useState<PipelineHealth | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const [ins, pri, hlt] = await Promise.all([
        aiAgentApi.getInsights(),
        aiAgentApi.getPriorities(),
        aiAgentApi.getPipelineHealth(),
      ])
      setInsights(ins)
      setPriorities(pri)
      setHealth(hlt)
      setLastUpdated(new Date())
    } catch { /* silent */ }
    finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const criticalCount = insights?.critical ?? 0
  const highCount     = insights?.high ?? 0

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="AI Deal Agent"
        subtitle="Your AI-powered pipeline intelligence engine"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(true)}
            disabled={refreshing}
            className="gap-1.5"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
            Refresh
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-5">

        {/* ── KPI summary bar ───────────────────────────────────────── */}
        {!loading && health && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                label:   'Pipeline Health',
                value:   `${health.healthScore}/100`,
                sub:     healthColor(health.healthScore).label,
                icon:    Activity,
                color:   healthColor(health.healthScore).text,
                bg:      'bg-white/[0.03]',
                border:  'border-white/8',
              },
              {
                label:   'Critical Alerts',
                value:   String(criticalCount + highCount),
                sub:     `${criticalCount} critical · ${highCount} high`,
                icon:    AlertTriangle,
                color:   criticalCount > 0 ? 'text-red-400' : 'text-white/50',
                bg:      criticalCount > 0 ? 'bg-red-500/6' : 'bg-white/[0.03]',
                border:  criticalCount > 0 ? 'border-red-500/15' : 'border-white/8',
              },
              {
                label:   'Win Rate',
                value:   `${health.winRate}%`,
                sub:     'Closed ÷ resolved',
                icon:    Shield,
                color:   'text-emerald-400',
                bg:      'bg-white/[0.03]',
                border:  'border-white/8',
              },
              {
                label:   'Revenue Forecast',
                value:   formatCurrency(health.forecastRevenue),
                sub:     'Weighted pipeline',
                icon:    TrendingUp,
                color:   'text-emerald-400',
                bg:      'bg-white/[0.03]',
                border:  'border-white/8',
              },
            ].map(({ label, value, sub, icon: Icon, color, bg, border }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn('rounded-2xl border p-4', bg, border)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn('w-4 h-4', color)} />
                  <span className="text-[11px] text-white/35">{label}</span>
                </div>
                <p className={cn('text-2xl font-bold tabular-nums', color)}>{value}</p>
                <p className="text-[11px] text-white/25 mt-0.5">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Agent narrative banner ────────────────────────────────── */}
        {!loading && health && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 bg-[rgba(16,185,129,0.06)] border border-emerald-500/15 rounded-2xl px-5 py-4"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-[0_2px_12px_rgba(16,185,129,0.35)] mt-0.5">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">AI Analysis</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm text-white/75 leading-relaxed">{health.agentMessage}</p>
            </div>
          </motion.div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/6 rounded-xl p-1">
          {([
            { id: 'insights',   label: 'AI Insights',  icon: Sparkles, badge: insights?.total },
            { id: 'priorities', label: 'Priorities',   icon: Target,   badge: priorities?.total },
            { id: 'health',     label: 'Pipeline Health', icon: Activity, badge: null },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150',
                activeTab === tab.id
                  ? 'bg-white/8 text-white shadow-sm'
                  : 'text-white/35 hover:text-white/60',
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.badge != null && tab.badge > 0 && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  activeTab === tab.id ? 'bg-emerald-500/25 text-emerald-400' : 'bg-white/8 text-white/35',
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ──────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-28 bg-white/4 rounded-xl animate-pulse border border-white/6" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'insights' && insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.insights.length === 0 ? (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center">
                    <Zap className="w-10 h-10 text-emerald-500/30 mb-3" />
                    <p className="text-white/40">All leads are healthy</p>
                    <p className="text-[12px] text-white/20 mt-1">No immediate actions needed right now</p>
                  </div>
                ) : (
                  insights.insights.map((insight, i) => (
                    <AiInsightCard key={`${insight.lead.id}-${i}`} insight={insight} index={i} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'priorities' && priorities && (
              <div className="max-w-2xl">
                <p className="text-[11px] text-white/25 mb-3">
                  Ranked by urgency and conversion probability — these leads need your attention today.
                </p>
                <AiPriorityList priorities={priorities.priorities} />
              </div>
            )}

            {activeTab === 'health' && health && (
              <PipelineHealthView health={health} />
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}

// ── Pipeline health full view ─────────────────────────────────────────────────

function PipelineHealthView({ health }: { health: PipelineHealth }) {
  const hc = healthColor(health.healthScore)
  const r  = 44
  const circumference = 2 * Math.PI * r
  const offset = circumference - (health.healthScore / 100) * circumference

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Health score gauge */}
      <div className="bg-[rgba(10,18,40,0.6)] border border-white/8 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="48" cy="48" r={r} fill="none"
              className={hc.stroke}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={cn('text-3xl font-bold tabular-nums', hc.text)}>{health.healthScore}</span>
            <span className="text-[10px] text-white/30">/ 100</span>
          </div>
        </div>
        <div className="text-center">
          <p className={cn('text-lg font-bold', hc.text)}>{hc.label}</p>
          <p className="text-[11px] text-white/30 mt-0.5">Pipeline Health Score</p>
        </div>

        {health.bottleneck && (
          <div className="w-full bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-center">
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1">Bottleneck Detected</p>
            <p className="text-[12px] text-white/60">
              {health.bottleneck.stalledCount} leads stalled in{' '}
              <strong className="text-amber-300">{STAGE_LABEL[health.bottleneck.stage] || health.bottleneck.stage}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Stage breakdown */}
      <div className="lg:col-span-2 bg-[rgba(10,18,40,0.6)] border border-white/8 rounded-2xl p-5">
        <p className="text-[11px] text-white/30 uppercase tracking-wider mb-4">Stage-by-Stage Breakdown</p>
        <div className="space-y-4">
          {health.stageBreakdown
            .filter(s => s.count > 0)
            .map(stage => {
              const pct = health.totalLeads > 0 ? (stage.count / health.totalLeads) * 100 : 0
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', STAGE_COLOR[stage.stage] || 'bg-white/20')} />
                      <span className="text-[12px] font-semibold text-white/80">
                        {STAGE_LABEL[stage.stage] || stage.stage}
                      </span>
                      <span className="text-[10px] text-white/30 tabular-nums">{stage.count} leads</span>
                      {stage.stalledCount > 0 && (
                        <span className="text-[9px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-full">
                          {stage.stalledCount} stalled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {stage.totalBudget > 0 && (
                        <span className="text-[11px] text-emerald-400 tabular-nums font-medium">
                          {formatCurrency(stage.totalBudget)}
                        </span>
                      )}
                      <span className="text-[11px] text-white/35 tabular-nums w-8 text-right">
                        {stage.avgConversionPct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', STAGE_COLOR[stage.stage] || 'bg-white/20')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
