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
        background: "var(--background)",
        foreground: "var(--foreground)",
        military: {
          dark: "#0a0f0a",
          green: "#3a4a3a",
          tan: "#4a3a2a",
          orange: "#ff6600",
        },
        tactical: {
          orange: "#ff8800",
          yellow: "#ffaa00",
          flash: "#ffff00",
        },
      },
      fontFamily: {
        mono: ['"Courier New"', "monospace"],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 170, 0, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 170, 0, 0.4)' },
        },
      },
      backgroundImage: {
        'military-grid': 'linear-gradient(to right, rgba(26, 42, 26, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(26, 42, 26, 0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
export default config;
