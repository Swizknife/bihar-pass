import type { TourPackage } from '../types'
import { generateItinerary } from '../lib/itinerary'
import { getDestination } from './destinations'
import { tx, txn, fmtDate, fmtDateTime, locale } from '../i18n/tx'

type Day = [title: string, stops: string[], note: string]

const pk = (id: string, title: string, hue: number, summary: string, bestFor: string[], days: Day[]): TourPackage => ({
  id, title, days: days.length, hue, summary, bestFor,
  destinations: [...new Set(days.flatMap(d => d[1]))],
  itinerary: days.map(([t, stops, note]) => ({ title: t, stops, note })),
})

export const packages: TourPackage[] = [
  // 1 day
  pk('patna-in-a-day', 'Patna in a Day', 205, 'The capital\'s best in one day: Sikh shrine, Golghar and a museum.', ['Short stays', 'Families'], [
    ['Patna', ['patna'], 'Takht Sri Patna Sahib, Golghar, a museum and the Ganga ghats.'],
  ]),
  pk('rajgir-nalanda-day', 'Rajgir and Nalanda in a Day', 120, 'Two ancient Magadha sites that sit close together.', ['Day trippers', 'History lovers'], [
    ['Rajgir and Nalanda', ['rajgir', 'nalanda'], 'Peace pagoda and hills in the morning; the university ruins in the afternoon.'],
  ]),
  pk('gaya-bodh-gaya-day', 'Gaya and Bodh Gaya in a Day', 38, 'Vishnupad Temple and the Mahabodhi Temple in one day.', ['Pilgrims'], [
    ['Gaya and Bodh Gaya', ['gaya', 'bodh-gaya'], 'Vishnupad Temple, then the Mahabodhi Temple and the monasteries.'],
  ]),

  // 2 days
  pk('bodh-gaya-spiritual', 'Bodh Gaya Spiritual Experience', 38, 'A short pilgrimage to the Mahabodhi Temple and Gaya\'s Vishnupad.', ['Pilgrims', 'Solo travellers'], [
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple, Bodhi Tree and international monasteries.'],
    ['Gaya', ['gaya'], 'Vishnupad Temple and Phalgu ghats; depart from Gaya Junction or airport.'],
  ]),
  pk('patna-heritage', 'Patna Heritage Tour', 205, 'Capital-city heritage: Patna Sahib, museums, Golghar and the Ganga.', ['Families', 'History lovers'], [
    ['Old Patna', ['patna'], 'Takht Sri Patna Sahib, Golghar and the ghats.'],
    ['Museums and Sonepur', ['patna', 'sonepur'], 'Museums in the morning; Harihar Nath Temple at Sonepur in the afternoon.'],
  ]),
  pk('rajgir-nalanda-pawapuri', 'Rajgir, Nalanda and Pawapuri', 150, 'Hills, a university and a Jain pilgrimage site in two relaxed days.', ['Families', 'Pilgrims'], [
    ['Rajgir', ['rajgir'], 'Vishwa Shanti Stupa, Gridhakuta and the hot springs.'],
    ['Nalanda and Pawapuri', ['nalanda', 'pawapuri'], 'Ruins and museum, then the Jal Mandir.'],
  ]),
  pk('patna-sahib-sonepur', 'Patna Sahib and Sonepur', 28, 'A Sikh shrine and the Ganga-Gandak confluence.', ['Pilgrims'], [
    ['Patna', ['patna'], 'Takht Sri Patna Sahib and the old city.'],
    ['Sonepur', ['sonepur'], 'Harihar Nath Temple and the confluence ghats.'],
  ]),

  // 3 days
  pk('buddhist-circuit-3', 'Buddhist Circuit: Bodh Gaya, Rajgir and Nalanda', 120, 'The classic three-site Buddhist route of Magadha.', ['Pilgrims', 'Heritage', 'Families'], [
    ['Bodh Gaya', ['bodh-gaya'], 'Temple complex and monasteries.'],
    ['Rajgir', ['rajgir'], 'Vishwa Shanti Stupa, Gridhakuta and hot springs.'],
    ['Nalanda', ['nalanda'], 'Ruins and museum; onward to Patna.'],
  ]),
  pk('patna-vaishali-sonepur', 'Patna, Vaishali and Sonepur', 70, 'City heritage plus the early republic of Vaishali.', ['History lovers', 'Families'], [
    ['Patna', ['patna'], 'Patna Sahib, Golghar, museums.'],
    ['Vaishali', ['vaishali'], 'Ashokan pillar, relic stupa and coronation tank.'],
    ['Sonepur', ['sonepur'], 'Harihar Nath Temple and the river confluence.'],
  ]),
  pk('family-magadha-3', 'Family-Friendly Magadha', 140, 'Gentle days with short drives and plenty to see for all ages.', ['Families', 'Children'], [
    ['Rajgir', ['rajgir'], 'Ropeway (check status), peace pagoda and nature safari area.'],
    ['Nalanda and Pawapuri', ['nalanda', 'pawapuri'], 'Open-air ruins and the lotus-pond temple.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Temple complex, Great Buddha statue and monasteries.'],
  ]),
  pk('pilgrim-magadha-3', 'Pilgrim\'s Magadha', 30, 'Hindu and Buddhist holy places in three days.', ['Pilgrims'], [
    ['Gaya', ['gaya'], 'Vishnupad Temple and the Phalgu river.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple and Bodhi Tree.'],
    ['Rajgir', ['rajgir'], 'Gridhakuta and the peace pagoda.'],
  ]),
  pk('jain-circuit-3', 'Jain Circuit', 190, 'Vaishali, Rajgir and Pawapuri: places linked with Lord Mahavira.', ['Jain pilgrims', 'Heritage'], [
    ['Vaishali', ['vaishali'], 'Regarded as Mahavira\'s birthplace.'],
    ['Rajgir', ['rajgir'], 'Hills associated with early Jain tradition.'],
    ['Pawapuri', ['pawapuri'], 'Jal Mandir, where Jains believe Mahavira attained nirvana.'],
  ]),
  pk('waterfalls-hills-3', 'Waterfalls and Hills', 175, 'Best in the monsoon: a waterfall, the Rajgir hills and a lotus pond.', ['Nature lovers', 'Families'], [
    ['Kakolat Waterfall', ['kakolat'], 'Waterfall and hilltop viewpoint; take care on slippery rocks.'],
    ['Rajgir', ['rajgir'], 'Hills, hot springs and the ropeway (check status).'],
    ['Pawapuri', ['pawapuri'], 'Jal Mandir and the lotus pond.'],
  ]),
  pk('mithila-art-3', 'Mithila Art Trail', 330, 'From Patna through the Kabar Taal wetland to the painting villages of Madhubani.', ['Culture lovers', 'Photographers'], [
    ['Patna', ['patna'], 'Museums and the city\'s heritage.'],
    ['Kabar Taal', ['kanwar'], 'Wetland birdwatching on the way north-east.'],
    ['Madhubani', ['madhubani'], 'Artist villages and Mithila painting (long road day).'],
  ]),
  pk('wild-valmiki-3', 'Wild Valmiki Escape', 135, 'Two days in tiger country and a heritage stop on the way back.', ['Wildlife lovers', 'Adventurers'], [
    ['Valmiki Tiger Reserve', ['valmiki'], 'Arrive and settle in; evening walk and birdwatching.'],
    ['Valmiki Tiger Reserve', ['valmiki'], 'Jungle safari booked through official channels.'],
    ['Kesariya', ['kesariya'], 'The great Kesariya Stupa on the way back.'],
  ]),
  pk('patna-nalanda-sasaram', 'Pataliputra to Sasaram', 15, 'Pataliputra, Pala-era ruins and a tomb on a lake.', ['History lovers'], [
    ['Patna', ['patna'], 'Kumhrar excavations, Golghar, museums.'],
    ['Nalanda', ['nalanda'], 'Mahavihara ruins and museum.'],
    ['Sasaram', ['sasaram'], 'Sher Shah Suri Tomb on its lake.'],
  ]),

  // 4 days
  pk('buddhist-highlights-4', 'Buddhist Highlights', 100, 'Vaishali, Nalanda, Rajgir and Bodh Gaya at an easy pace.', ['Pilgrims', 'Heritage'], [
    ['Vaishali', ['vaishali'], 'Early Buddhist remains north of the Ganga.'],
    ['Nalanda', ['nalanda'], 'The ancient university.'],
    ['Rajgir', ['rajgir'], 'Hills and the peace pagoda.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple and monasteries.'],
  ]),
  pk('patna-magadha-4', 'Patna and Magadha Heritage', 205, 'Capital, ruins, hills and the place of enlightenment.', ['History lovers', 'Families'], [
    ['Patna', ['patna'], 'City heritage and museums.'],
    ['Nalanda', ['nalanda'], 'Ruins and museum.'],
    ['Rajgir', ['rajgir'], 'Hills, stupa and springs.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple.'],
  ]),

  // 5 days
  pk('buddhist-heritage-5', 'Complete Buddhist Heritage Experience', 100, 'From Vaishali and Kesariya to Bodh Gaya, Rajgir and Nalanda.', ['Pilgrims', 'Heritage enthusiasts'], [
    ['Patna', ['patna'], 'Arrive and see the city\'s museums.'],
    ['Vaishali and Kesariya', ['vaishali', 'kesariya'], 'Early Buddhist sites north of the Ganga.'],
    ['Nalanda and Rajgir', ['nalanda', 'rajgir'], 'Ancient university and Magadha\'s capital.'],
    ['Rajgir and Pawapuri', ['rajgir', 'pawapuri'], 'Hills and Jain pilgrimage site.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple; depart via Gaya.'],
  ]),
  pk('historical-bihar-5', 'Historical Bihar Exploration', 15, 'Mauryan Pataliputra, Pala-era universities and Sher Shah\'s tomb.', ['History lovers'], [
    ['Patna', ['patna'], 'Kumhrar excavations, Golghar, museums.'],
    ['Nalanda', ['nalanda'], 'Mahavihara ruins and museum.'],
    ['Rajgir', ['rajgir'], 'Cyclopean wall and hills.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple.'],
    ['Sasaram', ['sasaram'], 'Sher Shah Suri Tomb on the way out.'],
  ]),
  pk('eco-explorer-5', 'Eco Circuit Explorer', 135, 'Tiger reserve, wetland birds, hills and a waterfall.', ['Nature lovers', 'Wildlife lovers'], [
    ['Valmiki Tiger Reserve', ['valmiki'], 'Arrival and forest walk.'],
    ['Valmiki Tiger Reserve', ['valmiki'], 'Jungle safari booked officially.'],
    ['Kabar Taal', ['kanwar'], 'Birdwatching at the wetland.'],
    ['Rajgir', ['rajgir'], 'Hills and nature safari area.'],
    ['Kakolat Waterfall', ['kakolat'], 'Waterfall and viewpoint on the way south.'],
  ]),
  pk('sacred-bihar-5', 'Sacred Bihar', 22, 'Sikh, Hindu, Jain and Buddhist places in five days.', ['Pilgrims', 'Spiritual seekers'], [
    ['Patna', ['patna'], 'Takht Sri Patna Sahib.'],
    ['Sonepur and Vaishali', ['sonepur', 'vaishali'], 'River confluence and ancient republic.'],
    ['Rajgir', ['rajgir'], 'Gridhakuta and the peace pagoda.'],
    ['Gaya', ['gaya'], 'Vishnupad Temple.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple.'],
  ]),

  // 6 days
  pk('buddhist-jain-6', 'Buddhist and Jain Bihar', 60, 'The Buddha\'s and Mahavira\'s Bihar in six days.', ['Pilgrims', 'Heritage'], [
    ['Patna', ['patna'], 'Arrive; museums and Patna Sahib.'],
    ['Vaishali and Kesariya', ['vaishali', 'kesariya'], 'Stupas and the Ashokan pillar.'],
    ['Rajgir and Pawapuri', ['rajgir', 'pawapuri'], 'Hills, then the Jal Mandir.'],
    ['Nalanda', ['nalanda'], 'Ruins and museum.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple.'],
    ['Gaya', ['gaya'], 'Vishnupad Temple; depart.'],
  ]),

  // 7 days
  pk('grand-cultural-7', 'Grand Bihar Cultural and Heritage Tour', 330, 'A full sweep of heritage, Mithila art and Buddhist sites.', ['Culture lovers', 'Long stays'], [
    ['Patna', ['patna'], 'City heritage.'],
    ['Sonepur and Vaishali', ['sonepur', 'vaishali'], 'River confluence and ancient republic.'],
    ['Madhubani', ['madhubani'], 'Mithila painting villages (long road day).'],
    ['Return and rest', ['patna'], 'Buffer day to return to Patna.'],
    ['Nalanda', ['nalanda'], 'Ancient university ruins.'],
    ['Rajgir', ['rajgir'], 'Hills, stupa and springs.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple.'],
  ]),
  pk('spiritual-circuit-7', 'Bihar Spiritual and Religious Circuit', 22, 'Sikh, Jain, Buddhist and Hindu sacred sites in one route.', ['Pilgrims', 'Spiritual seekers'], [
    ['Patna', ['patna'], 'Takht Sri Patna Sahib.'],
    ['Vaishali', ['vaishali'], 'Buddhist and Jain associations.'],
    ['Pawapuri', ['pawapuri'], 'Jal Mandir.'],
    ['Rajgir', ['rajgir'], 'Vishwa Shanti Stupa and Gridhakuta.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple.'],
    ['Gaya', ['gaya'], 'Vishnupad Temple.'],
    ['Rest and departure', ['gaya'], 'Buffer day for rituals or departure.'],
  ]),
  pk('bihar-highlights-7', 'Bihar Highlights Week', 205, 'Capital, ancient capitals, holy places and a tomb: the best of Bihar in a week.', ['First-time visitors', 'Long stays'], [
    ['Patna', ['patna'], 'Museums, Golghar and Patna Sahib.'],
    ['Vaishali', ['vaishali'], 'Ashokan pillar and stupas.'],
    ['Nalanda', ['nalanda'], 'Ancient university.'],
    ['Rajgir and Pawapuri', ['rajgir', 'pawapuri'], 'Hills and the Jal Mandir.'],
    ['Bodh Gaya', ['bodh-gaya'], 'Mahabodhi Temple.'],
    ['Gaya', ['gaya'], 'Vishnupad Temple.'],
    ['Sasaram', ['sasaram'], 'Sher Shah Suri Tomb on the way out.'],
  ]),
]

export const getPackage = (id: string) => packages.find(p => p.id === id)

// A package built on the fly from the places a visitor picked.
export function customPackage(siteIds: string[], days: number, pace: 'relaxed' | 'moderate' | 'packed' = 'moderate'): TourPackage {
  const valid = [...new Set(siteIds)].filter(id => getDestination(id))
  const it = generateItinerary({ startDate: '', days: Math.max(1, days), destinationIds: valid, interests: [], pace })
  const short = (id: string) => tx(getDestination(id)?.name.split(' (')[0] ?? id)
  const itinerary = it.days.map(d => {
    const ids = [...new Set(d.stops.map(s => s.id))]
    return {
      title: ids.length ? ids.map(short).join(tx(' and ')) : tx('Free day'),
      stops: ids,
      note: ids.length ? d.stops.map(s => s.items.map(i => tx(i.name)).join(', ')).join('; ') : tx('Rest, shop for local crafts, or revisit a favourite place.'),
    }
  })
  return {
    id: 'custom', title: tx('Your custom Bihar package'), days: itinerary.length, hue: 25,
    summary: tx('Built from the places you chose.'), bestFor: [tx('Your group')], itinerary,
    destinations: [...new Set(itinerary.flatMap(d => d.stops))],
  }
}
