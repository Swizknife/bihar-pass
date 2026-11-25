import { destinations, getDestination } from '../data/destinations'
import type { Category, Destination, Itinerary, ItineraryDay, TripPrefs } from '../types'
import { roadHrs, roadKm } from './geo'
import { tx, txn } from '../i18n/tx'

type Stop = ItineraryDay['stops'][number]
type Pace = TripPrefs['pace']

// Pace changes how many sights fit in a day, when the day starts and ends, how long each sight takes and how long lunch is.
export const PACE: Record<Pace, { label: string; perDay: number; start: number; end: number; perSight: number; lunch: number; blurb: string; tip: string }> = {
  relaxed: { label: 'Relaxed', perDay: 2, start: 570, end: 1020, perSight: 120, lunch: 75, blurb: 'About 2 sights a day, a 09:30 start, a long lunch and back by 17:00.', tip: 'Leisurely day with time to rest between sights.' },
  moderate: { label: 'Moderate', perDay: 3, start: 510, end: 1080, perSight: 90, lunch: 60, blurb: 'About 3 sights a day, an 08:30 start and finishing around 18:00.', tip: 'Balanced day. Start early to avoid midday heat and traffic.' },
  packed: { label: 'Packed', perDay: 5, start: 450, end: 1170, perSight: 60, lunch: 45, blurb: 'Up to 5 sights a day, a 07:30 start, a short lunch and finishing around 19:30.', tip: 'Busy day. Start on time and keep breaks short.' },
}

const PATNA = { lat: 25.5941, lng: 85.1376 }
const MEALS = [
  'Try litti chokha for lunch at a local eatery.',
  'Pick up thekua or khaja as local sweets.',
  'Sattu paratha makes a good light breakfast.',
  'Dal pitha is a hearty winter dinner option.',
]

