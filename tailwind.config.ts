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
        tc: {
          DEFAULT: "#C4603A",
          light: "#F0D5C8",
          dark: "#8B3D22",
        },
        bg: {
          DEFAULT: "#FAF7F2",
          2: "#F2EDE4",
          3: "#E8E0D0",
        },
        ink: {
          DEFAULT: "#1A1612",
          2: "#4A4540",
          3: "#8A837A",
        },
      },
      fontFamily: {
        head: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "24px",
      },
      animation: {
        "fade-up": "fadeUp 0.3s ease forwards",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
