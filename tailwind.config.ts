import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090B",
        surface: "#111113",
        surface2: "#18181B",
        ink: "#FAFAFA",
        ink2: "#71717A",
        ink3: "#3F3F46",
        line: "rgba(255,255,255,0.07)",
        orange: { DEFAULT: "#E85D3A", glow: "rgba(232,93,58,0.3)" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
