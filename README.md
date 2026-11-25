# Bihar-Pass

A modern, responsive **smart travel & cultural discovery platform** for Bihar. Plan trips, explore destinations, book passes, and discover the culture of Bihar with an interactive, multilingual interface.

**Live Demo:** Runs locally at `http://localhost:5173`  
**GitHub:** [Swizknife/bihar-pass](https://github.com/Swizknife/bihar-pass)

---

## ✨ Features

### Discovery & Exploration
- **Explore Bihar**: Interactive destination grid with filters, search, and category navigation
- **Destination Detail Pages**: History, attractions, photos (from Wikimedia Commons), timing info, nearby places
- **Tour Packages**: Curated 2–7-day packages with day-wise itineraries
- **Experiences & Circuits**: Themed experiences (helicopter rides, cultural tours, eco-circuits)
- **Food Guide**: Interactive 7-dish Bihar food showcase

### Smart Trip Planning
- **Trip Planner**: Multi-step form → rule-based itinerary engine (pace-aware: relaxed/moderate/packed)
- **AI Trip Generator**: Natural language input (e.g., "5 days, spiritual sites, 2 adults 1 child") → auto-generated itinerary
- **Custom Package Builder**: Select places → smart day clustering → activities & timings

### Bihar-Pass System
- **Demo Pass**: Book places as a pass with one QR code
- **Cart & Checkout**: Add trips/packages → edit dates & group size → sandbox payment
- **Pass History**: View downloaded passes with QR codes
- **Sandbox Payment**: Demo payment gateway (UPI, Card, Net Banking) — no real charges

### Transport & Services
- **How to Reach**: Train/Flight/Bus info with redirects to IRCTC, BSRTC, airlines
- **Helicopter Booking**: Link to official helicopter tourism booking
- **E-Pinddaan**: Gaya's spiritual tradition with process guide and official portal link

### Multilingual & Accessible
- **9 Languages**: English, Hindi, Magahi, Japanese, Thai, Vietnamese, Korean, Sinhala, Burmese
- **Language Selector**: Top-right header dropdown, persisted in localStorage
- **Fallback Support**: Magahi → Hindi; new strings default to English
- **Custom i18n**: `tx()` function for interpolation and plurals

### Interactive Chatbot
- **Floating Widget**: Bottom-right expandable chat panel
- **Rule-Based Responder**: Keyword matching → destination/food/transport queries
- **Multilingual Greetings**: English and Hindi intent detection
- **Internal Navigation**: Chatbot suggests links to relevant pages

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript 7 |
| **Build** | Vite 8 |
| **Styling** | Tailwind CSS 3 |
| **Routing** | react-router-dom 7 |
| **UI Components** | lucide-react (icons), Swiper (carousels) |
| **i18n** | Custom `tx()` system + JSON dictionaries |
| **Maps** | Google Maps (keyless embed) |
| **QR Codes** | qrcode library |
| **Photos** | Wikimedia Commons API (runtime cache) |
| **Animations** | framer-motion |
| **Data** | Static JSON in `src/data/` |
| **Storage** | localStorage (passes, cart, preferences) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repo
git clone https://github.com/Swizknife/bihar-pass.git
cd bihar-pass

# Install dependencies
npm install

# Start dev server
npm run dev
# → Open http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
bihar-pass/
├── public/
│   └── images/              # Destination & hero photos (see "Photos" below)
├── src/
│   ├── App.tsx              # Main app + routes + providers
│   ├── main.tsx             # Entry point (loads i18n, renders App)
│   ├── index.css            # Global styles + Tailwind imports
│   │
│   ├── pages/               # Full-page components (routes)
│   │   ├── HomePage.tsx
│   │   ├── ExplorePages.tsx       # Explore grid + filters
│   │   ├── DestinationParts.tsx   # Destination detail view
│   │   ├── PackagePages.tsx       # Package grid & combos
│   │   ├── PackageDetail.tsx
│   │   ├── BookingStudio.tsx      # Custom package builder
│   │   ├── TripPages.tsx          # Trip planner + AI trip
│   │   ├── CartPage.tsx           # Cart + checkout
│   │   ├── PassPages.tsx          # View pass + QR code
│   │   ├── ExperiencePages.tsx
│   │   ├── HelicopterPage.tsx
│   │   ├── CircuitPages.tsx
│   │   ├── InfoPages.tsx          # E-Pinddaan, Transport, About
│   │   ├── ContactPage.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Header (nav, language selector, cart icon) + Footer
│   │   ├── Chatbot.tsx
│   │   ├── Gallery.tsx      # Lightbox image viewer
│   │   ├── HoursTable.tsx   # Destination opening hours
│   │   ├── ItineraryView.tsx # Day-by-day planner output + booking panel
│   │   ├── TripDetailsForm.tsx
│   │   ├── AddToCart.tsx    # "Add to cart" / "Book now" button
│   │   ├── TopDestinations.tsx
│   │   ├── DiscoverBihar.tsx
│   │   └── ui.tsx           # Primitives (Button, Card, Badge, Tabs, etc.)
│   │
│   ├── data/                # Static JSON data
│   │   ├── destinations.ts  # ~30 destinations with coords, hours, notes
│   │   ├── packages.ts      # ~20 tour packages
│   │   ├── experiences.ts
│   │   ├── circuits.ts
│   │   ├── festivals.ts
│   │   ├── hours.ts
│   │   ├── access.ts
│   │   └── misc.ts
│   │
│   ├── lib/                 # Logic & utilities
│   │   ├── cart.tsx         # Cart context & hooks
│   │   ├── tripDetails.tsx  # Trip preferences context
│   │   ├── itinerary.ts     # Rule-based day clustering + timing
│   │   ├── combos.ts        # Package combination logic
│   │   ├── aiTrip.ts        # Natural language → TripPrefs parser
│   │   ├── chatbot.ts       # Rule-based chatbot responder
│   │   ├── pass.ts          # Pass creation, QR, demo rates
│   │   ├── photos.ts        # Wikimedia Commons API cache
│   │   ├── geo.ts           # Haversine distance + geospatial helpers
│   │   ├── timings.ts       # Time slot helpers
│   │   ├── constants.ts     # External URLs, colors, demo rates
│   │   └── utils/           # Date formatting, cn(), etc.
│   │
│   ├── i18n/                # Internationalization
│   │   ├── tx.ts            # tx() function (lookup + interpolation)
│   │   ├── txLoader.ts      # Dictionary loader (lazy-load per language)
│   │   ├── index.ts         # UI strings (navigation, buttons, etc.)
│   │   ├── extra.ts         # Chat titles in all languages
│   │   └── tx/              # Language dictionaries
│   │       ├── hi.json      # Hindi (1200+ entries)
│   │       ├── ja.json      # Japanese
│   │       ├── th.json      # Thai
│   │       ├── vi.json      # Vietnamese
│   │       ├── ko.json      # Korean
│   │       ├── si.json      # Sinhala (TODO)
│   │       └── my.json      # Burmese (TODO)
│   │
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts         # Destination, Package, Pass, etc.
│   │
│   └── styles/
│       └── tailwind/        # Custom Tailwind config
│
├── index.html               # HTML entry point
├── tailwind.config.js       # Tailwind customization (colors, fonts)
├── vite.config.ts           # Vite config
├── tsconfig.json
├── package.json
├── PLAN.md                  # Detailed implementation plan
└── README.md                # This file
```

---

## ⚙️ Configuration

### 1. Photos
Bihar-Pass loads destination photos from **Wikimedia Commons** at runtime (cached in `sessionStorage`). To use custom/local photos:

1. Add `.jpg` or `.png` files to `public/images/` named after the destination ID:
   ```
   bodh-gaya.jpg
   nalanda.jpg
   gaya.jpg
   patna-museum.jpg
   ```
2. Update `src/data/destinations.ts` to reference local images (optional, photos will still load from Commons if available)

### 2. External Links
Edit `src/lib/constants.ts`:

```typescript
// BSRTC bus booking
export const BSRTC_BOOKING = {
  url: 'https://bsrtc.bihar.gov.in/booking',
  verified: true,  // Set to true once URL is confirmed
}

// E-Pinddaan portal
export const EPINDDAAN_PORTAL = {
  url: 'https://epinddaan.bihar.gov.in',
  verified: true,
}

// Demo rates (change to real rates later)
export const PASS_RATES = {
  adult: 100,    // ₹ per site
  child: 50,
}
```

Links with `verified: false` show a "⚠️ Please confirm this address" notice.

### 3. Languages & Translations
Current languages: **English, Hindi, Magahi, Japanese, Thai, Vietnamese, Korean, Sinhala, Burmese**

- **English**: Default; all strings are English keys in code
- **Hindi**: Complete translation (~1200 entries in `src/i18n/tx/hi.json`)
- **Magahi**: Falls back to Hindi (similar dialect)
- **Japanese, Thai, Vietnamese, Korean**: Complete
- **Sinhala, Burmese**: Not yet translated (TODO — see "To-Do" section)

#### Add a New Translation
1. Create `src/i18n/tx/<lang-code>.json`:
   ```json
   {
     "1": "Translated text",
     "2": "Another translation",
     ...
   }
   ```
2. Update `src/i18n/txLoader.ts` to load the new language
3. Update `src/components/Layout.tsx` to add the language to the selector

#### Update Existing Translations
1. Use the scratchpad `tr/merge.py` script (see below)
2. Or manually edit `src/i18n/tx/<lang>.json` entries by id

### 4. Google Maps
Currently uses **keyless embed** (limited to 50 requests/day for development). To add custom markers & interactions:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com)
2. Update `src/lib/constants.ts`:
   ```typescript
   export const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE'
   ```
3. Replace the embed with `@react-google-maps/api` and add custom markers

### 5. Demo Pass Rates
Edit `src/lib/constants.ts`:
```typescript
export const PASS_RATES = {
  adult: 100,  // Change to real prices
  child: 50,
}
```

---

## 📝 Development

### Translation Workflow (Advanced)
If adding new strings or updating translations:

1. Run `npm run extract` to scan code and generate `tr/source.tsv`
2. For each language, create `tr/<lang>_N.tsv` with translations
3. Run `python tr/merge.py <lang>` to merge into `src/i18n/tx/<lang>.json`

(See scratchpad scripts in `tr/` for details.)

### Type Checking
```bash
npx tsc --noEmit
```

### Build & Preview
```bash
npm run build
npm run preview
```

---

## 🎯 Key Concepts

### Trip Planner Engine
- **Input**: Destinations, duration, pace (relaxed/moderate/packed), group size
- **Process**: 
  1. Cluster destinations by geography (Haversine distance)
  2. Assign to days respecting pace-based timing budgets
  3. Generate itinerary with opening hours & activity suggestions
- **Output**: Day-by-day cards with times, activities, next-day route info

### AI Trip Generator
- **Input**: Natural language (e.g., "5 days, spiritual sites, 2 adults 1 child")
- **Process**: Keyword extraction → map to destination tags & group size → feed to planner engine
- **Output**: Same itinerary format as trip planner

### Bihar-Pass System
- **Demo System**: No real payments; sandbox only
- **Flow**: Select destinations/packages → add to cart → set dates & group size → checkout → sandbox payment → QR code
- **Storage**: 
  - Passes stored in `localStorage` under `biharPasses`
  - Cart stored in `localStorage` under `biharPassCart`
- **Pricing**: Demo rates (₹100/adult/site, ₹50/child/site)

### Internationalization (`tx()`)
- **Lookup**: English text as key; language-specific value from JSON
- **Interpolation**: `tx('Hello {{name}}', { name: 'Alice' })` → "Hello Alice"
- **Plurals**: `txn(count, 'one item', '{{n}} items')` → "3 items"
- **Fallback**: Unknown keys → return English key; Magahi → Hindi

---

## 🧪 Testing

The app uses:
- **TypeScript**: Compile-time type checking (`npx tsc --noEmit`)
- **Vite Build**: Production bundling (`npm run build`)
- **Manual Browser Testing**: No automated test suite yet (future work)

**To verify**:
1. `npm run dev` → no errors in terminal
2. Visit `http://localhost:5173` → all pages load
3. Test language selector → text changes
4. Add package to cart → shows in `/cart`
5. Try trip planner → generates itinerary
6. View pass → QR code displays

---

## 📋 To-Do / Known Limitations

### Translations
- [ ] Complete Sinhala (`src/i18n/tx/si.json`) — 1200 entries needed
- [ ] Complete Burmese (`src/i18n/tx/my.json`) — 1200 entries needed
- [ ] Translate new strings (IDs ≥1206) into all 7 non-English languages

### Backend (Future Phase)
- [ ] User accounts & authentication
- [ ] Real payment gateway integration (Razorpay, PayU, etc.)
- [ ] Database for bookings, passes, users
- [ ] Email confirmations & pass delivery
- [ ] Admin dashboard for managing destinations, packages, rates

### Enhancements
- [ ] Automated test suite (Jest, React Testing Library)
- [ ] SEO optimization (sitemap, meta tags)
- [ ] Analytics integration (Google Analytics, Mixpanel)
- [ ] Progressive Web App (PWA) support
- [ ] Dark mode toggle
- [ ] Accessibility audit (WCAG 2.1)

---

## 🔗 External Links

- **IRCTC** (Train Booking): https://www.irctc.co.in/
- **BSRTC** (Bus Booking): https://bsrtc.bihar.gov.in/ (verify & update in `constants.ts`)
- **E-Pinddaan** (Gaya Tradition): https://epinddaan.bihar.gov.in/ (verify & update)
- **Helicopter Booking**: https://bookingtourism.bihar.gov.in/

---

## 📄 License

Open source. See project for details.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📧 Support

For issues, feature requests, or questions:
- Open an [Issue](https://github.com/Swizknife/bihar-pass/issues)
- Check [PLAN.md](PLAN.md) for the original implementation plan

---

**Built with ❤️ for Bihar Tourism**
