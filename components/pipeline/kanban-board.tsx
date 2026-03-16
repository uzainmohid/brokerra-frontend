// 'use client'

// import React, { useState, useCallback } from 'react'
// import {
//   DndContext,
//   DragOverlay,
//   PointerSensor,
//   KeyboardSensor,
//   useSensor,
//   useSensors,
//   DragStartEvent,
//   DragOverEvent,
//   DragEndEvent,
//   closestCorners,
//   defaultDropAnimationSideEffects,
//   DropAnimation,
// } from '@dnd-kit/core'
// import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
// import { motion } from 'framer-motion'
// import { KanbanColumn } from './kanban-column'
// import { KanbanCard } from './kanban-card'
// import { Lead, LeadStatus } from '@/types'
// import { PIPELINE_COLUMNS } from '@/utils'
// import { leadsApi } from '@/lib/api'
// import { toast } from 'sonner'

// // Seed mock leads across columns
// const MOCK_LEADS: Lead[] = [
//   // New
//   {
//     id: 'k1', name: 'Ravi Shankar', phone: '+91 98100 00001', status: 'new', temperature: 'warm',
//     source: 'instagram', budget: 6500000, location: 'Andheri East', propertyType: '2BHK',
//     createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
//   },
//   {
//     id: 'k2', name: 'Deepa Nair', phone: '+91 98100 00002', status: 'new', temperature: 'cold',
//     source: 'website', budget: 4200000, location: 'Thane', propertyType: '1BHK',
//     createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
//   },
//   // Contacted
//   {
//     id: 'k3', name: 'Amit Desai', phone: '+91 98100 00003', status: 'contacted', temperature: 'hot',
//     source: 'referral', budget: 15000000, location: 'Juhu, Mumbai', propertyType: '4BHK',
//     createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
//   },
//   {
//     id: 'k4', name: 'Sneha Joshi', phone: '+91 98100 00004', status: 'contacted', temperature: 'warm',
//     source: 'property-portal', budget: 8800000, location: 'Powai', propertyType: '3BHK',
//     createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
//   },
//   // Follow-up
//   {
//     id: 'k5', name: 'Kiran Patel', phone: '+91 98100 00005', status: 'follow-up', temperature: 'hot',
//     source: 'whatsapp', budget: 12000000, location: 'Bandra West', propertyType: '3BHK',
//     createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
//     nextFollowUpAt: new Date(Date.now() - 3600000 * 5).toISOString(),
//   },
//   {
//     id: 'k6', name: 'Meena Iyer', phone: '+91 98100 00006', status: 'follow-up', temperature: 'warm',
//     source: 'cold-call', budget: 7500000, location: 'Malad West', propertyType: '2BHK',
//     createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
//   },
//   // Site visit
//   {
//     id: 'k7', name: 'Rajesh Kumar', phone: '+91 98765 43210', status: 'site-visit', temperature: 'hot',
//     source: 'referral', budget: 18500000, location: 'Bandra West', propertyType: '3BHK Sea-facing',
//     createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
//     nextFollowUpAt: new Date(Date.now() + 3600000 * 48).toISOString(),
//   },
//   {
//     id: 'k8', name: 'Priya Mehta', phone: '+91 87654 32109', status: 'site-visit', temperature: 'hot',
//     source: 'instagram', budget: 9500000, location: 'Powai, Mumbai', propertyType: '2BHK Lake View',
//     createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
//   },
//   // Negotiation
//   {
//     id: 'k9', name: 'Suresh Menon', phone: '+91 98100 00009', status: 'negotiation', temperature: 'hot',
//     source: 'walk-in', budget: 22000000, location: 'Worli, Mumbai', propertyType: '4BHK',
//     createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
//     updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
//   },
//   // Closed
//   {
//     id: 'k10', name: 'Anita Sharma', phone: '+91 98100 00010', status: 'closed', temperature: 'hot',
//     source: 'referral', budget: 13500000, location: 'Goregaon West', propertyType: '3BHK',
//     createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
//     updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
//   },
//   {
//     id: 'k11', name: 'Vikram Nair', phone: '+91 98100 00011', status: 'closed', temperature: 'warm',
//     source: 'property-portal', budget: 9800000, location: 'Kandivali East', propertyType: '2BHK',
//     createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
//     updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
//   },
//   // Lost
//   {
//     id: 'k12', name: 'Farhan Ali', phone: '+91 98100 00012', status: 'lost', temperature: 'cold',
//     source: 'cold-call', budget: 5500000, location: 'Navi Mumbai', propertyType: '1BHK',
//     createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
//     updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
//   },
// ]

