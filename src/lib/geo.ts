export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, r = Math.PI / 180
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}
// Straight-line distance x 1.3 as a rough road estimate; ~40 km/h average. Estimates only.
export const roadKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => Math.round(haversine(a, b) * 1.3)
export const roadHrs = (km: number) => Math.round((km / 40) * 10) / 10
