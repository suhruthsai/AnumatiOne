import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af", // Deep blue primary
          900: "#1e3a8a",
          950: "#172554",
        },
        accent: {
          purple: "#8b5cf6",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          cyan: "#06b6d4",
        },
        telangana: {
          crimson: "#C33764",
          crimsonHover: "#A82650",
          navy: "#060D4A",
          dark: "#101935",
          slate: "#1E2958",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flow-line": "flowLine 2s linear infinite",
      },
      keyframes: {
        flowLine: {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
