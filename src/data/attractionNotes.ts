import { tx } from '../i18n/tx'

// One short, conservative line per attraction. Attractions not listed fall back to a generic line.
export const attractionNotes: Record<string, string> = {
  'bodh-gaya:Mahabodhi Temple Complex': 'A UNESCO World Heritage Site marking the place where the Buddha is traditionally said to have attained enlightenment.',
  'bodh-gaya:Bodhi Tree': 'A sacred fig tree beside the temple, descended according to tradition from the tree under which the Buddha meditated.',
  'bodh-gaya:Great Buddha Statue': 'A large seated Buddha statue set in a garden, and a popular stop for visitors.',
  'bodh-gaya:Monasteries of different nations': 'Monasteries built by Buddhist countries such as Thailand, Japan and Bhutan, each in its own architectural style.',
  'bodh-gaya:Archaeological Museum': 'Displays sculptures and antiquities found around Bodh Gaya.',
  'gaya:Vishnupad Temple': 'Enshrines a footprint associated with Lord Vishnu and is central to Pinddaan rituals.',
  'gaya:Phalgu River ghats': 'Ritual bathing and offerings take place along the river, especially during Pitru Paksha.',
  'gaya:Akshayavat': 'A sacred banyan tree associated with Pinddaan rites.',
  'gaya:Brahmayoni Hill': 'A hill with a shrine at the top, reached by a climb of steps, with views over the city.',
  'gaya:Mangla Gauri Temple': 'A revered temple of the Goddess, counted among the Shakti shrines of the region.',
  'rajgir:Vishwa Shanti Stupa': 'A white peace pagoda on a hilltop, reached on foot or by ropeway.',
  'rajgir:Gridhakuta (Vulture Peak)': 'A hill linked in tradition with the Buddha\'s teachings.',
  'rajgir:Ancient Cyclopean Wall': 'Remains of an ancient stone fortification around old Rajgir.',
  'rajgir:Hot springs (Brahmakund)': 'Natural hot springs held sacred by Hindus.',
  'rajgir:Rajgir Nature Safari': 'A forest safari area in the Rajgir hills.',
  'nalanda:Nalanda Mahavihara ruins': 'Excavated monasteries, temples and stupas of the ancient Buddhist university.',
  'nalanda:Nalanda Archaeological Museum': 'Houses antiquities excavated at the site.',
  'nalanda:Xuanzang Memorial Hall': 'A memorial to the Chinese pilgrim-scholar who studied at Nalanda.',
  'nalanda:Nava Nalanda Mahavihara': 'A modern institute for Buddhist studies and Pali.',
  'patna:Takht Sri Patna Sahib': 'The birthplace of Guru Gobind Singh and one of the five Takhts of Sikhism.',
  'patna:Golghar': 'A beehive-shaped granary of the colonial era with a spiral staircase and views over the city.',
  'patna:Patna Museum': 'A long-established museum of Bihar\'s art and archaeology.',
  'patna:Bihar Museum': 'A modern museum presenting Bihar\'s history and art.',
  'patna:Kumhrar (Pataliputra excavations)': 'Excavated remains linked with ancient Pataliputra.',
  'patna:Ganga ghats': 'Riverfront steps used for bathing, rituals and evening gatherings.',
  'vaishali:Ashokan Pillar': 'A single polished stone pillar topped with a lion capital.',
  'vaishali:Relic Stupa': 'An early Buddhist stupa associated with the Buddha\'s relics.',
  'vaishali:Abhishek Pushkarni (coronation tank)': 'A sacred tank believed to have been used in the coronation of Lichchhavi leaders.',
  'vaishali:Vishwa Shanti Stupa': 'A modern peace pagoda near the ancient sites.',
  'vaishali:Vaishali Museum': 'A small museum of finds from the area.',
  'pawapuri:Jal Mandir': 'A white marble temple in the middle of a lotus pond, marking the traditional place of Mahavira\'s cremation.',
  'sonepur:Harihar Nath Temple': 'A temple at the Ganga-Gandak confluence, central to the Sonepur Mela.',
  'valmiki:Jungle safari': 'Forest and grassland drives in search of wildlife.',
  'valmiki:Birdwatching': 'The reserve\'s mix of forest and river habitats attracts many bird species.',
}

export const attractionNote = (destId: string, name: string, tagline: string) => {
  const note = attractionNotes[`${destId}:${name}`]
  return note ? tx(note) : tx('Part of a visit to this destination: {{t}}.', { t: tx(tagline).toLowerCase() })
}
