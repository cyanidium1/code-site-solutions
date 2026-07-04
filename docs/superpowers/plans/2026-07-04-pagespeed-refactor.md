# PageSpeed Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the mobile Lighthouse performance score of https://www.code-site.art/en from the measured baseline of 46 by removing ~1 MB of redundant CSS from every HTML document, trimming dead assets, and adding a repeatable local Lighthouse workflow via npm scripts.

**Architecture:** All benchmarks run against `/en` directly (decision 2026-07-04: the `/` → `/en` Accept-Language redirect in `src/middleware.ts` stays — real users are unaffected, so we measure the page behind it, not the redirect). A small Node runner script wraps the Lighthouse CLI so every measurement uses identical flags; each change task re-measures and records results in `docs/perf-log.md`. The two big levers: (1) narrow the Tailwind content glob so HeroUI CSS is generated only for the ~8 components actually used (CSS is currently 440 KB and is shipped **three times** per page — once as the inlined `<style>`, twice duplicated inside the RSC flight payload — so every CSS byte saved is a triple win), and (2) A/B the `experimental.inlineCss` flag, which caused the triplication.

**Tech Stack:** Next.js 15 (App Router), Tailwind v4 + `@heroui/theme` plugin, Lighthouse CLI 13.x (devDependency), Node 25 on Windows (PowerShell/Git Bash).

**Measured baseline (2026-07-04, Lighthouse 13.4 mobile emulation, production):**
| Metric | Value |
|---|---|
| Performance score | 46 |
| LCP | 6.7 s |
| TBT | 1,610 ms |
| FCP | 2.2 s |
| CLS | 0 |
| Homepage HTML | 1.81 MB raw / 186 KB compressed |
| Inlined CSS | 440 KB, shipped 3× (≈1.32 MB of the document) |
| HeroUI share of CSS | 125 KB (28%) |

**Known constraints:**
- `framer-motion` is a required peer dependency of `@heroui/react` — do NOT remove it even though no first-party code imports it.
- On Windows, the Lighthouse CLI often exits non-zero with `EPERM ... rmSync` while cleaning up Chrome's temp profile **after the report is already written**. The runner script must treat "report file exists" as success.
- Site conventions in `CLAUDE.md` apply: minimal diffs, run `npm run typecheck` when touching TS.

**Working directory for all commands:** `C:\GitHub23\code-site-workspace\Frontend` (git repo, branch off `master`).

---

### Task 0: Create a working branch

- [ ] **Step 1: Branch off master**

```bash
git checkout master
git pull
git checkout -b perf/pagespeed-refactor
```

- [ ] **Step 2: Confirm clean state**

Run: `git status`
Expected: `nothing to commit, working tree clean` (aside from untracked debug.log, if present — leave it).

---

### Task 1: Lighthouse runner script + npm scripts

**Files:**
- Create: `tools/perf/run-lighthouse.mjs`
- Modify: `package.json` (add devDependency + 2 scripts)
- Modify: `.gitignore` (ignore `.lighthouse/`)

- [ ] **Step 1: Install Lighthouse as a devDependency (pinned major)**

```bash
npm install --save-dev lighthouse@^13.4.0
```

Expected: `package.json` devDependencies gains `"lighthouse": "^13.4.0"`.

- [ ] **Step 2: Write the runner script**

Create `tools/perf/run-lighthouse.mjs`:

