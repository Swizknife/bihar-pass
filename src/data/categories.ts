import type { Category } from '../types'

export const CATEGORIES: { key: Category; label: string; tagline: string; query: string; hue: number }[] = [
  { key: 'city', label: 'Cities', tagline: 'Streets, ghats and living history', query: 'Patna Bihar Golghar', hue: 205 },
  { key: 'historical', label: 'Historical Monuments', tagline: 'Ruins, stupas and ancient capitals', query: 'Nalanda ruins Bihar', hue: 15 },
  { key: 'religious', label: 'Religious Places', tagline: 'Sacred sites of many faiths', query: 'Mahabodhi Temple Bodh Gaya', hue: 38 },
  { key: 'museum', label: 'Museums', tagline: 'Collections that tell Bihar\'s story', query: 'Bihar Museum Patna', hue: 8 },
  { key: 'wildlife', label: 'Wildlife', tagline: 'Forests, wetlands and birdlife', query: 'Valmiki Tiger Reserve safari', hue: 135 },
  { key: 'natural', label: 'Nature and Adventure', tagline: 'Hills, waterfalls and lakes', query: 'Kakolat waterfall', hue: 175 },
  { key: 'cultural', label: 'Cultural Attractions', tagline: 'Art, fairs and living traditions', query: 'Madhubani painting', hue: 330 },
]
