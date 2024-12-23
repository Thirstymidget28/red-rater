import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "ttu-red": "#E90802",
        "ttu-dark-red": "#CC0000",
        "ttu-gold": "#CB9F5B",
      },

      screens: {
        xs: "430px",
      },

      backgroundImage: {
        hero: "url('/Hero.jpg')",
      },

      fontFamily: {
        helvetica: ["Helvetica"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
export default config;
