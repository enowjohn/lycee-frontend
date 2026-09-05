/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          blue: '#1e3a8a',
          gold: '#f59e0b',
          white: '#ffffff',
        }
      },
    },
  },
  plugins: [],
}