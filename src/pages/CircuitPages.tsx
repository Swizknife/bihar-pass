import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Bus, Calendar, Camera, Clock, MapPin, Route, Ticket } from 'lucide-react'
import { getCircuit } from '../data/circuits'
import { getDestination } from '../data/destinations'
import { localAccess } from '../data/access'
import type { Destination } from '../types'
import { Lightbox } from '../components/Gallery'
import { PageHero } from '../components/PageHero'
import { Visual, useTrip } from '../components/ui'
import { roadKm } from '../lib/geo'
import { photoQueryFor, usePhotos } from '../lib/photos'
import { feeSummary, timingSummary } from '../lib/timings'
import { RouteSketch } from './BookingStudio'
import NotFound from './NotFound'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

const short = (d: Destination) => d.name.split(' (')[0]

function PlaceCard({ d, n, active, onSelect }: { d: Destination; n: number; active: boolean; onSelect: () => void }) {
  const photos = usePhotos(photoQueryFor(d.id))
  const [i, setI] = useState<number | null>(null)
  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${active ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-cream hover:shadow-md'}`}>
      <div className="grid sm:grid-cols-5">
        <button onClick={() => photos.length && setI(0)} disabled={!photos.length} aria-label={`View photos of ${short(d)}`} className="group relative h-44 overflow-hidden sm:col-span-2 sm:h-full sm:min-h-48 enabled:cursor-zoom-in">
          {photos[0]
            ? <img src={photos[0].url} alt={`${short(d)}: ${photos[0].title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            : <Visual id={d.id} hue={d.hue} label={short(d)} className="h-full w-full" />}
          <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white shadow">{n}</span>
          {photos.length > 1 && <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"><Camera size={12} />{photos.length}</span>}
        </button>
        <div className="p-4 sm:col-span-3">
          <h3 className="text-xl font-bold uppercase">{short(d)}</h3>
          <p className="text-xs text-stone">{tx('{{place}} district', { place: tx(d.district) })}</p>
          <p className="mt-2 text-sm text-stone">{tx(d.tagline)}.</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex gap-2"><Bus size={16} className="mt-0.5 shrink-0 text-terracotta" /><div><dt className="font-semibold">{tx("How to reach")}</dt><dd className="text-stone">{localAccess[d.id] ?? `Nearest rail: ${d.nearestRail}. Airport: ${d.nearestAirport}.`}</dd></div></div>
            <div className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-terracotta" /><div><dt className="font-semibold">{tx("Timings")}</dt><dd className="text-stone">{timingSummary(d.id)}</dd></div></div>
            <div className="flex gap-2"><Ticket size={16} className="mt-0.5 shrink-0 text-terracotta" /><div><dt className="font-semibold">{tx("Entry fee")}</dt><dd className="text-stone">{feeSummary(d.id)}</dd></div></div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to={`/explore/${d.id}`} className="btn btn-primary !px-4 !py-1.5 text-xs">{tx("View details")}</Link>
            <button onClick={onSelect} className="btn btn-outline !px-4 !py-1.5 text-xs"><MapPin size={12} />{tx("Show on map")}</button>
          </div>
        </div>
      </div>
      {i !== null && <Lightbox photos={photos} index={i} setIndex={setI} onClose={() => setI(null)} />}
    </article>
  )
}

function PlacePhotos({ d }: { d: Destination }) {
  const photos = usePhotos(photoQueryFor(d.id))
  const [i, setI] = useState<number | null>(null)
  if (!photos.length) return null
  return (
    <>
      {photos.slice(0, 2).map((p, k) => (
        <button key={p.url} onClick={() => setI(k)} aria-label={`Open photo: ${p.title}`} className="group relative h-48 overflow-hidden rounded-xl bg-cream">
          <img src={p.url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-start text-sm font-semibold text-white">{short(d)}</span>
        </button>
      ))}
      {i !== null && <Lightbox photos={photos} index={i} setIndex={setI} onClose={() => setI(null)} />}
    </>
  )
}

export function CircuitPage() {
  const { id } = useParams()
  const c = id ? getCircuit(id) : undefined
  const { setAll } = useTrip()
  const nav = useNavigate()
  const [sel, setSel] = useState<string | undefined>()
  if (!c) return <NotFound />
  const places = c.places.map(getDestination).filter((x): x is Destination => !!x)
  const active = places.find(p => p.id === sel) ?? places[0]
  const km = places.reduce((s, d, i) => s + (i > 0 ? roadKm(places[i - 1], d) : 0), 0)
  const pts = places.map(p => `${p.lat},${p.lng}`)
  const routeUrl = pts.length > 1
    ? `https://www.google.com/maps/dir/?api=1&origin=${pts[0]}&destination=${pts[pts.length - 1]}${pts.length > 2 ? `&waypoints=${encodeURIComponent(pts.slice(1, -1).join('|'))}` : ''}`
    : `https://www.google.com/maps/search/?api=1&query=${pts[0]}`
  const links = [['overview', '01 Overview'], ['locations', '02 Locations and map'], ['gallery', '03 Photo gallery'], ['plan', '04 Plan it']]

  return (
    <>
      <PageHero title={c.name} tagline={c.subtitle} photoQuery={photoQueryFor(places[0].id)} hue={c.hue}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Explore Bihar', to: '/explore' }, { label: 'Circuits' }, { label: c.name }]} />
      <nav aria-label={tx("On this page")} className="sticky top-[57px] z-30 border-b border-cream bg-ivory/95 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {links.map(([a, label]) => <a key={a} href={`#${a}`} className="shrink-0 px-4 py-3 text-sm font-semibold hover:text-terracotta">{tx(label)}</a>)}
        </div>
      </nav>
      <div className="section space-y-14">
        <section id="overview" className="scroll-mt-28">
          <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">01</span>{tx('{{name}} overview', { name: tx(c.name) })}</h2>
          <div className="mt-2 h-1 w-14 rounded bg-gold" />
          <p className="mt-2 text-sm uppercase tracking-widest text-terracotta">{tx(c.tagline)}</p>
          <p className="mt-4 max-w-3xl text-lg text-stone">{tx(c.overview)}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="chip bg-white"><MapPin size={12} className="me-1 inline" />{txn(places.length, '{{n}} location', '{{n}} locations')}</span>
            {km > 0 && <span className="chip bg-white"><Route size={12} className="me-1 inline" />{tx('about {{km}} km between them (estimate)', { km })}</span>}
            <span className="chip bg-white"><Calendar size={12} className="me-1 inline" />{tx('Best: {{season}}', { season: tx(c.season) })}</span>
          </div>
        </section>

        <section id="locations" className="scroll-mt-28">
          <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">02</span>{tx('{{name}} locations', { name: tx(c.name) })}</h2>
          <div className="mb-6 mt-2 h-1 w-14 rounded bg-gold" />
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              {places.map((d, i) => <PlaceCard key={d.id} d={d} n={i + 1} active={active.id === d.id} onSelect={() => setSel(d.id)} />)}
              <p className="text-xs text-stone">{tx("Timings and fees are shown only where a source was found; otherwise confirm locally. Dates and conditions can change.")}</p>
            </div>
            <aside className="space-y-3 lg:sticky lg:top-32 lg:col-span-2 lg:h-fit">
              <RouteSketch days={[{ stops: places }]} selected={active.id} activeDay={0} onSelect={sid => setSel(sid)} />
              <p className="text-xs text-stone">{tx("Click a numbered location to see it on the map. The line follows the order of the circuit.")}</p>
              <iframe key={active.id} title={`${short(active)} map`} src={`https://maps.google.com/maps?q=${active.lat},${active.lng}&z=11&output=embed`} loading="lazy" className="h-72 w-full rounded-2xl border border-cream" referrerPolicy="no-referrer-when-downgrade" />
              <a href={routeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><Route size={14} />{tx("Open the full route in Google Maps")}</a>
            </aside>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-28">
          <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">03</span>{tx("Photo gallery")}</h2>
          <div className="mb-5 mt-2 h-1 w-14 rounded bg-gold" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{places.map(d => <PlacePhotos key={d.id} d={d} />)}</div>
          <p className="mt-2 text-xs text-stone">{tx("Click any photo to enlarge it. Photographer credits are shown in the viewer.")}</p>
        </section>

        <section id="plan" className="scroll-mt-28 rounded-2xl bg-forest p-8 text-white">
          <h2 className="text-2xl font-bold uppercase"><span className="me-3 text-gold">04</span>{tx('I wish to travel the {{name}}', { name: tx(c.name) })}</h2>
          <p className="mt-2 max-w-2xl text-white/85">{tx("Load every location into the trip planner, then set your dates and group size.")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => { setAll(c.places); nav('/plan-your-trip') }} className="btn !bg-gold !text-charcoal hover:!bg-white">{tx("Plan this circuit")}</button>
            <Link to="/packages" className="btn border border-white/70 text-white hover:bg-white/20">{tx("Tour Packages")}</Link>
          </div>
        </section>
      </div>
    </>
  )
}