// type LeadMap = Record<LeadStatus, Lead[]>

// function buildLeadMap(leads: Lead[]): LeadMap {
//   const map: LeadMap = {
//     'new': [], 'contacted': [], 'follow-up': [],
//     'site-visit': [], 'negotiation': [], 'closed': [], 'lost': [],
//   }
//   leads.forEach(l => {
//     if (map[l.status]) map[l.status].push(l)
//   })
//   return map
// }

// const dropAnimation: DropAnimation = {
//   sideEffects: defaultDropAnimationSideEffects({
//     styles: { active: { opacity: '0.4' } },
//   }),
// }

// interface KanbanBoardProps {
//   initialLeads?: Lead[]
//   onAddLead?: (status: LeadStatus) => void
// }

// export function KanbanBoard({ initialLeads = MOCK_LEADS, onAddLead }: KanbanBoardProps) {
//   const [leadMap, setLeadMap] = useState<LeadMap>(() => buildLeadMap(initialLeads))
//   const [activeId, setActiveId] = useState<string | null>(null)
//   const [overId, setOverId] = useState<LeadStatus | null>(null)

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: { distance: 8 },
//     }),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   )

//   // Find which column a lead belongs to
//   const findColumn = useCallback((id: string): LeadStatus | null => {
//     for (const [col, leads] of Object.entries(leadMap)) {
//       if (leads.find(l => l.id === id)) return col as LeadStatus
//     }
//     return null
//   }, [leadMap])

//   // Find the active lead
//   const activeLead = activeId
//     ? Object.values(leadMap).flat().find(l => l.id === activeId)
//     : null

//   const handleDragStart = ({ active }: DragStartEvent) => {
//     setActiveId(active.id as string)
//   }

//   const handleDragOver = ({ active, over }: DragOverEvent) => {
//     if (!over) { setOverId(null); return }

//     const overCol = PIPELINE_COLUMNS.find(c => c.id === over.id)
//     if (overCol) {
//       setOverId(overCol.id)
//       return
//     }

//     const overLeadCol = findColumn(over.id as string)
//     setOverId(overLeadCol)

//     // Move card between columns on drag-over
//     const activeCol = findColumn(active.id as string)
//     if (!activeCol || !overLeadCol || activeCol === overLeadCol) return

//     setLeadMap(prev => {
//       const activeLead = prev[activeCol].find(l => l.id === active.id)
//       if (!activeLead) return prev

//       const overIndex = prev[overLeadCol].findIndex(l => l.id === over.id)
//       const newActiveList = prev[activeCol].filter(l => l.id !== active.id)
//       const newOverList = [...prev[overLeadCol]]
//       newOverList.splice(overIndex >= 0 ? overIndex : newOverList.length, 0, {
//         ...activeLead,
//         status: overLeadCol,
//       })

//       return { ...prev, [activeCol]: newActiveList, [overLeadCol]: newOverList }
//     })
//   }

//   const handleDragEnd = async ({ active, over }: DragEndEvent) => {
//     setActiveId(null)
//     setOverId(null)

//     if (!over) return

//     const activeCol = findColumn(active.id as string)
//     if (!activeCol) return

//     // Dropped onto column header
//     const overCol = PIPELINE_COLUMNS.find(c => c.id === over.id)
//     if (overCol && overCol.id !== activeCol) {
//       setLeadMap(prev => {
//         const lead = prev[activeCol].find(l => l.id === active.id)
//         if (!lead) return prev
//         return {
//           ...prev,
//           [activeCol]: prev[activeCol].filter(l => l.id !== active.id),
//           [overCol.id]: [...prev[overCol.id], { ...lead, status: overCol.id }],
//         }
//       })
//       // Persist to backend
//       try {
//         await leadsApi.updateLead(active.id as string, { status: overCol.id })
//         toast.success(`Moved to ${overCol.title}`)
//       } catch {
//         toast.error('Failed to update lead status')
//       }
//       return
//     }

