# Third-Party Deferral + DOM Hygiene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut homepage TBT (~1,370 ms) and LCP element-render-delay (~2.9 s) by gating GTM/Clarity on user interaction, then shrink the homepage DOM (~1,585 → ~1,350 elements) and document bytes via overlay merging and icon spriting — with byte-identical visuals.

**Architecture:** Three independent branches, one per lever, each measured against prod with the repo's existing `perf:prod` 3-run median protocol before the next starts. Lever 1 replaces the `next/script lazyOnload` GTM loader with an interaction/idle-gated injector (Clarity rides inside the GTM container, so one gate covers both). Levers 2–3 reduce what the App Router runtime has to hydrate: every removed element/byte is paid twice (HTML + RSC flight), which is the only remaining way to shrink the framework chunk `1255`'s 523 ms eval cost (the chunk itself is the App Router client runtime — verified, nothing removable inside).

**Tech Stack:** Next.js 15 App Router, Tailwind v4 (semantic classes in `src/app/homepage-cards.css` per PR #30/#31 discipline), lucide-react → generated inline SVG sprite, `tools/perf/run-lighthouse.mjs` for measurement.

**Context findings this plan rests on (2026-07-23 audit):**

- Lighthouse prod `/en` mobile: score 44, LCP 7.1 s (element render delay 2.9 s; image itself loads in ~0.4 s with all discovery checks green), TBT 1,371 ms, CLS 0.000.
- Script eval 2.42 s total: GTM gtag 583 ms + gtm.js 357 ms + Clarity 391 ms = **~1.33 s third-party**; framework chunks ~0.9 s.
- Chunk `1255-*.js` (173 KB raw / 46 KB wire, 523 ms eval) = **Next App Router client runtime** (`hydrateRoot`, RSC flight client, router). Chunk `4bd1b696-*.js` = react-dom. Both framework baseline — no app code leaked; no bundle surgery possible. Their runtime cost scales with flight-payload size → addressed by Tasks 3–4.
- GTM is already `strategy="lazyOnload"` ([google-tag-manager.tsx](../../../src/components/analytics/google-tag-manager.tsx)) — load-event deferral is exhausted; the next step is interaction gating.
- Homepage DOM 1,585 elements (only page above the 1,400 advisory); 421 nodes (27%) are inline SVG; class attrs 108 KB (post-`perf/slim-classnames`, big stacks already converted).

**Known trade-off to sign off before Task 1 ships:** with an interaction/idle gate, sessions that bounce in under ~8 s without any scroll/tap are never recorded by GA4/Clarity. Lab (PSI) never interacts, so third parties disappear from lab traces entirely — that is partly the point, but the analytics undercount is real and must be an explicit business decision.

---

### Task 1: Interaction/idle-gated GTM loader

**Files:**
- Modify: `src/components/analytics/google-tag-manager.tsx` (full rewrite of the component, keep the file path/export name)
- Verify with: `npm run typecheck`, `npm run consent:verify`, browser preview

- [ ] **Step 1: Capture the "before" baseline**

```bash
npm run perf:prod
```

Record the 3-run median line (score/LCP/TBT) at the top of your working notes; it goes into `docs/perf-log.md` in Step 7. Expected: TBT median in the 1,000–1,400 ms band, GTM+Clarity present in the bootup-time audit.

- [ ] **Step 2: Rewrite the component as an interaction/idle-gated injector**

Replace the entire contents of `src/components/analytics/google-tag-manager.tsx` with:

```tsx
"use client";

import { useEffect } from "react";
import { GTM_ID } from "@/constants/site";

/**
 * Google Tag Manager container. GTM hosts the rest of the marketing stack
 * (GA4, Meta Pixel, Clarity, etc.) so this single loader is the only
 * tracking code the app needs.
 *
 * Loading is gated on the first user interaction (pointer/key/touch/scroll)
 * with an idle-timeout fallback. `lazyOnload` (the previous strategy) still
 * landed GTM+Clarity's ~1.3 s of script evaluation inside the Lighthouse
 * trace window, inflating TBT and delaying the hero LCP paint. Real visitors
 * interact within the fallback window, so field data keeps flowing; sessions
 * that bounce in under IDLE_FALLBACK_MS with zero interaction are the
 * accepted cost (decision recorded in docs/perf-log.md, 2026-07-23).
 *
 * The consent-mode default state is still set synchronously by the inline
 * ConsentBootstrap script before this mounts; consent updates pushed to
 * dataLayer while GTM is not yet loaded queue in the array and are replayed
 * by the container on load.
 */
const IDLE_FALLBACK_MS = 8000;

type WindowWithGtm = Window & {
  dataLayer?: unknown[];
  __gtmInjected?: boolean;
};

function injectGtm() {
  const w = window as WindowWithGtm;
  if (w.__gtmInjected) return;
  w.__gtmInjected = true;
  const dl = (w.dataLayer = w.dataLayer ?? []);
  dl.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

export function GoogleTagManager() {
  useEffect(() => {
    if ((window as WindowWithGtm).__gtmInjected) return;
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    let timer = 0;
    const fire = () => {
      cleanup();
      injectGtm();
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, fire);
    };
    for (const e of events)
      window.addEventListener(e, fire, { passive: true, once: true });
    timer = window.setTimeout(fire, IDLE_FALLBACK_MS);
    return cleanup;
  }, []);

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        className="hidden"
        title="Google Tag Manager"
      />
    </noscript>
  );
}
```

Notes for the implementer:
- The `Window & {…}` cast pattern mirrors `src/lib/cookie-consent/core/consent-mode.ts:25` — do NOT add a `declare global` block; it would collide with the consent module's local typings.
- `once: true` on each listener plus the `__gtmInjected` idempotency guard means double-fire is impossible even if `scroll` and `pointerdown` land in the same frame.
- No `next/script` import remains — the component is a plain client component; the `<noscript>` iframe is unchanged (GTM's JS-disabled fallback).

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: exit 0, no new errors.

- [ ] **Step 4: Verify consent wiring still passes**

```bash
npm run consent:verify
```

Expected: PASS (the consent bootstrap is untouched and runs before GTM regardless of gating; this confirms the script-order contract the consent module checks).

- [ ] **Step 5: Behavioral check in the preview**

Run the dev server (preview tool, launch config, port 3000) and on `http://localhost:3000/en`:

1. Load the page and do NOT interact. In the Network panel, confirm `gtm.js` is absent for ~8 s, then loads via the idle fallback.
2. Reload; immediately scroll. Confirm `gtm.js` loads at the scroll, exactly once (one request).
3. Confirm `window.dataLayer` exists before `gtm.js` loads (consent defaults from ConsentBootstrap are queued in it).
4. Console: no errors.

- [ ] **Step 6: Commit on a new branch**

```bash
git checkout -b perf/gtm-interaction-gate
git add src/components/analytics/google-tag-manager.tsx
git commit -m "perf: gate GTM (and Clarity via container) on first interaction with 8s idle fallback"
```

- [ ] **Step 7: Measure after deploy of the PR preview / merge, and log**

```bash
npm run perf:prod
```

Success gate: TBT median drops below ~700 ms and `googletagmanager`/`clarity` rows disappear from the lab bootup-time audit; LCP median improves (render-delay component shrinks). Rollback trigger: TBT unmoved (would mean the eval was not actually in the trace window — revert to `lazyOnload`).

Append the before/after medians and the bounce-undercount decision to `docs/perf-log.md` under a `## GTM interaction gate (2026-07-23)` heading, following the file's existing entry format.

---

### Task 2: Merge static decorative overlay layers (Industries + ValueStack cards)

Every industry card renders 5 stacked overlay `<div>`s inside `CardMedia`; ValueStack cards render the same recipe. The layers that never change on hover (accent wash, vignette — and for ValueStack also the dark grade) merge into one `<div>` with comma-separated `background-image` layers. Layers with their own hover transitions (Industries' dark grade, both hover glows) and the grain layer (blend-mode + breakpoint-gated) stay separate elements. Net: −8 elements (Industries) −12–16 (ValueStack) ≈ **−20–24 elements**, plus the matching flight-payload bytes. CSS goes into `src/app/homepage-cards.css` (semantic-class discipline from PR #30/#31; the cached main sheet beats hoisted `<style>` for homepage styles — see rsc-payload-report.md).

**Files:**
- Modify: `src/components/homepage/industries.tsx:148-163` (CardMedia)
- Modify: `src/components/blocks/value-stack/index.tsx:166-194` (CardMedia)
- Modify: `src/app/homepage-cards.css` (add two classes)

- [ ] **Step 1: Record "before" computed styles for parity checking**

In the browser preview on `/en`, run this in the console and save the output:

```js
JSON.stringify([...document.querySelectorAll('#solutions a, #solutions .hp-ind-card')].slice(0,2).map(card =>
  [...card.querySelectorAll(':scope [aria-hidden] div')].map(d => {
    const s = getComputedStyle(d);
    return { bg: s.backgroundImage, op: s.opacity, blend: s.mixBlendMode };
  })
))
```

- [ ] **Step 2: Add the merged-scrim classes to `src/app/homepage-cards.css`**

Append (values are byte-identical copies of the existing Tailwind arbitrary values; layer order note: in multi-background syntax the FIRST layer paints on top, so the list below reproduces "wash below vignette" from the old sibling order):

```css
/* Merged static scrim layers — Industries cards (accent wash + vignette).
   The hover-animated dark grade and glow stay separate elements. */
.hp-ind-scrim {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(120% 115% at 50% -10%, transparent 45%, oklch(0.07 0 0 / 0.6) 100%),
    linear-gradient(130deg, oklch(from var(--accent-color, var(--color-accent)) l c h / 0.2), transparent 55%);
}

/* Merged static scrim layers — ValueStack cards (dark grade + accent wash +
   vignette; none of the three has a hover state in this block). */
.hp-vs-scrim {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(125% 120% at 50% -10%, transparent 45%, oklch(0.07 0 0 / 0.55) 100%),
    linear-gradient(135deg, oklch(from var(--card-accent) l c h / 0.18), transparent 55%),
    linear-gradient(180deg, oklch(0.13 0 0 / 0.74) 0%, oklch(0.11 0 0 / 0.86) 55%, oklch(0.1 0 0 / 0.95) 100%);
}
```

- [ ] **Step 3: Use the merged class in `industries.tsx` CardMedia**

In `CardMedia`, replace the two static layers ("per-industry accent wash" and "soft vignette") with the single merged div, keeping the dark grade (it carries `group-hover/ind:opacity-90` and the `dimClass` override for the auto card) and the hover glow as-is:

```tsx
      {/* dark grade for readability — darker toward the bottom where price sits */}
      <div className={cn("absolute inset-0 bg-[linear-gradient(180deg,oklch(0.13_0_0_/_0.58)_0%,oklch(0.12_0_0_/_0.82)_55%,oklch(0.1_0_0_/_0.94)_100%)] transition-opacity duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ind:opacity-90", dimClass)} />
      {/* merged static scrim: vignette (top) + per-industry accent wash */}
      <div className="hp-ind-scrim" />
      {/* hover accent glow (replaces the photo-occluded ::before radial) */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] bg-[radial-gradient(420px_220px_at_0%_0%,oklch(from_var(--accent-color,var(--color-accent))_l_c_h_/_0.30),transparent_70%)] group-hover/ind:opacity-100" />
```

(The two removed divs are the ones previously between the grade and the grain. The grain div and everything else stays.)

- [ ] **Step 4: Use the merged class in `value-stack/index.tsx` CardMedia**

Replace the three static layers (dark grade, accent wash, vignette) with one div; keep the hover glow and grain:

```tsx
      {/* merged static scrim: vignette (top) + accent wash + dark grade */}
      <div className="hp-vs-scrim" />
      {/* hover accent glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-[0.5s] ease-[cubic-bezier(0.22,1,0.36,1)] bg-[radial-gradient(420px_220px_at_0%_0%,oklch(from_var(--card-accent)_l_c_h_/_0.25),transparent_70%)] group-hover/vs:opacity-100" />
```

- [ ] **Step 5: Visual parity check**

`npm run typecheck` (expected: exit 0). In the preview on `/en`, re-run the Step 1 console snippet conceptually: for one industry card and one value-stack card, confirm with `getComputedStyle` that the merged div's `backgroundImage` contains the same gradient stops as the removed siblings, hover still dims/glows (hover a card, check the glow layer opacity goes 0→1), and the **auto** industry card still shows its brighter override (its `dimClass` path is untouched). Screenshot #solutions and the value section at desktop and mobile widths; compare against prod visually.

- [ ] **Step 6: Confirm the node reduction**

In the preview console:

```js
document.querySelectorAll('#solutions *').length  // expect ≈ 218 (was 226)
document.querySelectorAll('#value *').length      // expect ≈ 124–128 (was 140)
```

- [ ] **Step 7: Commit**

```bash
git checkout -b perf/dom-overlay-merge
git add src/app/homepage-cards.css src/components/homepage/industries.tsx src/components/blocks/value-stack/index.tsx
git commit -m "perf: merge static card scrim layers into multi-background divs (-24 DOM nodes, paid twice via flight)"
```

---

### Task 3: Audit icon repetition, build the sprite infrastructure

Only icons repeated ≥3× on a page benefit from spriting (a unique icon's path ships once either way). This task finds the targets and builds the machinery; Task 4 converts call sites.

**Files:**
- Create: `tools/icons/build-sprite.mjs`
- Create: `src/components/shared/sprite-icon.tsx`
- Create: `src/components/shared/icon-sprite-defs.tsx`
- Modify: `package.json` (one script line)

- [ ] **Step 1: Measure which icons repeat on `/en`**

In the browser preview console on prod `/en`:

```js
(() => { const t = {};
  document.querySelectorAll('svg.lucide').forEach(s => {
    const n = [...s.classList].find(c => c.startsWith('lucide-') && c !== 'lucide') || 'unknown';
    t[n] = (t[n] || 0) + 1; });
  return Object.entries(t).sort((a,b) => b[1]-a[1]); })()
```

Record the list. Targets = every icon with count ≥3 (expected from the audit: `arrow-up-right`, `check`, and the footer/header contact set; confirm empirically). Icons with count ≤2 are out of scope — leave them as lucide-react components.

- [ ] **Step 2: Write the sprite generator**

Create `tools/icons/build-sprite.mjs`. It reads the target icons from `node_modules/lucide-react`'s icon data is not needed — use `lucide` package path below only if present; otherwise copy path data from the rendered DOM. Robust approach that needs no new dependency: extract the inner markup of each target icon by rendering it from `lucide-react` in a tiny Node script:

```js
/**
 * Generates src/components/shared/icon-sprite-defs.tsx from lucide-react.
 * Sprite-worthy = icons rendered ≥3× on a single page (see plan Task 3 Step 1).
 * Re-run after editing TARGET_ICONS: node tools/icons/build-sprite.mjs
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { writeFileSync } from "node:fs";
import * as icons from "lucide-react";

// Keep in sync with the audit in docs/superpowers/plans/2026-07-23-perf-third-party-and-dom.md
const TARGET_ICONS = ["ArrowUpRight", "Check"]; // ← replace with Step 1 results

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const symbols = TARGET_ICONS.map((name) => {
  const svg = renderToStaticMarkup(createElement(icons[name]));
  // strip the outer <svg …> wrapper; keep only the child shapes
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  return `      <symbol id="lucide-${kebab(name)}" viewBox="0 0 24 24">${inner}</symbol>`;
}).join("\n");

const out = `/**
 * GENERATED by tools/icons/build-sprite.mjs — do not edit by hand.
 * Inline once per page (root layouts render it after {children}); SpriteIcon
 * references these symbols via <use>. Shapes inherit stroke/fill from the
 * referencing <svg>, so SpriteIcon controls color and stroke-width.
 */
export function IconSpriteDefs() {
  return (
    <svg aria-hidden="true" className="hidden">
      <defs>
${symbols}
      </defs>
    </svg>
  );
}
`;
writeFileSync("src/components/shared/icon-sprite-defs.tsx", out);
console.log(`wrote ${TARGET_ICONS.length} symbols`);
`;
```

Add to `package.json` scripts:

```json
"icons:sprite": "node tools/icons/build-sprite.mjs",
```

Implementation note: lucide-react shapes carry no per-shape `stroke-width`/`stroke` attributes (they inherit from the root svg), so the extracted inner markup inherits from the `<use>`-ing svg as required. Verify this in Step 4; if any shape DOES hardcode presentation attributes, strip them in the generator with `.replace(/ (stroke|stroke-width|fill)="[^"]*"/g, "")` applied to `inner`.

- [ ] **Step 3: Write the `SpriteIcon` component**

Create `src/components/shared/sprite-icon.tsx`:

```tsx
/**
 * Renders a lucide icon from the inline sprite (IconSpriteDefs) as
 * <svg><use/></svg> — 2 DOM nodes instead of a full inline path set.
 * Only for icons repeated ≥3× per page; one-off icons stay lucide-react.
 * Props mirror the lucide-react usage in this codebase (size, strokeWidth,
 * className); color comes from CSS `currentColor` exactly like lucide.
 */
export function SpriteIcon({
  name,
  size = 24,
  strokeWidth = 2,
  className,
}: {
  /** kebab-case lucide name, e.g. "arrow-up-right" — must exist in IconSpriteDefs */
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <use href={`#lucide-${name}`} />
    </svg>
  );
}
```

- [ ] **Step 4: Generate and smoke-test the sprite**

```bash
npm run icons:sprite
npm run typecheck
```

Expected: `icon-sprite-defs.tsx` written with one `<symbol>` per target; typecheck exit 0. Open the generated file and confirm no `stroke-width` attributes inside symbols (see Step 2 note).

- [ ] **Step 5: Commit the infrastructure**

```bash
git checkout -b perf/icon-sprite
git add tools/icons/build-sprite.mjs src/components/shared/sprite-icon.tsx src/components/shared/icon-sprite-defs.tsx package.json
git commit -m "perf: add lucide sprite generator + SpriteIcon for icons repeated per page"
```

---

### Task 4: Mount the sprite and convert repeated-icon call sites

**Files:**
- Modify: `src/app/(uk)/layout.tsx` (mount `IconSpriteDefs` after `{children}` inside `<body>`)
- Modify: `src/app/(en)/layout.tsx` (same)
- Modify: call sites from the Task 3 Step 1 audit — at minimum `src/components/homepage/industries.tsx` (ArrowUpRight ×8) and the pricing tier checkmarks in `src/components/blocks/comparison/tier.tsx`; the full list comes from the audit.

- [ ] **Step 1: Mount the sprite defs in both root layouts**

In `src/app/(uk)/layout.tsx` (and the `(en)` twin), import and render once, after the providers block so it never affects streamed-first content:

```tsx
import { IconSpriteDefs } from "@/components/shared/icon-sprite-defs";
// …
        <NextIntlClientProvider locale="uk" messages={ukMessages}>
          <Providers>
            <I18nRegistryProvider value={i18nRegistry}>
              <CaseCountProvider count={caseCount}>{children}</CaseCountProvider>
            </I18nRegistryProvider>
          </Providers>
        </NextIntlClientProvider>
        <IconSpriteDefs />
```

- [ ] **Step 2: Convert the Industries arrow (worked example — repeat the same mechanical change per audited call site)**

In `src/components/homepage/industries.tsx`, replace the `ArrowUpRight` usage:

```tsx
// import removed from the lucide-react import list at the top
import { SpriteIcon } from "@/components/shared/sprite-icon";

// …in the card footer, replacing <ArrowUpRight size={16} strokeWidth={1.8} className="…" />:
                    <SpriteIcon
                      name="arrow-up-right"
                      size={16}
                      strokeWidth={1.8}
                      className="text-[var(--accent-color,var(--color-accent))] transition-[translate] duration-[0.45s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ind:translate-x-1 group-hover/ind:-translate-y-1"
                    />
```

Repeat for every ≥3× icon from the audit, preserving each site's exact `size`, `strokeWidth`, and `className`. Do NOT convert icons passed as component references through content files (`src/content/**` `icon:` props) — that changes the `LucideIcon` type contract in `src/types/homepage.ts` for near-zero node savings (those icons are unique per card).

- [ ] **Step 3: Typecheck and lint**

```bash
npm run typecheck
```

Expected: exit 0. If ESLint flags raw `<svg>` under the no-raw-img rules, it will not — the rules cover `next/image`/`<img>` only; no disable comments needed.

- [ ] **Step 4: Visual + count verification**

In the preview on `/en`:

1. Icons render identically (spot-check industries arrows, pricing checks) at desktop + mobile widths; hover translate still animates (it's on the svg's own class).
2. `document.querySelectorAll('svg, svg *').length` — expect a drop from ≈421 toward ≈250–300 depending on how many sites the audit converted.
3. `document.querySelectorAll('*').length` — record the new homepage total.
4. Console clean; no missing-symbol blank icons (a blank icon means a `name` typo or a symbol missing from `TARGET_ICONS` — regenerate).

- [ ] **Step 5: Commit**

```bash
git add -A src/ 
git commit -m "perf: render repeated lucide icons via inline sprite (<use>) on homepage"
```

---

### Task 5: Measure, log, and close out

**Files:**
- Modify: `docs/perf-log.md` (new entry)

- [ ] **Step 1: Full production measurement after each PR merges**

```bash
npm run perf:prod
```

Run after Task 1's merge and again after Tasks 2–4's merges. Success gates:
- Task 1: TBT median < ~700 ms; GTM/Clarity gone from lab bootup-time; LCP improved. (Primary gate — if this fails, stop and diagnose before the DOM work.)
- Tasks 2–4: homepage element count ≤ ~1,400 (advisory threshold), document raw size down ≥10 KB, no CLS regression (stays 0.000), no visual diffs.

- [ ] **Step 2: Write the perf-log entry**

Append to `docs/perf-log.md` following its existing format: the chunk-1255 identification (App Router runtime — framework baseline, closes the "what is chunk 1255" question), before/after medians for each lever, the GTM bounce-undercount decision, and final DOM counts. Reference this plan file.

- [ ] **Step 3: Update the workspace audit trail**

Log the finished jobs in `../timestamps.md` per workspace CLAUDE.md (the executor session does this with real `date` output, never invented times).

---

## Self-review notes

- **Spec coverage:** item 1 (third-party deferral) → Task 1; item 2 (chunk 1255) → resolved by identification, documented in Task 5's log entry — no code task exists because none is possible; item 3 (DOM hygiene: overlays + sprite) → Tasks 2–4. Measurement discipline → Task 5.
- **Deliberate scope exclusions:** no PPR experiment (ruled out in rsc-payload-report.md), no Tailwind→CSS wholesale migration (ruled out in PR #30 discipline), no changes to the six `hidden sm:block` Business Value mini-charts (removal costs more than it saves), no content-file `icon:` prop conversions (type ripple, no repetition win).
- **Order dependency:** Task 1 is independent and highest-value — land it first and measure alone. Tasks 2–4 can proceed in parallel branches but merge after Task 1's measurement so attribution stays clean.
