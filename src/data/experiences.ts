// Suggested things to do and try. General suggestions only; confirm operating days, rules and prices locally.
export interface Experience { activities: string[]; mustTry: string[] }

export const experiences: Record<string, Experience> = {
  patna: {
    activities: ['Pay respects at Takht Sri Patna Sahib', 'Climb the staircase of Golghar for views over the city and Ganga', 'Walk the Ganga ghats in the evening', 'Spend a morning at the Bihar Museum or Patna Museum'],
    mustTry: ['Litti chokha', 'Sattu sharbat', 'Khaja', 'Thekua'],
  },
  'bodh-gaya': {
    activities: ['Sit quietly near the Bodhi Tree', 'Attend the daily chanting at the Mahabodhi Temple', 'Visit monasteries built by different countries', 'Take an evening walk around the temple complex'],
    mustTry: ['Gaya\'s tilkut (sesame sweet)', 'Litti chokha'],
  },
  gaya: {
    activities: ['Visit Vishnupad Temple', 'Spend an evening at the Phalgu river ghats', 'See the Akshayavat', 'Climb Brahmayoni Hill for views'],
    mustTry: ['Gaya\'s tilkut (sesame sweet)'],
  },
  rajgir: {
    activities: ['Ride the ropeway to the peace pagoda (check operating status)', 'Soak at the hot springs of Brahmakund', 'Walk along the Cyclopean Wall', 'Visit the nature safari area'],
    mustTry: ['Silao khaja on the way to or from Nalanda', 'Fresh local sweets'],
  },
  nalanda: {
    activities: ['Take a guided walk through the ruins', 'See the museum collection', 'Pay respects at the Xuanzang Memorial Hall'],
    mustTry: ['Silao khaja'],
  },
  vaishali: {
    activities: ['See the Ashokan Pillar', 'Walk around the coronation tank', 'Visit the relic stupa and peace pagoda'],
    mustTry: ['Seasonal litchi, if you visit around May and June'],
  },
  pawapuri: {
    activities: ['Walk the causeway to the Jal Mandir', 'See the lotus pond in the monsoon'],
    mustTry: ['Local sweets in nearby Rajgir'],
  },
  valmiki: {
    activities: ['Go on a jungle safari (book officially)', 'Birdwatching in the early morning', 'Visit the Valmiki Ashram', 'See the Gandak barrage'],
    mustTry: [],
  },
  madhubani: {
    activities: ['Watch artists paint in the villages', 'Buy Madhubani art directly from artists', 'Ask about a short painting workshop'],
    mustTry: ['Makhana (fox nut) snacks'],
  },
  sonepur: {
    activities: ['Visit the Harihar Nath Temple', 'Walk the confluence ghats', 'Join the Sonepur Mela if it is on'],
    mustTry: ['Local mela snacks and sweets'],
  },
  kakolat: {
    activities: ['Enjoy the waterfall (take care on slippery rocks)', 'Picnic by the pool', 'Climb to the hilltop viewpoint'],
    mustTry: [],
  },
  sasaram: {
    activities: ['Walk around the tomb and its lake', 'Photograph the tomb at sunrise or sunset'],
    mustTry: [],
  },
  kanwar: {
    activities: ['Go birdwatching at dawn', 'Walk the wetland edge'],
    mustTry: [],
  },
  vikramshila: {
    activities: ['Walk through the monastery ruins', 'Visit the small museum'],
    mustTry: [],
  },
  kesariya: {
    activities: ['Walk around the tiers of the great stupa'],
    mustTry: [],
  },
}

export const experienceFor = (id: string): Experience => experiences[id] ?? { activities: [], mustTry: [] }
