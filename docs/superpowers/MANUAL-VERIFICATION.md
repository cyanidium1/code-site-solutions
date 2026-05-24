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

**REGRESSION DISCOVERED + FIXED:** moving `.hp-pqs-swiper` rules from a component-imported CSS file into `vendor.css` (loaded from layout) shifted the cascade so that `swiper/css` (still imported from SwiperWrapper) ended up AFTER our overrides and clobbered the `width: 100vw` breakout — the pull-quote section rendered offset to the right. Fix: hoisted `swiper/css`, `swiper/css/navigation`, `swiper/css/effect-coverflow` imports to `layout.tsx` so library CSS loads first and vendor.css overrides win. **Recheck `/` and `/en` — testimonial section should now be centered with the device mockups positioned beside the quote.**

**Lesson for Phase C:** any block CSS that overrides a third-party library style (Swiper, HeroUI, lightbox) must be loaded AFTER the third-party CSS. Default for Phase C: hoist third-party CSS imports to `layout.tsx` if they appear in a `.tsx` file alongside CSS we're migrating into `vendor.css`.

**Visually verify:**
- [ ] Homepage pull-quote swiper renders correctly on `/` and `/en` (carousel centered, mockups visible at desktop, no horizontal page scroll)
- [ ] Nav arrows on the carousel work (hover state, focus outline)
- [ ] Below 900px the side mockups disappear

### Tasks 6–13 — Primitives library (`src/components/ui/`)

Created 9 primitives + `cn` helper: Container, Section, H1/H2/H3, Btn, MetaStrip, GradPlaceholder, ScreenshotPending, DotGrid, TextGradient.

**Heading sizes are illustrative defaults** — they were not measured against the legacy `.h1` / `.hp-h2` / `.case-h2` / `.page-hero-h1` CSS (those sizes live inside individual block CSS files like `hero.css`, not `globals.css`). When each block migration runs in Phase C, compare the converted heading rendering to the baseline screenshot and adjust the `sizes` table in `src/components/ui/Heading.tsx` to match.

**Container & Section** consume `--gutter-x` and `--section-y` tokens via Tailwind 4 arbitrary-property syntax (`px-(--gutter-x)` / `py-(--section-y)`). If Tailwind 4.2 does not recognize this syntax, fall back to `[padding-inline:var(--gutter-x)]` arbitrary-value syntax.

**Btn primary** wraps children in `<span class="relative z-10">` automatically — callers do not need the manual `<span>` wrapper the legacy `.btn-primary` required.

### Task 14 — `/dev/primitives` parity demo

Visit `http://localhost:3000/dev/primitives` after `npm run dev`. Compare each row's left-side primitive against right-side legacy version. Note any mismatches in this file before continuing to Phase B.

Known gaps to compare:
- [ ] H1 / H2 sizes (primitive uses placeholder values; legacy `.h1` / `.case-h2` source lives in component CSS files — values will be reconciled per block in Phase C)
- [ ] Primary button shimmer animation on hover
- [ ] Ghost button border on hover
- [ ] GradPlaceholder dot-grid overlay visibility
- [ ] TextGradient color stops match legacy `.text-gradient` exactly

### Heading primitive — non-standard sizes policy

Several blocks use heading sizes that don't fit the four canonical variants (`default`, `hp`, `case`, `page-hero`). Examples spotted in audit: calculator info-card h3, blog markdown headings, hero stat numbers, turnkey-list titles, comparison plan headers.

**When migrating a block in Phase C and the heading doesn't match an existing variant:**

1. **Add a new variant** to `src/components/ui/Heading.tsx` `sizes` table (e.g. `variant="calc-card"`). Give it a descriptive name that documents intent.
2. **Do NOT use `className="text-[Npx]"` overrides** as the default solution — that re-creates the inline-styles problem.
3. **`className` escape hatch only for truly one-off headings** (animated counter, per-character marquee text) — add a comment explaining why a new variant wasn't justified.

This keeps designer-facing variants in one file and prevents heading-size drift across blocks.

