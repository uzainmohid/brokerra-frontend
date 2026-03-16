// 'use client'

// import React from 'react'
// import { motion } from 'framer-motion'
// import { Lead, LeadStatus } from '@/types'
// import { formatCurrency } from '@/utils'
// import { PIPELINE_COLUMNS } from '@/utils'
// import { cn } from '@/lib/utils'

// interface PipelineStatsBarProps {
//   leadMap: Record<LeadStatus, Lead[]>
// }

// const STAT_COLORS: Record<LeadStatus, { text: string; bar: string }> = {
//   'new':         { text: 'text-blue-400',    bar: 'bg-blue-500' },
//   'contacted':   { text: 'text-purple-400',  bar: 'bg-purple-500' },
//   'follow-up':   { text: 'text-amber-400',   bar: 'bg-amber-500' },
//   'site-visit':  { text: 'text-orange-400',  bar: 'bg-orange-500' },
//   'negotiation': { text: 'text-pink-400',    bar: 'bg-pink-500' },
//   'closed':      { text: 'text-emerald-400', bar: 'bg-emerald-500' },
//   'lost':        { text: 'text-gray-400',    bar: 'bg-gray-500' },
// }

// export function PipelineStatsBar({ leadMap }: PipelineStatsBarProps) {
//   const totalLeads = Object.values(leadMap).flat().length
//   const totalValue = Object.values(leadMap).flat().reduce((s, l) => s + (l.budget || 0), 0)
//   const closedValue = (leadMap['closed'] || []).reduce((s, l) => s + (l.budget || 0), 0)

//   return (
//     <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl px-5 py-4">
//       <div className="flex flex-wrap items-center gap-6 mb-4">
//         {/* Summary */}
//         <div>
//           <div className="text-xs text-white/30 mb-0.5">Total Pipeline</div>
//           <div className="text-xl font-bold text-white">{formatCurrency(totalValue)}</div>
//         </div>
//         <div className="w-px h-8 bg-white/8 hidden sm:block" />
//         <div>
//           <div className="text-xs text-white/30 mb-0.5">Closed Value</div>
//           <div className="text-xl font-bold text-emerald-400">{formatCurrency(closedValue)}</div>
//         </div>
//         <div className="w-px h-8 bg-white/8 hidden sm:block" />
//         <div>
//           <div className="text-xs text-white/30 mb-0.5">Active Leads</div>
//           <div className="text-xl font-bold text-white">{totalLeads}</div>
//         </div>
//       </div>

//       {/* Stage breakdown */}
//       <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
//         {PIPELINE_COLUMNS.map((col, i) => {
//           const leads = leadMap[col.id] || []
//           const value = leads.reduce((s, l) => s + (l.budget || 0), 0)
//           const colors = STAT_COLORS[col.id]

//           return (
//             <motion.div
//               key={col.id}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.05 }}
//               className="text-center"
//             >
//               <div className={cn('text-lg font-bold mb-0.5', colors.text)}>
//                 {leads.length}
//               </div>
//               <div className="text-[10px] text-white/35 mb-1.5 truncate">{col.title}</div>
//               {value > 0 && (
//                 <div className="text-[10px] text-white/25">{formatCurrency(value)}</div>
//               )}
//               {/* Mini progress bar relative to totalLeads */}
//               <div className="mt-1.5 h-0.5 bg-white/6 rounded-full overflow-hidden">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: totalLeads > 0 ? `${(leads.length / totalLeads) * 100}%` : '0%' }}
//                   transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
//                   className={cn('h-full rounded-full', colors.bar)}
//                 />
//               </div>
//             </motion.div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

'use client'

import React from 'react'
import { TrendingUp, Target, Users } from 'lucide-react'
import { Lead, LeadStatus } from '@/types'
import { formatCurrency } from '@/utils'
import { PIPELINE_COLUMNS } from '@/utils'
import { cn } from '@/lib/utils'

interface PipelineStatsBarProps {
  leadMap: Record<LeadStatus, Lead[]>
}

