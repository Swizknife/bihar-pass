import { useEffect, useState } from 'react'

export interface Photo { url: string; full: string; page: string; credit: string; license: string; title: string }

const QUERY: Record<string, string> = {
  'bodh-gaya': 'Mahabodhi Temple Bodh Gaya', gaya: 'Vishnupad Temple Gaya', rajgir: 'Rajgir Bihar', nalanda: 'Nalanda ruins Bihar',
  patna: 'Patna Bihar Golghar', vaishali: 'Vaishali Ashokan pillar', pawapuri: 'Pawapuri Jal Mandir', valmiki: 'Valmiki Tiger Reserve',
  vikramshila: 'Vikramshila Antichak', kesariya: 'Kesariya stupa', madhubani: 'Madhubani painting', sonepur: 'Sonepur Mela',
  kakolat: 'Kakolat waterfall', sasaram: 'Sher Shah Suri Tomb Sasaram', kanwar: 'Kabar Taal',
}
export const photoQueryFor = (id: string) => QUERY[id]

// dal-pitha is omitted on purpose: no relevant licensed photo was found, so it keeps the placeholder.
const FOOD_QUERY: Record<string, string> = {
  'litti-chokha': 'Litti Chokha', thekua: 'Thekua', khaja: 'Khaja Crispy Layered Sugar Syrup Pastry', 'silao-khaja': 'Khaja of Silao',
  malpua: 'Malpua', 'sattu-paratha': 'Sattu Paratha',
}
export const foodQueryFor = (id: string) => FOOD_QUERY[id]

const cache = new Map<string, Promise<Photo[]>>()
const strip = (h?: string) => (h ?? '').replace(/<[^>]*>/g, '').trim()

function load(q: string): Promise<Photo[]> {
  const hit = cache.get(q)
  if (hit) return hit
  const key = `photos:${q}`
  try { const s = sessionStorage.getItem(key); if (s) { const p = Promise.resolve(JSON.parse(s) as Photo[]); cache.set(q, p); return p } } catch { /* ignore */ }
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', origin: '*', generator: 'search', gsrnamespace: '6', gsrsearch: `${q} filetype:bitmap`, gsrlimit: '10',
    prop: 'imageinfo', iiprop: 'url|mime|extmetadata', iiurlwidth: '1000',
  })
  const p = fetch(url).then(r => r.json()).then(d => {
    const pages = Object.values(d?.query?.pages ?? {}) as { index?: number; title: string; imageinfo?: { thumburl?: string; url: string; mime: string; descriptionurl: string; extmetadata?: Record<string, { value: string }> }[] }[]
    const out: Photo[] = pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).flatMap(pg => {
      const i = pg.imageinfo?.[0]
      if (!i || i.mime !== 'image/jpeg') return []
      return [{ url: i.thumburl ?? i.url, full: i.thumburl ?? i.url, page: i.descriptionurl, title: pg.title.replace(/^File:/, '').replace(/\.\w+$/, ''), credit: strip(i.extmetadata?.Artist?.value) || 'Wikimedia Commons contributor', license: strip(i.extmetadata?.LicenseShortName?.value) }]
    }).slice(0, 8)
    try { sessionStorage.setItem(key, JSON.stringify(out)) } catch { /* ignore */ }
    return out
  }).catch(() => [] as Photo[])
  cache.set(q, p)
  return p
}

export function usePhotos(query?: string): Photo[] {
  const [photos, setPhotos] = useState<Photo[]>([])
  useEffect(() => {
    let live = true
    if (query) load(query).then(p => { if (live) setPhotos(p) })
    return () => { live = false }
  }, [query])
  return photos
}
