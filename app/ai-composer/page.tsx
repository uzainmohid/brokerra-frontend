'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Sparkles, Search, Users,
  IndianRupee, MapPin, TrendingUp, ArrowRight,
  Phone, MessageSquare, Mail,
  Copy, CheckCheck, Zap, RotateCcw,
  ExternalLink, ChevronRight,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { PageTransition } from '@/components/shared/page-transition'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge, TempBadge } from '@/components/shared/status-badge'
import { leadsApi } from '@/lib/api'
import { Lead } from '@/types'
import { formatCurrency, formatRelative, getInitials } from '@/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ComposedMessage {
  channel: 'whatsapp' | 'call' | 'email'
  label:   string
  tone:    string
  message: string
}

interface ComposerResult {
  messages: ComposedMessage[]
  context: {
    intentLabel:  string
    inactiveDays: number
  }
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={cn(
        'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all',
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
          : 'bg-white/5 text-white/40 border-white/8 hover:bg-white/10 hover:text-white/70',
      )}
    >
      {copied
        ? <><CheckCheck className="w-3 h-3" />Copied</>
        : <><Copy className="w-3 h-3" />{label}</>
      }
    </button>
  )
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function ComposerLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 select-none">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Brain className="w-8 h-8 text-emerald-400" style={{ animation: 'cp-pulse 1.5s ease-in-out infinite' }} />
        </div>
        <div className="absolute inset-[-4px] rounded-[20px] border border-emerald-500/20" style={{ animation: 'cp-ring 1.5s ease-out infinite' }} />
      </div>
      <p className="text-[14px] font-semibold text-white/50 mb-1">Analysing lead data...</p>
      <p className="text-[12px] text-white/25 mb-5">Crafting personalised messages</p>
      <div className="w-52 h-1 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ animation: 'cp-bar 1.4s ease-in-out infinite' }} />
      </div>
      <style>{`
        @keyframes cp-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes cp-ring  { 0%{opacity:.5;transform:scale(1)} 100%{opacity:0;transform:scale(1.3)} }
        @keyframes cp-bar   { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
      `}</style>
    </div>
  )
}

// ─── Message cards ────────────────────────────────────────────────────────────

function WhatsAppCard({ message, phone }: { message: string; phone?: string }) {
  const waHref = phone
    ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    : undefined
  return (
    <div className="rounded-2xl border border-green-500/15 bg-[rgba(16,185,129,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-green-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-green-400">WhatsApp Message</p>
            <p className="text-[10px] text-white/25">Conversational · Ready to send</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={message} />
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 transition-colors">
              <ExternalLink className="w-3 h-3" />Open WhatsApp
            </a>
          )}
        </div>
      </div>
      <div className="p-5 flex justify-end">
        <div className="max-w-[80%] bg-[#025c4c] rounded-2xl rounded-tr-sm px-5 py-4 shadow-lg">
          <pre className="text-[13px] text-white/90 leading-relaxed whitespace-pre-wrap font-sans">{message}</pre>
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-[10px] text-white/35">Now</span>
            <span className="text-[10px] text-blue-300">✓✓</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CallCard({ message, phone }: { message: string; phone?: string }) {
  const sections = message.split('\n\n').filter(Boolean)
  return (
    <div className="rounded-2xl border border-blue-500/15 bg-[rgba(59,130,246,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <Phone className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-blue-400">Call Script</p>
            <p className="text-[10px] text-white/25">Structured · Professional</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={message} />
          {phone && (
            <a href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors">
              <Phone className="w-3 h-3" />Dial Now
            </a>
          )}
        </div>
      </div>
      <div className="p-5 space-y-4">
        {sections.map((section, i) => {
          const lines = section.split('\n').filter(Boolean)
          const head  = lines[0] ?? ''
          const body  = lines.slice(1)
          const isHdr = head.endsWith(':') && !head.startsWith('"') && !head.startsWith('•')
          return isHdr ? (
            <div key={i}>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">{head.replace(':', '')}</p>
              {body.map((line, j) => (
                <p key={j} className={cn('text-[13px] leading-relaxed',
                  line.startsWith('•') ? 'text-white/60 pl-3' : 'text-white/75 italic')}>{line}</p>
              ))}
            </div>
          ) : (
            <p key={i} className="text-[13px] text-white/55 leading-relaxed">{section}</p>
          )
        })}
      </div>
    </div>
  )
}

