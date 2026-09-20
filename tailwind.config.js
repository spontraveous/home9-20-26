/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#170B33",
        dusk: "#4C1D95",
        paper: "#F5F3FF",
        flame: "#22C55E",
        gold: "#A855F7",
        mist: "#C7B9F0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
