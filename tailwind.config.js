/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F2747',
        gold: '#C9A227',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 39, 71, 0.08)',
      },
    },
  },
  plugins: [],
}
