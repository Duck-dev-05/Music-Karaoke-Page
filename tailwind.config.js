/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        secondary: '#282828',
        dark: '#121212',
        light: '#B3B3B3',
        lightest: '#E0E0E0',
        darkest: '#191414',
      },
    },
  },
  plugins: [],
}