const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`

function pickByInterest(interests: Category[], limit: number): string[] {
  return destinations
    .map(d => ({ id: d.id, score: d.categories.filter(c => interests.includes(c)).length }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.id)
}

function orderByRoute(ids: string[]): string[] {
  const left = [...new Set(ids)].filter(id => getDestination(id))
  const out: string[] = []
  let cur: { lat: number; lng: number } = PATNA
  while (left.length) {
    let bi = 0, bd = Infinity
    left.forEach((id, i) => {
      const d = roadKm(cur, getDestination(id)!)
      if (d < bd) { bd = d; bi = i }
    })
    const [next] = left.splice(bi, 1)
    out.push(next)
    cur = getDestination(next)!
  }
  return out
}

interface Sight { d: Destination; name: string }

function planDays(order: string[], prefs: TripPrefs): ItineraryDay[] {
  const cfg = PACE[prefs.pace]
  const N = Math.max(1, prefs.days)
  const dests = order.map(getDestination).filter((d): d is Destination => !!d)
  const sights: Sight[] = dests.flatMap(d => (prefs.picks?.[d.id] ?? d.attractions).map(name => ({ d, name })))

  const group = (cap: number) => {
    const days: Sight[][] = []
    let cur: Sight[] = []
    let last: Destination | undefined
    for (const s of sights) {
      const far = !!last && last.id !== s.d.id && roadHrs(roadKm(last, s.d)) > 1.2
      if (cur.length && (cur.length >= cap || far)) { days.push(cur); cur = [] }
      cur.push(s)
      last = s.d
    }
    if (cur.length) days.push(cur)
    return days
  }
  let cap = cfg.perDay
  let groups = group(cap)
  while (groups.length > N && cap < 8) { cap++; groups = group(cap) }
  const even = Math.ceil(sights.length / Math.max(groups.length, 1))
  if (even < cap) { const balanced = group(even); if (balanced.length <= groups.length) groups = balanced }

  const result: ItineraryDay[] = []
  const dateFor = (n: number) => {
    if (!prefs.startDate) return undefined
    const d = new Date(prefs.startDate)
    d.setDate(d.getDate() + n - 1)
    return d.toDateString()
  }
  const addDay = (): ItineraryDay => {
    const n = result.length + 1
    const day: ItineraryDay = { day: n, date: dateFor(n), stops: [], meal: MEALS[(n - 1) % MEALS.length], tip: cfg.tip }
    result.push(day)
    return day
  }

  let prevDest: Destination | undefined
  groups.forEach(g => {
    const day = addDay()
    const raw: { d: Destination; names: string[] }[] = []
    for (const s of g) {
      const last = raw[raw.length - 1]
      if (last && last.d.id === s.d.id) last.names.push(s.name)
      else raw.push({ d: s.d, names: [s.name] })
    }
    let p = prevDest
    const legs = raw.map(r => {
      const km = p && p.id !== r.d.id ? roadKm(p, r.d) : 0
      p = r.d
      return { km, hrs: km ? roadHrs(km) : 0 }
    })
    const travelMin = legs.reduce((s, l) => s + l.hrs * 60, 0)
    const avail = (cfg.end - cfg.start - cfg.lunch - travelMin) / g.length
    const dur = Math.max(30, Math.min(cfg.perSight, avail))
    let clock = cfg.start
    let lunched = false
    raw.forEach((r, ri) => {
      clock += legs[ri].hrs * 60
      const items = r.names.map(name => {
        if (!lunched && clock >= 750) { clock += cfg.lunch; lunched = true }
        const s = clock
        clock = Math.min(s + dur, 1439)
        return { name, start: fmt(s), end: fmt(clock) }
      })
      const stop: Stop = { id: r.d.id, hours: Math.round((r.names.length * dur) / 6) / 10, legKm: legs[ri].km, legHrs: legs[ri].hrs, start: items[0].start, end: items[items.length - 1].end, items }
      day.stops.push(stop)
      if (legs[ri].hrs > 5) { day.tip = 'Long drive (about {{h}} h): start early or break the journey with an overnight stop. On-site time may be short.'; day.tipVars = { h: legs[ri].hrs } }
      prevDest = r.d
    })
  })

  const seen: Record<string, Stop[]> = {}
  result.forEach(d => d.stops.forEach(s => { (seen[s.id] ??= []).push(s) }))
  Object.values(seen).forEach(list => { if (list.length > 1) list.forEach((s, i) => { s.part = { i: i + 1, n: list.length } }) })

  while (result.length < N) addDay()
  return result
}

const sumKm = (days: ItineraryDay[]) => days.reduce((s, d) => s + d.stops.reduce((a, st) => a + st.legKm, 0), 0)

export function itineraryNotes(prefs: TripPrefs, days: ItineraryDay[]): string[] {
  const cfg = PACE[prefs.pace]
  const used = days.filter(d => d.stops.length > 0).length
  const free = days.length - used
  const notes: string[] = [tx('{{pace}} pace: {{blurb}}', { pace: tx(cfg.label), blurb: tx(cfg.blurb) })]
  if (days.length > prefs.days) notes.push(tx('Your places need about {{need}} days even at this pace; you asked for {{asked}}. Remove some sights or places, add days, or choose a faster pace.', { need: days.length, asked: prefs.days }))
  else if (free > 0) notes.push(txn(free,
    'At a {{pace}} pace your chosen sights fit in {{used}} of {{total}} days, so {{n}} day is free. Add nearby places, choose more sights, or pick a slower pace to spread things out.',
    'At a {{pace}} pace your chosen sights fit in {{used}} of {{total}} days, so {{n}} days are free. Add nearby places, choose more sights, or pick a slower pace to spread things out.',
    { pace: tx(cfg.label).toLowerCase(), used, total: prefs.days }))
  notes.push(tx('Distances and times are rough estimates (straight-line x 1.3 at ~40 km/h). Check live routes before travelling.'))
  notes.push(tx('Time slots are suggestions. Opening hours are shown where a source was found; confirm them locally.'))
  return notes
}

export function generateItinerary(prefs: TripPrefs): Itinerary {
  const cfg = PACE[prefs.pace]
  let ids: string[]
  if (prefs.destinationIds.length) ids = [...prefs.destinationIds]
  else {
    const ranked = pickByInterest(prefs.interests, prefs.days * cfg.perDay)
    ids = ranked.length ? ranked : ['bodh-gaya', 'rajgir', 'nalanda']
    while (ids.length > 1 && planDays(orderByRoute(ids), prefs).filter(d => d.stops.length > 0).length > prefs.days) ids = ids.slice(0, -1)
  }
  const days = planDays(orderByRoute(ids), prefs)
  return { prefs, days, totalKm: sumKm(days), notes: [] }
}

export function rebuildFromOrder(it: Itinerary, order: string[]): Itinerary {
  const days = planDays([...new Set(order)], it.prefs)
  return { ...it, days, totalKm: sumKm(days), notes: [] }
}

export const flattenOrder = (it: Itinerary) => [...new Set(it.days.flatMap(d => d.stops.map(s => s.id)))]
