'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChartCard } from './chart-card'
import { cn } from '@/lib/utils'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['6am', '9am', '12pm', '3pm', '6pm', '9pm']

// Mock activity intensity matrix [day][hour] 0–10
const ACTIVITY = [
  [2, 7, 5, 8, 6, 3],
  [1, 8, 6, 9, 7, 2],
  [3, 9, 7, 8, 5, 1],
  [2, 7, 8, 10, 8, 3],
  [4, 8, 6, 7, 9, 4],
  [1, 3, 5, 4, 3, 2],
  [0, 2, 3, 2, 1, 1],
]

function intensity(val: number) {
  if (val === 0) return 'bg-white/4 border-white/4'
  if (val <= 2) return 'bg-emerald-900/40 border-emerald-800/30'
  if (val <= 4) return 'bg-emerald-800/50 border-emerald-700/30'
  if (val <= 6) return 'bg-emerald-700/60 border-emerald-600/30'
  if (val <= 8) return 'bg-emerald-600/70 border-emerald-500/30'
  return 'bg-emerald-500/85 border-emerald-400/40'
}

export function ActivityHeatmap() {
  return (
    <ChartCard title="Activity Heatmap" description="When you're most active with leads">
      <div className="mt-2">
        {/* Hours header */}
        <div className="grid grid-cols-7 mb-2 ml-10">
          {HOURS.map(h => (
            <div key={h} className="text-[10px] text-white/25 text-center">{h}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-1.5">
          {DAYS.map((day, di) => (
            <div key={day} className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/30 w-8 flex-shrink-0">{day}</span>
              <div className="grid grid-cols-6 gap-1.5 flex-1">
                {HOURS.map((_, hi) => (
                  <motion.div
                    key={hi}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (di * 6 + hi) * 0.008 }}
                    title={`${ACTIVITY[di][hi]} interactions`}
                    className={cn(
                      'h-6 rounded-md border cursor-default transition-all duration-150 hover:scale-110',
                      intensity(ACTIVITY[di][hi])
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-white/25">Less</span>
          {[0, 3, 5, 7, 9].map(v => (
            <div key={v} className={cn('w-4 h-4 rounded border', intensity(v))} />
          ))}
          <span className="text-[10px] text-white/25">More</span>
        </div>
      </div>
    </ChartCard>
  )
}
