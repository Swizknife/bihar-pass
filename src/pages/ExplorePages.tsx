import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, MapPin, PartyPopper, Plane, Search, Train, Bus } from 'lucide-react'
import { destinations, getDestination } from '../data/destinations'
import { allFestivals, festivalsFor } from '../data/festivals'
import { attractionNote } from '../data/attractionNotes'
import type { Category, Destination } from '../types'
import { AddToTrip, DestCard, ExtLink, Map, Visual } from '../components/ui'
import { Gallery, Lightbox } from '../components/Gallery'
import { HoursTable } from '../components/HoursTable'
import { PageHero } from '../components/PageHero'
import { CATEGORIES } from '../data/categories'
import { circuits } from '../data/circuits'
import { AttractionMap, QuickFacts } from './DestinationParts'
import { CenterTitle, Tile } from './ExperiencePages'
import { LINKS, gmapsDir } from '../lib/constants'
import { roadHrs, roadKm } from '../lib/geo'
import { photoQueryFor, usePhotos } from '../lib/photos'
import NotFound from './NotFound'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export function ExplorePage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [letter, setLetter] = useState<string | null>(null)
  const cat = (params.get('cat') as Category | null) ?? null
  const current = CATEGORIES.find(c => c.key === cat)
  const sorted = useMemo(() => [...destinations].sort((a, b) => a.name.localeCompare(b.name)), [])
  const letters = [...new Set(sorted.map(d => d.name[0].toUpperCase()))]
  const list = sorted.filter(d =>
    (!cat || d.categories.includes(cat)) && (!letter || d.name[0].toUpperCase() === letter) &&
    (!q || `${d.name} ${d.district} ${d.tagline} ${d.attractions.join(' ')}`.toLowerCase().includes(q.toLowerCase())))
  const browsing = !cat && !q && !letter

  return (
    <>
      <CenterTitle title={current?.label ?? 'Destinations'} tagline={current?.tagline ?? 'Where history, spirituality and culture come alive'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Explore Bihar', to: current ? '/explore' : undefined }, ...(current ? [{ label: current.label }] : [])]} />

      {browsing && (
        <>
          <p className="mx-auto max-w-3xl px-4 py-8 text-center text-lg text-stone">{tx("Bihar was the heart of ancient Magadha and the cradle of Buddhism and Jainism. Choose a theme to begin, or scroll to see every destination from A to Z.")}</p>
          <div className="grid sm:grid-cols-2">
            {CATEGORIES.map(c => (
              <Tile key={c.key} label={c.label} query={c.query} hue={c.hue} to={`/explore?cat=${c.key}`}>
                {tx(c.tagline)}. {txn(destinations.filter(d => d.categories.includes(c.key)).length, '{{n}} destination', '{{n}} destinations')}.
              </Tile>
            ))}
          </div>
          <div className="section pb-0">
            <h2 className="text-3xl font-bold uppercase">{tx("Circuits")}</h2>
            <div className="mt-2 h-1 w-14 rounded bg-gold" />
            <p className="mt-3 max-w-2xl text-stone">{tx("Themed routes that link several destinations. Open one to see its locations, timings, map and photos together.")}</p>
          </div>
          <div className="mt-6 grid sm:grid-cols-2">
            {circuits.map(c => (
              <Tile key={c.id} label={c.name} query={photoQueryFor(c.places[0])} hue={c.hue} to={`/explore/circuits/${c.id}`}>
                {tx(c.subtitle)}. {tx('{{n}} locations: {{list}}.', { n: c.places.length, list: c.places.map(p => tx(getDestination(p)?.name.split(' (')[0] ?? p)).join(', ') })}
              </Tile>
            ))}
          </div>
        </>
      )}

      <div className="section">
        <h2 className="text-3xl font-bold uppercase">{current ? current.label : 'All destinations A to Z'}</h2>
        <div className="mt-2 h-1 w-14 rounded bg-gold" />
        <div role="tablist" aria-label={tx("Destination categories")} className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
          <button role="tab" aria-selected={!cat} onClick={() => setParams({})} className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${!cat ? 'bg-terracotta text-white' : 'bg-cream hover:bg-cream/70'}`}>{tx("All destinations")}</button>
          {CATEGORIES.map(c => (
            <button key={c.key} role="tab" aria-selected={cat === c.key} onClick={() => setParams({ cat: c.key })}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${cat === c.key ? 'bg-terracotta text-white' : 'bg-cream hover:bg-cream/70'}`}>{tx(c.label)}</button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex min-w-60 flex-1 items-center gap-2 rounded-full border border-gold/60 bg-white px-4 py-2 sm:max-w-sm">
            <Search size={16} aria-hidden /><span className="sr-only">{t('common.search')}</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('common.search')} className="w-full bg-transparent outline-none" />
          </label>
          <div className="flex flex-wrap items-center gap-1" aria-label={tx("Browse A to Z")}>
            <button onClick={() => setLetter(null)} className={`chip ${!letter ? 'chip-on' : 'bg-white'}`}>A-Z</button>
            {letters.map(l => <button key={l} onClick={() => setLetter(letter === l ? null : l)} aria-pressed={letter === l} className={`h-7 w-7 rounded-full text-xs font-semibold ${letter === l ? 'bg-forest text-white' : 'bg-white hover:bg-cream'}`}>{l}</button>)}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-stone">{tx("Popular searches:")}</span>
          {['Buddhist', 'Waterfall', 'Tiger', 'Museum', 'Temple', 'Lake'].map(w => <button key={w} onClick={() => setQ(w)} className="chip bg-white hover:bg-cream">{tx(w)}</button>)}
          {q && <button onClick={() => setQ('')} className="chip bg-white underline">{tx("Clear")}</button>}
        </div>
        <p className="mt-3 text-sm text-stone">{txn(list.length, '{{n}} destination', '{{n}} destinations')}</p>
      </div>
      <div className="grid sm:grid-cols-2">
        {list.map(d => (
          <Tile key={d.id} label={d.name.split(' (')[0]} query={photoQueryFor(d.id)} hue={d.hue} to={`/explore/${d.id}`}>
            {tx(d.tagline)}. {tx(d.district)}. {tx('Best time: {{t}}.', { t: tx(d.bestTime.split(';')[0]) })}
          </Tile>
        ))}
      </div>
      {!list.length && <p className="py-12 text-center text-stone">{tx("No destinations match your search.")}</p>}

      <div className="section">
        <section>
          <h2 className="flex items-center gap-2 text-3xl font-bold uppercase"><PartyPopper /> {tx("Fairs and festivals")}</h2>
          <div className="mt-2 h-1 w-14 rounded bg-gold" />
          <p className="mt-3 text-sm text-stone">{tx("Dates change every year. Confirm them on the official Bihar Tourism calendar before planning around a festival.")}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allFestivals.map(f => (
              <article key={f.name} className="card !translate-y-0 p-5">
                <h3 className="text-lg font-bold text-terracotta">{tx(f.name)}</h3>
                <p className="mt-1 text-sm text-stone">{tx(f.text)}</p>
                <Link to={`/explore/${f.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-forest underline"><MapPin size={14} />{getDestination(f.id)?.name}</Link>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-16 rounded-2xl bg-forest p-8 text-white">
          <h2 className="text-2xl font-bold uppercase">{tx("I wish to visit Bihar")}</h2>
          <p className="mt-2 max-w-2xl text-white/85">{tx("Tell us your dates and group size and we will build an itinerary, or pick a ready-made package.")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/plan-your-trip" className="btn !bg-gold !text-charcoal hover:!bg-white">{tx("Plan Your Trip")}</Link>
            <Link to="/packages" className="btn border border-white/70 text-white hover:bg-white/20">{tx("Tour Packages")}</Link>
          </div>
        </section>
      </div>
    </>
  )
}

function AttractionCard({ d, name }: { d: Destination; name: string }) {
  const photos = usePhotos(`${name} ${d.name.split(' (')[0]}`)
  const [i, setI] = useState<number | null>(null)
  return (
    <article className="overflow-hidden rounded-2xl border border-cream bg-white shadow-sm transition hover:shadow-md">
      <button onClick={() => photos.length && setI(0)} disabled={!photos.length} aria-label={`View photos of ${name}`} className="group relative block h-44 w-full overflow-hidden enabled:cursor-zoom-in">
        {photos[0]
          ? <img src={photos[0].url} alt={`${name}: ${photos[0].title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          : <Visual id={`${d.id}-attr`} hue={d.hue} label={name} className="h-full w-full" />}
      </button>
      <div className="p-4">
        <h4 className="text-lg font-bold uppercase">{tx(name)}</h4>
        <p className="mt-1 text-sm text-stone">{attractionNote(d.id, name, d.tagline)}</p>
      </div>
      {i !== null && <Lightbox photos={photos} index={i} setIndex={setI} onClose={() => setI(null)} />}
    </article>
  )
}

const TABS = ['Attractions', 'Festivals', 'How to reach', 'Timings', 'Travel tips'] as const

function ExploreTabs({ d }: { d: Destination }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Attractions')
  const fest = festivalsFor(d.id)
  return (
    <section id="explore" className="scroll-mt-28">
      <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">04</span>{tx('Attractions and places to visit in {{name}}', { name: tx(d.name.split(' (')[0]) })}</h2>
      <div className="mt-2 h-1 w-14 rounded bg-gold" />
      <div role="tablist" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
        {TABS.map(x => <button key={x} role="tab" aria-selected={tab === x} onClick={() => setTab(x)} className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${tab === x ? 'bg-terracotta text-white' : 'bg-cream hover:bg-cream/70'}`}>{tx(x)}</button>)}
      </div>
      <div role="tabpanel" className="mt-6">
        {tab === 'Attractions' && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{d.attractions.map(a => <AttractionCard key={a} d={d} name={a} />)}</div>}
        {tab === 'Festivals' && (fest.length
          ? <div className="grid gap-5 md:grid-cols-2">{fest.map(f => <article key={f.name} className="card !translate-y-0 p-5"><h3 className="flex items-center gap-2 text-xl font-bold uppercase text-terracotta"><Calendar size={18} />{tx(f.name)}</h3><p className="mt-2 text-stone">{tx(f.text)}</p></article>)}</div>
          : <p className="rounded-xl bg-cream/70 p-5 text-stone">{tx("No major festival is listed for this place yet. See")} <Link className="underline" to="/explore">{tx("Explore Bihar")}</Link> {tx("for festivals across the state.")}</p>)}
        {tab === 'How to reach' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold uppercase">{tx("How to reach here")}</h3>
              <ul className="mt-4 space-y-4">
                <li className="flex gap-3"><Plane className="mt-1 shrink-0 text-terracotta" /><div><strong>{tx("By air")}</strong><p className="text-sm text-stone">{tx('Nearest airport: {{name}}.', { name: tx(d.nearestAirport) })}</p></div></li>
                <li className="flex gap-3"><Train className="mt-1 shrink-0 text-terracotta" /><div><strong>{tx("By train")}</strong><p className="text-sm text-stone">{tx('Nearest railway: {{name}}.', { name: tx(d.nearestRail) })}</p></div></li>
                <li className="flex gap-3"><Bus className="mt-1 shrink-0 text-terracotta" /><div><strong>{tx("By road")}</strong><p className="text-sm text-stone">{tx('Reached by road from Patna and nearby towns, roughly {{km}} km from Patna (estimate).', { km: roadKm({ lat: 25.5941, lng: 85.1376 }, d) })}</p></div></li>
              </ul>
              <div className="mt-5 flex flex-wrap items-start gap-3">
                <a href={gmapsDir('Patna', `${d.lat},${d.lng}`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{tx("Directions from Patna")}</a>
                <Link to="/how-to-reach" className="btn btn-outline">{tx("Transport hub")}</Link>
                <ExtLink href={LINKS.irctc.url} className="btn btn-primary">{tx("IRCTC trains")}</ExtLink>
              </div>
            </div>
            <Map lat={d.lat} lng={d.lng} title={`${d.name} map`} className="h-80" />
          </div>
        )}
        {tab === 'Timings' && <HoursTable id={d.id} />}
        {tab === 'Travel tips' && <ul className="list-disc space-y-2 ps-5 text-stone">{d.tips.map(x => <li key={x}>{tx(x)}</li>)}</ul>}
      </div>
    </section>
  )
}

export function DestinationPage() {
  const { id } = useParams()
  const d = id ? getDestination(id) : undefined
  if (!d) return <NotFound />
  const short = d.name.split(' (')[0]
  const base = d.nearby.length ? d.nearby.map(getDestination).filter((x): x is Destination => !!x) : destinations.filter(x => x.id !== d.id).sort((a, b) => roadKm(d, a) - roadKm(d, b))
  const near = base.slice(0, 3).map(x => ({ x, km: roadKm(d, x) }))
  const links = [['overview', 'Overview'], ['facts', 'Visitor info'], ['gallery', 'Gallery'], ['explore', 'Attractions and more'], ['map', 'Map'], ['plan', 'Plan your visit'], ['nearby', 'Nearby']]
  return (
    <>
      <PageHero title={short} tagline={d.tagline} photoQuery={photoQueryFor(d.id)} hue={d.hue}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Explore Bihar', to: '/explore' }, { label: short }]}>
        <AddToTrip id={d.id} />
      </PageHero>
      <nav aria-label={tx("On this page")} className="sticky top-[57px] z-30 border-b border-cream bg-ivory/95 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {links.map(([a, label]) => <a key={a} href={`#${a}`} className="shrink-0 px-4 py-3 text-sm font-semibold hover:text-terracotta">{tx(label)}</a>)}
        </div>
      </nav>
      <div className="section space-y-14">
        <section id="overview" className="scroll-mt-28 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">01</span>{tx('{{name}} overview', { name: tx(short) })}</h2>
            <div className="mb-4 mt-2 h-1 w-14 rounded bg-gold" />
            <p className="text-lg text-stone">{tx(d.overview)}</p>
            <p className="mt-4 text-stone">{tx(d.significance)}</p>
          </div>
          <dl className="h-fit space-y-3 rounded-2xl bg-cream/70 p-5 text-sm">
            <div className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-terracotta" /><div><dt className="font-bold">{tx("Location")}</dt><dd className="text-stone">{tx('{{place}} district, Bihar', { place: tx(d.district) })}</dd></div></div>
            <div className="flex gap-2"><Calendar size={16} className="mt-0.5 shrink-0 text-terracotta" /><div><dt className="font-bold">{tx("Best time to visit")}</dt><dd className="text-stone">{tx(d.bestTime)}</dd></div></div>
            <div className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-terracotta" /><div><dt className="font-bold">{tx("Suggested duration")}</dt><dd className="text-stone">{d.hours >= 24 ? tx('2 days or more') : txn(d.hours, 'About {{n}} hour', 'About {{n}} hours')}</dd></div></div>
          </dl>
        </section>

        <QuickFacts d={d} />

        <section id="gallery" className="scroll-mt-28">
          <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">03</span>{tx("Gallery")}</h2>
          <div className="mb-5 mt-2 h-1 w-14 rounded bg-gold" />
          <Gallery query={photoQueryFor(d.id)} label={d.name} hue={d.hue} />
        </section>

        <ExploreTabs d={d} />

        <AttractionMap d={d} />

        <section id="plan" className="scroll-mt-28 rounded-2xl bg-forest p-8 text-white">
          <h2 className="text-2xl font-bold uppercase">{tx('I wish to visit {{name}}', { name: tx(short) })}</h2>
          <p className="mt-2 max-w-2xl text-white/85">{tx("Add it to your trip, build a full itinerary, or pick a package that includes it.")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/plan-your-trip" className="btn !bg-gold !text-charcoal hover:!bg-white">{tx("Plan Your Trip")}</Link>
            <Link to="/packages" className="btn border border-white/70 text-white hover:bg-white/20">{tx("Tour Packages")}</Link>
            <Link to={`/pass/checkout?sites=${d.id}&days=1`} className="btn border border-white/70 text-white hover:bg-white/20">{tx("Get a package pass (demo)")}</Link>
          </div>
        </section>

        <section id="nearby" className="scroll-mt-28">
          <h2 className="text-3xl font-bold uppercase"><span className="me-3 text-terracotta">07</span>{tx('Places to visit near {{name}}', { name: tx(short) })}</h2>
          <div className="mb-5 mt-2 h-1 w-14 rounded bg-gold" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {near.map(({ x, km }) => (
              <Link key={x.id} to={`/explore/${x.id}`} className="card group block">
                <Visual id={x.id} hue={x.hue} label={x.name} photo={photoQueryFor(x.id)} className="h-48" />
                <div className="p-4"><h3 className="text-xl font-bold uppercase">{tx(x.name.split(' (')[0])}</h3><p className="mt-1 text-sm text-stone">{tx('About {{km}} kms, ~{{h}} h by road (estimate)', { km, h: roadHrs(km) })}</p></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
