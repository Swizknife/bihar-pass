import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Camera, ChevronLeft, ChevronRight, Clock, Heart, MapPin, Ticket, Calendar, Eye } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { destinations } from '../data/destinations'
import type { Category, Destination } from '../types'
import { gmapsDir } from '../lib/constants'
import { photoQueryFor, usePhotos } from '../lib/photos'
import { feeSummary, timingSummary } from '../lib/timings'
import { Lightbox } from './Gallery'
import { SectionTitle, Visual, useTrip } from './ui'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

const short = (d: Destination) => d.name.split(' (')[0]
const label = (k: Category) => CATEGORIES.find(c => c.key === k)?.label ?? k

function TopCard({ d, active, onLook }: { d: Destination; active: boolean; onLook: () => void }) {
  const { ids, toggle } = useTrip()
  const photos = usePhotos(photoQueryFor(d.id))
  const saved = ids.includes(d.id)
  return (
    <article className={`group flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-80 ${active ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-cream'}`}>
      <div className="relative h-48 shrink-0 overflow-hidden">
        <button onClick={onLook} aria-label={`Quick look at ${short(d)}`} className="absolute inset-0">
          {photos[0]
            ? <img src={photos[0].url} alt={`${short(d)}: ${photos[0].title}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            : <Visual id={d.id} hue={d.hue} label={short(d)} className="h-full w-full" />}
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        </button>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1">
          {d.categories.slice(0, 2).map(c => <span key={c} className="rounded-full bg-ivory/90 px-2.5 py-0.5 text-[11px] font-semibold text-charcoal backdrop-blur">{label(c)}</span>)}
        </div>
        <button onClick={() => toggle(d.id)} aria-pressed={saved} aria-label={saved ? `Remove ${short(d)} from My Trip` : `Add ${short(d)} to My Trip`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 shadow backdrop-blur transition hover:scale-110">
          <Heart size={18} className={saved ? 'fill-terracotta text-terracotta' : 'text-charcoal'} />
        </button>
        <h3 className="pointer-events-none absolute bottom-3 left-4 right-4 font-heading text-2xl font-bold text-white drop-shadow">{short(d)}</h3>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1 text-xs text-stone"><MapPin size={12} />{tx('{{place}}, Bihar', { place: tx(d.district) })}</p>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal">{tx(d.tagline)}</p>
        <dl className="mt-3 space-y-1.5 text-xs text-stone">
          <div className="flex gap-2"><Calendar size={13} className="mt-0.5 shrink-0 text-terracotta" /><dd className="line-clamp-1">{d.bestTime.split(';')[0]}</dd></div>
          <div className="flex gap-2"><Clock size={13} className="mt-0.5 shrink-0 text-terracotta" /><dd className="line-clamp-1">{timingSummary(d.id)}</dd></div>
          <div className="flex gap-2"><Ticket size={13} className="mt-0.5 shrink-0 text-terracotta" /><dd className="line-clamp-1">{feeSummary(d.id)}</dd></div>
        </dl>
        <div className="mt-auto flex gap-2 pt-4">
          <Link to={`/explore/${d.id}`} className="btn btn-primary flex-1 !px-3 !py-2 text-xs">{tx("View details")}<ArrowRight size={13} /></Link>
          <button onClick={onLook} className="btn btn-outline !px-3 !py-2 text-xs" aria-label={`Quick look at ${short(d)}`}><Eye size={14} />{tx("Quick look")}</button>
        </div>
      </div>
    </article>
  )
}

function Spotlight({ d }: { d: Destination }) {
  const { ids, toggle } = useTrip()
  const photos = usePhotos(photoQueryFor(d.id))
  const [tab, setTab] = useState<'photos' | 'map'>('photos')
  const [k, setK] = useState(0)
  const [open, setOpen] = useState(false)
  useEffect(() => { setK(0); setTab('photos') }, [d.id])
  const main = photos[k] ?? photos[0]
  const saved = ids.includes(d.id)
  return (
    <section aria-live="polite" aria-label={`Quick look: ${short(d)}`} className="mt-8 overflow-hidden rounded-3xl border border-cream bg-white shadow-lg">
      <div className="grid lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div role="tablist" className="flex gap-1 bg-cream/60 p-2">
            {(['photos', 'map'] as const).map(x => <button key={x} role="tab" aria-selected={tab === x} onClick={() => setTab(x)} className={`rounded-xl px-4 py-1.5 text-sm font-semibold capitalize transition ${tab === x ? 'bg-terracotta text-white' : 'hover:bg-cream'}`}>{x}</button>)}
          </div>
          {tab === 'photos' ? (
            <div>
              <button onClick={() => photos.length && setOpen(true)} disabled={!photos.length} aria-label={tx("Enlarge photo")} className="group relative block h-72 w-full overflow-hidden sm:h-96 enabled:cursor-zoom-in">
                {main ? <img key={main.url} src={main.url} alt={`${short(d)}: ${main.title}`} className="h-full w-full animate-[fadein_.4s_ease] object-cover transition duration-700 group-hover:scale-105" /> : <Visual id={d.id} hue={d.hue} label={short(d)} className="h-full w-full" />}
                {main && <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white"><Camera size={12} />{k + 1} / {photos.length}</span>}
              </button>
              {photos.length > 1 && (
                <div className="no-scrollbar flex gap-2 overflow-x-auto p-2">
                  {photos.map((p, i) => <button key={p.url} onClick={() => setK(i)} aria-label={`Photo ${i + 1}`} aria-pressed={i === k} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg transition ${i === k ? 'ring-2 ring-terracotta' : 'opacity-60 hover:opacity-100'}`}><img src={p.url} alt="" className="h-full w-full object-cover" /></button>)}
                </div>
              )}
            </div>
          ) : (
            <iframe key={d.id} title={`${short(d)} map`} src={`https://maps.google.com/maps?q=${d.lat},${d.lng}&z=11&output=embed`} loading="lazy" className="h-[26rem] w-full" referrerPolicy="no-referrer-when-downgrade" />
          )}
        </div>
        <div className="flex flex-col p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">{d.categories.map(label).join(' · ')}</p>
          <h3 className="mt-1 text-3xl font-bold">{short(d)}</h3>
          <p className="mt-1 text-sm text-stone">{tx(d.tagline)}</p>
          <p className="mt-3 text-sm text-charcoal">{tx(d.overview)}</p>
          <h4 className="mt-4 text-sm font-bold">{tx("Highlights")}</h4>
          <ul className="mt-1 flex flex-wrap gap-1.5">{d.attractions.slice(0, 5).map(a => <li key={a} className="rounded-full bg-cream px-2.5 py-1 text-xs">{tx(a)}</li>)}</ul>
          <p className="mt-4 text-xs text-stone"><strong>{tx("Best time:")}</strong> {tx(d.bestTime)}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <Link to={`/explore/${d.id}`} className="btn btn-primary">{tx('Explore {{place}}', { place: tx(short(d)) })}<ArrowRight size={14} /></Link>
            <button onClick={() => toggle(d.id)} aria-pressed={saved} className="btn btn-outline"><Heart size={14} className={saved ? 'fill-terracotta' : ''} />{saved ? tx('In My Trip') : tx('Add to My Trip')}</button>
            <a href={gmapsDir('Patna', `${d.lat},${d.lng}`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{tx("Directions from Patna")}</a>
          </div>
        </div>
      </div>
      {open && <Lightbox photos={photos} index={k} setIndex={setK} onClose={() => setOpen(false)} />}
    </section>
  )
}

