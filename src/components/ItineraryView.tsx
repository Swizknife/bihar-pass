import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, Camera, Clock, Download, MapPin, Plus, Printer, RefreshCw, Route, Save, Sparkles, Trash2, Utensils } from 'lucide-react'
import { destinations, getDestination } from '../data/destinations'
import { attractionNote } from '../data/attractionNotes'
import { experienceFor } from '../data/experiences'
import { hours, WEEKDAYS, weekdayIndex } from '../data/hours'
import type { Destination, Itinerary } from '../types'
import { flattenOrder, rebuildFromOrder } from '../lib/itinerary'
import { roadKm } from '../lib/geo'
import { itineraryNotes, PACE } from '../lib/itinerary'
import { PASS_RATES, passAmount } from '../lib/pass'
import { useTripDetails } from '../lib/tripDetails'
import { Counter } from './TripDetailsForm'
import { usePhotos } from '../lib/photos'
import { Lightbox } from './Gallery'
import { Visual } from './ui'
import { DAY_COLORS, RouteSketch } from '../pages/BookingStudio'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'
import { AddToCart } from './AddToCart'

interface MapSel { q: string; label: string; id: string }
const short = (d: Destination) => d.name.split(' (')[0]

function ItemCard({ d, item, selected, onMap }: { d: Destination; item: { name: string; start: string; end: string }; selected: boolean; onMap: () => void }) {
  const photos = usePhotos(`${item.name.split(' (')[0]} ${short(d)}`)
  const [i, setI] = useState<number | null>(null)
  return (
    <article className={`overflow-hidden rounded-xl border bg-white transition ${selected ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-cream hover:shadow-md'}`}>
      <button onClick={() => photos.length && setI(0)} disabled={!photos.length} aria-label={`View photos of ${item.name}`} className="group relative block h-36 w-full overflow-hidden enabled:cursor-zoom-in">
        {photos[0]
          ? <img src={photos[0].url} alt={`${item.name}: ${photos[0].title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          : <Visual id={`${d.id}-it`} hue={d.hue} label={item.name} className="h-full w-full" />}
        {photos.length > 1 && <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"><Camera size={12} />{photos.length}</span>}
      </button>
      <div className="p-3">
        <h5 className="font-bold">{tx(item.name)}</h5>
        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-0.5 text-xs font-semibold text-white"><Clock size={11} />{item.start} – {item.end}</p>
        <p className="mt-2 text-xs text-stone">{attractionNote(d.id, item.name, d.tagline)}</p>
        <button onClick={onMap} className="btn btn-outline mt-2 !px-3 !py-1 text-xs"><MapPin size={12} />{tx("Show on map")}</button>
      </div>
      {i !== null && <Lightbox photos={photos} index={i} setIndex={setI} onClose={() => setI(null)} />}
    </article>
  )
}

export function ItineraryView({ it, onChange, onRegenerate }: { it: Itinerary; onChange: (i: Itinerary) => void; onRegenerate: () => void }) {
  const [saved, setSaved] = useState(false)
  const { d: td, set: setTd } = useTripDetails()
  const order = flattenOrder(it)
  const firstStop = it.days.flatMap(d => d.stops)[0]
  const firstDest = firstStop && getDestination(firstStop.id)
  const [sel, setSel] = useState<MapSel | null>(null)
  const active = sel ?? (firstDest && firstStop ? { q: `${firstStop.items[0]?.name ?? ''} ${short(firstDest)} Bihar`, label: firstStop.items[0]?.name ?? short(firstDest), id: firstDest.id } : null)

  const setOrder = (o: string[]) => onChange(rebuildFromOrder(it, o))
  const move = (id: string, dir: -1 | 1) => {
    const i = order.indexOf(id), j = i + dir
    if (j < 0 || j >= order.length) return
    const o = [...order]
    ;[o[i], o[j]] = [o[j], o[i]]
    setOrder(o)
  }
  const mapsUrl = () => {
    const pts = order.map(getDestination).filter((d): d is Destination => !!d).map(d => `${d.lat},${d.lng}`)
    if (pts.length < 2) return pts[0] ? `https://www.google.com/maps/search/?api=1&query=${pts[0]}` : '#'
    const mid = pts.slice(1, -1).join('|')
    return `https://www.google.com/maps/dir/?api=1&origin=${pts[0]}&destination=${pts[pts.length - 1]}${mid ? `&waypoints=${encodeURIComponent(mid)}` : ''}`
  }
  const save = () => { try { localStorage.setItem('savedTrip', JSON.stringify(it)); setSaved(true); setTimeout(() => setSaved(false), 2000) } catch { /* ignore */ } }
  const download = () => {
    const lines = [tx('Bihar trip - {{d}} days, {{p}} pace', { d: it.prefs.days, p: tx(PACE[it.prefs.pace].label) }), '']
    it.days.forEach(d => {
      lines.push(`Day ${d.day}${d.date ? ` (${d.date})` : ''}`)
      d.stops.forEach(s => {
        lines.push(`  ${getDestination(s.id)?.name}${s.part ? ` (part ${s.part.i} of ${s.part.n})` : ''}${s.legKm ? ` - ${s.legKm} km, ~${s.legHrs} h from previous` : ''}`)
        s.items.forEach(i => lines.push(`    ${i.start}-${i.end}  ${i.name}`))
      })
      lines.push(`  Meal: ${d.meal}`, '')
    })
    lines.push(...itineraryNotes(it.prefs, it.days))
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }))
    a.download = 'bihar-itinerary.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const addable = destinations.filter(d => !order.includes(d.id))
  const sketchDays = it.days.map(day => ({ stops: day.stops.map(s => getDestination(s.id)).filter((x): x is Destination => !!x) }))
  const lastDest = order.length ? getDestination(order[order.length - 1]) : undefined
  const suggestions = lastDest ? addable.map(x => ({ x, km: roadKm(lastDest, x) })).sort((a, b) => a.km - b.km).slice(0, 3) : []

  return (
    <div className="mt-8">
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <button className="btn btn-outline" onClick={onRegenerate}><RefreshCw size={14} />{tx("Regenerate")}</button>
        <button className="btn btn-outline" onClick={save}><Save size={14} />{saved ? tx('Saved') : tx('Save trip')}</button>
        <button className="btn btn-outline" onClick={() => window.print()}><Printer size={14} />{tx("Print")}</button>
        <button className="btn btn-outline" onClick={download}><Download size={14} />{tx("Download")}</button>
        <a className="btn btn-outline" href={mapsUrl()} target="_blank" rel="noopener noreferrer"><Route size={14} />{tx("Open route in Google Maps")}</a>
      </div>
      <div className="no-print mb-5 grid gap-4 rounded-2xl border border-gold/50 bg-white p-4 md:grid-cols-2">
        <div>
          <h3 className="font-bold">{tx('{{pace}} pace', { pace: tx(PACE[it.prefs.pace].label) })}</h3>
          <p className="text-sm text-stone">{tx(PACE[it.prefs.pace].blurb)}</p>
        </div>
        <div>
          <h3 className="font-bold">{tx("Estimated Bihar Pass")}</h3>
          <div className="mt-1 flex flex-wrap items-end gap-4">
            <Counter label={tx("Adults")} value={td.adults} min={1} max={20} onChange={n => setTd({ adults: n })} />
            <Counter label={tx("Children")} value={td.children} min={0} max={20} onChange={n => setTd({ children: n })} />
            <p className="text-2xl font-bold text-terracotta">Rs {passAmount(order.length, td.adults, td.children)}</p>
          </div>
          <p className="mt-1 text-xs text-stone">{tx('{{s}} sites x ({{who}}). Demo rates, not official pricing.', { s: order.length, who: `${txn(td.adults, '{{n}} adult', '{{n}} adults')} x Rs ${PASS_RATES.adult}${td.children > 0 ? ` + ${txn(td.children, '{{n}} child', '{{n}} children')} x Rs ${PASS_RATES.child}` : ''}` })}</p>
        </div>
      </div>
      <section className="no-print mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-forest p-5 text-white" aria-label={tx('Book this trip with Bihar-Pass')}>
        <div className="me-auto">
          <h3 className="text-lg font-bold">{tx('Book this trip with Bihar-Pass')}</h3>
          <p className="text-sm text-white/80">{tx('{{s}} sites over {{d}} days. One QR code covers every site.', { s: order.length, d: it.days.length })}</p>
        </div>
        <p className="text-2xl font-bold">₹{passAmount(order.length, td.adults, td.children)}</p>
        <AddToCart title="Your planned trip" sites={order} days={it.days.length} startDate={it.prefs.startDate} className="btn btn-light" />
        <AddToCart title="Your planned trip" sites={order} days={it.days.length} startDate={it.prefs.startDate} className="btn !bg-gold !text-charcoal hover:!bg-white" buyNow />
      </section>
      <p className="mb-4 text-sm text-stone">{it.totalKm > 0 ? tx('About {{km}} km of road travel between places (estimate).', { km: it.totalKm }) : tx('Everything is in one area, so there is little travel between places.')}</p>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          {it.days.map((day, di) => (
            <section key={day.day} className="rounded-2xl border border-cream bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold" style={{ color: DAY_COLORS[di % 7] }}>{tx('Day {{n}}', { n: day.day })}{day.date && <span className="ms-2 text-sm font-normal text-stone">{fmtDate(new Date(day.date))}</span>}</h3>
              {day.stops.length === 0 && (
                <div className="mt-3 rounded-xl bg-cream/60 p-4 text-sm text-stone">
                  <p>{tx("Free day. You have seen everything listed for the places you chose.")}</p>
                  {suggestions.length > 0 && (
                    <div className="no-print mt-3">
                      <p className="font-semibold text-charcoal"><Sparkles size={14} className="me-1 inline" />{tx("Nearby places to add")}</p>
                      <div className="mt-2 flex flex-wrap gap-2">{suggestions.map(({ x, km }) => <button key={x.id} onClick={() => setOrder([...order, x.id])} className="chip bg-white hover:bg-cream"><Plus size={12} className="me-1 inline" />{tx(short(x))} (~{km} km)</button>)}</div>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 space-y-6">
                {day.stops.map((s, si) => {
                  const d = getDestination(s.id)!
                  const ex = experienceFor(d.id)
                  return (
                    <div key={`${s.id}-${si}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-lg font-bold"><Link to={`/explore/${d.id}`} className="hover:text-terracotta">{tx(d.name)}</Link>{s.part && <span className="ms-2 rounded-full bg-gold/30 px-2 py-0.5 align-middle text-xs font-semibold">{tx('Part {{i}} of {{n}}', { i: s.part.i, n: s.part.n })}</span>}</h4>
                          <p className="text-sm text-stone">{tx(d.tagline)}</p>
                          <p className="mt-1 text-xs text-forest">{s.start} – {s.end}{s.legKm > 0 && ` · ${tx('{{km}} km, ~{{h}} h from previous stop', { km: s.legKm, h: s.legHrs })}`}</p>
                        </div>
                        <div className="no-print flex gap-1">
                          <button aria-label={`Move ${d.name} earlier`} onClick={() => move(d.id, -1)} className="rounded p-1.5 hover:bg-cream"><ArrowUp size={16} /></button>
                          <button aria-label={`Move ${d.name} later`} onClick={() => move(d.id, 1)} className="rounded p-1.5 hover:bg-cream"><ArrowDown size={16} /></button>
                          <button aria-label={`Remove ${d.name}`} onClick={() => setOrder(order.filter(x => x !== d.id))} className="rounded p-1.5 text-terracotta hover:bg-cream"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {s.items.map(item => <ItemCard key={item.name} d={d} item={item} selected={active?.label === item.name} onMap={() => setSel({ q: `${item.name.split(' (')[0]} ${short(d)} Bihar`, label: item.name, id: d.id })} />)}
                      </div>
                      {(ex.activities.length > 0 || ex.mustTry.length > 0) && (
                        <div className="mt-3 grid gap-3 rounded-xl bg-ivory p-3 text-sm sm:grid-cols-2">
                          {ex.activities.length > 0 && <div><h5 className="font-bold">{tx("Things to do")}</h5><ul className="mt-1 list-disc space-y-0.5 ps-5 text-stone">{ex.activities.map(a => <li key={a}>{tx(a)}</li>)}</ul></div>}
                          {ex.mustTry.length > 0 && <div><h5 className="font-bold">{tx("Must try")}</h5><ul className="mt-1 flex flex-wrap gap-1">{ex.mustTry.map(a => <li key={a} className="rounded-full bg-gold/25 px-2.5 py-0.5 text-xs">{tx(a)}</li>)}</ul></div>}
                        </div>
                      )}
                      <StopHours id={d.id} dateStr={day.date} />
                    </div>
                  )
                })}
              </div>
              <p className="mt-4 flex items-start gap-2 text-sm text-stone"><Utensils size={14} className="mt-0.5 shrink-0" />{tx(day.meal)}</p>
              <p className="mt-1 text-sm text-stone">{tx(day.tip, day.tipVars)}</p>
            </section>
          ))}
          <div className="no-print flex items-center gap-2">
            <label className="text-sm" htmlFor="add">{tx("Add a destination:")}</label>
            <select id="add" className="rounded-full border border-gold/60 bg-white px-3 py-1.5 text-sm" value="" onChange={e => e.target.value && setOrder([...order, e.target.value])}>
              <option value="">{tx("Choose...")}</option>
              {addable.map(d => <option key={d.id} value={d.id}>{tx(d.name)}</option>)}
            </select>
          </div>
          <ul className="list-disc space-y-1 ps-5 text-sm text-stone">{itineraryNotes(it.prefs, it.days).map(n => <li key={n}>{n}</li>)}</ul>
        </div>

        <aside className="no-print space-y-3 lg:sticky lg:top-20 lg:col-span-2 lg:h-fit">
          <h3 className="text-xl font-bold">{tx("Map")}</h3>
          {sketchDays.flatMap(d => d.stops).length > 1 && (
            <>
              <RouteSketch days={sketchDays} selected={active?.id} activeDay={0} onSelect={(id) => { const d = getDestination(id)!; setSel({ q: `${d.lat},${d.lng}`, label: d.name, id }) }} />
              <p className="text-xs text-stone">{tx("Click a numbered stop to see it on the map. Numbers show the day.")}</p>
            </>
          )}
          {active && <iframe key={active.q} title={`Map: ${active.label}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(active.q)}&z=14&output=embed`} loading="lazy" className="h-80 w-full rounded-2xl border border-cream" referrerPolicy="no-referrer-when-downgrade" />}
          {active && <p className="text-sm"><strong>{tx(active.label)}</strong>{tx(". Use \"Show on map\" on any sight to move the map.")}</p>}
        </aside>
      </div>
    </div>
  )
}

function StopHours({ id, dateStr }: { id: string; dateStr?: string }) {
  const list = hours[id]
  const wd = weekdayIndex(dateStr)
  if (!list) return <p className="mt-2 text-xs text-stone">{tx("Opening hours: not verified, please confirm locally.")}</p>
  return (
    <div className="mt-2 space-y-0.5 text-xs">
      {list.map(h => {
        const t = wd === undefined ? undefined : h.days[wd]
        const closed = t === 'Closed'
        return (
          <p key={h.place} className={closed ? 'font-semibold text-terracotta' : 'text-stone'}>
            {closed && tx('Warning: ')}{tx(h.place)}: {t === undefined ? (h.days.every(x => x === h.days[0]) ? tx('{{t}} daily', { t: tx(h.days[0]) }) : tx('varies by weekday, see destination page')) : `${tx(WEEKDAYS[wd!])} ${tx(t)}`}
            {h.status === 'reported' && ' (reported, unconfirmed)'}
            {closed && ' - consider moving this to another day'}
          </p>
        )
      })}
    </div>
  )
}
