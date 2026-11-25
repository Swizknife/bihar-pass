import type { Category, TripPrefs } from '../types'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, ek: 1, do: 2, teen: 3, char: 4, paanch: 5, saat: 7, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'सात': 7 }

const INTERESTS: [Category, RegExp][] = [
  ['religious', /buddh|pilgrim|spiritual|temple|relig|jain|sikh|pind|bodh|धार्मिक|बौद्ध|तीर्थ/i],
  ['historical', /histor|heritage|monument|ruin|ancient|museum|ऐतिहासिक|विरासत/i],
  ['natural', /nature|waterfall|lake|hill|scenic|प्रकृति/i],
  ['wildlife', /wildlife|tiger|safari|bird|जंगल|वन्य/i],
  ['cultural', /cultur|art|craft|madhubani|festival|food|local|folk|सांस्कृतिक|कला/i],
]

export function parseTripRequest(text: string): { prefs: TripPrefs; understood: string[] } {
  const t = text.toLowerCase()
  const understood: string[] = []
  let days = 3
  const m = t.match(/(\d+)\s*(?:-)?\s*(?:day|days|din|दिन)/) || t.match(/\b(one|two|three|four|five|six|seven|ek|do|teen|char|paanch|saat)\s+(?:day|days|din)/)
    || t.match(/(एक|दो|तीन|चार|पांच|सात)\s*दिन/)
  if (m) days = Math.min(14, Math.max(1, WORDS[m[1]] ?? parseInt(m[1], 10)))
  understood.push(txn(days, '{{n}} day', '{{n}} days'))
  const interests = INTERESTS.filter(([, re]) => re.test(text)).map(([c]) => c)
  if (interests.length) understood.push(tx('interests: {{list}}', { list: interests.map(i => tx(i)).join(', ') }))
  let pace: TripPrefs['pace'] = 'moderate'
  if (/comfort|relax|family|families|kids|child|elder|senior|slow|easy|parents|आराम|परिवार/.test(t)) pace = 'relaxed'
  else if (/packed|fast|maximum|everything|busy|adventur/.test(t)) pace = 'packed'
  understood.push(tx('pace: {{p}}', { p: tx(pace) }))
  if (/family|families|kids|child|elder|senior|परिवार/.test(t)) understood.push(tx('travelling with family (comfortable pace chosen)'))
  return {
    prefs: { startDate: '', days, destinationIds: [], interests: interests.length ? interests : ['historical', 'religious'], pace },
    understood,
  }
}
