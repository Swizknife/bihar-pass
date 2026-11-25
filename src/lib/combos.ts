import { destinations } from '../data/destinations'
import { customPackage } from '../data/packages'
import type { TourPackage, TripPrefs } from '../types'
import { roadKm } from './geo'
import { generateItinerary } from './itinerary'

type Pace = TripPrefs['pace']
export interface Combo { key: string; kind: 'pace' | 'plus'; pace: Pace; extra?: string; ids: string[]; days: number; pkg: TourPackage }

const daysNeeded = (ids: string[], pace: Pace) =>
  Math.max(1, generateItinerary({ startDate: '', days: 14, destinationIds: ids, interests: [], pace }).days.filter(d => d.stops.length > 0).length)

// Alternative packages built from the places a visitor picked: the same places at each pace,
// and the same places plus one of the nearest other destinations.
export function buildCombos(picked: string[]): Combo[] {
  if (!picked.length) return []
  const out: Combo[] = []
  const seen = new Set<string>()
  const add = (kind: Combo['kind'], pace: Pace, ids: string[], extra?: string) => {
    const days = daysNeeded(ids, pace)
    const key = `${[...ids].sort().join(',')}|${days}|${pace}`
    if (seen.has(key)) return
    seen.add(key)
    out.push({ key, kind, pace, extra, ids, days, pkg: customPackage(ids, days, pace) })
  }
  ;(['relaxed', 'moderate', 'packed'] as const).forEach(p => add('pace', p, picked))

  const chosen = picked.map(id => destinations.find(d => d.id === id)!).filter(Boolean)
  destinations
    .filter(d => !picked.includes(d.id))
    .map(d => ({ d, km: Math.min(...chosen.map(c => roadKm(c, d))) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 3)
    .forEach(({ d }) => add('plus', 'moderate', [...picked, d.id], d.id))
  return out
}