//     // Reorder within same column
//     const overLeadCol = findColumn(over.id as string)
//     if (overLeadCol && activeCol === overLeadCol) {
//       setLeadMap(prev => {
//         const list = prev[activeCol]
//         const oldIdx = list.findIndex(l => l.id === active.id)
//         const newIdx = list.findIndex(l => l.id === over.id)
//         if (oldIdx === newIdx) return prev
//         return { ...prev, [activeCol]: arrayMove(list, oldIdx, newIdx) }
//       })
//     } else if (overLeadCol && activeCol !== overLeadCol) {
//       // Cross-column drop — already moved in handleDragOver, just persist
//       try {
//         await leadsApi.updateLead(active.id as string, { status: overLeadCol })
//         toast.success(`Moved to ${PIPELINE_COLUMNS.find(c => c.id === overLeadCol)?.title}`)
//       } catch {
//         toast.error('Failed to update lead status')
//       }
//     }
//   }

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCorners}
//       onDragStart={handleDragStart}
//       onDragOver={handleDragOver}
//       onDragEnd={handleDragEnd}
//     >
//       {/* Scrollable board */}
//       <div className="flex gap-4 pb-6 overflow-x-auto no-scrollbar min-h-0">
//         {PIPELINE_COLUMNS.map((col) => (
//           <KanbanColumn
//             key={col.id}
//             column={col}
//             leads={leadMap[col.id] || []}
//             isOver={overId === col.id}
//             onAddLead={onAddLead}
//           />
//         ))}
//       </div>

//       {/* Drag overlay — the floating card while dragging */}
//       <DragOverlay dropAnimation={dropAnimation}>
//         {activeLead ? (
//           <KanbanCard lead={activeLead} overlay />
//         ) : null}
//       </DragOverlay>
//     </DndContext>
//   )
// }

'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
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
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { Lead, LeadStatus } from '@/types'
import { PIPELINE_COLUMNS } from '@/utils'
import { leadsApi } from '@/lib/api'
import { toast } from 'sonner'

const MOCK_LEADS: Lead[] = [
  { id: 'k1',  name: 'Ravi Shankar',  phone: '+91 98100 00001', status: 'new',         temperature: 'warm', source: 'instagram',       budget: 6500000,  location: 'Andheri East',   propertyType: '2BHK',            createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),  updatedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'k2',  name: 'Deepa Nair',    phone: '+91 98100 00002', status: 'new',         temperature: 'cold', source: 'website',         budget: 4200000,  location: 'Thane',          propertyType: '1BHK',            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),  updatedAt: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 'k3',  name: 'Amit Desai',    phone: '+91 98100 00003', status: 'contacted',   temperature: 'hot',  source: 'referral',        budget: 15000000, location: 'Juhu, Mumbai',   propertyType: '4BHK',            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),  updatedAt: new Date(Date.now() - 3600000 * 1).toISOString() },
  { id: 'k4',  name: 'Sneha Joshi',   phone: '+91 98100 00004', status: 'contacted',   temperature: 'warm', source: 'property-portal', budget: 8800000,  location: 'Powai',          propertyType: '3BHK',            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),  updatedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'k5',  name: 'Kiran Patel',   phone: '+91 98100 00005', status: 'follow-up',   temperature: 'hot',  source: 'whatsapp',        budget: 12000000, location: 'Bandra West',    propertyType: '3BHK',            createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),  updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(), nextFollowUpAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'k6',  name: 'Meena Iyer',    phone: '+91 98100 00006', status: 'follow-up',   temperature: 'warm', source: 'cold-call',       budget: 7500000,  location: 'Malad West',     propertyType: '2BHK',            createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),  updatedAt: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 'k7',  name: 'Rajesh Kumar',  phone: '+91 98765 43210', status: 'site-visit',  temperature: 'hot',  source: 'referral',        budget: 18500000, location: 'Bandra West',    propertyType: '3BHK Sea-facing', createdAt: new Date(Date.now() - 86400000 * 12).toISOString(), updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),  nextFollowUpAt: new Date(Date.now() + 3600000 * 48).toISOString() },
  { id: 'k8',  name: 'Priya Mehta',   phone: '+91 87654 32109', status: 'site-visit',  temperature: 'hot',  source: 'instagram',       budget: 9500000,  location: 'Powai, Mumbai',  propertyType: '2BHK Lake View',  createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),  updatedAt: new Date(Date.now() - 3600000 * 1).toISOString() },
  { id: 'k9',  name: 'Suresh Menon',  phone: '+91 98100 00009', status: 'negotiation', temperature: 'hot',  source: 'walk-in',         budget: 22000000, location: 'Worli, Mumbai',  propertyType: '4BHK',            createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), updatedAt: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'k10', name: 'Anita Sharma',  phone: '+91 98100 00010', status: 'closed',      temperature: 'hot',  source: 'referral',        budget: 13500000, location: 'Goregaon West',  propertyType: '3BHK',            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'k11', name: 'Vikram Nair',   phone: '+91 98100 00011', status: 'closed',      temperature: 'warm', source: 'property-portal', budget: 9800000,  location: 'Kandivali East', propertyType: '2BHK',            createdAt: new Date(Date.now() - 86400000 * 25).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'k12', name: 'Farhan Ali',    phone: '+91 98100 00012', status: 'lost',        temperature: 'cold', source: 'cold-call',       budget: 5500000,  location: 'Navi Mumbai',    propertyType: '1BHK',            createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 7).toISOString() },
]

