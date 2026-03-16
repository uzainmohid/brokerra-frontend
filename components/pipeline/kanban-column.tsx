// 'use client'

// import React from 'react'
// import { useDroppable } from '@dnd-kit/core'
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Plus } from 'lucide-react'
// import { Lead, LeadStatus } from '@/types'
// import { KanbanCard } from './kanban-card'
// import { formatCurrency } from '@/utils'
// import { cn } from '@/lib/utils'

// interface ColumnConfig {
//   id: LeadStatus
//   title: string
//   color: string
//   className: string
// }

// interface KanbanColumnProps {
//   column: ColumnConfig
//   leads: Lead[]
//   isOver?: boolean
//   onAddLead?: (status: LeadStatus) => void
// }

// const COLUMN_ACCENT: Record<LeadStatus, string> = {
//   'new':          'border-t-blue-500',
//   'contacted':    'border-t-purple-500',
//   'follow-up':    'border-t-amber-500',
//   'site-visit':   'border-t-orange-500',
//   'negotiation':  'border-t-pink-500',
//   'closed':       'border-t-emerald-500',
//   'lost':         'border-t-gray-500',
// }

// const COLUMN_GLOW: Record<LeadStatus, string> = {
//   'new':          'shadow-[0_0_0_1px_rgba(59,130,246,0.2)]',
//   'contacted':    'shadow-[0_0_0_1px_rgba(168,85,247,0.2)]',
//   'follow-up':    'shadow-[0_0_0_1px_rgba(245,158,11,0.2)]',
//   'site-visit':   'shadow-[0_0_0_1px_rgba(249,115,22,0.2)]',
//   'negotiation':  'shadow-[0_0_0_1px_rgba(236,72,153,0.2)]',
//   'closed':       'shadow-[0_0_0_1px_rgba(16,185,129,0.2)]',
//   'lost':         'shadow-[0_0_0_1px_rgba(107,114,128,0.15)]',
// }

// const COUNT_COLOR: Record<LeadStatus, string> = {
//   'new':          'bg-blue-500/20 text-blue-400',
//   'contacted':    'bg-purple-500/20 text-purple-400',
//   'follow-up':    'bg-amber-500/20 text-amber-400',
//   'site-visit':   'bg-orange-500/20 text-orange-400',
//   'negotiation':  'bg-pink-500/20 text-pink-400',
//   'closed':       'bg-emerald-500/20 text-emerald-400',
//   'lost':         'bg-gray-500/20 text-gray-400',
// }

// export function KanbanColumn({ column, leads, isOver, onAddLead }: KanbanColumnProps) {
//   const { setNodeRef } = useDroppable({ id: column.id })

