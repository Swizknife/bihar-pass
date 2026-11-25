import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ShoppingCart } from 'lucide-react'
import { tx } from '../i18n/tx'
import { useCart } from '../lib/cart'
import { useTripDetails } from '../lib/tripDetails'

interface Props {
  title: string
  sites: string[]
  days: number
  startDate?: string
  className?: string
  buyNow?: boolean
}

// Adds a pass for the given sites to the cart, using the group size and start date the visitor already entered.
export function AddToCart({ title, sites, days, startDate, className = 'btn btn-outline', buyNow = false }: Props) {
  const { add } = useCart()
  const { d } = useTripDetails()
  const nav = useNavigate()
  const [added, setAdded] = useState(false)
  const go = () => {
    add({ title, sites: [...new Set(sites)], days, startDate: startDate || d.startDate, adults: d.adults, children: d.children, activities: d.activities.filter(k => sites.includes(k.split(':')[0])) })
    if (buyNow) { nav('/cart'); return }
    setAdded(true)
    setTimeout(() => setAdded(false), 4000)
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" onClick={go} className={className}>
        {added ? <Check size={14} /> : <ShoppingCart size={14} />}{buyNow ? tx('Book now') : added ? tx('Added to cart') : tx('Add to cart')}
      </button>
      {added && <Link to="/cart" className="text-sm font-semibold underline">{tx('View cart')}</Link>}
    </span>
  )
}
