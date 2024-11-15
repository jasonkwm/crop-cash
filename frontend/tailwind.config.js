/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // fontFamily: {
      //   header: ["var(--font-header)"],
      //   normal: ["var(--font-normal)"],
      // },
      colors: {
        background: "#EBEBEB", // Main background color
        foreground: "#C0C0C0", // Section background color
        primary: "#F7931A", // Bitcoin color - use for important elements (buttons, etc)
        secondary: "#4A90E2", // Soft blue - use for card background, etc
        tertiary: "#2C578A", // Deep blue - use for border
      },
    },
  },
  plugins: [],
};
