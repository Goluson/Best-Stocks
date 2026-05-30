/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        surface: { DEFAULT: '#ffffff', secondary: '#f8f8f7', tertiary: '#f1f0eb' },
      },
    },
  },
  plugins: [],
}
