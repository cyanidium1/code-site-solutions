# Render-Blocking CSS Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the ~900 ms of render-blocking CSS on mobile by (a) removing 3–4 of the 7 blocking `<link>`s the homepage doesn't need up-front, then (b) re-measuring `experimental.inlineCss` — which under the new (post-islands) conditions may now win and eliminate the remaining blocking requests entirely.

**Architecture:** The homepage currently ships **7 render-blocking stylesheets**. Six are tiny (0.5–5.6 KB) but each still costs a full critical-path round-trip (150–450 ms on throttled mobile); one is the 43.7 KB main app chunk (~900 ms). Phase A moves CSS that isn't needed for first paint off the critical path: `vendor.css` (swiper — lazy, below-fold) and the lightbox CSS (portfolio-only) get co-located with their lazy JS chunks; `keyframes.css` and `hero-effects.css` fold into the single main chunk. Phase B is a measured decision gate: re-A/B `inlineCss`, whose earlier loss (49 vs 54) predated the islands work that cut TBT from ~900 ms to ~60–150 ms and the document from 1.15 MB to 485 KB — the balance between "inline everything (no blocking requests, bigger doc)" and "external links (blocking, cacheable)" may have flipped.

**Tech Stack:** Next.js 15.5.20 (App Router), Tailwind v4 + `@heroui/theme`, next/font, the existing Lighthouse runner (`npm run perf:prod` / `perf:local`).

**Measured starting point (2026-07-06, deployed production /en):**

| Render-blocking `<link>` | Bytes (raw) | Source | First paint needs it? |
|---|---|---|---|
| `…deaad81….css` | 306,463 | `globals.css` (main app chunk) | **Yes** — core |
| `…de3c0b….css` | 5,593 | `yet-another-react-lightbox/styles.css` (portfolio only) | **No** — leaks onto homepage |
| `…0dd1ad….css` | 4,466 | next/font `@font-face` | Yes |
| `…3b4bdc….css` | 3,532 | `vendor.css` (swiper nav / `.hp-pqs-*`) | **No** — swiper is lazy + below fold |
| `…ea0f7a….css` | 669 | `keyframes.css` | Partial (marquee/fade-up) |
| `…194e28….css` | 537 | `hero-effects.css` (`.hero-grain`) | Partial (hero) |
| `…096c65….css` | 529 | `consent.module.css` | Banner on first visit |

PSI mobile (3 runs): LCP 3.2–3.4 s, TBT 60–150 ms, CLS 0. Render-blocking insight: **~900 ms estimated savings.** Desktop: LCP 0.7–0.8 s.