### Phase C — partial completion (Tasks 24, 25, 28 done)

**CSS files deleted this branch:**
- `buttons.css` (Task 24) — replaced by `btnClass()` helper + `<Btn>` primitive; consumers updated in hero, case-page, homepage/process, homepage/cases, pull-quote-swiper, pull-quote
- `cta-banner.css` (Task 25) — pseudo-elements (`::before` accent line, `::after` grid overlay) moved to Tailwind `before:`/`after:` arbitrary-value utilities
- `reasons.css` (Task 28) — background gradient + masked-grid overlay moved to arbitrary-value utilities

**Verify visually before merge:**
- [ ] Hero CTAs at `/` and `/en` — primary button shimmer on hover, ghost button border on hover, "play" icon span inside ghost variant
- [ ] Process / Cases / PullQuote CTAs (homepage) — primary button rendering preserved (`hp-section-cta` modifier still applied via cn merge)
- [ ] `<CtaBanner>` usage anywhere — top accent line, grid overlay, eyebrow dot indicator still render
- [ ] `<Reasons>` block — background gradient + vertical-line grid still visible

### Task S1.1 — `team-cards.css` deleted
Affected pages: `/stories/team-cards` (story page); any industry/about page using `<TeamCards>` block.
- [ ] Eyebrow pill has the small 6px accent dot (`::before`) with subtle glow
- [ ] Group label row (when multiple groups) shows the inline horizontal hairline filling space to the right of the label
- [ ] Photo "tag" pill in the bottom-left of a team-member photo shows a small 5px green dot with glow

### Task S1.2 — `services.css` deleted
Affected pages: industry pages that render `<Services>` (medicine/renovation/legal/etc. via industry-page) and any direct consumer.
- [ ] `services-bg` layered radial accent + accent-2 gradients visible behind the testimonial + features sections
- [ ] Testimonial visual (when `testimonialVisualSrc` provided) renders the cover image cleanly; the dot-grid pseudo and IMAGE_PLACEHOLDER fallback text are hidden under the image when it loads
- [ ] Feature cards (top 3) have the dark gradient + accent-radial glow backdrop layered under the bg image (via `after:` pseudo)
- [ ] Secondary feature cards still hover (border-color + bg shift)
- [ ] Integrations grid still renders without visible regression (the `.integration` class had no own rules)

**Stopped before:** the following CSS files remain undeleted and are scheduled for follow-up specs/sessions. They are too large to convert reliably in one session:

| File | Lines | Notes |
|---|---|---|
| `team-cards.css` | 31 | Small — quick session |
| `services.css` | 48 | Small |
| `outcome.css` | 57 | Small |
| `page-hero.css` | 66 | Small; uses `<H1 variant="page-hero">` primitive |
| `image-text.css` | 130 | Medium |
| `comparison.css` | 161 | Medium; relative-color OKLCH gradients |
| `launch-cta.css` | 165 | Medium |
| `final.css` | 172 | Medium; FAQ + socials |
| `turnkey-list.css` | 236 | Heavy |
| `contact-split.css` | 278 | Heavy |
| `lead-form.css` | 281 | Heavy; HeroUI input theming |
| `case.css` | 470 | **Each needs own session/spec** |
| `hero.css` | 736 | **Each needs own session/spec** — keeps `hero-effects.css` for grain/ticker |
| `calculator.css` | 1570 | **Each needs own session/spec** |
| `homepage.css` | 2321 | **Each needs own session/spec** — covers ~10 components |
| `blog.css` | 334 | Trim only (kept for `.prose-*` markdown) |

**Recommended follow-up order** (per original plan, easiest→hardest):
1. Single follow-up session: team-cards, services, outcome, page-hero (~4 hours)
2. Single follow-up session: image-text, comparison, launch-cta, final (~half-day)
3. Single follow-up session: turnkey-list, contact-split, lead-form (~half-day)
4. **One session per heavy file:** case, hero, calculator, homepage
5. Final session: blog.css trim, then Phase D (globals cleanup + ESLint flip-to-error)
