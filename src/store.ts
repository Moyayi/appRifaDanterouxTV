import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RaffleNumber, RaffleConfig, RaffleResult, Prize, NumberStatus } from './types'

const buildInitialNumbers = (): RaffleNumber[] =>
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    status: 'available' as NumberStatus,
  }))

const defaultConfig: RaffleConfig = {
  title: 'Gran Rifa DanterouxTV',
  logoImage: '/logo.png',
}

const defaultPrizes: Prize[] = [
  {
    id: 'prize-1',
    title: '1er Premio',
    description: 'Descripción del primer premio. Haz clic para editar.',
  },
  {
    id: 'prize-2',
    title: '2do Premio',
    description: 'Descripción del segundo premio. Haz clic para editar.',
  },
  {
    id: 'prize-3',
    title: '3er Premio',
    description: 'Descripción del tercer premio. Haz clic para editar.',
  },
  {
    id: 'prize-4',
    title: '4to Premio',
    description: 'Descripción del cuarto premio. Haz clic para editar.',
  },
]

interface RaffleStore {
  numbers: RaffleNumber[]
  config: RaffleConfig
  prizes: Prize[]
  history: RaffleResult[]
  updateNumber: (id: number, update: Partial<RaffleNumber>) => void
  updateConfig: (update: Partial<RaffleConfig>) => void
  updateNumbers: (ids: number[], update: Partial<RaffleNumber>) => void
  addPrize: () => void
  removePrize: (id: string) => void
  updatePrize: (id: string, update: Partial<Prize>) => void
  addHistory: (result: RaffleResult) => void
  importData: (data: { numbers: RaffleNumber[]; config: RaffleConfig; prizes: Prize[]; history: RaffleResult[] }) => void
  resetNumbers: () => void
}

export const useRaffleStore = create<RaffleStore>()(
  persist(
    (set) => ({
      numbers: buildInitialNumbers(),
      config: defaultConfig,
      prizes: defaultPrizes,
      history: [],

      updateNumber: (id, update) =>
        set((state) => ({
          numbers: state.numbers.map((n) => (n.id === id ? { ...n, ...update } : n)),
        })),

      updateConfig: (update) =>
        set((state) => ({ config: { ...state.config, ...update } })),

      addPrize: () =>
        set((state) => {
          if (state.prizes.length >= 4) return state
          const newId = `prize-${Date.now()}`
          return {
            prizes: [
              ...state.prizes,
              {
                id: newId,
                title: `${state.prizes.length + 1}° Premio`,
                description: 'Descripción del premio. Haz clic para editar.',
              },
            ],
          }
        }),

      removePrize: (id) =>
        set((state) => ({
          prizes: state.prizes.filter((p) => p.id !== id),
        })),

      updatePrize: (id, update) =>
        set((state) => ({
          prizes: state.prizes.map((p) => (p.id === id ? { ...p, ...update } : p)),
        })),

      updateNumbers: (ids: number[], update: Partial<RaffleNumber>) =>
        set((state) => ({
          numbers: state.numbers.map((n) =>
            ids.includes(n.id) ? { ...n, ...update } : n
          ),
        })),

      addHistory: (result) =>
        set((state) => ({ history: [result, ...state.history] })),

      importData: (data) => set(data),

      resetNumbers: () => set({ numbers: buildInitialNumbers() }),
    }),
    { name: 'raffle-danterouxtv-v2' }
  )
)

export const useStats = () => {
  return useRaffleStore((state) => {
    const available = state.numbers.filter((n) => n.status === 'available').length
    const reserved = state.numbers.filter((n) => n.status === 'reserved').length
    const percent = Math.round((reserved / 100) * 100)
    return { available, reserved, total: 100, percent }
  })
}