**Known constraints (carried from prior rounds — read before starting):**
- Build ONLY via `npm run build` (a `tailwind.config.ts` guard throws if the `.heroui-tw` prebuild sync hook didn't run — never `npx next build`).
- After stopping a server, verify port 3000 is free (`netstat -ano | grep :3000`; `taskkill //PID <pid> //F` any Windows holdout — child processes survive shell kills).
- `npm run perf:local` needs a **production** server (`npm run build && npm run start`) in another terminal; ~5 min, 600000 ms timeout. Lighthouse prints a harmless EPERM cleanup error on Windows; the runner tolerates it. Dev-server scores are meaningless.
- ESLint forbids raw `<img>` / direct `next/image`; not touched here.
- Minimal diffs; run `npm run typecheck` when touching TS; the 50-test suite (`npm test`) must stay green.
- `experimental.inlineCss: false` is the current committed state, with a comment recording the earlier A/B (ON 49 / OFF 54). This plan re-opens that decision — update the comment with the new numbers whichever way it lands.

**Working directory:** `C:\GitHub23\code-site-workspace\Frontend` (git repo, branch off `master`).

---

### Task 0: Branch + baseline

**Files:** none (measurement only) + `docs/perf-log.md`

- [ ] **Step 1: Branch**

```bash
git checkout master && git pull && git checkout -b perf/render-blocking-css
```

- [ ] **Step 2: Record the blocking-link baseline**

```bash
npm run build && npm run start
curl -s http://localhost:3000/en -o /tmp/en-rb.html
node -e "
const html=require('fs').readFileSync('/tmp/en-rb.html','utf8');
const head=html.slice(0,html.indexOf('</head>'));
const links=[...head.matchAll(/<link[^>]*rel=\"stylesheet\"[^>]*href=\"([^\"]+)\"/g)].map(m=>m[1]);
console.log('blocking stylesheet links:', links.length);
links.forEach(l=>console.log(' ',l));
"
```
Expected: 7 links (the local build hashes differ from prod but the count and sources match). Note the count. Stop the server; verify port free.

- [ ] **Step 3: Append a baseline row to docs/perf-log.md**

Append to the table: `| 2026-07-06 | local | render-blocking baseline: homepage /en has N blocking CSS links | — | — | — | — | — |` with the real N from Step 2.

- [ ] **Step 4: Commit**

```bash
git add docs/perf-log.md
git commit -m "perf: record render-blocking CSS baseline (7 blocking links on /en)"
```

---

### Task 1: Move `vendor.css` off the global critical path into the lazy swiper chunk

`vendor.css` (swiper nav + `.hp-pqs-*` pull-quote styles, 3.5 KB) is imported in **both** root layouts, so it render-blocks *every* route — even though its only consumers (the pull-quote swiper) are lazy-loaded (`ssr: false`) and below the fold. `SwiperWrapper.tsx` already carries a comment saying vendor.css belongs in the lazy chunk; this task finishes that. Co-locating the import in `SwiperWrapper` (which every swiper instance renders through) means vendor.css loads *with* the swiper's lazy chunk, not before first paint.

**Files:**
- Modify: `src/app/(en)/layout.tsx` (remove line `import "../vendor.css";`)
- Modify: `src/app/(uk)/layout.tsx` (remove line `import "../vendor.css";`)
- Modify: `src/components/shared/swiper/SwiperWrapper.tsx` (add the import)

- [ ] **Step 1: Confirm vendor.css has no non-swiper consumers**

```bash
grep -rn "swiper-nav-btn\|hp-pqs" src --include="*.tsx" | grep -v "SwiperWrapper\|pull-quote" | head
```
Expected: only pull-quote-swiper / SwiperWrapper references (both flow through `SwiperWrapper`). If a non-swiper component uses `.swiper-nav-btn` or `.hp-pqs-*`, STOP and report — vendor.css can't be scoped to the swiper chunk without breaking that consumer.

- [ ] **Step 2: Confirm every swiper renders through SwiperWrapper**

```bash
grep -rn "from \"swiper/react\"\|Swiper" src --include="*.tsx" | grep -i "import" | grep -v "SwiperWrapper.tsx\|swiper/css\|swiper/modules\|swiper/types"
```
Expected: only `SwiperWrapper.tsx` imports `Swiper`/`swiper/react` directly (other files import the `SwiperWrapper` component). If another component uses `Swiper` directly, add the vendor.css import there too — note it in your report.

- [ ] **Step 3: Add the import to SwiperWrapper**

In `src/components/shared/swiper/SwiperWrapper.tsx`, directly below the existing `import "swiper/css/effect-coverflow";` line, add:

```ts
// Custom swiper nav + pull-quote (.swiper-nav-btn / .hp-pqs-*) styles. Imported
// here — inside the lazy swiper chunk — rather than the root layout, so it no
// longer render-blocks every route (the swiper is ssr:false + below the fold).
import "../../../app/vendor.css";
```

Verify the relative path resolves: `SwiperWrapper.tsx` is at `src/components/shared/swiper/`, so `../../../app/vendor.css` → `src/app/vendor.css`. Confirm with `ls src/app/vendor.css`.

- [ ] **Step 4: Remove the layout imports**

In BOTH `src/app/(en)/layout.tsx` and `src/app/(uk)/layout.tsx`, delete the line:

```ts
import "../vendor.css";
```
(Leave the `globals.css` and `keyframes.css` imports for now — keyframes is handled in Task 3.)

- [ ] **Step 5: Build + verify vendor.css left the homepage head**

```bash
npm run build && npm run start
curl -s http://localhost:3000/en | grep -o "swiper-nav-btn" && echo "STILL BLOCKING" || echo "OK: vendor styles not in initial /en HTML head CSS"
```
Also confirm the swiper still works: open `http://localhost:3000/en` (Playwright, chromium installed), scroll to the testimonials/pull-quote carousel below the fold, confirm the nav buttons (`.swiper-nav-btn`) render styled (round, bordered) after the lazy chunk loads. Stop server; verify port free.

- [ ] **Step 6: Typecheck + tests**

```bash
npm run typecheck && npm test
```
Expected: clean, 50/50.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(en)/layout.tsx" "src/app/(uk)/layout.tsx" src/components/shared/swiper/SwiperWrapper.tsx
git commit -m "perf: load vendor.css with the lazy swiper chunk, not the root layout"
```

---

### Task 2: Code-split the lightbox CSS so it stops leaking onto the homepage

`yet-another-react-lightbox/styles.css` (5.6 KB) is a static top-level import in `efedra-case-gallery.tsx`. Even though the Lightbox JS is `dynamic(ssr:false)`, the *CSS* import is eager, so Next hoists it into shared route CSS and it render-blocks pages that never show a lightbox — including the homepage. Moving the CSS import *inside* the dynamic boundary code-splits it with the lazy Lightbox chunk, so it only loads when a gallery tile is opened.

**Files:**
- Create: `src/components/portfolio/lightbox-lazy.tsx`
- Modify: `src/components/portfolio/efedra-case-gallery.tsx`

- [ ] **Step 1: Create the wrapper module that owns the CSS side-effect**

Create `src/components/portfolio/lightbox-lazy.tsx`:

```tsx
"use client";

// Wrapper whose ONLY job is to co-locate the lightbox stylesheet with the
// lightbox JS. Importing the CSS here (instead of at the top of
// efedra-case-gallery) puts it inside the dynamic-import boundary, so both the
// ~5.6 KB stylesheet and the library load together as a lazy chunk when a tile
// is opened — off the render-blocking path of every page that renders a gallery.
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

export default Lightbox;
```

- [ ] **Step 2: Point the dynamic import at the wrapper and drop the eager CSS import**

In `src/components/portfolio/efedra-case-gallery.tsx`:

Remove the top-level line:
```tsx
import "yet-another-react-lightbox/styles.css";
```

Change the dynamic import from:
```tsx
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});
```
to:
```tsx
const Lightbox = dynamic(() => import("./lightbox-lazy"), {
  ssr: false,
});
```

(The wrapper default-exports the same `Lightbox` component, so all existing `<Lightbox …>` JSX and props are unchanged.)

- [ ] **Step 3: Build + verify the lightbox CSS is gone from the homepage head**

```bash
npm run build && npm run start
curl -s http://localhost:3000/en | grep -o "yarl__" && echo "STILL ON HOMEPAGE" || echo "OK: lightbox CSS not in /en head"
```
Expected: `OK`. Then verify the lightbox still works where it's actually used: open a portfolio case page that renders `EfedraCaseGallery` (find one via `grep -rn "EfedraCaseGallery\|case-page" src/app` to identify the route, e.g. `/en/portfolio/<slug>`), click a gallery tile, confirm the lightbox opens **styled** (the `.yarl__*` classes apply — full-screen dark overlay, nav arrows) after the lazy chunk loads. Stop server; verify port free.

- [ ] **Step 4: Typecheck + tests**

```bash
npm run typecheck && npm test
```

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/lightbox-lazy.tsx src/components/portfolio/efedra-case-gallery.tsx
git commit -m "perf: code-split lightbox CSS with its lazy chunk (was leaking onto the homepage)"
```

