import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Clock, ExternalLink, MapPin, Plus, Check } from 'lucide-react'
import type { Destination } from '../types'
import { gmapsEmbed, LINKS } from '../lib/constants'
import { photoQueryFor, usePhotos } from '../lib/photos'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export function Visual({ id, hue, label, className = '', photo }: { id: string; hue: number; label?: string; className?: string; photo?: string }) {
  const [ok, setOk] = useState(true)
  const photos = usePhotos(!ok ? photo : undefined)
  const p = photos[0]
  return (
    <div className={`group relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 30) % 360} 50% 20%))` }}>
      {ok && <img src={`/images/${id}.jpg`} alt={label ?? ''} loading="lazy" onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
      {!ok && p && <img src={p.url} alt={label ?? p.title} loading="lazy" title={`Photo: ${p.credit}, ${p.license} (Wikimedia Commons)`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
      {!(ok || p) && label && <span className="absolute bottom-3 left-4 right-4 font-heading text-lg text-white/90 drop-shadow">{tx(label)}</span>}
    </div>
  )
}

export function ExtLink({ href, children, className = 'btn btn-primary', verified = true }: { href: string; children: ReactNode; className?: string; verified?: boolean }) {
  const { t } = useTranslation()
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}<ExternalLink size={14} aria-hidden /></a>
      {!verified && <span className="text-[11px] text-stone">{t('common.leaving')} {tx('Please confirm the address on the official site.')}</span>}
    </span>
  )
}
export const BookLink = ({ link, children }: { link: typeof LINKS.irctc; children?: ReactNode }) => (
  <ExtLink href={link.url} verified={link.verified}>{children ?? link.label}</ExtLink>
)

export function Map({ lat, lng, zoom = 11, title, className = 'h-72' }: { lat: number; lng: number; zoom?: number; title: string; className?: string }) {
  return <iframe title={title} src={gmapsEmbed(lat, lng, zoom)} loading="lazy" className={`w-full rounded-2xl border border-cream ${className}`} referrerPolicy="no-referrer-when-downgrade" />
}

export function SectionTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-3xl font-bold text-charcoal">{tx(title)}</h2>
        <div className="mt-2 h-1 w-14 rounded bg-gold" />
        {sub && <p className="mt-3 max-w-2xl text-stone">{tx(sub)}</p>}
      </div>
      {action}
    </div>
  )
}

interface TripCtx { ids: string[]; toggle: (id: string) => void; clear: () => void; setAll: (ids: string[]) => void }
const TripContext = createContext<TripCtx>({ ids: [], toggle: () => {}, clear: () => {}, setAll: () => {} })
export const useTrip = () => useContext(TripContext)
export function TripProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('myTrip') || '[]') } catch { return [] } })
  useEffect(() => { try { localStorage.setItem('myTrip', JSON.stringify(ids)) } catch { /* ignore */ } }, [ids])
  return <TripContext.Provider value={{ ids, toggle: id => setIds(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id])), clear: () => setIds([]), setAll: next => setIds(next) }}>{children}</TripContext.Provider>
}

export function AddToTrip({ id, small }: { id: string; small?: boolean }) {
  const { t } = useTranslation()
  const { ids, toggle } = useTrip()
  const on = ids.includes(id)
  return (
    <button onClick={() => toggle(id)} aria-pressed={on} className={`btn ${on ? 'btn-primary' : 'btn-outline'} ${small ? '!px-3 !py-1.5 text-xs' : ''}`}>
      {on ? <Check size={14} /> : <Plus size={14} />}{on ? t('common.added') : t('common.addTrip')}
    </button>
  )
}

export function DestCard({ d, className = '' }: { d: Destination; className?: string }) {
  const { t } = useTranslation()
  return (
    <article className={`card flex flex-col ${className}`}>
      <Visual id={d.id} hue={d.hue} label={d.name} photo={photoQueryFor(d.id)} className="h-44" />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-xl font-bold">{tx(d.name)}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-stone"><MapPin size={12} />{tx('{{place}}, Bihar', { place: tx(d.district) })}</p>
        <p className="mt-2 text-sm text-stone">{tx(d.tagline)}</p>
        <p className="mt-2 flex items-start gap-1 text-xs text-forest"><Clock size={12} className="mt-0.5 shrink-0" /><span>{t('common.bestTime')}: {d.bestTime.split(';')[0]}</span></p>
        <Link to={`/explore/${d.id}`} className="btn btn-outline mt-4 self-start">{t('sec.details')}<ArrowRight size={14} /></Link>
      </div>
    </article>
  )
}

export function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50)
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
