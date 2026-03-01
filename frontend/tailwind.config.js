/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FDBA74",  
          DEFAULT: "#F97316",
          dark: "#EA580C",
        },

        secondary: {
          light: "#38BDF8",
          DEFAULT: "#0284C7",
          dark: "#075985",
        },

        accent: "#FACC15",
        dark: "#0F172A",
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(to bottom, #FDBA74, #EA580C)",

        "secondary-gradient":
          "linear-gradient(to bottom, #38BDF8, #075985)",
      },
    },
  },
  plugins: [],
};
