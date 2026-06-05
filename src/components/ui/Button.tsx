import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-green hover:bg-brand-green-mid text-white font-bold shadow-glow-green-sm hover:shadow-glow-green border border-brand-green/50',
  secondary:
    'bg-bg-elevated hover:bg-bg-hover text-slate-200 border border-white/10 hover:border-white/20',
  ghost:
    'bg-transparent hover:bg-bg-elevated text-slate-300 hover:text-white border border-transparent hover:border-white/10',
  danger:
    'bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:scale-95 cursor-pointer select-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
