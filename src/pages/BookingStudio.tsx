import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CalendarDays, Camera, CheckSquare, ExternalLink, MapPin, Route, Square, Users } from 'lucide-react'
import { customPackage, getPackage } from '../data/packages'
import { getDestination } from '../data/destinations'
import { Lightbox } from '../components/Gallery'
import { TripDetailsForm } from '../components/TripDetailsForm'
import { Visual } from '../components/ui'
import { photoQueryFor, usePhotos } from '../lib/photos'
import { roadHrs, roadKm } from '../lib/geo'
import { originPoint, useTripDetails } from '../lib/tripDetails'
import type { Destination } from '../types'
import NotFound from './NotFound'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'
import { AddToCart } from '../components/AddToCart'

export const DAY_COLORS = ['#B8532F', '#2B4A2F', '#C9A24A', '#3b6ea5', '#8a4f9e', '#2f8f83', '#a33b5c']

function dayDate(start: string, i: number) {
  if (!start) return ''
  const d = new Date(start + 'T00:00:00')
  d.setDate(d.getDate() + i)
  return d.toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short' })
}

export function RouteSketch({ days, selected, onSelect, activeDay }: { days: { stops: Destination[] }[]; selected?: string; onSelect: (id: string, day: number) => void; activeDay: number }) {
  const all = days.flatMap((d, di) => d.stops.map(s => ({ s, di })))
  if (!all.length) return null
  const W = 360, H = 240, pad = 34
  const lats = all.map(a => a.s.lat), lngs = all.map(a => a.s.lng)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
  const kx = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180)
  const spanX = Math.max((maxLng - minLng) * kx, 0.05), spanY = Math.max(maxLat - minLat, 0.05)
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY)
  const ox = (W - spanX * scale) / 2, oy = (H - spanY * scale) / 2
  const pt = (s: Destination) => ({ x: ox + (s.lng - minLng) * kx * scale, y: oy + (maxLat - s.lat) * scale })
  let n = 0
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={tx("Route sketch of the trip")} className="w-full rounded-2xl border border-cream bg-gradient-to-br from-cream/60 to-white">
      {days.map((d, di) => d.stops.length > 1 && (
        <polyline key={di} fill="none" stroke={DAY_COLORS[di % 7]} strokeWidth={di === activeDay ? 3.5 : 1.5} strokeDasharray={di === activeDay ? '' : '4 4'} opacity={di === activeDay ? 1 : 0.5}
          points={d.stops.map(s => { const p = pt(s); return `${p.x},${p.y}` }).join(' ')} />
      ))}
      {all.map(({ s, di }) => {
        n++
        const p = pt(s)
        const sel = s.id === selected
        return (
          <g key={`${s.id}-${n}`} tabIndex={0} role="button" aria-label={`${s.name}, day ${di + 1}`} onClick={() => onSelect(s.id, di)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(s.id, di)} className="cursor-pointer outline-none">
            {sel && <circle cx={p.x} cy={p.y} r={17} fill={DAY_COLORS[di % 7]} opacity={0.2} />}
            <circle cx={p.x} cy={p.y} r={sel ? 11 : 9} fill={DAY_COLORS[di % 7]} stroke="#fff" strokeWidth={2} />
            <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">{di + 1}</text>
            <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="10" fill="#2A2622" stroke="#fff" strokeWidth="3" paintOrder="stroke">{s.name.split(' (')[0]}</text>
          </g>
        )
      })}
    </svg>
  )
}

function StopCard({ d, selected, onSelect, legKm, picked, toggle }: { d: Destination; selected: boolean; onSelect: () => void; legKm: number; picked: string[]; toggle: (key: string) => void }) {
  const photos = usePhotos(photoQueryFor(d.id))
  const [view, setView] = useState<number | null>(null)
  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${selected ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-cream'}`}>
      <div className="grid sm:grid-cols-5">
        <button onClick={() => photos.length && setView(0)} aria-label={`View photos of ${d.name}`} className="group relative h-48 overflow-hidden text-start sm:col-span-2 sm:h-full sm:min-h-52">
          {photos[0]
            ? <img src={photos[0].url} alt={`${d.name}: ${photos[0].title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            : <Visual id={d.id} hue={d.hue} label={d.name} className="h-full w-full" />}
          {photos.length > 0 && <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white"><Camera size={12} />{txn(photos.length, '{{n}} photo', '{{n}} photos')}</span>}
        </button>
        <div className="p-4 sm:col-span-3">
          <h3 className="text-xl font-bold">{tx(d.name)}</h3>
          <p className="text-sm text-terracotta">{tx(d.tagline)}</p>
          <p className="mt-1 text-xs text-stone">{tx(d.district)} · {d.hours >= 24 ? tx('about 1-2 days on site') : tx('about {{h}} h on site', { h: d.hours })}{legKm > 0 && ` · ${tx('{{km}} km, ~{{h}} h from previous stop', { km: legKm, h: roadHrs(legKm) })}`}</p>
          <fieldset className="mt-3">
            <legend className="text-sm font-semibold">{tx("Choose your activities")}</legend>
            <ul className="mt-1 space-y-1">
              {d.attractions.map(a => {
                const key = `${d.id}:${a}`
                const on = picked.includes(key)
                return (
                  <li key={a}>
                    <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(key)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-start text-sm transition ${on ? 'bg-forest/10 font-medium text-forest' : 'hover:bg-cream'}`}>
                      {on ? <CheckSquare size={16} /> : <Square size={16} />}{tx(a)}
                    </button>
                  </li>
                )
              })}
            </ul>
          </fieldset>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={onSelect} className="btn btn-outline !px-3 !py-1.5 text-xs"><MapPin size={12} />{tx("Show on map")}</button>
            <Link to={`/explore/${d.id}`} className="btn btn-outline !px-3 !py-1.5 text-xs">{tx("Full guide and timings")}</Link>
          </div>
        </div>
      </div>
      {view !== null && <Lightbox photos={photos} index={view} setIndex={setView} onClose={() => setView(null)} />}
    </article>
  )
}