export function TopDestinations() {
  const { t } = useTranslation()
  const [sel, setSel] = useState<string>(destinations[0].id)
  const rail = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ pct: 0, start: true, end: false })
  const list = destinations
  const active = list.find(d => d.id === sel) ?? list[0]

  const onScroll = () => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setPos({ pct: max > 0 ? el.scrollLeft / max : 0, start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 })
  }
  useEffect(() => { onScroll() }, [])
  const go = (dir: number) => rail.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })

  return (
    <section className="bg-cream/50">
      <div className="section">
        <SectionTitle title={t('sec.top')} sub="Tap a card for a quick look with photos and a map, or save places to your trip with the heart." action={<Link className="font-semibold text-terracotta underline" to="/explore">{t('sec.all')}</Link>} />
        <div className="relative">
          <button aria-label={tx("Previous")} disabled={pos.start} onClick={() => go(-1)} className="absolute -left-3 top-24 z-10 hidden rounded-full bg-white p-2 shadow-lg transition hover:scale-110 disabled:opacity-30 md:block"><ChevronLeft /></button>
          <div ref={rail} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth pb-4">
            {list.map(d => <TopCard key={d.id} d={d} active={active?.id === d.id} onLook={() => setSel(d.id)} />)}
            {!list.length && <p className="text-stone">{tx("No destinations in this category yet.")}</p>}
          </div>
          <button aria-label={tx("Next")} disabled={pos.end} onClick={() => go(1)} className="absolute -right-3 top-24 z-10 hidden rounded-full bg-white p-2 shadow-lg transition hover:scale-110 disabled:opacity-30 md:block"><ChevronRight /></button>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded bg-cream" aria-hidden><div className="h-full rounded bg-terracotta transition-all" style={{ width: `${Math.max(12, 100 / Math.max(list.length, 1) + pos.pct * (100 - 100 / Math.max(list.length, 1)))}%` }} /></div>

        {active && <Spotlight d={active} />}
      </div>
    </section>
  )
}
