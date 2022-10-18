/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.stone[900],
      white: colors.stone[50],
      indigo: colors.stone,
      gray: colors.stone,
    },
    borderRadius: {
      none: "0",
      sm: "0",
      DEFAULT: "0",
      md: "0",
      lg: "0",
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
  ],
};
