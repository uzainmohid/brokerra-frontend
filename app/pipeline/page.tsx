'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, LayoutGrid, List } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { KanbanBoard } from '@/components/pipeline/kanban-board'
import { PipelineStatsBar } from '@/components/pipeline/pipeline-stats-bar'
import { LeadFormModal } from '@/components/leads/lead-form-modal'
import { leadsApi } from '@/lib/api'
import { Lead, LeadStatus } from '@/types'
import { PIPELINE_COLUMNS } from '@/utils'
import { toast } from 'sonner'

// Build lead map from flat array
function buildLeadMap(leads: Lead[]) {
  const map: Record<LeadStatus, Lead[]> = {
    'new': [], 'contacted': [], 'follow-up': [],
    'site-visit': [], 'negotiation': [], 'closed': [], 'lost': [],
  }
  leads.forEach(l => { if (map[l.status]) map[l.status].push(l) })
  return map
}

// Mock data mirroring kanban-board.tsx so stats show correctly before API loads
const MOCK_INITIAL: Lead[] = [
  { id: 'k1', name: 'Ravi Shankar',  phone: '+91 98100 00001', status: 'new',         temperature: 'warm', source: 'instagram',       budget: 6500000,  location: 'Andheri East',   propertyType: '2BHK',              createdAt: '', updatedAt: '' },
  { id: 'k2', name: 'Deepa Nair',    phone: '+91 98100 00002', status: 'new',         temperature: 'cold', source: 'website',         budget: 4200000,  location: 'Thane',          propertyType: '1BHK',              createdAt: '', updatedAt: '' },
  { id: 'k3', name: 'Amit Desai',    phone: '+91 98100 00003', status: 'contacted',   temperature: 'hot',  source: 'referral',        budget: 15000000, location: 'Juhu, Mumbai',   propertyType: '4BHK',              createdAt: '', updatedAt: '' },
  { id: 'k4', name: 'Sneha Joshi',   phone: '+91 98100 00004', status: 'contacted',   temperature: 'warm', source: 'property-portal', budget: 8800000,  location: 'Powai',          propertyType: '3BHK',              createdAt: '', updatedAt: '' },
  { id: 'k5', name: 'Kiran Patel',   phone: '+91 98100 00005', status: 'follow-up',   temperature: 'hot',  source: 'whatsapp',        budget: 12000000, location: 'Bandra West',    propertyType: '3BHK',              createdAt: '', updatedAt: '' },
  { id: 'k6', name: 'Meena Iyer',    phone: '+91 98100 00006', status: 'follow-up',   temperature: 'warm', source: 'cold-call',       budget: 7500000,  location: 'Malad West',     propertyType: '2BHK',              createdAt: '', updatedAt: '' },
  { id: 'k7', name: 'Rajesh Kumar',  phone: '+91 98765 43210', status: 'site-visit',  temperature: 'hot',  source: 'referral',        budget: 18500000, location: 'Bandra West',    propertyType: '3BHK Sea-facing',   createdAt: '', updatedAt: '' },
  { id: 'k8', name: 'Priya Mehta',   phone: '+91 87654 32109', status: 'site-visit',  temperature: 'hot',  source: 'instagram',       budget: 9500000,  location: 'Powai, Mumbai',  propertyType: '2BHK Lake View',    createdAt: '', updatedAt: '' },
  { id: 'k9', name: 'Suresh Menon',  phone: '+91 98100 00009', status: 'negotiation', temperature: 'hot',  source: 'walk-in',         budget: 22000000, location: 'Worli, Mumbai',  propertyType: '4BHK',              createdAt: '', updatedAt: '' },
  { id: 'k10', name: 'Anita Sharma', phone: '+91 98100 00010', status: 'closed',      temperature: 'hot',  source: 'referral',        budget: 13500000, location: 'Goregaon West',  propertyType: '3BHK',              createdAt: '', updatedAt: '' },
  { id: 'k11', name: 'Vikram Nair',  phone: '+91 98100 00011', status: 'closed',      temperature: 'warm', source: 'property-portal', budget: 9800000,  location: 'Kandivali East', propertyType: '2BHK',              createdAt: '', updatedAt: '' },
  { id: 'k12', name: 'Farhan Ali',   phone: '+91 98100 00012', status: 'lost',        temperature: 'cold', source: 'cold-call',       budget: 5500000,  location: 'Navi Mumbai',    propertyType: '1BHK',              createdAt: '', updatedAt: '' },
]

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_INITIAL)
  const [loading, setLoading] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addStatus, setAddStatus] = useState<LeadStatus>('new')

  // Try to load real leads
  useEffect(() => {
    setLoading(true)
    leadsApi.getLeads({ limit: 200 })
      .then(res => { if (res.data?.length) setLeads(res.data) })
      .catch(() => {/* use mock */})
      .finally(() => setLoading(false))
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const res = await leadsApi.getLeads({ limit: 200 })
      if (res.data?.length) setLeads(res.data)
      toast.success('Pipeline refreshed')
    } catch {
      toast.error('Failed to refresh')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLead = (status: LeadStatus) => {
    setAddStatus(status)
    setAddOpen(true)
  }

  const handleLeadAdded = (lead: Lead) => {
    setLeads(prev => [lead, ...prev])
  }

  const leadMap = buildLeadMap(leads)

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Pipeline Board"
        subtitle="Drag and drop leads across stages"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
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
        {/* Pipeline summary stats */}
        <PipelineStatsBar leadMap={leadMap} />

        {/* Instructions hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-xs text-white/25"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Drag cards between columns to update lead stage · Scroll horizontally to see all columns · Click a card to open full detail</span>
        </motion.div>

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden -mx-1 px-1">
          <KanbanBoard
            initialLeads={leads}
            onAddLead={handleAddLead}
          />
        </div>
      </div>

      {/* Add lead modal */}
      <LeadFormModal
        open={addOpen}
        onOpenChange={setAddOpen}
        lead={{ status: addStatus } as Lead}
        onSuccess={handleLeadAdded}
      />
    </PageTransition>
  )
}
