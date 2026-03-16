'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lead, LeadFilters, PaginatedResponse } from '@/types'
import { leadsApi } from '@/lib/api'
import { toast } from 'sonner'

export function useLeads(initialFilters?: LeadFilters) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  })

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await leadsApi.getLeads(filters)
      setLeads(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError('Failed to load leads')
      toast.error('Failed to load leads')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const updateFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const updatePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const deleteLead = useCallback(async (id: string) => {
    try {
      await leadsApi.deleteLead(id)
      setLeads((prev) => prev.filter((l) => l.id !== id))
      setTotal((prev) => prev - 1)
      toast.success('Lead deleted')
    } catch {
      toast.error('Failed to delete lead')
    }
  }, [])

  const updateLead = useCallback(async (id: string, data: Partial<Lead>) => {
    try {
      const updated = await leadsApi.updateLead(id, data)
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
      toast.success('Lead updated')
      return updated
    } catch {
      toast.error('Failed to update lead')
      throw new Error('Update failed')
    }
  }, [])

  return {
    leads,
    total,
    totalPages,
    isLoading,
    error,
    filters,
    updateFilters,
    updatePage,
    refetch: fetchLeads,
    deleteLead,
    updateLead,
  }
}
