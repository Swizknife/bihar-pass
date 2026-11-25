import type { FoodItem } from '../types'

export const foods: FoodItem[] = [
  { id: 'litti-chokha', name: 'Litti Chokha', hue: 30, description: 'Roasted wheat balls stuffed with spiced sattu, served with mashed smoky vegetables and ghee.', significance: 'The signature dish of Bihar, eaten across the state.' },
  { id: 'thekua', name: 'Thekua', hue: 40, description: 'A crisp, sweet deep-fried cookie of wheat flour, jaggery and ghee.', significance: 'A traditional offering (prasad) during Chhath Puja.' },
  { id: 'khaja', name: 'Khaja', hue: 45, description: 'A layered, flaky sweet pastry dusted or soaked with sugar.', significance: 'Famous in the Nalanda and Rajgir region.' },
  { id: 'silao-khaja', name: 'Silao Khaja', hue: 50, description: 'A crisp, many-layered Khaja from Silao in Nalanda district.', significance: 'A well-known regional sweet bought by travellers on the Rajgir route.' },
  { id: 'malpua', name: 'Malpua', hue: 25, description: 'Sweet pancakes fried in ghee and dipped in sugar syrup.', significance: 'Commonly prepared at festivals such as Holi.' },
  { id: 'dal-pitha', name: 'Dal Pitha', hue: 60, description: 'Rice-flour dumplings filled with spiced lentils, steamed or boiled.', significance: 'A comfort food, especially in winter and festive seasons.' },
  { id: 'sattu-paratha', name: 'Sattu Paratha', hue: 35, description: 'Flatbread stuffed with roasted gram flour, onions and spices.', significance: 'Sattu is a traditional energy food of Bihar.' },
]

export const culture = [
  { title: 'History and Heritage', hue: 15, text: 'Home to ancient Magadha, Mauryan Pataliputra, and the universities of Nalanda and Vikramshila.' },
  { title: 'Festivals', hue: 28, text: 'Chhath Puja, Sonepur Mela, Buddha Purnima, Pitru Paksha Mela and Sama-Chakeva.' },
  { title: 'Art and Crafts', hue: 330, text: 'Madhubani painting, Sujni embroidery, Sikki grass craft and Tikuli art.' },
  { title: 'Languages', hue: 205, text: 'Hindi and Urdu, alongside Maithili, Bhojpuri and Magahi.' },
  { title: 'Traditions', hue: 120, text: 'Folk music and dance, Bidesia, Jat-Jatin and strong river-centred rituals.' },
  { title: 'Religious Significance', hue: 38, text: 'A meeting place of Buddhism, Jainism, Hinduism, Sikhism and Islam.' },
]

export const seasons = [
  { name: 'Winter (Nov to Feb)', weather: 'Cool and dry; pleasant sightseeing.', picks: ['Bodh Gaya', 'Nalanda', 'Rajgir', 'Patna', 'Valmiki Tiger Reserve (wildlife)', 'Kabar Taal (migratory birds)'], events: 'Sonepur Mela (Nov), Buddhist pilgrim season' },
  { name: 'Summer (Mar to Jun)', weather: 'Hot, often very hot by May-June.', picks: ['Early March visits to Patna', 'Buddha Purnima at Bodh Gaya (April/May)'], events: 'Buddha Purnima; Chaiti Chhath' },
  { name: 'Monsoon (Jul to Sep)', weather: 'Warm and humid with heavy rain; landscapes turn green.', picks: ['Kakolat Waterfall', 'Pawapuri lotus pond', 'Rajgir hills'], events: 'Shravani Mela season; some wildlife areas restrict access' },
  { name: 'Post-monsoon (Sep to Oct)', weather: 'Humid, clearing; temperatures easing.', picks: ['Gaya (Pitru Paksha)', 'Madhubani (Durga Puja season)'], events: 'Pitru Paksha Mela, Durga Puja, Chhath Puja (Oct/Nov)' },
]

export const airports = [
  { name: 'Jay Prakash Narayan International Airport, Patna', code: 'PAT', lat: 25.5913, lng: 85.088 },
  { name: 'Gaya International Airport', code: 'GAY', lat: 24.7443, lng: 84.9512 },
  { name: 'Darbhanga Airport', code: 'DBR', lat: 26.1947, lng: 85.9174 },
]
export const stations = [
  { name: 'Patna Junction', lat: 25.6035, lng: 85.1376 },
  { name: 'Gaya Junction', lat: 24.801, lng: 84.9994 },
  { name: 'Rajgir', lat: 25.027, lng: 85.418 },
  { name: 'Muzaffarpur Junction', lat: 26.12, lng: 85.379 },
  { name: 'Hajipur Junction', lat: 25.686, lng: 85.208 },
  { name: 'Darbhanga Junction', lat: 26.167, lng: 85.887 },
  { name: 'Bhagalpur Junction', lat: 25.238, lng: 87.008 },
  { name: 'Sasaram Junction', lat: 24.95, lng: 84.03 },
  { name: 'Narkatiaganj Junction', lat: 27.042, lng: 84.461 },
]
export const busTerminals = [
  { name: 'Patna bus terminals', note: 'BSRTC and private buses to most Bihar towns.' },
  { name: 'Gaya Bus Stand', note: 'Connects to Bodh Gaya, Rajgir and Patna.' },
  { name: 'Rajgir Bus Stand', note: 'Local services to Nalanda and Bihar Sharif.' },
  { name: 'Muzaffarpur Bus Stand', note: 'Services to Vaishali, Darbhanga and Patna.' },
]
export const highways = ['NH 19 (Patna-Gaya-Sasaram corridor)', 'NH 22 (Patna-Hajipur-Muzaffarpur)', 'NH 27 (East-West corridor, north Bihar)']

export const pinddaanSteps = [
  { title: 'Understand the service', text: 'Read about the pilgrimage services offered by the government for Pinddaan at Gaya.' },
  { title: 'Check eligibility and requirements', text: 'Confirm the requirements listed on the official portal before you start.' },
  { title: 'Register or apply online', text: 'Use the official portal to register or apply, if offered for your travel dates.' },
  { title: 'Provide required details and documents', text: 'Keep identity and travel details ready as the portal specifies.' },
  { title: 'Verification or approval', text: 'Any verification is performed by the responsible authority, as described on the portal.' },
  { title: 'Payment (if applicable)', text: 'Pay only through the official portal. Never pay an unofficial individual.' },
  { title: 'Confirmation and instructions', text: 'Save your confirmation and follow the instructions for reaching Gaya.' },
]
