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

### Task S1.3 — `outcome.css` deleted
Affected pages: industry-page consumers that render `<Outcome>` (e.g. medicine, renovation, legal industries via `industry-page`).
- [ ] `outcome-bg` layered radial backdrop (top-right accent + bottom-left accent-2) visible behind the section
- [ ] "Directions" card top-right shows a 200x200 radial accent glow (`::before` pseudo)
- [ ] "Directions" eyebrow + each benefit-row number now show the 22px hairline before the label
- [ ] Benefit-hero card (when rendered) shows the large off-screen radial glow emerging from the right edge
- [ ] Each mock visual (`MockPages`, `MockBookingForm`, `MockAdmin`) shows the subtle 20px dot-grid overlay

### Task S1.4 — `page-hero.css` deleted + Heading reconciliation
Affected pages: every page using `<PageHero>` — `/stories/page-hero`, `/about` (uk + en), `/pricing`, `/process`, `/blog`, `/contacts`, `/vs-constructors`, `/vs-freelancers`, `/vs-wordpress`, sites-for/* and public-contract.
- [ ] Page-hero section background still shows the layered radial accent + accent-2 gradients
- [ ] Masked grid pattern (`::before` on the bg div) still visible behind the heading area, fading out toward edges
- [ ] Eyebrow pill has the 6px accent dot with glow before the label
- [ ] Two-column layout (text + image) collapses to single column ≤960px when `image` prop is supplied; image children (img/svg/video) still scale within the column
- [ ] H1 size matches legacy `clamp(36px, 4.6vw, 60px)` / `line-height 1.05` / `tracking -0.02em` — Heading primitive `sizes[1]["page-hero"]` updated from the placeholder `72px / 1.02` to match; consumer JSX now uses `<H1 variant="page-hero">`
- [ ] Italic `<em>` inside the H1 still renders with the brand gradient and `padding-inline-end + box-decoration-break: clone` (preserved because the `.page-hero h1 em` rule in globals.css still applies — the `page-hero` class is retained on the `<section>`)

### Task S2.4 — `final.css` deleted + HeroUI classNames
Affected pages: every consumer of `<FAQ>` and `<Audit>` — homepage `/` + `/en`, `/pricing`, `/en/pricing`, `/about`, `/process`, `/contacts`, `vs-constructors`, `vs-freelancers`, `vs-wordpress` (uk + en), sites-for/* industry pages, public-contract, and other pages mounting the FAQ block.
- [ ] FAQ section backdrop (`.faq-bg` legacy) — top-left accent + bottom-right accent-2 radial gradients still visible
- [ ] Audit section backdrop (`.audit-bg` legacy) — left-center accent-2 + bottom-right accent radial gradients still visible
- [ ] FAQ accordion item collapsed: dark `oklch(0.16_0.005_300)` background, line border, 14px radius
- [ ] FAQ accordion item OPEN (`data-[open=true]`): border bumps to `line-strong` (used Tailwind `data-[open=true]:border-line-strong` variant) — this replaces the legacy chained `.faq-accordion .faq-item[data-open="true"]` rule
- [ ] FAQ trigger: 22px padding on desktop, 18px on ≤700px
- [ ] FAQ title: 15px desktop / 13px ≤700px (uses `!text-[15px]` to override HeroUI's internal styles)
- [ ] FAQ content: 24px horizontal padding, 22px bottom (uses `!px-6 !pb-[22px]` to override HeroUI — `!important` retained per the legacy CSS file comment because data-* slot specificity collides)
- [ ] `<em>` inside content: not-italic, ink color, font-medium
- [ ] `.rich-link` inside content: accent-soft color, underline with `oklch(0.7_0.14_295/0.4)` decoration, hover swap to ink color/decoration
- [ ] +/× indicator pill (`faq-plus` legacy): 32px circle, line-strong border, transparent bg
- [ ] +/× indicator HOVER (via `group/trigger` + `group-hover/trigger:`) — text/border swap to accent-soft / accent border
- [ ] +/× indicator OPEN (`open` state): brand-gradient fill, white text, svg rotates 45° → ×
- [ ] On ≤700px: indicator shrinks to 26px and svg to 11px
- [ ] HeroUI's default rotate indicator-slot motion is disabled via `!rotate-0 !transition-none` on the indicator class
- [ ] Audit form: dark backdrop card with backdrop-blur, single-column on ≤1100px; CTA button still has the 90deg multi-stop gradient with brand-glow shadow
- [ ] FAQ heading uses `H2 variant="comparison"` (same clamp 34-56px size as comparison section heading)

### Task S2.3 — `launch-cta.css` deleted
Affected pages: every consumer of `<LaunchCta>` — homepage `/` + `/en`, plus `vs-constructors`, `vs-freelancers`, `vs-wordpress` (uk + en) and any other page that mounts the bottom CTA strip.
- [ ] At ≥1280px: device image positioned absolutely so it overflows the right edge of the inner container; left edge anchored at `calc(50% - 140px)`
- [ ] At 1024–1280px: image left edge shifts to `calc(50% - 24px)` (tighter overlap) and section min-height drops to 420px
- [ ] At ≤1024px: layout stacks single column, image becomes static and centers at max-w-720px
- [ ] At ≤700px: heading drops to clamp(26-36px), button shrinks padding/font, sub text 13.5px
- [ ] Three purple square dots (12px, 3px corner radius) above the heading with subtle 8px glow
- [ ] Button: pill, brand gradient bg, drop shadow on hover (translateY -1px + bigger shadow); focus-visible outline accent-soft 2px offset 3px
- [ ] Heading variant `launch-cta` added to Heading.tsx (clamp 32-48px uppercase with 700px breakpoint to clamp 26-36px)

### Task S2.2 — `comparison.css` deleted (relative-color OKLCH preserved)
Affected pages: `/` and `/en` (homepage pricing tier grid), `/pricing` (uses `Tier` only, separate `pricing-tier-grid-4` grid), `/en/pricing`, `/vs-constructors`, `/en/vs-constructors`, `/vs-freelancers`, `/en/vs-freelancers`, `/vs-wordpress`, `/en/vs-wordpress`, and the medicine sites-for page that mounts `<Comparison>`.
- [ ] Comparison block background gradients (`.cmp-bg` legacy) — top-right accent + bottom-left accent-2 radial visible
- [ ] Contact card backdrop (`.cmp-contact` legacy) — top accent radial + dark gradient base
- [ ] Comparison table: highlighted "good" column shows the accent-tinted background fill, accent-tinted left+right borders, accent-soft text in the header
- [ ] Comparison table on ≤700px reflows to stacked cards — param row becomes uppercase card title, each value row shows `data-label: ` pseudo before the value (except for the param row itself)
- [ ] Pricing tier grid: 3 columns at ≥1100px, single column ≤1100px, 18px gap
- [ ] vs-constructors / vs-freelancers / vs-wordpress: comparison tables and pricing grids render identically to legacy (per-row data-label reflow at ≤700px works on all three)
- [ ] Two new H2 variants: `comparison` and `comparison-contact` (added to Heading.tsx sizes table)

### Task S2.1 — `image-text.css` deleted
Affected pages: `/stories/image-text` (story page exercises side / side-with-list / centered variants); case-page consumers (rendered via `case-page/index.tsx`) — both `centered` vertical and the `centered-horizontal` two-mockup floating layout.
- [ ] Eyebrow pill across all three variants still shows the 6px accent dot (`before:`) with subtle 8px glow
- [ ] Side variant: 2-col grid at ≥960px (image+text), single column ≤960px with image first; H2 still renders at clamp(28-44px) with italic-em brand gradient
- [ ] Centered (vertical) variant: max-w-[920px] image card, 16/9 aspect, body centered under
- [ ] Centered-horizontal variant (case-page): two device mockups float at far left/right with drop-shadow; body card sits in center with radial gradient backdrop; mockups hide ≤900px and copy expands to container-prose
- [ ] Bullet list (side-with-list): check/cross circle uses accent-soft / red-soft tint correctly
- [ ] Heading variant `image-text` added to `src/components/ui/Heading.tsx` (clamp 28-44px H2 with 800px breakpoint to clamp 24-36px)

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
