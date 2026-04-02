'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Edit2, Trash2, Phone, MessageSquare,
  Mail, MapPin, IndianRupee, Tag, Calendar,
  Clock, ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge, TempBadge, SourceBadge } from '@/components/shared/status-badge'
import { LeadFormModal } from '@/components/leads/lead-form-modal'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ActivityTimeline } from '@/components/leads/activity-timeline'
import { NotesSection } from '@/components/leads/notes-section'
import { AiSummaryCard } from '@/components/leads/ai-summary-card'
import { FollowUpComposer } from '@/components/leads/follow-up-composer'
import { leadsApi } from '@/lib/api'
import { Lead, LeadWithDetails } from '@/types'
import { formatCurrency, formatDate, formatRelative, getInitials } from '@/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const AVATAR_GRADIENTS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
]

// Demo fallback lead
const DEMO_LEAD: LeadWithDetails = {
  id: 'demo',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@gmail.com',
  status: 'negotiation',
  temperature: 'hot',
  source: 'referral',
  budget: 18500000,
  propertyType: '3BHK Apartment',
  location: 'Bandra West, Mumbai',
  noteText: 'Interested in sea-facing unit. Needs parking. Wife prefers modern kitchen.',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  lastContactedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  nextFollowUpAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  tags: ['high-priority', 'sea-facing', 'ready-to-buy'],
  notes: [],
  followUps: [],
  activities: [],
  aiSummary: undefined,
}

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-white/35" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm text-white/80">{value}</div>
      </div>
    </div>
  )
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [lead, setLead] = useState<LeadWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    leadsApi.getLead(id)
      .then(setLead)
      .catch(() => setLead(DEMO_LEAD))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await leadsApi.deleteLead(id)
      toast.success('Lead deleted')
      router.push('/leads')
    } catch {
      toast.error('Failed to delete lead')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <PageTransition className="flex flex-col flex-1 overflow-hidden">
        <Header title="Lead Details" />
        <div className="px-8 py-6 space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-3 gap-5">
            <Skeleton className="h-64 rounded-2xl" />
            <div className="col-span-2 space-y-4">
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!lead) return null

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title={lead.name}
        subtitle={`Lead · ${lead.location || 'No location set'}`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/leads">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-1.5">
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        }
      />

      <ScrollArea className="flex-1">
        <div className="px-8 py-6 space-y-5 pb-12">

          {/* ── Hero card ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between flex-wrap gap-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-xl font-bold text-white shadow-[0_8px_24px_rgba(16,185,129,0.3)] flex-shrink-0">
                  {getInitials(lead.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{lead.name}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={lead.status} />
                    <TempBadge temperature={lead.temperature} />
                    <SourceBadge source={lead.source} />
                    {lead.tags?.map(tag => (
                      <Badge key={tag} variant="secondary">#{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-2">
                <a href={`tel:${lead.phone}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    Call
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                    WhatsApp
                  </Button>
                </a>
                {lead.email && (
                  <a href={`mailto:${lead.email}`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      Email
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-5 pt-5 border-t border-white/6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Budget',
                  value: lead.budget ? formatCurrency(lead.budget) : '—',
                  color: 'text-emerald-400',
                },
                {
                  label: 'Property',
                  value: lead.propertyType || '—',
                  color: 'text-white/80',
                },
                {
                  label: 'Added',
                  value: formatDate(lead.createdAt),
                  color: 'text-white/60',
                },
                {
                  label: 'Last Active',
                  value: formatRelative(lead.updatedAt),
                  color: 'text-white/60',
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">{stat.label}</div>
                  <div className={cn('text-sm font-semibold', stat.color)}>{stat.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Two column layout ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left: Lead info */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Contact info */}
              <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl px-5 py-1">
                <div className="py-3 border-b border-white/5">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Contact Details</h3>
                </div>
                <InfoRow icon={Phone} label="Phone" value={
                  <a href={`tel:${lead.phone}`} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    {lead.phone} <ExternalLink className="w-3 h-3" />
                  </a>
                } />
                {lead.email && (
                  <InfoRow icon={Mail} label="Email" value={
                    <a href={`mailto:${lead.email}`} className="text-emerald-400 hover:text-emerald-300 truncate">
                      {lead.email}
                    </a>
                  } />
                )}
                <InfoRow icon={MapPin} label="Location" value={lead.location || '—'} />
                <InfoRow icon={IndianRupee} label="Budget" value={lead.budget ? formatCurrency(lead.budget) : '—'} />
                <InfoRow icon={Tag} label="Property Type" value={lead.propertyType || '—'} />
                {lead.nextFollowUpAt && (
                  <InfoRow icon={Calendar} label="Next Follow-up" value={
                    <span className="text-amber-400">{formatDate(lead.nextFollowUpAt)}</span>
                  } />
                )}
                {lead.lastContactedAt && (
                  <InfoRow icon={Clock} label="Last Contacted" value={formatRelative(lead.lastContactedAt)} />
                )}
              </div>

              {/* AI Summary */}
              <AiSummaryCard leadId={id} existingSummary={lead.aiSummary} />
            </motion.div>

            {/* Right: Tabs — Timeline / Notes */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2"
            >
              <Tabs defaultValue="timeline">
                <TabsList className="mb-4">
                  <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="compose">✨ AI Compose</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline">
                  <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl p-5">
                    <ActivityTimeline activities={lead.activities?.length ? lead.activities : undefined} />
                  </div>
                </TabsContent>

                <TabsContent value="notes">
                  <NotesSection leadId={id} notes={Array.isArray(lead.notes) && lead.notes.length ? lead.notes : undefined} />
                </TabsContent>

                <TabsContent value="compose">
                  <FollowUpComposer leadId={id} leadPhone={lead.phone} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </ScrollArea>

      {/* Modals */}
      {editOpen && (
        <LeadFormModal
          open={editOpen}
          onOpenChange={setEditOpen}
          lead={lead}
          onSuccess={(updated) => setLead({ ...lead, ...updated })}
        />
      )}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Lead"
        description={`Delete "${lead.name}"? This will permanently remove all notes, activity history, and follow-up data.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
        confirmLabel="Delete Lead"
        variant="destructive"
      />
    </PageTransition>
  )
}
