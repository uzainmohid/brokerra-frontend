'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, TrendingUp, AlertTriangle, RefreshCw,
  Activity, Target, Shield, ChevronRight,
  Brain, Sparkles,
} from 'lucide-react'
import { AiInsightCard } from './ai-insight-card'
import { AiPriorityList } from './ai-priority-list'
import {
  InsightsResponse,
  PrioritiesResponse,
  PipelineHealth,
} from '@/types'
import { aiAgentApi } from '@/lib/api'
import { formatCurrency } from '@/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Tab = 'insights' | 'priorities' | 'health'

// ── Health score colour ───────────────────────────────────────────────────────
function healthColor(score: number) {
  if (score >= 75) return { text: 'text-emerald-400', ring: 'stroke-emerald-500', bg: 'bg-emerald-500' }
  if (score >= 50) return { text: 'text-amber-400',   ring: 'stroke-amber-500',   bg: 'bg-amber-500' }
  return               { text: 'text-red-400',         ring: 'stroke-red-500',     bg: 'bg-red-500' }
}

// ── Circular health gauge ─────────────────────────────────────────────────────
function HealthGauge({ score }: { score: number }) {
  const { text, ring } = healthColor(score)
  const r = 28
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          className={ring}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className={cn('absolute text-[15px] font-bold tabular-nums', text)}>
        {score}
      </span>
    </div>
  )
}

// ── Stage name map ────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────

