/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // primary: "#4A56A6",
        primary: "#1F317C",
        secondary: "#1F317C",
        tertiary: "#A86FA8",
        black: "#1a1a1a",
        grey: "#e9e9e9"
      },
      borderRadius: {
        primary: "5px"
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1312px",
          "xs" : "480px"
        }
      }
    }
  },
  plugins: [],
};
