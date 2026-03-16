'use client'

import React, { useEffect, useState } from 'react'
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
import { analyticsApi } from '@/lib/api'
import { AnalyticsData } from '@/types'
import { RefreshCw, Download } from 'lucide-react'
import { toast } from 'sonner'

const PERIOD_OPTIONS = [
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y',  label: 'Last 12 months' },
]

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('30d')
  const [loading, setLoading] = useState(false)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const data = await analyticsApi.getAnalytics()
      setAnalytics(data)
    } catch {
      // graceful fallback — child components use their own mock data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAnalytics() }, [period])

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Analytics"
        subtitle="Performance insights across your entire pipeline"
        action={
          <div className="flex items-center gap-2">
            {/* Period selector */}
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
              onClick={fetchAnalytics}
              className="gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        }
      />

      <ScrollArea className="flex-1">
        <div className="px-8 py-6 space-y-6 pb-12">

          {/* ── KPI row ──────────────────────────────────────────── */}
          <AnalyticsKpiRow />

          {/* ── Primary charts ───────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <MonthlyTrendChart data={analytics?.monthlyTrend} />
            </div>
            <LeadSourceChart data={analytics?.leadsBySource} />
          </div>

          {/* ── Secondary charts ─────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ConversionFunnelChart data={analytics?.conversionFunnel} />
            <RevenuePotentialChart />
          </div>

          {/* ── Tertiary charts ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <LeadVelocityChart />
            <SourceConversionRadar />
            <BrokerLeaderboard />
          </div>

          {/* ── Activity heatmap ─────────────────────────────────── */}
          <ActivityHeatmap />

          {/* ── Export panel ─────────────────────────────────────── */}
          <ExportPanel />

        </div>
      </ScrollArea>
    </PageTransition>
  )
}
