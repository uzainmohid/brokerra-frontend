import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-5 text-white/30">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white/70 mb-2">{title}</h3>
      <p className="text-sm text-white/35 max-w-xs leading-relaxed mb-6">{description}</p>
      {action && action}
    </motion.div>
  )
}
