/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        anngan: "#DD3333",
        annganDark: "#C81E1E",
        navy: "#004274",
        gold: "#DDB78B"
      }
    }
  },
  plugins: []
};
