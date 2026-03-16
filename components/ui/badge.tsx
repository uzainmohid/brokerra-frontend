import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
        secondary: 'border-white/10 bg-white/8 text-white/60',
        destructive: 'border-red-500/30 bg-red-500/15 text-red-400',
        outline: 'border-white/15 text-white/70',
        hot: 'border-red-500/30 bg-red-500/15 text-red-400',
        warm: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
        cold: 'border-blue-500/30 bg-blue-500/15 text-blue-400',
        new: 'border-blue-500/30 bg-blue-500/15 text-blue-400',
        contacted: 'border-purple-500/30 bg-purple-500/15 text-purple-400',
        'follow-up': 'border-amber-500/30 bg-amber-500/15 text-amber-400',
        'site-visit': 'border-orange-500/30 bg-orange-500/15 text-orange-400',
        negotiation: 'border-pink-500/30 bg-pink-500/15 text-pink-400',
        closed: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
        lost: 'border-gray-500/30 bg-gray-500/15 text-gray-400',
        overdue: 'border-red-500/30 bg-red-500/15 text-red-400',
        pending: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
