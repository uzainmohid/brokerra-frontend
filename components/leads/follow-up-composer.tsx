'use client'

/**
 * FILE: follow-up-composer.tsx
 * FINAL PATH: brokerra-frontend/components/leads/follow-up-composer.tsx
 * ACTION: REPLACE
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Phone, MessageSquare, Mail,
  Copy, CheckCheck, RefreshCw, Zap,
  Brain, IndianRupee, MapPin, TrendingUp,
  ArrowRight, ChevronDown, ChevronUp,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils'
import api from '@/lib/api'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ComposedMessage {
  channel: 'whatsapp' | 'call' | 'email'
  label:   string
  tone:    string
  message: string
}

interface ComposeResult {
  messages: ComposedMessage[]
  context: {
    intent:       string
    intentLabel:  string
    inactiveDays: number
    temperature:  string
    stage:        string
  }
}

// ── Lead context badge ─────────────────────────────────────────────────────────

interface LeadContextProps {
  budget?:   number
  location?: string
  status?:   string
  temperature?: string
}

function LeadContextBar({ budget, location, status, temperature }: LeadContextProps) {
  const items = [
    budget   && { icon: IndianRupee, label: formatCurrency(budget),      color: 'text-emerald-400' },
    location && { icon: MapPin,      label: location.split(',')[0],       color: 'text-white/50' },
    status   && { icon: TrendingUp,  label: status.replace('-', ' '),     color: 'text-blue-400' },
  ].filter(Boolean) as { icon: React.ElementType; label: string; color: string }[]

  if (!items.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 px-1">
      <span className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">
        Using real data:
      </span>
      {items.map(({ icon: Icon, label, color }, i) => (
        <div key={i} className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
          <Icon className={cn('w-2.5 h-2.5 flex-shrink-0', color)} />
          <span className={cn('text-[10px] font-medium capitalize', color)}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyBtn({ text, size = 'sm' }: { text: string; size?: 'sm' | 'md' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <button
      onClick={copy}
      className={cn(
        'flex items-center gap-1.5 font-semibold rounded-lg transition-all duration-150',
        size === 'sm' ? 'text-[11px] px-2.5 py-1.5' : 'text-[12px] px-3 py-2',
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-white/5 text-white/40 border border-white/8 hover:bg-white/10 hover:text-white/70 hover:border-white/15',
      )}
    >
      {copied
        ? <><CheckCheck className="w-3 h-3" />Copied</>
        : <><Copy className="w-3 h-3" />Copy</>
      }
    </button>
  )
}

// ── WhatsApp card ─────────────────────────────────────────────────────────────

function WhatsAppCard({ message, phone }: { message: string; phone?: string }) {
  const [exp, setExp] = useState(false)
  const preview = message.slice(0, 180)
  const needsMore = message.length > 180

  return (
    <div className="rounded-2xl border border-green-500/15 bg-[rgba(16,185,129,0.04)] overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-green-400">WhatsApp Message</p>
            <p className="text-[10px] text-white/25">Conversational · Ready to paste</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={message} />
          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Chat bubble preview */}
      <div className="p-4">
        <div className="flex justify-end">
          <div className="max-w-[85%] bg-[#025c4c] rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
            <pre className="text-[12px] text-white/90 leading-relaxed whitespace-pre-wrap font-sans">
              {exp || !needsMore ? message : `${preview}...`}
            </pre>
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <span className="text-[10px] text-white/40">Now</span>
              <span className="text-[10px] text-blue-300">✓✓</span>
            </div>
          </div>
        </div>
        {needsMore && (
          <button
            onClick={() => setExp(p => !p)}
            className="flex items-center gap-1 text-[10px] text-white/25 hover:text-white/50 mt-2.5 transition-colors"
          >
            {exp
              ? <><ChevronUp className="w-3 h-3" />Collapse</>
              : <><ChevronDown className="w-3 h-3" />Show full message</>
            }
          </button>
        )}
      </div>
    </div>
  )
}

// ── Call script card ──────────────────────────────────────────────────────────

