// Single source for external links. verified=false links show a "please verify" notice in the UI.
export const LINKS = {
  irctc: { url: 'https://www.irctc.co.in', label: 'IRCTC', verified: true },
  bsrtc: { url: 'https://bsrtc.bihar.gov.in', label: 'BSRTC', verified: false },
  heli: { url: 'https://bookingtourism.bihar.gov.in/', label: 'HeliYatra', verified: true },
  tourism: { url: 'https://tourism.bihar.gov.in', label: 'Bihar Tourism', verified: true },
  epinddaan: { url: 'https://tourism.bihar.gov.in', label: 'Bihar E-Pinddaan Portal', verified: false },
  airlines: [
    { url: 'https://www.airindia.com', label: 'Air India' },
    { url: 'https://www.goindigo.in', label: 'IndiGo' },
    { url: 'https://www.spicejet.com', label: 'SpiceJet' },
  ],
}
export const gmapsEmbed = (lat: number, lng: number, z = 11) => `https://maps.google.com/maps?q=${lat},${lng}&z=${z}&output=embed`
export const gmapsDir = (from: string, to: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`

// Department contact details as listed in the footer of tourism.bihar.gov.in (read 2026-11-25). Confirm before relying on them.
export const CONTACT = {
  dept: {
    phone: '+91-612-2217045',
    emails: ['secy-tourism-bih@nic.in', 'dir-tourism-bih@nic.in'],
    address: 'Department of Tourism, Government of Bihar, Old Secretariat, Patna-800015',
    hours: '9:30 AM to 6:00 PM, Monday to Friday',
  },
  // National tourist helpline of Incredible India.
  helpline: '1800-11-1363',
  // Set this to the address of the people running this site to offer it as a second recipient.
  siteEmail: '',
}
