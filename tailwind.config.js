/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2ee',
          100: '#fce3da',
          200: '#f9c5b7',
          300: '#f6a793',
          400: '#f07d61',
          500: '#e85d3b',
          600: '#d94a2b',
          700: '#b53a25',
          800: '#923124',
          900: '#762b21',
          950: '#40120d',
        },
        neutral: {
          50: '#fbfaf9',
          100: '#f5f3f1',
          200: '#ebe7e4',
          300: '#ded9d4',
          400: '#c2bcb6',
          500: '#a7a09a',
          600: '#8c857f',
          700: '#716b65',
          800: '#58534e',
          900: '#47433f',
          950: '#2b2825',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
