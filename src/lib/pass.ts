export interface PassSite { id: string; usedAt?: string }
export interface Pass {
  code: string
  title: string
  holder: string
  email: string
  travellers: number
  adults?: number
  children?: number
  origin?: string
  activities?: string[]
  startDate: string
  validDays: number
  sites: PassSite[]
  amountInr: number
  paymentRef: string
  paidAt: string
  mode: 'sandbox'
}

// DEMO RATES ONLY. No official Bihar Pass price exists. Replace with the authority's published rates.
export const PASS_RATES = { adult: 100, child: 50 }
export const passAmount = (sites: number, adults: number, children: number) => sites * (adults * PASS_RATES.adult + children * PASS_RATES.child)

const KEY = 'biharPasses'
const read = (): Pass[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const write = (p: Pass[]) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* ignore */ } }

export const getPasses = () => read()
export const getPass = (code: string) => read().find(p => p.code === code.trim().toUpperCase())
export const savePass = (p: Pass) => write([p, ...read().filter(x => x.code !== p.code)])
export function markUsed(code: string, siteId: string): Pass | undefined {
  const all = read()
  const p = all.find(x => x.code === code)
  const s = p?.sites.find(x => x.id === siteId)
  if (!p || !s || s.usedAt) return p
  s.usedAt = new Date().toISOString()
  write(all)
  return p
}

export function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'BT-' + Array.from(bytes, b => chars[b % chars.length]).join('')
}

export function validity(p: Pass, now = new Date()): 'upcoming' | 'valid' | 'expired' {
  const start = new Date(p.startDate + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + p.validDays)
  if (now < start) return 'upcoming'
  return now < end ? 'valid' : 'expired'
}
export const endDate = (p: Pass) => {
  const d = new Date(p.startDate + 'T00:00:00')
  d.setDate(d.getDate() + p.validDays - 1)
  return d
}

export interface PaymentResult { ok: boolean; ref: string }
export interface PaymentProvider { name: string; pay(amountInr: number): Promise<PaymentResult> }
// Sandbox only: charges nothing and collects no card data. Swap in a real gateway implementation here.
export const sandboxPayment: PaymentProvider = {
  name: 'Sandbox (no money is charged)',
  pay: async () => { await new Promise(r => setTimeout(r, 700)); return { ok: true, ref: 'SANDBOX-' + Date.now().toString(36).toUpperCase() } },
}
