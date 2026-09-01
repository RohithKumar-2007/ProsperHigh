/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8F5",
        primary: {
          DEFAULT: "#1F3A4A",
          dark: "#142631",
          light: "#2C5168"
        },
        secondary: {
          DEFAULT: "#4F7C7A",
          light: "#6A9997"
        },
        accent: {
          DEFAULT: "#C9A96E",
          light: "#DFC593"
        },
        positive: {
          DEFAULT: "#4F8A68",
          light: "#6CA887"
        },
        warning: {
          DEFAULT: "#C58B39",
          light: "#DAA455"
        },
        negative: {
          DEFAULT: "#B75D5D",
          light: "#CC7A7A"
        },
        charcoal: "#1F2933",
        panel: "#FFFFFF"
      }
    }
  },
  plugins: []
};
