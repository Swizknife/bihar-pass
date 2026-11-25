import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plane, Train, Bus, Sparkles } from 'lucide-react'
import { destinations } from '../data/destinations'
import { culture, foods, seasons } from '../data/misc'
import type { Category } from '../types'
import { SectionTitle, Visual } from '../components/ui'
import { TopDestinations } from '../components/TopDestinations'
import { DiscoverBihar } from '../components/DiscoverBihar'
import { QueryFeedback } from '../components/QueryFeedback'
import { Lightbox } from '../components/Gallery'
import { foodQueryFor, usePhotos } from '../lib/photos'
import type { FoodItem } from '../types'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'


export default function HomePage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="relative isolate overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0 -z-10 opacity-90" style={{ background: 'radial-gradient(circle at 20% 20%, #b8532f 0%, transparent 55%), radial-gradient(circle at 85% 70%, #2b4a2f 0%, transparent 60%), #2a2622' }} />
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" onError={e => (e.currentTarget.style.display = 'none')} />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Bihar-Pass</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">{t('hero.sub')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/explore" className="btn btn-primary">{t('hero.explore')}</Link>
            <Link to="/plan-your-trip" className="btn btn-light">{t('hero.plan')}</Link>
            <Link to="/ai-trip" className="btn border border-gold text-gold hover:bg-gold hover:text-charcoal"><Sparkles size={16} />{t('hero.ai')}</Link>
          </div>
        </div>
      </section>

      <DiscoverBihar />

      <TopDestinations />

      <section id="food" className="section">
        <SectionTitle title={t('sec.food')} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {foods.map(fd => <FoodCard key={fd.id} fd={fd} />)}
        </div>
      </section>

      <section className="bg-forest text-white"><div className="section">
        <h2 className="text-3xl font-bold">{t('sec.culture')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {culture.map(c => <div key={c.title} className="rounded-2xl border border-white/15 bg-white/5 p-5"><h3 className="text-xl font-bold text-gold">{tx(c.title)}</h3><p className="mt-2 text-sm text-white/85">{tx(c.text)}</p></div>)}
        </div>
        <Link to="/about" className="btn btn-light mt-6">{t('nav.about')}</Link>
      </div></section>

      <section className="section">
        <SectionTitle title={t('sec.reach')} action={<Link to="/how-to-reach" className="btn btn-outline">{t('nav.reach')}</Link>} />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { i: <Plane />, h: 'By Air', p: 'Jay Prakash Narayan International Airport (Patna), Gaya International Airport and Darbhanga Airport.' },
            { i: <Train />, h: 'By Train', p: 'Patna Junction, Gaya Junction, Rajgir, Muzaffarpur and other stations on the main rail network.' },
            { i: <Bus />, h: 'By Road', p: 'National highways such as NH 19 link Patna, Gaya and Sasaram; BSRTC and private buses connect towns.' },
          ].map(x => <div key={x.h} className="card !translate-y-0 p-5"><div className="text-terracotta">{x.i}</div><h3 className="mt-2 text-xl font-bold">{tx(x.h)}</h3><p className="mt-1 text-sm text-stone">{tx(x.p)}</p></div>)}
        </div>
      </section>

      <section id="best-time" className="bg-cream/50"><div className="section">
        <SectionTitle title={t('sec.best')} sub="Seasons suit different places. Check each destination page for specific advice." />
        <div className="grid gap-5 md:grid-cols-2">
          {seasons.map(s => (
            <div key={s.name} className="card !translate-y-0 p-5">
              <h3 className="text-xl font-bold text-terracotta">{tx(s.name)}</h3>
              <p className="mt-1 text-sm text-stone">{tx(s.weather)}</p>
              <p className="mt-2 text-sm"><strong>{tx("Good for:")}</strong> {s.picks.map(p => tx(p)).join(', ')}</p>
              <p className="mt-1 text-sm"><strong>{tx("Events:")}</strong> {tx(s.events)}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section id="queries-feedback"><QueryFeedback /></section>
    </>
  )
}

function FoodCard({ fd }: { fd: FoodItem }) {
  const photos = usePhotos(foodQueryFor(fd.id))
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const has = photos.length > 0
  return (
    <article className="card">
      <button disabled={!has} onClick={() => { setI(0); setOpen(true) }} aria-label={has ? `View photos of ${fd.name}` : fd.name} className="group relative block h-40 w-full overflow-hidden text-start enabled:cursor-zoom-in">
        {has
          ? <img src={photos[0].url} alt={`${fd.name}: ${photos[0].title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          : <Visual id={`food-${fd.id}`} hue={fd.hue} label={fd.name} className="h-40" />}
        {has && <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100">{txn(photos.length, '{{n}} photo · click', '{{n}} photos · click')}</span>}
      </button>
      <div className="p-4"><h3 className="text-lg font-bold">{tx(fd.name)}</h3><p className="mt-1 text-sm text-stone">{tx(fd.description)}</p><p className="mt-2 text-xs text-forest">{tx(fd.significance)}</p></div>
      {open && has && <Lightbox photos={photos} index={i} setIndex={setI} onClose={() => setOpen(false)} />}
    </article>
  )
}
