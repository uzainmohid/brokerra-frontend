'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, LayoutGrid } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { KanbanBoard } from '@/components/pipeline/kanban-board'
import { PipelineStatsBar } from '@/components/pipeline/pipeline-stats-bar'
import { LeadFormModal } from '@/components/leads/lead-form-modal'
import { leadsApi } from '@/lib/api'
import { Lead, LeadStatus } from '@/types'
import { toast } from 'sonner'

// ── Single source of truth: build lead map from flat leads array ──────────────
function buildLeadMap(leads: Lead[]): Record<LeadStatus, Lead[]> {
  const map: Record<LeadStatus, Lead[]> = {
    'new': [], 'contacted': [], 'follow-up': [],
    'site-visit': [], 'negotiation': [], 'closed': [], 'lost': [],
  }
  leads.forEach(l => { if (map[l.status]) map[l.status].push(l) })
  return map
}

export default function PipelinePage() {
  // ── NO mock data. Start empty, fetch real data immediately. ──────────────
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)  // true on first load
  const [addOpen, setAddOpen] = useState(false)
  const [addStatus, setAddStatus] = useState<LeadStatus>('new')

  const fetchLeads = useCallback(async (showToast = false) => {
    setLoading(true)
    try {
      const res = await leadsApi.getLeads({ limit: 500 })
      // Support both { data: Lead[] } and Lead[] response shapes
      const fetched: Lead[] = Array.isArray(res) ? res : (res.data ?? [])
      setLeads(fetched)
      if (showToast) toast.success('Pipeline refreshed')
    } catch {
      if (showToast) toast.error('Failed to refresh pipeline')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount
  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleRefresh = () => fetchLeads(true)

  const handleAddLead = (status: LeadStatus) => {
    setAddStatus(status)
    setAddOpen(true)
  }

  // When a lead is created via the modal, add it to local state immediately
  // so the board updates without a full refetch
  const handleLeadAdded = (lead: Lead) => {
    setLeads(prev => [lead, ...prev])
  }

  // ── leadMap is always derived from real leads ─────────────────────────────
  const leadMap = buildLeadMap(leads)

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Pipeline Board"
        subtitle={
          loading
            ? 'Loading pipeline...'
            : `${leads.length} lead${leads.length !== 1 ? 's' : ''} across all stages`
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className={loading ? 'opacity-60' : ''}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" onClick={() => handleAddLead('new')} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden px-8 py-5 space-y-4">

        {/* Stats bar — always shows real counts */}
        <PipelineStatsBar leadMap={leadMap} />

        {/* Hint bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 text-xs text-white/25"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>
            Drag cards between columns to update lead stage · Scroll horizontally to see all columns · Click a card to open full detail
          </span>
        </motion.div>

        {/* Loading skeleton */}
        {loading && leads.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
              <p className="text-sm text-white/30">Loading your pipeline...</p>
            </div>
          </div>
        ) : (
          /* Kanban board — key forces a clean re-mount when data first arrives,
             preventing the stale-initialState problem */
          <div className="flex-1 overflow-x-auto overflow-y-hidden -mx-1 px-1">
            <KanbanBoard
              key={leads.length === 0 ? 'empty' : 'loaded'}
              initialLeads={leads}
              onAddLead={handleAddLead}
              onLeadsChange={setLeads}
            />
          </div>
        )}
      </div>

      <LeadFormModal
        open={addOpen}
        onOpenChange={setAddOpen}
        lead={{ status: addStatus } as Lead}
        onSuccess={handleLeadAdded}
      />
    </PageTransition>
  )
}
