import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ja, ko, my, si, th, vi } from './extra'

export const LANGS = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'mag', label: 'मगही', dir: 'ltr' },
  { code: 'ja', label: '日本語', dir: 'ltr' },
  { code: 'th', label: 'ไทย', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt', dir: 'ltr' },
  { code: 'ko', label: '한국어', dir: 'ltr' },
  { code: 'si', label: 'සිංහල', dir: 'ltr' },
  { code: 'my', label: 'မြန်မာ', dir: 'ltr' },
] as const

const en = {
  nav: { home: 'Home', explore: 'Explore Bihar', packages: 'Tour Packages', experience: 'Experience', pass: 'Bihar Pass', plan: 'Plan Your Trip', pinddaan: 'E-Pinddaan', reach: 'How to Reach', assistant: 'Travel Assistant', about: 'About Bihar', ai: 'AI Trip' },
  hero: { title: 'Discover Bihar – Where History, Spirituality and Culture Come Alive.', sub: 'Ancient universities, sacred sites, forests and living traditions, gathered in one place to help you plan your journey.', explore: 'Explore Destinations', plan: 'Plan Your Trip', ai: 'Generate My Trip with AI' },
  sec: { discover: 'Discover Bihar', top: 'Top Destinations', food: 'Popular Food of Bihar', culture: 'Bihar at a Glance', reach: 'How to Reach Bihar', best: 'Best Time to Visit', all: 'See All', details: 'View Details', more: 'Explore More' },
  common: { search: 'Search destinations', all: 'All', bestTime: 'Best time', book: 'Official Booking', viewPackage: 'View Package', addTrip: 'Add to My Trip', added: 'Added to My Trip', nearby: 'Explore Nearby Attractions', leaving: 'You are leaving this website and going to an external site.', notFound: 'Page not found', backHome: 'Back to Home', days: 'days' },
  chat: { title: 'Bihar-Pass Assistant', greeting: 'Namaste! Welcome to Bihar-Pass. I can help you discover destinations, plan your journey, learn about our heritage and access important tourism services. How can I help you?', placeholder: 'Ask about places, food, travel...', send: 'Send' },
  footer: { tag: 'One Platform. Every Destination. A Smarter Way to Explore Bihar.' },
}

const hi: typeof en = {
  nav: { home: 'मुख्य पृष्ठ', explore: 'बिहार दर्शन', packages: 'टूर पैकेज', pass: 'बिहार पास', experience: 'अनुभव', plan: 'यात्रा योजना', pinddaan: 'ई-पिंडदान', reach: 'कैसे पहुँचें', assistant: 'यात्रा सहायक', about: 'बिहार के बारे में', ai: 'एआई यात्रा' },
  hero: { title: 'बिहार की खोज करें – जहाँ इतिहास, आध्यात्मिकता और संस्कृति जीवंत हैं।', sub: 'प्राचीन विश्वविद्यालय, पवित्र स्थल, वन और जीवंत परंपराएँ, आपकी यात्रा की योजना के लिए एक स्थान पर।', explore: 'स्थल देखें', plan: 'अपनी यात्रा बनाएँ', ai: 'एआई से मेरी यात्रा बनाएँ' },
  sec: { discover: 'बिहार को जानें', top: 'प्रमुख गंतव्य', food: 'बिहार के लोकप्रिय व्यंजन', culture: 'एक नज़र में बिहार', reach: 'बिहार कैसे पहुँचें', best: 'घूमने का सर्वोत्तम समय', all: 'सभी देखें', details: 'विवरण देखें', more: 'और जानें' },
  common: { search: 'स्थल खोजें', all: 'सभी', bestTime: 'सर्वोत्तम समय', book: 'आधिकारिक बुकिंग', viewPackage: 'पैकेज देखें', addTrip: 'मेरी यात्रा में जोड़ें', added: 'यात्रा में जोड़ा गया', nearby: 'आस-पास के स्थल देखें', leaving: 'आप इस वेबसाइट को छोड़कर एक बाहरी साइट पर जा रहे हैं।', notFound: 'पृष्ठ नहीं मिला', backHome: 'मुख्य पृष्ठ पर लौटें', days: 'दिन' },
  chat: { title: 'बिहार-पास सहायक', greeting: 'नमस्ते! बिहार पर्यटन में आपका स्वागत है। मैं स्थलों की खोज, यात्रा की योजना, हमारी विरासत और ज़रूरी पर्यटन सेवाओं में आपकी मदद कर सकता हूँ। मैं आपकी कैसे सहायता करूँ?', placeholder: 'स्थान, भोजन, यात्रा के बारे में पूछें...', send: 'भेजें' },
  footer: { tag: 'एक मंच। हर गंतव्य। बिहार को जानने का स्मार्ट तरीका।' },
}


// Magahi: navigation and headline strings only. Missing keys fall back to English, and page content falls back to Hindi.
const mag = {
  nav: { home: 'मुख्य पन्ना', explore: 'बिहार घूमऽ', packages: 'टूर पैकेज', plan: 'यात्रा योजना', pinddaan: 'ई-पिंडदान', reach: 'कइसे पहुँचऽ', assistant: 'यात्रा सहायक', about: 'बिहार के बारे में' },
  hero: { explore: 'जगह देखऽ', plan: 'अपन यात्रा बनावऽ' },
  sec: { all: 'सब देखऽ', details: 'विवरण देखऽ', more: 'आउ जानऽ' },
  chat: { title: 'बिहार-पास सहायक', greeting: 'प्रणाम! बिहार पर्यटन में तोहर स्वागत हइ। हम जगह खोजे, यात्रा के योजना बनावे आउ जरूरी पर्यटन सेवा में तोहर मदद कर सकऽ हिअइ। हम कइसे मदद करूँ?', placeholder: 'जगह, खाना, यात्रा के बारे में पूछऽ...', send: 'भेजऽ' },
}

const saved = (() => { try { return localStorage.getItem('lang') } catch { return null } })()

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi }, mag: { translation: mag }, ja: { translation: ja }, th: { translation: th }, vi: { translation: vi }, ko: { translation: ko }, si: { translation: si }, my: { translation: my } },
  lng: LANGS.some(l => l.code === saved) ? (saved as string) : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function applyLang(code: string) {
  const l = LANGS.find(x => x.code === code) ?? LANGS[0]
  document.documentElement.lang = l.code
  document.documentElement.dir = l.dir
  try { localStorage.setItem('lang', l.code) } catch { /* ignore */ }
}
applyLang(i18n.language)
export default i18n
