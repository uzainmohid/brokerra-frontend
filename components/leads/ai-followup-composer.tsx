'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Phone, MessageSquare, Mail,
  Copy, CheckCheck, Zap, Brain,
  IndianRupee, MapPin, TrendingUp, ArrowRight,
  ExternalLink, RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils'
import api from '@/lib/api'

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

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={cn(
        'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-150',
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

function ComposerLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10 select-none">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Brain
            className="w-7 h-7 text-emerald-400"
            style={{ animation: 'cp-pulse 1.5s ease-in-out infinite' }}
          />
        </div>
        <div
          className="absolute inset-[-4px] rounded-[18px] border border-emerald-500/20"
          style={{ animation: 'cp-ring 1.5s ease-out infinite' }}
        />
      </div>
      <p className="text-[13px] font-medium text-white/45 mb-4">
        Analysing lead data and crafting messages...
      </p>
      <div className="w-44 h-1 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full w-1/3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          style={{ animation: 'cp-bar 1.4s ease-in-out infinite' }}
        />
      </div>
      <style>{`
        @keyframes cp-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes cp-ring  { 0%{opacity:.5;transform:scale(1)} 100%{opacity:0;transform:scale(1.3)} }
        @keyframes cp-bar   { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
      `}</style>
    </div>
  )
}

function WhatsAppCard({ message, phone }: { message: string; phone?: string }) {
  const cleanPhone = phone?.replace(/\D/g, '') ?? ''
  const waHref = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : undefined

  return (
    <div className="rounded-2xl border border-green-500/15 bg-[rgba(16,185,129,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-green-400">WhatsApp Message</p>
            <p className="text-[10px] text-white/25">Conversational · Ready to send</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={message} />
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open WhatsApp
            </a>
          )}
        </div>
      </div>
      <div className="p-4 flex justify-end">
        <div className="max-w-[85%] bg-[#025c4c] rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
          <pre className="text-[12px] text-white/90 leading-relaxed whitespace-pre-wrap font-sans">
            {message}
          </pre>
          <div className="flex items-center justify-end gap-1 mt-1.5">
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-blue-400">Call Script</p>
            <p className="text-[10px] text-white/25">Structured · Professional</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={message} />
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors"
            >
              <Phone className="w-3 h-3" />
              Dial Now
            </a>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        {sections.map((section, i) => {
          const lines = section.split('\n').filter(Boolean)
          const head  = lines[0] ?? ''
          const body  = lines.slice(1)
          const isHdr = head.endsWith(':') && !head.startsWith('"') && !head.startsWith('•')
          return isHdr ? (
            <div key={i}>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                {head.replace(':', '')}
              </p>
              {body.map((line, j) => (
                <p key={j} className={cn(
                  'text-[12px] leading-relaxed',
                  line.startsWith('•') ? 'text-white/60 pl-2' : 'text-white/75 italic',
                )}>{line}</p>
              ))}
            </div>
          ) : (
            <p key={i} className="text-[12px] text-white/55 leading-relaxed">{section}</p>
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-purple-400">Email</p>
            <p className="text-[10px] text-white/25">Formal · Professional</p>
          </div>
        </div>
        <CopyBtn text={message} />
      </div>
      <div className="p-4">
        <div className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 mb-3">
          <span className="text-[10px] text-white/25 font-semibold uppercase tracking-wider mr-2">Subject</span>
          <span className="text-[13px] font-semibold text-white/85">{subject}</span>
        </div>
        <div className="bg-white/[0.03] border border-white/6 rounded-xl px-4 py-3">
          <pre className="text-[12px] text-white/65 leading-relaxed whitespace-pre-wrap font-sans">{body}</pre>
        </div>
      </div>
    </div>
  )
}

interface AiFollowUpComposerProps {
  leadId:        string
  leadPhone?:    string
  leadBudget?:   number
  leadLocation?: string
  leadStatus?:   string
}

export function AiFollowUpComposer({
  leadId,
  leadPhone,
  leadBudget,
  leadLocation,
  leadStatus,
}: AiFollowUpComposerProps) {
  const [result,    setResult]    = useState<ComposerResult | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)
  const [failed,    setFailed]    = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const generate = useCallback(async () => {
    setLoading(true)
    setResult(null)
    setFailed(false)
    try {
      const { data: envelope } = await api.post('/api/ai-followup/generate', { leadId })
      const data = (envelope.data ?? envelope) as ComposerResult
      setResult(data)
      setGenerated(true)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    } catch {
      setFailed(true)
      toast.error('Could not generate messages — check backend connection.')
    } finally {
      setLoading(false)
    }
  }, [leadId])

  const wa      = result?.messages.find(m => m.channel === 'whatsapp')
  const call    = result?.messages.find(m => m.channel === 'call')
  const email   = result?.messages.find(m => m.channel === 'email')
  const allText = result?.messages.map(m => `--- ${m.label} ---\n${m.message}`).join('\n\n') ?? ''

  return (
    <div className="space-y-4">
      {/* Hero panel */}
      <div className="relative rounded-2xl border border-emerald-500/15 overflow-hidden bg-gradient-to-br from-[rgba(16,185,129,0.07)] via-[rgba(10,18,40,0.92)] to-[rgba(10,18,40,0.92)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.4)] flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white leading-none tracking-tight">
                  AI Follow-Up Composer
                </h3>
                <p className="text-[11px] text-white/35 mt-1">Turn any lead into a conversation instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 flex-shrink-0">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Real-time AI</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-semibold">Using:</span>
            {leadBudget != null && (
              <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
                <IndianRupee className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                <span className="text-[10px] font-medium text-emerald-400">{formatCurrency(leadBudget)}</span>
              </div>
            )}
            {leadLocation && (
              <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
                <MapPin className="w-2.5 h-2.5 text-white/45 flex-shrink-0" />
                <span className="text-[10px] font-medium text-white/45">{leadLocation.split(',')[0]}</span>
              </div>
            )}
            {leadStatus && (
              <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
                <TrendingUp className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" />
                <span className="text-[10px] font-medium text-blue-400 capitalize">{leadStatus.replace('-', ' ')}</span>
              </div>
            )}
          </div>

          {loading ? (
            <ComposerLoader />
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                onClick={generate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-[14px] text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.5)] transition-shadow"
              >
                <Sparkles className="w-4 h-4" />
                {generated ? 'Generate Another Version' : 'Generate Smart Follow-Ups'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              {generated && allText && <CopyBtn text={allText} label="Copy All" />}
              {generated && (
                <button
                  onClick={generate}
                  className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/55 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Regenerate
                </button>
              )}
            </div>
          )}

          {failed && !loading && (
            <p className="text-[12px] text-red-400/80 mt-3">
              Failed to generate. Make sure the backend is running and try again.
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {generated && result && !loading && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 flex-wrap px-1">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-300">{result.context.intentLabel}</span>
              </div>
              {result.context.inactiveDays > 0 && (
                <span className="text-[10px] text-white/25">
                  {result.context.inactiveDays}d inactive · messages adapted accordingly
                </span>
              )}
            </div>

            {wa    && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}><WhatsAppCard message={wa.message}    phone={leadPhone} /></motion.div>}
            {call  && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}><CallCard     message={call.message}  phone={leadPhone} /></motion.div>}
            {email && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}><EmailCard    message={email.message} /></motion.div>}

            <p className="text-[10px] text-white/18 text-center pt-1">
              Generated from this lead's real CRM data · Not a template
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