```js
/**
 * Consistent Lighthouse runs for perf work. Wraps the CLI so every
 * measurement uses identical flags (mobile emulation, performance-only).
 *
 * Usage:
 *   node tools/perf/run-lighthouse.mjs --url <url> --label <name> [--runs N]
 *
 * Windows quirk: the CLI often exits non-zero with an EPERM while deleting
 * Chrome's temp profile AFTER the report is written. We therefore judge
 * success by the presence of the report file, not the exit code.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const url = arg("url", "https://www.code-site.art/en");
const label = arg("label", "run");
const runs = Number(arg("runs", "1"));

const outDir = resolve(".lighthouse");
mkdirSync(outDir, { recursive: true });

const results = [];

for (let i = 1; i <= runs; i++) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const base = resolve(outDir, `${label}-${stamp}-${i}`);
  const jsonPath = `${base}.report.json`;

  console.log(`\n[${i}/${runs}] lighthouse ${url}`);
  spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance",
      "--output=json",
      "--output=html",
      `--output-path=${base}`,
      '--chrome-flags="--headless=new"',
      "--quiet",
    ],
    { stdio: "inherit", shell: true },
  );

  if (!existsSync(jsonPath)) {
    console.error(`Run ${i}: no report written (${jsonPath}) — real failure.`);
    process.exit(1);
  }

  const r = JSON.parse(readFileSync(jsonPath, "utf8"));
  const a = r.audits;
  results.push({
    score: Math.round(r.categories.performance.score * 100),
    lcp: a["largest-contentful-paint"].numericValue,
    tbt: a["total-blocking-time"].numericValue,
    fcp: a["first-contentful-paint"].numericValue,
    cls: a["cumulative-layout-shift"].numericValue,
  });
}

const median = (key) => {
  const s = results.map((r) => r[key]).sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

console.log(`\n=== ${label} @ ${url} (${runs} run${runs > 1 ? "s" : ""}) ===`);
for (const [i, r] of results.entries()) {
  console.log(
    `  run ${i + 1}: score=${r.score} LCP=${(r.lcp / 1000).toFixed(1)}s ` +
      `TBT=${Math.round(r.tbt)}ms FCP=${(r.fcp / 1000).toFixed(1)}s CLS=${r.cls.toFixed(3)}`,
  );
}
console.log(
  `  MEDIAN: score=${median("score")} LCP=${(median("lcp") / 1000).toFixed(1)}s ` +
    `TBT=${Math.round(median("tbt"))}ms FCP=${(median("fcp") / 1000).toFixed(1)}s CLS=${median("cls").toFixed(3)}`,
);
console.log(`  Reports: ${outDir}\\${label}-*.report.html`);
```

- [ ] **Step 3: Add npm scripts**

In `package.json`, add to `"scripts"` (after `"case:crawl"`):

```json
    "perf:prod": "node tools/perf/run-lighthouse.mjs --url https://www.code-site.art/en --label prod --runs 3",
    "perf:local": "node tools/perf/run-lighthouse.mjs --url http://localhost:3000/en --label local --runs 3"
```

Note for `perf:local`: it needs a **production** server running in another terminal first (`npm run build && npm run start`). Dev-server scores are meaningless — never benchmark `next dev`.

- [ ] **Step 4: Ignore the report directory**

Append to `.gitignore` (after the `# testing` section):

```
# lighthouse reports
/.lighthouse/
```

- [ ] **Step 5: Verify the runner works end-to-end**

Run: `node tools/perf/run-lighthouse.mjs --url https://www.code-site.art/en --label smoke --runs 1`
Expected: a score/LCP/TBT summary line prints, and `.lighthouse/smoke-*.report.html` + `.report.json` exist. Exit code 0 even if the CLI grumbled about EPERM.

- [ ] **Step 6: Commit**

```bash
git add tools/perf/run-lighthouse.mjs package.json package-lock.json .gitignore
git commit -m "perf: add Lighthouse runner script and perf:prod/perf:local npm scripts"
```

---

### Task 2: Record the baseline in a perf log

**Files:**
- Create: `docs/perf-log.md`

- [ ] **Step 1: Run the production baseline (3 runs, ~5 min)**

Run: `npm run perf:prod`
Expected: median summary printed. Note the MEDIAN line.

- [ ] **Step 2: Create the log**

Create `docs/perf-log.md`:

```markdown
# Performance log

Mobile Lighthouse (performance-only) via `npm run perf:prod` / `npm run perf:local`.
All numbers are the median of 3 runs against `/en`. The `/` → `/en`
Accept-Language redirect is intentionally excluded from benchmarks
(decision 2026-07-04: redirect stays; users are unaffected).

| Date | Target | Change | Score | LCP | TBT | FCP | CLS |
|---|---|---|---|---|---|---|---|
| 2026-07-04 | prod | baseline (pre-refactor) | 46 | 6.7s | 1610ms | 2.2s | 0 |
| <!-- fill from Step 1 --> | prod | baseline via npm run perf:prod | | | | | |
```

