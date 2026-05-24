# Manual Verification Needed — Style System Refactor

Items below require human eyes/hands. The automated execution can't verify these reliably; the assistant has marked them as it works.

**Branch:** `refactor/style-system-unification`
**Started:** 2026-05-24

---

## Pre-merge: Visual baselines (Task 1)

Before the refactor lands, capture desktop baselines at **1440px viewport** for diff comparison.

Save PNGs to `docs/superpowers/baselines/2026-05-24-pre-refactor/`:

- [ ] `/` (homepage UK)
- [ ] `/en` (homepage EN)
- [ ] `/about`
- [ ] `/en/about`
- [ ] `/pricing`
- [ ] `/process`
- [ ] `/calculator`
- [ ] `/portfolio`
- [ ] `/portfolio/_nbyg-kobenhavn`
- [ ] `/portfolio/_efedra-clinic`
- [ ] `/blog` (if exists)
- [ ] `/contact` (if exists)

**Re-screenshot the same pages after Phase D (Task 47) and diff.** Acceptable: sub-pixel anti-aliasing differences. Not acceptable: layout shifts, missing effects, color changes.

---

## Per-task visual checks

Items appended as work progresses.

<!-- APPEND-BELOW -->

### Task 4 — keyframes extracted to keyframes.css

Animations (`marquee`, `fade-up`, `svg-glow-blue/pink/dark`) are now defined in `keyframes.css` and registered via `@theme --animate-*` tokens. Tailwind 4 should auto-generate `animate-marquee`/`animate-fade-up`/etc. utilities from `--animate-*` tokens.

**Visually verify:**
- [ ] Hero ticker still scrolls smoothly on `/` and `/en`
- [ ] Any element with `animate-fade-up` still fades in
- [ ] SVG glow effects still pulse on relevant icons

If anything stopped animating, the Tailwind 4 `--animate-*` token convention may differ — fallback: re-add the `animation: { ... }` block in `tailwind.config.ts`.

### Task 5 — vendor.css consolidation

Swiper styles moved from per-component CSS into `src/app/vendor.css`. Imports added to `layout.tsx`; per-component imports removed.

**Visually verify:**
- [ ] Homepage pull-quote swiper renders correctly on `/` (carousel layout, mockups visible at desktop)
- [ ] Nav arrows on the carousel work (hover state, focus outline)
- [ ] Below 900px the side mockups disappear

### Tasks 6–13 — Primitives library (`src/components/ui/`)

Created 9 primitives + `cn` helper: Container, Section, H1/H2/H3, Btn, MetaStrip, GradPlaceholder, ScreenshotPending, DotGrid, TextGradient.

**Heading sizes are illustrative defaults** — they were not measured against the legacy `.h1` / `.hp-h2` / `.case-h2` / `.page-hero-h1` CSS (those sizes live inside individual block CSS files like `hero.css`, not `globals.css`). When each block migration runs in Phase C, compare the converted heading rendering to the baseline screenshot and adjust the `sizes` table in `src/components/ui/Heading.tsx` to match.

**Container & Section** consume `--gutter-x` and `--section-y` tokens via Tailwind 4 arbitrary-property syntax (`px-(--gutter-x)` / `py-(--section-y)`). If Tailwind 4.2 does not recognize this syntax, fall back to `[padding-inline:var(--gutter-x)]` arbitrary-value syntax.

**Btn primary** wraps children in `<span class="relative z-10">` automatically — callers do not need the manual `<span>` wrapper the legacy `.btn-primary` required.