---

### Task 3: Fold `keyframes.css` and `hero-effects.css` into the main chunk

These two small, globally-relevant files (669 B + 537 B) are separate `import`s, so Next emits each as its own blocking `<link>`. `@import`-ing them at the top of `globals.css` inlines their content into the single main app chunk — removing two blocking requests at the cost of ~1.2 KB added to a stylesheet that already loads on every page.

**Files:**
- Modify: `src/app/globals.css` (add two `@import`s)
- Modify: `src/app/(en)/layout.tsx` and `src/app/(uk)/layout.tsx` (remove the `keyframes.css` import)
- Modify: `src/components/blocks/hero/index.tsx` (remove the `hero-effects.css` import)

- [ ] **Step 1: Add the `@import`s to globals.css**

`globals.css` currently begins:
```css
@import "tailwindcss";
@config "../../tailwind.config.ts";
```
Immediately AFTER the `@config` line, add:
```css
/* Folded in from standalone files so they ship inside this single main CSS
   chunk instead of two extra render-blocking <link>s. keyframes = global
   marquee/fade-up/etc.; hero-effects = the .hero-grain overlay + hero @keyframes. */
@import "./keyframes.css";
@import "../components/blocks/hero/hero-effects.css";
```
Verify both relative paths resolve from `src/app/globals.css`: `./keyframes.css` → `src/app/keyframes.css`; `../components/blocks/hero/hero-effects.css` → `src/components/blocks/hero/hero-effects.css`. Confirm with `ls src/app/keyframes.css src/components/blocks/hero/hero-effects.css`.

