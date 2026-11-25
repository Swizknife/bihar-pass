let dict: Record<string, string> = {}
let lang = 'en'

export const setDictionary = (d: Record<string, string>, code = 'en') => { dict = d; lang = code }
export const currentLang = () => lang
// Maithili, Bhojpuri and Magahi borrow Hindi conventions for dates and numbers.
export const locale = () => (({ mai: 'hi', bho: 'hi', mag: 'hi' }) as Record<string, string>)[lang] ?? lang

// Looks up the English text in the active language's dictionary and falls back to the English itself.
export function tx(text: string, vars?: Record<string, string | number>): string {
  const base = dict[text] ?? text
  return vars ? base.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(vars[k] ?? '')) : base
}

export const txn = (n: number, one: string, other: string, vars: Record<string, string | number> = {}) =>
  tx(n === 1 ? one : other, { n, ...vars })

export const fmtDate = (d: Date) => d.toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
export const fmtDateTime = (d: Date) => d.toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
