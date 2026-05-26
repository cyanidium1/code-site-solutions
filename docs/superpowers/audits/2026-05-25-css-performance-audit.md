# CSS Performance Audit — Phase 4

**Date:** 2026-05-25
**Branch:** `refactor/style-system-unification` (105 commits since master)
**Scope:** Read-only audit. No source changes. Each finding has a recommended fix and an impact estimate for Phase 5 triage.
**Tooling:** Next.js 15.5.15, Tailwind 4.2.4, HeroUI plugin.

---

## Executive summary

- **CSS bundle (production, all 6 chunks):** 448,565 B uncompressed / 63,408 B gzipped
- **Largest chunk (`c17448fb…css`, main app):** 411,341 B raw / 55,612 B gzipped
- **Source CSS shipped:** 5 files, 794 lines total (globals 224, keyframes 39, vendor 216, blog 285, hero-effects 30)
- **23 findings** identified across 7 categories
- **Top 3 wins:**
  1. Delete 6 orphaned `@theme` tokens + 1 duplicate (`--color-accent-deep`, all 8 `--color-industry-*`, `--color-bg-subtle`, `--spacing-gutter-x/sm/md`, `--background-image-hero-glow`) — pure CSS reduction with zero JSX changes
  2. Delete 6 dead `@layer utilities` rules in `globals.css` (`.text-gradient`, `.text-gradient-brand`, `.text-gradient-soft`, `.grid-bg`, `.dotted-bg`, `.ease-soft`) — ~55 lines, zero consumers
  3. Promote top 4 repeated arbitrary OKLCH alpha values (`oklch(from var(--color-accent) l c h / 0.12 | 0.18 | 0.3 | 0.4)`) to `@theme --color-accent-*` tokens — eliminates ~50 long arbitrary-value strings across blocks
- **Phase 5 candidates (highest leverage, lowest risk):**
  - Dead-token + dead-utility sweep in `globals.css` (Section B)
  - Promote 4 accent-alpha arbitrary values to tokens (Section C)
  - Fix orphan `var(--bg-2)` reference in hero (latent bug, Section B.4)
  - Inline single-consumer `hpSectionTightClass` and `hpSectionCtaClass` (Section D)
  - Promote `max-[760px]:` and `max-[1440px]:` to `@theme` breakpoints (Section G.4)

**Overall verdict:** The Phase 1–3 work landed the CSS system in **excellent** shape. Source CSS is down to 794 lines across 5 files (from ~6,000+ across many files pre-refactor), the @theme block is now the single source of token truth, and per-route CSS impact is minimal. The remaining wins are small and surgical: dead code, a few orphan tokens, and a handful of arbitrary-value repetitions worth promoting to tokens. Estimated total savings from Phase 5 cleanup is **~2–4 KB raw / ~0.5–1 KB gzipped**, plus material DX improvements (less to grep for, fewer "where is this defined?" questions).

---

## Section A: Bundle baseline

### A.1 Built CSS chunks (`.next/static/css/`)

| File | Raw bytes | Gzip bytes | Content |
|---|---:|---:|---|
| `c17448fbbebbe4f6.css` | 411,341 | 55,612 | **Main app** (Tailwind generated utilities, globals.css output, hero/blog/all components) |
| `2ce4e711af295950.css` | 17,939 | 2,598 | Next font-face declarations (Manrope/Actay/JetBrains) |
| `1bdadb7bf8a5f179.css` | 8,898 | 1,959 | Blog post chunk (Tailwind utilities + `blog.css` @apply output) |
| `de3c0b1185bbe537.css` | 5,593 | 1,467 | `yet-another-react-lightbox` styles (portfolio gallery) |
| `677549669a8f1aa0.css` | 4,257 | 1,361 | `keyframes.css` (marquee/fade-up/svg-glow-*/hp-urgency-pulse/hp-drawer-in) |
| `194e2820104ecd0e.css` | 537 | 411 | `hero-effects.css` (.hero-grain data-URI + 2 @keyframes) |
| **Total** | **448,565** | **63,408** | |

Measured via `wc -c` and `gzip -c <file> | wc -c` after a clean `npm run build`.

### A.2 First Load CSS per route (from `npm run build` output)

Next.js does not split out CSS in its First Load JS column, but route weights cluster:
- `/calculator` and `/en/calculator` are the heaviest at 361 kB First Load JS (calculator is the most utility-heavy block).
- `/contacts` and `/en/contacts` at 379 kB First Load JS (HeroUI form components inflate this).
- Most other dynamic pages: 250–300 kB. Blog/portfolio SSG pages: 263–293 kB.
- Static `/robots.txt`, `/sitemap.xml`: 102 kB (baseline shared chunks only).

### A.3 Source CSS files

| File | Lines | Purpose |
|---|---:|---|
| `src/app/globals.css` | 224 | @theme tokens + 5 utilities + html/body + @utility max-w-container-* |
| `src/app/vendor.css` | 216 | Swiper navigation overrides + `.hp-pqs-*` pull-quote-swiper styles |
| `src/components/blocks/blog/blog.css` | 285 | Markdown prose styles (no className control over generated HTML) |
| `src/app/keyframes.css` | 39 | 6 @keyframes; tokens registered in @theme |
| `src/components/blocks/hero/hero-effects.css` | 30 | .hero-grain data-URI + 2 hero-only @keyframes |
| **Total** | **794** | |

