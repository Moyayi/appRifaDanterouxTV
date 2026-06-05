import * as RadixProgress from '@radix-ui/react-progress'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, className, showLabel = false }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Progreso</span>
          <span className="font-mono font-semibold text-white">{percent}%</span>
        </div>
      )}
      <RadixProgress.Root
        value={value}
        max={max}
        className="relative h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5"
      >
        <RadixProgress.Indicator asChild>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-green-dark to-brand-green shadow-glow-green-xs"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </RadixProgress.Indicator>
      </RadixProgress.Root>
    </div>
  )
}
