# Bihar-Pass

React + TypeScript + Tailwind + Vite. See PLAN.md for the plan.

```
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Things to fill in
- Photos: put `.jpg` files in `public/images/` named after the id (`bodh-gaya.jpg`, `hero.jpg`, `food-thekua.jpg`, `bodh-gaya-1.jpg`...). Gradients show until then.
- External links: `src/lib/constants.ts`. Links with `verified: false` (BSRTC, E-Pinddaan) show a "confirm the address" notice. Replace with the confirmed official URLs and set `verified: true`.
- Translations: `src/i18n/index.ts`. Maithili, Bhojpuri and Magahi cover navigation, key buttons and the chatbot only; the rest falls back to English.
- Google Maps: maps use the keyless embed. Add an API key later for custom markers.