type LeadMap = Record<LeadStatus, Lead[]>

function buildLeadMap(leads: Lead[]): LeadMap {
  const map: LeadMap = {
    'new': [], 'contacted': [], 'follow-up': [],
    'site-visit': [], 'negotiation': [], 'closed': [], 'lost': [],
  }
  leads.forEach(l => { if (map[l.status]) map[l.status].push(l) })
  return map
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
}

interface KanbanBoardProps {
  initialLeads?: Lead[]
  onAddLead?: (status: LeadStatus) => void
}

export function KanbanBoard({ initialLeads = MOCK_LEADS, onAddLead }: KanbanBoardProps) {
  const [leadMap, setLeadMap] = useState<LeadMap>(() => buildLeadMap(initialLeads))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<LeadStatus | null>(null)

  // ── Scroll-fade edge indicators ────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)

  const updateFades = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 8)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    updateFades()
    window.addEventListener('resize', updateFades)
    return () => window.removeEventListener('resize', updateFades)
  }, [updateFades, leadMap])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const findColumn = useCallback((id: string): LeadStatus | null => {
    for (const [col, leads] of Object.entries(leadMap)) {
      if (leads.find(l => l.id === id)) return col as LeadStatus
    }
    return null
  }, [leadMap])

  const activeLead = activeId
    ? Object.values(leadMap).flat().find(l => l.id === activeId)
    : null

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as string)

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) { setOverId(null); return }
    const overCol = PIPELINE_COLUMNS.find(c => c.id === over.id)
    if (overCol) { setOverId(overCol.id); return }
    const overLeadCol = findColumn(over.id as string)
    setOverId(overLeadCol)
    const activeCol = findColumn(active.id as string)
    if (!activeCol || !overLeadCol || activeCol === overLeadCol) return
    setLeadMap(prev => {
      const activeLead = prev[activeCol].find(l => l.id === active.id)
      if (!activeLead) return prev
      const overIndex = prev[overLeadCol].findIndex(l => l.id === over.id)
      const newActiveList = prev[activeCol].filter(l => l.id !== active.id)
      const newOverList = [...prev[overLeadCol]]
      newOverList.splice(overIndex >= 0 ? overIndex : newOverList.length, 0, {
        ...activeLead, status: overLeadCol,
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
      try {
        await leadsApi.updateLead(active.id as string, { status: overCol.id })
        toast.success(`Moved to ${overCol.title}`)
      } catch { toast.error('Failed to update lead status') }
      return
    }
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
      try {
        await leadsApi.updateLead(active.id as string, { status: overLeadCol })
        toast.success(`Moved to ${PIPELINE_COLUMNS.find(c => c.id === overLeadCol)?.title}`)
      } catch { toast.error('Failed to update lead status') }
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
      {/* Outer wrapper — positions the scroll-fade overlays */}
      <div className="relative h-full">

        {/* Left scroll-fade — appears once user has scrolled right */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: showLeftFade ? 1 : 0,
            background: 'linear-gradient(to right, #080f20 0%, transparent 100%)',
          }}
        />

        {/* Right scroll-fade — appears when more columns exist beyond viewport */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: showRightFade ? 1 : 0,
            background: 'linear-gradient(to left, #080f20 0%, transparent 100%)',
          }}
        />

        {/* Scrollable board — hidden scrollbar, fades act as the visual indicator */}
        <div
          ref={scrollRef}
          onScroll={updateFades}
          className="flex gap-5 h-full pb-4 overflow-x-auto overflow-y-hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            // Smooth momentum scrolling on iOS
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {PIPELINE_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              leads={leadMap[col.id] || []}
              isOver={overId === col.id}
              onAddLead={onAddLead}
            />
          ))}
          {/* Trailing spacer — last column clears the right fade overlay */}
          <div className="flex-shrink-0 w-4" aria-hidden />
        </div>
      </div>

      {/* Drag overlay — the card that floats under the cursor */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeLead ? <KanbanCard lead={activeLead} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}