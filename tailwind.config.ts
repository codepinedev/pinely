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
        // Warm dark palette - cozy and calm
        night: {
          50: "#2A2523",
          100: "#231F1D",
          200: "#1C1917",
          300: "#171412",
          400: "#12100E",
          500: "#0D0B0A",
        },
        surface: {
          light: "#3D3633",
          DEFAULT: "#322C29",
          dark: "#2A2523",
        },
        cream: {
          light: "#F5EDE4",
          DEFAULT: "#E8DED2",
          dark: "#C4B8A9",
          muted: "#A89B8B",
        },
        sage: {
          light: "#B8C4A8",
          DEFAULT: "#8FA47B",
          dark: "#6B8256",
        },
        ember: {
          light: "#D4A574",
          DEFAULT: "#C4956A",
          dark: "#A67B52",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