Replace the placeholder row with the actual median values from Step 1 (the first row is the ad-hoc audit measurement kept for history; the second is the tooling-reproduced baseline).

- [ ] **Step 3: Commit**

```bash
git add docs/perf-log.md
git commit -m "perf: record Lighthouse baseline in perf log"
```

---

### Task 3: Narrow the HeroUI Tailwind content glob (biggest CSS win)

CSS is generated for **every** HeroUI component because the content glob scans the whole theme dist. The app imports only: `HeroUIProvider`, `Select`/`SelectItem`, `Input`, `Textarea`, `Button`, `Modal(+Content/Header/Body/Footer)`, `Drawer(+Content/Body)`, `Accordion`/`AccordionItem`, `useDisclosure` (verified by grep of `from "@heroui/react"` across `src/`). Internal dependencies that also need theme styles: `listbox`, `popover`, `scroll-shadow`, `spinner` (used inside Select), `menu`, `divider`, `form` (form/field wiring for Input/Select). All these files exist in `node_modules/@heroui/theme/dist/components/`.

**Files:**
- Modify: `tailwind.config.ts:15-18`

- [ ] **Step 1: Capture the "before" CSS size**

```bash
npm run build
node -e "const fs=require('fs'),p='.next/static/css';let t=0;for(const f of fs.readdirSync(p))t+=fs.statSync(p+'/'+f).size;console.log('CSS total:',t,'bytes')"
```

Expected: roughly 445–450 KB total (matches the 2026-05-25 CSS audit). Note the exact number.

- [ ] **Step 2: Narrow the glob**

In `tailwind.config.ts`, replace:

```ts
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
```

with:

```ts
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    // Only the HeroUI components the app actually renders (plus their
    // internal deps: select pulls in listbox/popover/scroll-shadow/spinner).
    // Scanning all of dist/** generated ~125 KB of CSS for unused
    // components (table, calendar, …) — see docs/perf-log.md.
    "./node_modules/@heroui/theme/dist/components/(accordion|button|divider|drawer|form|input|listbox|menu|modal|popover|scroll-shadow|select|spinner).js",
  ],
```

- [ ] **Step 3: Rebuild and compare CSS size**

```bash
npm run build
node -e "const fs=require('fs'),p='.next/static/css';let t=0;for(const f of fs.readdirSync(p))t+=fs.statSync(p+'/'+f).size;console.log('CSS total:',t,'bytes')"
```

Expected: total drops by roughly 80–125 KB versus Step 1. If it drops by less than 50 KB, stop and investigate before committing (the glob may not have matched — Tailwind treats a non-matching content glob as "no files", which would *also* shrink CSS but break HeroUI styling; Step 4 catches that).

- [ ] **Step 4: Verify used components still have styles and unused ones are gone**

```bash
grep -l "heroui-table\|heroui-calendar" .next/static/css/*.css && echo "FAIL: unused component CSS still present" || echo "OK: unused gone"
grep -l "listbox\|accordion" .next/static/css/*.css && echo "OK: used component CSS present" || echo "FAIL: used component CSS missing"
```

Expected: `OK: unused gone` and `OK: used component CSS present`.

- [ ] **Step 5: Visual smoke-test every HeroUI surface**

Start the prod build (`npm run start`) and check each page renders its HeroUI component styled correctly (not unstyled/transparent):

| Page | Component |
|---|---|
| `/` homepage FAQ section | Accordion |
| `/` mobile viewport, hamburger menu | Drawer |
| `/contacts` lead form | Input, Textarea, Select, Button |
| `/calculator` lead form (scroll to bottom) | Input, Select |
| `/portfolio` filter dropdowns | Select |
| `/about` team member card click | Modal |

