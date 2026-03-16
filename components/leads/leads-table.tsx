'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp, ChevronDown, ChevronRight,
  MoreHorizontal, Edit2, Trash2, Eye,
  Phone, MessageSquare, ArrowUpDown,
} from 'lucide-react'
import Link from 'next/link'
import { Lead, LeadFilters } from '@/types'
import { StatusBadge, TempBadge, SourceBadge } from '@/components/shared/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency, formatRelative, getInitials } from '@/utils'
import { cn } from '@/lib/utils'

const AVATAR_GRADIENTS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
  'from-amber-600 to-orange-500',
  'from-red-500 to-rose-500',
  'from-indigo-600 to-blue-500',
]

type SortKey = 'name' | 'createdAt' | 'budget' | 'updatedAt'

interface LeadsTableProps {
  leads: Lead[]
  isLoading: boolean
  total: number
  filters: LeadFilters
  onPageChange: (page: number) => void
  onDelete: (id: string) => void
  onEdit: (lead: Lead) => void
}

interface SortState { key: SortKey; dir: 'asc' | 'desc' }

const COLUMNS = [
  { key: 'name' as SortKey, label: 'Lead', sortable: true },
  { key: null, label: 'Status' },
  { key: null, label: 'Source' },
  { key: 'budget' as SortKey, label: 'Budget', sortable: true },
  { key: null, label: 'Location' },
  { key: 'updatedAt' as SortKey, label: 'Last Activity', sortable: true },
  { key: null, label: '' },
]

export function LeadsTable({
  leads, isLoading, total, filters, onPageChange, onDelete, onEdit,
}: LeadsTableProps) {
  const [sort, setSort] = useState<SortState>({ key: 'updatedAt', dir: 'desc' })

  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const totalPages = Math.ceil(total / limit)

  const handleSort = (key: SortKey) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' }
    )
  }

  const SortIcon = ({ col }: { col: typeof COLUMNS[0] }) => {
    if (!col.sortable) return null
    const active = sort.key === col.key
    return (
      <span className={cn('ml-1 inline-flex', active ? 'text-emerald-400' : 'text-white/20')}>
        {active
          ? sort.dir === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />
          : <ArrowUpDown className="w-3.5 h-3.5" />
        }
      </span>
    )
  }

  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-white/6">
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  onClick={() => col.sortable && col.key && handleSort(col.key)}
                  className={cn(
                    'text-left px-4 py-3.5 text-[11px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap',
                    col.sortable && 'cursor-pointer hover:text-white/60 select-none transition-colors',
                    i === 0 && 'pl-5',
                    i === COLUMNS.length - 1 && 'pr-5 w-12'
                  )}
                >
                  {col.label}
                  {col.sortable && col.key && <SortIcon col={col} />}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/3">
            {isLoading
              ? [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-32" />
                          <Skeleton className="h-2.5 w-24" />
                        </div>
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <Skeleton className="h-3 w-20" />
                      </td>
                    ))}
                    <td className="px-4 py-4" />
                  </tr>
                ))
              : leads.length === 0
              ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white/20" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/40">No leads found</p>
                          <p className="text-xs text-white/25 mt-0.5">Try adjusting your filters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              : leads.map((lead, idx) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-white/[0.025] transition-colors duration-150"
                  >
                    {/* Lead cell */}
                    <td className="pl-5 pr-4 py-4">
                      <Link href={`/leads/${lead.id}`} className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-full bg-gradient-to-br flex-shrink-0',
                            'flex items-center justify-center text-xs font-bold text-white',
                            AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
                          )}
                        >
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                            {lead.name}
                          </div>
                          <div className="text-xs text-white/35 truncate mt-0.5">{lead.phone}</div>
                        </div>
                      </Link>
                    </td>

                    {/* Status + temp */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={lead.status} />
                        <TempBadge temperature={lead.temperature} />
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-4 py-4">
                      <SourceBadge source={lead.source} />
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-4">
                      {lead.budget ? (
                        <span className="text-sm font-semibold text-white/80">
                          {formatCurrency(lead.budget)}
                        </span>
                      ) : (
                        <span className="text-sm text-white/20">—</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-white/45 truncate max-w-[120px] block">
                        {lead.location || '—'}
                      </span>
                    </td>

                    {/* Last activity */}
                    <td className="px-4 py-4">
                      <span className="text-xs text-white/35">
                        {formatRelative(lead.updatedAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pr-5 pl-3 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="icon-sm" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(lead)}>
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit lead
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`tel:${lead.phone}`}>
                                <Phone className="w-3.5 h-3.5" />
                                Call now
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              destructive
                              onClick={() => onDelete(lead.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/6">
          <span className="text-xs text-white/30">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 px-3"
            >
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150',
                      p === page
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {p}
                  </button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 px-3"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
