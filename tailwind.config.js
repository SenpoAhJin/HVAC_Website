/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm tones (heating)
        'warm': {
          50: '#fef9ee',
          100: '#fdf3d7',
          200: '#fbe4ae',
          300: '#f7cf7a',
          400: '#f3b244',
          500: '#f09820',
          600: '#e17c16',
          700: '#bb5f14',
          800: '#964a18',
          900: '#7a3e17',
        },
        // Cool tones (cooling)
        'cool': {
          50: '#f0fdfc',
          100: '#ccfbf6',
          200: '#99f6ed',
          300: '#5eebe1',
          400: '#2dd4ca',
          500: '#14b8ae',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
}
