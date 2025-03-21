/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs' // All .ejs files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff9800',
        secondary: '#007bff',
        accent: '#28a745',
        danger: '#dc3545',
        warning: '#ff9800',
        background: '#f9fafb',
        highlight: '#ffd700'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};