- [ ] **Step 2: Remove the now-duplicate imports**

In BOTH `src/app/(en)/layout.tsx` and `src/app/(uk)/layout.tsx`, delete:
```ts
import "../keyframes.css";
```
In `src/components/blocks/hero/index.tsx`, delete:
```ts
import "./hero-effects.css";
```

- [ ] **Step 3: Build + verify no visual regression and fewer links**

```bash
npm run build && npm run start
curl -s http://localhost:3000/en -o /tmp/en-rb2.html
node -e "
const html=require('fs').readFileSync('/tmp/en-rb2.html','utf8');
const head=html.slice(0,html.indexOf('</head>'));
const n=[...head.matchAll(/<link[^>]*rel=\"stylesheet\"/g)].length;
console.log('blocking stylesheet links now:', n);
"
```
Expected: down to **3** (main+keyframes+hero-effects merged into one; vendor + lightbox gone via Tasks 1–2; leaving main, font-face, consent-module). Confirm the animations still work: open `/en`, verify the trusted-by **marquee scrolls** (keyframes) and the **hero grain overlay** is present (`.hero-grain` — inspect that a fixed full-screen element with the grain background exists). If the marquee is static or the grain is missing, the `@import` didn't take — STOP and report (likely a path or `@layer` ordering issue). Stop server; verify port free.

- [ ] **Step 4: Typecheck + tests**

```bash
npm run typecheck && npm test
```

- [ ] **Step 5: Measure the Phase-A win**

`npm run start`, then `npm run perf:local` (600000 ms timeout). Append to docs/perf-log.md: `| 2026-07-06 | local | phase A: blocking CSS links 7→3 (vendor+lightbox lazy, keyframes+hero-effects folded) | <score> | <lcp> | <tbt> | <fcp> | <cls> |` from the MEDIAN. Stop server; verify port free.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css "src/app/(en)/layout.tsx" "src/app/(uk)/layout.tsx" src/components/blocks/hero/index.tsx docs/perf-log.md
git commit -m "perf: fold keyframes.css + hero-effects.css into the main CSS chunk (7→3 blocking links)"
```

---

### Task 4: Re-A/B `experimental.inlineCss` under post-islands conditions — decision gate

The earlier A/B (inlineCss ON 49 / OFF 54, recorded 2026-07-05) ran **before** the islands work cut TBT from ~900 ms to ~60–150 ms and shrank the document from 1.15 MB to 485 KB. `inlineCss: true` eliminates *all* render-blocking CSS `<link>`s (they become `<style>`) — directly killing the remaining ~900 ms — at the cost of re-adding CSS to the RSC flight payload (a bigger document). With JS now light, that parse/transfer cost is smaller relative to the render-block savings, so the winner may have flipped. **This is a measurement with a decision, not a predetermined change.**

**Files:**
- Possibly modify: `next.config.ts` (only if ON now wins)
- Modify: `docs/perf-log.md`

- [ ] **Step 1: Measure current state (inlineCss OFF, post Phase A)**

Reference row = the Task 3 Step 5 "phase A" median. If you want a clean same-session pair, re-measure OFF now: `npm run build && npm run start`, `npm run perf:local`, note the median as "inlineCss OFF (phase A)". Also capture doc size + blocking-link count: `curl -s http://localhost:3000/en | wc -c` and the link-count node snippet from Task 3 Step 3. Stop server; verify port free.

- [ ] **Step 2: Flip ON and measure**

