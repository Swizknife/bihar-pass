import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Camera, CalendarDays, Check, MapPin, Route, Ticket, Users } from 'lucide-react'
import { getPackage } from '../data/packages'
import { getDestination } from '../data/destinations'
import { ExtLink, Visual } from '../components/ui'
import { Lightbox } from '../components/Gallery'
import { LINKS } from '../lib/constants'
import { roadHrs, roadKm } from '../lib/geo'
import { photoQueryFor, usePhotos } from '../lib/photos'
import type { Destination } from '../types'
import { DAY_COLORS, RouteSketch } from './BookingStudio'
import NotFound from './NotFound'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'
import { AddToCart } from '../components/AddToCart'

type Pkg = NonNullable<ReturnType<typeof getPackage>>

function PackageHero({ p }: { p: Pkg }) {
  const photos = usePhotos(photoQueryFor(p.destinations[0]))
  const [view, setView] = useState(false)
  const stops = p.itinerary.flatMap(d => d.stops).map(getDestination).filter((x): x is Destination => !!x)
  const km = stops.reduce((sum, d, i) => sum + (i > 0 && stops[i - 1].id !== d.id ? roadKm(stops[i - 1], d) : 0), 0)
  const pill = 'inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur'
  return (
    <header className="relative isolate overflow-hidden text-white" style={{ background: `linear-gradient(135deg, hsl(${p.hue} 55% 38%), hsl(${(p.hue + 30) % 360} 50% 18%))` }}>
      {photos[0] && <img src={photos[0].url} alt={photos[0].title} className="absolute inset-0 -z-10 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        <Link to="/packages" className="text-sm text-white/80 hover:underline">{tx("← Tour Packages")}</Link>
        <h1 className="mt-2 max-w-3xl text-4xl font-bold sm:text-5xl">{tx(p.title)}</h1>
        <p className="mt-3 max-w-2xl text-lg text-white/90">{tx(p.summary)}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className={pill}><CalendarDays size={14} />{txn(p.days, '{{n}} day', '{{n}} days')}</span>
          <span className={pill}><MapPin size={14} />{txn(p.destinations.length, '{{n}} destination', '{{n}} destinations')}</span>
          {km > 0 && <span className={pill}><Route size={14} />{tx('about {{km}} km by road (estimate)', { km })}</span>}
          <span className={pill}><Users size={14} />{tx('Best for {{who}}', { who: p.bestFor.map(b => tx(b)).join(', ') })}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/packages/${p.id}/book`} className="btn btn-primary">{tx("Customise and get pass")}</Link>
          <AddToCart title={p.title} sites={p.destinations} days={p.days} className="btn btn-light" />
          <a href="#itinerary" className="btn btn-light">{tx("See the itinerary")}</a>
          {photos.length > 0 && <button onClick={() => setView(true)} className="btn border border-white/70 text-white hover:bg-white/20"><Camera size={14} />{txn(photos.length, '{{n}} photo', '{{n}} photos')}</button>}
        </div>
        {photos[0] && <p className="mt-4 text-xs text-white/60">{tx('Photo: {{credit}}, {{license}}, Wikimedia Commons', { credit: photos[0].credit, license: photos[0].license })}</p>}
      </div>
      {view && <Lightbox photos={photos} index={0} setIndex={() => {}} onClose={() => setView(false)} />}
    </header>
  )
}

function StopTile({ d, selected, leg, onSelect }: { d: Destination; selected: boolean; leg: number; onSelect: () => void }) {
  const photos = usePhotos(photoQueryFor(d.id))
  const [i, setI] = useState<number | null>(null)
  return (
    <article className={`overflow-hidden rounded-xl border bg-white transition ${selected ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-cream hover:shadow-md'}`}>
      <button onClick={() => photos.length && setI(0)} aria-label={`View photos of ${d.name}`} className="group relative block h-40 w-full overflow-hidden">
        {photos[0]
          ? <img src={photos[0].url} alt={`${d.name}: ${photos[0].title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          : <Visual id={d.id} hue={d.hue} label={d.name} className="h-full w-full" />}
        {photos.length > 0 && <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"><Camera size={12} />{photos.length}</span>}
      </button>
      <div className="p-3">
        <h4 className="font-bold">{tx(d.name)}</h4>
        <p className="text-xs text-stone">{tx(d.tagline)}</p>
        <p className="mt-1 text-xs text-forest">{tx('Suggested')} {d.hours >= 24 ? tx('1-2 days') : tx('{{h}} h', { h: d.hours })}{leg > 0 && ` · ${tx('{{km}} km, ~{{h}} h from previous', { km: leg, h: roadHrs(leg) })}`}</p>
        <ul className="mt-2 flex flex-wrap gap-1">{d.attractions.slice(0, 3).map(a => <li key={a} className="rounded-full bg-cream px-2 py-0.5 text-[11px]">{tx(a)}</li>)}</ul>
        <div className="mt-3 flex gap-2">
          <button onClick={onSelect} className="btn btn-outline !px-3 !py-1 text-xs"><MapPin size={12} />{tx("On map")}</button>
          <Link to={`/explore/${d.id}`} className="btn btn-outline !px-3 !py-1 text-xs">{tx("Guide")}</Link>
        </div>
      </div>
      {i !== null && <Lightbox photos={photos} index={i} setIndex={setI} onClose={() => setI(null)} />}
    </article>
  )
}

export function PackageDetailPage() {
  const { id } = useParams()
  const p = id ? getPackage(id) : undefined
  const [sel, setSel] = useState<string | undefined>()
  const [dayIdx, setDayIdx] = useState(0)
  if (!p) return <NotFound />
  const days = p.itinerary.map(d => ({ ...d, list: d.stops.map(getDestination).filter((x): x is Destination => !!x) }))
  const current = (sel && getDestination(sel)) || days[0].list[0]
  let prev: Destination | undefined
  return (
    <>
      <PackageHero p={p} />
      <div className="section">
        <section id="itinerary" className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold">{tx("Day-wise itinerary")}</h2>
            <div className="mt-2 h-1 w-14 rounded bg-gold" />
            <ol className="relative mt-6 space-y-8 border-s-2 border-cream ps-6">
              {days.map((day, di) => {
                const legs = day.list.map(s => { const km = prev && prev.id !== s.id ? roadKm(prev, s) : 0; prev = s; return km })
                return (
                  <li key={di} className="relative" onMouseEnter={() => setDayIdx(di)}>
                    <span className="absolute -start-[2.15rem] top-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white shadow" style={{ background: DAY_COLORS[di % 7] }}>{di + 1}</span>
                    <h3 className="text-xl font-bold" style={{ color: DAY_COLORS[di % 7] }}>{tx('Day {{n}}', { n: di + 1 })}: {tx(day.title)}</h3>
                    <p className="mt-1 text-sm text-stone">{tx(day.note)}</p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      {day.list.map((s, si) => <StopTile key={`${s.id}-${si}`} d={s} leg={legs[si]} selected={current?.id === s.id} onSelect={() => { setSel(s.id); setDayIdx(di) }} />)}
                    </div>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 text-xs text-stone">{tx("Distances and times are rough estimates. No pricing or availability is shown because none has been officially verified.")}</p>
          </div>
          <aside className="space-y-3 lg:sticky lg:top-20 lg:col-span-2 lg:h-fit">
            <h2 className="text-xl font-bold">{tx("Route and map")}</h2>
            <RouteSketch days={days.map(d => ({ stops: d.list }))} selected={current?.id} activeDay={dayIdx} onSelect={(sid, di) => { setSel(sid); setDayIdx(di) }} />
            <p className="text-xs text-stone">{tx("Click a numbered stop to see it on the map. The solid line is the day you are viewing.")}</p>
            {current && <iframe key={current.id} title={`${current.name} map`} src={`https://maps.google.com/maps?q=${current.lat},${current.lng}&z=12&output=embed`} loading="lazy" className="h-64 w-full rounded-2xl border border-cream" referrerPolicy="no-referrer-when-downgrade" />}
            {current && <p className="text-sm"><strong>{tx(current.name)}</strong>: {tx('best time {{t}}', { t: tx(current.bestTime.split(';')[0]) })}.</p>}
          </aside>
        </section>

        <section id="pass" className="mt-12 rounded-2xl border border-gold/60 bg-white p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold"><Ticket size={22} />{tx("Your Bihar Pass for this package")}</h2>
          <p className="mt-1 text-sm text-stone">{tx("One QR code covers one entry at each of these sites. This is a demonstration: no payment is taken and sites do not accept it yet.")}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[...new Set(days.flatMap(d => d.list))].map(s => <li key={s.id} className="flex items-center gap-2 rounded-lg bg-ivory px-3 py-2 text-sm"><Check size={16} className="text-forest" />{tx(s.name)}</li>)}
          </ul>
        </section>

        <section id="booking" className="mt-6 overflow-hidden rounded-2xl bg-forest text-white">
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">{tx("Ready to get your pass?")}</h2>
              <p className="mt-2 text-white/85">{tx("Set your group size, dates and activities, then continue to a Bihar Pass (demonstration). For real tickets and stays, use the official portals.")}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={`/packages/${p.id}/book`} className="btn !bg-gold !text-charcoal hover:!bg-white">{tx("Customise and get pass")}</Link>
                <AddToCart title={p.title} sites={p.destinations} days={p.days} className="btn border border-white/70 text-white hover:bg-white/20" />
                <Link to="/plan-your-trip" className="btn border border-white/70 text-white hover:bg-white/20">{tx("Open in trip planner")}</Link>
              </div>
            </div>
            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="font-bold">{tx("Official booking portals")}</h3>
              <p className="mt-1 text-sm text-white/80">{tx("This site does not take payments for tickets or accommodation.")}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <ExtLink href={LINKS.tourism.url} className="btn btn-light">{tx("Bihar Tourism")}</ExtLink>
                <ExtLink href={LINKS.irctc.url} className="btn btn-light">{tx("IRCTC trains")}</ExtLink>
                <ExtLink href={LINKS.bsrtc.url} className="btn btn-light" verified={LINKS.bsrtc.verified}>{tx("BSRTC buses")}</ExtLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