function EmailCard({ message }: { message: string }) {
  const lines   = message.split('\n')
  const subLine = lines.find(l => l.startsWith('Subject:'))
  const subject = subLine?.replace('Subject: ', '') ?? 'Follow Up'
  const body    = lines.filter(l => !l.startsWith('Subject:')).join('\n').trim()
  return (
    <div className="rounded-2xl border border-purple-500/15 bg-[rgba(168,85,247,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
            <Mail className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-purple-400">Email</p>
            <p className="text-[10px] text-white/25">Formal · Professional</p>
          </div>
        </div>
        <CopyBtn text={message} />
      </div>
      <div className="p-5">
        <div className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 mb-3">
          <span className="text-[10px] text-white/25 font-semibold uppercase tracking-wider mr-2">Subject</span>
          <span className="text-[14px] font-semibold text-white/85">{subject}</span>
        </div>
        <div className="bg-white/[0.03] border border-white/6 rounded-xl px-5 py-4">
          <pre className="text-[13px] text-white/65 leading-relaxed whitespace-pre-wrap font-sans">{body}</pre>
        </div>
      </div>
    </div>
  )
}

// ─── Lead selector card ───────────────────────────────────────────────────────

function LeadCard({ lead, isSelected, onClick }: {
  lead:       Lead
  isSelected: boolean
  onClick:    () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150',
        isSelected
          ? 'bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]'
          : 'bg-white/[0.03] border-white/6 hover:border-white/12 hover:bg-white/[0.05]',
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0',
        isSelected ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-white/10',
      )}>
        {getInitials(lead.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-[13px] font-semibold truncate', isSelected ? 'text-white' : 'text-white/80')}>
          {lead.name}
        </p>
        <p className="text-[11px] text-white/30 truncate">{lead.location ?? lead.phone}</p>
      </div>
      {isSelected
        ? <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        : <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
      }
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AiComposerPage() {
  const [leads,       setLeads]       = useState<Lead[]>([])
  const [leadsLoading,setLeadsLoading]= useState(true)
  const [search,      setSearch]      = useState('')
  const [selected,    setSelected]    = useState<Lead | null>(null)
  const [result,      setResult]      = useState<ComposerResult | null>(null)
  const [generating,  setGenerating]  = useState(false)
  const [generated,   setGenerated]   = useState(false)
  const [failed,      setFailed]      = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Fetch all leads on mount
  useEffect(() => {
    leadsApi.getLeads({ limit: 200 })
      .then(res => {
        const arr: Lead[] = Array.isArray(res) ? res : (res.data ?? [])
        setLeads(arr)
        if (arr.length > 0) setSelected(arr[0])
      })
      .catch(() => toast.error('Failed to load leads'))
      .finally(() => setLeadsLoading(false))
  }, [])

  // Reset composer when lead changes
  useEffect(() => {
    setResult(null)
    setGenerated(false)
    setFailed(false)
  }, [selected?.id])

  const generate = useCallback(async () => {
    if (!selected) return
    setGenerating(true)
    setResult(null)
    setFailed(false)
    try {
      const { data: envelope } = await api.post('/api/ai-followup/generate', { leadId: selected.id })
      const data = (envelope.data ?? envelope) as ComposerResult
      setResult(data)
      setGenerated(true)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    } catch {
      setFailed(true)
      toast.error('Could not generate messages — check backend connection.')
    } finally {
      setGenerating(false)
    }
  }, [selected])

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.location ?? '').toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search),
  )

  const wa    = result?.messages.find(m => m.channel === 'whatsapp')
  const call  = result?.messages.find(m => m.channel === 'call')
  const email = result?.messages.find(m => m.channel === 'email')
  const allText = result?.messages.map(m => `--- ${m.label} ---\n${m.message}`).join('\n\n') ?? ''

  return (
    <PageTransition className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="AI Composer"
        subtitle="Turn any lead into a conversation instantly"
        action={
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Real-time AI</span>
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Lead selector ──────────────────────────────────── */}
        <div className="w-72 flex-shrink-0 border-r border-white/6 flex flex-col">
          {/* Search */}
          <div className="px-4 py-3 border-b border-white/6">
            <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[13px] text-white/75 placeholder:text-white/25 outline-none"
              />
            </div>
          </div>

          {/* Lead count */}
          <div className="px-4 py-2.5 border-b border-white/4">
            <p className="text-[11px] text-white/30 font-medium">
              {leadsLoading ? 'Loading...' : `${filteredLeads.length} lead${filteredLeads.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* List */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1.5">
              {leadsLoading ? (
                [...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))
              ) : filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="w-8 h-8 text-white/15 mb-2" />
                  <p className="text-[12px] text-white/30">No leads found</p>
                </div>
              ) : (
                filteredLeads.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    isSelected={selected?.id === lead.id}
                    onClick={() => setSelected(lead)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ── Right: Composer ───────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <Brain className="w-12 h-12 text-white/15" />
              <p className="text-white/35 text-[14px]">Select a lead to generate follow-up messages</p>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-5 pb-12">

                {/* Selected lead summary */}
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-base font-bold text-white flex-shrink-0">
                        {getInitials(selected.name)}
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white">{selected.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={selected.status} />
                          <TempBadge temperature={selected.temperature} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-white/40">
                      {selected.budget && (
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">{formatCurrency(selected.budget)}</span>
                        </span>
                      )}
                      {selected.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{selected.location.split(',')[0]}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="capitalize">{selected.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Generator panel */}
                <div className="relative rounded-2xl border border-emerald-500/15 overflow-hidden bg-gradient-to-br from-[rgba(16,185,129,0.07)] via-[rgba(10,18,40,0.92)] to-[rgba(10,18,40,0.92)]">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                  <div className="px-6 py-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.4)] flex-shrink-0">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-bold text-white leading-none">AI Follow-Up Composer</h3>
                          <p className="text-[12px] text-white/35 mt-1">Messages personalised to {selected.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Real-time AI</span>
                      </div>
                    </div>

                    {generating ? (
                      <ComposerLoader />
                    ) : (
                      <div className="flex items-center gap-3 flex-wrap">
                        <motion.button
                          onClick={generate}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.5)] transition-shadow"
                        >
                          <Sparkles className="w-4 h-4" />
                          {generated ? 'Generate Another Version' : 'Generate Smart Follow-Ups'}
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        {generated && allText && <CopyBtn text={allText} label="Copy All" />}
                        {generated && (
                          <button onClick={generate} className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/55 transition-colors">
                            <RotateCcw className="w-3.5 h-3.5" />Regenerate
                          </button>
                        )}
                      </div>
                    )}

                    {failed && !generating && (
                      <p className="text-[12px] text-red-400/80 mt-3">
                        Failed to generate. Make sure the backend is running and try again.
                      </p>
                    )}
                  </div>
                </div>

                {/* Results */}
                <AnimatePresence>
                  {generated && result && !generating && (
                    <motion.div
                      ref={resultsRef}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 flex-wrap px-1">
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-semibold text-emerald-300">{result.context.intentLabel}</span>
                        </div>
                        {result.context.inactiveDays > 0 && (
                          <span className="text-[11px] text-white/25">
                            {result.context.inactiveDays}d inactive · messages adapted accordingly
                          </span>
                        )}
                      </div>

                      {wa    && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}><WhatsAppCard message={wa.message}    phone={selected.phone} /></motion.div>}
                      {call  && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}><CallCard     message={call.message}  phone={selected.phone} /></motion.div>}
                      {email && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}><EmailCard    message={email.message} /></motion.div>}

                      <p className="text-[11px] text-white/18 text-center pt-1">
                        Generated from {selected.name}'s real CRM data · Not a template
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
