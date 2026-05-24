import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

/**
 * Phase 1 endpoint: theme.extend has been removed because all tokens are
 * now defined in @theme inside src/app/globals.css (Tailwind v4 way).
 * The @theme block generates the same utilities — bg-bg, text-ink-dim,
 * border-line-strong, max-w-container, bg-brand-gradient, shadow-accent-glow,
 * ease-out-soft, font-actay, etc.
 *
 * Only the heroui plugin and content paths remain here, since v4 still reads
 * those from a JS config when one is referenced via @config.
 */
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
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
