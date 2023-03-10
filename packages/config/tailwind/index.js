/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./src/_app.tsx"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#181a1b",
        "dark-containers": "#242526",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
