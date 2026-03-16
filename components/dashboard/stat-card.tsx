'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconColor?: string
  iconBg?: string
  className?: string
  delay?: number
  suffix?: string
  glow?: boolean
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor = 'text-emerald-400',
  iconBg = 'bg-emerald-500/10',
  className,
  delay = 0,
  suffix,
  glow = false,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral = change === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        'glass-card rounded-2xl p-6 group cursor-default',
        'transition-all duration-300',
        'hover:border-emerald-500/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(16,185,129,0.05)]',
        glow && 'border-emerald-500/15 shadow-[0_0_30px_rgba(16,185,129,0.1)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/45 mb-3">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white tracking-tight">
              {value}
            </span>
            {suffix && (
              <span className="text-lg font-semibold text-white/50">{suffix}</span>
            )}
          </div>

          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-3 text-xs font-medium',
              isPositive && 'text-emerald-400',
              isNegative && 'text-red-400',
              isNeutral && 'text-white/40',
            )}>
              {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
              {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
              {isNeutral && <Minus className="w-3.5 h-3.5" />}
              <span>
                {isPositive && '+'}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-white/30 font-normal">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
          'transition-transform duration-300 group-hover:scale-110',
          iconBg,
        )}>
          <div className={cn('w-5 h-5', iconColor)}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
