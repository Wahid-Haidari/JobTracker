/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in the src directory
  ],
  theme: {
    extend: {
      colors: {
        myBackground: '#afdde5',
        myOrange: '#964734',
        myBlue: '#0fa4af',
        myDarkGreen: '#024950',
        myDark: '#003135'

      }

    },
  },
  plugins: [],
};