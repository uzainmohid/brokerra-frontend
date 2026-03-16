// import { clsx, type ClassValue } from 'clsx'
// import { twMerge } from 'tailwind-merge'
// import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'
// import { LeadStatus, LeadTemperature, LeadSource } from '@/types'

// // ─── Class merging ────────────────────────────────────────────────────────────

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// // ─── Date formatting ──────────────────────────────────────────────────────────

// export function formatDate(date: string | Date): string {
//   return format(new Date(date), 'dd MMM yyyy')
// }

// export function formatDateTime(date: string | Date): string {
//   return format(new Date(date), 'dd MMM yyyy, HH:mm')
// }

// export function formatRelative(date: string | Date): string {
//   return formatDistanceToNow(new Date(date), { addSuffix: true })
// }

// export function formatFollowUpDate(date: string | Date): string {
//   const d = new Date(date)
//   if (isToday(d)) return 'Today'
//   if (isTomorrow(d)) return 'Tomorrow'
//   if (isPast(d)) return `${formatDistanceToNow(d)} overdue`
//   return format(d, 'dd MMM')
// }

// // ─── Currency formatting ──────────────────────────────────────────────────────

// export function formatCurrency(amount: number): string {
//   if (amount >= 10000000) {
//     return `₹${(amount / 10000000).toFixed(1)}Cr`
//   }
//   if (amount >= 100000) {
//     return `₹${(amount / 100000).toFixed(1)}L`
//   }
//   if (amount >= 1000) {
//     return `₹${(amount / 1000).toFixed(0)}K`
//   }
//   return `₹${amount}`
// }

// // ─── Lead status helpers ──────────────────────────────────────────────────────

// export function getStatusColor(status: LeadStatus): string {
//   const map: Record<LeadStatus, string> = {
//     'new': 'text-blue-400 bg-blue-500/15 border-blue-500/25',
//     'contacted': 'text-purple-400 bg-purple-500/15 border-purple-500/25',
//     'follow-up': 'text-amber-400 bg-amber-500/15 border-amber-500/25',
//     'site-visit': 'text-orange-400 bg-orange-500/15 border-orange-500/25',
//     'negotiation': 'text-pink-400 bg-pink-500/15 border-pink-500/25',
//     'closed': 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25',
//     'lost': 'text-gray-400 bg-gray-500/15 border-gray-500/25',
//   }
//   return map[status] || 'text-gray-400 bg-gray-500/15'
// }

// export function getStatusLabel(status: LeadStatus): string {
//   const map: Record<LeadStatus, string> = {
//     'new': 'New',
//     'contacted': 'Contacted',
//     'follow-up': 'Follow Up',
//     'site-visit': 'Site Visit',
//     'negotiation': 'Negotiation',
//     'closed': 'Closed',
//     'lost': 'Lost',
//   }
//   return map[status] || status
// }

// export function getTemperatureColor(temp: LeadTemperature): string {
//   const map: Record<LeadTemperature, string> = {
//     hot: 'text-red-400 bg-red-500/15 border-red-500/25',
//     warm: 'text-amber-400 bg-amber-500/15 border-amber-500/25',
//     cold: 'text-blue-400 bg-blue-500/15 border-blue-500/25',
//   }
//   return map[temp]
// }

// export function getTemperatureEmoji(temp: LeadTemperature): string {
//   return { hot: '🔥', warm: '⚡', cold: '❄️' }[temp]
// }

// export function getSourceLabel(source: LeadSource): string {
//   const map: Record<LeadSource, string> = {
//     whatsapp: 'WhatsApp',
//     referral: 'Referral',
//     website: 'Website',
//     instagram: 'Instagram',
//     facebook: 'Facebook',
//     'property-portal': 'Property Portal',
//     'cold-call': 'Cold Call',
//     'walk-in': 'Walk In',
//     other: 'Other',
//   }
//   return map[source] || source
// }

// export function getSourceColor(source: LeadSource): string {
//   const map: Record<LeadSource, string> = {
//     whatsapp: '#25d366',
//     referral: '#10b981',
//     website: '#6366f1',
//     instagram: '#e1306c',
//     facebook: '#1877f2',
//     'property-portal': '#f59e0b',
//     'cold-call': '#8b5cf6',
//     'walk-in': '#06b6d4',
//     other: '#6b7280',
//   }
//   return map[source] || '#6b7280'
// }

// // ─── Number formatting ────────────────────────────────────────────────────────

// export function formatNumber(n: number): string {
//   if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
//   return String(n)
// }

// export function formatPercentage(n: number, decimals = 1): string {
//   return `${n.toFixed(decimals)}%`
// }

// // ─── Download helpers ─────────────────────────────────────────────────────────

// export function downloadBlob(blob: Blob, filename: string): void {
//   const url = window.URL.createObjectURL(blob)
//   const link = document.createElement('a')
//   link.href = url
//   link.download = filename
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   window.URL.revokeObjectURL(url)
// }

// // ─── String helpers ───────────────────────────────────────────────────────────

// export function getInitials(name: string): string {
//   return name
//     .split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2)
// }

// export function truncate(str: string, length: number): string {
//   return str.length > length ? `${str.slice(0, length)}...` : str
// }

// // ─── Pipeline column config ───────────────────────────────────────────────────

