'use client'

import React from 'react'
import Link from 'next/link'
import {
  AlertTriangle, Clock, TrendingUp, Flame,
  Phone, MessageSquare, ChevronRight, Zap,
  RefreshCw, Target, Star,
} from 'lucide-react'
import { LeadInsight, InsightType, InsightUrgency } from '@/types'
import { formatCurrency } from '@/utils'
import { cn } from '@/lib/utils'

// ── Visual config per insight type ───────────────────────────────────────────

const INSIGHT_CONFIG: Record<InsightType, {
  icon: React.ElementType
  iconColor: string
  bgColor: string
  borderColor: string
  label: string
}> = {
  overdue_followup:  { icon: AlertTriangle, iconColor: 'text-red-400',    bgColor: 'bg-red-500/8',     borderColor: 'border-red-500/20',    label: 'Overdue' },
  follow_up_today:   { icon: Clock,         iconColor: 'text-orange-400',  bgColor: 'bg-orange-500/8',  borderColor: 'border-orange-500/20', label: 'Due Today' },
  stalled_deal:      { icon: RefreshCw,     iconColor: 'text-amber-400',   bgColor: 'bg-amber-500/8',   borderColor: 'border-amber-500/20',  label: 'Stalled' },
  going_cold:        { icon: Clock,         iconColor: 'text-blue-400',    bgColor: 'bg-blue-500/8',    borderColor: 'border-blue-500/20',   label: 'Going Cold' },
  hot_new_lead:      { icon: Flame,         iconColor: 'text-red-400',     bgColor: 'bg-red-500/8',     borderColor: 'border-red-500/20',    label: 'Hot Lead' },
  likely_to_convert: { icon: TrendingUp,    iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/8', borderColor: 'border-emerald-500/20',label: 'Likely Close' },
  close_opportunity: { icon: Target,        iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/8', borderColor: 'border-emerald-500/20',label: 'Close Now' },
  high_value:        { icon: Star,          iconColor: 'text-amber-400',   bgColor: 'bg-amber-500/8',   borderColor: 'border-amber-500/20',  label: 'High Value' },
  reactivate:        { icon: Zap,           iconColor: 'text-purple-400',  bgColor: 'bg-purple-500/8',  borderColor: 'border-purple-500/20', label: 'Re-engage' },
  healthy:           { icon: TrendingUp,    iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/8', borderColor: 'border-emerald-500/20',label: 'Healthy' },
}

const URGENCY_DOT: Record<InsightUrgency, string> = {
  critical: 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]',
  high:     'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]',
  medium:   'bg-amber-400',
  low:      'bg-white/20',
}

const STATUS_LABEL: Record<string, string> = {
  new: 'New', contacted: 'Contacted', 'follow-up': 'Follow Up',
  'site-visit': 'Site Visit', negotiation: 'Negotiation',
  closed: 'Closed', lost: 'Lost',
}

interface AiInsightCardProps {
  insight: LeadInsight
  index: number
}

export function AiInsightCard({ insight, index }: AiInsightCardProps) {
  const config = INSIGHT_CONFIG[insight.type] || INSIGHT_CONFIG.healthy
  const Icon   = config.icon
  const lead   = insight.lead

  return (
    <div
      className={cn(
        'group relative rounded-xl border p-4 transition-all duration-200',
        'bg-[rgba(10,18,40,0.75)] backdrop-blur-sm',
        config.borderColor,
        config.bgColor,
        'hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Urgency pulse dot */}
      <div className={cn(
        'absolute top-3.5 right-3.5 w-2 h-2 rounded-full',
        URGENCY_DOT[insight.urgency],
        insight.urgency === 'critical' && 'animate-pulse',
      )} />

      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          config.bgColor, 'border', config.borderColor,
        )}>
          <Icon className={cn('w-4 h-4', config.iconColor)} />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          {/* Type label */}
          <span className={cn(
            'text-[9px] font-bold uppercase tracking-widest',
            config.iconColor, 'opacity-80',
          )}>
            {config.label}
          </span>

          {/* Headline */}
          <p className="text-[13px] font-semibold text-white/90 leading-snug mt-0.5">
            {insight.headline}
          </p>
        </div>
      </div>

      {/* AI action message */}
      <p className="text-[11px] text-white/55 leading-relaxed mb-3 pl-11">
        {insight.action}
      </p>

      {/* Lead summary row */}
      <div className="flex items-center justify-between pl-11">
        <div className="flex items-center gap-2 min-w-0">
          {/* Name + status */}
          <div className="min-w-0">
            <span className="text-[12px] font-semibold text-white/80 truncate block">
              {lead.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-white/30">
                {STATUS_LABEL[lead.status] || lead.status}
              </span>
              {lead.budget && (
                <>
                  <span className="text-white/15 text-[10px]">·</span>
                  <span className="text-[10px] text-emerald-400 font-medium tabular-nums">
                    {formatCurrency(lead.budget)}
                  </span>
                </>
              )}
              {/* Conversion probability pill */}
              <span className={cn(
                'text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5',
                insight.conversionPct >= 60
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : insight.conversionPct >= 35
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-white/8 text-white/40',
              )}>
                {insight.conversionPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          <a
            href={`tel:${lead.phone}`}
            className="w-7 h-7 rounded-lg bg-blue-500/12 hover:bg-blue-500/25 flex items-center justify-center transition-colors"
            title="Call"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
          </a>
          <a
            href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg bg-green-500/12 hover:bg-green-500/25 flex items-center justify-center transition-colors"
            title="WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-green-400" />
          </a>
          <Link
            href={`/leads/${lead.id}`}
            className="w-7 h-7 rounded-lg bg-white/6 hover:bg-white/14 flex items-center justify-center transition-colors"
            title="Open lead"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/45" />
          </Link>
        </div>
      </div>
    </div>
  )
}
