import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Landmark, ShieldCheck, ShoppingCart, Smartphone, Trash2 } from 'lucide-react'
import { getDestination } from '../data/destinations'
import { Counter } from '../components/TripDetailsForm'
import { SectionTitle } from '../components/ui'
import { tx, txn } from '../i18n/tx'
import { useCart } from '../lib/cart'
import { newCode, PASS_RATES, passAmount, sandboxPayment, savePass, type Pass } from '../lib/pass'
import { useTripDetails } from '../lib/tripDetails'
import { DemoBanner } from './PassPages'

const METHODS = [
  { id: 'upi', label: 'UPI', icon: <Smartphone size={18} /> },
  { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
  { id: 'netbanking', label: 'Net banking', icon: <Landmark size={18} /> },
] as const

export function CartPage() {
  const { items, update, remove, clear } = useCart()
  const { d } = useTripDetails()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('upi')
  const [busy, setBusy] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const amounts = items.map(i => passAmount(i.sites.length, i.adults, i.children))
  const total = amounts.reduce((a, b) => a + b, 0)
  const ready = items.length > 0 && items.every(i => i.startDate) && name.trim() !== '' && email.trim() !== ''
  const input = 'mt-1 w-full rounded-lg border border-gold/60 bg-white px-3 py-2 font-normal'

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready) return
    setBusy(true)
    const r = await sandboxPayment.pay(total)
    if (!r.ok) { setBusy(false); return }
    const codes = items.map((i, k) => {
      const pass: Pass = {
        code: newCode(), title: i.title, holder: name.trim(), email: email.trim(), travellers: i.adults + i.children, adults: i.adults, children: i.children,
        origin: d.origin, activities: i.activities, startDate: i.startDate, validDays: i.days, sites: i.sites.map(id => ({ id })), amountInr: amounts[k],
        paymentRef: `${r.ref}-${method.toUpperCase()}`, paidAt: new Date().toISOString(), mode: 'sandbox',
      }
      savePass(pass)
      return pass.code
    })
    clear()
    nav(codes.length === 1 ? `/pass/${codes[0]}` : '/packages#my-passes')
  }

  if (!items.length) {
    return (
      <div className="section">
        <SectionTitle title="Your cart" />
        <div className="rounded-2xl border border-cream bg-white p-10 text-center">
          <ShoppingCart className="mx-auto text-terracotta" size={36} />
          <p className="mt-3 text-stone">{tx('Your cart is empty. Add a package, or a trip you planned, to get a Bihar-Pass.')}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/packages" className="btn btn-primary">{tx('Tour Packages')}</Link>
            <Link to="/plan-your-trip" className="btn btn-outline">{tx('Plan Your Trip')}</Link>
            <Link to="/ai-trip" className="btn btn-outline">{tx('AI Trip')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <SectionTitle title="Your cart" sub="Review your passes, set dates and group size, then pay once for all of them." />
      <DemoBanner />
      <div className="grid gap-8 lg:grid-cols-5">
        <ul className="space-y-4 lg:col-span-3">
          {items.map((i, k) => (
            <li key={i.id} className="rounded-2xl border border-cream bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{tx(i.title)}</h3>
                  <p className="text-sm text-forest">{txn(i.days, '{{n}} day', '{{n}} days')} · {txn(i.sites.length, '{{n}} destination', '{{n}} destinations')}</p>
                </div>
                <button onClick={() => remove(i.id)} aria-label={tx('Remove from cart')} className="rounded p-2 text-terracotta hover:bg-cream"><Trash2 size={16} /></button>
              </div>
              <ul className="mt-2 flex flex-wrap gap-1">{i.sites.map(id => <li key={id} className="rounded-full bg-cream px-2 py-0.5 text-[11px]">{tx(getDestination(id)?.name.split(' (')[0] ?? id)}</li>)}</ul>
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <label className="block text-sm font-semibold">{tx('Start date')}
                  <input type="date" min={today} value={i.startDate} onChange={e => update(i.id, { startDate: e.target.value })} className={`${input} !w-44`} />
                </label>
                <Counter label="Adults" value={i.adults} min={1} max={20} onChange={n => update(i.id, { adults: n })} />
                <Counter label="Children" value={i.children} min={0} max={20} onChange={n => update(i.id, { children: n })} />
                <p className="ms-auto text-xl font-bold text-terracotta">₹{amounts[k]}</p>
              </div>
              {!i.startDate && <p className="mt-2 text-xs text-terracotta">{tx('Choose a start date for this pass.')}</p>}
            </li>
          ))}
        </ul>

        <form onSubmit={pay} className="h-fit space-y-4 rounded-2xl border border-gold/50 bg-white p-6 shadow-sm lg:col-span-2 lg:sticky lg:top-24">
          <h3 className="text-xl font-bold">{tx('Checkout')}</h3>
          <label className="block text-sm font-semibold">{tx('Lead traveller name')}<input required value={name} onChange={e => setName(e.target.value)} autoComplete="name" className={input} /></label>
          <label className="block text-sm font-semibold">{tx('Email')}<input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className={input} /></label>

          <fieldset>
            <legend className="text-sm font-semibold">{tx('Payment gateway')}</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {METHODS.map(m => (
                <button key={m.id} type="button" aria-pressed={method === m.id} onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition ${method === m.id ? 'border-forest bg-forest text-white' : 'border-gold/60 hover:bg-cream'}`}>{m.icon}{tx(m.label)}</button>
              ))}
            </div>
            <p className="mt-2 flex items-start gap-1 text-xs text-stone"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-forest" />{tx('Sandbox gateway: no money is charged, and no card or UPI details are asked for or stored.')}</p>
          </fieldset>

          <div className="space-y-1 border-t border-gold/40 pt-3 text-sm">
            {items.map((i, k) => <p key={i.id} className="flex justify-between gap-2"><span className="truncate">{tx(i.title)}</span><span>₹{amounts[k]}</span></p>)}
            <p className="flex justify-between border-t border-gold/40 pt-2 text-lg font-bold"><span>{tx('Total')}</span><span>₹{total}</span></p>
            <p className="text-xs text-stone">{tx('Demo rates: adults ₹{{a}}, children ₹{{c}} per site. Not official pricing.', { a: PASS_RATES.adult, c: PASS_RATES.child })}</p>
          </div>
          <button disabled={!ready || busy} className="btn btn-primary w-full disabled:opacity-50">{busy ? tx('Processing...') : tx('Pay ₹{{a}} (sandbox)', { a: total })}</button>
          {!ready && <p className="text-xs text-stone">{tx('Add a start date for every pass, your name and your email to continue.')}</p>}
        </form>
      </div>
    </div>
  )
}
