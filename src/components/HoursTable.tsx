import { CalendarClock } from 'lucide-react'
import { hours, NO_HOURS, WEEKDAYS } from '../data/hours'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export function HoursTable({ id }: { id: string }) {
  const list = hours[id]
  return (
    <section>
      <h2 className="flex items-center gap-2 text-2xl font-bold"><CalendarClock size={22} />{tx("Opening hours by weekday")}</h2>
      {!list && <p className="mt-2 rounded-xl bg-cream/70 p-4 text-sm text-stone">{tx(NO_HOURS)}</p>}
      {list?.map(h => (
        <div key={h.place} className="mt-3 overflow-hidden rounded-xl border border-cream bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-cream/60 px-4 py-2">
            <h3 className="font-semibold">{tx(h.place)}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${h.status === 'official' ? 'bg-forest text-white' : 'bg-gold/30 text-charcoal'}`}>
              {h.status === 'official' ? tx('Official listing') : tx('Reported, sources differ')}
            </span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {WEEKDAYS.map((w, i) => (
                <tr key={w} className="border-t border-cream">
                  <th scope="row" className="w-32 px-4 py-1.5 text-start font-medium">{tx(w)}</th>
                  <td className={`px-4 py-1.5 ${h.days[i] === 'Closed' ? 'font-semibold text-terracotta' : 'text-stone'}`}>{tx(h.days[i])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 pt-2 text-sm"><strong>{tx("Entry fee:")}</strong> {tx(h.fee ?? 'not verified, please confirm locally')}</p>
          {h.note && <p className="px-4 py-2 text-xs text-stone">{tx(h.note)}</p>}
          <p className="px-4 pb-3 text-xs text-stone">{tx("Source:")} <a className="underline" href={h.url} target="_blank" rel="noopener noreferrer">{tx(h.source)}</a>{tx(". Last checked 25 Nov 2026; hours can change, so confirm before visiting.")}</p>
        </div>
      ))}
    </section>
  )
}
