'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { AnalyticsKpiRow } from '@/components/analytics/analytics-kpi-row'
import { LeadSourceChart } from '@/components/dashboard/lead-source-chart'
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart'
import { ConversionFunnelChart } from '@/components/dashboard/conversion-funnel-chart'
import { RevenuePotentialChart } from '@/components/dashboard/revenue-potential-chart'
import { ActivityHeatmap } from '@/components/analytics/activity-heatmap'
import { LeadVelocityChart } from '@/components/analytics/lead-velocity-chart'
import { SourceConversionRadar } from '@/components/analytics/source-conversion-radar'
import { BrokerLeaderboard } from '@/components/analytics/broker-leaderboard'
import { ExportPanel } from '@/components/analytics/export-panel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { analyticsApi, leadsApi } from '@/lib/api'
import { AnalyticsData, Lead } from '@/types'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const PERIOD_OPTIONS = [
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y',  label: 'Last 12 months' },
]

export default function AnalyticsPage() {
  const [analytics, setAnalytics]   = useState<AnalyticsData | null>(null)
  const [leads, setLeads]           = useState<Lead[]>([])
  const [period, setPeriod]         = useState('30d')
  const [loading, setLoading]       = useState(false)

  const fetchAll = useCallback(async (showToast = false) => {
    setLoading(true)
    try {
      // Fetch analytics + raw leads in parallel — both are needed
      const [analyticsData, leadsRes] = await Promise.allSettled([
        analyticsApi.getAnalytics(),
        leadsApi.getLeads({ limit: 500 }),
      ])

      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value)
      if (leadsRes.status === 'fulfilled') {
        const raw = leadsRes.value
        const arr: Lead[] = Array.isArray(raw) ? raw : (raw.data ?? [])
        setLeads(arr)
      }
      if (showToast) toast.success('Analytics refreshed')
    } catch {
      if (showToast) toast.error('Failed to refresh analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll, period])

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Analytics"
        subtitle="Performance insights across your entire pipeline"
        action={
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAll(true)}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        }
      />

      <ScrollArea className="flex-1">
        <div className="px-8 py-6 space-y-6 pb-12">

          {/* ── KPI row — passes real analytics + raw leads ───────── */}
          <AnalyticsKpiRow analytics={analytics} leads={leads} />

          {/* ── Primary charts ────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <MonthlyTrendChart data={analytics?.monthlyTrend} />
            </div>
            <LeadSourceChart data={analytics?.leadsBySource} />
          </div>

          {/* ── Secondary charts ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ConversionFunnelChart data={analytics?.conversionFunnel} />
            <RevenuePotentialChart />
          </div>

          {/* ── Tertiary charts ───────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <LeadVelocityChart />
            <SourceConversionRadar />
            {/* Pass real analytics broker data if available */}
            <BrokerLeaderboard brokers={analytics?.topPerformingBrokers} />
          </div>

          {/* ── Activity heatmap ──────────────────────────────────── */}
          <ActivityHeatmap />

          {/* ── Export panel — passes raw leads for client-side CSV ─ */}
          <ExportPanel leads={leads} analytics={analytics} />

        </div>
      </ScrollArea>
    </PageTransition>
  )
}
