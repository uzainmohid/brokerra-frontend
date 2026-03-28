'use client'

import React, { useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  closestCorners,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { Lead, LeadStatus } from '@/types'
import { PIPELINE_COLUMNS } from '@/utils'
import { leadsApi } from '@/lib/api'
import { toast } from 'sonner'

// Seed mock leads across columns

type LeadMap = Record<LeadStatus, Lead[]>

function buildLeadMap(leads: Lead[]): LeadMap {
  const map: LeadMap = {
    'new': [], 'contacted': [], 'follow-up': [],
    'site-visit': [], 'negotiation': [], 'closed': [], 'lost': [],
  }
  leads.forEach(l => {
    if (map[l.status]) map[l.status].push(l)
  })
  return map
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: '0.4' } },
  }),
}

interface KanbanBoardProps {
  initialLeads?: Lead[]
  onAddLead?: (status: LeadStatus) => void
  onLeadsChange?: (leads: Lead[]) => void
}

export function KanbanBoard({ initialLeads = [], onAddLead, onLeadsChange }: KanbanBoardProps) {
  const [leadMap, setLeadMap] = useState<LeadMap>(() => buildLeadMap(initialLeads))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<LeadStatus | null>(null)

  // Sync internal leadMap when parent updates initialLeads prop.
  // This is intentionally limited to initial load sync only —
  // drag-and-drop mutations are handled internally via handleDragEnd.
  useEffect(() => {
    setLeadMap(buildLeadMap(initialLeads))
  }, [initialLeads]) // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Find which column a lead belongs to
  const findColumn = useCallback((id: string): LeadStatus | null => {
    for (const [col, leads] of Object.entries(leadMap)) {
      if (leads.find(l => l.id === id)) return col as LeadStatus
    }
    return null
  }, [leadMap])

  // Find the active lead
  const activeLead = activeId
    ? Object.values(leadMap).flat().find(l => l.id === activeId)
    : null

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) { setOverId(null); return }

    const overCol = PIPELINE_COLUMNS.find(c => c.id === over.id)
    if (overCol) {
      setOverId(overCol.id)
      return
    }

    const overLeadCol = findColumn(over.id as string)
    setOverId(overLeadCol)

    // Move card between columns on drag-over
    const activeCol = findColumn(active.id as string)
    if (!activeCol || !overLeadCol || activeCol === overLeadCol) return

    setLeadMap(prev => {
      const activeLead = prev[activeCol].find(l => l.id === active.id)
      if (!activeLead) return prev

      const overIndex = prev[overLeadCol].findIndex(l => l.id === over.id)
      const newActiveList = prev[activeCol].filter(l => l.id !== active.id)
      const newOverList = [...prev[overLeadCol]]
      newOverList.splice(overIndex >= 0 ? overIndex : newOverList.length, 0, {
        ...activeLead,
        status: overLeadCol,
      })

      return { ...prev, [activeCol]: newActiveList, [overLeadCol]: newOverList }
    })
  }

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setOverId(null)

    if (!over) return

    const activeCol = findColumn(active.id as string)
    if (!activeCol) return

    // Dropped onto column header
    const overCol = PIPELINE_COLUMNS.find(c => c.id === over.id)
    if (overCol && overCol.id !== activeCol) {
      setLeadMap(prev => {
        const lead = prev[activeCol].find(l => l.id === active.id)
        if (!lead) return prev
        return {
          ...prev,
          [activeCol]: prev[activeCol].filter(l => l.id !== active.id),
          [overCol.id]: [...prev[overCol.id], { ...lead, status: overCol.id }],
        }
      })
      // Persist to backend
      try {
        await leadsApi.updateLead(active.id as string, { status: overCol.id })
        toast.success(`Moved to ${overCol.title}`)
      } catch {
        toast.error('Failed to update lead status')
      }
      return
    }

    // Reorder within same column
    const overLeadCol = findColumn(over.id as string)
    if (overLeadCol && activeCol === overLeadCol) {
      setLeadMap(prev => {
        const list = prev[activeCol]
        const oldIdx = list.findIndex(l => l.id === active.id)
        const newIdx = list.findIndex(l => l.id === over.id)
        if (oldIdx === newIdx) return prev
        return { ...prev, [activeCol]: arrayMove(list, oldIdx, newIdx) }
      })
    } else if (overLeadCol && activeCol !== overLeadCol) {
      // Cross-column drop — already moved in handleDragOver, just persist
      try {
        await leadsApi.updateLead(active.id as string, { status: overLeadCol })
        toast.success(`Moved to ${PIPELINE_COLUMNS.find(c => c.id === overLeadCol)?.title}`)
      } catch {
        toast.error('Failed to update lead status')
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Scrollable board */}
      <div className="flex gap-4 pb-6 overflow-x-auto no-scrollbar min-h-0">
        {PIPELINE_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            leads={leadMap[col.id] || []}
            isOver={overId === col.id}
            onAddLead={onAddLead}
          />
        ))}
      </div>

      {/* Drag overlay — the floating card while dragging */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeLead ? (
          <KanbanCard lead={activeLead} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
