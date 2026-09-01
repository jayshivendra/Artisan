/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        artisan: {
          terracotta: '#D9532F',
          terracottaLight: '#FDECE7',
          terracottaDark: '#AC3818',
          indigo: '#1E3A8A',
          indigoLight: '#EFF4FE',
          indigoDark: '#14275E',
          marigold: '#F59E0B',
          marigoldLight: '#FEF3C7',
          clay: '#FFFBF5',
          clayBorder: '#EFE7DA',
          emerald: '#10B981',
          emeraldLight: '#D1FAE5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px -5px rgba(217, 83, 47, 0.15)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
