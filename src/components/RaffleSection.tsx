import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Sparkles, Calendar, Hash, User, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { useRaffleStore } from '../store'
import { Dialog, DialogPanel } from './ui/Dialog'
import { Button } from './ui/Button'
import { generateId, formatDate } from '../lib/utils'
import { cn } from '../lib/utils'

export function RaffleSection() {
  const { numbers, history, addHistory } = useRaffleStore()
  const [showModal, setShowModal] = useState(false)
  const [showHistory, setShowHistory] = useState(true)

  const reservedNumbers = numbers.filter((n) => n.status === 'reserved')
  const canRaffle = reservedNumbers.length > 0

  const handleRaffle = () => setShowModal(true)

  const onWinner = (winnerId: number, participant: string) => {
    addHistory({
      id: generateId(),
      winnerNumber: winnerId,
      participant,
      date: new Date().toISOString(),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Raffle button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col items-center gap-3"
      >
        {!canRaffle && (
          <p className="text-xs text-slate-500 text-center">
            Necesitas al menos 1 número <span className="text-brand-green font-semibold">Reservado</span> para realizar el sorteo
          </p>
        )}

        <motion.button
          disabled={!canRaffle}
          onClick={handleRaffle}
          whileHover={canRaffle ? { scale: 1.02 } : {}}
          whileTap={canRaffle ? { scale: 0.97 } : {}}
          className={cn(
            'relative px-12 py-4 rounded-2xl font-black text-lg tracking-widest uppercase',
            'transition-all duration-300 cursor-pointer select-none',
            canRaffle
              ? [
                  'bg-brand-green text-black',
                  'shadow-glow-green hover:shadow-[0_0_55px_rgba(34,255,68,0.7)]',
                  'border border-brand-green/60',
                  'animate-pulse-glow',
                ]
              : ['bg-bg-elevated text-slate-600 border border-brand-green/12 cursor-not-allowed']
          )}
        >
          {canRaffle && (
            <span className="absolute inset-0 rounded-2xl overflow-hidden">
              <span className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-40" />
            </span>
          )}
          <span className="relative flex items-center gap-3">
            <Zap size={22} />
            Realizar Sorteo
            <Trophy size={22} />
          </span>
        </motion.button>

        {canRaffle && (
          <p className="text-sm font-semibold text-white/80">
            <span className="text-brand-green font-black">{reservedNumbers.length}</span> número{reservedNumbers.length !== 1 ? 's' : ''} participando
          </p>
        )}
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-bg-card border border-brand-green/20 rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-bg-elevated transition-colors"
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
              <Trophy size={15} className="text-brand-green" />
              Historial de Sorteos
              <span className="text-xs bg-bg-elevated px-2 py-0.5 rounded-full border border-brand-green/20 text-brand-green font-mono font-bold">
                {history.length}
              </span>
            </div>
            {showHistory ? (
              <ChevronUp size={15} className="text-slate-500" />
            ) : (
              <ChevronDown size={15} className="text-slate-500" />
            )}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {history.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl',
                        i === 0
                          ? 'bg-gradient-to-r from-brand-green/10 to-bg-elevated border border-brand-green/30'
                          : 'bg-bg-elevated border border-brand-green/12'
                      )}
                    >
                      {i === 0 && <Sparkles size={13} className="text-brand-green flex-shrink-0" />}
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-sm flex-shrink-0',
                          i === 0
                            ? 'bg-brand-green text-white shadow-glow-green-xs'
                            : 'bg-bg-card text-slate-300 border border-white/10'
                        )}
                      >
                        {entry.winnerNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <User size={10} className="text-slate-600 flex-shrink-0" />
                          <span className={cn('text-sm font-medium truncate', i === 0 ? 'text-white' : 'text-slate-300')}>
                            {entry.participant}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar size={9} className="text-slate-700" />
                          <span className="text-[10px] text-slate-600">{formatDate(entry.date)}</span>
                        </div>
                      </div>
                      {i === 0 && <Trophy size={14} className="text-brand-green flex-shrink-0" />}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <RaffleModal
        open={showModal}
        reservedNumbers={reservedNumbers}
        onClose={() => setShowModal(false)}
        onWinner={onWinner}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Raffle Modal
// ─────────────────────────────────────────────

interface RaffleModalProps {
  open: boolean
  reservedNumbers: ReturnType<typeof useRaffleStore.getState>['numbers']
  onClose: () => void
  onWinner: (id: number, participant: string) => void
}

type Phase = 'spinning' | 'slowing' | 'reveal' | 'done'

function RaffleModal({ open, reservedNumbers, onClose, onWinner }: RaffleModalProps) {
  const [phase, setPhase] = useState<Phase>('spinning')
  const [displayNumber, setDisplayNumber] = useState(0)
  const [winner, setWinner] = useState<{ id: number; participant: string } | null>(null)

  useEffect(() => {
    if (!open || reservedNumbers.length === 0) return
    setPhase('spinning')
    setWinner(null)

    const selected = reservedNumbers[Math.floor(Math.random() * reservedNumbers.length)]

    const fastInterval = setInterval(() => {
      const rand = reservedNumbers[Math.floor(Math.random() * reservedNumbers.length)]
      setDisplayNumber(rand?.id ?? 0)
    }, 70)

    const slowing = setTimeout(() => {
      clearInterval(fastInterval)
      setPhase('slowing')

      let delay = 130
      const slots = [selected.id, ...reservedNumbers.slice(0, 5).map((n) => n.id), selected.id]
      let idx = 0

      const slowStep = () => {
        if (idx >= slots.length) {
          setPhase('reveal')
          setDisplayNumber(selected.id)
          setTimeout(() => {
            setWinner({ id: selected.id, participant: selected.participant ?? 'Desconocido' })
            onWinner(selected.id, selected.participant ?? 'Desconocido')
            setPhase('done')
          }, 600)
          return
        }
        setDisplayNumber(slots[idx])
        idx++
        delay = Math.min(delay + 80, 500)
        setTimeout(slowStep, delay)
      }
      slowStep()
    }, 1800)

    return () => {
      clearInterval(fastInterval)
      clearTimeout(slowing)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const raffleFooter = phase === 'done' && winner ? (
    <div className="p-4">
      <Button variant="primary" size="lg" onClick={onClose} className="w-full">
        <Sparkles size={16} />
        ¡Increíble! Cerrar
      </Button>
    </div>
  ) : undefined

  return (
    <Dialog open={open} onOpenChange={(o) => !o && phase === 'done' && onClose()}>
      <DialogPanel className="w-[400px]" footer={raffleFooter}>
        {/* Header */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-b border-brand-green/15 flex-shrink-0">
          <Sparkles className="text-brand-green" size={18} />
          <h2 className="text-base font-bold text-white tracking-wide">Realizando Sorteo</h2>
          <Sparkles className="text-brand-green" size={18} />
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          {/* Spinning number */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={phase !== 'done' ? { rotate: 360 } : { rotate: 0 }}
              transition={phase !== 'done' ? { duration: 2.5, repeat: Infinity, ease: 'linear' } : {}}
              className="absolute w-40 h-40 rounded-full border border-dashed border-brand-green/20"
            />
            <motion.div
              animate={phase !== 'done' ? { rotate: -360 } : { rotate: 0 }}
              transition={phase !== 'done' ? { duration: 1.8, repeat: Infinity, ease: 'linear' } : {}}
              className="absolute w-32 h-32 rounded-full border border-brand-green/30"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={displayNumber}
                initial={{ scale: phase === 'reveal' ? 0 : 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={phase === 'reveal' ? { type: 'spring', stiffness: 300, damping: 14 } : { duration: 0.05 }}
                className={cn(
                  'relative w-24 h-24 rounded-full flex items-center justify-center',
                  'font-black font-mono border-2',
                  phase === 'done'
                    ? 'bg-brand-green text-white border-brand-green shadow-glow-green text-4xl'
                    : 'bg-bg-elevated border-brand-green/40 text-brand-green text-3xl'
                )}
              >
                {displayNumber || '?'}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Phase label */}
          <div className="h-7 flex items-center">
            {phase === 'spinning' && (
              <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="text-sm text-slate-400">
                Mezclando números...
              </motion.p>
            )}
            {phase === 'slowing' && (
              <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="text-sm text-slate-400">
                Seleccionando ganador...
              </motion.p>
            )}
            {phase === 'reveal' && (
              <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-sm text-brand-green font-semibold">
                ¡Número seleccionado!
              </motion.p>
            )}
          </div>

          {/* Winner reveal */}
          <AnimatePresence>
            {phase === 'done' && winner && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <Trophy size={17} className="text-brand-green" />
                  <span className="text-brand-green font-bold text-base">¡Tenemos Ganador!</span>
                  <Trophy size={17} className="text-brand-green" />
                </div>

                <div className="w-full bg-gradient-to-r from-brand-green/10 via-bg-elevated to-brand-green/10 border border-brand-green/30 rounded-2xl p-4 flex flex-col items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider">
                    <Hash size={10} />
                    <span>Número Ganador</span>
                  </div>
                  <span className="text-5xl font-black font-mono text-gradient-green">{winner.id}</span>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-green/30 to-transparent" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-sm font-bold text-white">
                      {winner.participant[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{winner.participant}</p>
                      <p className="text-[10px] text-slate-500">Participante</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogPanel>
    </Dialog>
  )
}
