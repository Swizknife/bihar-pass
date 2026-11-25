# Bihar Tourism Platform — Implementation Plan

## Context

Build a modern, responsive Bihar Tourism website from scratch (empty workspace). The platform unifies tourism discovery, curated travel packages, personalized trip planning, cultural exploration, E-Pinddaan info, and transport booking redirections into a single digital gateway.

**Decisions made:**
- Frontend-first approach (React + TypeScript + Tailwind + Vite) with static JSON data
- Rule-based smart logic for chatbot and trip generator (no external AI API)
- Google Maps integration with placeholder until API key is provided
- Backend/database to be added in a future phase

---

## Phase 1: Project Setup & Design System

### 1A. Scaffold the project
- Initialize Vite + React + TypeScript project
- Install core dependencies: `react-router-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `clsx`, `tailwind-merge`, `framer-motion`, `swiper`, `react-helmet-async`
- Configure Tailwind with Bihar Tourism design tokens:
  - Colors: ivory `#FFFFF0`, cream `#FFF8E7`, terracotta `#C75B39`, gold `#D4A843`, forest `#2D5016`, charcoal `#2C2C2C`, accent-teal `#1A6B5C`
  - Fonts: Playfair Display (headings), Inter (body), Noto Sans Devanagari (Hindi scripts)
- Set up React Router with all routes
- Create `.gitignore`, `.env.example`

### 1B. Shared UI components (`src/components/ui/`)
- Button, Card, Badge, Container, Tabs, Modal, Breadcrumb, Skeleton, Carousel (using Swiper)
- Layout: Header (responsive navbar with language selector placeholder), Footer, MobileNav, PageLayout

### 1C. Data layer (`src/data/` and `src/types/`)
- TypeScript interfaces for: Destination, TourPackage, DayPlan, Activity, FoodItem, TransportRoute, ChatMessage
- Static data files with real Bihar information for ~15-20 destinations, 6-8 tour packages, 7 food items, transport routes
- Lookup utilities: `getDestinationById()`, `getDestinationsByCategory()`, `getPackagesByDuration()`

---

## Phase 2: Core Pages (Static Content)

### Home Page (`/`)
- **Hero Section**: Full-width banner with heading "Discover Bihar — Where History, Spirituality and Culture Come Alive", two CTAs (Explore Destinations, Plan Your Trip)
- **Discover Bihar**: 4 category cards (Historical, Religious, Natural, Cultural) each with 4-5 destinations
- **Top Destinations**: Horizontally scrollable cards with category filters (Cities, Wildlife, Historical, Religious, Museums, Cultural, Nature)
- **Popular Food**: Visual grid of 7 Bihar dishes with descriptions
- **Cultural Summary**: Visual storytelling section (history, festivals, art, languages)
- **How to Reach**: Overview cards for Air/Train/Road
- **Best Time to Visit**: Season-based destination-specific recommendations
- **Footer**: Links, government portals, contact info, social media

### Explore Bihar (`/explore`)
- Responsive destination grid with filter chips (category, district) and search
- Each card: image, name, location, best time, View Details button

### Destination Detail (`/explore/:id`)
- Overview, historical significance, attractions list, image gallery, placeholder map, best time, visit duration, nearby attractions, travel tips
- "Add to My Trip" and "Explore Nearby" buttons

### Tour Packages (`/packages`)
- Package cards grouped by duration (2/3/5/7 days)
- Each card: image, name, duration, destinations count, highlights, View Package button

### Package Detail (`/packages/:id`)
- Day-wise itinerary accordion with activities, times, distances
- Included services, best-for tags

### E-Pinddaan (`/e-pinddaan`)
- Introduction to Pinddaan tradition and Gaya's significance
- Step-by-step digital process explanation
- Organizational info
- Prominent "Visit Official Bihar E-Pinddaan Portal" redirect button

### How to Reach & Transport (`/how-to-reach`)
- Tabbed layout: Bus, Flight, Train
- Each tab: stations/airports, connectivity info, booking redirect buttons to official portals (IRCTC, BSRTC, airlines)
- Destination search to find nearest station/airport

### About Bihar (`/about`)
- Cultural, historical, and geographical overview

### 404 Page

---

## Phase 3: Interactivity

### Trip Planner (`/plan-your-trip`)
- Multi-step form wizard:
  1. Select start date + duration
  2. Pick destinations from visual grid
  3. Select interests (checkboxes)
  4. Choose pace (relaxed/moderate/packed)
- **Itinerary Engine** (`src/lib/itinerary-engine.ts`): Pure function that takes preferences + destinations, scores by interest match, clusters geographically using Haversine distance, assigns to days respecting pace budgets, outputs day-wise itinerary
- Result display: day-by-day cards, route summary, print/download option
- Libraries: `react-day-picker`, `fuse.js` (fuzzy search for destination picker)

### AI Trip Generator (`/ai-trip`)
- Large text input with example prompts
- **Rule-based parser** (`src/lib/ai-trip-parser.ts`): Extracts keywords (duration, interests, group type) from natural language using pattern matching, maps to `TripPreferences`, feeds into the same itinerary engine
- Displays result using same `ItineraryResult` component
- "Regenerate" and "Edit preferences" options

