import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Copy, HelpCircle, Mail, MapPin, MessageSquare, Phone, Send, Trash2 } from 'lucide-react'
import { CONTACT } from '../lib/constants'
import { fmtDateTime, tx } from '../i18n/tx'
import { SectionTitle } from './ui'

const TOPICS = ['Query', 'Feedback', 'Suggestion', 'Report an error'] as const
const KEY = 'feedbackOutbox'

interface Saved { when: string; topic: string; name: string; email: string; message: string; to: string }
const load = (): Saved[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const store = (list: Saved[]) => { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ } }

export function QueryFeedback({ heading = true }: { heading?: boolean }) {
  const recipients = [
    { id: 'dept', label: 'Department of Tourism (official queries)', to: CONTACT.dept.emails[1] },
    ...(CONTACT.siteEmail ? [{ id: 'site', label: 'The team behind this website', to: CONTACT.siteEmail }] : []),
  ]
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('Query')
  const [to, setTo] = useState(recipients[0].to)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState<Saved[]>(load)
  const [copied, setCopied] = useState<number | null>(null)
  const input = 'mt-1 w-full rounded-lg border border-gold/60 bg-white px-3 py-2 font-normal'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    const entry: Saved = { when: new Date().toISOString(), topic, name: name.trim(), email: email.trim(), message: message.trim(), to }
    const next = [entry, ...saved].slice(0, 20)
    setSaved(next)
    store(next)
    const body = `${entry.message}\n\n--\n${entry.name ? `${entry.name}\n` : ''}${entry.email ? `${entry.email}\n` : ''}Sent from: ${window.location.href}`
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(`[${topic}] Bihar Tourism guide`)}&body=${encodeURIComponent(body)}`
    setDone(true)
    setMessage('')
  }
  const copy = async (i: number) => {
    const m = saved[i]
    try { await navigator.clipboard.writeText(`To: ${m.to}\n[${m.topic}]\n\n${m.message}`); setCopied(i); setTimeout(() => setCopied(null), 1800) } catch { /* ignore */ }
  }
  const clear = () => { setSaved([]); store([]) }

  return (
    <div className="section" id="queries">
      {heading && <SectionTitle title="Queries and Feedback" sub="Ask a question, share a suggestion or tell us about a mistake. Your message goes by email, so you stay in control of what is sent." />}
      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gold/50 bg-white p-6 shadow-sm lg:col-span-3" aria-label={tx('Send a message')}>
          <fieldset>
            <legend className="text-sm font-semibold">{tx('What is this about?')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TOPICS.map(x => <button key={x} type="button" aria-pressed={topic === x} onClick={() => setTopic(x)} className={`chip ${topic === x ? 'chip-on' : 'hover:bg-cream'}`}>{tx(x)}</button>)}
            </div>
          </fieldset>
          {recipients.length > 1 && (
            <label className="block text-sm font-semibold">{tx('Send to')}
              <select value={to} onChange={e => setTo(e.target.value)} className={input}>{recipients.map(r => <option key={r.id} value={r.to}>{tx(r.label)}</option>)}</select>
            </label>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">{tx('Your name (optional)')}<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className={input} /></label>
            <label className="block text-sm font-semibold">{tx('Your email (optional)')}<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className={input} /></label>
          </div>
          <label className="block text-sm font-semibold">{tx('Your message')}
            <textarea required rows={5} value={message} onChange={e => { setMessage(e.target.value); setDone(false) }} className={input} placeholder={tx('Type your question or feedback here')} />
          </label>
          <button className="btn btn-primary"><Send size={16} />{tx('Prepare email')}</button>
          <p role="status" className="text-sm text-forest">{done ? tx('Your email app should open with the message ready. Nothing has been sent until you press Send there.') : ''}</p>
          <p className="text-xs text-stone">{tx('This website has no server, so it cannot receive messages itself. A copy of what you write is kept only in this browser.')}</p>

          {saved.length > 0 && (
            <div className="border-t border-cream pt-4">
              <div className="flex items-center justify-between"><h3 className="font-bold">{tx('Your recent messages')}</h3><button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs underline"><Trash2 size={12} />{tx('Clear')}</button></div>
              <ul className="mt-2 space-y-2">
                {saved.slice(0, 3).map((m, i) => (
                  <li key={m.when} className="rounded-xl bg-ivory p-3 text-sm">
                    <p className="text-xs text-stone">{fmtDateTime(new Date(m.when))} · {tx(m.topic)} · {m.to}</p>
                    <p className="mt-1 line-clamp-3 whitespace-pre-line">{m.message}</p>
                    <button type="button" onClick={() => copy(i)} className="mt-2 inline-flex items-center gap-1 text-xs underline"><Copy size={12} />{copied === i ? tx('Copied') : tx('Copy message')}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <aside className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-forest p-6 text-white">
            <h3 className="text-xl font-bold">{tx('Department of Tourism, Bihar')}</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-gold" /><a href={`tel:${CONTACT.dept.phone.replace(/[^+\d]/g, '')}`} className="hover:underline">{CONTACT.dept.phone}</a></li>
              {CONTACT.dept.emails.map(m => <li key={m} className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-gold" /><a href={`mailto:${m}`} className="break-all hover:underline">{m}</a></li>)}
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" /><span>{CONTACT.dept.address}</span></li>
              <li className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-gold" /><span>{tx(CONTACT.dept.hours)}</span></li>
            </ul>
            <p className="mt-3 text-xs text-white/70">{tx('As listed on the official Bihar Tourism website. Please confirm before relying on them.')}</p>
          </div>
          <div className="rounded-2xl border border-cream bg-white p-5 text-sm">
            <h3 className="flex items-center gap-2 font-bold"><Phone size={16} className="text-terracotta" />{tx('National tourist helpline')}</h3>
            <p className="mt-1 text-stone"><a className="font-semibold text-charcoal hover:underline" href={`tel:${CONTACT.helpline.replace(/[^+\d]/g, '')}`}>{CONTACT.helpline}</a> {tx('(Incredible India)')}</p>
          </div>
          <div className="rounded-2xl border border-cream bg-white p-5 text-sm">
            <h3 className="flex items-center gap-2 font-bold"><HelpCircle size={16} className="text-terracotta" />{tx('Looking for a quick answer?')}</h3>
            <p className="mt-1 text-stone">{tx('Many common questions are answered in the Knowledge Bank. The travel assistant in the corner can also help.')}</p>
            <Link to="/experience/knowledge-bank" className="mt-3 inline-flex items-center gap-1 font-semibold text-forest underline"><MessageSquare size={14} />{tx('Open the Knowledge Bank')}</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
