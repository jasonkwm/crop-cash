/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        header: ['"Londrina Solid"', "cursive"],
        normal: ['"Londrina Solid"', "sans-serif"],
      },
      colors: {
        background: "#EBEBEB", // Main background color
        foreground: "#C0C0C0", // Section background color
        primary: "#6a3fd1",
        primaryLight: "#714ad3",
        secondary: "#ec8fe9", // Soft blue - use for card background, etc
        secondaryLight: "#ea9ae7",
        ourBlue: "#2dd8da",
        ourYellow: "#f7d929",
        ourGreen: "#befc53",
        ourGreenDark: "#aaea3c",
      },
    },
  },
  plugins: [],
};
