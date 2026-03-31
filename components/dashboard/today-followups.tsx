'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, MessageSquare, Clock, CheckCircle2,
  ChevronRight, AlertTriangle, Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelative, getTemperatureEmoji, formatCurrency } from '@/utils'
import { Lead } from '@/types'
import Link from 'next/link'

// ── Type config for the contact icon per status ───────────────────────────────
const TYPE_CONFIG = {
  call:         { icon: Phone,        label: 'Call',       color: 'text-blue-400',   bg: 'bg-blue-500/12' },
  whatsapp:     { icon: MessageSquare,label: 'WhatsApp',   color: 'text-green-400',  bg: 'bg-green-500/12' },
  email:        { icon: Calendar,     label: 'Email',      color: 'text-purple-400', bg: 'bg-purple-500/12' },
  'site-visit': { icon: ChevronRight, label: 'Site Visit', color: 'text-orange-400', bg: 'bg-orange-500/12' },
  meeting:      { icon: Calendar,     label: 'Meeting',    color: 'text-pink-400',   bg: 'bg-pink-500/12' },
}

// ── Infer contact type from lead source ───────────────────────────────────────
function inferType(source: string): keyof typeof TYPE_CONFIG {
  if (source === 'whatsapp') return 'whatsapp'
  if (source === 'website' || source === 'facebook' || source === 'instagram') return 'email'
  if (source === 'walk-in') return 'site-visit'
  return 'call'
}

// ── Map a Lead with nextFollowUpAt into a display item ────────────────────────
interface FollowUpItem {
  id: string
  lead: { id: string; name: string; phone: string; temperature: Lead['temperature'] }
  type: keyof typeof TYPE_CONFIG
  scheduledAt: string
  notes: string
  budget?: number
  isOverdue: boolean
}

function leadToFollowUpItem(lead: Lead): FollowUpItem {
  const scheduledAt = lead.nextFollowUpAt!
  const isOverdue   = new Date(scheduledAt) < new Date()
  return {
    id:          lead.id,
    lead:        { id: lead.id, name: lead.name, phone: lead.phone, temperature: lead.temperature },
    type:        inferType(lead.source),
    scheduledAt,
    notes:       lead.noteText || lead.notes || '',
    budget:      lead.budget,
    isOverdue,
  }
}

// ── Row component ─────────────────────────────────────────────────────────────
interface FollowUpRowProps {
  item: FollowUpItem
  onComplete: (id: string) => void
}

function FollowUpRow({ item, onComplete }: FollowUpRowProps) {
  const typeConf = TYPE_CONFIG[item.type] || TYPE_CONFIG.call
  const TypeIcon = typeConf.icon
  const scheduled = new Date(item.scheduledAt)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.22 }}
      className={cn(
        'group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer',
        item.isOverdue
          ? 'bg-red-500/5 border-red-500/18 hover:border-red-500/30'
          : 'bg-white/3 border-white/6 hover:border-white/12 hover:bg-white/5'
      )}
    >
      {/* Contact type icon */}
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', typeConf.bg)}>
        <TypeIcon className={cn('w-3.5 h-3.5', typeConf.color)} />
      </div>

      {/* Content */}
      <Link href={`/leads/${item.lead.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-white/90">
            {item.lead.name} {getTemperatureEmoji(item.lead.temperature)}
          </span>
          {item.isOverdue && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
              <AlertTriangle className="w-2.5 h-2.5" /> OVERDUE
            </span>
          )}
        </div>

        {item.notes && (
          <p className="text-xs text-white/45 leading-relaxed mb-1.5 truncate">{item.notes}</p>
        )}

        <div className="flex items-center gap-3 text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {formatRelative(item.scheduledAt)}
          </span>
          {item.budget && (
            <span className="text-white/40 font-medium">{formatCurrency(item.budget)}</span>
          )}
          <span className={cn('font-semibold', typeConf.color)}>{typeConf.label}</span>
        </div>
      </Link>

      {/* Complete button */}
      <button
        onClick={e => { e.stopPropagation(); onComplete(item.id) }}
        className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 hover:bg-emerald-500/15 border border-white/8 hover:border-emerald-500/30 flex items-center justify-center text-white/25 hover:text-emerald-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Mark as done"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface TodayFollowUpsProps {
  leads?: Lead[]
}

export function TodayFollowUps({ leads = [] }: TodayFollowUpsProps) {
  const [dismissed, setDismissed] = useState<string[]>([])

  // Build follow-up items from real leads:
  // Include leads where nextFollowUpAt is today OR overdue (not closed/lost)
  const allItems = useMemo<FollowUpItem[]>(() => {
    const now      = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    return leads
      .filter(l =>
        l.nextFollowUpAt &&
        new Date(l.nextFollowUpAt) < tomorrow &&
        !['closed', 'lost'].includes(l.status)
      )
      .sort((a, b) => {
        // Overdue first, then by scheduled time ascending
        const aOver = new Date(a.nextFollowUpAt!) < now ? 0 : 1
        const bOver = new Date(b.nextFollowUpAt!) < now ? 0 : 1
        if (aOver !== bOver) return aOver - bOver
        return new Date(a.nextFollowUpAt!).getTime() - new Date(b.nextFollowUpAt!).getTime()
      })
      .map(leadToFollowUpItem)
  }, [leads])

  const items        = allItems.filter(i => !dismissed.includes(i.id))
  const totalCount   = allItems.length
  const doneCount    = dismissed.length
  const overdueCount = items.filter(i => i.isOverdue).length

  const handleComplete = (id: string) => {
    setDismissed(prev => [...prev, id])
  }

  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div>
          <h3 className="text-base font-semibold text-white">Today's Follow-ups</h3>
          <p className="text-xs text-white/35 mt-0.5">
            {items.length > 0 ? `${items.length} scheduled` : 'No follow-ups scheduled today'}
            {overdueCount > 0 && (
              <span className="text-red-400 ml-1">· {overdueCount} overdue</span>
            )}
          </p>
        </div>
        <Link
          href="/leads"
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[420px] no-scrollbar">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500/30 mb-3" />
              <p className="text-sm font-medium text-white/40">
                {doneCount > 0 ? 'All caught up!' : 'No follow-ups for today'}
              </p>
              <p className="text-xs text-white/25 mt-1">
                {doneCount > 0
                  ? `${doneCount} completed today`
                  : 'Schedule follow-ups on your leads to see them here'}
              </p>
            </motion.div>
          ) : (
            items.map(item => (
              <FollowUpRow key={item.id} item={item} onComplete={handleComplete} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer progress */}
      {totalCount > 0 && (
        <div className="px-5 py-3 border-t border-white/6">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / totalCount) * 100}%` }}
              />
            </div>
            <span>{doneCount}/{totalCount} completed today</span>
          </div>
        </div>
      )}
    </div>
  )
}
