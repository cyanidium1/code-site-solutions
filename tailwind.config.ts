import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          subtle: "var(--bg-subtle)",
          raised: "var(--bg-raised)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-2)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          dim: "var(--ink-2)",
          muted: "var(--ink-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          deep: "var(--accent-deep)",
        },
        brand: {
          blue: "var(--accent)",
          purple: "var(--accent-deep)",
        },
        industry: {
          healthcare: "#0EA5E9",
          legal: "#8B5CF6",
          accounting: "#10B981",
          ecommerce: "#F59E0B",
          saas: "#0070F3",
          realestate: "#EF4444",
          cosmetology: "#EC4899",
          education: "#14B8A6",
        },
      },
      maxWidth: {
        container: "var(--container-max)",
        "container-wide": "var(--container-max-wide)",
        "container-h1": "var(--container-h1)",
        "container-narrow": "var(--container-narrow)",
        "container-prose": "var(--container-prose)",
        "container-form": "var(--container-form)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 1400px 700px at 50% -150px, oklch(0.55 0.18 295 / 0.40) 0%, oklch(0.55 0.18 295 / 0.12) 35%, transparent 70%)",
        "brand-gradient":
          "linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%)",
        "text-gradient":
          "linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%)",
      },
      boxShadow: {
        "accent-glow":
          "0 4px 20px oklch(0.55 0.18 295 / 0.35), 0 0 0 1px oklch(0.55 0.18 295 / 0.30)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#121212",
            foreground: "#f5f3f7",
            primary: { DEFAULT: "#7c4dde", foreground: "#ffffff" },
            secondary: { DEFAULT: "#5d2dad", foreground: "#ffffff" },
          },
        },
      },
    }),
  ],
};

export default config;
