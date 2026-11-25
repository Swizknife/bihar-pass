import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bus, MapPinned, Plane, Train } from 'lucide-react'
import { airports, busTerminals, culture, highways, pinddaanSteps, stations } from '../data/misc'
import { destinations } from '../data/destinations'
import { ExtLink, Map, SectionTitle } from '../components/ui'
import { LINKS, gmapsDir } from '../lib/constants'
import { haversine, roadHrs, roadKm } from '../lib/geo'
import NotFound from './NotFound'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export function EPinddaanPage() {
  const { t } = useTranslation()
  const L = LINKS.epinddaan
  return (
    <div className="section max-w-4xl">
      <SectionTitle title={t('nav.pinddaan')} sub="Information about Pinddaan at Gaya and the government's online service." />
      <section className="space-y-3 text-stone">
        <h2 className="text-2xl font-bold text-charcoal">{tx("What is Pinddaan?")}</h2>
        <p>{tx("Pinddaan is a Hindu ritual in which offerings of rice balls (pinda), water and sesame are made to ancestors, in the belief that it brings peace to their souls.")}</p>
        <p>{tx("Gaya is regarded as the foremost place for this rite. The Vishnupad Temple and the Phalgu river are central to it, and the Pitru Paksha Mela draws pilgrims every year.")}</p>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">{tx("The online process")}</h2>
        <p className="mt-1 text-sm text-stone">{tx("This describes the general administrative steps. The online service handles registration and logistics only; the religious rituals are performed in person at Gaya. Exact steps are defined by the official portal, so follow it where it differs.")}</p>
        <ol className="mt-4 space-y-3">
          {pinddaanSteps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta font-bold text-white">{i + 1}</span>
              <div><h3 className="font-bold">{tx(s.title)}</h3><p className="text-sm text-stone">{tx(s.text)}</p></div>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-10 rounded-2xl bg-cream/70 p-6">
        <h2 className="text-2xl font-bold">{tx("Responsible organisation")}</h2>
        <p className="mt-2 text-sm text-stone">{tx("Details of the responsible department, its background, structure, term and support contacts have not been verified for this site, so none are shown. Please read them on the official portal.")}</p>
      </section>
      <section className="mt-10 rounded-2xl border-2 border-terracotta p-6">
        <h2 className="text-2xl font-bold">{tx("Official portal")}</h2>
        <p className="mt-2 text-sm text-stone">{t('common.leaving')}</p>
        <div className="mt-4"><ExtLink href={L.url} verified={L.verified}>{tx("Visit Official Bihar E-Pinddaan Portal")}</ExtLink></div>
      </section>
    </div>
  )
}

export function TransportPage() {
  const { t } = useTranslation()
  const [dest, setDest] = useState('bodh-gaya')
  const d = destinations.find(x => x.id === dest)!
  const nearest = <T extends { lat: number; lng: number }>(list: T[]) => list.map(x => ({ x, km: haversine(d, x) })).sort((a, b) => a.km - b.km)[0]
  const rail = nearest(stations), air = nearest(airports)
  const Card = ({ icon, title, children, action }: { icon: React.ReactNode; title: string; children: React.ReactNode; action: React.ReactNode }) => (
    <div className="card !translate-y-0 flex flex-col p-5">
      <div className="text-terracotta">{icon}</div>
      <h3 className="mt-2 text-xl font-bold">{title}</h3>
      <div className="mt-2 flex-1 text-sm text-stone">{children}</div>
      <div className="mt-4">{action}</div>
    </div>
  )
  return (
    <div className="section">
      <SectionTitle title={tx("Plan Your Journey to Bihar")} sub={t('nav.reach')} />
      <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
        <label className="text-sm font-semibold" htmlFor="d">{tx("Find the nearest station and airport to:")}</label>
        <select id="d" value={dest} onChange={e => setDest(e.target.value)} className="mt-2 block w-full rounded-lg border border-gold/60 px-3 py-2 sm:w-80">
          {destinations.map(x => <option key={x.id} value={x.id}>{tx(x.name)}</option>)}
        </select>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <p><Train size={14} className="inline" /> {tx('Nearest major station (straight line):')} <strong>{tx(rail.x.name)}</strong>{tx(', about {{km}} km (road ~{{rk}} km, ~{{h}} h)', { km: Math.round(rail.km), rk: roadKm(d, rail.x), h: roadHrs(roadKm(d, rail.x)) })}</p>
          <p><Plane size={14} className="inline" /> {tx('Nearest airport:')} <strong>{tx(air.x.name)}</strong>{tx(', about {{km}} km (road ~{{rk}} km, ~{{h}} h)', { km: Math.round(air.km), rk: roadKm(d, air.x), h: roadHrs(roadKm(d, air.x)) })}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="btn btn-outline" target="_blank" rel="noopener noreferrer" href={gmapsDir(rail.x.name + ', Bihar', `${d.lat},${d.lng}`)}><MapPinned size={14} />{tx("Directions from station")}</a>
          <a className="btn btn-outline" target="_blank" rel="noopener noreferrer" href={gmapsDir(air.x.name, `${d.lat},${d.lng}`)}><MapPinned size={14} />{tx("Directions from airport")}</a>
        </div>
        <Map lat={d.lat} lng={d.lng} title={`${d.name} map`} className="mt-4 h-64" />
        <p className="mt-2 text-xs text-stone">{tx("Distances are estimates, not schedules.")}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <Card icon={<Bus />} title={tx("By Bus")} action={<ExtLink href={LINKS.bsrtc.url} verified={LINKS.bsrtc.verified}>{tx("Book on BSRTC")}</ExtLink>}>
          <ul className="space-y-1">{busTerminals.map(b => <li key={b.name}><strong>{tx(b.name)}</strong>: {tx(b.note)}</li>)}</ul>
          <p className="mt-2">{tx('Highways:')} {highways.map(h => tx(h)).join('; ')}.</p>
        </Card>
        <Card icon={<Plane />} title={tx("By Flight")} action={<div className="flex flex-wrap gap-2">{LINKS.airlines.map(a => <ExtLink key={a.url} href={a.url} className="btn btn-outline">{tx(a.label)}</ExtLink>)}</div>}>
          <ul className="space-y-1">{airports.map(a => <li key={a.code}><strong>{tx(a.name)}</strong> ({a.code})</li>)}</ul>
          <p className="mt-2">{tx("Check which airlines currently serve each airport before booking.")}</p>
        </Card>
        <Card icon={<Train />} title={tx("By Train")} action={<ExtLink href={LINKS.irctc.url}>{tx("Book on IRCTC")}</ExtLink>}>
          <ul className="space-y-1">{stations.map(s => <li key={s.name}>{tx(s.name)}</li>)}</ul>
        </Card>
        <Card icon={<Plane />} title={tx("By Helicopter")} action={<ExtLink href={LINKS.heli.url} verified={LINKS.heli.verified}>{tx("Book on HeliYatra")}</ExtLink>}>
          <p>{tx("Official helicopter joy rides and air-tourism flights from Patna, including Rajgir, Valmikinagar and Kaimur routes.")}</p>
          <p className="mt-2"><Link to="/experience/helicopter" className="underline">{tx("Routes and how booking works")}</Link></p>
        </Card>
      </div>
      <p className="mt-6 text-sm text-stone">{tx("This site only links to booking portals; it does not sell tickets or show live availability.")}</p>
    </div>
  )
}

export function AboutPage() {
  const { t } = useTranslation()
  return (
    <div className="section max-w-4xl">
      <SectionTitle title={t('nav.about')} />
      <p className="text-stone">{tx("Bihar sits on the Gangetic plain in eastern India. It was the heart of ancient Magadha and the Mauryan capital Pataliputra, and the land where Buddhism and Jainism took shape. Today it blends living traditions, riverine landscapes and the Himalayan-foothill forests of the north-west.")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {culture.map(c => <div key={c.title} className="card !translate-y-0 p-5"><h3 className="text-xl font-bold text-terracotta">{tx(c.title)}</h3><p className="mt-1 text-sm text-stone">{tx(c.text)}</p></div>)}
      </div>
    </div>
  )
}

export function InfoPage() {
  const { topic } = useParams()
  const pages: Record<string, { title: string; body: string[] }> = {
    contact: { title: 'Contact', body: ['This is an independent informational guide, not an official government service.', 'For official enquiries, use the contact details published on the Bihar Tourism website.'] },
    accessibility: { title: 'Accessibility', body: ['This site uses semantic headings, keyboard-reachable controls, visible focus and text alternatives where images are used.', 'If you find a barrier, please report it to the site owner.'] },
    privacy: { title: 'Privacy policy', body: ['This site has no accounts. Saved trips, your language choice and "My Trip" selections stay in your own browser storage and are never sent to a server.', 'Embedded Google Maps may set cookies under Google\'s own policy.'] },
  }
  const p = topic ? pages[topic] : undefined
  if (!p) return <NotFound />
  return <div className="section max-w-3xl"><SectionTitle title={p.title} />{p.body.map(x => <p key={x} className="mb-3 text-stone">{tx(x)}</p>)}</div>
}
