'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download, FileText, Table2, BarChart3,
  CheckCircle2, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportApi } from '@/lib/api'
import { downloadBlob } from '@/utils'
import { AnalyticsData, Lead } from '@/types'
import { formatCurrency } from '@/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ExportPanelProps {
  leads?: Lead[]
  analytics?: AnalyticsData | null
}

// ── Client-side CSV builder (works even when backend is unreachable) ──────────
function buildLeadsCsv(leads: Lead[]): string {
  const headers = [
    'Name', 'Phone', 'Email', 'Status', 'Temperature',
    'Source', 'Budget (₹)', 'Property Type', 'Location',
    'Next Follow-Up', 'Created At',
  ].join(',')

  const rows = leads.map(l => [
    `"${l.name}"`,
    `"${l.phone}"`,
    `"${l.email || ''}"`,
    `"${l.status}"`,
    `"${l.temperature}"`,
    `"${l.source}"`,
    l.budget || 0,
    `"${l.propertyType || ''}"`,
    `"${l.location || ''}"`,
    `"${l.nextFollowUpAt ? new Date(l.nextFollowUpAt).toLocaleDateString('en-IN') : ''}"`,
    `"${l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : ''}"`,
  ].join(','))

  return [headers, ...rows].join('\n')
}

function buildPipelineCsv(leads: Lead[]): string {
  const open = leads.filter(l => !['closed', 'lost'].includes(l.status))
  const headers = ['Name', 'Stage', 'Temperature', 'Budget (₹)', 'Location', 'Next Follow-Up'].join(',')
  const rows = open.map(l => [
    `"${l.name}"`,
    `"${l.status}"`,
    `"${l.temperature}"`,
    l.budget || 0,
    `"${l.location || ''}"`,
    `"${l.nextFollowUpAt ? new Date(l.nextFollowUpAt).toLocaleDateString('en-IN') : 'Not set'}"`,
  ].join(','))
  return [headers, ...rows].join('\n')
}

function buildSummaryTxt(leads: Lead[], analytics: AnalyticsData | null): string {
  const total    = leads.length
  const closed   = leads.filter(l => l.status === 'closed').length
  const pipeline = leads.reduce((s, l) => s + (l.budget || 0), 0)
  const convRate = total > 0 ? ((closed / total) * 100).toFixed(1) : '0'
  const date     = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const stageLines = ['new','contacted','follow-up','site-visit','negotiation','closed','lost']
    .map(s => {
      const count = leads.filter(l => l.status === s).length
      return `  ${s.padEnd(14)} ${count} leads`
    }).join('\n')

  return `BROKERRA — ANALYTICS REPORT
Generated: ${date}
${'='.repeat(40)}

PIPELINE SUMMARY
Total Leads:       ${total}
Closed Deals:      ${closed}
Conversion Rate:   ${convRate}%
Total Pipeline:    ${formatCurrency(pipeline)}

STAGE BREAKDOWN
${stageLines}

${'='.repeat(40)}
Exported from Brokerra AI Real Estate CRM
brokerra.vercel.app
`
}

// ─────────────────────────────────────────────────────────────────────────────

export function ExportPanel({ leads = [], analytics }: ExportPanelProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [done, setDone]       = useState<string[]>([])

  const run = async (id: string, fn: () => Promise<void> | void) => {
    setLoading(id)
    try {
      await fn()
      setDone(prev => [...prev, id])
      setTimeout(() => setDone(prev => prev.filter(d => d !== id)), 3000)
    } catch (err) {
      console.error(err)
      toast.error('Export failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  // ── Export handlers — try backend first, fallback to client-side ──────────

  const exportAllLeadsCsv = async () => {
    try {
      // Try backend export first
      const blob = await exportApi.exportLeadsCsv()
      downloadBlob(blob, `brokerra-leads-${new Date().toISOString().slice(0,10)}.csv`)
      toast.success('Leads exported to CSV')
    } catch {
      // Backend unavailable — build CSV client-side from props
      if (leads.length === 0) { toast.error('No leads to export'); return }
      const csv = buildLeadsCsv(leads)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `brokerra-leads-${new Date().toISOString().slice(0,10)}.csv`)
      toast.success(`Exported ${leads.length} leads to CSV`)
    }
  }

  const exportMonthlyReport = async () => {
    try {
      const blob = await exportApi.exportMonthlyReport()
      downloadBlob(blob, `brokerra-report-${new Date().toISOString().slice(0,7)}.pdf`)
      toast.success('Monthly report downloaded')
    } catch {
      // Fallback: text summary
      const txt = buildSummaryTxt(leads, analytics)
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' })
      downloadBlob(blob, `brokerra-report-${new Date().toISOString().slice(0,7)}.txt`)
      toast.success('Report downloaded as text summary')
    }
  }

  const exportPipelineCsv = async () => {
    try {
      const blob = await exportApi.exportLeadsCsv()
      downloadBlob(blob, `brokerra-pipeline-${new Date().toISOString().slice(0,10)}.csv`)
      toast.success('Pipeline exported')
    } catch {
      if (leads.length === 0) { toast.error('No pipeline data to export'); return }
      const csv = buildPipelineCsv(leads)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `brokerra-pipeline-${new Date().toISOString().slice(0,10)}.csv`)
      const openCount = leads.filter(l => !['closed','lost'].includes(l.status)).length
      toast.success(`Exported ${openCount} open deals to CSV`)
    }
  }

  const EXPORTS = [
    {
      id: 'leads-csv',
      title: 'All Leads (CSV)',
      description: `Every lead with status, budget, contact info, and source${leads.length > 0 ? ` · ${leads.length} records` : ''}`,
      icon: Table2,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/12 border-emerald-500/20',
      action: exportAllLeadsCsv,
    },
    {
      id: 'monthly-pdf',
      title: 'Monthly Report',
      description: 'Analytics summary: pipeline value, conversions, stage breakdown',
      icon: FileText,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/12 border-blue-500/20',
      action: exportMonthlyReport,
    },
    {
      id: 'pipeline-csv',
      title: 'Pipeline Snapshot (CSV)',
      description: 'Open deals with stage, follow-up dates, and deal values',
      icon: BarChart3,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/12 border-purple-500/20',
      action: exportPipelineCsv,
    },
  ]

  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
        <Download className="w-4 h-4 text-white/40" />
        <h3 className="text-sm font-semibold text-white">Export Reports</h3>
      </div>

      <div className="p-4 space-y-3">
        {EXPORTS.map((exp, i) => {
          const Icon      = exp.icon
          const isLoading = loading === exp.id
          const isDone    = done.includes(exp.id)

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-3.5 bg-white/3 border border-white/6 rounded-xl hover:border-white/10 transition-all duration-200"
            >
              <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0', exp.iconBg)}>
                <Icon className={cn('w-5 h-5', exp.iconColor)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white/85">{exp.title}</div>
                <div className="text-xs text-white/35 mt-0.5 leading-relaxed">{exp.description}</div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => run(exp.id, exp.action)}
                disabled={isLoading || !!loading}
                className={cn(
                  'flex-shrink-0 gap-1.5 min-w-[90px]',
                  isDone && 'border-emerald-500/30 text-emerald-400'
                )}
              >
                {isLoading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Exporting</>
                ) : isDone ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Done</>
                ) : (
                  <><Download className="w-3.5 h-3.5" /> Export</>
                )}
              </Button>
            </motion.div>
          )
        })}
      </div>

      <div className="px-5 py-3 border-t border-white/5">
        <p className="text-[11px] text-white/20">
          Exports include all data visible to your account. Files are generated fresh on each download.
        </p>
      </div>
    </div>
  )
}