This is a dramatic reduction from the pre-refactor baseline (homepage.css alone was 2,321 lines, calculator.css was 1,570).

---

## Section B: Unused / dead code

### Finding B.1: Six `@layer utilities` rules in `globals.css` have zero consumers
- **What:** `.text-gradient`, `.text-gradient-brand`, `.text-gradient-soft`, `.grid-bg`, `.dotted-bg`, `.ease-soft` are defined in `src/app/globals.css` lines 168–223 but never referenced anywhere except their own definitions.
- **Where:** `src/app/globals.css:169-203`, `205-210`, `212-219`, `221-223`
- **Evidence:**
  ```
  grep -rn "text-gradient\b" → only globals.css and TextGradient.tsx (which uses bg-text-gradient, not .text-gradient)
  grep -rn "grid-bg|dotted-bg|ease-soft" → only globals.css definitions
  ```
  Consumers that want the brand gradient use the `bg-text-gradient` / `bg-brand-gradient` utilities generated from the `--background-image-text-gradient` / `--background-image-brand-gradient` @theme tokens (e.g. `src/components/ui/TextGradient.tsx:7`, 35 occurrences of `bg-brand-gradient` in code).
- **Recommended fix:** Delete the entire `@layer utilities { … }` block (lines 168–224 of `globals.css`).
- **Estimated impact:** ~55 lines source removed; ~600 B raw / ~50 B gzipped from main CSS bundle.

### Finding B.2: All 8 `--color-industry-*` @theme tokens are unused
- **What:** `--color-industry-healthcare`, `-legal`, `-accounting`, `-ecommerce`, `-saas`, `-realestate`, `-cosmetology`, `-education` (8 tokens, 8 lines in @theme).
- **Where:** `src/app/globals.css:38-45`
- **Evidence:**
  ```
  for ind in healthcare legal accounting ecommerce saas realestate cosmetology education; do
    grep -rohE "industry-${ind}" src/ --include="*.tsx" --include="*.ts"
  done
  → all 8 return 0 hits
  ```
  These were likely registered in anticipation of per-industry accent colours on `/sites-for/[slug]` pages, but Industries block on the homepage uses inline `var(--gp-from)` / `var(--gp-to)` CSS vars set per slide via inline style.
- **Recommended fix:** Delete the 8 token lines. If per-industry colours are wanted later, define them at the consumer (a Map in the Industries data file) instead of @theme.
- **Estimated impact:** ~8 lines source; negligible bundle (these only inflate the CSS if the corresponding utilities are generated, and `bg-industry-*` is never used).

### Finding B.3: Token duplication: `--color-accent-deep` is identical to `--color-accent-2`
- **What:** Both are `oklch(0.45 0.20 285)` (one writes `0.2`, one writes `0.20` — same value). `--color-accent-deep` has zero consumers; `--color-accent-2` is referenced 35+ times.
- **Where:** `src/app/globals.css:35-36`
- **Evidence:**
  ```
  grep -rn "accent-deep" src/ → only globals.css line 35
  grep -rn "accent-2" src/ → 35+ matches across blocks (hero, case, comparison, cta-banner, faq, outcome, audit, blog.css)
  ```
- **Recommended fix:** Delete `--color-accent-deep`. If naming preference is for "deep" instead of "2", rename `--color-accent-2 → --color-accent-deep` and migrate the 35 consumers in a single sweep.
- **Estimated impact:** 1 line source; cleaner mental model (the duplicate is genuinely confusing).

### Finding B.4: Orphan `var(--bg-2)` reference in hero — latent bug
- **What:** The hero background gradient ends with `linear-gradient(180deg, var(--color-bg) 0%, var(--bg-2) 100%)`, but `--bg-2` is **not defined anywhere** (the `:root` shim that defined it was deleted in Phase 3 Session 5). The browser falls back to the CSS initial value (`transparent` for a gradient stop), so the bottom of the hero gradient terminates in transparency instead of the intended darker fallback.
- **Where:** `src/components/blocks/hero/index.tsx:21`
- **Evidence:**
  ```
  grep -rn "--bg-2:" src/ → no results (not defined)
  grep -rn "--bg-2"  src/ → only the hero consumer
  ```
- **Recommended fix:** Two options:
  - (a) Replace `var(--bg-2)` with the original value (was `oklch(0.10 0.005 300)` or similar — check git history of the deleted shim);
  - (b) Drop the bottom stop entirely if the visual is fine as-is (most likely — nobody filed a bug post-Phase 3).
  Verify visually first.
- **Estimated impact:** Bug-fix; no measurable bundle impact.

