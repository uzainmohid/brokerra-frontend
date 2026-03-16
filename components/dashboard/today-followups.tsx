'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, MessageSquare, Clock, CheckCircle2,
  ChevronRight, AlertTriangle, Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelative, getTemperatureEmoji, formatCurrency } from '@/utils'
import { Lead } from '@/types'
import Link from 'next/link'

// Mock follow-up data — in production these come from the API
const MOCK_FOLLOWUPS = [
  {
    id: '1',
    lead: { id: 'l1', name: 'Rajesh Kumar', phone: '+91 98765 43210', temperature: 'hot' as const },
    type: 'call' as const,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min overdue
    notes: '3BHK in Bandra — final decision pending',
    budget: 18500000,
    isOverdue: true,
  },
  {
    id: '2',
    lead: { id: 'l2', name: 'Priya Mehta', phone: '+91 87654 32109', temperature: 'hot' as const },
    type: 'whatsapp' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 min from now
    notes: 'Send site visit confirmation and property brochure',
    budget: 9500000,
    isOverdue: false,
  },
  {
    id: '3',
    lead: { id: 'l3', name: 'Amit Shah', phone: '+91 76543 21098', temperature: 'warm' as const },
    type: 'call' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // 2 hrs from now
    notes: 'Check interest in new Powai listings',
    budget: 12200000,
    isOverdue: false,
  },
  {
    id: '4',
    lead: { id: 'l4', name: 'Sunita Rao', phone: '+91 65432 10987', temperature: 'warm' as const },
    type: 'whatsapp' as const,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs overdue
    notes: 'Negotiate on 2BHK Andheri price point',
    budget: 7800000,
    isOverdue: true,
  },
  {
    id: '5',
    lead: { id: 'l5', name: 'Vikram Nair', phone: '+91 54321 09876', temperature: 'cold' as const },
    type: 'call' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hrs from now
    notes: 'Re-engage after 2 weeks of silence',
    budget: 5500000,
    isOverdue: false,
  },
]

const TYPE_CONFIG = {
  call: { icon: Phone, label: 'Call', color: 'text-blue-400', bg: 'bg-blue-500/12' },
  whatsapp: { icon: MessageSquare, label: 'WhatsApp', color: 'text-green-400', bg: 'bg-green-500/12' },
  email: { icon: Calendar, label: 'Email', color: 'text-purple-400', bg: 'bg-purple-500/12' },
  'site-visit': { icon: ChevronRight, label: 'Site Visit', color: 'text-orange-400', bg: 'bg-orange-500/12' },
  meeting: { icon: Calendar, label: 'Meeting', color: 'text-pink-400', bg: 'bg-pink-500/12' },
}

interface FollowUpItemProps {
  item: typeof MOCK_FOLLOWUPS[0]
  onComplete: (id: string) => void
}

function FollowUpItem({ item, onComplete }: FollowUpItemProps) {
  const typeConf = TYPE_CONFIG[item.type] || TYPE_CONFIG.call
  const TypeIcon = typeConf.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'group flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer',
        item.isOverdue
          ? 'bg-red-500/5 border-red-500/15 hover:border-red-500/30'
          : 'bg-white/3 border-white/6 hover:border-white/12 hover:bg-white/5'
      )}
    >
      {/* Type icon */}
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', typeConf.bg)}>
        <TypeIcon className={cn('w-3.5 h-3.5', typeConf.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-white/90 truncate">{item.lead.name}</span>
          <span className="text-xs">{getTemperatureEmoji(item.lead.temperature)}</span>
          {item.isOverdue && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/12 border border-red-500/20 px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0">
              <AlertTriangle className="w-2.5 h-2.5" />
              OVERDUE
            </span>
          )}
        </div>

        <p className="text-xs text-white/40 truncate mb-1.5">{item.notes}</p>

        <div className="flex items-center gap-3 text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelative(item.scheduledAt)}
          </span>
          <span>{formatCurrency(item.budget)}</span>
          <span className={typeConf.color}>{typeConf.label}</span>
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onComplete(item.id) }}
        className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 hover:bg-emerald-500/15 border border-white/8 hover:border-emerald-500/30 flex items-center justify-center text-white/25 hover:text-emerald-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Mark as done"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export function TodayFollowUps() {
  const [items, setItems] = useState(MOCK_FOLLOWUPS)

  const handleComplete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const overdueCount = items.filter(i => i.isOverdue).length

  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div>
          <h3 className="text-base font-semibold text-white">Today's Follow-ups</h3>
          <p className="text-xs text-white/35 mt-0.5">
            {items.length} scheduled
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

      {/* Follow-up list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[420px] no-scrollbar">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500/30 mb-3" />
              <p className="text-sm font-medium text-white/40">All caught up!</p>
              <p className="text-xs text-white/25 mt-1">No more follow-ups for today.</p>
            </motion.div>
          ) : (
            items.map(item => (
              <FollowUpItem key={item.id} item={item} onComplete={handleComplete} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="px-5 py-3 border-t border-white/6">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${((MOCK_FOLLOWUPS.length - items.length) / MOCK_FOLLOWUPS.length) * 100}%` }}
              />
            </div>
            <span>{MOCK_FOLLOWUPS.length - items.length}/{MOCK_FOLLOWUPS.length} completed today</span>
          </div>
        </div>
      )}
    </div>
  )
}
