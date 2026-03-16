'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Phone, MessageSquare, Clock, IndianRupee,
  MapPin, GripVertical, ChevronRight, AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { Lead } from '@/types'
import { formatCurrency, formatRelative, getInitials, getTemperatureEmoji } from '@/utils'
import { cn } from '@/lib/utils'

const AVATAR_GRADIENTS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
  'from-amber-600 to-orange-500',
  'from-red-500 to-rose-500',
  'from-indigo-600 to-blue-500',
]

function hashIndex(str: string, mod: number): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff
  return Math.abs(h) % mod
}

const TEMP_BADGE: Record<string, string> = {
  hot: 'bg-red-500/12 text-red-400 border-red-500/20',
  warm: 'bg-amber-500/12 text-amber-400 border-amber-500/20',
  cold: 'bg-blue-500/12 text-blue-400 border-blue-500/20',
}

interface KanbanCardProps {
  lead: Lead
  overlay?: boolean
}

export function KanbanCard({ lead, overlay = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const gradientClass = AVATAR_GRADIENTS[hashIndex(lead.id, AVATAR_GRADIENTS.length)]

  const isOverdue = lead.nextFollowUpAt
    ? new Date(lead.nextFollowUpAt) < new Date()
    : false

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-xl border cursor-grab active:cursor-grabbing select-none',
        'bg-[rgba(15,26,53,0.85)] backdrop-blur-sm',
        'transition-all duration-200 ease-out',
        isSortableDragging && 'opacity-0 pointer-events-none',
        overlay && [
          'border-emerald-500/25',
          'shadow-[0_24px_60px_rgba(0,0,0,0.7),0_0_24px_rgba(16,185,129,0.12)]',
          'rotate-1 scale-[1.02]',
          'cursor-grabbing',
        ],
        !isSortableDragging && !overlay && [
          'border-white/8',
          'hover:border-white/14',
          'hover:-translate-y-0.5',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.2)]',
        ],
        isOverdue && 'border-l-red-500/60',
      )}
    >
      {isOverdue && (
        <div className="absolute inset-y-0 left-0 w-[3px] bg-red-500/70 rounded-l-xl" />
      )}

      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute top-2.5 right-2.5',
          'text-white/0 group-hover:text-white/30 hover:!text-white/60',
          'transition-all duration-150 cursor-grab',
          'touch-none',
        )}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      <div className="p-3.5 pr-7">

        {/* Row 1 */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className={cn(
            'w-8 h-8 rounded-full flex-shrink-0',
            'flex items-center justify-center',
            'text-[11px] font-bold text-white',
            'bg-gradient-to-br',
            gradientClass,
            'ring-1 ring-white/10',
          )}>
            {getInitials(lead.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[13px] font-semibold text-white/90 truncate leading-snug">
                {lead.name}
              </span>

              <span
                className={cn(
                  'inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded-full border',
                  'flex-shrink-0',
                  TEMP_BADGE[lead.temperature] || 'bg-white/8 text-white/40 border-white/10',
                )}
              >
                {getTemperatureEmoji(lead.temperature)} {lead.temperature}
              </span>
            </div>

            {lead.phone && (
              <span className="text-[11px] text-white/30 block mt-0.5">{lead.phone}</span>
            )}
          </div>
        </div>

        {/* Row 2 */}
        {(lead.propertyType || lead.location) && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {lead.propertyType && (
              <span className="text-[10px] bg-white/5 border border-white/8 text-white/50 px-2 py-0.5 rounded-full">
                {lead.propertyType}
              </span>
            )}

            {lead.location && (
              <span className="flex items-center gap-0.5 text-[10px] text-white/30">
                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                {lead.location.split(',')[0]}
              </span>
            )}
          </div>
        )}

        {/* Row 3 */}
        {lead.budget ? (
          <div className="flex items-center gap-1 mb-3">
            <IndianRupee className="w-3 h-3 text-emerald-500/50 flex-shrink-0" />
            <span className="text-[13px] font-bold text-emerald-400 tabular-nums">
              {formatCurrency(lead.budget)}
            </span>
          </div>
        ) : (
          <div className="mb-3" />
        )}

        {/* Row 4 */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
          <div className={cn(
            'flex items-center gap-1 text-[10px]',
            isOverdue ? 'text-red-400' : 'text-white/25',
          )}>
            {isOverdue
              ? <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" />
              : <Clock className="w-2.5 h-2.5 flex-shrink-0" />
            }
            <span className="truncate">{formatRelative(lead.updatedAt)}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">

            <a
              href={`tel:${lead.phone}`}
              onClick={e => e.stopPropagation()}
              className="w-6 h-6 rounded-md bg-blue-500/12 hover:bg-blue-500/25 flex items-center justify-center transition-colors"
              title="Call"
            >
              <Phone className="w-3 h-3 text-blue-400" />
            </a>

            <a
              href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-6 h-6 rounded-md bg-green-500/12 hover:bg-green-500/25 flex items-center justify-center transition-colors"
              title="WhatsApp"
            >
              <MessageSquare className="w-3 h-3 text-green-400" />
            </a>

            <Link
              href={`/leads/${lead.id}`}
              onClick={e => e.stopPropagation()}
              className="w-6 h-6 rounded-md bg-white/6 hover:bg-white/14 flex items-center justify-center transition-colors"
              title="Open lead"
            >
              <ChevronRight className="w-3 h-3 text-white/45" />
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}