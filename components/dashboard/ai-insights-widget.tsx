'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronRight, X, TrendingUp, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'

const INSIGHTS = [
  {
    id: '1',
    type: 'urgent' as const,
    icon: AlertTriangle,
    message: 'Rajesh Kumar hasn\'t been contacted in 7 days — ₹1.85Cr deal at risk.',
    action: 'Follow up now',
    href: '/leads/l1',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    id: '2',
    type: 'opportunity' as const,
    icon: TrendingUp,
    message: 'Priya Mehta viewed the property listing 4 times today — she\'s ready to close.',
    action: 'View lead',
    href: '/leads/l2',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    id: '3',
    type: 'reminder' as const,
    icon: Clock,
    message: '3 follow-ups are overdue by more than 48 hours. Act now to prevent cold leads.',
    action: 'View overdue',
    href: '/leads?status=follow-up',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
]

export function AiInsightsWidget() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const visible = INSIGHTS.filter(i => !dismissed.includes(i.id))

  return (
    <div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/6">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Insights</h3>
          <p className="text-[11px] text-white/35">Real-time intelligence on your pipeline</p>
        </div>
        {visible.length > 0 && (
          <div className="ml-auto w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{visible.length}</span>
          </div>
        )}
      </div>

      {/* Insights list */}
      <div className="p-3 space-y-2">
        <AnimatePresence>
          {visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <Zap className="w-8 h-8 text-emerald-500/20 mx-auto mb-2" />
              <p className="text-sm text-white/30">All insights reviewed</p>
            </motion.div>
          ) : (
            visible.map(insight => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={insight.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`relative flex items-start gap-3 p-3.5 rounded-xl border ${insight.border} ${insight.bg}`}
                >
                  <div className={`w-7 h-7 rounded-lg ${insight.bg} border ${insight.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${insight.color}`} />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <p className="text-xs text-white/65 leading-relaxed mb-2">{insight.message}</p>
                    <Link
                      href={insight.href}
                      className={`flex items-center gap-1 text-xs font-semibold ${insight.color} hover:opacity-80 transition-opacity`}
                    >
                      {insight.action} <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <button
                    onClick={() => setDismissed(prev => [...prev, insight.id])}
                    className="absolute top-3 right-3 text-white/20 hover:text-white/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
