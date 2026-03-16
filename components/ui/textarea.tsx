import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            'flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5',
            'text-sm text-white placeholder:text-white/30',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200 resize-none',
            'backdrop-blur-sm',
            error && 'border-red-500/50 focus:ring-red-500/30',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