const STAT_COLORS: Record<LeadStatus, { text: string; bar: string; glow: string }> = {
  'new':         { text: 'text-blue-400',    bar: 'bg-blue-500',    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.4)]' },
  'contacted':   { text: 'text-purple-400',  bar: 'bg-purple-500',  glow: 'shadow-[0_0_8px_rgba(168,85,247,0.4)]' },
  'follow-up':   { text: 'text-amber-400',   bar: 'bg-amber-500',   glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]' },
  'site-visit':  { text: 'text-orange-400',  bar: 'bg-orange-500',  glow: 'shadow-[0_0_8px_rgba(249,115,22,0.4)]' },
  'negotiation': { text: 'text-pink-400',    bar: 'bg-pink-500',    glow: 'shadow-[0_0_8px_rgba(236,72,153,0.4)]' },
  'closed':      { text: 'text-emerald-400', bar: 'bg-emerald-500', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]' },
  'lost':        { text: 'text-gray-400',    bar: 'bg-gray-500',    glow: '' },
}

export function PipelineStatsBar({ leadMap }: PipelineStatsBarProps) {
  const totalLeads = Object.values(leadMap).flat().length
  const totalValue = Object.values(leadMap).flat().reduce((s, l) => s + (l.budget || 0), 0)
  const closedValue = (leadMap['closed'] || []).reduce((s, l) => s + (l.budget || 0), 0)
  const conversionRate = totalLeads > 0
    ? Math.round(((leadMap['closed'] || []).length / totalLeads) * 100)
    : 0

  return (
    <div className="bg-[rgba(15,26,53,0.60)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">

      {/* ── Top row: three KPI summary numbers ────────────────────── */}
      <div className="flex items-stretch divide-x divide-white/6 border-b border-white/6">

        <div className="flex items-center gap-3 px-5 py-3.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white/40" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-white/30 leading-none mb-1">Total Pipeline</div>
            <div className="text-lg font-bold text-white tabular-nums leading-none truncate">
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-3.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-white/30 leading-none mb-1">Closed Value</div>
            <div className="text-lg font-bold text-emerald-400 tabular-nums leading-none truncate">
              {formatCurrency(closedValue)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-3.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-white/40" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-white/30 leading-none mb-1">Active Leads</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white tabular-nums leading-none">
                {totalLeads}
              </span>
              {conversionRate > 0 && (
                <span className="text-[11px] text-emerald-400 font-medium">
                  {conversionRate}% closed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row: per-stage breakdown ───────────────────────── */}
      {/*
        Horizontal scroll instead of a collapsing grid — all 7 stage items
        stay the same size regardless of viewport width. The scrollbar is
        hidden; on narrow screens users can swipe.
      */}
      <div
        className="flex items-stretch divide-x divide-white/[0.05] overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PIPELINE_COLUMNS.map((col) => {
          const leads = leadMap[col.id] || []
          const value = leads.reduce((s, l) => s + (l.budget || 0), 0)
          const pct = totalLeads > 0 ? (leads.length / totalLeads) * 100 : 0
          const colors = STAT_COLORS[col.id]

          return (
            <div
              key={col.id}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[88px]"
            >
              {/* Lead count */}
              <div className={cn('text-base font-bold tabular-nums leading-none', colors.text)}>
                {leads.length}
              </div>

              {/* Stage name */}
              <div className="text-[10px] text-white/35 leading-none whitespace-nowrap">
                {col.title}
              </div>

              {/* Budget (if any) */}
              {value > 0 ? (
                <div className="text-[10px] text-white/22 tabular-nums leading-none">
                  {formatCurrency(value)}
                </div>
              ) : (
                <div className="h-[14px]" aria-hidden />
              )}

              {/* Mini fill bar showing proportion of total leads */}
              <div className="w-full h-[3px] bg-white/6 rounded-full overflow-hidden mt-0.5">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', colors.bar, pct > 0 && colors.glow)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}