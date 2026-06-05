import { cn } from '../../lib/utils'
import type { NumberStatus } from '../../types'

const statusConfig = {
  available: {
    label: 'Disponible',
    className: 'bg-white/8 text-slate-400 border border-white/10',
  },
  reserved: {
    label: 'Reservado',
    className: 'bg-brand-green/15 text-brand-green border border-brand-green/30',
  },
}

interface StatusBadgeProps {
  status: NumberStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, className: statusClass } = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClass,
        className
      )}
    >
      {label}
    </span>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'dim'
  className?: string
}

const badgeVariants = {
  default: 'bg-white/8 text-slate-300 border border-white/10',
  green: 'bg-brand-green/15 text-brand-green border border-brand-green/30',
  dim: 'bg-white/5 text-slate-500 border border-white/8',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