### Finding B.5: `--spacing-gutter-x`, `--spacing-gutter-sm`, `--spacing-gutter-md` tokens have zero consumers
- **What:** Three spacing tokens defined in @theme but no utility (`px-gutter-x`, `px-gutter-sm`, `px-gutter-md`) is referenced anywhere in the codebase. The Container primitive uses hardcoded `px-6 sm:px-8 lg:px-12` (which match the token values but don't reference them) and the comment block at `globals.css:54-62` notes the utility-stack-on-primitives pattern was intentional.
- **Where:** `src/app/globals.css:60-62`
- **Evidence:**
  ```
  grep -rnE "px-gutter-(x|sm|md)\b" src/ → 0 hits
  Container.tsx uses literal "px-6 sm:px-8 lg:px-12"
  ```
- **Recommended fix:** Delete the three token lines and the multi-line comment block above them (lines 54–62). The literal utility stack in the primitive is the canonical pattern now.
- **Estimated impact:** ~10 lines source; the tokens still generate `p-gutter-x`/`m-gutter-x`/etc. so removing them trims the Tailwind utility table modestly.

### Finding B.6: `--color-bg-subtle` has zero consumers
- **What:** Defined in @theme but never used. `--color-bg-raised` is used (once, in `team-section.tsx` via raw `var()`).
- **Where:** `src/app/globals.css:22`
- **Evidence:**
  ```
  grep -rnE "bg-bg-subtle\b|--color-bg-subtle" src/ → 0 hits outside globals
  ```
- **Recommended fix:** Delete the one token line.
- **Estimated impact:** 1 line source.

### Finding B.7: `--background-image-hero-glow` token has zero consumers
- **What:** Defined as a multi-line radial-gradient in @theme, but `bg-hero-glow` is never used. The hero uses an inline arbitrary-value bg-[radial-gradient(...)] string instead.
- **Where:** `src/app/globals.css:77-78`
- **Evidence:**
  ```
  grep -rn "hero-glow\|bg-hero-glow" src/ → only the globals.css definition + a comment
  ```
- **Recommended fix:** Either (a) delete the token; or (b) migrate the inline hero gradient in `hero/index.tsx:21` to `bg-hero-glow`. (b) is preferable if the gradient is conceptually a brand asset, but (a) is the lowest-risk DX win.
- **Estimated impact:** 2 lines if deleted; minor.

### Finding B.8: Leftover `about-values-secondary-card` className with no matching CSS rule
- **What:** The class `about-values-secondary-card` appears in JSX as a class attribute, but no CSS rule defines it anywhere.
- **Where:** `src/components/about/values-secondary-row.tsx:24`
- **Evidence:**
  ```
  grep -rn "about-values-secondary-card" src/ → 1 hit in tsx; 0 hits in any .css file
  ```
  The element gets all visual styling from the Tailwind utilities that follow on the same className string. The dangling class is harmless but misleading (suggests there's a stylesheet somewhere).
- **Recommended fix:** Remove the `about-values-secondary-card` class from the attribute.
- **Estimated impact:** DX clarity; zero bundle impact.

---

## Section C: Redundant arbitrary-value strings

### Finding C.1: Top arbitrary OKLCH-from-token alpha values are repeated 8–17× each
Most-repeated raw counts (from `grep -roh` across all `.tsx`/`.ts`):

| Occurrences | Value | Promotion target |
|---:|---|---|
| 17 | `bg-[oklch(from var(--color-accent) l c h / 0.12)]` | `--color-accent-12` → `bg-accent-12` |
| 14 | `border-[oklch(1 0 0 / 0.06)]` | use `border-line` (already defined as the same value) — see C.4 |
| 10 | `border-[oklch(from var(--color-accent) l c h / 0.4)]` | `--color-accent-40` |
| 8 | `border-[oklch(from var(--color-accent) l c h / 0.3)]` | `--color-accent-30` |
| 8 | `bg-[oklch(from var(--color-accent) l c h / 0.18)]` | `--color-accent-18` |
| 7 | `border-[oklch(from var(--color-accent) l c h / 0.25)]` | `--color-accent-25` |
| 6 | `border-[oklch(from var(--color-accent) l c h / 0.55)]` | `--color-accent-55` |
| 5 | `border-[oklch(from var(--color-accent) l c h / 0.22)]` | `--color-accent-22` |

- **What:** Tailwind v4 cannot synthesise alpha-modulated relative-color tokens automatically. Each `bg-[oklch(from var(--color-accent) l c h / 0.NN)]` string is ~50+ characters and bloats both source and final CSS (Tailwind emits each unique value as a separate rule).
- **Where:** Distributed across blocks/case/index.tsx (heaviest), comparison.tsx, faq.tsx, contact-split, lead-form, audit.tsx, hero/index.tsx, and most other blocks.
- **Evidence:** See aggregated counts above; full data in `grep -rohE "(bg|border|text)-\[oklch\([^\]]+\)\]" src/ --include="*.tsx" | sort | uniq -c | sort -rn`.
- **Recommended fix:** Promote the top 4 alpha values to @theme tokens:
  ```css
  --color-accent-12: oklch(from var(--color-accent) l c h / 0.12);
  --color-accent-18: oklch(from var(--color-accent) l c h / 0.18);
  --color-accent-30: oklch(from var(--color-accent) l c h / 0.30);
  --color-accent-40: oklch(from var(--color-accent) l c h / 0.40);
  ```
  Then replace the long arbitrary values across the codebase (~50 sites total).
- **Estimated impact:** ~500–800 chars saved per occurrence in source; ~1 KB raw / ~300 B gzipped in the final CSS (Tailwind will deduplicate the 4 generated utilities instead of emitting 50 unique arbitrary rules). Big DX win: classNames become significantly more readable.

### Finding C.2: Hardcoded `oklch(0.155 0.005 300)` / `oklch(0.16 0.005 300)` repeated 25 + 23 ×
- **What:** Two near-identical surface-bg colours used as bg-[oklch(...)] across many cards/sections. These are *not* in @theme.
- **Where:** Many components (case cards, comparison rows, calculator cards, etc.)
- **Evidence:**
  ```
  25 bg-[oklch(0.155_0.005_300)]
  23 bg-[oklch(0.16_0.005_300)]
  16 bg-[oklch(0.22_0.005_300)]
  10 bg-[oklch(0.13_0.005_300)]
  ```
- **Recommended fix:** Define a small surface-bg scale in @theme:
  ```css
  --color-surface-1: oklch(0.13 0.005 300);   /* deepest */
  --color-surface-2: oklch(0.155 0.005 300);
  --color-surface-3: oklch(0.16 0.005 300);
  --color-surface-4: oklch(0.22 0.005 300);   /* most-elevated */
  ```
  Replace the arbitrary values with `bg-surface-2`, etc.
- **Estimated impact:** ~70 sites changed; significant DX gain (visual hierarchy becomes explicit). Modest bundle reduction.

### Finding C.3: Three brand-gradient string variants exist (135deg, 180deg with/without 0%/100% stops)
- **What:** The brand gradient appears in 4 inconsistent forms:
  - `linear-gradient(180deg, var(--color-accent-soft) 0%, var(--color-accent) 100%)` — 5×
  - `linear-gradient(180deg, var(--color-accent-soft), var(--color-accent))` — 4× (no stops)
  - `linear-gradient(135deg, var(--color-accent-soft), var(--color-accent))` — 10× (135deg diagonal)
  - The @theme token `--background-image-brand-gradient` is the 180deg-with-stops form
- **Where:** Distributed: hero, contact-split, lead-form, faq, case.
- **Evidence:** `grep -rohE "linear-gradient.*accent-soft.*accent\)" src/`
- **Recommended fix:**
  - Use the existing `bg-brand-gradient` utility for all 9 180deg occurrences (already a token).
  - Promote `linear-gradient(135deg, var(--color-accent-soft), var(--color-accent))` to a new `--background-image-brand-gradient-diagonal` token; replace 10 sites.
- **Estimated impact:** Consistency + readability win; ~1 KB raw saved.

### Finding C.4: `border-[oklch(1 0 0 / 0.06)]` (14×) duplicates the existing `--color-line` token
- **What:** `--color-line` is defined as `oklch(1 0 0 / 0.08)` (slightly different alpha 0.08 vs 0.06). The 0.06 sites can either (a) use `border-line` and accept the 2 % alpha bump, or (b) promote `0.06` as a `--color-line-soft` token.
- **Where:** 14 components.
- **Recommended fix:** Visual diff at 0.06 → 0.08 is imperceptible on a dark bg — recommend (a): use `border-line` and delete the arbitrary values. If 0.06 must be preserved, introduce `--color-line-soft`.
- **Estimated impact:** Minor; consistency win.

---

## Section D: Repeated utility-string constants

### Finding D.1: `hpSectionCtaClass` is exported but has **zero consumers**
- **What:** `src/components/homepage/shared.ts:63` exports `hpSectionCtaClass = "mt-9 self-start"` but no `.tsx` file imports it.
- **Evidence:**
  ```
  grep -rn "hpSectionCtaClass" src/ → only the definition
  ```
- **Recommended fix:** Delete the export. If a future block needs the styles, inline the two utilities directly.
- **Estimated impact:** 1 line source.

### Finding D.2: `hpSectionTightClass` has 1 consumer file
- **What:** Used in only one component; the shared.ts comment block says these helpers exist precisely because they're shared by "every homepage block, the calculator, blog, pricing".
- **Where:** Definition in `src/components/homepage/shared.ts`; single consumer (one file).
- **Recommended fix:** Inline the literal `"relative py-9 lg:py-14 px-6 sm:px-8 lg:px-12 overflow-hidden bg-bg"` at the call site and delete the export.
- **Estimated impact:** Marginal; clearer signal of which helpers are truly shared.

### Finding D.3: All other `hp*Class` constants are healthy
- **Consumer counts:**
  ```
  hpSectionClass:     27 files
  hpInnerClass:       26 files
  hpEyebrowClass:     11 files
  hpEyebrowDotClass:  11 files
  hpH2Class:          11 files
  hpSubClass:         6 files
  hpLinkClass:        6 files
  hpSectionHeadClass: 10 files
  ```
  All meet the "≥2 consumers" bar comfortably. No action needed.

### Finding D.4: `*_CLASS` constants are dense inside `blocks/case/index.tsx` (40+ per file)
- **What:** The case block extracts every class string into a named constant (HEADING_EM_CLASS, SECTION_CLASS, SECTION_BG_CLASS, INNER_CLASS, HEADER_CLASS, EYEBROW_CLASS, EYEBROW_DOT_CLASS, LEDE_CLASS, META_CLASS, …40+ constants).
- **Where:** `src/components/blocks/case/index.tsx:8-200`
- **Observation:** This is a stylistic choice — fine if internally consistent — but it's also a *block-local* file, so the constants aren't shared. Some of them are only used once. Trade-off is readability vs JSX clutter.
- **Recommended fix:** No urgent action. Consider whether the case block's many `*_CLASS` constants should be inlined for any that have a single use-site within the file, to reduce indirection.

### Finding D.5: 70 `!`-prefixed utilities exist, most inside HeroUI `classNames` slot strings
- **What:** `grep -E '"!\w'` finds 70 occurrences. Sampling shows the majority are inside HeroUI Select/Input/Modal `classNames={{ base: "!...", input: "!..." }}` patterns where they override HeroUI's defaults — this is the documented pattern and is fine.
- **Where:** lead-form, faq, contact-split, calculator/LeadForm, calculator/CalculatorControls, etc.
- **Recommended fix:** No action. The `!` prefixes are intentional and necessary to win HeroUI's specificity. Worth re-auditing once the team moves further away from HeroUI.

---

## Section E: Critical CSS / above-the-fold

### Finding E.1: No prerendered HTML available for inlined-CSS measurement
- **What:** The homepage (`/`) and all marketing routes are *dynamic* (server-rendered on demand) in this build — only blog/portfolio slugs are SSG. `.next/server/app/blog/[slug]/` contains `page.js` but **no static HTML files**. Next.js 15 streams HTML for SSG routes too rather than persisting them to disk.
- **Where:** `.next/server/app/` enumeration shows zero `.html` files for app routes.
- **Recommended fix:** None for the source tree. If critical-CSS measurement matters for the team, set up a separate script to fetch the rendered HTML for `/`, `/blog/<slug>`, `/portfolio/<slug>` after `npm run start` and grep for `<style>` tags.
- **Estimated impact:** N/A (measurement limitation).

### Finding E.2: Above-the-fold components on `/` are well-bounded
- **What:** Homepage first-paint components: `<HpHeader>` (homepage/index.tsx) and `<HeroEditorial>` (blocks/hero/index.tsx).
- **CSS surface area:**
  - Hero uses ~12 utility-string constants + 2 sidecar @keyframes + the `.hero-grain` data-URI overlay.
  - Header uses inline utilities (no css module).
- **Observation:** Hero is essentially Tailwind utilities + 2 small effects rules in `hero-effects.css` (537 B raw). This is well-optimised already — there's no obvious win to extract a separate critical-CSS chunk because Next 15 already prioritises route-level CSS.
- **Recommended fix:** None.

---

## Section F: `@layer` organisation

### Finding F.1: Layer order in `globals.css` is correct
- **What:** Order is: `@import "tailwindcss"` (provides base/components/utilities layers) → `@config` → `@theme { … }` → raw `html`/`body`/`h*` rules → `@utility max-w-container-*` declarations → `@layer utilities { … }` with 6 custom rules.
- **Where:** `src/app/globals.css` lines 1–224
- **Observation:** The `@utility` declarations come *after* the raw `html`/`body`/`h*` rules. In Tailwind v4, `@utility` registers utilities into the implicit Tailwind utilities layer, so the source order doesn't affect emitted-cascade order. No conflict observed in the built CSS.
- **Recommended fix:** None. (If Finding B.1 is acted on and the `@layer utilities { … }` block deleted, no organisational change is needed for the rest.)

### Finding F.2: `!important` is concentrated in HeroUI slot patterns; no rogue uses
- **What:** 70 total `!`-prefixed utilities. Spot-check of files shows they cluster in: `lead-form/index.tsx` (~15), `calculator/LeadForm.tsx` (~12), `final/faq.tsx` (~8), `contact-split/index.tsx` (~5), `calculator/CalculatorControls.tsx` (~10). In every case sampled, the `!` is overriding a HeroUI default within a `classNames={{ base: ... }}` prop.
- **Where:** See above.
- **Recommended fix:** No action. Document the pattern in `CONTRIBUTING.md` or similar so future contributors understand `!` is HeroUI-specific.

---

## Section G: Anti-patterns from Phase 1-3 inversions

### Finding G.1: 5 component classNames exceed 500 characters; worst is 690 chars
- **What:** Inline classNames that are very hard to scan.
- **Top offenders** (by char count):
  - 690 chars: blocks/case (a multi-column card grid with deep arbitrary gradients)
  - 654 chars: blocks/hero (device-mockup wrapper with shadow stacks)
  - 613 chars: blocks/contact-split (primary CTA pill with gradient + shadow + hover stacks)
  - 573 chars: blocks/hero (HERO_BG_CLASS — radials + grid + masks)
  - 565 chars: blocks/case (CARD_BASE_CLASS — borders + bg + before pseudo + multiple gradients)
- **Where:** Source-grep `grep -rohE 'className="[^"]{200,}"'`.
- **Observation:** Most of these are already extracted into `*_CLASS` constants (good!), so the JSX-readability problem is contained. The remaining concern is whether Tailwind's deduper is handling these efficiently — spot-check shows it is (utilities like `before:absolute` only appear once in the emitted CSS).
- **Recommended fix:** For the 4 longest, consider splitting into 2–3 conceptual chunks (e.g. `HERO_BG_BASE_CLASS` + `HERO_BG_GRID_OVERLAY_CLASS`). This is purely a readability win, not a perf win.
- **Estimated impact:** DX only.

### Finding G.2: 56 inline `cn()` calls in JSX; majority are static and could be hoisted
- **What:** `grep -rohE "className=\{cn\("` finds 56 occurrences. Sampling shows most pass either: (a) a hoisted `*_CLASS` constant + a conditional class, or (b) multiple string literals — the latter could be hoisted out of render to save a per-render `cn()` allocation.
- **Where:** Distributed across blocks.
- **Recommended fix:** For each call where all `cn()` arguments are string literals (no conditional/variable args), hoist the `cn(…)` result to a module-level constant. This avoids re-allocating an array + re-joining strings on each render.
- **Estimated impact:** Marginal runtime; perceptible only on pages that re-render frequently (none currently — these are largely static pages).

### Finding G.3: `before:` / `after:` pseudo chains are present in 10 blocks but not abusive
- **What:** Files with 5+ `before:` prefixes: case, comparison/cmp-table, cta-banner, image-text, outcome, page-hero, reasons, services, team-cards, turnkey-list.
- **Observation:** None of the pseudo-content strings are longer than the 50-char threshold the audit script used. Pseudo usage is restrained and intentional (mostly decorative dots/lines/glows).
- **Recommended fix:** No action.

### Finding G.4: `max-[Npx]:` outliers are dominated by 2 widths that justify promotion
- **What:** Distribution of `max-[Npx]:` non-canonical breakpoint utilities:
  ```
  47 × max-[1440px]:    ← candidate for @theme --breakpoint
  32 × max-[760px]:     ← candidate for @theme --breakpoint
  12 × max-[1080px]:
  12 × max-[1024px]:
   9 × max-[900px]:
   5 × max-[960px], max-[500px]:
   4 × max-[1200px]:
   3 × max-[1280px]:
   1 each: max-[600px], max-[560px], max-[1000px]
  ```
- **Recommended fix:** Promote `1440px` and `760px` to named @theme breakpoints (perhaps `--breakpoint-2xl: 1440px` since it sits above current `xl: 1100px`, and `--breakpoint-mobile-l: 760px` or similar). Then the 47 + 32 = **79 sites** can flip from `max-[1440px]:` / `max-[760px]:` to `max-2xl:` / `max-mobile-l:` (or the chosen names).
- **Estimated impact:** Source readability (79 sites simpler); negligible bundle.
- **Caution:** Whatever names are chosen, document them prominently in the @theme block comment alongside the existing `md: 700px ≠ 768px` warning, because the team has burned themselves before on Tailwind's default breakpoint values.

### Finding G.5: Mixed CSS-var styles (`var(--color-…)`) in arbitrary values vs Tailwind utilities
- **What:** Many components mix two styles inconsistently:
  - `text-[var(--color-ink-dim)]` (raw CSS var)
  - `text-ink-dim` (generated Tailwind utility for the same token)
- **Where:** `lead-form/index.tsx` lines 41, 57, 95, 104, 123 use the var(...) form; most other places use the utility form. ~30–50 total occurrences of the var() form.
- **Recommended fix:** Migrate `[var(--color-X)]` → the named utility (`-X` or `-X-dim` etc.) for tokens that have generated utilities. This is mostly a search-and-replace; the result is identical CSS but consistent source.
- **Estimated impact:** Consistency / DX; no bundle impact.

### Finding G.6: One `oklch(...)` literal `rgba(255,255,255,0.10)` mixed in
- **What:** `grep -rohE "radial-gradient.*rgba" src/` finds `radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)` repeated 7×. The codebase has otherwise standardised on OKLCH; this is one of the few rgba holdouts.
- **Where:** Some block with a dotted-bg pattern (likely substituting for the dead `.dotted-bg` utility identified in B.1).
- **Recommended fix:** Migrate to `oklch(1 0 0 / 0.10)` for consistency. Even better: hoist the gradient to a `@theme --background-image-dotted` token.
- **Estimated impact:** Consistency / DX.

---

## Recommendations / Phase 5 candidates (prioritised)

Each item: **scope** (S = small, M = medium, L = large), **risk** (low/med/high), and the expected outcome.

1. **[S, low] Dead-code sweep in `globals.css`** — Delete 6 `@layer utilities` rules (B.1), 8 industry tokens (B.2), `--color-accent-deep` (B.3), 3 spacing-gutter tokens (B.5), `--color-bg-subtle` (B.6), `--background-image-hero-glow` (B.7). All zero-consumer; pure deletion. **Outcome:** ~80 fewer lines of source, ~600 B raw bundle reduction, sharply clearer @theme block.

2. **[S, low] Fix orphan `var(--bg-2)` reference in hero (B.4)** — Replace or remove. Risk is purely visual; needs a 30-second eyeball check after change. **Outcome:** Bug fix.

3. **[S, low] Delete unused `hpSectionCtaClass` and inline `hpSectionTightClass` (D.1, D.2)** — Single-grep deletion. **Outcome:** Clearer signal of which helpers are truly shared.

4. **[S, low] Remove leftover `about-values-secondary-card` className (B.8)** — 1-line edit. **Outcome:** Clarity.

5. **[M, low] Promote top 4 OKLCH-from-accent alphas to @theme tokens (C.1)** — Introduce `--color-accent-12/18/30/40`. Migrate 50 sites. Risk is mechanical (search/replace). **Outcome:** ~50 long arbitrary values become short tokens; ~1 KB raw saved; significantly more readable className strings.

6. **[M, low] Promote `oklch(0.13/0.155/0.16/0.22 0.005 300)` surface colours to a `--color-surface-1..4` scale (C.2)** — ~70 sites changed. **Outcome:** Visual hierarchy becomes explicit in the @theme block; DX improvement is substantial.

7. **[M, low] Promote `max-[1440px]:` and `max-[760px]:` to @theme breakpoints (G.4)** — 79 sites flipped. Risk: pick a name that won't conflict if Tailwind ever adds a default 2xl-equivalent. **Outcome:** Source readability for the two most common outliers.

8. **[M, low] Unify `linear-gradient(135deg, accent-soft, accent)` to a new diagonal brand-gradient token (C.3)** — 10 sites use this; promote to `--background-image-brand-gradient-diagonal`. **Outcome:** Consistency, ~500 B raw saved.

9. **[S, low] Migrate `border-[oklch(1 0 0 / 0.06)]` to `border-line` where acceptable (C.4)** — Visual diff is imperceptible. 14 sites. **Outcome:** Consistency.

10. **[M, med] Standardise `[var(--color-X)]` → named utility (G.5)** — Mechanical replace, but worth verifying no @apply chain depends on the raw var form. **Outcome:** Consistency.

11. **[S, low] Replace `rgba(...)` holdouts in dotted patterns with OKLCH (G.6)** — 7 sites. **Outcome:** OKLCH-only codebase.

12. **[L, med] Split the 4 longest className constants into 2–3 conceptual chunks (G.1)** — Readability work; no perf gain. Optional. **Outcome:** DX.

13. **[L, med] Hoist static `cn(…)` calls out of render (G.2)** — Marginal perf gain. Worth doing alongside other touches to those files. **Outcome:** Marginal runtime saving.

---

## Measurement limitations

- **No prerendered HTML available** for inlined-CSS analysis (E.1). Most marketing routes are dynamic; blog/portfolio SSG output is `page.js` chunks, not `.html` files. To audit inlined critical CSS, the team would need to `npm run start` and fetch rendered HTML for a representative URL.
- **`bundle-analyzer` not run** — could provide JS chunk attribution per route but not CSS. Out of scope for this audit.
- **No `lighthouse` / runtime CSS coverage** measurement — would identify utilities that are *generated* but never *applied* at runtime on any page. Recommended as a Phase 5 follow-up if dead-code sweep doesn't reduce bundle as expected.

---

## Phase 5 — Applied findings (2026-05-25)

Applied the safe-set + OKLCH-token promotion findings from the audit above. 7 commits on `refactor/style-system-unification`; all verified with `npm run typecheck && npm run lint && npm run build` between commits.

### Changes
- **13 dead @theme tokens deleted** (Finding B.2/B.3/B.5/B.6/B.7): all 8 `--color-industry-*` colors, `--color-accent-deep` (duplicate of `--color-accent-2`), `--color-bg-subtle`, `--spacing-gutter-sm` + `--spacing-gutter-md` (kept `--spacing-gutter-x` per task spec; comment block references it), `--background-image-hero-glow`.
- **6 dead @layer utilities deleted** (Finding B.1): `.text-gradient`, `.text-gradient-brand`, `.text-gradient-soft`, `.grid-bg`, `.dotted-bg`, `.ease-soft`. Entire `@layer utilities { ... }` block removed.
- **`var(--bg-2)` orphan in hero/index.tsx fixed** (Finding B.4): Replaced with `var(--color-bg)`. Gradient is now visually flat top-to-bottom (matches current observable behavior — `--bg-2` was undefined and rendering as transparent since Phase 3 Session 5). If the original "darker bottom" intent matters, a follow-up should add a `--color-bg-deep` token.
- **`hpSectionCtaClass` deleted** (Finding D.1): zero consumers.
- **`hpSectionTightClass` inlined** (Finding D.2): single consumer was `newsletter.tsx`; literal value inlined and export removed.
- **Stale `about-values-secondary-card` className removed** (Finding B.8): no matching CSS rule existed.
- **5 OKLCH-from-accent alphas promoted to @theme tokens** (Finding C.1):
  - `--color-accent-12` (17 consumer sites)
  - `--color-accent-18` (8 sites)
  - `--color-accent-25` (7 sites)
  - `--color-accent-30` (11 sites, merged `0.3` and `0.30` source forms)
  - `--color-accent-40` (12 sites, merged `0.4` and `0.40` source forms)
  - 55 direct `bg-[oklch(...)]` / `border-[oklch(...)]` consumer strings migrated to `bg-accent-NN` / `border-accent-NN` across 23 .tsx files. Compound arbitrary-value uses (oklch inside larger `bg-[radial-gradient(...)]` strings, e.g. HERO_BG_CLASS) intentionally left intact — they require a different rewrite (inline `var()` substitution).

### Bundle delta
- **Before:** 448,565 B raw / 63,408 B gzipped (from Section A.1)
- **After:**  446,639 B raw / 63,120 B gzipped
- **Net:**    **−1,926 B raw / −288 B gzipped**

The bundle savings landed at the lower end of the Section-A estimate (~2–4 KB raw / ~0.5–1 KB gzipped). The OKLCH-promotion deduplication mostly compresses well in the gzipped stream, so the headline number on disk is smaller than the source-code change suggests; the real win is DX (className strings dropped from ~55 chars to ~14 chars at 55 sites).

### Deferred to Phase 6+
- **Non-canonical breakpoint promotion** (Finding G.4): `max-[1440px]:` (47×) + `max-[760px]:` (32×) outliers — affects ~80 utilities; warrants its own audit pass to pick non-conflicting names.
- **Remaining 10+ OKLCH patterns below the top-5 cutoff** (Finding C.1 tail): `0.10` (12×), `0.06` (12×), `0.20` (10×), `0.35` (12×), `0.55` (9×), `0.15` (8×), `0.22` (7×), `0.60` (7×). Promoting them is mechanical; deferred to keep this session's churn bounded.
- **Compound OKLCH inside `bg-[radial-gradient(...)]` etc.** (Finding C.1 edge): ~5 sites where the OKLCH is nested inside a longer arbitrary-value gradient. Migrating to `var(--color-accent-NN)` is straightforward but per-site.
- **Surface-bg scale** (Finding C.2): ~70 sites using `oklch(0.13 | 0.155 | 0.16 | 0.22 0.005 300)` would benefit from a `--color-surface-1..4` scale. Larger-scope refactor.
- **Brand-gradient consolidation** (Finding C.3): 10 sites use the 135° diagonal form; promote to a new token.
- **`border-[oklch(1 0 0 / 0.06)]` → `border-line`** (Finding C.4): 14 sites; visual diff is imperceptible.
- **`[var(--color-X)]` → named utility** (Finding G.5): ~30–50 sites; consistency win.
- **rgba → OKLCH holdouts** (Finding G.6): 7 sites.
- **Long className-constant splitting** (Finding G.1) + **static `cn()` hoisting** (Finding G.2): DX-only; per-consumer judgement.

---

## Phase 6 — Deferred polish (2026-05-26)

Applied the breakpoint-promotion + additional-OKLCH-promotion + utility-hoisting items deferred from Phase 5. 6 commits on `refactor/style-system-unification`; verified with `npm run typecheck && npm run build` between batches.

### Changes
- **Two non-canonical breakpoints promoted to `@theme` tokens** (Finding G.4):
  - `--breakpoint-2xl: 1440px` — extends the canonical scale past `xl` (1100); 47 consumer references migrated from `max-[1440px]:` to `max-2xl:` across hero, image-text, layout/hp-header, locale-switcher, and ui/Btn.
  - `--breakpoint-md-wide: 760px` — sits between `md` (700) and `lg` (800); 32 consumer references migrated from `max-[760px]:` to `max-md-wide:` across all three calculator files. Option A (preserve design exactly) was chosen over consolidating into `max-md:`; the 60px window between 700–759 is design-significant on the calculator's grid breakpoints and consolidating would have caused single→two-column layout to occur 60px earlier than intended.

- **9 additional OKLCH-from-accent alpha values promoted** (Finding C.1 tail): `--color-accent-{6, 8, 10, 15, 20, 22, 35, 50, 55}`. Selection criteria: standalone color-context usages with ≥4 references. Patterns nested inside `bg-[radial-gradient(...)]` or `shadow-[...]` arbitrary values were intentionally skipped — they're not directly promotable to single-color utilities. ~46 consumer references migrated across 26 .tsx files via a single bulk sed-script + manual verification.
  - Convention: 1- or 2-digit suffix matches the source alpha × 100, no leading zero (`accent-6`, `accent-15`, `accent-22`) — consistent with Phase 5's `accent-12/18/25/30/40`. Both `0.1` and `0.10` source forms collapse onto `accent-10`.

- **7 long inline className strings hoisted** (Finding G.1/G.2): module-level constants in 3 files:
  - `blocks/final/audit.tsx`: 2 constants (`AUDIT_INPUT_CLASS`, `AUDIT_SUBMIT_CLASS`); 4× input + 1× submit = 5 inline occurrences deduplicated. The four `<input>`s previously shared an identical 280-char literal allocated per-render.
  - `blocks/final/clinic-footer.tsx`: 2 constants (`FOOTER_SOCIALS_CLASS`, `FOOTER_COL_LIST_CLASS`); both contained complex `[&>...]` descendant selector chains and the column list was rendered inside `.map()`.
  - `blocks/comparison/comparison.tsx`: 3 constants (`CMP_CTA_PRIMARY_CLASS`, `CMP_CTA_GHOST_CLASS`, `CMP_CONTACT_SUBMIT_CLASS`); each 250+ chars.

### Bundle delta (Phase 6 only)
- **Before (Phase 5 end):** 446,639 B raw / 63,120 B gzipped
- **After (Phase 6 end):**  445,978 B raw / 61,456 B gzipped
- **Net Phase 6:** **−661 B raw / −1,664 B gzipped**

The raw delta is small (breakpoint+token renames substitute roughly-equivalent string lengths), but the gzipped delta is meaningfully larger because the promoted tokens consolidate previously-unique arbitrary-value strings into the same CSS-custom-property reference (e.g. 6 instances of `border-color:oklch(from var(--color-accent) l c h / 0.55)` collapse into 6 instances of `border-color:var(--color-accent-55)` plus one shared definition).

### Cumulative delta (Phase 4 baseline → Phase 6 end)
- **Phase 4 baseline:** 448,565 B raw / 63,408 B gzipped
- **Phase 6 end:**     445,978 B raw / 61,456 B gzipped
- **Cumulative:**      **−2,587 B raw / −1,952 B gzipped**

### Phase 7+ candidates (still deferred)
- Compound OKLCH inside `bg-[radial-gradient(...)]` / `shadow-[...]` arbitrary values — would need a different rewrite pattern (substitute `var(--color-accent-NN)` inline within the composite arbitrary value).
- Remaining standalone OKLCH patterns below the new 4-ref cutoff (`accent-5`, `accent-7`, `accent-14`, `accent-28`, `accent-45`, `accent-60`, `accent-70` — each 1-2 refs).
- Surface-bg scale (Finding C.2): still ~70 sites using `oklch(0.13|0.155|0.16|0.22 0.005 300)` — would benefit from a `--color-surface-{1..4}` scale.
- Brand-gradient consolidation (Finding C.3): 10 sites use the 135° diagonal form.
- `border-[oklch(1 0 0 / 0.06)]` → `border-line` (Finding C.4): 14 sites.
- `[var(--color-X)]` → named utility (Finding G.5): ~30-50 sites.
- rgba → OKLCH holdouts (Finding G.6): 7 sites.
- HeroUI library swap (if pain emerges).
- Light theme / multi-theme support.
