/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0B0F17',
          card: '#111827',
          surface: '#1E293B',
          hover: '#283548',
          border: '#334155'
        },
        crowd: {
          low: '#10B981',      // Emerald green
          moderate: '#F59E0B', // Amber
          high: '#F97316',     // Orange
          critical: '#EF4444', // Red
          over: '#DC2626'      // Deep red
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
