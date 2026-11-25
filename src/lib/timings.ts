import { hours } from '../data/hours'
import { tx } from '../i18n/tx'

export function timingSummary(id: string): string {
  const list = hours[id]
  if (!list) return tx('Not verified, please confirm locally')
  return list.map(h => {
    const same = h.days.every(x => x === h.days[0])
    const t = same ? tx('{{t}} daily', { t: tx(h.days[0]) }) : tx('varies by weekday')
    return `${list.length > 1 ? `${tx(h.place)}: ` : ''}${t}${h.status === 'reported' ? ` ${tx('(reported)')}` : ''}`
  }).join('; ')
}

export function feeSummary(id: string): string {
  const list = hours[id]
  const fees = list?.map(h => h.fee).filter((f): f is string => !!f)
  return fees?.length ? fees.map(f => tx(f)).join('; ') : tx('Not verified, please confirm locally')
}
