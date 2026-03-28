'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { ChartCard } from './chart-card'
import { formatCurrency, getInitials } from '@/utils'
import { cn } from '@/lib/utils'

interface Broker {
  name: string
  closedDeals: number
  revenue: number
}

interface BrokerLeaderboardProps {
  brokers?: Broker[]
}

const MEDAL = ['🥇', '🥈', '🥉']

const AVATAR_COLORS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
  'from-amber-600 to-orange-500',
  'from-red-500 to-rose-500',
]

export function BrokerLeaderboard({ brokers }: BrokerLeaderboardProps) {
  // If no data from backend, show empty state — no fake data
  if (!brokers || brokers.length === 0) {
    return (
      <ChartCard title="Top Closers" description="Leads closed this period">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Trophy className="w-8 h-8 text-white/15 mb-3" />
          <p className="text-sm text-white/30">No closed deals yet</p>
          <p className="text-[11px] text-white/18 mt-1">
            Close your first lead to see rankings here
          </p>
        </div>
      </ChartCard>
    )
  }

  const maxDeals = brokers[0]?.closedDeals || 1

  return (
    <ChartCard title="Top Closers" description="Leads closed this period">
      <div className="space-y-3 mt-1">
        {brokers.slice(0, 5).map((broker, i) => (
          <motion.div
            key={broker.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-3"
          >
            {/* Rank / medal */}
            <div className="w-6 text-center flex-shrink-0">
              {i < 3
                ? <span className="text-base leading-none">{MEDAL[i]}</span>
                : <span className="text-xs font-bold text-white/30">{i + 1}</span>
              }
            </div>

            {/* Avatar */}
            <div className={cn(
              'w-8 h-8 rounded-full flex-shrink-0',
              'flex items-center justify-center text-[10px] font-bold text-white',
              'bg-gradient-to-br',
              AVATAR_COLORS[i % AVATAR_COLORS.length]
            )}>
              {getInitials(broker.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-white/85 truncate">
                  {broker.name}
                </span>
                <span className="text-[11px] font-bold text-white/60 flex-shrink-0 ml-2">
                  {broker.closedDeals} deals
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(broker.closedDeals / maxDeals) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                  className={cn(
                    'h-full rounded-full',
                    i === 0 ? 'bg-emerald-500' :
                    i === 1 ? 'bg-blue-500' :
                    i === 2 ? 'bg-purple-500' : 'bg-white/20'
                  )}
                />
              </div>

              <div className="text-[10px] text-white/30 mt-0.5">
                {formatCurrency(broker.revenue)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </ChartCard>
  )
}
