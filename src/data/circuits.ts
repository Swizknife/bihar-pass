export interface Circuit {
  id: string
  name: string
  subtitle: string
  tagline: string
  overview: string
  season: string
  places: string[]
  hue: number
}

export const circuits: Circuit[] = [
  {
    id: 'eco', name: 'Eco Circuit', subtitle: 'Wild Bihar', tagline: 'Forests, wetlands and waterfalls', hue: 135,
    overview: 'Bihar\'s natural side: the tiger country of Valmiki, the winter birds of Kabar Taal, the monsoon waterfall of Kakolat and the hills of Rajgir. Plan around the seasons, since wildlife and birdlife peak in winter while waterfalls are best after the rains.',
    season: 'November to March for wildlife and birds; July to September for waterfalls',
    places: ['valmiki', 'kanwar', 'kakolat', 'rajgir'],
  },
  {
    id: 'buddhist', name: 'Buddhist Circuit', subtitle: 'In the footsteps of the Buddha', tagline: 'Stupas, universities and the Bodhi Tree', hue: 38,
    overview: 'The land where the Buddha attained enlightenment, taught and passed his final years. This route links Vaishali and Kesariya north of the Ganga with Rajgir, Nalanda and Bodh Gaya in Magadha.',
    season: 'October to March',
    places: ['vaishali', 'kesariya', 'rajgir', 'nalanda', 'bodh-gaya'],
  },
  {
    id: 'jain', name: 'Jain Circuit', subtitle: 'The path of Mahavira', tagline: 'Birth, teaching and nirvana', hue: 190,
    overview: 'Sites associated with Lord Mahavira, from Vaishali, regarded as his birthplace, to the hills of Rajgir and the Jal Mandir at Pawapuri, where Jains believe he attained nirvana.',
    season: 'October to March',
    places: ['vaishali', 'rajgir', 'pawapuri'],
  },
  {
    id: 'heritage', name: 'Heritage Circuit', subtitle: 'Empires and universities', tagline: 'From Pataliputra to the Pala monasteries', hue: 15,
    overview: 'Ancient capitals, great centres of learning and an Indo-Afghan tomb. Patna stands on the site of Pataliputra, Nalanda and Vikramshila were major Buddhist universities, and Sasaram holds the tomb of Sher Shah Suri.',
    season: 'October to March',
    places: ['patna', 'nalanda', 'vikramshila', 'sasaram'],
  },
  {
    id: 'pilgrim', name: 'Pilgrim Circuit', subtitle: 'Sacred rivers and shrines', tagline: 'Sikh, Hindu and river traditions', hue: 22,
    overview: 'Takht Sri Patna Sahib, the birthplace of Guru Gobind Singh; Gaya, the city of Pinddaan; and Sonepur at the Ganga-Gandak confluence, home of the great Mela. Festival dates change each year, so check the calendar.',
    season: 'October to March; festival seasons are crowded',
    places: ['patna', 'gaya', 'sonepur'],
  },
]

export const getCircuit = (id: string) => circuits.find(c => c.id === id)
