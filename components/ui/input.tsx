import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconRight, error, ...props }, ref) => {
    if (icon || iconRight) {
      return (
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              'backdrop-blur-sm',
              error && 'border-red-500/50 focus:ring-red-500/30',
              icon && 'pl-9',
              iconRight && 'pr-9',
              className
            )}
            ref={ref}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              {iconRight}
            </div>
          )}
          {error && (
            <p className="mt-1 text-xs text-red-400">{error}</p>
          )}
        </div>
      )
    }

    return (
      <div>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            'backdrop-blur-sm',
            error && 'border-red-500/50 focus:ring-red-500/30',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
