import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import { PrizesPanel } from './components/PrizesPanel'
import { NumberGrid } from './components/NumberGrid'
import { Dashboard } from './components/Dashboard'
import { RaffleSection } from './components/RaffleSection'
import { useRaffleStore } from './store'
import { imageToBase64 } from './lib/utils'

export default function App() {
  return (
    <div className="min-h-screen">
      <LogoBanner />

      <main className="relative max-w-[1600px] mx-auto px-4 pb-8">
        <div className="grid grid-cols-[260px_1fr_260px] gap-6 xl:grid-cols-[280px_1fr_280px]">
          <PrizesPanel />
          <div className="flex flex-col gap-8">
            <NumberGrid />
            <RaffleSection />
          </div>
          <Dashboard />
        </div>
      </main>
    </div>
  )
}

function LogoBanner() {
  const { config, updateConfig } = useRaffleStore()
  const logoRef = useRef<HTMLInputElement>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    updateConfig({ logoImage: await imageToBase64(file) })
    e.target.value = ''
  }

  const saveTitle = () => {
    if (titleDraft.trim()) updateConfig({ title: titleDraft.trim() })
    setEditingTitle(false)
  }

  return (
    <div className="relative max-w-[1600px] mx-auto px-4 pt-6 pb-5 flex flex-col items-center gap-3">
      {/* Atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[200px] bg-brand-green/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[120px] bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />

      {/* Logo */}
      <motion.div
        className="relative group cursor-pointer"
        initial={{ opacity: 0, scale: 0.85, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.05 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => logoRef.current?.click()}
        title="Haz clic para cambiar el logo"
      >
        {config.logoImage ? (
          <img
            src={config.logoImage}
            alt="DanterouxTV"
            className="h-44 w-auto object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 20px rgba(34,255,68,0.22))' }}
          />
        ) : (
          <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-brand-green/60 transition-colors">
            <Upload size={28} />
            <span className="text-xs">Subir logo</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-brand-green/30">
            <Upload size={13} className="text-brand-green" />
            <span className="text-xs text-white font-medium">Cambiar logo</span>
          </div>
        </div>
      </motion.div>

      {/* Editable title */}
      {editingTitle ? (
        <input
          autoFocus
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false) }}
          className="bg-transparent border-b-2 border-brand-green text-xl font-bold text-white text-center outline-none w-80"
        />
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => { setTitleDraft(config.title); setEditingTitle(true) }}
          className="text-xl font-bold text-white/80 cursor-pointer hover:text-brand-green transition-colors select-none tracking-wide"
          title="Haz clic para editar el título"
        >
          {config.title}
        </motion.p>
      )}

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-green/20 to-transparent" />
      <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
    </div>
  )
}
