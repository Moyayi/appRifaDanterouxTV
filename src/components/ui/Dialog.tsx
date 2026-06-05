import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            {/* Overlay */}
            <RadixDialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </RadixDialog.Overlay>

            {/* Content — outer div handles centering, inner motion.div handles animation */}
            <RadixDialog.Content asChild>
              <div
                className="fixed z-50 outline-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxHeight: 'calc(100vh - 48px)',
                  display: 'flex',
                  alignItems: 'stretch',
                }}
              >
                <motion.div
                  style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', duration: 0.28, bounce: 0.18 }}
                >
                  {children}
                </motion.div>
              </div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  )
}

interface DialogPanelProps {
  className?: string
  children: React.ReactNode
  title?: string
  onClose?: () => void
  footer?: React.ReactNode
}

export function DialogPanel({ className, children, title, onClose, footer }: DialogPanelProps) {
  return (
    <div
      className={cn(
        'relative bg-bg-card border border-brand-green/30 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(34,255,68,0.06)]',
        'flex flex-col',
        className
      )}
      style={{ maxHeight: 'calc(100vh - 48px)' }}
    >
      {(title || onClose) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-green/15 flex-shrink-0">
          {title && (
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}
      <div className="overflow-y-auto flex-1 min-h-0">
        {children}
      </div>
      {footer && (
        <div className="flex-shrink-0 border-t border-brand-green/15">
          {footer}
        </div>
      )}
    </div>
  )
}