In `next.config.ts`, set `inlineCss: true` (leave the existing A/B comment; append `// re-A/B 2026-07-06 post-islands, see docs/perf-log.md`).
```bash
npm run build && npm run start
```
Capture doc size + confirm blocking `<link>`s went to ~0 (they should now be inline `<style>`): `curl -s http://localhost:3000/en | grep -c "rel=\"stylesheet\""` (expect 0 or near-0) and `curl -s http://localhost:3000/en | wc -c` (expect larger than OFF). Then `npm run perf:local`. Record median as "inlineCss ON (phase A)". Stop server; verify port free.

- [ ] **Step 3: Decide**

Decision rule on the two medians: **score first; tie (±1) → lower LCP; still tied → lower TBT.** Because the whole point is the render-block, weight LCP/FCP heavily if the score is within noise — but do not override a clear score win. Record both rows in docs/perf-log.md regardless.

- [ ] **Step 4: Set the final state + document**

Set `next.config.ts` to the winner. Update the comment to state the measured justification and supersede the old one, e.g.:
```ts
    // inlineCss re-measured 2026-07-06 post-islands (docs/perf-log.md): ON scored
    // X / OFF scored Y on /en mobile. <Earlier 2026-07-05 A/B favored OFF when
    // TBT was ~900ms; the islands work changed the balance.> Keeping <ON|OFF>.
    inlineCss: <true|false>,
```
Rebuild once with the final state to confirm it builds.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts docs/perf-log.md
git commit -m "perf: set inlineCss per re-measured post-islands A/B (see docs/perf-log.md)"
```

---

### Task 5: Final gate + PR

- [ ] **Step 1: Full gate**

```bash
npm run typecheck && npm test && npm run build
```
All must pass (50 tests).

- [ ] **Step 2: Final local measurement**

`npm run start`, `npm run perf:local`. Append `| 2026-07-06 | local | render-blocking refactor final | <median> |` row, stop server, commit:
```bash
git add docs/perf-log.md
git commit -m "perf: record final local Lighthouse for render-blocking refactor"
```

- [ ] **Step 3: Push + PR**

```bash
git push -u origin perf/render-blocking-css
gh pr create --title "Render-blocking CSS: unblock the homepage critical path" --body "$(cat <<'EOF'
## Summary
Homepage shipped 7 render-blocking CSS <link>s (~900ms mobile). This cuts them:
- vendor.css (swiper, below-fold + lazy) moved from the root layout into the lazy swiper chunk — no longer blocks any route.
- Lightbox CSS (portfolio-only) code-split with its lazy chunk — was leaking onto the homepage; now loads only when a gallery tile opens.
- keyframes.css + hero-effects.css folded into the single main chunk via @import — two fewer blocking requests.
- inlineCss re-A/B'd under post-islands conditions (TBT now ~60–150ms vs ~900ms when first measured) — kept the measured winner; numbers in docs/perf-log.md.

## Measured (local 3-run medians; full history in docs/perf-log.md)
- Blocking CSS links on /en: 7 → 3 (Phase A), and → ~0 if inlineCss ON won.
- <fill LCP/TBT/score progression from perf-log>

## Verification
- npm run typecheck / npm test (50/50) / npm run build green at every task
- Playwright: swiper nav renders after lazy load; lightbox opens styled on portfolio; homepage marquee + hero grain intact
- Confirmed vendor/lightbox CSS absent from the /en <head>, keyframes/hero-effects folded into the main chunk

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: After merge + deploy: `npm run perf:prod`; record the prod row and compare against today's LCP 3.2–3.4 s / render-block ~900 ms.**

---

## Deferred / out of scope

- **The 43.7 KB main chunk itself** — its render-block only disappears via inlineCss (Task 4) or a critical-CSS split. A manual above-the-fold critical-CSS extraction is fragile with Tailwind's single-file output and is deliberately not attempted here.
- **consent.module.css (529 B)** — kept as a separate chunk; it's a CSS Module (scoped hashed classes) that doesn't fold cleanly into globals, and the banner is genuinely early. Revisit only if it's still a meaningful fraction of the render-block after Tasks 1–4.
- **`@font-face` chunk** — emitted by next/font; not consolidatable without giving up next/font's optimizations.
- **"Reduce unused JavaScript 141 KiB" / non-composited animations** — separate follow-ups; not CSS render-block.
- **`experimental.cssChunking` tuning** — only worth exploring if Phase A + inlineCss don't land the render-block; left as a fallback lever.
