import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, MapPin } from 'lucide-react'
import { allFestivals } from '../data/festivals'
import { getDestination } from '../data/destinations'
import { foods } from '../data/misc'
import { Lightbox } from '../components/Gallery'
import { Visual } from '../components/ui'
import { usePhotos } from '../lib/photos'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

function Orn() { return <span aria-hidden className="text-2xl text-terracotta">✦</span> }

export function CenterTitle({ title, tagline, crumbs }: { title: string; tagline: string; crumbs: { label: string; to?: string }[] }) {
  return (
    <header className="bg-cream/50">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <nav aria-label={tx("Breadcrumb")} className="text-sm text-stone">
          {crumbs.map((c, i) => <span key={c.label}>{i > 0 && ' > '}{c.to ? <Link to={c.to} className="hover:underline">{tx(c.label)}</Link> : <span className="text-charcoal">{tx(c.label)}</span>}</span>)}
        </nav>
        <div className="mt-6 flex items-center justify-center gap-4 text-center">
          <Orn /><h1 className="text-4xl font-bold uppercase tracking-wide sm:text-6xl">{tx(title)}</h1><Orn />
        </div>
        <p className="mt-3 text-center text-lg uppercase tracking-widest text-stone">{tx(tagline)}</p>
      </div>
    </header>
  )
}

