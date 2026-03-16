'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, RefreshCw } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { LeadsFilterBar } from '@/components/leads/leads-filter-bar'
import { LeadsTable } from '@/components/leads/leads-table'
import { LeadFormModal } from '@/components/leads/lead-form-modal'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useLeads } from '@/hooks/use-leads'
import { Lead } from '@/types'
import { exportApi } from '@/lib/api'
import { downloadBlob } from '@/utils'
import { toast } from 'sonner'

export default function LeadsPage() {
  const {
    leads, total, isLoading, filters,
    updateFilters, updatePage, refetch,
    deleteLead, updateLead,
  } = useLeads({ limit: 20 })

  const [addOpen, setAddOpen] = useState(false)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    await deleteLead(deleteId)
    setDeleteLoading(false)
    setDeleteId(null)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportApi.exportLeadsCsv()
      downloadBlob(blob, `brokerra-leads-${new Date().toISOString().slice(0, 10)}.csv`)
      toast.success('Leads exported successfully')
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  const handleLeadSuccess = (lead: Lead) => {
    refetch()
    setEditLead(null)
  }

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Leads"
        subtitle={`${total} total leads in your pipeline`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              loading={exporting}
              className="gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        }
      />

      <ScrollArea className="flex-1">
        <div className="px-8 py-6 space-y-5 pb-10">
          {/* Pipeline stage quick-stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2"
          >
            {[
              { label: 'New', count: 48, color: 'bg-blue-500/15 border-blue-500/20 text-blue-400' },
              { label: 'Contacted', count: 62, color: 'bg-purple-500/15 border-purple-500/20 text-purple-400' },
              { label: 'Follow Up', count: 34, color: 'bg-amber-500/15 border-amber-500/20 text-amber-400' },
              { label: 'Site Visit', count: 28, color: 'bg-orange-500/15 border-orange-500/20 text-orange-400' },
              { label: 'Negotiation', count: 19, color: 'bg-pink-500/15 border-pink-500/20 text-pink-400' },
              { label: 'Closed', count: 34, color: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' },
              { label: 'Lost', count: 59, color: 'bg-gray-500/15 border-gray-500/20 text-gray-400' },
            ].map((stage) => (
              <button
                key={stage.label}
                onClick={() => updateFilters({ status: stage.label.toLowerCase().replace(' ', '-') as any })}
                className={`flex flex-col items-center py-2.5 px-2 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-105 ${stage.color}`}
              >
                <span className="text-xl font-bold">{stage.count}</span>
                <span className="text-[10px] font-medium opacity-80 mt-0.5">{stage.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Filters */}
          <LeadsFilterBar
            filters={filters}
            onFiltersChange={updateFilters}
            total={total}
          />

          {/* Table */}
          <LeadsTable
            leads={leads}
            isLoading={isLoading}
            total={total}
            filters={filters}
            onPageChange={updatePage}
            onDelete={(id) => setDeleteId(id)}
            onEdit={(lead) => setEditLead(lead)}
          />
        </div>
      </ScrollArea>

      {/* Add lead modal */}
      <LeadFormModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={handleLeadSuccess}
      />

      {/* Edit lead modal */}
      {editLead && (
        <LeadFormModal
          open={!!editLead}
          onOpenChange={(o) => !o && setEditLead(null)}
          lead={editLead}
          onSuccess={handleLeadSuccess}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete Lead"
        description="This will permanently delete the lead and all associated activity. This cannot be undone."
        onConfirm={handleDelete}
        loading={deleteLoading}
        confirmLabel="Delete Lead"
        variant="destructive"
      />
    </PageTransition>
  )
}
