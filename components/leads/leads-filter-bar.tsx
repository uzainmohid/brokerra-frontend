'use client'

import React from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LeadFilters } from '@/types'
import { cn } from '@/lib/utils'

interface LeadsFilterBarProps {
  filters: LeadFilters
  onFiltersChange: (f: Partial<LeadFilters>) => void
  total: number
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow-up', label: 'Follow Up' },
  { value: 'site-visit', label: 'Site Visit' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed', label: 'Closed' },
  { value: 'lost', label: 'Lost' },
]

const TEMP_OPTIONS = [
  { value: 'all', label: 'All Temps' },
  { value: 'hot', label: '🔥 Hot' },
  { value: 'warm', label: '⚡ Warm' },
  { value: 'cold', label: '❄️ Cold' },
]

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'property-portal', label: 'Property Portal' },
  { value: 'cold-call', label: 'Cold Call' },
  { value: 'walk-in', label: 'Walk In' },
]

export function LeadsFilterBar({ filters, onFiltersChange, total }: LeadsFilterBarProps) {
  const hasActiveFilters =
    filters.search ||
    (filters.status && filters.status !== 'all') ||
    (filters.temperature && filters.temperature !== 'all') ||
    (filters.source && filters.source !== 'all')

  return (
    <div className="space-y-3">
      {/* Search + filter row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Search by name, phone, location…"
            icon={<Search className="w-4 h-4" />}
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
          />
        </div>

        {/* Status filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={(v) => onFiltersChange({ status: v as LeadFilters['status'] })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Temperature filter */}
        <Select
          value={filters.temperature || 'all'}
          onValueChange={(v) => onFiltersChange({ temperature: v as LeadFilters['temperature'] })}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMP_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source filter */}
        <Select
          value={filters.source || 'all'}
          onValueChange={(v) => onFiltersChange({ source: v as LeadFilters['source'] })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({ search: '', status: 'all', temperature: 'all', source: 'all' })}
            className="gap-1.5 text-white/50 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}

        {/* Result count */}
        <span className="text-sm text-white/30 ml-auto">
          {total} lead{total !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
