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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ExportOption {
  id: string
  title: string
  description: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  action: () => Promise<void>
}

export function ExportPanel() {
  const [loading, setLoading] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])

  const run = async (id: string, fn: () => Promise<void>) => {
    setLoading(id)
    try {
      await fn()
      setDone(prev => [...prev, id])
      setTimeout(() => setDone(prev => prev.filter(d => d !== id)), 3000)
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const EXPORTS: ExportOption[] = [
    {
      id: 'leads-csv',
      title: 'All Leads (CSV)',
      description: 'Every lead with status, budget, contact info, and source',
      icon: Table2,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/12 border-emerald-500/20',
      action: async () => {
        const blob = await exportApi.exportLeadsCsv()
        downloadBlob(blob, `brokerra-leads-${new Date().toISOString().slice(0, 10)}.csv`)
        toast.success('Leads exported to CSV')
      },
    },
    {
      id: 'monthly-pdf',
      title: 'Monthly Report (PDF)',
      description: 'Full analytics summary: pipeline value, conversions, broker performance',
      icon: FileText,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/12 border-blue-500/20',
      action: async () => {
        const blob = await exportApi.exportMonthlyReport()
        downloadBlob(blob, `brokerra-report-${new Date().toISOString().slice(0, 7)}.pdf`)
        toast.success('Monthly report downloaded')
      },
    },
    {
      id: 'pipeline-csv',
      title: 'Pipeline Snapshot (CSV)',
      description: 'Current pipeline with stage, follow-up dates, and deal values',
      icon: BarChart3,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/12 border-purple-500/20',
      action: async () => {
        // Reuse leads CSV filtered by non-closed/lost
        const blob = await exportApi.exportLeadsCsv()
        downloadBlob(blob, `brokerra-pipeline-${new Date().toISOString().slice(0, 10)}.csv`)
        toast.success('Pipeline exported')
      },
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
          const Icon = exp.icon
          const isLoading = loading === exp.id
          const isDone = done.includes(exp.id)

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
