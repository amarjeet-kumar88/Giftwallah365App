import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", ".dark"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4B2C5E",
          gold: "#F2B705",
          bg: "#FAF8F5",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
