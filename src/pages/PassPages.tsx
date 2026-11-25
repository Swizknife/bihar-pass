import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { AlertTriangle, CheckCircle2, Download, Printer } from 'lucide-react'
import { getDestination } from '../data/destinations'
import { getPackage } from '../data/packages'
import { SectionTitle } from '../components/ui'
import { endDate, getPass, markUsed, newCode, PASS_RATES, passAmount, sandboxPayment, savePass, validity, type Pass } from '../lib/pass'
import { useTripDetails } from '../lib/tripDetails'
import NotFound from './NotFound'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

export const DemoBanner = () => (
  <div role="note" className="mb-6 flex gap-3 rounded-xl border border-gold bg-gold/15 p-4 text-sm">
    <AlertTriangle className="mt-0.5 shrink-0 text-terracotta" size={18} />
    <p><strong>{tx("Demonstration mode.")}</strong> {tx("No money is charged and passes are stored only in this browser. A pass issued here is not accepted at any site. Accepting real passes needs a payment gateway, a shared server and agreements with each site's authority.")}</p>
  </div>
)

export function CheckoutPage() {
  const [q] = useSearchParams()
  const nav = useNavigate()
  const pkg = q.get('package') ? getPackage(q.get('package')!) : undefined
  const siteIds = pkg ? pkg.destinations : (q.get('sites') ?? '').split(',').filter(id => getDestination(id))
  const dedup = [...new Set(siteIds)]
  const { d: td, set: setTd } = useTripDetails()
  const days = pkg ? (td.days ?? pkg.days) : Math.max(1, Math.min(14, +(q.get('days') ?? 1) || 1))
  const title = pkg ? pkg.title : 'Custom Bihar trip pass'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adults, setAdults] = useState(td.adults)
  const [kids, setKids] = useState(td.children)
  const travellers = adults + kids
  const [start, setStart] = useState(q.get('start') || td.startDate)
  const [busy, setBusy] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const total = passAmount(dedup.length, adults, kids)
  if (!dedup.length) return <div className="section"><SectionTitle title={tx("Checkout")} /><p className="text-stone">{tx("No sites selected.")} <Link className="underline" to="/pass">{tx("Choose a pass")}</Link>.</p></div>

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const r = await sandboxPayment.pay(total)
    if (!r.ok) { setBusy(false); return }
    const pass: Pass = { code: newCode(), title, holder: name.trim(), email: email.trim(), travellers, adults, children: kids, origin: td.origin, activities: td.activities.filter(k => dedup.includes(k.split(':')[0])), startDate: start, validDays: days, sites: dedup.map(id => ({ id })), amountInr: total, paymentRef: r.ref, paidAt: new Date().toISOString(), mode: 'sandbox' }
    savePass(pass)
    setTd({ activities: [] })
    nav(`/pass/${pass.code}`)
  }
  const input = 'mt-1 w-full rounded-lg border border-gold/60 px-3 py-2 font-normal'
  return (
    <div className="section">
      <SectionTitle title={tx("Checkout")} sub={title} />
      <DemoBanner />
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={pay} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <label className="block text-sm font-semibold">{tx("Lead traveller name")}<input required value={name} onChange={e => setName(e.target.value)} className={input} /></label>
          <label className="block text-sm font-semibold">{tx("Email")}<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={input} /></label>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm font-semibold">{tx("Adults")}<input type="number" min={1} max={20} value={adults} onChange={e => setAdults(Math.min(20, Math.max(1, +e.target.value || 1)))} className={input} /></label>
              <label className="block text-sm font-semibold">{tx("Children")}<input type="number" min={0} max={20} value={kids} onChange={e => setKids(Math.min(20, Math.max(0, +e.target.value || 0)))} className={input} /></label>
            </div>
            <label className="block text-sm font-semibold">{tx("Start date")}<input required type="date" min={today} value={start} onChange={e => setStart(e.target.value)} className={input} /></label>
          </div>
          <div className="rounded-xl bg-cream/70 p-3 text-sm"><strong>{tx("Payment method:")}</strong> {tx(sandboxPayment.name)}. {tx('No card details are asked for or stored.')}</div>
          <button disabled={busy} className="btn btn-primary disabled:opacity-60">{busy ? tx('Processing...') : tx('Complete sandbox payment')}</button>
        </form>
        <aside className="h-fit space-y-3 rounded-2xl bg-cream/70 p-5">
          <h2 className="text-xl font-bold">{tx("Your pass includes")}</h2>
          <ul className="space-y-1 text-sm">{dedup.map(id => <li key={id}>• {tx(getDestination(id)!.name)}</li>)}</ul>
          <p className="text-sm text-stone">{tx('Valid for {{d}} from the start date, one entry per site per traveller group.', { d: txn(days, '{{n}} day', '{{n}} days') })}</p>
<div className="space-y-1 border-t border-gold/40 pt-3 text-sm">
            <p className="flex justify-between"><span>{tx('Adults: {{a}} x {{s}} sites x Rs {{r}}', { a: adults, s: dedup.length, r: PASS_RATES.adult })}</span><span>Rs {adults * dedup.length * PASS_RATES.adult}</span></p>
            {kids > 0 && <p className="flex justify-between"><span>{tx('Children: {{a}} x {{s}} sites x Rs {{r}}', { a: kids, s: dedup.length, r: PASS_RATES.child })}</span><span>Rs {kids * dedup.length * PASS_RATES.child}</span></p>}
            <p className="flex justify-between border-t border-gold/40 pt-2 text-lg font-bold"><span>{tx("Total")}</span><span>Rs {total}</span></p>
            <p className="text-xs text-stone">{tx("Demo rates for illustration. Official Bihar Pass pricing has not been set.")}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Qr({ text, size = 240 }: { text: string; size?: number }) {
  const [src, setSrc] = useState('')
  useEffect(() => { QRCode.toDataURL(text, { width: size, margin: 1, errorCorrectionLevel: 'M' }).then(setSrc).catch(() => setSrc('')) }, [text, size])
  return src ? <img src={src} alt={`QR code for pass ${text}`} width={size} height={size} className="rounded-lg border border-cream bg-white" /> : <div style={{ width: size, height: size }} className="rounded-lg bg-cream" />
}

export function PassViewPage() {
  const { code } = useParams()
  const pass = code ? getPass(code) : undefined
  if (!pass) return <NotFound />
  const url = `${location.origin}/verify?code=${pass.code}`
  const v = validity(pass)
  const download = () => {
    QRCode.toDataURL(url, { width: 600, margin: 2 }).then(d => { const a = document.createElement('a'); a.href = d; a.download = `${pass.code}.png`; a.click() })
  }
  return (
    <div className="section max-w-4xl">
      <SectionTitle title={tx("Your Bihar Pass")} sub={pass.title} />
      <DemoBanner />
      <div className="overflow-hidden rounded-2xl border border-gold bg-white shadow">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-forest px-5 py-3 text-white"><strong className="font-heading text-lg">{tx("Bihar Pass")}</strong><span className="text-sm">{pass.code}</span></div>
        <div className="grid gap-6 p-5 md:grid-cols-[auto_1fr]">
          <div className="text-center"><Qr text={url} /><p className="mt-1 text-xs text-stone">{tx("Show this QR at each site")}</p></div>
          <div className="space-y-2 text-sm">
            <p><strong>{tx("Holder:")}</strong> {pass.holder} · {txn(pass.adults ?? pass.travellers, '{{n}} adult', '{{n}} adults')}{!!pass.children && `, ${txn(pass.children, '{{n}} child', '{{n}} children')}`}</p>
            {pass.origin && <p><strong>{tx("Starting from:")}</strong> {pass.origin}</p>}
            <p><strong>{tx("Valid:")}</strong> {fmtDate(new Date(pass.startDate + 'T00:00:00'))} {tx('to')} {fmtDate(endDate(pass))}</p>
            <p><strong>{tx("Status:")}</strong> <span className={v === 'valid' ? 'font-semibold text-forest' : 'font-semibold text-terracotta'}>{v === 'valid' ? tx('Valid now') : v === 'upcoming' ? tx('Starts on the start date') : tx('Expired')}</span></p>
            <p><strong>{tx("Paid:")}</strong> {tx('₹{{a}} via sandbox, ref {{ref}}', { a: pass.amountInr, ref: pass.paymentRef })}</p>
            {!!pass.activities?.length && <><h3 className="pt-2 font-bold">{tx("Chosen activities")}</h3><ul className="list-disc ps-5 text-stone">{pass.activities.map(k => <li key={k}>{k.split(':')[1]} <span className="text-xs">({getDestination(k.split(':')[0])?.name})</span></li>)}</ul></>}
            <h3 className="pt-2 font-bold">{tx("Included entries")}</h3>
            <ul className="space-y-1">{pass.sites.map(s => (
              <li key={s.id} className="flex items-center justify-between rounded-lg bg-ivory px-3 py-2">
                <Link to={`/explore/${s.id}`} className="font-semibold hover:text-terracotta">{getDestination(s.id)?.name}</Link>
                <span className={s.usedAt ? 'text-stone' : 'text-forest'}>{s.usedAt ? tx('Used {{when}}', { when: fmtDateTime(new Date(s.usedAt)) }) : tx('Not used')}</span>
              </li>))}</ul>
          </div>
        </div>
      </div>
      <div className="no-print mt-5 flex flex-wrap gap-3">
        <button className="btn btn-outline" onClick={() => window.print()}><Printer size={14} />{tx("Print")}</button>
        <button className="btn btn-outline" onClick={download}><Download size={14} />{tx("Download QR")}</button>
        <Link className="btn btn-outline" to={`/verify?code=${pass.code}`}>{tx("Try the staff scan page")}</Link>
      </div>
    </div>
  )
}

export function VerifyPage() {
  const [q, setQ] = useSearchParams()
  const [input, setInput] = useState(q.get('code') ?? '')
  const [, bump] = useState(0)
  const code = q.get('code') ?? ''
  const pass = code ? getPass(code) : undefined
  const v = pass ? validity(pass) : undefined
  return (
    <div className="section max-w-2xl">
      <SectionTitle title={tx("Verify a pass")} sub="Staff entry check (demonstration)." />
      <div role="note" className="mb-4 rounded-xl bg-cream/70 p-3 text-sm">{tx("This page reads passes stored in this browser only. A real gate scanner needs a login for staff and a shared server so every site sees the same used-entry status.")}</div>
      <form onSubmit={e => { e.preventDefault(); setQ(input.trim() ? { code: input.trim().toUpperCase() } : {}) }} className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder={tx("Pass code, e.g. BT-XXXXXXXX")} aria-label={tx("Pass code")} className="flex-1 rounded-full border border-gold/60 px-4 py-2" />
        <button className="btn btn-primary">{tx("Check")}</button>
      </form>
      {code && !pass && <p role="alert" className="mt-4 font-semibold text-terracotta">{tx('No pass found for {{code}} on this device.', { code })}</p>}
      {pass && (
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 font-bold">{v === 'valid' ? <CheckCircle2 className="text-forest" /> : <AlertTriangle className="text-terracotta" />}{tx(pass.title)} · {pass.holder}</p>
          <p className="mt-1 text-sm text-stone">{txn(pass.travellers, '{{n}} traveller', '{{n}} travellers')} · {fmtDate(new Date(pass.startDate + 'T00:00:00'))} {tx('to')} {fmtDate(endDate(pass))} · {v === 'valid' ? tx('Valid today') : v === 'upcoming' ? tx('Not yet valid') : tx('Expired')}</p>
          <ul className="mt-3 space-y-2">{pass.sites.map(s => (
            <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-ivory px-3 py-2 text-sm">
              <span>{tx(getDestination(s.id)?.name ?? '')}{s.usedAt && <em className="ms-2 text-stone">{tx('used {{when}}', { when: fmtDateTime(new Date(s.usedAt)) })}</em>}</span>
              <button disabled={!!s.usedAt || v !== 'valid'} onClick={() => { markUsed(pass.code, s.id); bump(n => n + 1) }} className="btn btn-primary !px-3 !py-1.5 text-xs disabled:opacity-40">{tx("Mark entry used")}</button>
            </li>))}</ul>
        </div>
      )}
    </div>
  )
}
