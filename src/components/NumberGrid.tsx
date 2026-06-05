import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRaffleStore } from '../store'
import { BulkActionBar } from './BulkActionBar'
import type { RaffleNumber } from '../types'
import { cn } from '../lib/utils'

const MAX_SELECTION = 5

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.005 } },
}
const itemVariants = {
  hidden:   { opacity: 0, scale: 0.6 },
  visible:  { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 340, damping: 24 } },
}

export function NumberGrid() {
  const numbers = useRaffleStore((s) => s.numbers)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const toggle = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.size < MAX_SELECTION && next.add(id)
      return next
    })

  const clearSelection = () => setSelectedIds(new Set())
  const atMax = selectedIds.size >= MAX_SELECTION

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-brand-green/40 to-transparent" />
        <span className="text-xs font-bold text-brand-green uppercase tracking-widest">Números</span>
        <div className="h-px flex-1 bg-gradient-to-l from-brand-green/40 to-transparent" />
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="text-xs font-mono font-bold text-brand-green bg-brand-green/12 border border-brand-green/40 px-2 py-0.5 rounded-full"
            >
              {selectedIds.size}/{MAX_SELECTION}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-10 gap-2"
      >
        {numbers.map((num) => (
          <NumberCard
            key={num.id}
            number={num}
            isSelected={selectedIds.has(num.id)}
            isDisabled={atMax && !selectedIds.has(num.id)}
            onClick={() => toggle(num.id)}
          />
        ))}
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-[11px] text-slate-500">
        <LegendItem bg="bg-bg-card border border-white/10"          label="Disponible" />
        <LegendItem bg="bg-brand-green"                             label="Reservado"  />
        {selectedIds.size > 0 &&
          <LegendItem bg="border-2 border-white bg-transparent"     label="Seleccionado" />}
      </div>

      {/* Bulk bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <BulkActionBar
            selectedIds={selectedIds}
            onClear={clearSelection}
            onDone={clearSelection}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function LegendItem({ bg, label }: { bg: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('inline-block w-2.5 h-2.5 rounded-sm', bg)} />
      <span>{label}</span>
    </div>
  )
}

interface NumberCardProps {
  number: RaffleNumber
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
}

function NumberCard({ number, isSelected, isDisabled, onClick }: NumberCardProps) {
  const { status, id, participant } = number

  return (
    <motion.button
      variants={itemVariants}
      whileHover={!isDisabled ? { scale: 1.12, zIndex: 10 } : {}}
      whileTap={!isDisabled   ? { scale: 0.92 } : {}}
      onClick={onClick}
      className={cn(
        'relative aspect-square rounded-lg flex flex-col items-center justify-center',
        'select-none border transition-all duration-150 text-base font-black font-mono',

        /* Disabled */
        isDisabled && 'opacity-20 cursor-not-allowed bg-bg-card border-white/5 text-slate-600',

        /* Selected — white ring */
        !isDisabled && isSelected && [
          'bg-white/15 border-2 border-white text-white scale-105',
          'shadow-[0_0_10px_rgba(255,255,255,0.25)]',
        ],

        /* Available */
        !isDisabled && !isSelected && status === 'available' && [
          'bg-bg-card border-white/10 text-slate-300',
          'hover:border-white/30 hover:text-white hover:bg-bg-elevated',
        ],

        /* Reserved — solid green, black text for maximum contrast */
        !isDisabled && !isSelected && status === 'reserved' && [
          'bg-brand-green border-brand-green text-black font-black',
          'shadow-number-reserved hover:shadow-glow-green',
        ]
      )}
      title={isDisabled ? `Máximo ${MAX_SELECTION}` : participant ? `#${id} — ${participant}` : `#${id}`}
    >
      <span className="leading-none">{id}</span>


      {isSelected && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-0.5 right-0.5">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      )}
    </motion.button>
  )
}
