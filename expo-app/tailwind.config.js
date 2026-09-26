/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', '../shared/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
  plugins: [],
}
