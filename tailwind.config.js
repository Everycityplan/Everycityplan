/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: '#ff6b6b',
        midnight: '#0f172a'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'soft-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 35%, #fdf2f8 100%)'
      }
    }
  },
  plugins: []
};