export function Tile({ label, query, hue, to, children }: { label: string; query?: string; hue: number; to?: string; children?: ReactNode }) {
  const photos = usePhotos(query)
  const [i, setI] = useState<number | null>(null)
  const body = (
    <>
      {photos[0]
        ? <img src={photos[0].url} alt={`${label}: ${photos[0].title}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        : <Visual id={`exp-${label}`} hue={hue} className="absolute inset-0" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute bottom-10 left-1/2 w-[85%] max-w-md -translate-x-1/2 rounded-[2rem] bg-ivory/95 px-6 py-4 text-center font-heading text-xl uppercase tracking-wide shadow-lg transition group-hover:-translate-y-1 sm:text-2xl">{tx(label)}</span>
      {children && <span className="absolute inset-x-6 top-6 translate-y-2 rounded-xl bg-black/60 p-4 text-sm text-white opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">{children}</span>}
    </>
  )
  const cls = 'group relative block h-[22rem] w-full overflow-hidden text-start sm:h-[26rem]'
  return (
    <>
      {to
        ? <Link to={to} className={cls}>{body}</Link>
        : <button onClick={() => photos.length && setI(0)} aria-label={`View photos: ${label}`} className={`${cls} ${photos.length ? 'cursor-zoom-in' : ''}`}>{body}</button>}
      {i !== null && <Lightbox photos={photos} index={i} setIndex={setI} onClose={() => setI(null)} />}
    </>
  )
}

export function ExperienceHub() {
  return (
    <>
      <CenterTitle title={tx("Experience Bihar")} tagline="Festivals, wild trails and local knowledge" crumbs={[{ label: 'Home', to: '/' }, { label: 'Experience' }]} />
      <div className="grid sm:grid-cols-2">
        <Tile label={tx("Fairs & Festivals")} query="Chhath Puja" hue={28} to="/experience/festivals" />
        <Tile label={tx("Adventures")} query="Valmiki Tiger Reserve safari" hue={135} to="/experience/adventures" />
        <Tile label={tx("Helicopter Rides")} query="Rajgir Bihar" hue={205} to="/experience/helicopter">{tx("See Bihar from the sky. Official HeliYatra booking.")}</Tile>
        <Tile label={tx("Food of Bihar")} query="Litti Chokha" hue={40} to="/#food" />
        <Tile label={tx("Knowledge Bank")} query="Nalanda ruins Bihar" hue={205} to="/experience/knowledge-bank" />
      </div>
    </>
  )
}

const ADVENTURES = [
  { label: 'Jungle Safari', query: 'Valmiki Tiger Reserve safari', hue: 135, dest: 'valmiki', text: 'Forest drives in Valmiki Tiger Reserve, Bihar\'s only tiger reserve. Best from November to March; book through official forest channels.' },
  { label: 'Rajgir Hills and Ropeway', query: 'Rajgir ropeway', hue: 120, dest: 'rajgir', text: 'Hill walks, a nature safari area and a ropeway towards the hilltop peace pagoda. Check operating days and status locally.' },
  { label: 'Birdwatching', query: 'Kabar Taal birds', hue: 160, dest: 'kanwar', text: 'Migratory and resident waterbirds at Kabar Taal, a large wetland. Winter mornings are best; bring binoculars.' },
  { label: 'Waterfall Trails', query: 'Kakolat waterfall', hue: 175, dest: 'kakolat', text: 'A hill waterfall near Nawada, at its best in the monsoon. The rocks are slippery, so take care near the pool.' },
  { label: 'River Dolphin Watching', query: 'Gangetic river dolphin', hue: 205, dest: undefined, text: 'The Vikramshila Gangetic Dolphin Sanctuary on the Ganga near Bhagalpur protects the Gangetic river dolphin. Boat trips are arranged locally; confirm operators and season before travelling.' },
]

export function AdventuresPage() {
  return (
    <>
      <CenterTitle title={tx("Adventures")} tagline="Wild trails and river journeys" crumbs={[{ label: 'Home', to: '/' }, { label: 'Experience', to: '/experience' }, { label: 'Adventures' }]} />
      <div className="grid sm:grid-cols-2">
        {ADVENTURES.map(a => <Tile key={a.label} label={a.label} query={a.query} hue={a.hue}>{tx(a.text)}</Tile>)}
      </div>
      <div className="section">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ADVENTURES.map(a => (
            <article key={a.label} className="card !translate-y-0 p-5">
              <h2 className="text-lg font-bold uppercase text-terracotta">{tx(a.label)}</h2>
              <p className="mt-1 text-sm text-stone">{tx(a.text)}</p>
              {a.dest && <Link to={`/explore/${a.dest}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-forest underline"><MapPin size={14} />{getDestination(a.dest)?.name}</Link>}
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-stone">{tx("Operators, prices, safety rules and seasons are not verified on this site. Please confirm with the relevant authority before booking.")}</p>
      </div>
    </>
  )
}

const FEST_PHOTO: Record<string, [string, number]> = {
  'Buddha Purnima': ['Buddha Purnima Bodh Gaya', 38], 'Pitru Paksha Mela': ['Pitru Paksha Gaya', 22], 'Chhath Puja': ['Chhath Puja', 28],
  'Guru Gobind Singh Jayanti': ['Takht Sri Patna Sahib', 205], 'Sonepur Mela': ['Sonepur Mela', 28], 'Rajgir Mahotsav': ['Rajgir Bihar', 120],
  'Vaishali Mahotsav': ['Vaishali Ashokan pillar', 70], 'Diwali at Jal Mandir': ['Pawapuri Jal Mandir', 190],
}

export function FestivalsPage() {
  return (
    <>
      <CenterTitle title={tx("Fairs & Festivals")} tagline="Celebrations of faith and culture" crumbs={[{ label: 'Home', to: '/' }, { label: 'Experience', to: '/experience' }, { label: 'Fairs & Festivals' }]} />
      <div className="section">
        <p className="mb-6 text-sm text-stone">{tx("Dates change every year. Confirm them on the official Bihar Tourism calendar before planning around a festival.")}</p>
        <div className="grid sm:grid-cols-2">
          {allFestivals.map(f => {
            const [q, hue] = FEST_PHOTO[f.name] ?? [f.name, 30]
            return <Tile key={f.name} label={f.name} query={q} hue={hue} to={`/explore/${f.id}`}>{tx(f.text)}</Tile>
          })}
        </div>
      </div>
    </>
  )
}

const FAQ: { q: string; a: ReactNode }[] = [
  { q: 'When is the best time to visit Bihar?', a: <>{tx("Most of Bihar is pleasant from October to March. It varies by place: wildlife at Valmiki is best from November to March, while Kakolat Waterfall is best in the monsoon. See")} <Link className="underline" to="/#best-time">{tx("Best Time to Visit")}</Link>.</> },
  { q: 'How do I reach Bihar?', a: <>{tx("Patna, Gaya and Darbhanga have airports, and major stations include Patna, Gaya and Muzaffarpur junctions. See")} <Link className="underline" to="/how-to-reach">{tx("How to Reach")}</Link>{tx("; tickets are booked on the official portals.")}</> },
  { q: 'What is E-Pinddaan?', a: <>{tx("It is the government's online service related to Pinddaan at Gaya. Read the")} <Link className="underline" to="/e-pinddaan">{tx("E-Pinddaan page")}</Link>.</> },
  { q: 'What should I wear at temples and monasteries?', a: 'Dress modestly, expect to remove footwear, and carry socks for hot or cold floors. Follow the instructions displayed at each site.' },
  { q: 'Can I take photos and phones inside?', a: 'Rules differ by site and can change. For example, some temples reportedly restrict phones and cameras inside. Check signs at the entrance.' },
  { q: 'Which languages are spoken?', a: 'Hindi and Urdu, alongside Maithili, Bhojpuri and Magahi. English is understood at major tourist sites.' },
  { q: 'What local foods should I try?', a: <>{foods.map(f => tx(f.name)).join(', ')}. {tx('See')} <Link className="underline" to="/#food">{tx("Food of Bihar")}</Link>.</> },
  { q: 'How accurate are the distances and times?', a: 'They are rough estimates (straight-line distance multiplied by 1.3, at about 40 km/h) and not live routing. Check a maps service before you travel.' },
  { q: 'Can I buy a Bihar Pass?', a: <>{tx("The Bihar Pass is a demonstration: no payment is taken and the pass is not accepted at sites.")} <Link className="underline" to="/packages">{tx("Tour Packages")}</Link>.</> },
]

export function KnowledgeBankPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <>
      <CenterTitle title={tx("Knowledge Bank")} tagline="Answers for the curious traveller" crumbs={[{ label: 'Home', to: '/' }, { label: 'Experience', to: '/experience' }, { label: 'Knowledge Bank' }]} />
      <div className="section max-w-3xl">
        <ul className="space-y-3">
          {FAQ.map((f, i) => (
            <li key={f.q} className="overflow-hidden rounded-xl border border-cream bg-white">
              <h2>
                <button aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start font-semibold hover:bg-cream/50">
                  {tx(f.q)}<ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
              </h2>
              {open === i && <div id={`faq-${i}`} className="px-5 pb-4 text-stone">{typeof f.a === 'string' ? tx(f.a) : f.a}</div>}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
