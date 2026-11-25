import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { airports, stations } from '../data/misc'

export interface TripDetails {
  origin: string
  adults: number
  children: number
  startDate: string
  days: number | null
  activities: string[]
}
const DEFAULT: TripDetails = { origin: '', adults: 2, children: 0, startDate: '', days: null, activities: [] }
const KEY = 'tripDetails'

export const ORIGINS = [
  ...stations.map(s => s.name),
  ...airports.map(a => a.name),
  'Delhi', 'Kolkata', 'Varanasi', 'Ranchi', 'Lucknow', 'Mumbai', 'Kathmandu (Nepal)', 'Colombo (Sri Lanka)', 'Bangkok (Thailand)', 'Other',
]
export const originPoint = (name: string) => [...stations, ...airports].find(x => x.name.toLowerCase() === name.trim().toLowerCase())

interface Ctx { d: TripDetails; set: (p: Partial<TripDetails>) => void }
const C = createContext<Ctx>({ d: DEFAULT, set: () => {} })
export const useTripDetails = () => useContext(C)

export function TripDetailsProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<TripDetails>(() => {
    try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return DEFAULT }
  })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch { /* ignore */ } }, [d])
  return <C.Provider value={{ d, set: p => setD(prev => ({ ...prev, ...p })) }}>{children}</C.Provider>
}
