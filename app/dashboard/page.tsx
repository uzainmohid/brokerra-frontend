'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, Flame, Clock, Calendar, TrendingUp, Plus } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { StatCard } from '@/components/dashboard/stat-card'
import { LeadSourceChart } from '@/components/dashboard/lead-source-chart'
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart'
import { ConversionFunnelChart } from '@/components/dashboard/conversion-funnel-chart'
import { RevenuePotentialChart } from '@/components/dashboard/revenue-potential-chart'
import { TodayFollowUps } from '@/components/dashboard/today-followups'
import { RecentLeads } from '@/components/dashboard/recent-leads'
import { AiAgentPanel } from '@/components/ai-agent/ai-agent-panel'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { analyticsApi, leadsApi } from '@/lib/api'
import { AnalyticsData, Lead } from '@/types'
import { formatCurrency } from '@/utils'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export default function DashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [leads, setLeads]         = useState<Lead[]>([])
  const [loading, setLoading]     = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      const [analyticsResult, leadsResult] = await Promise.allSettled([
        analyticsApi.getAnalytics(),
        leadsApi.getLeads({ limit: 500 }),
      ])
      if (analyticsResult.status === 'fulfilled') setAnalytics(analyticsResult.value)
      if (leadsResult.status === 'fulfilled') {
        const raw = leadsResult.value
        setLeads(Array.isArray(raw) ? raw : (raw.data ?? []))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Real metrics derived from actual leads data ───────────────────────────
  const totalLeads     = leads.length    || analytics?.overview?.totalLeads     || 0
  const hotLeads       = leads.filter(l => l.temperature === 'hot').length
                         || analytics?.overview?.hotLeads     || 0
  const now            = new Date()
  const todayStart     = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd       = new Date(todayStart.getTime() + 86400000)

  const overdueLeads   = leads.filter(l =>
    l.nextFollowUpAt &&
    new Date(l.nextFollowUpAt) < now &&
    !['closed','lost'].includes(l.status)
  ).length || analytics?.overview?.overdueLeads || 0

  const todayFollowUps = leads.filter(l =>
    l.nextFollowUpAt &&
    new Date(l.nextFollowUpAt) >= todayStart &&
    new Date(l.nextFollowUpAt) < todayEnd
  ).length || analytics?.overview?.todayFollowUps || 0

  const totalPipeline  = leads.reduce((s, l) => s + (l.budget || 0), 0)
                         || analytics?.overview?.totalRevenuePotential || 0

  const closedLeads    = leads.filter(l => l.status === 'closed')
  const closedRevenue  = closedLeads.reduce((s, l) => s + (l.budget || 0), 0)
  const avgDealValue   = closedLeads.length > 0
                         ? closedRevenue / closedLeads.length
                         : analytics?.overview?.avgDealValue || 0

  const conversionRate = totalLeads > 0
                         ? Math.round((closedLeads.length / totalLeads) * 1000) / 10
                         : analytics?.overview?.conversionRate || 0

  // Recent leads — sorted by updatedAt, most recent first
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const changeTotal = analytics?.overview?.changeFromLastMonth?.totalLeads
  const changeHot   = analytics?.overview?.changeFromLastMonth?.hotLeads
  const changeConv  = analytics?.overview?.changeFromLastMonth?.conversionRate

  const greeting = () => {
    const h = now.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title={`${greeting()}, ${user?.name?.split(' ')[0] || 'Broker'} 👋`}
        subtitle={now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        action={
          <div className="flex items-center gap-2">
            <Link href="/leads">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add Lead
              </Button>
            </Link>
          </div>
        }
      />

      <ScrollArea className="flex-1">
        <div className="px-8 py-6 space-y-6 pb-10">

          {/* ── Stat cards — real numbers ─────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Leads"
              value={loading ? '—' : totalLeads}
              change={changeTotal}
              changeLabel="vs last month"
              icon={<Users className="w-5 h-5" />}
              iconColor="text-blue-400"
              iconBg="bg-blue-500/10"
              delay={0}
            />
            <StatCard
              title="Hot Leads 🔥"
              value={loading ? '—' : hotLeads}
              change={changeHot}
              changeLabel="vs last month"
              icon={<Flame className="w-5 h-5" />}
              iconColor="text-red-400"
              iconBg="bg-red-500/10"
              delay={0.08}
              glow
            />
            <StatCard
              title="Overdue Follow-ups"
              value={loading ? '—' : overdueLeads}
              icon={<Clock className="w-5 h-5" />}
              iconColor="text-amber-400"
              iconBg="bg-amber-500/10"
              delay={0.16}
            />
            <StatCard
              title="Today's Follow-ups"
              value={loading ? '—' : todayFollowUps}
              icon={<Calendar className="w-5 h-5" />}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10"
              delay={0.24}
            />
          </div>

          {/* ── Revenue banner — real pipeline values ─────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="relative bg-gradient-to-r from-emerald-900/30 via-[rgba(15,26,53,0.5)] to-[rgba(15,26,53,0.3)] border border-emerald-500/15 rounded-2xl px-6 py-4 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-emerald-500/5 to-transparent" />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Total Pipeline Value</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? '—' : formatCurrency(totalPipeline)}
                  </p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-white/8" />
                <div className="hidden sm:block">
                  <p className="text-xs text-white/40 mb-0.5">Avg Deal Value</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {loading ? '—' : avgDealValue > 0 ? formatCurrency(avgDealValue) : '—'}
                  </p>
                </div>
                <div className="hidden md:block w-px h-10 bg-white/8" />
                <div className="hidden md:block">
                  <p className="text-xs text-white/40 mb-0.5">Conversion Rate</p>
                  <p className="text-xl font-bold text-white flex items-center gap-1.5">
                    {loading ? '—' : `${conversionRate}%`}
                    {!loading && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                  </p>
                </div>
              </div>
              <Link href="/analytics">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Full Analytics
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* ── Charts — connected to analytics API ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <MonthlyTrendChart data={analytics?.monthlyTrend} />
            </div>
            <LeadSourceChart data={analytics?.leadsBySource} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ConversionFunnelChart data={analytics?.conversionFunnel} />
            <RevenuePotentialChart />
          </div>

          {/* ── Follow-ups + AI agent ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3">
              {/* Pass real leads so followups can be computed from nextFollowUpAt */}
              <TodayFollowUps leads={leads} />
            </div>
            <div className="lg:col-span-2 min-h-[520px]">
              {/* AiAgentPanel fetches its own data from /api/ai-agent/* */}
              <AiAgentPanel />
            </div>
          </div>

          {/* ── Recent leads — sorted real data ───────────────────── */}
          <RecentLeads
            leads={recentLeads}
            isLoading={loading && leads.length === 0}
          />

        </div>
      </ScrollArea>
    </PageTransition>
  )
}
