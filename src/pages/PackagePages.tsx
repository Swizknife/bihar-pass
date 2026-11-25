import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Check, QrCode, Sparkles, Ticket } from 'lucide-react'
import { getPasses, validity } from '../lib/pass'
import { DemoBanner } from './PassPages'
import { customPackage, packages } from '../data/packages'
import { destinations, getDestination } from '../data/destinations'
import type { TourPackage } from '../types'
import { SectionTitle, Visual, useTrip } from '../components/ui'
import { TripDetailsForm } from '../components/TripDetailsForm'
import { useTripDetails } from '../lib/tripDetails'
import { photoQueryFor } from '../lib/photos'
import { buildCombos } from '../lib/combos'
import { PACE } from '../lib/itinerary'
import { currentLang, tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'
import { AddToCart } from '../components/AddToCart'

const name = (id: string) => tx(getDestination(id)?.name.split(' (')[0] ?? id)

function PackageCard({ p, picked, targetDays }: { p: TourPackage; picked: string[]; targetDays: number | null }) {
  const { t } = useTranslation()
  const covered = picked.filter(id => p.destinations.includes(id))
  const missing = picked.filter(id => !p.destinations.includes(id))
  return (
    <article className="card flex flex-col">
      <Visual id={p.id} hue={p.hue} label={p.title} photo={photoQueryFor(p.destinations[0])} className="h-40 shrink-0" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1">
          {targetDays === p.days && <span className="rounded-full bg-forest px-2 py-0.5 text-xs font-semibold text-white">{tx('Matches your {{n}} days', { n: targetDays })}</span>}
          {picked.length > 0 && <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${covered.length === picked.length ? 'bg-terracotta text-white' : 'bg-gold/30 text-charcoal'}`}>{tx('Includes {{a}} of your {{b}} places', { a: covered.length, b: picked.length })}</span>}
        </div>
        <h3 className="mt-1 text-xl font-bold">{tx(p.title)}</h3>
        <p className="mt-1 text-sm text-forest">{txn(p.days, '{{n}} day', '{{n}} days')} · {txn(p.destinations.length, '{{n}} destination', '{{n}} destinations')}</p>
        <p className="mt-2 text-sm text-stone">{tx(p.summary)}</p>
        <ul className="mt-2 flex flex-wrap gap-1">
          {p.destinations.map(id => <li key={id} className={`rounded-full px-2 py-0.5 text-[11px] ${picked.includes(id) ? 'bg-terracotta/15 font-semibold text-terracotta' : 'bg-cream'}`}>{picked.includes(id) && <Check size={10} className="me-0.5 inline" />}{name(id)}</li>)}
        </ul>
        {missing.length > 0 && covered.length > 0 && <p className="mt-2 text-xs text-stone">{tx('Not included: {{list}}', { list: missing.map(name).join(', ') })}</p>}
        <p className="mt-2 inline-flex items-center gap-1 self-start rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest"><Ticket size={12} />{tx('Bihar Pass: {{n}} site entries on one QR', { n: p.destinations.length })}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Link to={`/packages/${p.id}`} className="btn btn-primary">{t('common.viewPackage')}<ArrowRight size={14} /></Link>
          <Link to={`/packages/${p.id}/book`} className="btn btn-outline">{tx("Customise and get pass")}</Link>
          <AddToCart title={p.title} sites={p.destinations} days={p.days} />
        </div>
      </div>
    </article>
  )
}

function PlacePicker({ picked, setPicked }: { picked: string[]; setPicked: (ids: string[]) => void }) {
  const toggle = (id: string) => setPicked(picked.includes(id) ? picked.filter(x => x !== id) : [...picked, id])
  return (
    <section aria-label={tx("Choose places")} className="mb-8 rounded-2xl border border-gold/50 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">{tx("Which places do you want to visit?")}</h2>
          <p className="text-sm text-stone">{tx("Pick as many as you like. We rank the packages by how many of your places they cover, and can build a custom one.")}</p>
        </div>
        {picked.length > 0 && <button onClick={() => setPicked([])} className="text-sm underline">{tx('Clear ({{n}})', { n: picked.length })}</button>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {destinations.map(d => <button key={d.id} type="button" aria-pressed={picked.includes(d.id)} onClick={() => toggle(d.id)} className={`chip ${picked.includes(d.id) ? 'chip-on' : 'hover:bg-cream'}`}>{d.name.split(' (')[0]}</button>)}
      </div>
    </section>
  )
}

function CustomCard({ picked, days }: { picked: string[]; days: number }) {
  const pkg = useMemo(() => customPackage(picked, days), [picked, days, currentLang()])
  return (
    <article className="mb-6 overflow-hidden rounded-2xl border-2 border-terracotta bg-white shadow">
      <div className="bg-terracotta px-5 py-3 text-white"><h3 className="flex items-center gap-2 text-lg font-bold"><Sparkles size={18} />{txn(picked.length, 'Build a custom package from your {{n}} place', 'Build a custom package from your {{n}} places')}</h3></div>
      <div className="grid gap-4 p-5 md:grid-cols-3">
        <ol className="space-y-1 text-sm md:col-span-2">
          {pkg.itinerary.map((d, i) => <li key={i} className="rounded-lg bg-ivory px-3 py-2"><strong>{tx('Day {{n}}', { n: i + 1 })}:</strong> {tx(d.title)}</li>)}
        </ol>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-stone">{tx('{{days}}, {{dest}}, with a Bihar Pass for each. Change the number of days above to re-plan.', { days: txn(pkg.days, '{{n}} day', '{{n}} days'), dest: txn(pkg.destinations.length, '{{n}} destination', '{{n}} destinations') })}</p>
          <Link to={`/packages/custom/book?sites=${pkg.destinations.join(',')}&days=${pkg.days}`} className="btn btn-primary">{tx("Customise and get pass")}</Link>
          <AddToCart title={pkg.title} sites={pkg.destinations} days={pkg.days} />
          <Link to="/plan-your-trip" className="btn btn-outline">{tx("Fine-tune sights in the planner")}</Link>
        </div>
      </div>
    </article>
  )
}

export function PackagesPage() {
  const { t } = useTranslation()
  const { ids, setAll } = useTrip()
  const { d } = useTripDetails()
  const picked = ids
  const groups = [...new Set(packages.map(p => p.days))].sort((a, b) => a - b)
  const targetDays = d.days
  const customDays = targetDays ?? Math.min(7, Math.max(1, picked.length))

  const ranked = useMemo(() => {
    if (!picked.length) return []
    return packages
      .map(p => ({ p, covered: picked.filter(id => p.destinations.includes(id)).length }))
      .filter(x => x.covered > 0)
      .sort((a, b) => b.covered - a.covered || Math.abs(a.p.days - (targetDays ?? a.p.days)) - Math.abs(b.p.days - (targetDays ?? b.p.days)) || a.p.destinations.length - b.p.destinations.length)
  }, [picked, targetDays])

  return (
    <div className="section">
      <SectionTitle title={t('nav.packages')} sub={`${packages.length} ready-made Bihar itineraries from 1 to 7 days, or build your own from the places you pick. Prices and availability are not shown; bookings happen on official portals.`} />
      <DemoBanner />
      <TripDetailsForm />
      <PlacePicker picked={picked} setPicked={setAll} />
      <HowItWorks />

      {picked.length > 0 && (
        <section aria-label={tx("Best matches")} className="mb-10">
          <CustomCard picked={picked} days={customDays} />
          <Combos picked={picked} />
          <h2 className="mb-4 text-2xl font-bold text-terracotta">{tx("Best matches for your places")}</h2>
          {ranked.length === 0 && <p className="text-stone">{tx("No ready-made package covers these places. Use the custom package above.")}</p>}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{ranked.slice(0, 6).map(({ p }) => <PackageCard key={p.id} p={p} picked={picked} targetDays={targetDays} />)}</div>
        </section>
      )}

      {targetDays && !groups.includes(targetDays) && <p className="mb-6 rounded-lg bg-gold/15 p-3 text-sm">{tx('No package is exactly {{n}} days. Pick the closest one and its days will be trimmed or extended to fit.', { n: targetDays })}</p>}
      <h2 className="mb-2 text-3xl font-bold uppercase">{tx("All packages")}</h2>
      {groups.map(n => (
        <div key={n} className="mb-10">
          <h3 className="mb-4 text-2xl font-bold text-terracotta">{tx('{{n}}-Day Packages', { n })}</h3>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.filter(p => p.days === n).map(p => <PackageCard key={p.id} p={p} picked={picked} targetDays={targetDays} />)}
          </div>
        </div>
      ))}
      <MyPasses />
    </div>
  )
}

function HowItWorks() {
  const steps = [
    ['Tell us your trip', 'Starting point, group size, dates and days.'],
    ['Pick your places', 'Choose what you want to see, or take a ready-made package.'],
    ['Customise', 'See photos and maps, and choose your activities.'],
    ['Get your Bihar Pass', 'Pay once and receive one QR code covering every site in the package.'],
  ]
  return (
    <section aria-label={tx("How the Bihar Pass works")} className="mb-10 rounded-2xl bg-forest p-6 text-white">
      <h2 className="text-xl font-bold">{tx("Every package comes with a Bihar Pass")}</h2>
      <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold font-bold text-charcoal">{i + 1}</span>
            <div><h3 className="font-semibold">{tx(t)}</h3><p className="text-sm text-white/80">{tx(d)}</p></div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function MyPasses() {
  const passes = getPasses()
  return (
    <section id="my-passes" className="mt-4 scroll-mt-28 rounded-2xl border border-cream bg-white p-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold"><QrCode /> {tx("My passes")}</h2>
      {!passes.length && <p className="mt-2 text-stone">{tx("You have no passes on this device yet. Choose a package above to get one.")}</p>}
      <ul className="mt-3 space-y-2">
        {passes.map(p => (
          <li key={p.code}>
            <Link to={`/pass/${p.code}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-ivory p-3 hover:bg-cream">
              <span><strong>{tx(p.title)}</strong> <span className="text-sm text-stone">· {p.code}</span></span>
              <span className="text-sm font-semibold text-forest">{validity(p) === 'valid' ? tx('Valid now') : validity(p) === 'upcoming' ? tx('Upcoming') : tx('Expired')}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm"><Link to="/verify" className="underline">{tx("Staff: verify a pass")}</Link></p>
    </section>
  )
}

function Combos({ picked }: { picked: string[] }) {
  const combos = useMemo(() => buildCombos(picked), [picked, currentLang()])
  if (combos.length < 2) return null
  return (
    <section aria-label={tx('More combinations from your places')} className="mb-8">
      <h2 className="text-2xl font-bold text-terracotta">{tx('More combinations from your places')}</h2>
      <p className="mt-1 text-sm text-stone">{tx('The same places at different paces, and your places plus a nearby destination. Each comes with a Bihar Pass.')}</p>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {combos.map(c => (
          <article key={c.key} className="flex flex-col rounded-2xl border border-cream bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">{c.kind === 'pace' ? tx('Same places, {{pace}} pace', { pace: tx(PACE[c.pace].label).toLowerCase() }) : tx('Your places plus {{place}}', { place: name(c.extra ?? '') })}</p>
            <h3 className="mt-1 text-xl font-bold">{txn(c.days, '{{n}} day', '{{n}} days')} · {txn(c.pkg.destinations.length, '{{n}} destination', '{{n}} destinations')}</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {c.pkg.itinerary.slice(0, 4).map((d, i) => <li key={i} className="rounded-lg bg-ivory px-3 py-1.5"><strong>{tx('Day {{n}}', { n: i + 1 })}:</strong> {tx(d.title)}</li>)}
              {c.pkg.itinerary.length > 4 && <li className="px-1 text-xs text-stone">{tx('+{{n}} more', { n: c.pkg.itinerary.length - 4 })}</li>}
            </ul>
            <p className="mt-3 text-xs text-stone">{tx(PACE[c.pace].blurb)}</p>
            <Link to={`/packages/custom/book?sites=${c.pkg.destinations.join(',')}&days=${c.days}&pace=${c.pace}`} className="btn btn-primary mt-auto self-start !mt-4">{tx('Customise and get pass')}</Link>
            <AddToCart title={c.kind === 'pace' ? tx('Your places, {{pace}} pace', { pace: tx(PACE[c.pace].label).toLowerCase() }) : tx('Your places plus {{place}}', { place: name(c.extra ?? '') })} sites={c.pkg.destinations} days={c.days} className="btn btn-outline mt-2 self-start" />
          </article>
        ))}
      </div>
    </section>
  )
}