//   // Calculate total budget in this column
//   const totalBudget = leads.reduce((sum, l) => sum + (l.budget || 0), 0)

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className={cn(
//         'flex-shrink-0 w-[272px] flex flex-col rounded-2xl border-t-2 border border-white/6',
//         'bg-[rgba(10,18,40,0.65)] backdrop-blur-xl',
//         COLUMN_ACCENT[column.id],
//         isOver && COLUMN_GLOW[column.id],
//         isOver && 'border-white/12',
//         'transition-all duration-200'
//       )}
//       style={{ minHeight: 480 }}
//     >
//       {/* Column header */}
//       <div className="px-3.5 py-3 border-b border-white/5 flex-shrink-0">
//         <div className="flex items-center justify-between mb-1.5">
//           <div className="flex items-center gap-2">
//             <h3 className="text-sm font-semibold text-white/85">{column.title}</h3>
//             <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', COUNT_COLOR[column.id])}>
//               {leads.length}
//             </span>
//           </div>
//           {onAddLead && (
//             <button
//               onClick={() => onAddLead(column.id)}
//               className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/70 flex items-center justify-center transition-all duration-150"
//               title={`Add lead to ${column.title}`}
//             >
//               <Plus className="w-3.5 h-3.5" />
//             </button>
//           )}
//         </div>

//         {/* Column value */}
//         {totalBudget > 0 && (
//           <div className="text-[11px] text-white/25">
//             Pipeline: <span className="text-white/45 font-medium">{formatCurrency(totalBudget)}</span>
//           </div>
//         )}
//       </div>

//       {/* Drop zone */}
//       <div
//         ref={setNodeRef}
//         className={cn(
//           'flex-1 p-2.5 space-y-2 overflow-y-auto no-scrollbar transition-colors duration-200',
//           isOver && 'bg-white/[0.02]'
//         )}
//       >
//         <SortableContext
//           items={leads.map(l => l.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           <AnimatePresence>
//             {leads.map((lead) => (
//               <KanbanCard key={lead.id} lead={lead} />
//             ))}
//           </AnimatePresence>
//         </SortableContext>

//         {/* Empty drop zone hint */}
//         {leads.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className={cn(
//               'h-20 rounded-xl border-2 border-dashed border-white/6 flex items-center justify-center',
//               isOver && 'border-white/20 bg-white/[0.02]'
//             )}
//           >
//             <span className="text-[11px] text-white/20">
//               {isOver ? 'Release to drop' : 'No leads'}
//             </span>
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   )
// }

'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Lead, LeadStatus } from '@/types'
import { KanbanCard } from './kanban-card'
import { formatCurrency } from '@/utils'
import { cn } from '@/lib/utils'

interface ColumnConfig {
  id: LeadStatus
  title: string
  color: string
  className: string
}

interface KanbanColumnProps {
  column: ColumnConfig
  leads: Lead[]
  isOver?: boolean
  onAddLead?: (status: LeadStatus) => void
}

const COLUMN_ACCENT: Record<LeadStatus, string> = {
  'new':          'border-t-blue-500',
  'contacted':    'border-t-purple-500',
  'follow-up':    'border-t-amber-500',
  'site-visit':   'border-t-orange-500',
  'negotiation':  'border-t-pink-500',
  'closed':       'border-t-emerald-500',
  'lost':         'border-t-gray-500',
}

const COLUMN_GLOW: Record<LeadStatus, string> = {
  'new':          'ring-blue-500/25',
  'contacted':    'ring-purple-500/25',
  'follow-up':    'ring-amber-500/25',
  'site-visit':   'ring-orange-500/25',
  'negotiation':  'ring-pink-500/25',
  'closed':       'ring-emerald-500/25',
  'lost':         'ring-gray-500/20',
}

const COUNT_COLOR: Record<LeadStatus, string> = {
  'new':          'bg-blue-500/15 text-blue-400',
  'contacted':    'bg-purple-500/15 text-purple-400',
  'follow-up':    'bg-amber-500/15 text-amber-400',
  'site-visit':   'bg-orange-500/15 text-orange-400',
  'negotiation':  'bg-pink-500/15 text-pink-400',
  'closed':       'bg-emerald-500/15 text-emerald-400',
  'lost':         'bg-gray-500/15 text-gray-400',
}

const DOT_COLOR: Record<LeadStatus, string> = {
  'new':          'bg-blue-500',
  'contacted':    'bg-purple-500',
  'follow-up':    'bg-amber-500',
  'site-visit':   'bg-orange-500',
  'negotiation':  'bg-pink-500',
  'closed':       'bg-emerald-500',
  'lost':         'bg-gray-500',
}

export function KanbanColumn({ column, leads, isOver, onAddLead }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })

  const totalBudget = leads.reduce((sum, l) => sum + (l.budget || 0), 0)

  return (
    <div
      className={cn(
        // Width: 300px gives comfortable card layout while fitting ~4 columns before scroll
        'flex-shrink-0 w-[300px] flex flex-col rounded-2xl',
        'border border-white/6 border-t-2',
        'bg-[rgba(10,18,40,0.72)] backdrop-blur-xl',
        COLUMN_ACCENT[column.id],
        // Drop-target highlight ring
        isOver && `ring-2 ring-inset ${COLUMN_GLOW[column.id]} border-white/10 bg-[rgba(10,18,40,0.85)]`,
        'transition-all duration-200',
        // Key fix: max-h constrains the column so it scrolls internally
        // rather than growing to push the board off-screen
        'max-h-[calc(100vh-300px)]',
      )}
    >
      {/* ── Header — always visible, never scrolls ────────────────── */}
      <div className="flex-shrink-0 px-4 py-3.5 border-b border-white/6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[13px] font-semibold text-white/90 tracking-tight leading-none">
              {column.title}
            </h3>
            <span className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums leading-none',
              COUNT_COLOR[column.id],
            )}>
              {leads.length}
            </span>
          </div>

          {onAddLead && (
            <button
              onClick={() => onAddLead(column.id)}
              className={cn(
                'w-6 h-6 rounded-lg flex items-center justify-center',
                'bg-white/4 hover:bg-white/12',
                'text-white/25 hover:text-white/75',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20',
              )}
              title={`Add lead to ${column.title}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Total pipeline value for this stage */}
        {totalBudget > 0 && (
          <p className="text-[11px] text-white/25 leading-none">
            <span className="text-white/45 font-medium">{formatCurrency(totalBudget)}</span>
            {' '}pipeline
          </p>
        )}
      </div>

      {/* ── Card list — scrollable, fills remaining column height ──── */}
      <div
        ref={setNodeRef}
        className={cn(
          // flex-1 + min-h-0 is the key CSS pattern for a scrollable flex child
          'flex-1 min-h-0 overflow-y-auto',
          'p-3 space-y-2.5',
          // Thin, styled scrollbar — subtle enough to not distract,
          // visible enough to communicate that this area scrolls
          '[&::-webkit-scrollbar]:w-[3px]',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-white/10',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb:hover]:bg-white/30',
          isOver && 'bg-white/[0.015]',
          'transition-colors duration-200',
        )}
      >
        <SortableContext
          items={leads.map(l => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence initial={false}>
            {leads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                <KanbanCard lead={lead} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>

        {/* Empty drop zone */}
        {leads.length === 0 && (
          <div className={cn(
            'flex flex-col items-center justify-center gap-2',
            'h-24 rounded-xl border-2 border-dashed',
            isOver
              ? 'border-white/20 bg-white/[0.03]'
              : 'border-white/6',
            'transition-all duration-200',
          )}>
            <div className={cn('w-1.5 h-1.5 rounded-full opacity-40', DOT_COLOR[column.id])} />
            <span className="text-[11px] text-white/20">
              {isOver ? 'Release to drop here' : 'No leads'}
            </span>
          </div>
        )}

        {/* Breathing room at the bottom of the scroll area */}
        <div className="h-2" aria-hidden />
      </div>
    </div>
  )
}