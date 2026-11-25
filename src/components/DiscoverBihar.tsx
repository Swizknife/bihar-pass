import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Camera } from 'lucide-react'
import { getDestination } from '../data/destinations'
import { photoQueryFor, usePhotos } from '../lib/photos'
import { Lightbox } from './Gallery'
import { SectionTitle, Visual } from './ui'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

interface Item { label: string; query: string; to: string; text: string }

const place = (id: string, label?: string, query?: string): Item => {
  const d = getDestination(id)!
  return { label: label ?? d.name.split(' (')[0], query: query ?? photoQueryFor(id), to: `/explore/${id}`, text: d.tagline }
}

const PANELS: { key: string; title: string; hue: number; more: string; items: Item[] }[] = [
  { key: 'hist', title: 'Historical Heritage', hue: 15, more: '/explore?cat=historical', items: ['nalanda', 'vikramshila', 'bodh-gaya', 'patna', 'sasaram'].map(id => place(id)) },
  { key: 'rel', title: 'Religious Tourism', hue: 38, more: '/explore?cat=religious', items: [place('bodh-gaya'), place('gaya'), place('patna', 'Takht Sri Patna Sahib', 'Takht Sri Patna Sahib'), place('rajgir'), place('pawapuri'), place('vaishali')] },
  { key: 'nat', title: 'Natural Tourism', hue: 130, more: '/explore?cat=natural', items: ['valmiki', 'rajgir', 'kanwar', 'kakolat'].map(id => place(id)) },
  {
    key: 'cul', title: 'Cultural Tourism', hue: 330, more: '/explore?cat=cultural', items: [
      { label: 'Madhubani Painting', query: 'Madhubani painting', to: '/explore/madhubani', text: 'Mithila art in bold lines and natural colours, traditionally painted by women on walls and now on paper and cloth.' },
      { label: 'Chhath Puja', query: 'Chhath Puja', to: '/experience/festivals', text: 'A major Bihar festival of prayers to the Sun at river ghats at sunrise and sunset.' },
      { label: 'Sonepur Mela', query: 'Sonepur Mela', to: '/explore/sonepur', text: 'A traditional fair at the Ganga-Gandak confluence around Kartik Purnima.' },
      { label: 'Folk Dance', query: 'Bihar folk dance', to: '/about', text: 'Folk dances such as Jat-Jatin and Jhumar, performed at festivals and celebrations.' },
      { label: 'Sikki Grass Craft', query: 'Sikki grass craft', to: '/about', text: 'Baskets and figures woven from golden sikki grass, a traditional craft of Mithila.' },
      { label: 'Manjusha Art', query: 'Manjusha art', to: '/about', text: 'A folk art of the Bhagalpur region, known for snake motifs painted on boxes and pots.' },
      { label: 'Tikuli Art', query: 'Tikuli art', to: '/about', text: 'Decorative painted art with roots in Patna.' },
    ],
  },
]

function Panel({ p }: { p: (typeof PANELS)[number] }) {
  const { t } = useTranslation()
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const item = p.items[i]
  const photos = usePhotos(item.query)
  const main = photos[0]
  return (
    <article className="group relative flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-3xl text-white shadow-md" style={{ background: `linear-gradient(135deg, hsl(${p.hue} 55% 40%), hsl(${(p.hue + 30) % 360} 50% 18%))` }}>
      {main && <img key={main.url} src={main.url} alt={`${item.label}: ${main.title}`} loading="lazy" className="absolute inset-0 -z-0 h-full w-full animate-[fadein_.5s_ease] object-cover transition duration-1000 group-hover:scale-105" />}
      {!main && <Visual id={`cat-${p.key}`} hue={p.hue} className="absolute inset-0" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

      <div className="relative flex items-start justify-between gap-3 p-5">
        <h3 className="text-2xl font-bold sm:text-3xl">{tx(p.title)}</h3>
        {photos.length > 0 && <button onClick={() => setOpen(true)} aria-label={`Enlarge photos of ${item.label}`} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs backdrop-blur transition hover:bg-black/70"><Camera size={13} />{photos.length}</button>}
      </div>

      <div className="relative space-y-3 p-5">
        <div aria-live="polite">
          <p className="text-lg font-semibold">{tx(item.label)}</p>
          <p className="line-clamp-2 text-sm text-white/85">{tx(item.text)}</p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label={`${p.title} highlights`}>
          {p.items.map((it, k) => (
            <li key={it.label}>
              <button onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} aria-pressed={k === i}
                className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur transition ${k === i ? 'border-gold bg-gold text-charcoal' : 'border-white/50 bg-white/10 hover:bg-white/25'}`}>{tx(it.label)}</button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to={item.to} className="btn btn-primary !px-4 !py-2 text-xs">{tx('Open {{place}}', { place: tx(item.label) })}<ArrowRight size={13} /></Link>
          <Link to={p.more} className="btn btn-light !px-4 !py-2 text-xs">{t('sec.more')}</Link>
        </div>
        {main && <p className="text-[10px] text-white/60">{tx('Photo: {{credit}}, {{license}}, Wikimedia Commons', { credit: main.credit, license: main.license })}</p>}
      </div>
      {open && photos.length > 0 && <Lightbox photos={photos} index={0} setIndex={() => {}} onClose={() => setOpen(false)} />}
    </article>
  )
}

export function DiscoverBihar() {
  const { t } = useTranslation()
  return (
    <section className="section">
      <SectionTitle title={t('sec.discover')} sub="Hover over, or tap, a name to see it. Each panel changes its picture and story as you explore." />
      <div className="grid gap-6 md:grid-cols-2">{PANELS.map(p => <Panel key={p.key} p={p} />)}</div>
    </section>
  )
}
