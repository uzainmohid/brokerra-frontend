'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { leadsApi } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AiSummaryCardProps {
  leadId: string
  existingSummary?: string
}

const TYPING_CHARS = 2 // chars revealed per tick for typewriter effect

export function AiSummaryCard({ leadId, existingSummary }: AiSummaryCardProps) {
  const [summary, setSummary] = useState(existingSummary || '')
  const [loading, setLoading] = useState(false)
  const [displayed, setDisplayed] = useState(existingSummary || '')

  const typewriterReveal = (text: string) => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i += TYPING_CHARS
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 18)
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const { summary: newSummary } = await leadsApi.summarizeLead(leadId)
      setSummary(newSummary)
      typewriterReveal(newSummary)
      toast.success('AI summary generated')
    } catch {
      // Show demo summary when API isn't connected
      const demo = `This lead shows strong purchase intent signals based on repeated follow-up activity and engagement with property listings. Budget range of ₹1.5–2Cr aligns with current Bandra inventory. Key motivators include school proximity and 3BHK requirement with parking. Last site visit scheduled for Saturday — recommend closing push with builder incentive offer. Risk: competing broker involvement detected from conversation notes. Priority: HIGH. Recommended next action: Call within 24 hours with a specific property match.`
      setSummary(demo)
      typewriterReveal(demo)
      toast.success('AI summary generated (demo mode)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-emerald-500/15 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-400" fill="currentColor" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Lead Summary</h3>
            <p className="text-[11px] text-white/35">Powered by Brokerra Intelligence</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          loading={loading}
          className="gap-1.5 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40"
        >
          {summary ? (
            <><RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} /> Regenerate</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5" /> Generate</>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <AnimatePresence mode="wait">
          {loading && !displayed ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-white/5 animate-pulse"
                  style={{ width: `${[100, 85, 92, 60][i]}%` }}
                />
              ))}
            </motion.div>
          ) : displayed ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-white/70 leading-relaxed">
                {displayed}
                {displayed.length < summary.length && (
                  <span className="inline-block w-0.5 h-4 bg-emerald-400 ml-0.5 animate-pulse align-text-bottom" />
                )}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-6 text-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-500/50" />
              </div>
              <div>
                <p className="text-sm text-white/40 font-medium">No summary yet</p>
                <p className="text-xs text-white/25 mt-0.5 max-w-xs">
                  Generate an AI-powered summary of this lead's history, intent signals, and recommended next actions.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
