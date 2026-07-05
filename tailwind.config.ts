import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

// .heroui-tw/ is produced by tools/sync-heroui-tw-sources.mjs (predev/prebuild
// hook). If a build bypasses npm hooks (npx next build, --ignore-scripts),
// the glob below would match nothing and silently drop ALL HeroUI styling —
// fail the build instead. (cwd-relative on purpose: builds run from the repo
// root via npm scripts, and jiti's import.meta support is unreliable here.)
if (!existsSync(resolve(".heroui-tw"))) {
  throw new Error(
    ".heroui-tw/ missing — run `node tools/sync-heroui-tw-sources.mjs` " +
      "(normally the predev/prebuild npm hook). HeroUI styles would be silently dropped.",
  );
}

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
    // Only the HeroUI components the app actually renders (plus their
    // internal HeroUI deps) — copied here from @heroui/theme by
    // tools/sync-heroui-tw-sources.mjs (prebuild/predev hook). Scanning
    // @heroui/theme/dist directly generated ~110 KB of extra CSS for unused
    // components: Tailwind v4's Oxide scanner widens any file/glob source to
    // its whole parent directory, which drags in components/index.js (a
    // bundle of every component's classes). See the sync script header and
    // docs/perf-log.md (2026-07-04) for details and measurements.
    // If a newly added HeroUI component renders unstyled, add its theme file
    // (and its internal deps) to COMPONENTS in tools/sync-heroui-tw-sources.mjs.
    "./.heroui-tw/*.js",
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
