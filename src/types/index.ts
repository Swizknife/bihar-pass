export type Category = 'historical' | 'religious' | 'natural' | 'cultural' | 'wildlife' | 'city' | 'museum'
export interface Destination {
  id: string
  name: string
  district: string
  categories: Category[]
  lat: number
  lng: number
  tagline: string
  overview: string
  significance: string
  attractions: string[]
  bestTime: string
  hours: number
  nearestRail: string
  nearestAirport: string
  tips: string[]
  nearby: string[]
  hue: number
}
export interface PackageDay { title: string; stops: string[]; note: string }
export interface TourPackage {
  id: string
  title: string
  days: number
  summary: string
  destinations: string[]
  itinerary: PackageDay[]
  bestFor: string[]
  hue: number
}
export interface FoodItem { id: string; name: string; description: string; significance: string; hue: number }
export interface TripPrefs {
  startDate: string
  days: number
  destinationIds: string[]
  interests: Category[]
  pace: 'relaxed' | 'moderate' | 'packed'
  picks?: Record<string, string[]>
}
export interface ItineraryDay { day: number; date?: string; stops: { id: string; hours: number; legKm: number; legHrs: number; start: string; end: string; items: { name: string; start: string; end: string }[]; part?: { i: number; n: number } }[]; meal: string; tip: string; tipVars?: Record<string, number> }
export interface Itinerary { prefs: TripPrefs; days: ItineraryDay[]; totalKm: number; notes: string[] }
