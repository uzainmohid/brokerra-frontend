'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowUpRight, Users } from 'lucide-react'
import Link from 'next/link'
import { Lead } from '@/types'
import { StatusBadge, TempBadge } from '@/components/shared/status-badge'
import { formatRelative, formatCurrency, getInitials } from '@/utils'
import { Skeleton } from '@/components/ui/skeleton'

const AVATAR_COLORS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
  'from-amber-600 to-orange-500',
  'from-red-600 to-rose-500',
]

interface RecentLeadsProps {
  leads?: Lead[]
  isLoading?: boolean
}

export function RecentLeads({ leads = [], isLoading }: RecentLeadsProps) {
  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div>
          <h3 className="text-base font-semibold text-white">Recent Leads</h3>
          <p className="text-xs text-white/35 mt-0.5">Latest activity across your pipeline</p>
        </div>
        <Link
          href="/leads"
          className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/4">
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider">Lead</th>
              <th className="text-left px-3 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Status</th>
              <th className="text-left px-3 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider hidden lg:table-cell">Budget</th>
              <th className="text-left px-3 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider hidden lg:table-cell">Last activity</th>
              <th className="px-3 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/3">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-3 py-3.5 hidden lg:table-cell"><Skeleton className="h-3 w-16" /></td>
                  <td className="px-3 py-3.5 hidden lg:table-cell"><Skeleton className="h-3 w-20" /></td>
                  <td className="px-3 py-3.5" />
                </tr>
              ))
            ) : leads.length === 0 ? (
              // Empty state — no fake data
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center">
                  <Users className="w-8 h-8 text-white/15 mx-auto mb-3" />
                  <p className="text-sm text-white/30">No leads yet</p>
                  <p className="text-xs text-white/18 mt-1">
                    <Link href="/leads" className="text-emerald-400 hover:text-emerald-300">
                      Add your first lead →
                    </Link>
                  </p>
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-white/2 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <Link href={`/leads/${lead.id}`} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white/90 truncate">{lead.name}</div>
                        <div className="text-xs text-white/35 truncate">{lead.location || lead.phone}</div>
                      </div>
                    </Link>
                  </td>

                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <StatusBadge status={lead.status} />
                      <TempBadge temperature={lead.temperature} />
                    </div>
                  </td>

                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    {lead.budget ? (
                      <span className="text-sm font-medium text-white/70">{formatCurrency(lead.budget)}</span>
                    ) : (
                      <span className="text-sm text-white/25">—</span>
                    )}
                  </td>

                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-white/35">{formatRelative(lead.updatedAt)}</span>
                  </td>

                  <td className="px-3 py-3.5">
                    <Link href={`/leads/${lead.id}`}>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                    </Link>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