Expected: all six render identically to production (compare against https://www.code-site.art if unsure).

- [ ] **Step 6: Typecheck and tests**

```bash
npm run typecheck && npm test
```

Expected: both pass (config change shouldn't affect either — this is the regression gate).

- [ ] **Step 7: Measure locally**

With `npm run start` still running, in another terminal: `npm run perf:local`
Record the median in `docs/perf-log.md` with change = "narrow HeroUI content glob".

- [ ] **Step 8: Commit**

```bash
git add tailwind.config.ts docs/perf-log.md
git commit -m "perf: generate HeroUI CSS only for components actually used"
```

---

### Task 4: Delete unused OTF font files

`public/fonts/` contains `ActayWide-Bold.otf` (133 KB) and `ActayWide-BoldItalic.otf` (128 KB). Only the `.woff2` variants are referenced (verified: grep for `\.otf` across `src/**/*.{ts,tsx,css}` returns nothing).

**Files:**
- Delete: `public/fonts/ActayWide-Bold.otf`, `public/fonts/ActayWide-BoldItalic.otf`

- [ ] **Step 1: Re-verify nothing references the OTFs**

```bash
grep -rn "\.otf" src/ && echo "STOP: referenced" || echo "OK: unreferenced"
```

Expected: `OK: unreferenced`.

- [ ] **Step 2: Delete and verify build**

```bash
git rm public/fonts/ActayWide-Bold.otf public/fonts/ActayWide-BoldItalic.otf
npm run build
```

Expected: build succeeds; the Actay font still loads on `/` (brand headings render in Actay, not a fallback sans).

- [ ] **Step 3: Commit**

```bash
git commit -m "perf: drop unused OTF font files (woff2 variants are the only ones referenced)"
```

---

### Task 5: Add `optimizePackageImports` for HeroUI and lucide-react

**Files:**
- Modify: `next.config.ts:45-51`

- [ ] **Step 1: Add the option**

In `next.config.ts`, extend the `experimental` block:

```ts
  experimental: {
    // Inline CSS into the HTML <style> at render time, eliminating the
    // render-blocking <link rel=stylesheet> requests that were gating LCP.
    // Only kicks in for statically-rendered pages — the app/(uk)/ and
    // app/(en)/ route groups own their <html lang> so pages stay static.
    inlineCss: true,
    // Rewrite barrel imports (@heroui/react re-exports everything) to
    // direct module imports so unused components never enter the bundle.
    optimizePackageImports: ["@heroui/react", "lucide-react"],
  },
```

- [ ] **Step 2: Build and compare First Load JS**

Run: `npm run build`
Expected: build succeeds. Compare the "First Load JS" column in the build output against the previous build (Task 3 Step 3 output) — routes using HeroUI (`/contacts`, `/calculator`) should be equal or smaller; nothing should grow.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "perf: enable optimizePackageImports for @heroui/react and lucide-react"
```

---

### Task 6: Stop prefetching the cookie-policy page from the consent banner

The consent banner shows on every first visit (exactly what PSI measures) and its policy link triggers a ~68 KB RSC prefetch of `/cookies` during initial load. Nobody needs that page prefetched.

**Files:**
- Modify: `src/lib/cookie-consent/components/consent-banner.tsx:40`

- [ ] **Step 1: Disable prefetch on the policy link**

In `src/lib/cookie-consent/components/consent-banner.tsx` line 40, replace:

```tsx
              <Link href={consentPolicyPath(locale)}>{copy.banner.policyLinkLabel}</Link>.
```

with:

```tsx
              <Link href={consentPolicyPath(locale)} prefetch={false}>{copy.banner.policyLinkLabel}</Link>.
```

- [ ] **Step 2: Run the consent test suite and verifier**

```bash
npm test && npm run consent:verify
```

Expected: both pass (`consent:verify` needs the site buildable; run `npm run build` first if it requires a build — see `tools/consent-verify.mjs` header).

- [ ] **Step 3: Verify no `/cookies` prefetch on first load**

With `npm run build && npm run start` running: open `http://localhost:3000/en` in a fresh incognito tab, DevTools → Network, filter `_rsc`. Expected: no request for `/en/cookies?_rsc=…` while the banner is visible.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cookie-consent/components/consent-banner.tsx
git commit -m "perf: don't prefetch the cookie policy page from the consent banner"
```

---

### Task 7: Patch-upgrade Next.js (15.5.18 → latest 15.5.x)

The RSC flight payload embeds the inlined stylesheet **twice** (438 KB × 2 measured on prod). This smells like an `experimental.inlineCss` bug; a patch upgrade is cheap and may include a fix. Installed: 15.5.18; latest 15.5.x at plan time: 15.5.20.

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Upgrade**

```bash
npm install next@^15.5.20 eslint-config-next@^15.5.20
```

- [ ] **Step 2: Build, typecheck, test**

```bash
npm run build && npm run typecheck && npm test
```

Expected: all pass.

- [ ] **Step 3: Measure whether the flight-payload CSS duplication changed**

With `npm run start` running:

```bash
curl -s http://localhost:3000/en -o /tmp/en.html
node -e "
const html = require('fs').readFileSync('/tmp/en.html', 'utf8');
const m = html.match(/<style[^>]*>/g) || [];
const flightCss = (html.match(/tw-content/g) || []).length;
console.log('bytes:', html.length, '| style tags:', m.length, '| tw-content occurrences (CSS copies proxy):', flightCss);
"
```

Expected/interpretation: on 15.5.18 the CSS text appears 3× (so `tw-content` count ≈ 3 × its count in one stylesheet copy). If the count drops to ~1/3 of the pre-upgrade value, the duplication is fixed — note it in `docs/perf-log.md`. If unchanged, still keep the patch upgrade (record "no change to duplication") — Task 8 decides what to do about it.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json docs/perf-log.md
git commit -m "chore: bump next to 15.5.x latest patch"
```

---

### Task 8: A/B the `inlineCss` flag — decision gate

`inlineCss: true` was added to remove a render-blocking `<link>`, but it now inlines 300–440 KB of CSS into every document and (on 15.5.18) triggers the flight-payload triplication. After Tasks 3–7 shrink the CSS, measure both configurations and keep the winner. **This is a measurement task with a decision, not a predetermined change.**

**Files:**
- Possibly modify: `next.config.ts` (only if "off" wins)

- [ ] **Step 1: Measure current state (inlineCss ON)**

```bash
npm run build && npm run start
```

In another terminal: `npm run perf:local`
Record median as "inlineCss ON (post Tasks 3-7)" in `docs/perf-log.md`. Stop the server.

- [ ] **Step 2: Flip the flag OFF and measure**

In `next.config.ts`, set `inlineCss: false` (leave the comment, append `// A/B 2026-07: see docs/perf-log.md`).

```bash
npm run build && npm run start
```

In another terminal: `npm run perf:local`
Record median as "inlineCss OFF" in `docs/perf-log.md`. Stop the server.

- [ ] **Step 3: Decide and set the final state**

Decision rule: compare medians — **score first, then LCP, then TBT** as tie-breakers. Whichever configuration wins, set `next.config.ts` to it and update the config comment to state the measured justification, e.g.:

```ts
    // inlineCss measured 2026-07 (docs/perf-log.md): ON scored X / OFF scored Y
    // on /en mobile — keeping <winner>.
    inlineCss: <winner>,
```

- [ ] **Step 4: Rebuild with the final state and commit**

```bash
npm run build
git add next.config.ts docs/perf-log.md
git commit -m "perf: set inlineCss per local Lighthouse A/B (see docs/perf-log.md)"
```

---

### Task 9: Defer GTM to idle (`lazyOnload`) — decision gate

GTM + Clarity cost ~700 ms of main-thread eval during load (Clarity loads through the GTM container). `lazyOnload` moves that after load. **Trade-off to flag in review:** `page_view` and Clarity session start fire ~1–3 s later; bounce-y visitors may go untracked. Reversible one-word change.

**Files:**
- Modify: `src/components/analytics/google-tag-manager.tsx:15`

- [ ] **Step 1: Change the strategy**

In `src/components/analytics/google-tag-manager.tsx` line 15, replace:

```tsx
      <Script id="gtm" strategy="afterInteractive">
```

with:

```tsx
      {/* lazyOnload: GTM (and Clarity inside it) cost ~700ms of mobile
          main-thread eval during load; deferring to idle trades slightly
          later analytics start for TBT. Measured in docs/perf-log.md. */}
      <Script id="gtm" strategy="lazyOnload">
```

- [ ] **Step 2: Verify consent bootstrap is unaffected**

```bash
npm test
```

Expected: pass. The consent bootstrap script (`consent-bootstrap.tsx`) is a separate inline script that sets the denied-by-default consent state before GTM regardless of GTM timing — the ordering guarantee (bootstrap before GTM) still holds because the bootstrap is synchronous inline HTML and GTM now loads even later.

- [ ] **Step 3: Verify GTM still loads and consent still gates it**

With `npm run build && npm run start`: open `http://localhost:3000/en`, DevTools → Network. Expected: `gtm.js` request appears within a few seconds after load (idle), not before FCP. Then `npm run consent:verify` — expected: pass.

- [ ] **Step 4: Measure**

`npm run perf:local` (3 runs, server still up). Record median as "GTM lazyOnload" in `docs/perf-log.md`. If TBT does not improve by at least ~100 ms, revert this task (the analytics-timing cost isn't worth zero gain) and note that in the log.

- [ ] **Step 5: Commit (or revert per Step 4)**

```bash
git add src/components/analytics/google-tag-manager.tsx docs/perf-log.md
git commit -m "perf: defer GTM to idle (lazyOnload) — trades later analytics start for TBT"
```

---

### Task 10: Final verification and PR

- [ ] **Step 1: Full local gate**

```bash
npm run typecheck && npm test && npm run build
```

Expected: all pass.

- [ ] **Step 2: Final local measurement**

`npm run start`, then `npm run perf:local`. Record median as "final (all tasks)" in `docs/perf-log.md` and commit the log update:

```bash
git add docs/perf-log.md
git commit -m "perf: record final local Lighthouse results"
```

- [ ] **Step 3: Open the PR**

```bash
git push -u origin perf/pagespeed-refactor
gh pr create --title "PageSpeed refactor: cut CSS triplication, add local Lighthouse tooling" --body "$(cat <<'EOF'
## Summary
- Baseline: mobile Lighthouse 46 on /en (LCP 6.7s, TBT 1610ms). Full history in docs/perf-log.md.
- HeroUI CSS now generated only for components actually used (was ~125 KB of unused component styles, shipped 3x per page via inlineCss + RSC flight duplication).
- Lighthouse runner + `npm run perf:prod` / `perf:local` for repeatable measurement (3-run medians, mobile emulation, /en target).
- inlineCss kept/dropped per measured A/B (see perf-log).
- GTM deferred to idle (kept only because it bought >=100ms TBT — see perf-log).
- Dead OTF fonts removed; optimizePackageImports enabled; consent banner no longer prefetches /cookies.

## Decisions
- `/` -> `/en` Accept-Language redirect stays (users unaffected); all benchmarks target /en directly.
- framer-motion stays: required @heroui/react peer dependency.

## Verification
- npm run typecheck / npm test / npm run build all green
- Visual smoke-test of all six HeroUI surfaces (FAQ accordion, mobile drawer, contacts + calculator forms, portfolio filters, about modal)
- npm run consent:verify green

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: After deploy: production measurement**

Once the PR is merged and deployed: `npm run perf:prod` and record the median in `docs/perf-log.md` as "prod post-deploy". Compare against the 46 baseline.

---

## Deferred / out of scope (revisit after measuring)

- **Above-the-fold link prefetches** (hero CTA → `/contacts`, header → `/calculator`, ~70 KB RSC each): Tasks 3/7/8 shrink these payloads automatically; disabling prefetch trades navigation snappiness. Re-evaluate from the post-deploy trace.
- **Replacing the `/` redirect with a client-side language suggestion**: product decision, explicitly kept as-is (2026-07-04).
- **Reducing Manrope from 4 weights to 3**: needs a design pass to confirm 500 vs 600 usage; ~15–20 KB.
- **Hero mockup source recompression** (`public/hero/hero-mockup.webp`, 386 KB): LCP image already AVIF-optimized on the wire via the image optimizer; revisit only if post-deploy LCP is still > 2.5 s.
- **Moving off HeroUI entirely**: flagged in the 2026-05-25 CSS audit as a long-term option; far larger scope.
