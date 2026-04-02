'use client'

/**
 * FILE: follow-up-composer.tsx
 * FINAL PATH: brokerra-frontend/components/leads/follow-up-composer.tsx
 * ACTION: CREATE
 */

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Phone, MessageSquare, Mail,
  Copy, CheckCheck, Loader2, RefreshCw, Zap,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ComposedMessage {
  channel: 'whatsapp' | 'call' | 'email'
  label:   string
  tone:    string
  message: string
}

interface ComposerContext {
  intent:       string
  intentLabel:  string
  inactiveDays: number
  temperature:  string
  stage:        string
}

interface ComposeResult {
  messages: ComposedMessage[]
  context:  ComposerContext
}

// ── Per-channel visual config ─────────────────────────────────────────────────

const CHANNEL = {
  whatsapp: {
    icon:        MessageSquare,
    label:       'WhatsApp',
    color:       'text-green-400',
    bg:          'bg-green-500/10',
    activeBg:    'bg-green-500/14',
    border:      'border-green-500/20',
    actionLabel: 'Open WhatsApp',
    getHref:     (phone: string, msg: string) =>
      `https://wa.me/${phone?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`,
  },
  call: {
    icon:        Phone,
    label:       'Call Script',
    color:       'text-blue-400',
    bg:          'bg-blue-500/10',
    activeBg:    'bg-blue-500/14',
    border:      'border-blue-500/20',
    actionLabel: 'Dial Now',
    getHref:     (phone: string) => `tel:${phone}`,
  },
  email: {
    icon:        Mail,
    label:       'Email',
    color:       'text-purple-400',
    bg:          'bg-purple-500/10',
    activeBg:    'bg-purple-500/14',
    border:      'border-purple-500/20',
    actionLabel: 'Open Email',
    getHref:     (_: string, msg: string) =>
      `mailto:?body=${encodeURIComponent(msg)}`,
  },
} as const

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
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
        'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-150',
        copied
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70',
      )}
    >
      {copied
        ? <><CheckCheck className="w-3 h-3" /> Copied</>
        : <><Copy className="w-3 h-3" /> Copy</>
      }
    </button>
  )
}

// ── Single message card ───────────────────────────────────────────────────────

function MessageCard({
  msg, phone, isActive, onSelect,
}: {
  msg:      ComposedMessage
  phone?:   string
  isActive: boolean
  onSelect: () => void
}) {
  const cfg       = CHANNEL[msg.channel]
  const Icon      = cfg.icon
  const [exp, setExp] = useState(false)
  const preview   = msg.message.slice(0, 130)
  const needsMore = msg.message.length > 130

  return (
    <div
      onClick={!isActive ? onSelect : undefined}
      className={cn(
        'rounded-xl border transition-all duration-200 overflow-hidden',
        isActive
          ? `${cfg.activeBg} ${cfg.border}`
          : 'bg-white/[0.03] border-white/8 hover:border-white/14 cursor-pointer hover:bg-white/5',
      )}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
          <Icon className={cn('w-4 h-4', cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-[12px] font-bold', cfg.color)}>{cfg.label}</p>
          <p className="text-[10px] text-white/30 capitalize">{msg.tone} tone</p>
        </div>
        {isActive && (
          <div className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.color.replace('text-', 'bg-'))} />
        )}
      </div>

      {/* Message body — only shown when active */}
      {isActive && (
        <div className="px-4 pb-4">
          <div className="bg-white/[0.04] rounded-xl p-3.5 mb-3">
            <pre className="text-[12px] text-white/75 leading-relaxed whitespace-pre-wrap font-sans">
              {exp || !needsMore ? msg.message : `${preview}...`}
            </pre>
            {needsMore && (
              <button
                onClick={() => setExp(p => !p)}
                className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/55 mt-2 transition-colors"
              >
                {exp
                  ? <><ChevronUp className="w-3 h-3" />Show less</>
                  : <><ChevronDown className="w-3 h-3" />Show full message</>
                }
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <CopyButton text={msg.message} />
            {phone && (
              <a
                href={cfg.getHref(phone, msg.message)}
                target={msg.channel !== 'call' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-80',
                  cfg.bg, cfg.color,
                )}
              >
                <Icon className="w-3 h-3" />
                {cfg.actionLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main exported component ───────────────────────────────────────────────────

interface FollowUpComposerProps {
  leadId:    string
  leadPhone?: string
}

export function FollowUpComposer({ leadId, leadPhone }: FollowUpComposerProps) {
  const [result,    setResult]    = useState<ComposeResult | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [active,    setActive]    = useState<string>('whatsapp')
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(async () => {
    setLoading(true)
    try {
      const { data: envelope } = await api.post('/api/ai-agent/compose-followup', { leadId })
      const data: ComposeResult = envelope.data ?? envelope
      setResult(data)
      setActive('whatsapp')
      setGenerated(true)
    } catch {
      toast.error('Failed to generate messages. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [leadId])

  return (
    <div className="bg-[rgba(10,18,40,0.75)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_2px_10px_rgba(16,185,129,0.35)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white leading-none">AI Follow-Up Composer</h3>
            <p className="text-[10px] text-white/30 mt-0.5">Personalised messages ready to send</p>
          </div>
        </div>
        {generated && (
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            Regenerate
          </button>
        )}
      </div>

      <div className="p-4">

        {/* Initial state */}
        {!generated && !loading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-[13px] font-semibold text-white/70 mb-1.5">
              Generate personalised follow-up messages
            </p>
            <p className="text-[11px] text-white/30 mb-5 max-w-[260px] leading-relaxed">
              AI reads this lead's profile, stage, budget, and history to write 3 ready-to-send messages in seconds.
            </p>
            <Button
              onClick={generate}
              className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Compose Messages
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mb-3" />
            <p className="text-[12px] text-white/40">Analysing lead profile...</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {generated && result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-2.5"
            >
              {/* Intent badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-300">
                    {result.context.intentLabel}
                  </span>
                </div>
                {result.context.inactiveDays > 0 && (
                  <span className="text-[10px] text-white/25">
                    {result.context.inactiveDays}d inactive
                  </span>
                )}
              </div>

              {/* 3 message cards */}
              {result.messages.map(msg => (
                <MessageCard
                  key={msg.channel}
                  msg={msg}
                  phone={leadPhone}
                  isActive={active === msg.channel}
                  onSelect={() => setActive(msg.channel)}
                />
              ))}

              <p className="text-[10px] text-white/18 text-center pt-1">
                Messages personalised from this lead's real CRM data
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
