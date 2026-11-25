import { Minus, Plus } from 'lucide-react'
import { ORIGINS, useTripDetails } from '../lib/tripDetails'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <span className="block text-sm font-semibold">{label}</span>
      <div className="mt-1 inline-flex items-center rounded-full border border-gold/60 bg-white">
        <button type="button" aria-label={`Fewer ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="rounded-full p-2 hover:bg-cream disabled:opacity-30"><Minus size={14} /></button>
        <span className="w-8 text-center font-semibold" aria-live="polite">{value}</span>
        <button type="button" aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="rounded-full p-2 hover:bg-cream disabled:opacity-30"><Plus size={14} /></button>
      </div>
    </div>
  )
}

export function TripDetailsForm({ title = 'Tell us about your trip' }: { title?: string }) {
  const { d, set } = useTripDetails()
  const today = new Date().toISOString().slice(0, 10)
  const input = 'mt-1 w-full rounded-lg border border-gold/60 bg-white px-3 py-2 font-normal'
  return (
    <section aria-label={title} className="mb-8 rounded-2xl border border-gold/50 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{tx(title)}</h2>
      <p className="text-sm text-stone">{tx("We use this to fit packages to your dates and group. It stays in your browser.")}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-sm font-semibold lg:col-span-2">{tx("Starting point")}
          <input list="origins" value={d.origin} onChange={e => set({ origin: e.target.value })} placeholder={tx("City, station or airport")} className={input} />
          <datalist id="origins">{ORIGINS.map(o => <option key={o} value={o} />)}</datalist>
        </label>
        <label className="block text-sm font-semibold">{tx("Start date")}
          <input type="date" min={today} value={d.startDate} onChange={e => set({ startDate: e.target.value })} className={input} />
        </label>
        <label className="block text-sm font-semibold">{tx("Total days")}
          <input type="number" min={1} max={14} value={d.days ?? ''} placeholder="e.g. 3" onChange={e => set({ days: e.target.value ? Math.min(14, Math.max(1, +e.target.value)) : null })} className={input} />
        </label>
        <div className="flex gap-4">
          <Counter label={tx("Adults")} value={d.adults} min={1} max={20} onChange={n => set({ adults: n })} />
          <Counter label={tx("Children")} value={d.children} min={0} max={20} onChange={n => set({ children: n })} />
        </div>
      </div>
    </section>
  )
}
