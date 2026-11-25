import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { usePhotos, type Photo } from '../lib/photos'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export function Lightbox({ photos, index, setIndex, onClose }: { photos: Photo[]; index: number; setIndex: (i: number) => void; onClose: () => void }) {
  const n = photos.length
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((index + 1) % n)
      if (e.key === 'ArrowLeft') setIndex((index - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [index, n, onClose, setIndex])
  const cur = photos[index]
  return (
    <div role="dialog" aria-modal="true" aria-label={tx("Photo viewer")} className="fixed inset-0 z-[60] flex flex-col bg-black/90 p-4" onClick={onClose}>
      <button className="self-end text-white" aria-label={tx("Close")} onClick={onClose}><X size={28} /></button>
      <div className="relative flex flex-1 items-center justify-center" onClick={e => e.stopPropagation()}>
        {n > 1 && <button aria-label={tx("Previous photo")} className="absolute left-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40" onClick={() => setIndex((index - 1 + n) % n)}><ChevronLeft /></button>}
        <img src={cur.full} alt={cur.title} className="max-h-[75vh] max-w-full rounded-lg object-contain" />
        {n > 1 && <button aria-label={tx("Next photo")} className="absolute right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40" onClick={() => setIndex((index + 1) % n)}><ChevronRight /></button>}
      </div>
      <p className="mt-3 text-center text-sm text-white/90" onClick={e => e.stopPropagation()}>
        {index + 1} / {n} · {cur.title} · {tx('Photo: {{credit}}, {{license}}', { credit: cur.credit, license: cur.license })} · <a className="underline" href={cur.page} target="_blank" rel="noopener noreferrer">{tx("Source")}</a>
      </p>
      <div className="mt-2 flex justify-center gap-2" onClick={e => e.stopPropagation()}>
        {photos.map((p, i) => <button key={p.url} aria-label={`Photo ${i + 1}`} onClick={() => setIndex(i)} className={`h-12 w-16 overflow-hidden rounded ${i === index ? 'ring-2 ring-gold' : 'opacity-60'}`}><img src={p.url} alt="" className="h-full w-full object-cover" /></button>)}
      </div>
    </div>
  )
}

export function Gallery({ query, label, hue }: { query?: string; label: string; hue: number }) {
  const photos = usePhotos(query)
  const [open, setOpen] = useState<number | null>(null)
  if (!photos.length) {
    return <div className="flex h-56 items-center justify-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 30) % 360} 50% 20%))` }}>{tx('{{label}}: photos loading or unavailable offline', { label: tx(label) })}</div>
  }
  const grid = photos.slice(0, 5)
  return (
    <>
      <div className="grid h-72 grid-cols-4 grid-rows-2 gap-2 sm:h-96">
        {grid.map((p, i) => (
          <button key={p.url} onClick={() => setOpen(i)} aria-label={`Open photo: ${p.title}`}
            className={`group relative overflow-hidden rounded-xl bg-cream ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
            <img src={p.url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100"><ZoomIn className="text-white" /></span>
            {i === 4 && photos.length > 5 && <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-semibold text-white">{tx('+{{n}} more', { n: photos.length - 5 })}</span>}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-stone">{tx("Click any photo to enlarge. Photos from Wikimedia Commons; credits shown in the viewer.")}</p>
      {open !== null && <Lightbox photos={photos} index={open} setIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  )
}
