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
        "brand-bg": "#FBF6EF",
        "brand-text": "#2B2420",
        "brand-primary": "#D98E73",
        "brand-secondary": "#4A5D45",
        "brand-accent": "#E8B4B8",
        "brand-cocoa": "#5C4033",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Fraunces", "serif"],
        body: ["var(--font-body)", "Nunito", "sans-serif"],
        handwriting: ["var(--font-handwriting)", "Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
