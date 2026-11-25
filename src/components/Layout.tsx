import { useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Globe, House, Menu, ShoppingCart, X } from 'lucide-react'
import { LANGS } from '../i18n'
import { setLanguage } from '../i18n/txLoader'
import { LINKS } from '../lib/constants'
import { Chatbot } from './Chatbot'
import { CATEGORIES } from '../data/categories'
import { circuits } from '../data/circuits'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'
import { useCart } from '../lib/cart'

const NAV = [
  ['/', 'nav.home'], ['/explore', 'nav.explore'], ['/packages', 'nav.packages'], ['/plan-your-trip', 'nav.plan'],
  ['/e-pinddaan', 'nav.pinddaan'], ['/how-to-reach', 'nav.reach'], ['/about', 'nav.about'],
] as const

type MenuGroup = { title: string; items: readonly (readonly [string, string])[] }

const EXPLORE_GROUPS: MenuGroup[] = [
  { title: 'Destinations by theme', items: [['/explore', 'All destinations'], ...CATEGORIES.map(c => [`/explore?cat=${c.key}`, c.label] as const)] },
  { title: 'Circuits', items: circuits.map(c => [`/explore/circuits/${c.id}`, c.name] as const) },
]
const EXP_GROUPS: MenuGroup[] = [
  { title: 'Experience Bihar', items: [['/experience/festivals', 'Fairs & Festivals'], ['/experience/adventures', 'Adventures'], ['/experience/helicopter', 'Helicopter Rides'], ['/experience/knowledge-bank', 'Knowledge Bank'], ['/experience', 'All experiences']] },
]

// Links that differ only by query string must not all light up together, so match path and query exactly.
function useIsHere() {
  const loc = useLocation()
  return (to: string) => {
    const [path, search = ''] = to.split('?')
    if (loc.pathname !== path) return false
    return search ? loc.search === `?${search}` : loc.search === ''
  }
}