export function AiAgentPanel() {
  const [activeTab, setActiveTab]       = useState<Tab>('insights')
  const [loading, setLoading]           = useState(true)
  const [refreshing, setRefreshing]     = useState(false)
  const [insights, setInsights]         = useState<InsightsResponse | null>(null)
  const [priorities, setPriorities]     = useState<PrioritiesResponse | null>(null)
  const [health, setHealth]             = useState<PipelineHealth | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
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
      setLastRefreshed(new Date())
    } catch {
      // Silently degrade — panel stays in loading state or shows cached data
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const criticalCount = insights?.critical || 0
  const highCount     = insights?.high     || 0
  const totalAlerts   = criticalCount + highCount

  return (
    <div className="flex flex-col h-full bg-[rgba(10,18,40,0.65)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">

      {/* ── Panel header ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-white/6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_2px_12px_rgba(16,185,129,0.4)]">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-none">
                AI Deal Agent
              </h2>
              <p className="text-[10px] text-white/30 mt-0.5 leading-none">
                Actively analysing your pipeline
              </p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-1 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-emerald-400 font-medium uppercase tracking-wider">Live</span>
            </div>
          </div>

          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Refresh insights"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-white/40', refreshing && 'animate-spin')} />
          </button>
        </div>

        {/* Alert summary */}
        {!loading && totalAlerts > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2.5 flex items-center gap-2 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span className="text-[11px] text-red-300">
              {criticalCount > 0 && <><strong>{criticalCount} critical</strong> action{criticalCount > 1 ? 's' : ''}</>}
              {criticalCount > 0 && highCount > 0 && ' + '}
              {highCount > 0 && <>{highCount} high-priority</>}
              {' '}alert{totalAlerts > 1 ? 's' : ''} detected
            </span>
          </motion.div>
        )}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex border-b border-white/6">
        {([
          { id: 'insights',   label: 'Insights',   icon: Sparkles, badge: insights?.total },
          { id: 'priorities', label: 'Priorities',  icon: Target,   badge: priorities?.total },
          { id: 'health',     label: 'Pipeline',    icon: Activity, badge: null },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold',
              'transition-all duration-150 relative',
              activeTab === tab.id
                ? 'text-white/90'
                : 'text-white/35 hover:text-white/60',
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className={cn(
                'text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center',
                activeTab === tab.id ? 'bg-emerald-500/25 text-emerald-400' : 'bg-white/10 text-white/40',
              )}>
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4
        [&::-webkit-scrollbar]:w-[3px]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white/10
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'insights' && insights && (
                <InsightsTab insights={insights} />
              )}
              {activeTab === 'priorities' && priorities && (
                <PrioritiesTab priorities={priorities} />
              )}
              {activeTab === 'health' && health && (
                <HealthTab health={health} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-white/20">
          Updated {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <Link
          href="/ai-agent"
          className="flex items-center gap-1 text-[10px] text-emerald-400/70 hover:text-emerald-400 transition-colors"
        >
          Full agent view <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

// ── Tab content components ────────────────────────────────────────────────────

function InsightsTab({ insights }: { insights: InsightsResponse }) {
  if (!insights.insights.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Zap className="w-8 h-8 text-emerald-500/30 mb-3" />
        <p className="text-sm text-white/40">Pipeline looks healthy</p>
        <p className="text-[11px] text-white/20 mt-1">No immediate actions needed</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {insights.insights.slice(0, 8).map((insight, i) => (
        <AiInsightCard key={`${insight.lead.id}-${i}`} insight={insight} index={i} />
      ))}
      {insights.total > 8 && (
        <Link
          href="/ai-agent"
          className="flex items-center justify-center gap-1.5 py-2.5 text-[11px] text-emerald-400/70 hover:text-emerald-400 transition-colors"
        >
          View {insights.total - 8} more insights <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  )
}

function PrioritiesTab({ priorities }: { priorities: PrioritiesResponse }) {
  return <AiPriorityList priorities={priorities.priorities} />
}

function HealthTab({ health }: { health: PipelineHealth }) {
  const hc = healthColor(health.healthScore)

  return (
    <div className="space-y-4">
      {/* Health score */}
      <div className="flex items-center gap-4 bg-white/[0.03] border border-white/6 rounded-xl p-4">
        <HealthGauge score={health.healthScore} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-white/35 mb-0.5">Pipeline Health</p>
          <p className={cn('text-[13px] font-semibold leading-snug', hc.text)}>
            {health.healthScore >= 75 ? 'Excellent' : health.healthScore >= 50 ? 'Moderate' : 'Needs Attention'}
          </p>
          <p className="text-[11px] text-white/45 mt-1 leading-relaxed">
            {health.agentMessage}
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: 'Win Rate',       value: `${health.winRate}%`,               icon: Shield,   color: 'text-emerald-400' },
          { label: 'Overdue',        value: String(health.overdueCount),         icon: AlertTriangle, color: health.overdueCount > 0 ? 'text-red-400' : 'text-white/50' },
          { label: 'Forecast',       value: formatCurrency(health.forecastRevenue), icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Active Deals',   value: String(health.openCount),            icon: Activity, color: 'text-white/70' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/[0.03] border border-white/6 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className={cn('w-3.5 h-3.5', color)} />
              <span className="text-[10px] text-white/30">{label}</span>
            </div>
            <span className={cn('text-[15px] font-bold tabular-nums', color)}>{value}</span>
          </div>
        ))}
      </div>

      {/* Bottleneck */}
      {health.bottleneck && (
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold text-amber-300">Pipeline Bottleneck</span>
          </div>
          <p className="text-[11px] text-white/50">
            <strong className="text-white/70">{health.bottleneck.stalledCount} leads</strong> stalled in{' '}
            <strong className="text-amber-400">{STAGE_LABEL[health.bottleneck.stage] || health.bottleneck.stage}</strong>.
            {' '}Re-engage to unlock pipeline flow.
          </p>
        </div>
      )}

      {/* Stage breakdown mini-chart */}
      <div>
        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Stage Distribution</p>
        <div className="space-y-1.5">
          {health.stageBreakdown
            .filter(s => !['CLOSED', 'LOST'].includes(s.stage) && s.count > 0)
            .map(stage => (
              <div key={stage.stage} className="flex items-center gap-2.5">
                <span className="text-[10px] text-white/35 w-20 flex-shrink-0">
                  {STAGE_LABEL[stage.stage] || stage.stage}
                </span>
                <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', STAGE_COLOR[stage.stage] || 'bg-white/20')}
                    style={{ width: `${Math.min((stage.count / (health.openCount || 1)) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/40 tabular-nums w-4 text-right flex-shrink-0">
                  {stage.count}
                </span>
                {stage.stalledCount > 0 && (
                  <span className="text-[9px] text-amber-400 tabular-nums flex-shrink-0">
                    {stage.stalledCount} stalled
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-[88px] bg-white/4 rounded-xl border border-white/6" />
      ))}
    </div>
  )
}
