import { destinations } from '../data/destinations'
import { foods } from '../data/misc'
import { packages } from '../data/packages'
import { tx, txn } from '../i18n/tx'

export interface BotReply { text: string; links: { to: string; label: string }[]; official: boolean }

const PAGES: [RegExp, string, string][] = [
  [/heli|helicopter|joy ?ride|air tourism|हेलीकॉप्टर/i, '/experience/helicopter', 'Helicopter rides (Heli Yatra)'],
  [/pind|पिंड/i, '/e-pinddaan', 'E-Pinddaan page'],
  [/bus|train|flight|airport|railway|reach|how to get|ticket|irctc|बस|ट्रेन|रेल|उड़ान/i, '/how-to-reach', 'How to Reach'],
  [/package|tour|पैकेज/i, '/packages', 'Tour Packages'],
  [/plan|itinerar|यात्रा योजना/i, '/plan-your-trip', 'Plan Your Trip'],
  [/ai trip|generate my trip|एआई/i, '/ai-trip', 'AI Trip Generator'],
]

const normalise = (s: string) => s.toLowerCase()
const short = (name: string) => name.split(' (')[0]

const ALIASES: Record<string, string[]> = {
  'bodh-gaya': ['bodh gaya', 'bodhgaya', 'mahabodhi', 'बोधगया'],
  gaya: ['gaya', 'vishnupad', 'गया'],
  rajgir: ['rajgir', 'राजगीर'],
  nalanda: ['nalanda', 'नालंदा'],
  patna: ['patna', 'पटना', 'golghar', 'patna sahib'],
  vaishali: ['vaishali', 'वैशाली'],
  valmiki: ['valmiki', 'tiger', 'वाल्मीकि'],
  madhubani: ['madhubani', 'मधुबनी'],
  sonepur: ['sonepur', 'सोनपुर'],
  pawapuri: ['pawapuri', 'पावापुरी'],
}

function findDest(q: string) {
  for (const d of destinations) {
    const names = [d.name.toLowerCase(), short(d.name).toLowerCase(), tx(d.name).toLowerCase(), tx(short(d.name)).toLowerCase(), ...(ALIASES[d.id] ?? [])]
    if (names.some(n => n.length > 1 && q.includes(n))) return d
  }
  return undefined
}

export function reply(input: string, last?: string): BotReply {
  const q = normalise(input)
  const d = findDest(q) ?? (last && /^(when|how|what|best|time|reach|where|कब|कैसे)/.test(q) ? destinations.find(x => x.id === last) : undefined)
  const links: BotReply['links'] = []

  if (/^(hi|hello|namaste|hey|नमस्ते|प्रणाम|salam)/.test(q)) {
    return { text: tx('Namaste! Ask me about Bihar\'s places, food, best time to visit, how to reach, or tour packages.'), links: [], official: false }
  }

  if (d) {
    const name = tx(d.name)
    links.push({ to: `/explore/${d.id}`, label: tx('{{name}} page', { name }) })
    if (/best time|when|season|कब|समय/.test(q)) {
      return { text: tx('Best time for {{name}}: {{t}}.', { name, t: tx(d.bestTime) }), links, official: false }
    }
    if (/reach|how to get|station|airport|कैसे|स्टेशन|पहुँच/.test(q)) {
      links.push({ to: '/how-to-reach', label: tx('How to Reach') })
      return { text: tx('Nearest railway: {{rail}}. Nearest airport: {{air}}. For tickets, use the official booking links on the How to Reach page.', { rail: tx(d.nearestRail), air: tx(d.nearestAirport) }), links, official: true }
    }
    if (/history|significance|important|about|why|इतिहास|महत्व/.test(q)) {
      return { text: `${tx(d.overview)} ${tx(d.significance)}`, links, official: false }
    }
    if (/one day|1 day|what can i|see|visit|explore|do in/.test(q)) {
      const plan = d.hours >= 24 ? tx('a couple of days') : txn(d.hours, '{{n}} hour', '{{n}} hours')
      return { text: tx('In {{name}} you can see: {{list}}. Plan around {{plan}}.', { name, list: d.attractions.map(a => tx(a)).join(', '), plan }), links, official: false }
    }
    return { text: `${name} (${tx(d.district)}): ${tx(d.tagline)}. ${tx(d.overview)}`, links, official: false }
  }

  const food = foods.find(f => q.includes(f.name.toLowerCase().split(' ')[0]) || q.includes(tx(f.name).toLowerCase()))
  if (food) return { text: `${tx(food.name)}: ${tx(food.description)} ${tx(food.significance)}`, links: [{ to: '/#food', label: tx('Food of Bihar') }], official: false }
  if (/food|eat|dish|खाना|व्यंजन/.test(q)) {
    return { text: tx('Famous foods of Bihar: {{list}}.', { list: foods.map(f => tx(f.name)).join(', ') }), links: [{ to: '/#food', label: tx('Food of Bihar') }], official: false }
  }

  if (/buddh|बौद्ध/.test(q)) {
    const list = destinations.filter(x => ['bodh-gaya', 'rajgir', 'nalanda', 'vaishali', 'kesariya'].includes(x.id))
    return { text: tx('Buddhist places in Bihar include {{list}}.', { list: list.map(x => tx(x.name)).join(', ') }), links: list.slice(0, 3).map(x => ({ to: `/explore/${x.id}`, label: tx(x.name) })), official: false }
  }
  if (/best time|when to visit|season/.test(q)) {
    return { text: tx('Most of Bihar is best from October to March. It varies by place; for example, Kakolat Waterfall is best in the monsoon. Ask me about a specific place.'), links: [{ to: '/#best-time', label: tx('Best Time to Visit') }], official: false }
  }

  const pkg = packages.find(p => q.includes(`${p.days} day`))
  if (pkg) return { text: tx('A {{n}}-day option: {{title}}.', { n: pkg.days, title: tx(pkg.title) }), links: [{ to: `/packages/${pkg.id}`, label: tx(pkg.title) }], official: false }

  for (const [re, to, label] of PAGES) {
    if (re.test(input)) {
      const official = to === '/how-to-reach' || to === '/e-pinddaan'
      return { text: tx('You can find that here: {{label}}.', { label: tx(label) }), links: [{ to, label: tx(label) }], official }
    }
  }

  return {
    text: tx('I do not have verified information on that. You can browse destinations, or check official Bihar Tourism sources for details such as timings, prices and availability.'),
    links: [{ to: '/explore', label: tx('Explore Bihar') }],
    official: false,
  }
}

export function detectLang(text: string): string {
  if (/[぀-ヿ]/.test(text)) return 'ja'
  if (/[가-힯]/.test(text)) return 'ko'
  if (/[฀-๿]/.test(text)) return 'th'
  if (/[඀-෿]/.test(text)) return 'si'
  if (/[က-႟]/.test(text)) return 'my'
  if (/[ऀ-ॿ]/.test(text)) return 'hi'
  return 'en'
}
