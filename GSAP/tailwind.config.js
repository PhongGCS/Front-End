/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/*.js", "./slider/index.html", "./slider/app.js"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
