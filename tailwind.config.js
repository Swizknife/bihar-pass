export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: { fadein: { from: { opacity: '0' }, to: { opacity: '1' } } },
      colors: {
        ivory: '#FBF7EE', cream: '#F4ECDB', terracotta: '#B8532F', gold: '#C9A24A',
        forest: '#2B4A2F', charcoal: '#2A2622', stone: '#6B635A',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', '"Noto Sans Devanagari"', '"Noto Sans JP"', '"Noto Sans KR"', '"Noto Sans Thai"', '"Noto Sans Sinhala"', '"Noto Sans Myanmar"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