function NavMenu({ label, groups, root }: { label: string; groups: MenuGroup[]; root: string }) {
  const [open, setOpen] = useState(false)
  const isHere = useIsHere()
  const loc = useLocation()
  const inSection = loc.pathname === root || loc.pathname.startsWith(`${root}/`)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onKeyDown={e => e.key === 'Escape' && setOpen(false)}>
      <button aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${inSection ? 'bg-cream text-terracotta' : 'hover:bg-cream'}`}>
        {label}<ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-50 w-64 overflow-hidden rounded-xl border border-cream bg-ivory py-2 shadow-xl">
          {groups.map((g, gi) => (
            <div key={g.title} className={gi > 0 ? 'mt-1 border-t border-cream pt-1' : ''}>
              <p className="px-5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-terracotta">{tx(g.title)}</p>
              <ul>
                {g.items.map(([to, text]) => (
                  <li key={to} role="none">
                    <Link role="menuitem" to={to} onClick={() => setOpen(false)} aria-current={isHere(to) ? 'page' : undefined}
                      className={`block px-5 py-2 text-sm transition hover:bg-cream ${isHere(to) ? 'bg-cream font-semibold text-terracotta' : ''}`}>{tx(text)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileGroups({ groups, onNavigate }: { groups: MenuGroup[]; onNavigate: () => void }) {
  const isHere = useIsHere()
  return (
    <>
      {groups.map(g => (
        <div key={g.title} className="mt-2">
          <p className="px-2.5 text-[11px] font-bold uppercase tracking-widest text-terracotta">{tx(g.title)}</p>
          {g.items.map(([to, text]) => (
            <Link key={to} to={to} onClick={onNavigate} className={`block rounded-full px-2.5 py-1.5 text-sm ${isHere(to) ? 'bg-cream font-semibold text-terracotta' : 'hover:bg-cream'}`}>{tx(text)}</Link>
          ))}
        </div>
      ))}
    </>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const { items: cartItems } = useCart()
  const link = ({ isActive }: { isActive: boolean }) => `rounded-full px-2.5 py-1.5 text-sm font-medium transition ${isActive ? 'bg-terracotta text-white' : 'hover:bg-cream'}`
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">{tx("Skip to content")}</a>
      <header className="sticky top-0 z-40 border-b border-cream bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="font-heading text-xl font-bold text-terracotta">Bihar<span className="text-forest">-Pass</span></Link>
          <nav className="hidden items-center gap-1 xl:flex" aria-label={tx("Main")}>
            <NavLink to="/" end aria-label={t('nav.home')} className={link}><House size={16} aria-hidden /></NavLink>
            <NavMenu label={t('nav.explore')} groups={EXPLORE_GROUPS} root="/explore" />
            {NAV.slice(2, 3).map(([to, key]) => <NavLink key={to} to={to} className={link}>{t(key)}</NavLink>)}
            <NavMenu label={t('nav.experience')} groups={EXP_GROUPS} root="/experience" />
            {NAV.slice(3).map(([to, key]) => <NavLink key={to} to={to} className={link}>{t(key)}</NavLink>)}
            <NavLink to="/ai-trip" className={link}>{t('nav.ai')}</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/cart" aria-label={`${tx('Cart')} (${cartItems.length})`} className="relative rounded-full border border-gold/60 p-2 hover:bg-cream">
              <ShoppingCart size={16} aria-hidden />
              {cartItems.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-white">{cartItems.length}</span>}
            </Link>
            <label className="flex items-center gap-1 rounded-full border border-gold/60 px-2 py-1 text-sm">
              <Globe size={14} aria-hidden /><span className="sr-only">{tx("Language")}</span>
              <select value={i18n.language} onChange={e => { void setLanguage(e.target.value) }} className="bg-transparent outline-none">
                {LANGS.map(l => <option key={l.code} value={l.code}>{tx(l.label)}</option>)}
              </select>
            </label>
            <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label={tx("Menu")} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-cream px-4 py-3 xl:hidden" aria-label={tx("Mobile")}>
            {NAV.map(([to, key]) => <NavLink key={to} to={to} end={to === '/'} className={link} onClick={() => setOpen(false)}>{t(key)}</NavLink>)}
            <MobileGroups groups={EXPLORE_GROUPS} onNavigate={() => setOpen(false)} />
            <MobileGroups groups={EXP_GROUPS} onNavigate={() => setOpen(false)} />
            <NavLink to="/ai-trip" className={link} onClick={() => setOpen(false)}>{t('nav.ai')}</NavLink>
          </nav>
        )}
      </header>
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  )
}

function Footer() {
  const { t } = useTranslation()
  const col = 'space-y-2 text-sm text-white/80'
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-xl font-bold text-gold">Bihar-Pass</h3>
          <p className="mt-3 text-sm text-white/80">{t('footer.tag')}</p>
          <p className="mt-3 text-xs text-white/60">{tx("An independent informational guide. Always confirm timings, prices and availability with official sources.")}</p>
        </div>
        <ul className={col}>
          <li className="font-semibold text-white">{tx("Destinations")}</li>
          {['bodh-gaya', 'nalanda', 'rajgir', 'patna', 'vaishali', 'valmiki'].map(id => <li key={id}><Link className="hover:text-gold" to={`/explore/${id}`}>{id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</Link></li>)}
        </ul>
        <ul className={col}>
          <li className="font-semibold text-white">{tx("Official links")}</li>
          <li><a className="hover:text-gold" href={LINKS.tourism.url} target="_blank" rel="noopener noreferrer">{tx("Bihar Tourism")}</a></li>
          <li><Link className="hover:text-gold" to="/e-pinddaan">{tx("E-Pinddaan")}</Link></li>
          <li><a className="hover:text-gold" href={LINKS.irctc.url} target="_blank" rel="noopener noreferrer">{tx("IRCTC (trains)")}</a></li>
          <li><a className="hover:text-gold" href={LINKS.bsrtc.url} target="_blank" rel="noopener noreferrer">{tx("BSRTC (buses)")}</a></li>
          <li><Link className="hover:text-gold" to="/how-to-reach">{tx("All transport options")}</Link></li>
        </ul>
        <ul className={col}>
          <li className="font-semibold text-white">{tx("Information")}</li>
          <li><Link className="hover:text-gold" to="/about">{tx("About Bihar")}</Link></li>
          <li><Link className="hover:text-gold" to="/contact">{tx("Queries and Feedback")}</Link></li>
          <li><Link className="hover:text-gold" to="/info/accessibility">{tx("Accessibility")}</Link></li>
          <li><Link className="hover:text-gold" to="/info/privacy">{tx("Privacy policy")}</Link></li>
        </ul>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">© {new Date().getFullYear()} {tx('Bihar-Pass guide')}</div>
    </footer>
  )
}
