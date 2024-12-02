/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Use Poppins font family
        cookie: ['Cookie', 'cursive'],      // Use Cookie font
        edu: ['Edu AU VIC WA NT Guides', 'serif'], // Use Edu font
      },
      fontWeight: {
        light: '100',
        normal: '400',
        medium: '500',
        bold: '700',
      },
    },
  },
  plugins: [],
}