export default function BookingStudio() {
  const { id } = useParams()
  const [q] = useSearchParams()
  const isCustom = id === 'custom'
  const sites = (q.get('sites') ?? '').split(',').filter(Boolean)
  const pkg = isCustom ? (sites.length ? customPackage(sites, Math.max(1, +(q.get('days') ?? 1) || 1), (['relaxed', 'packed'].includes(q.get('pace') ?? '') ? q.get('pace') : 'moderate') as 'relaxed' | 'moderate' | 'packed') : undefined) : id ? getPackage(id) : undefined
  const pkgHref = isCustom ? '/packages' : `/packages/${id}`
  const { d, set } = useTripDetails()
  const [dayIdx, setDayIdx] = useState(0)
  const [sel, setSel] = useState<string | undefined>()
  const [mode, setMode] = useState<'place' | 'route'>('place')

  const N = isCustom ? (pkg?.days ?? 1) : (d.days ?? pkg?.days ?? 1)
  const days = useMemo(() => !pkg ? [] : Array.from({ length: N }, (_, i) => {
    const src = pkg.itinerary[i]
    return src
      ? { title: src.title, note: src.note, stops: src.stops.map(getDestination).filter((x): x is Destination => !!x) }
      : { title: 'Free day', note: 'Rest, shop for local crafts, or revisit a favourite place.', stops: [] as Destination[] }
  }), [pkg, N])
  if (!pkg) return <NotFound />

  const day = days[Math.min(dayIdx, days.length - 1)]
  const current = (sel && getDestination(sel)) || day.stops[0]
  const orig = originPoint(d.origin)
  const firstStop = days.flatMap(x => x.stops)[0]
  const inbound = orig && firstStop ? roadKm(orig, firstStop) : null
  const toggle = (key: string) => set({ activities: d.activities.includes(key) ? d.activities.filter(k => k !== key) : [...d.activities, key] })

  let prev: Destination | undefined = days.slice(0, dayIdx).flatMap(x => x.stops).pop()
  const legs = day.stops.map(s => { const km = prev && prev.id !== s.id ? roadKm(prev, s) : 0; prev = s; return km })

  const stopsToday = day.stops
  const embedSrc = mode === 'route' && stopsToday.length > 1
    ? `https://maps.google.com/maps?saddr=${stopsToday[0].lat},${stopsToday[0].lng}&daddr=${stopsToday.slice(1).map(s => `${s.lat},${s.lng}`).join('+to:')}&output=embed`
    : current ? `https://maps.google.com/maps?q=${current.lat},${current.lng}&z=12&output=embed` : ''
  const openMaps = current ? `https://www.google.com/maps/search/?api=1&query=${current.lat},${current.lng}` : '#'
  const picked = d.activities.filter(k => pkg.destinations.includes(k.split(':')[0]))

  return (
    <div className="section">
      <nav className="mb-2 text-sm text-stone"><Link to="/packages" className="hover:underline">{tx("Tour Packages")}</Link> / <Link to={pkgHref} className="hover:underline">{tx(pkg.title)}</Link> {tx("/ Customise and book")}</nav>
      <h1 className="text-3xl font-bold sm:text-4xl">{tx(pkg.title)}</h1>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <span className="chip bg-white"><CalendarDays size={12} className="me-1 inline" />{txn(N, '{{n}} day', '{{n}} days')}{d.startDate && ` · ${tx('from {{date}}', { date: dayDate(d.startDate, 0) })}`}</span>
        <span className="chip bg-white"><Users size={12} className="me-1 inline" />{txn(d.adults, '{{n}} adult', '{{n}} adults')}{d.children > 0 && `, ${txn(d.children, '{{n}} child', '{{n}} children')}`}</span>
        {d.origin && <span className="chip bg-white"><Route size={12} className="me-1 inline" />{tx('From {{place}}', { place: d.origin })}</span>}
      </div>
      {N !== pkg.days && <p className="mt-2 rounded-lg bg-gold/15 p-3 text-sm">{tx('This package is designed for {{a}} days; your plan uses {{b}}.', { a: pkg.days, b: N })} {N < pkg.days ? tx('The last days of the package are left out.') : tx('Extra days are shown as free days.')}</p>}
      {inbound !== null && <p className="mt-2 text-sm text-stone">{tx('Getting to {{place}} from {{from}}: roughly {{km}} km by road (estimate).', { place: tx(firstStop.name), from: d.origin, km: inbound })}</p>}
      {d.origin && !orig && <p className="mt-2 text-sm text-stone">{tx('For the journey from {{place}} into Bihar, see', { place: d.origin })} <Link to="/how-to-reach" className="underline">{tx("How to Reach")}</Link>.</p>}

      <details className="my-6 rounded-xl border border-cream bg-white p-3"><summary className="cursor-pointer font-semibold">{tx("Edit trip details")}</summary><div className="mt-3"><TripDetailsForm title={tx("Your trip")} /></div></details>

      <div role="tablist" aria-label={tx("Trip days")} className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {days.map((x, i) => (
          <button key={i} role="tab" aria-selected={i === dayIdx} onClick={() => { setDayIdx(i); setSel(x.stops[0]?.id) }}
            className={`shrink-0 rounded-xl px-4 py-2 text-start text-sm transition ${i === dayIdx ? 'text-white' : 'bg-cream hover:bg-cream/70'}`} style={i === dayIdx ? { background: DAY_COLORS[i % 7] } : undefined}>
            <strong>{tx('Day {{n}}', { n: i + 1 })}</strong>{dayDate(d.startDate, i) && <span className="block text-xs opacity-80">{dayDate(d.startDate, i)}</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <div><h2 className="text-2xl font-bold" style={{ color: DAY_COLORS[dayIdx % 7] }}>{tx('Day {{n}}', { n: dayIdx + 1 })}: {tx(day.title)}</h2><p className="text-sm text-stone">{tx(day.note)}</p></div>
          {day.stops.length === 0 && <div className="rounded-2xl bg-cream/60 p-8 text-center text-stone">{tx("A free day. Explore at your own pace.")}</div>}
          {day.stops.map((s, i) => <StopCard key={`${s.id}-${i}`} d={s} selected={current?.id === s.id} onSelect={() => { setSel(s.id); setMode('place') }} legKm={legs[i]} picked={d.activities} toggle={toggle} />)}
        </div>
        <aside className="space-y-3 lg:sticky lg:top-20 lg:col-span-2 lg:h-fit">
          <RouteSketch days={days} selected={current?.id} activeDay={dayIdx} onSelect={(sid, di) => { setDayIdx(di); setSel(sid); setMode('place') }} />
          <p className="text-xs text-stone">{tx("Click a numbered stop to jump to it. The solid line is today's route; numbers show the day. Sketch is schematic, not to scale for roads.")}</p>
          <div className="flex gap-2">
            <button onClick={() => setMode('place')} aria-pressed={mode === 'place'} className={`chip ${mode === 'place' ? 'chip-on' : 'bg-white'}`}>{tx("Place")}</button>
            <button onClick={() => setMode('route')} disabled={stopsToday.length < 2} aria-pressed={mode === 'route'} className={`chip disabled:opacity-40 ${mode === 'route' ? 'chip-on' : 'bg-white'}`}>{tx('Day {{n}} route', { n: dayIdx + 1 })}</button>
          </div>
          {embedSrc && <iframe key={embedSrc} title={tx("Map")} src={embedSrc} loading="lazy" className="h-72 w-full rounded-2xl border border-cream" referrerPolicy="no-referrer-when-downgrade" />}
          {current && <a href={openMaps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm underline">{tx('Open {{place}} in Google Maps', { place: tx(current.name) })} <ExternalLink size={12} /></a>}
        </aside>
      </div>

      <section className="mt-10 rounded-2xl bg-cream/70 p-6">
        <h2 className="text-2xl font-bold">{tx("Ready to continue?")}</h2>
        <p className="mt-1 text-sm text-stone">{tx('{{a}} selected for {{t}}. The next step is a demonstration pass; no payment is taken and it is not accepted at any site.', { a: txn(picked.length, '{{n}} activity', '{{n}} activities'), t: txn(d.adults + d.children, '{{n}} traveller', '{{n}} travellers') })}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={isCustom ? `/pass/checkout?sites=${pkg.destinations.join(',')}&days=${N}&start=${d.startDate}` : `/pass/checkout?package=${pkg.id}`} className={`btn btn-primary ${d.startDate ? '' : 'pointer-events-none opacity-50'}`} aria-disabled={!d.startDate}>{tx("Continue to Bihar Pass checkout (demo)")}</Link>
          <AddToCart title={pkg.title} sites={pkg.destinations} days={N} startDate={d.startDate} />
          {!d.startDate && <span className="self-center text-sm text-terracotta">{tx("Pick a start date in \"Edit trip details\" first.")}</span>}
          <Link to={pkgHref} className="btn btn-outline">{tx("Back to package")}</Link>
        </div>
      </section>
    </div>
  )
}
