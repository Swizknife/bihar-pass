import { Link } from 'react-router-dom'
import { CalendarCheck, CreditCard, MapPin, Plane, QrCode, TriangleAlert } from 'lucide-react'
import { ExtLink } from '../components/ui'
import { LINKS } from '../lib/constants'
import { photoQueryFor } from '../lib/photos'
import { CenterTitle, Tile } from './ExperiencePages'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

const SOURCE = 'https://patnapress.com/bihar-heli-tourism-scheme-launched-how-to-book-joy-ride-rajgir-valmikinagar-kaimur/'

const ROUTES = [
  { label: 'Patna Joy Ride', query: 'Patna Bihar Golghar', hue: 205, fare: 'Fare not listed here', dest: 'patna', text: 'A short scenic flight over Patna and the Ganga. Check the portal for flight length and timings.' },
  { label: 'Patna to Rajgir', query: photoQueryFor('rajgir'), hue: 120, fare: 'Rs 4,000 per passenger (reported)', dest: 'rajgir', text: 'Fly from Patna to the hills of Rajgir, home of the peace pagoda and hot springs.' },
  { label: 'Patna to Valmikinagar', query: photoQueryFor('valmiki'), hue: 135, fare: 'Rs 5,000 per passenger (reported)', dest: 'valmiki', text: 'Skip the long drive to Valmiki Tiger Reserve and reach tiger country by air.' },
  { label: 'Patna to Maa Mundeshwari Dham, Kaimur', query: 'Mundeshwari temple Kaimur', hue: 25, fare: 'Rs 6,000 per passenger (reported)', dest: undefined, text: 'A flight to the hill temple of Maa Mundeshwari in Kaimur district.' },
]

export function HelicopterPage() {
  return (
    <>
      <CenterTitle title={tx("Heli Yatra")} tagline="See Bihar from the sky" crumbs={[{ label: 'Home', to: '/' }, { label: 'Experience', to: '/experience' }, { label: 'Helicopter rides' }]} />

      <div className="section">
        <div role="note" className="mb-8 flex gap-3 rounded-xl border border-gold bg-gold/15 p-4 text-sm">
          <TriangleAlert className="mt-0.5 shrink-0 text-terracotta" size={18} />
          <p><strong>{tx("Booking happens on the official portal.")}</strong> {tx("This site does not sell helicopter tickets. Routes, fares, schedules and availability below are for planning only and can change, so confirm everything on the official HeliYatra portal before you travel.")}</p>
        </div>

        <h2 className="text-3xl font-bold uppercase">{tx("Helicopter rides in Bihar")}</h2>
        <div className="mt-2 h-1 w-14 rounded bg-gold" />
        <p className="mt-4 max-w-3xl text-lg text-stone">{tx("HeliYatra is the official helicopter joy-ride and air-tourism booking service of Bihar tourism. It offers scenic rides and flights that connect Patna with places that are slow to reach by road. A bird's-eye view of the Ganga plains, the Rajgir hills and the forests of the north-west is a different way to see the state.")}</p>
        <div className="mt-6"><ExtLink href={LINKS.heli.url} verified={LINKS.heli.verified}><Plane size={16} />{tx("Book on the official HeliYatra portal")}</ExtLink></div>
      </div>

      <div className="grid sm:grid-cols-2">
        {ROUTES.map(r => <Tile key={r.label} label={r.label} query={r.query} hue={r.hue} to={r.dest ? `/explore/${r.dest}` : undefined}>{tx(r.text)}</Tile>)}
      </div>

      <div className="section space-y-14">
        <section>
          <h2 className="text-3xl font-bold uppercase">{tx("Routes and reported fares")}</h2>
          <div className="mt-2 h-1 w-14 rounded bg-gold" />
          <p className="mt-3 text-sm text-stone">{tx("Fares come from a")} <a className="underline" href={SOURCE} target="_blank" rel="noopener noreferrer">{tx("news report on the launch of the scheme")}</a>{tx(", not from the portal, and may have changed. Treat them as a guide.")}</p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-cream bg-white">
            <table className="w-full min-w-[34rem] text-start text-sm">
              <thead className="bg-cream/60"><tr><th scope="col" className="px-4 py-3 text-start">{tx("Route")}</th><th scope="col" className="px-4 py-3 text-start">{tx("Fare")}</th><th scope="col" className="px-4 py-3 text-start">{tx("Nearby guide")}</th></tr></thead>
              <tbody>
                {ROUTES.map(r => (
                  <tr key={r.label} className="border-t border-cream">
                    <th scope="row" className="px-4 py-3 text-start font-semibold">{tx(r.label)}</th>
                    <td className="px-4 py-3 text-stone">{tx(r.fare)}</td>
                    <td className="px-4 py-3">{r.dest ? <Link to={`/explore/${r.dest}`} className="inline-flex items-center gap-1 text-forest underline"><MapPin size={13} />{tx("Explore")}</Link> : <span className="text-stone">{tx("No guide page yet")}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold uppercase">{tx("How booking works")}</h2>
          <div className="mt-2 h-1 w-14 rounded bg-gold" />
          <p className="mt-3 text-sm text-stone">{tx("As described by the portal. Steps may differ slightly, so follow the portal's own instructions.")}</p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [<CalendarCheck key="a" />, 'Choose your flight', 'Pick a route and date on the portal and see live seat availability.'],
              [<CreditCard key="b" />, 'Pay securely', 'Pay online through the portal. Never pay an individual or an unofficial site.'],
              [<QrCode key="c" />, 'Get your QR e-ticket', 'The portal issues an instant QR e-ticket for boarding.'],
              [<Plane key="d" />, 'Fly', 'Carry the photo ID used for booking and arrive at the helipad in good time.'],
            ].map(([icon, title, text], i) => (
              <li key={String(title)} className="rounded-2xl border border-cream bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">{icon}</span><span className="text-sm font-bold text-stone">{tx('Step {{n}}', { n: i + 1 })}</span></div>
                <h3 className="mt-3 text-lg font-bold">{tx(String(title))}</h3>
                <p className="mt-1 text-sm text-stone">{tx(String(text))}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-bold uppercase">{tx("Before you fly")}</h2>
          <div className="mt-2 h-1 w-14 rounded bg-gold" />
          <ul className="mt-4 list-disc space-y-2 ps-5 text-stone">
            <li>{tx("Helicopter flights depend on weather and visibility, so allow flexibility in your plans.")}</li>
            <li>{tx("Check the portal for baggage, passenger weight and age rules, which this site does not list.")}</li>
            <li>{tx("Confirm the current schedule and which routes are running. Services were reported to begin commercial operations in July 2026.")}</li>
            <li>{tx("Plan ground transport at both ends. See")} <Link to="/how-to-reach" className="underline">{tx("How to Reach")}</Link> {tx("for airports, stations and buses.")}</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-forest p-8 text-white">
          <h2 className="text-2xl font-bold uppercase">{tx("Ready to book?")}</h2>
          <p className="mt-2 max-w-2xl text-white/85">{tx("You will leave this website and go to the official Bihar tourism helicopter booking portal.")}</p>
          <div className="mt-5 flex flex-wrap items-start gap-3">
            <ExtLink href={LINKS.heli.url} className="btn !bg-gold !text-charcoal hover:!bg-white" verified={LINKS.heli.verified}><Plane size={16} />{tx("Open HeliYatra")}</ExtLink>
            <Link to="/packages" className="btn border border-white/70 text-white hover:bg-white/20">{tx("Combine with a package")}</Link>
          </div>
        </section>
      </div>
    </>
  )
}
