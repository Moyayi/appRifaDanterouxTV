import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, Pencil, Check, X, Plus, Trash2, ZoomIn, Trophy } from 'lucide-react'
import { useRaffleStore } from '../store'
import { imageToBase64 } from '../lib/utils'
import { Button } from './ui/Button'
import { Dialog, DialogPanel } from './ui/Dialog'
import type { Prize } from '../types'

export function PrizesPanel() {
  const { prizes, addPrize, removePrize, updatePrize } = useRaffleStore()
  const [previewPrize, setPreviewPrize] = useState<Prize | null>(null)

  const canAdd = prizes.length < 4

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        {/* Section label */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-brand-green/30 to-transparent" />
          <span className="text-xs font-semibold text-brand-green uppercase tracking-widest">Premios</span>
          <div className="h-px flex-1 bg-gradient-to-l from-brand-green/30 to-transparent" />
        </div>

        {/* Prize cards */}
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              >
                <PrizeCard
                  prize={prize}
                  index={index}
                  onUpdate={(update) => updatePrize(prize.id, update)}
                  onRemove={() => removePrize(prize.id)}
                  onPreview={() => setPreviewPrize(prize)}
                  canRemove={prizes.length > 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add prize */}
        <Button
          variant="ghost"
          size="sm"
          onClick={addPrize}
          disabled={!canAdd}
          className="w-full border border-dashed border-brand-green/20 hover:border-brand-green/50 text-slate-500 hover:text-brand-green disabled:opacity-30"
        >
          <Plus size={15} />
          {canAdd ? `Añadir Premio (${prizes.length}/4)` : 'Máximo 4 premios'}
        </Button>

        <div className="h-px bg-gradient-to-r from-transparent via-brand-green/15 to-transparent" />
      </motion.aside>

      {/* Full-size image preview modal */}
      <PrizePreviewModal
        prize={previewPrize}
        onClose={() => setPreviewPrize(null)}
      />
    </>
  )
}

// ─────────────────────────────────────────────
// Individual prize card
// ─────────────────────────────────────────────

interface PrizeCardProps {
  prize: Prize
  index: number
  onUpdate: (update: Partial<Prize>) => void
  onRemove: () => void
  onPreview: () => void
  canRemove: boolean
}

function PrizeCard({ prize, index, onUpdate, onRemove, onPreview, canRemove }: PrizeCardProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [descDraft, setDescDraft] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  const ordinalLabel = ['1er', '2do', '3er', '4to'][index] ?? `${index + 1}°`

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await imageToBase64(file)
    onUpdate({ image: base64 })
    e.target.value = ''
  }

  const saveTitle = () => {
    if (titleDraft.trim()) onUpdate({ title: titleDraft.trim() })
    setEditingTitle(false)
  }

  const saveDesc = () => {
    if (descDraft.trim()) onUpdate({ description: descDraft.trim() })
    setEditingDesc(false)
  }

  return (
    <div className="bg-bg-card border border-brand-green/20 rounded-2xl overflow-hidden group/card hover:border-brand-green/20 transition-colors">
      {/* Prize image */}
      <div className="relative aspect-video bg-bg-elevated overflow-hidden">
        {prize.image ? (
          <>
            <img
              src={prize.image}
              alt={prize.title}
              className="w-full h-full object-cover"
            />
            {/* Hover overlay — click to preview */}
            <button
              onClick={onPreview}
              className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100 cursor-zoom-in"
            >
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20">
                <ZoomIn size={14} className="text-white" />
                <span className="text-xs text-white font-medium">Ver imagen</span>
              </div>
            </button>
          </>
        ) : (
          <button
            onClick={() => imageInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-brand-green/60 transition-colors cursor-pointer"
          >
            <ImagePlus size={22} />
            <span className="text-xs">Añadir imagen</span>
          </button>
        )}

        {/* Ordinal badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-brand-green/30">
            <Trophy size={10} className="text-brand-green" />
            <span className="text-[10px] font-bold text-brand-green">{ordinalLabel}</span>
          </div>
        </div>

        {/* Controls — appear on hover */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
          {prize.image && (
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-colors"
              title="Cambiar imagen"
            >
              <ImagePlus size={12} />
            </button>
          )}
          {canRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:border-red-400/50 transition-colors"
              title="Eliminar premio"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>

      {/* Prize info */}
      <div className="p-3 flex flex-col gap-1.5">
        {/* Title */}
        <div className="group/title">
          {editingTitle ? (
            <div className="flex gap-1.5">
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false) }}
                onBlur={saveTitle}
                className="flex-1 bg-bg-elevated border border-brand-green/40 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none min-w-0"
              />
              <button onClick={saveTitle} className="p-1 rounded-lg hover:bg-bg-elevated text-brand-green">
                <Check size={13} />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center justify-between gap-1 cursor-pointer"
              onClick={() => { setTitleDraft(prize.title); setEditingTitle(true) }}
            >
              <span className="text-sm font-bold text-white">{prize.title}</span>
              <button className="opacity-0 group-hover/title:opacity-100 transition-opacity p-0.5 rounded hover:bg-bg-elevated text-slate-500 hover:text-slate-300 flex-shrink-0">
                <Pencil size={11} />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="group/desc">
          {editingDesc ? (
            <div className="flex flex-col gap-1.5">
              <textarea
                autoFocus
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') setEditingDesc(false) }}
                rows={2}
                className="w-full bg-bg-elevated border border-brand-green/40 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none resize-none"
              />
              <div className="flex gap-1.5">
                <Button variant="primary" size="sm" onClick={saveDesc} className="flex-1 text-xs py-1">
                  <Check size={12} /> Guardar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingDesc(false)} className="text-xs py-1 px-2">
                  <X size={12} />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-start justify-between gap-1 cursor-pointer"
              onClick={() => { setDescDraft(prize.description); setEditingDesc(true) }}
            >
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{prize.description}</p>
              <button className="opacity-0 group-hover/desc:opacity-100 transition-opacity p-0.5 rounded hover:bg-bg-elevated text-slate-600 hover:text-slate-400 flex-shrink-0 mt-0.5">
                <Pencil size={10} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Image preview modal
// ─────────────────────────────────────────────

function PrizePreviewModal({ prize, onClose }: { prize: Prize | null; onClose: () => void }) {
  if (!prize?.image) return null

  return (
    <Dialog open={!!prize} onOpenChange={(o) => !o && onClose()}>
      <DialogPanel
        className="w-[680px] max-w-[90vw]"
        onClose={onClose}
        footer={
          <div className="px-5 py-3 flex items-start gap-3">
            <Trophy size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white">{prize.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{prize.description}</p>
            </div>
          </div>
        }
      >
        <div className="relative">
          <img
            src={prize.image}
            alt={prize.title}
            className="w-full h-auto rounded-t-2xl object-contain max-h-[65vh]"
          />
          {/* Gradient overlay for seamless transition to footer */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-card/90 to-transparent pointer-events-none" />
        </div>
      </DialogPanel>
    </Dialog>
  )
}
