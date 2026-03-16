'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import { ChartCard } from './chart-card'
import { formatCurrency, getInitials } from '@/utils'
import { cn } from '@/lib/utils'

const BROKERS = [
  { name: 'Priya Sharma', deals: 22, revenue: 32400000, change: 18 },
  { name: 'Rakesh Menon', deals: 18, revenue: 27100000, change: 12 },
  { name: 'Aditya Kumar', deals: 15, revenue: 22800000, change: 8 },
  { name: 'Sunita Rao',   deals: 11, revenue: 16500000, change: -3 },
  { name: 'Mohammed Ali', deals: 9,  revenue: 13200000, change: 5 },
]

const MEDAL = ['🥇', '🥈', '🥉']

const AVATAR_COLORS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
  'from-amber-600 to-orange-500',
  'from-red-500 to-rose-500',
]

export function BrokerLeaderboard() {
  const maxDeals = BROKERS[0].deals

  return (
    <ChartCard title="Broker Leaderboard" description="Top performers this month">
      <div className="space-y-3 mt-1">
        {BROKERS.map((broker, i) => (
          <motion.div
            key={broker.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-3"
          >
            {/* Rank */}
            <div className="w-6 text-center flex-shrink-0">
              {i < 3
                ? <span className="text-base">{MEDAL[i]}</span>
                : <span className="text-xs text-white/25 font-bold">{i + 1}</span>
              }
            </div>

            {/* Avatar */}
            <div className={cn(
              'w-8 h-8 rounded-full bg-gradient-to-br flex-shrink-0',
              'flex items-center justify-center text-xs font-bold text-white',
              AVATAR_COLORS[i]
            )}>
              {getInitials(broker.name)}
            </div>

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white/80 truncate">{broker.name}</span>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-xs font-bold text-white/60">{broker.deals} deals</span>
                  <span className={cn(
                    'flex items-center gap-0.5 text-[10px] font-semibold',
                    broker.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    <TrendingUp className={cn('w-2.5 h-2.5', broker.change < 0 && 'rotate-180')} />
                    {Math.abs(broker.change)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(broker.deals / maxDeals) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', i === 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-white/25')}
                />
              </div>
              <div className="text-[10px] text-white/25 mt-0.5">{formatCurrency(broker.revenue)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </ChartCard>
  )
}
