/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // School brand colours (Teal & Gold theme)
        school: {
          blue: '#115e59',   // primary teal
          gold: '#f59e0b',   // accent gold
          white: '#ffffff',
          dark: '#0f172a',
          sand: '#f8fafc',
        },
        // Rebrand neutrals slightly: the lightest grey is used as the page /
        // section background all over the site, so tint it toward teal.
        gray: {
          50: '#f2f8f7',
        },
        // `primary` is a convenient alias for the brand teal scale.
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Rebrand: the whole site was built with Tailwind's `blue-*`
        // utility classes. Remapping the `blue` scale to the teal brand
        // palette re-colours every existing background, button, border
        // and link at once (Teal & Gold theme).
        blue: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
    },
  },
  plugins: [],
}
