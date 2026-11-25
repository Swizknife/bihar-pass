// Weekly opening hours, Monday to Sunday. Only places with a published source are listed.
// status 'official' = taken from the operator's or government tourism listing.
// status 'reported' = third-party listings that disagree or lack an official notice; treat as a guide only.
// Last checked: 2026-11-25. Add entries here as official hours are confirmed.
export type HoursStatus = 'official' | 'reported'
export interface PlaceHours {
  place: string
  status: HoursStatus
  days: [string, string, string, string, string, string, string]
  note?: string
  fee?: string
  source: string
  url: string
}

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
const all = (t: string): PlaceHours['days'] => [t, t, t, t, t, t, t]
const except = (day: number, t: string, closed = 'Closed'): PlaceHours['days'] => {
  const d = all(t)
  d[day] = closed
  return d
}

export const hours: Record<string, PlaceHours[]> = {
  'bodh-gaya': [
    {
      place: 'Mahabodhi Temple', status: 'official', days: all('05:00 – 21:00'),
      note: 'Daily chanting sessions run within these hours. Times can change on festival days.',
      source: 'Incredible India listing and the temple\'s own timetable', url: 'https://www.incredibleindia.gov.in/en/bihar/gaya/mahabodhi-temple',
    },
  ],
  patna: [
    {
      place: 'Bihar Museum (galleries)', status: 'official', days: except(0, '10:00 – 17:00'),
      note: 'Closed on selected religious and national holidays. Children\'s gallery, library and shop stay open until 19:00.',
      source: 'Bihar Museum official site', url: 'https://biharmuseum.org/visit',
    },
    {
      place: 'Patna Museum (Jadu Ghar)', status: 'reported', days: except(0, '≈10:30 – 16:30'),
      note: 'Third-party listings agree on a Monday closure but give slightly different hours.',
      source: 'Incredible India and travel listings', url: 'https://www.incredibleindia.gov.in/en/bihar/patna/patna-museum',
    },
    {
      place: 'Golghar', status: 'reported', days: all('≈09:30 – 18:00'),
      note: 'Listings disagree on hours (some say 10:00 – 17:00) and on whether it closes one day a week. Confirm locally.',
      source: 'Incredible India and travel listings', url: 'https://www.incredibleindia.gov.in/en/bihar/patna/gol-ghar',
    },
  ],
  nalanda: [
    {
      place: 'Nalanda Archaeological Museum', status: 'reported', days: except(4, '09:00 or 10:00 – 17:00'),
      note: 'Most listings say closed on Fridays; sources differ on the opening hour.',
      source: 'Bihar Tourism and travel listings', url: 'https://tourism.bihar.gov.in/en/destinations/nalanda/nalanda-museum',
    },
    {
      place: 'Nalanda Mahavihara ruins', status: 'reported', days: all('09:00 or 10:00 – 17:00'),
      note: 'Some listings report a weekly closing day (Friday or Monday); this is unconfirmed. Check with the site before travelling.',
      source: 'Travel listings (no ASI notice found)', url: 'https://tourism.bihar.gov.in/en/destinations/nalanda/nalanda-ka-khandahar',
    },
  ],
  kakolat: [
    {
      place: 'Kakolat Waterfall', status: 'official', days: all('09:00 – 18:00'), fee: 'Rs 10 per person',
      note: 'Water flow is strongest in the monsoon. Take care on slippery rocks.',
      source: 'Bihar Tourism eco-circuit listing', url: 'https://tourism.bihar.gov.in/en/circuits/eco-circuit',
    },
  ],
  kanwar: [
    {
      place: 'Kabar Taal (Kanwar Lake)', status: 'official', days: all('09:00 – 18:00'), fee: 'Free',
      note: 'Winter mornings are best for birdwatching.',
      source: 'Bihar Tourism eco-circuit listing', url: 'https://tourism.bihar.gov.in/en/circuits/eco-circuit',
    },
  ],
  valmiki: [
    {
      place: 'Valmiki Tiger Reserve', status: 'official', days: all('06:00 – 18:00'), fee: 'Listed as free; safari and permit charges may apply, so confirm with the reserve',
      note: 'Access can be restricted in the monsoon. Book safaris through official forest channels.',
      source: 'Bihar Tourism eco-circuit listing', url: 'https://tourism.bihar.gov.in/en/circuits/eco-circuit',
    },
  ],
  gaya: [
    {
      place: 'Vishnupad Temple', status: 'reported', days: all('≈06:00 – 21:00'),
      note: 'Sources range from 04:00 – 22:00 to a midday break (06:30 – 12:30, 17:00 – 20:00). Phones and cameras are reportedly not allowed inside.',
      source: 'Bihar Tourism and temple listings', url: 'https://tourism.bihar.gov.in/en/destinations/gaya/vishnupad-temple',
    },
  ],
}

export const NO_HOURS = 'Opening hours have not been verified for this place. Please confirm locally or on the official Bihar Tourism site.'

export const weekdayIndex = (dateStr?: string) => {
  if (!dateStr) return undefined
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? undefined : (d.getDay() + 6) % 7
}
