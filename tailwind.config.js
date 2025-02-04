/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        success: {
          500: '#00aa4f',
          100: '#e9f8f0',
        },
        error: {
          500: '#f56a50',
          100: '#fef0ed',
        },
        alert: {
          500: '#ffba00',
          100: '#fff7d9',
        },
      }
    },
  },
  plugins: [],
}

