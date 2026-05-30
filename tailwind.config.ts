import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta D'todoReu — extraída del logo (verde → azul)
        primary: {
          DEFAULT: "#3ECF8E",
          50:  "#f0fdf8",
          100: "#ccfbec",
          200: "#9af5d8",
          300: "#60e9be",
          400: "#3ECF8E",
          500: "#22b578",
          600: "#169162",
          700: "#157350",
          800: "#165b41",
          900: "#154b36",
        },
        secondary: {
          DEFAULT: "#4BA8D3",
          50:  "#f0f8fe",
          100: "#daeefb",
          200: "#beddf7",
          300: "#91c5f1",
          400: "#4BA8D3",
          500: "#2f8bbf",
          600: "#256fa1",
          700: "#205983",
          800: "#1f4c6d",
          900: "#1f405b",
        },
        neutral: {
          50:  "#F8FAFB",
          100: "#F1F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3ECF8E 0%, #4BA8D3 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #f0fdf8 0%, #f0f8fe 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
