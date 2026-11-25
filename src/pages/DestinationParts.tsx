import { useState } from 'react'
import { Bus, Clock, MapPin, Ticket } from 'lucide-react'
import { localAccess } from '../data/access'
import type { Destination } from '../types'
import { feeSummary, timingSummary } from '../lib/timings'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

const short = (d: Destination) => d.name.split(' (')[0]

export function QuickFacts({ d }: { d: Destination }) {
  const cards = [
    { icon: <Bus size={20} />, title: 'How to reach', text: localAccess[d.id] ?? `Nearest rail: ${d.nearestRail}. Nearest airport: ${d.nearestAirport}.` },
    { icon: <Clock size={20} />, title: 'Timings', text: timingSummary(d.id) },
    { icon: <Ticket size={20} />, title: 'Entry fee', text: feeSummary(d.id) },
  ]
  return (
    <section id="facts" className="scroll-mt-28">
      <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">02</span>{tx("Visitor information")}</h2>
      <div className="mb-5 mt-2 h-1 w-14 rounded bg-gold" />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(c => (
          <div key={c.title} className="rounded-2xl border border-cream bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">{c.icon}</div>
            <h3 className="mt-3 text-lg font-bold">{tx(c.title)}</h3>
            <p className="mt-1 text-sm text-stone">{tx(c.text)}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-stone">{tx("Weekday timings and the source for each figure are in the Timings tab below.")}</p>
    </section>
  )
}

export function AttractionMap({ d }: { d: Destination }) {
  const base = `${d.lat},${d.lng}`
  const [q, setQ] = useState(base)
  const [label, setLabel] = useState('')
  const z = q === base ? 12 : 15
  return (
    <section id="map" className="scroll-mt-28">
      <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">05</span>{tx("Map")}</h2>
      <div className="mb-5 mt-2 h-1 w-14 rounded bg-gold" />
      <div className="grid gap-5 lg:grid-cols-3">
        <div>
          <p className="text-sm text-stone">{tx("Pick a sight to move the map to it.")}</p>
          <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col">
            <li><button onClick={() => { setQ(base); setLabel('') }} aria-pressed={q === base} className={`chip ${q === base ? 'chip-on' : 'bg-white hover:bg-cream'}`}><MapPin size={12} className="me-1 inline" />{tx("Whole area")}</button></li>
            {d.attractions.map(a => {
              const query = `${a.split(' (')[0]} ${short(d)} Bihar`
              return <li key={a}><button onClick={() => { setQ(query); setLabel(a) }} aria-pressed={q === query} className={`chip text-start ${q === query ? 'chip-on' : 'bg-white hover:bg-cream'}`}>{tx(a)}</button></li>
            })}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <iframe key={q} title={`Map: ${label}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&output=embed`} loading="lazy" className="h-96 w-full rounded-2xl border border-cream" referrerPolicy="no-referrer-when-downgrade" />
          <p className="mt-2 text-sm"><strong>{label ? tx(label) : tx('{{name}} (whole area)', { name: tx(short(d)) })}</strong> <a className="ms-2 underline" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}>{tx("Open in Google Maps")}</a></p>
        </div>
      </div>
    </section>
  )
}
