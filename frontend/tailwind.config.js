/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paypros: {
          primary: '#7F25D9',    // Main purple
          secondary: '#340F59',  // Dark purple
          dark: '#160726',       // Very dark purple
          accent: '#401C8C',     // Accent purple
        }
      }
    },
  },
  plugins: [],
}