function CallScriptCard({ message, phone }: { message: string; phone?: string }) {
  // Parse sections from the script (Opening:, Key Points:, Close:)
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
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-colors"
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
          const heading = lines[0]
          const body    = lines.slice(1)

          // Heading lines (Opening:, Purpose:, etc.)
          const isHeading = heading.endsWith(':') && !heading.startsWith('"') && !heading.startsWith('•')

          return (
            <div key={i}>
              {isHeading ? (
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                    {heading.replace(':', '')}
                  </p>
                  <div className="space-y-1">
                    {body.map((line, j) => (
                      <p key={j} className={cn(
                        'text-[12px] leading-relaxed',
                        line.startsWith('•') ? 'text-white/60 pl-2' : 'text-white/75 italic',
                      )}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-white/55 leading-relaxed">{section}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Email card ────────────────────────────────────────────────────────────────

function EmailCard({ message }: { message: string }) {
  const lines = message.split('\n')
  const subjectLine = lines.find(l => l.startsWith('Subject:'))
  const subject     = subjectLine?.replace('Subject: ', '') || 'Follow Up'
  const body        = lines.filter(l => !l.startsWith('Subject:')).join('\n').trim()

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

      {/* Gmail-style preview */}
      <div className="p-4">
        {/* Subject */}
        <div className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 mb-3">
          <span className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">Subject  </span>
          <span className="text-[13px] font-semibold text-white/85">{subject}</span>
        </div>
        {/* Body */}
        <div className="bg-white/[0.03] border border-white/6 rounded-xl px-4 py-3">
          <pre className="text-[12px] text-white/65 leading-relaxed whitespace-pre-wrap font-sans">
            {body}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ── Loading animation ─────────────────────────────────────────────────────────

function ComposingLoader() {
  const steps = [
    'Reading lead profile...',
    'Analysing pipeline stage...',
    'Personalising messages...',
    'Crafting WhatsApp message...',
    'Building call script...',
    'Composing email...',
  ]
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setStep(p => (p + 1) % steps.length)
    }, 700)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-14">
      {/* Animated brain/AI icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center">
          <Brain className="w-8 h-8 text-emerald-400" />
        </div>
        {/* Orbit ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 animate-ping" />
        {/* Glow dots */}
        {[0,1,2].map(i => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full"
            style={{
              top:  '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              x: [0, 32 * Math.cos((i * 2 * Math.PI) / 3), 0],
              y: [0, 32 * Math.sin((i * 2 * Math.PI) / 3), 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-[13px] text-white/50 font-medium"
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-white/8 rounded-full mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>
    </div>
  )
}

// ── Main exported component ───────────────────────────────────────────────────

interface FollowUpComposerProps {
  leadId:      string
  leadPhone?:  string
  leadBudget?: number
  leadLocation?: string
  leadStatus?: string
  leadTemperature?: string
}

export function FollowUpComposer({
  leadId,
  leadPhone,
  leadBudget,
  leadLocation,
  leadStatus,
  leadTemperature,
}: FollowUpComposerProps) {
  const [result,    setResult]    = useState<ComposeResult | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const generate = useCallback(async () => {
    setLoading(true)
    setResult(null)
    try {
      const { data: envelope } = await api.post('/api/ai-agent/compose-followup', { leadId })
      const data: ComposeResult = envelope.data ?? envelope
      setResult(data)
      setGenerated(true)
      // Auto-scroll to results after a brief delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    } catch {
      toast.error('Failed to generate messages. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [leadId])

  const whatsappMsg = result?.messages.find(m => m.channel === 'whatsapp')
  const callMsg     = result?.messages.find(m => m.channel === 'call')
  const emailMsg    = result?.messages.find(m => m.channel === 'email')

  const allText = result?.messages.map(m => `--- ${m.label} ---\n${m.message}`).join('\n\n') || ''

  return (
    <div className="space-y-4">

      {/* ── Hero generate panel ────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[rgba(16,185,129,0.06)] via-[rgba(10,18,40,0.85)] to-[rgba(10,18,40,0.85)] backdrop-blur-xl border border-emerald-500/15 rounded-2xl overflow-hidden">

        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative px-6 py-5">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.4)]">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white tracking-tight">AI Follow-Up Composer</h3>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Instantly generate personalised messages from this lead's real data
                </p>
              </div>
            </div>

            {/* AI badge */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 flex-shrink-0">
              <Zap className="w-3 h-3 text-emerald-400" fill="currentColor" />
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Powered by AI</span>
            </div>
          </div>

          {/* Lead context chips */}
          <LeadContextBar
            budget={leadBudget}
            location={leadLocation}
            status={leadStatus}
            temperature={leadTemperature}
          />

          {/* Primary CTA */}
          {!loading && (
            <div className="flex items-center gap-3">
              <motion.button
                onClick={generate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-[14px]',
                  'bg-gradient-to-r from-emerald-500 to-teal-500',
                  'text-white shadow-[0_4px_24px_rgba(16,185,129,0.35)]',
                  'hover:shadow-[0_6px_32px_rgba(16,185,129,0.5)]',
                  'transition-all duration-200',
                )}
              >
                <Sparkles className="w-4 h-4" />
                {generated ? 'Generate Another Version' : 'Generate Smart Follow-Ups'}
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </motion.button>

              {generated && allText && (
                <CopyBtn text={allText} size="md" />
              )}
            </div>
          )}

          {/* Loading */}
          {loading && <ComposingLoader />}
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {generated && result && !loading && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-3"
          >
            {/* Intent context */}
            <div className="flex items-center gap-3 px-1">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-300">
                  {result.context.intentLabel}
                </span>
              </div>
              {result.context.inactiveDays > 0 && (
                <span className="text-[10px] text-white/25">
                  {result.context.inactiveDays} days inactive · messages crafted accordingly
                </span>
              )}
            </div>

            {/* 3 message cards */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {whatsappMsg && <WhatsAppCard message={whatsappMsg.message} phone={leadPhone} />}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              {callMsg && <CallScriptCard message={callMsg.message} phone={leadPhone} />}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.19 }}
            >
              {emailMsg && <EmailCard message={emailMsg.message} />}
            </motion.div>

            <p className="text-[10px] text-white/18 text-center pt-1">
              All messages generated from this lead's real CRM data · Not a template
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
