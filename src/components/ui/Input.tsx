import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full bg-bg-elevated border border-brand-green/20 rounded-xl px-4 py-2.5',
            'text-sm text-white placeholder:text-slate-500',
            'transition-all duration-200',
            'hover:border-white/20',
            'focus:outline-none focus:border-brand-purple/60 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]',
            error && 'border-rose-500/50 focus:border-rose-500/70',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
