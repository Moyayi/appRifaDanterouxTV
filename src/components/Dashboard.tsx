import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Hash, CheckSquare, Sparkles, Users, Trophy, TrendingUp, Download, Upload, RotateCcw } from 'lucide-react'
import { useRaffleStore, useStats } from '../store'
import { ProgressBar } from './ui/Progress'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'
import type { RaffleNumber, RaffleConfig, RaffleResult, Prize } from '../types'

export function Dashboard() {
  const { numbers, config, prizes, history, importData, resetNumbers } = useRaffleStore()
  const stats = useStats()
  const participants = buildParticipantList(numbers)
  const importRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = { numbers, config, prizes, history }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rifa-danterouxtv-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as {
          numbers: RaffleNumber[]; config: RaffleConfig; prizes: Prize[]; history: RaffleResult[]
        }
        if (data.numbers && data.config) importData(data)
      } catch { alert('Archivo JSON inválido') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('¿Resetear todos los números a "Disponible"?')) resetNumbers()
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-brand-green/30 to-transparent" />
        <span className="text-xs font-semibold text-brand-green uppercase tracking-widest">Dashboard</span>
        <div className="h-px flex-1 bg-gradient-to-l from-brand-green/30 to-transparent" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={<Hash size={15} />} label="Total" value={100} color="dim" delay={0} />
        <StatCard icon={<Sparkles size={15} />} label="Disponibles" value={stats.available} color="dim" delay={0.05} />
        <StatCard icon={<CheckSquare size={15} />} label="Reservados" value={stats.reserved} color="green" delay={0.1} fullWidth={stats.reserved === 100} />
        <StatCard icon={<TrendingUp size={15} />} label="Progreso" value={stats.percent} suffix="%" color="green" delay={0.15} />
      </div>

      {/* Progress */}
      <div className="bg-bg-card border border-brand-green/20 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Trophy size={14} className="text-brand-green" />
            <span>Completado</span>
          </div>
          <motion.span
            key={stats.percent}
            initial={{ scale: 1.3, color: '#22ff44' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-2xl font-black font-mono text-white"
          >
            {stats.percent}%
          </motion.span>
        </div>
        <ProgressBar value={stats.reserved} max={100} showLabel={false} />
        <div className="flex justify-between text-xs text-slate-600">
          <span>{stats.reserved} asignados</span>
          <span>{100 - stats.reserved} libres</span>
        </div>
      </div>

      {/* Participants */}
      {participants.length > 0 && (
        <div className="bg-bg-card border border-brand-green/20 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users size={14} className="text-brand-green" />
            <span>Participantes</span>
            <span className="ml-auto text-xs bg-bg-elevated px-2 py-0.5 rounded-full border border-brand-green/20 text-brand-green font-mono font-bold">
              {participants.length}
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
            {participants.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025 }}
                className="flex flex-col gap-2 p-3 rounded-xl bg-bg-elevated border border-brand-green/12 hover:border-brand-green/25 transition-colors"
              >
                {/* Name row */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-green-dim to-brand-green-dark flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <p className="text-sm text-white font-semibold truncate flex-1">{p.name}</p>
                  <span className="text-xs font-mono font-black text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-lg border border-brand-green/25 flex-shrink-0">
                    {p.count}
                  </span>
                </div>
                {/* Number chips */}
                <div className="flex flex-wrap gap-1 pl-9">
                  {p.numbers.map((n) => (
                    <span
                      key={n}
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-brand-green text-black leading-none"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-brand-green/15 to-transparent" />

      {/* Tools */}
      <div className="bg-bg-card border border-brand-green/20 rounded-2xl p-4 flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Herramientas</p>
        <Button variant="ghost" size="sm" onClick={handleExport} className="w-full justify-start gap-2.5 text-slate-400 hover:text-white">
          <Download size={14} className="text-brand-green" />
          Exportar datos (JSON)
        </Button>
        <Button variant="ghost" size="sm" onClick={() => importRef.current?.click()} className="w-full justify-start gap-2.5 text-slate-400 hover:text-white">
          <Upload size={14} className="text-brand-green" />
          Importar datos (JSON)
        </Button>
        <div className="h-px bg-white/6 my-0.5" />
        <Button variant="ghost" size="sm" onClick={handleReset} className="w-full justify-start gap-2.5 text-red-400/70 hover:text-red-300">
          <RotateCcw size={14} />
          Resetear números
        </Button>
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>
    </motion.aside>
  )
}

function StatCard({
  icon, label, value, suffix = '', color, delay, fullWidth,
}: {
  icon: React.ReactNode
  label: string
  value: number
  suffix?: string
  color: 'dim' | 'green'
  delay: number
  fullWidth?: boolean
}) {
  const colorClasses = color === 'green'
    ? 'text-brand-green bg-brand-green/10 border-brand-green/20'
    : 'text-slate-500 bg-white/5 border-brand-green/15'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn('bg-bg-card border border-brand-green/20 rounded-2xl p-3.5 flex flex-col gap-2', fullWidth && 'col-span-2')}
    >
      <div className={cn('p-1.5 rounded-lg w-fit border', colorClasses)}>
        {icon}
      </div>
      <div>
        <motion.p
          key={value}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          className={cn('text-2xl font-black font-mono', color === 'green' ? 'text-brand-green' : 'text-white')}
        >
          {value}{suffix}
        </motion.p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </motion.div>
  )
}

function buildParticipantList(numbers: ReturnType<typeof useRaffleStore.getState>['numbers']) {
  const map = new Map<string, { displayName: string; numbers: number[] }>()

  for (const n of numbers) {
    if (!n.participant || n.status !== 'reserved') continue
    const key = n.participant.toLowerCase()
    const entry = map.get(key)
    if (entry) {
      entry.numbers.push(n.id)
    } else {
      map.set(key, { displayName: n.participant, numbers: [n.id] })
    }
  }

  return Array.from(map.values())
    .map((v) => ({
      name: v.displayName,
      count: v.numbers.length,
      numbers: v.numbers.sort((a, b) => a - b),
    }))
    .sort((a, b) => b.count - a.count)
}
