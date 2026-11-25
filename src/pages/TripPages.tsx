import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { destinations, getDestination } from '../data/destinations'
import { Counter } from '../components/TripDetailsForm'
import { useTripDetails } from '../lib/tripDetails'
import type { Category, Itinerary, TripPrefs } from '../types'
import { generateItinerary, PACE } from '../lib/itinerary'
import { parseTripRequest } from '../lib/aiTrip'
import { ItineraryView } from '../components/ItineraryView'
import { SectionTitle, useTrip } from '../components/ui'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

const INTERESTS: Category[] = ['historical', 'religious', 'cultural', 'natural', 'wildlife']

export function PlanTripPage() {
  const { t } = useTranslation()
  const { ids } = useTrip()
  const { d: td, set } = useTripDetails()
  const everything = (list: string[]) => Object.fromEntries(list.map(id => [id, [...(getDestination(id)?.attractions ?? [])]]))
  const [prefs, setPrefs] = useState<TripPrefs>({ startDate: td.startDate, days: td.days ?? 3, destinationIds: ids, interests: [], pace: 'moderate', picks: everything(ids) })
  const [it, setIt] = useState<Itinerary | null>(null)
  const [error, setError] = useState('')
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])

  const toggleDest = (id: string) => setPrefs(p => {
    const on = p.destinationIds.includes(id)
    const picks = { ...p.picks }
    if (on) delete picks[id]
    else picks[id] = [...(getDestination(id)?.attractions ?? [])]
    return { ...p, destinationIds: on ? p.destinationIds.filter(x => x !== id) : [...p.destinationIds, id], picks }
  })
  const togglePick = (id: string, a: string) => setPrefs(p => ({ ...p, picks: { ...p.picks, [id]: toggle(p.picks?.[id] ?? [], a) } }))
  const setPicks = (id: string, all: boolean) => setPrefs(p => ({ ...p, picks: { ...p.picks, [id]: all ? [...(getDestination(id)?.attractions ?? [])] : [] } }))

  const chosenSights = prefs.destinationIds.reduce((n, id) => n + (prefs.picks?.[id]?.length ?? 0), 0)
  const run = () => {
    if (!prefs.destinationIds.length && !prefs.interests.length) { setError('Choose at least one destination or interest.'); return }
    if (prefs.destinationIds.length && chosenSights === 0) { setError('Tick at least one sight in the places you chose.'); return }
    setError('')
    setIt(generateItinerary(prefs))
  }
  const input = 'mt-1 w-full rounded-lg border border-gold/60 px-3 py-2 font-normal'
  return (
    <div className="section">
      <SectionTitle title={tx("Build Your Own Bihar Experience")} sub="Choose dates, group, places, the sights you want in each place, and your pace. Places saved from other pages appear pre-selected." />
      <div className="no-print grid gap-6 rounded-2xl bg-white p-6 shadow-sm lg:grid-cols-2">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold">{tx("Start date")}
              <input type="date" value={prefs.startDate} onChange={e => { setPrefs({ ...prefs, startDate: e.target.value }); set({ startDate: e.target.value }) }} className={input} />
            </label>
            <label className="block text-sm font-semibold">{tx("Number of days")}
              <input type="number" min={1} max={14} value={prefs.days} onChange={e => { const n = Math.min(14, Math.max(1, +e.target.value || 1)); setPrefs({ ...prefs, days: n }); set({ days: n }) }} className={input} />
            </label>
          </div>
          <div className="flex flex-wrap gap-6">
            <Counter label={tx("Adults")} value={td.adults} min={1} max={20} onChange={n => set({ adults: n })} />
            <Counter label={tx("Children")} value={td.children} min={0} max={20} onChange={n => set({ children: n })} />
          </div>
          <fieldset><legend className="text-sm font-semibold">{tx("Travel interests (used when you pick no destinations)")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">{INTERESTS.map(i => <button key={i} type="button" aria-pressed={prefs.interests.includes(i)} onClick={() => setPrefs({ ...prefs, interests: toggle(prefs.interests, i) })} className={`chip capitalize ${prefs.interests.includes(i) ? 'chip-on' : 'hover:bg-cream'}`}>{i}</button>)}</div>
          </fieldset>
          <fieldset><legend className="text-sm font-semibold">{tx("Travel pace")}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(['relaxed', 'moderate', 'packed'] as const).map(p => (
                <button key={p} type="button" aria-pressed={prefs.pace === p} onClick={() => setPrefs({ ...prefs, pace: p })}
                  className={`rounded-xl border p-3 text-start transition ${prefs.pace === p ? 'border-forest bg-forest text-white' : 'border-gold/60 bg-white hover:bg-cream'}`}>
                  <span className="block font-bold">{tx(PACE[p].label)}</span>
                  <span className={`block text-xs ${prefs.pace === p ? 'text-white/85' : 'text-stone'}`}>{tx('{{n}} sights a day', { n: PACE[p].perDay })}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-stone">{tx(PACE[prefs.pace].blurb)}</p>
          </fieldset>
        </div>
        <fieldset><legend className="text-sm font-semibold">{tx("Destinations (optional; leave empty to pick by interest)")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">{destinations.map(d => <button key={d.id} type="button" aria-pressed={prefs.destinationIds.includes(d.id)} onClick={() => toggleDest(d.id)} className={`chip ${prefs.destinationIds.includes(d.id) ? 'chip-on' : 'hover:bg-cream'}`}>{tx(d.name)}</button>)}</div>
        </fieldset>

        {prefs.destinationIds.length > 0 && (
          <section className="lg:col-span-2" aria-label={tx("Choose sights")}>
            <h3 className="text-lg font-bold">{tx("Which sights do you want in each place?")}</h3>
            <p className="text-sm text-stone">{tx('{{a}} chosen. The days are planned from these, at your pace.', { a: txn(chosenSights, '{{n}} sight', '{{n}} sights') })}</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {prefs.destinationIds.map(id => {
                const d = getDestination(id)!
                const picked = prefs.picks?.[id] ?? []
                return (
                  <div key={id} className="rounded-xl border border-cream bg-ivory p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold">{tx(d.name)}</h4>
                      <span className="text-xs text-stone">{picked.length}/{d.attractions.length}</span>
                    </div>
                    <div className="mt-1 flex gap-3 text-xs">
                      <button type="button" onClick={() => setPicks(id, true)} className="underline">{tx("Select all")}</button>
                      <button type="button" onClick={() => setPicks(id, false)} className="underline">{tx("Clear")}</button>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {d.attractions.map(a => (
                        <li key={a}>
                          <label className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1 text-sm hover:bg-cream">
                            <input type="checkbox" checked={picked.includes(a)} onChange={() => togglePick(id, a)} className="mt-1 accent-[#2B4A2F]" />{tx(a)}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="lg:col-span-2">
          <button onClick={run} className="btn btn-primary">{tx("Generate itinerary")}</button>
          {error && <p role="alert" className="mt-2 text-sm text-terracotta">{tx(error)}</p>}
        </div>
      </div>
      {it && <ItineraryView it={it} onChange={setIt} onRegenerate={() => setIt(generateItinerary(it.prefs))} />}
    </div>
  )
}

const EXAMPLES = [
  'I have four days in Bihar. I am interested in Buddhist heritage, historical monuments and local food. I am travelling with my family and want a comfortable itinerary.',
  'Two days, spiritual places, solo traveller.',
  '5 days wildlife and nature, packed schedule.',
]

export function AiTripPage() {
  const [text, setText] = useState('')
  const [it, setIt] = useState<Itinerary | null>(null)
  const [seen, setSeen] = useState<string[]>([])
  const go = () => {
    if (!text.trim()) return
    const { prefs, understood } = parseTripRequest(text)
    setSeen(understood)
    setIt(generateItinerary(prefs))
  }
  return (
    <div className="section">
      <SectionTitle title={tx("Not Sure Where to Start? Let AI Plan Your Bihar Journey.")} sub="Describe your trip in your own words. The planner reads your duration, interests and pace and builds a route from the destination data on this site. It is rule-based, not a generative model, so it never invents places." />
      <div className="no-print rounded-2xl bg-white p-6 shadow-sm">
        <label htmlFor="req" className="text-sm font-semibold">{tx("Your trip")}</label>
        <textarea id="req" rows={4} value={text} onChange={e => setText(e.target.value)} className="mt-1 w-full rounded-lg border border-gold/60 p-3" placeholder={tx("e.g. 3 days, Buddhist heritage, with family")} />
        <div className="mt-2 flex flex-wrap gap-2">{EXAMPLES.map(x => <button key={x} onClick={() => setText(x)} className="chip hover:bg-cream">{x.length > 40 ? x.slice(0, 40) + '...' : x}</button>)}</div>
        <button onClick={go} disabled={!text.trim()} className="btn btn-primary mt-4 disabled:opacity-50"><Sparkles size={16} />{tx("Generate my trip")}</button>
      </div>
      {it && (
        <>
          <p className="mt-6 text-sm"><strong>{tx("What I understood:")}</strong> {seen.join(' · ')}</p>
          <ItineraryView it={it} onChange={setIt} onRegenerate={() => { const r = parseTripRequest(text); setIt(generateItinerary(r.prefs)) }} />
        </>
      )}
    </div>
  )
}
