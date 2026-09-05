import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        obsidian: "#111111",
        midnight: "#171A2B",
        imperial: { DEFAULT: "#C9A227", dark: "#9A7B1A", light: "#E4C65B" },
        champagne: "#F4E7C1",
        ivory: "#FFF9EE",
        jade: { DEFAULT: "#174A45", light: "#E3EFEA", dark: "#0E3330" },
        burgundy: { DEFAULT: "#5A1E2A", light: "#F5E2E5" },
        softgray: "#687076",
        success: "#2E7D5B",
        warning: "#A66B00",
        error: "#B42318",
        paper: "#FFFCF4",
        ink: "#1A1A1A",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
        sans: ['"Manrope"', '"Inter"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        royal: "0 10px 40px -12px rgba(201,162,39,0.35)",
        card: "0 2px 16px -4px rgba(23,26,43,0.12)",
      },
      borderRadius: { royal: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
