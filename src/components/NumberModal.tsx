import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, User, AlertTriangle } from 'lucide-react'
import { Dialog, DialogPanel } from './ui/Dialog'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { StatusBadge } from './ui/Badge'
import { useRaffleStore } from '../store'
import { cn } from '../lib/utils'
import type { RaffleNumber, NumberStatus } from '../types'

interface NumberModalProps {
  number: RaffleNumber | null
  onClose: () => void
}

const MAX_PER_PARTICIPANT = 5

export function NumberModal({ number, onClose }: NumberModalProps) {
  const { numbers, updateNumber } = useRaffleStore()
  const [status, setStatus] = useState<NumberStatus>('available')
  const [participant, setParticipant] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (number) {
      setStatus(number.status)
      setParticipant(number.participant || '')
      setError('')
    }
  }, [number])

  const participantCount = (name: string, excludeId?: number) =>
    numbers.filter(
      (n) =>
        n.participant?.toLowerCase() === name.toLowerCase() &&
        n.status !== 'available' &&
        n.id !== excludeId
    ).length

  const validate = (): boolean => {
    if (status === 'reserved' && !participant.trim()) {
      setError('El nombre del participante es obligatorio.')
      return false
    }
    if (status === 'reserved' && participant.trim()) {
      const count = participantCount(participant.trim(), number?.id)
      if (count >= MAX_PER_PARTICIPANT) {
        setError(`${participant.trim()} ya tiene ${MAX_PER_PARTICIPANT} números (máximo permitido).`)
        return false
      }
    }
    setError('')
    return true
  }

  const handleSave = () => {
    if (!validate()) return
    const now = new Date().toISOString()
    const update: Partial<RaffleNumber> = { status }
    if (status === 'available') {
      update.participant = undefined
      update.reservedAt = undefined
    } else {
      update.participant = participant.trim()
      if (number?.status !== 'reserved') update.reservedAt = now
    }
    updateNumber(number!.id, update)
    onClose()
  }

  if (!number) return null

  const currentParticipantCount = participant.trim()
    ? participantCount(participant.trim(), number.id)
    : 0

  const actions = (
    <div className="flex gap-3 p-4">
      <Button variant="ghost" size="md" onClick={onClose} className="flex-1">
        Cancelar
      </Button>
      <Button
        variant={status === 'reserved' ? 'primary' : 'secondary'}
        size="md"
        onClick={handleSave}
        className="flex-1"
      >
        <Check size={15} />
        Guardar
      </Button>
    </div>
  )

  return (
    <Dialog open={!!number} onOpenChange={(open) => !open && onClose()}>
      <DialogPanel className="w-[360px]" onClose={onClose} footer={actions}>
        {/* Hero */}
        <div
          className={cn(
            'flex items-center justify-center py-6 relative',
            status === 'available'
              ? 'bg-gradient-to-br from-bg-elevated to-bg-card'
              : 'bg-gradient-to-br from-bg-elevated/80 to-bg-card'
          )}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              'text-6xl font-black font-mono',
              status === 'reserved' ? 'text-gradient-green' : 'text-slate-400'
            )}
          >
            {number.id}
          </motion.div>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
            <StatusBadge status={number.status} />
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Status selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'available' as const, label: 'Disponible', icon: <Sparkles size={15} />, desc: 'Sin asignar' },
                { value: 'reserved' as const, label: 'Reservado', icon: <Check size={15} />, desc: 'Asignado' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatus(opt.value); setError('') }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200',
                    status === opt.value
                      ? opt.value === 'available'
                        ? 'bg-white/8 border-white/20 text-slate-300'
                        : 'bg-brand-green/12 border-brand-green/50 text-brand-green shadow-glow-green-xs'
                      : 'bg-bg-elevated border-white/6 text-slate-500 hover:border-white/15 hover:text-slate-400'
                  )}
                >
                  {opt.icon}
                  <span className="text-xs font-semibold leading-none">{opt.label}</span>
                  <span className="text-[10px] opacity-55">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Participant input */}
          <AnimatePresence>
            {status === 'reserved' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Input
                  label="Participante"
                  id="participant"
                  placeholder="Nombre del participante"
                  value={participant}
                  onChange={(e) => { setParticipant(e.target.value); setError('') }}
                  error={error}
                  hint={
                    participant.trim()
                      ? `${currentParticipantCount}/${MAX_PER_PARTICIPANT} números de este participante`
                      : undefined
                  }
                  autoComplete="off"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {number.participant && status === 'available' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs text-amber-400">
              <AlertTriangle size={13} />
              <span>Se eliminará la asignación de <strong>{number.participant}</strong></span>
            </div>
          )}

          {number.participant && status === 'reserved' && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-elevated border border-brand-green/20 text-xs text-slate-400">
              <User size={13} />
              <span>Asignado a <strong className="text-white">{number.participant}</strong></span>
            </div>
          )}
        </div>
      </DialogPanel>
    </Dialog>
  )
}
