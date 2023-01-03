/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#120F0C",
      white: "#FFFFFF",
      postcard: "#FFFAF5",
      indigo: {
        DEFAULT: "#5520F8",
        50: "#5520F8",
        100: "#5520F8",
        200: "#5520F8",
        300: "#5520F8",
        400: "#5520F8",
        500: "#5520F8",
        600: "#5520F8",
        700: "#5520F8",
        800: "#5520F8",
        900: "#5520F8",
      },
      gray: {
        DEFAULT: "#120F0C",
        50: "#F5F5F5",
        100: "#EAEAEC",
        200: "#CBCBCF",
        300: "#ABABB1",
        400: "#6D6D77",
        500: "#2E2E3D",
        600: "#292937",
        700: "#1C1C25",
        800: "#15151B",
        900: "#0E0E12",
      },
      red: colors.red,
      yellow: "#F7D832",
      brandIndigo: "#5520F8",
      brandTeal: "#00B4D8",
      brandOrange: "#FC5825",
      brandRed: "#FE0760",
    },
    borderRadius: {
      none: "0",
      sm: "0",
      DEFAULT: "0",
      md: "0",
      lg: "0",
    },
    extend: {
      fontFamily: {
        sans: ["Sen", "sans-serif"],
      },
      boxShadow: {
        button: "3.2px 4.8px 0px 0px hsla(29, 22%, 6%, 0.33)",
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
