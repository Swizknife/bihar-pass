import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Send, X } from 'lucide-react'
import { detectLang, reply, type BotReply } from '../lib/chatbot'
import { LANGS } from '../i18n'
import { setLanguage } from '../i18n/txLoader'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

interface Msg { from: 'user' | 'bot'; text: string; links?: BotReply['links']; official?: boolean }

export function Chatbot() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [last, setLast] = useState<string>()
  const end = useRef<HTMLDivElement>(null)
  const greeting = t('chat.greeting')

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs, open])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const q = text.trim()
    if (!q) return
    const detected = detectLang(q)
    if (detected !== 'en' && detected !== i18n.language && i18n.language !== 'mag') void setLanguage(detected)
    const r = reply(q, last)
    const dest = r.links.find(l => l.to.startsWith('/explore/'))
    if (dest) setLast(dest.to.split('/').pop())
    setMsgs(m => [...m, { from: 'user', text: q }, { from: 'bot', text: r.text, links: r.links, official: r.official }])
    setText('')
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} aria-label={t('chat.title')} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-forest px-4 py-3 text-white shadow-lg hover:bg-[#1f3622]">
        <MessageCircle size={20} /><span className="hidden text-sm font-semibold sm:inline">{t('chat.title')}</span>
      </button>
    )
  }
  return (
    <section aria-label={t('chat.title')} className="fixed bottom-0 right-0 z-50 flex h-[32rem] max-h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:bottom-5 sm:right-5 sm:w-96 sm:rounded-2xl">
      <div className="flex items-center justify-between bg-forest px-4 py-3 text-white">
        <strong>{t('chat.title')}</strong>
        <div className="flex items-center gap-2">
          <select aria-label={tx("Chat language")} value={i18n.language} onChange={e => { void setLanguage(e.target.value) }} className="rounded bg-white/15 px-1 text-sm text-white">
            {LANGS.map(l => <option key={l.code} value={l.code} className="text-charcoal">{tx(l.label)}</option>)}
          </select>
          <button onClick={() => setOpen(false)} aria-label={tx("Close chat")}><X size={18} /></button>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-ivory p-4 text-sm" aria-live="polite">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm">{greeting}</div>
        {msgs.map((m, i) => (
          <div key={i} className={m.from === 'user' ? 'flex justify-end' : ''}>
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${m.from === 'user' ? 'rounded-tr-sm bg-terracotta text-white' : 'rounded-tl-sm bg-white'}`}>
              <p>{tx(m.text)}</p>
              {m.from === 'bot' && <p className="mt-1 text-[10px] uppercase tracking-wide text-stone">{m.official ? tx('Check official sources for current details') : tx('General guide information')}</p>}
              {m.links?.map(l => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="mt-2 block text-forest underline">{tx(l.label)}</Link>)}
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-cream p-3">
        <input value={text} onChange={e => setText(e.target.value)} placeholder={t('chat.placeholder')} className="min-w-0 flex-1 rounded-full border border-gold/60 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gold" />
        <button className="btn btn-primary !px-3" aria-label={t('chat.send')}><Send size={16} /></button>
      </form>
    </section>
  )
}
