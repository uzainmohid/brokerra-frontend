'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare, Phone, GitBranch, Zap,
  PlusCircle, UserCheck, FileText, Clock,
} from 'lucide-react'
import { ActivityItem } from '@/types'
import { formatDateTime, formatRelative } from '@/utils'
import { cn } from '@/lib/utils'

const TYPE_CONFIG = {
  created: {
    icon: PlusCircle,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/20',
    label: 'Lead created',
  },
  status_change: {
    icon: GitBranch,
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/20',
    label: 'Status changed',
  },
  note_added: {
    icon: FileText,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/20',
    label: 'Note added',
  },
  follow_up: {
    icon: Clock,
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    border: 'border-orange-500/20',
    label: 'Follow-up',
  },
  ai_summary: {
    icon: Zap,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/20',
    label: 'AI Summary',
  },
  contacted: {
    icon: UserCheck,
    color: 'text-teal-400',
    bg: 'bg-teal-500/15',
    border: 'border-teal-500/20',
    label: 'Contacted',
  },
}

// Fallback demo activities
const DEMO_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1', leadId: '1', type: 'created',
    description: 'Lead added from WhatsApp referral',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdBy: 'You',
  },
  {
    id: 'a2', leadId: '1', type: 'status_change',
    description: 'Status changed from New → Contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    createdBy: 'You',
  },
  {
    id: 'a3', leadId: '1', type: 'note_added',
    description: 'Interested in 3BHK in Bandra. Budget flexible up to ₹2Cr. Needs parking.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdBy: 'You',
  },
  {
    id: 'a4', leadId: '1', type: 'follow_up',
    description: 'Scheduled WhatsApp follow-up for site visit confirmation',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdBy: 'You',
  },
  {
    id: 'a5', leadId: '1', type: 'status_change',
    description: 'Status changed from Contacted → Site Visit',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdBy: 'You',
  },
  {
    id: 'a6', leadId: '1', type: 'ai_summary',
    description: 'AI summary generated — lead shows high purchase intent signals',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdBy: 'Brokerra AI',
  },
  {
    id: 'a7', leadId: '1', type: 'contacted',
    description: 'Called lead — confirmed site visit for Saturday 11AM',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdBy: 'You',
  },
]

interface ActivityTimelineProps {
  activities?: ActivityItem[]
}

export function ActivityTimeline({ activities = DEMO_ACTIVITIES }: ActivityTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[17px] top-0 bottom-0 w-px bg-white/6" />

      <div className="space-y-1">
        {activities.map((activity, idx) => {
          const conf = TYPE_CONFIG[activity.type] || TYPE_CONFIG.note_added
          const Icon = conf.icon

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className="relative flex gap-4 pl-1 pb-6 last:pb-0"
            >
              {/* Icon dot */}
              <div className={cn(
                'relative z-10 w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border',
                conf.bg, conf.border
              )}>
                <Icon className={cn('w-4 h-4', conf.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn('text-[10px] font-bold uppercase tracking-wider', conf.color)}>
                        {conf.label}
                      </span>
                      {activity.createdBy && (
                        <>
                          <span className="text-white/15">·</span>
                          <span className="text-[10px] text-white/30">{activity.createdBy}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-[11px] text-white/25 whitespace-nowrap">
                      {formatRelative(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