### Maps Integration
- Google Maps placeholder component (`src/components/ui/MapPlaceholder.tsx`) showing a static image with destination pin overlay
- When API key is added: swap to `@react-google-maps/api` with custom styled markers
- Maps appear on: Explore page, destination detail pages, itinerary results

### Chatbot Widget
- Floating button (bottom-right) → expandable chat panel
- Language selector (English, Hindi, Maithili, Bhojpuri, Magahi, Urdu)
- **Rule-based responder** (`src/lib/chatbot-engine.ts`):
  - Keyword matching against destination data, food data, transport data
  - Pattern-based intent detection (greeting, destination query, food query, navigation help, transport query)
  - Response templates per intent with data interpolation
  - Internal navigation links in responses
  - Fallback: "I don't have that information. You can explore our destinations page or contact Bihar Tourism."
- Greeting: "Namaste! Welcome to Bihar Tourism. How can I help you?"

### Additional Interactivity
- Scroll-triggered fade-in animations (Intersection Observer + framer-motion)
- Image gallery lightbox on destination pages
- Mobile-responsive refinements (bottom nav bar, touch carousels)

---

## Phase 4: Multilingual Support (i18n)

- Integrate `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- Extract all UI strings into `public/locales/{lang}/` JSON files (namespaced: common, home, explore, packages, etc.)
- Language switcher in Header (dropdown with native script labels)
- Font loading per language (Noto Sans Devanagari, Noto Nastaliq Urdu)
- RTL support for Urdu via `tailwindcss-rtl` plugin
- Store language preference in localStorage

---

## Project Structure

```
tourism/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── .env.example
├── .gitignore
├── public/
│   ├── images/              # Placeholder images
│   └── locales/             # i18n JSON (Phase 4)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   ├── destination.ts
    │   ├── package.ts
    │   ├── itinerary.ts
    │   ├── transport.ts
    │   └── chat.ts
    ├── data/
    │   ├── destinations.ts
    │   ├── packages.ts
    │   ├── food.ts
    │   ├── transport.ts
    │   ├── epinddaan.ts
    │   └── culture.ts
    ├── lib/
    │   ├── utils.ts            # cn() helper, formatters
    │   ├── constants.ts        # External URLs, color tokens
    │   ├── itinerary-engine.ts # Rule-based trip planner
    │   ├── ai-trip-parser.ts   # NL → TripPreferences parser
    │   └── chatbot-engine.ts   # Rule-based chatbot
    ├── hooks/
    │   ├── useDestinations.ts
    │   ├── usePackages.ts
    │   └── useMediaQuery.ts
    ├── context/
    │   └── LanguageContext.tsx
    ├── components/
    │   ├── ui/                 # Button, Card, Badge, Carousel, etc.
    │   ├── layout/             # Header, Footer, MobileNav, PageLayout
    │   ├── home/               # HeroSection, DiscoverBihar, TopDestinations, etc.
    │   ├── explore/            # DestinationCard, DestinationGrid, DestinationDetail, etc.
    │   ├── packages/           # PackageCard, PackageGrid, PackageDetail, DayWiseItinerary
    │   ├── planner/            # TripPlannerForm, steps, ItineraryResult
    │   ├── ai/                 # AiTripGenerator, ChatInput, ItineraryDisplay
    │   ├── chatbot/            # ChatbotWidget, ChatBubble, ChatMessage
    │   ├── transport/          # TransportTabs, TrainInfo, FlightInfo, BusInfo
    │   └── epinddaan/          # ProcessSteps, InfoSection
    └── pages/
        ├── HomePage.tsx
        ├── ExplorePage.tsx
        ├── DestinationPage.tsx
        ├── PackagesPage.tsx
        ├── PackageDetailPage.tsx
        ├── PlanTripPage.tsx
        ├── AiTripPage.tsx
        ├── EPinddaanPage.tsx
        ├── TransportPage.tsx
        ├── AboutBiharPage.tsx
        └── NotFoundPage.tsx
```

---

## Verification Plan

After each phase:
1. `npm run dev` — site loads without errors
2. Navigate every route — no broken links or blank pages
3. Test on mobile viewport (Chrome DevTools) — responsive layout works
4. Click every button/CTA — all navigate or redirect correctly
5. Phase 3 specific: test trip planner end-to-end (fill form → get itinerary), test chatbot with sample queries, test AI trip generator with natural language input
6. Phase 4 specific: switch languages in the selector, verify all visible text changes

---

## Implementation Order Summary

| Phase | What | Key Files |
|-------|------|-----------|
| 1 | Setup + Design System + UI primitives | `tailwind.config.ts`, `src/components/ui/*`, `src/data/*`, `src/types/*` |
| 2 | All pages with static content | `src/pages/*`, `src/components/home/*`, `explore/*`, `packages/*`, etc. |
| 3 | Interactivity (planner, chatbot, maps, AI trip) | `src/lib/itinerary-engine.ts`, `chatbot-engine.ts`, `ai-trip-parser.ts`, planner + chatbot components |
| 4 | Multilingual (i18n) | `public/locales/*`, i18next config, LanguageContext |
