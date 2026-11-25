import i18n, { applyLang } from './index'
import { setDictionary } from './tx'

const loaders = import.meta.glob<{ default: Record<string, string> }>('./tx/*.json')

// Magahi readers read Hindi, so anything not translated into them specifically falls back to Hindi.
const FALLBACK: Record<string, string> = { mag: 'hi' }

async function read(code: string) {
  const load = loaders[`./tx/${code}.json`]
  return load ? (await load()).default : {}
}

export async function loadDictionary(code: string) {
  const base = FALLBACK[code] ? await read(FALLBACK[code]) : {}
  setDictionary({ ...base, ...(await read(code)) }, code)
}

export async function setLanguage(code: string) {
  await loadDictionary(code)
  await i18n.changeLanguage(code)
  applyLang(code)
}
