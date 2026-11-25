// Dates vary each year; the notes avoid fixed dates. Confirm on the official Bihar Tourism calendar.
export interface Festival { name: string; text: string }

export const festivals: Record<string, Festival[]> = {
  'bodh-gaya': [{ name: 'Buddha Purnima', text: 'Marks the birth, enlightenment and passing of the Buddha, with prayers and processions at the Mahabodhi Temple. It falls on the full moon of the Vaishakha month, usually in April or May.' }],
  gaya: [{ name: 'Pitru Paksha Mela', text: 'A fortnight, usually in September or October, when Hindus offer Pinddaan for their ancestors. Gaya is extremely crowded then, so plan and book early.' }],
  patna: [
    { name: 'Chhath Puja', text: 'A major festival of Bihar in which devotees offer prayers to the Sun at river ghats at sunrise and sunset. It is usually held in October or November.' },
    { name: 'Guru Gobind Singh Jayanti', text: 'Celebrated at Takht Sri Patna Sahib, the Guru\'s birthplace. The date follows the Sikh calendar.' },
  ],
  sonepur: [{ name: 'Sonepur Mela', text: 'A traditional fair at the Ganga-Gandak confluence around Kartik Purnima, usually in November, combining religious bathing, trade and cultural programmes.' }],
  rajgir: [{ name: 'Rajgir Mahotsav', text: 'A cultural festival of music and dance held in Rajgir. Dates are announced by the state tourism department each year.' }],
  vaishali: [{ name: 'Vaishali Mahotsav', text: 'A cultural festival linked with Vaishali\'s association with Mahavira, usually held in spring. Check the official calendar for dates.' }],
  pawapuri: [{ name: 'Diwali at Jal Mandir', text: 'Jain pilgrims gather at the Jal Mandir around Diwali, which Jains observe as the day of Mahavira\'s nirvana.' }],
}

export const festivalsFor = (id: string) => festivals[id] ?? []
export const allFestivals = Object.entries(festivals).flatMap(([id, list]) => list.map(f => ({ ...f, id })))
