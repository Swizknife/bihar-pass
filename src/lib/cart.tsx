import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  title: string
  sites: string[]
  days: number
  startDate: string
  adults: number
  children: number
  activities: string[]
}

interface Ctx {
  items: CartItem[]
  add: (item: Omit<CartItem, 'id'>) => string
  update: (id: string, patch: Partial<CartItem>) => void
  remove: (id: string) => void
  clear: () => void
}

const KEY = 'biharPassCart'
const C = createContext<Ctx>({ items: [], add: () => '', update: () => {}, remove: () => {}, clear: () => {} })
export const useCart = () => useContext(C)

const read = (): CartItem[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(read)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* ignore */ } }, [items])
  const add = (item: Omit<CartItem, 'id'>) => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now() + Math.random())
    setItems(prev => [...prev, { ...item, id }])
    return id
  }
  return (
    <C.Provider value={{
      items, add,
      update: (id, patch) => setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i))),
      remove: id => setItems(prev => prev.filter(i => i.id !== id)),
      clear: () => setItems([]),
    }}>{children}</C.Provider>
  )
}
