/**
 * Copies the HeroUI theme source files for the components the app actually
 * renders into ./.heroui-tw/ (gitignored), so Tailwind can scan ONLY them.
 *
 * Why the copy instead of pointing the Tailwind `content` glob at
 * node_modules/@heroui/theme/dist/components/<name>.js directly:
 * Tailwind v4's Oxide scanner (v4.2.4) widens any file or glob source to its
 * whole parent directory — scanning components/select.js also scans the
 * sibling components/index.js, a ~300 KB bundle containing every HeroUI
 * component's classes, which regenerates CSS for ALL components (~190 KB
 * minified). `(a|b)` alternation isn't supported at all (matches nothing and
 * silently drops every HeroUI style), and `!`-negated content entries and
 * `@source not` don't exclude the sibling either. Copying the needed files
 * into a directory with no index.js sibling is the only reliable narrowing.
 * See docs/perf-log.md (2026-07-04) for measurements.
 *
 * Runs automatically via the `prebuild` and `predev` npm hooks.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules", "@heroui", "theme", "dist", "components");
const destDir = join(root, ".heroui-tw");

// Components the app renders (Accordion, Button, Drawer, Input, Modal,
// Select, Textarea → input.js) plus their internal HeroUI deps
// (select pulls in listbox/popover/scroll-shadow/spinner; menu, divider,
// form are used by drawer/accordion/inputs).
const COMPONENTS = [
  "accordion",
  "button",
  "divider",
  "drawer",
  "form",
  "input",
  "listbox",
  "menu",
  "modal",
  "popover",
  "scroll-shadow",
  "select",
  "spinner",
];

if (!existsSync(srcDir)) {
  console.error(
    `[sync-heroui-tw-sources] ${srcDir} not found — is @heroui/theme installed? Run \`npm install\` first.`
  );
  process.exit(1);
}

const missing = COMPONENTS.filter((c) => !existsSync(join(srcDir, `${c}.js`)));
if (missing.length > 0) {
  console.error(
    `[sync-heroui-tw-sources] Missing theme files in ${srcDir}: ${missing.join(", ")}.\n` +
      "Did a HeroUI update rename them? Update COMPONENTS in tools/sync-heroui-tw-sources.mjs — " +
      "building without them would silently drop those components' styles."
  );
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

// Remove stale entries (e.g. a component that is no longer in the list, or
// anything that isn't a <component>.js file at all).
for (const f of readdirSync(destDir)) {
  if (!(f.endsWith(".js") && COMPONENTS.includes(f.slice(0, -3)))) {
    rmSync(join(destDir, f), { recursive: true, force: true });
  }
}

for (const c of COMPONENTS) {
  copyFileSync(join(srcDir, `${c}.js`), join(destDir, `${c}.js`));
}

console.log(
  `[sync-heroui-tw-sources] Synced ${COMPONENTS.length} HeroUI theme sources to .heroui-tw/`
);
