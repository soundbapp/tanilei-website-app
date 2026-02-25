import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ["var(--font-great-vibes)", "cursive"],
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      colors: {
        "rose-gold": "var(--rose-gold)",
        "rose-light": "var(--rose-light)",
        "rose-pale": "var(--rose-pale)",
        "rose-deep": "var(--rose-deep)",
        cream: "var(--cream)",
        dark: "var(--dark)",
      },
    },
  },
  plugins: [],
};

export default config;