// export const PIPELINE_COLUMNS = [
//   { id: 'new' as LeadStatus, title: 'New', color: '#3b82f6', className: 'stage-new' },
//   { id: 'contacted' as LeadStatus, title: 'Contacted', color: '#a855f7', className: 'stage-contacted' },
//   { id: 'follow-up' as LeadStatus, title: 'Follow Up', color: '#f59e0b', className: 'stage-followup' },
//   { id: 'site-visit' as LeadStatus, title: 'Site Visit', color: '#f97316', className: 'stage-sitevisit' },
//   { id: 'negotiation' as LeadStatus, title: 'Negotiation', color: '#ec4899', className: 'stage-negotiation' },
//   { id: 'closed' as LeadStatus, title: 'Closed ✓', color: '#10b981', className: 'stage-closed' },
//   { id: 'lost' as LeadStatus, title: 'Lost', color: '#6b7280', className: 'stage-lost' },
// ]

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'
import { LeadStatus, LeadTemperature, LeadSource } from '@/types'

// ─── Class merging ────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Safe date parser ─────────────────────────────────────────────────────────
// Returns null if the value is missing or produces an invalid Date.
// Every date helper below calls this instead of `new Date(date)` directly.

function safeDate(date: string | Date | null | undefined): Date | null {
  if (date === null || date === undefined || date === '') return null
  const d = new Date(date)
  return isNaN(d.getTime()) ? null : d
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(date: string | Date | null | undefined): string {
  const d = safeDate(date)
  if (!d) return '—'
  return format(d, 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date | null | undefined): string {
  const d = safeDate(date)
  if (!d) return '—'
  return format(d, 'dd MMM yyyy, HH:mm')
}

export function formatRelative(date: string | Date | null | undefined): string {
  const d = safeDate(date)
  if (!d) return '—'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatFollowUpDate(date: string | Date | null | undefined): string {
  const d = safeDate(date)
  if (!d) return '—'
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isPast(d)) return `${formatDistanceToNow(d)} overdue`
  return format(d, 'dd MMM')
}

// ─── Currency formatting ──────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`
  }
  return `₹${amount}`
}

// ─── Lead status helpers ──────────────────────────────────────────────────────

export function getStatusColor(status: LeadStatus): string {
  const map: Record<LeadStatus, string> = {
    'new': 'text-blue-400 bg-blue-500/15 border-blue-500/25',
    'contacted': 'text-purple-400 bg-purple-500/15 border-purple-500/25',
    'follow-up': 'text-amber-400 bg-amber-500/15 border-amber-500/25',
    'site-visit': 'text-orange-400 bg-orange-500/15 border-orange-500/25',
    'negotiation': 'text-pink-400 bg-pink-500/15 border-pink-500/25',
    'closed': 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25',
    'lost': 'text-gray-400 bg-gray-500/15 border-gray-500/25',
  }
  return map[status] || 'text-gray-400 bg-gray-500/15'
}

export function getStatusLabel(status: LeadStatus): string {
  const map: Record<LeadStatus, string> = {
    'new': 'New',
    'contacted': 'Contacted',
    'follow-up': 'Follow Up',
    'site-visit': 'Site Visit',
    'negotiation': 'Negotiation',
    'closed': 'Closed',
    'lost': 'Lost',
  }
  return map[status] || status
}

export function getTemperatureColor(temp: LeadTemperature): string {
  const map: Record<LeadTemperature, string> = {
    hot: 'text-red-400 bg-red-500/15 border-red-500/25',
    warm: 'text-amber-400 bg-amber-500/15 border-amber-500/25',
    cold: 'text-blue-400 bg-blue-500/15 border-blue-500/25',
  }
  return map[temp]
}

export function getTemperatureEmoji(temp: LeadTemperature): string {
  return { hot: '🔥', warm: '⚡', cold: '❄️' }[temp]
}

export function getSourceLabel(source: LeadSource): string {
  const map: Record<LeadSource, string> = {
    whatsapp: 'WhatsApp',
    referral: 'Referral',
    website: 'Website',
    instagram: 'Instagram',
    facebook: 'Facebook',
    'property-portal': 'Property Portal',
    'cold-call': 'Cold Call',
    'walk-in': 'Walk In',
    other: 'Other',
  }
  return map[source] || source
}

export function getSourceColor(source: LeadSource): string {
  const map: Record<LeadSource, string> = {
    whatsapp: '#25d366',
    referral: '#10b981',
    website: '#6366f1',
    instagram: '#e1306c',
    facebook: '#1877f2',
    'property-portal': '#f59e0b',
    'cold-call': '#8b5cf6',
    'walk-in': '#06b6d4',
    other: '#6b7280',
  }
  return map[source] || '#6b7280'
}

// ─── Number formatting ────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function formatPercentage(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}

// ─── Download helpers ─────────────────────────────────────────────────────────

export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// ─── String helpers ───────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str
}

// ─── Pipeline column config ───────────────────────────────────────────────────

export const PIPELINE_COLUMNS = [
  { id: 'new' as LeadStatus,         title: 'New',         color: '#3b82f6', className: 'stage-new' },
  { id: 'contacted' as LeadStatus,   title: 'Contacted',   color: '#a855f7', className: 'stage-contacted' },
  { id: 'follow-up' as LeadStatus,   title: 'Follow Up',   color: '#f59e0b', className: 'stage-followup' },
  { id: 'site-visit' as LeadStatus,  title: 'Site Visit',  color: '#f97316', className: 'stage-sitevisit' },
  { id: 'negotiation' as LeadStatus, title: 'Negotiation', color: '#ec4899', className: 'stage-negotiation' },
  { id: 'closed' as LeadStatus,      title: 'Closed ✓',   color: '#10b981', className: 'stage-closed' },
  { id: 'lost' as LeadStatus,        title: 'Lost',        color: '#6b7280', className: 'stage-lost' },
] 