/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#120F0C",
      white: "#FEF5ED",
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
      gray: "#120F0C",
      yellow: "#F7D832",
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
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
  ],
};
