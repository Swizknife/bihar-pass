import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { usePhotos } from '../lib/photos'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export function PageHero({ title, tagline, crumbs, photoQuery, hue, children }: {
  title: string; tagline?: string; crumbs: { label: string; to?: string }[]; photoQuery?: string; hue: number; children?: ReactNode
}) {
  const photos = usePhotos(photoQuery)
  const p = photos[0]
  return (
    <header className="relative isolate overflow-hidden text-white" style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 38%), hsl(${(hue + 30) % 360} 50% 16%))` }}>
      {p && <img src={p.url} alt={p.title} className="absolute inset-0 -z-10 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
      <div className="mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:min-h-[26rem] sm:px-6 lg:px-8">
        <nav aria-label={tx("Breadcrumb")} className="mb-3 flex flex-wrap items-center gap-1 text-sm text-white/80">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} aria-hidden />}
              {c.to ? <Link to={c.to} className="hover:underline">{tx(c.label)}</Link> : <span aria-current="page">{tx(c.label)}</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-4xl font-bold uppercase tracking-wide sm:text-6xl">{tx(title)}</h1>
        {tagline && <p className="mt-2 text-lg uppercase tracking-widest text-gold sm:text-xl">{tx(tagline)}</p>}
        {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
        {p && <p className="mt-4 text-xs text-white/60">{tx('Photo: {{credit}}, {{license}}, Wikimedia Commons', { credit: p.credit, license: p.license })}</p>}
      </div>
    </header>
  )
}
