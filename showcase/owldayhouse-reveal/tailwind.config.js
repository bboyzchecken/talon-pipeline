/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Owl Day House brand tokens (talon-by-owldayhouse · packages/brand)
        navy: '#28254c',
        'navy-deep': '#1b1938',
        gold: '#e9a41b',
        // brighter gold for thin TEXT on dark navy — amber #e9a41b goes muddy as strokes
        'gold-bright': '#ffc233',
        'gold-soft': '#fbefd3',
        paper: '#fbf8f1',
        muted: '#6e6b86',
        line: '#eae6db',
      },
      boxShadow: {
        // ODH gold glow for CTAs (matches @odh/brand shadow.glow)
        glow: '0 18px 50px -16px rgb(233 164 27 / 0.55)',
      },
    },
  },
  plugins: [],
};
