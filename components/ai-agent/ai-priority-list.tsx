'use client'

import React from 'react'
import Link from 'next/link'
import { TrendingUp, AlertTriangle, Clock, Flame } from 'lucide-react'
import { PriorityLead } from '@/types'
import { formatCurrency, getInitials } from '@/utils'
import { cn } from '@/lib/utils'

const AVATAR_GRADIENTS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
  'from-amber-600 to-orange-500',
  'from-red-500 to-rose-500',
  'from-indigo-600 to-blue-500',
]

function hashIndex(s: string, mod: number) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff
  return Math.abs(h) % mod
}

const STATUS_LABEL: Record<string, string> = {
  new: 'New', contacted: 'Contacted', 'follow-up': 'Follow Up',
  'site-visit': 'Site Visit', negotiation: 'Negotiation',
}

const STATUS_DOT: Record<string, string> = {
  new: 'bg-blue-500', contacted: 'bg-purple-500', 'follow-up': 'bg-amber-500',
  'site-visit': 'bg-orange-500', negotiation: 'bg-pink-500',
}

interface AiPriorityListProps {
  priorities: PriorityLead[]
}

export function AiPriorityList({ priorities }: AiPriorityListProps) {
  if (!priorities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <TrendingUp className="w-8 h-8 text-white/15 mb-3" />
        <p className="text-sm text-white/30">All leads are up to date</p>
        <p className="text-[11px] text-white/18 mt-1">No priority actions needed right now</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {priorities.map((lead, i) => (
        <PriorityRow key={lead.id} lead={lead} rank={i + 1} />
      ))}
    </div>
  )
}

function PriorityRow({ lead, rank }: { lead: PriorityLead; rank: number }) {
  const gradient  = AVATAR_GRADIENTS[hashIndex(lead.id, AVATAR_GRADIENTS.length)]
  const isOverdue = lead.isOverdue || (lead.insight?.urgency === 'critical')
  const isHot     = lead.temperature === 'hot'

  return (
    <Link
      href={`/leads/${lead.id}`}
      className={cn(
        'flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150',
        'bg-[rgba(10,18,40,0.50)] hover:bg-[rgba(15,26,53,0.80)]',
        isOverdue
          ? 'border-red-500/20 hover:border-red-500/35'
          : 'border-white/6 hover:border-white/12',
        'group',
      )}
    >
      {/* Rank number */}
      <span className="text-[10px] font-bold text-white/20 w-4 flex-shrink-0 tabular-nums text-right">
        {rank}
      </span>

      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex-shrink-0 ring-1 ring-white/10',
        'flex items-center justify-center text-[10px] font-bold text-white',
        'bg-gradient-to-br', gradient,
      )}>
        {getInitials(lead.name)}
      </div>

      {/* Lead info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-white/90 truncate">
            {lead.name}
          </span>
          {isHot && <Flame className="w-3 h-3 text-red-400 flex-shrink-0" />}
          {isOverdue && <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', STATUS_DOT[lead.status] || 'bg-white/20')} />
          <span className="text-[10px] text-white/35">
            {STATUS_LABEL[lead.status] || lead.status}
          </span>
          {lead.budget && (
            <>
              <span className="text-white/15">·</span>
              <span className="text-[10px] text-emerald-400 font-medium tabular-nums">
                {formatCurrency(lead.budget)}
              </span>
            </>
          )}
          {lead.stalledDays > 0 && (
            <>
              <span className="text-white/15">·</span>
              <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                <Clock className="w-2.5 h-2.5" />
                {lead.stalledDays}d stalled
              </span>
            </>
          )}
        </div>
      </div>

      {/* Conversion probability */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className={cn(
          'text-[13px] font-bold tabular-nums',
          lead.conversionPct >= 60 ? 'text-emerald-400' :
          lead.conversionPct >= 35 ? 'text-amber-400'   : 'text-white/45',
        )}>
          {lead.conversionPct}%
        </span>
        <span className="text-[9px] text-white/25 mt-0.5">convert</span>
      </div>
    </Link>
  )
}
