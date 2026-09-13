/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, // Important to not break existing CSS
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
