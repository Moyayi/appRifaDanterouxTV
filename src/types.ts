export type NumberStatus = 'available' | 'reserved'

export interface RaffleNumber {
  id: number
  status: NumberStatus
  participant?: string
  reservedAt?: string
}

export interface Prize {
  id: string
  title: string
  description: string
  image?: string
}

export interface RaffleConfig {
  title: string
  logoImage?: string
}

export interface RaffleResult {
  id: string
  winnerNumber: number
  participant: string
  date: string
}
