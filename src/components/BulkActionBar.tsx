import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Unlock, Users, AlertTriangle } from 'lucide-react'
import { useRaffleStore } from '../store'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { cn } from '../lib/utils'

const MAX_PER_PARTICIPANT = 5

interface BulkActionBarProps {
  selectedIds: Set<number>
  onClear: () => void
  onDone: () => void
}

export function BulkActionBar({ selectedIds, onClear, onDone }: BulkActionBarProps) {
  const { numbers, updateNumbers } = useRaffleStore()
  const [participant, setParticipant] = useState('')
  const [error, setError] = useState('')

  // Clear participant + error when selection changes
  useEffect(() => {
    setError('')
  }, [selectedIds])

  const count = selectedIds.size

  /** How many numbers a participant already has (excluding currently selected ones) */
  const existingCount = (name: string) =>
    numbers.filter(
      (n) =>
        n.participant?.toLowerCase() === name.trim().toLowerCase() &&
        n.status === 'reserved' &&
        !selectedIds.has(n.id)
    ).length

  const handleReserve = () => {
    const name = participant.trim()
    if (!name) {
      setError('Escribe el nombre del participante.')
      return
    }
    const already = existingCount(name)
    if (already + count > MAX_PER_PARTICIPANT) {
      const canAdd = MAX_PER_PARTICIPANT - already
      setError(
        canAdd <= 0
          ? `${name} ya tiene ${MAX_PER_PARTICIPANT} números (máximo).`
          : `${name} solo puede recibir ${canAdd} número${canAdd !== 1 ? 's' : ''} más (ya tiene ${already}).`
      )
      return
    }
    const now = new Date().toISOString()
    updateNumbers(Array.from(selectedIds), {
      status: 'reserved',
      participant: name,
      reservedAt: now,
    })
    onDone()
    setParticipant('')
    setError('')
  }

  const handleFree = () => {
    updateNumbers(Array.from(selectedIds), {
      status: 'available',
      participant: undefined,
      reservedAt: undefined,
    })
    onDone()
    setParticipant('')
    setError('')
  }

  // Hint about remaining capacity for participant
  const remainingForParticipant = participant.trim()
    ? MAX_PER_PARTICIPANT - existingCount(participant.trim())
    : null

  const overLimit =
    !!participant.trim() &&
    remainingForParticipant !== null &&
    count > remainingForParticipant

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="bg-bg-card border border-brand-green/25 rounded-2xl shadow-glow-green-xs overflow-hidden"
    >
      {/* Top row — count + cancel */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/12 border border-brand-green/30">
            <Users size={13} className="text-brand-green" />
            <span className="text-sm font-bold text-brand-green font-mono">{count}</span>
            <span className="text-xs text-brand-green/60">/ 5 seleccionados</span>
          </div>

          {/* Number chips */}
          <div className="hidden sm:flex items-center gap-1 flex-wrap max-w-xs">
            {Array.from(selectedIds)
              .sort((a, b) => a - b)
              .map((id) => (
                <span
                  key={id}
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-green/10 text-brand-green border border-brand-green/20"
                >
                  {id}
                </span>
              ))}
          </div>
        </div>

        <button
          onClick={onClear}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-bg-elevated transition-colors"
          title="Cancelar selección"
        >
          <X size={15} />
        </button>
      </div>

      {/* Bottom row — actions */}
      <div className="flex flex-col sm:flex-row gap-3 px-4 py-3">
        {/* Participant input */}
        <div className="flex-1 min-w-0">
          <Input
            id="bulk-participant"
            placeholder="Nombre del participante"
            value={participant}
            onChange={(e) => {
              setParticipant(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleReserve()}
            error={error}
            hint={
              !error && participant.trim() && remainingForParticipant !== null
                ? `${existingCount(participant.trim())} números ya asignados a ${participant.trim()} · puede recibir ${Math.max(0, remainingForParticipant)} más`
                : undefined
            }
            className={cn(overLimit && 'border-amber-500/50')}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-start gap-2 flex-shrink-0 pt-0 sm:pt-0">
          <Button
            variant="ghost"
            size="md"
            onClick={handleFree}
            className="text-slate-400 hover:text-white border border-white/10 hover:border-white/20"
            title="Marcar como disponible"
          >
            <Unlock size={15} />
            Liberar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleReserve}
            disabled={overLimit}
            title="Reservar números para participante"
          >
            <Check size={15} />
            Reservar
          </Button>
        </div>
      </div>

      {/* Over limit warning */}
      {overLimit && !error && (
        <div className="flex items-center gap-2 px-4 pb-3 text-xs text-amber-400">
          <AlertTriangle size={12} />
          <span>
            {participant.trim()} solo puede recibir {Math.max(0, remainingForParticipant!)} número{remainingForParticipant !== 1 ? 's' : ''} más.
            Tienes {count} seleccionados.
          </span>
        </div>
      )}
    </motion.div>
  )
}
