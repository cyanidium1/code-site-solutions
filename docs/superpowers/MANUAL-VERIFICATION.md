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

### Task S3.3 — `lead-form.css` deleted; HeroUI inputs via classNames API
Affected pages: `/contacts`, `/en/contacts` (both render `<LeadForm>` inside `<ContactSplit>`); plus any other page that mounts `<LeadForm>` directly.
- [ ] Form labels render in ink-2 at 13px / weight 500 (NOT HeroUI's default dim `foreground-500`)
- [ ] Required field asterisk (`label::after`) renders in accent-soft
- [ ] Input/Textarea/Select wrappers (collapsed): line-strong border, dark `oklch(0.16 0.005 300 / 0.7)` bg, no shadow
- [ ] Hover state: border bumps to `var(--ink-3)`, bg deepens to `oklch(0.16 0.005 300 / 0.9)`
- [ ] Focus state (and Select while open): border becomes accent-soft, bg `oklch(0.18 0.01 300 / 0.95)`
- [ ] Invalid state: border becomes red (`oklch(0.65 0.18 25)`); error message in `oklch(0.78 0.14 25)`
- [ ] Input text in ink, Manrope (font-sans), 14px; placeholder in ink-3
- [ ] Textarea has line-height 1.5
- [ ] Description text (under contact field, full variant) in ink-3
- [ ] Select dropdown (portaled to body): dark `oklch(0.13 0.005 300 / 0.98)` bg, line-strong border, deep shadow with inset highlight, 16px backdrop-blur — reached via `classNames.popoverContent`
- [ ] SelectItem rest state: ink-2 text, 8px radius
- [ ] SelectItem hover/focus: translucent white bg `rgba(255,255,255,0.06)`, ink text — reached via Tailwind `data-[hover=true]:` / `data-[focus=true]:` variants on the item itself
- [ ] SelectItem selected: accent-tinted bg `oklch(from var(--color-accent) l c h / 0.2)`, ink text
- [ ] SelectItem selected + hover: deeper accent tint `… / 0.28`
- [ ] Compact-form "show details" toggle: dashed border pill, mono text; hover → accent-soft color + accent-tinted border/bg; chevron rotates 180° when expanded
- [ ] Expanded details container: solid border card with subtle white-translucent bg, 16px gap, 18px padding
- [ ] Submit button: pill, 3-stop horizontal brand gradient (`oklch(0.55 0.18 250)` → 295 → `oklch(0.45 0.2 320)`), Manrope semibold 13px uppercase tracking, brand-glow shadow; hover lifts 1px + deepens shadow
- [ ] Error banner: dark-red tinted card with body text in light red
- [ ] Privacy footer: mono 11px ink-3 text
- [ ] Success state: accent-bordered card with brand-gradient icon tile, 22px Manrope-bold title, accent-soft Telegram link
- [ ] All HeroUI overrides use `classNames` slots (label, inputWrapper, input, description, errorMessage, trigger, value, popoverContent) with `!important` utilities where HeroUI's internal class collides — same pattern as Session 2 FAQ accordion

### Task S4.1 — `case.css` deleted (470 lines → utilities)
Affected pages: every Sanity case-study URL (`/portfolio/[slug]` + `/en/portfolio/[slug]`) plus any other consumer of the `<Case>` block in `src/components/blocks/case/index.tsx`. Hardcoded portfolio pages (`_nbyg-kobenhavn`, `_efedra-clinic`) do NOT consume `<Case>` — they use the `hp-case-*` prefixed classes from `homepage.css` via `nbyg-shared.tsx`; verified no `.case-*` (non-hp) class references remain in those pages.
- [ ] `/portfolio/[any-published-case-slug]` (UK + EN) renders identical to legacy
- [ ] `<H2 variant="case">` size matches legacy `.case-h2` across all sections (desktop clamp(34px,4.6vw,60px) leading-none tracking -0.035em max-w 14ch text-balance; @1100px clamp(30px,5vw,44px); @700px clamp(28px,8vw,36px) max-w-full) — Heading primitive reconciled
- [ ] Italic `<em>` inside the case heading still renders with the vertical accent-soft→accent brand gradient via `[&_em]:bg-clip-text [&_em]:text-transparent`
- [ ] Case section backdrop: dual-radial gradient (accent top-right + accent-2 bottom-left) still visible
- [ ] Header eyebrow pill: 6px accent dot with 8px glow, separator span in ink-3, em span in accent-soft
- [ ] Header meta strip (3 items): mono 11px tracking 0.04em with strong child as `font-display` 14px / `text-ink` block — divided by dashed top border
- [ ] Compare grid: 2-col with centered "VS" pill (`before:`) — pill 18px on desktop, 14px @1100px, hidden @700px (stacked layout)
- [ ] Before card: line border, soft white-translucent bg; After card: accent-tinted border + gradient bg + outer glow + masked gradient-border `before:` pseudo (mask-composite preserved via arbitrary utilities)
- [ ] Card head: before badge (line-strong outline pill) vs after badge (brand-gradient bg with white text and accent shadow); each with 6px dot
- [ ] Card num: mono 10px tracking 0.08em in ink-3
- [ ] Screenshot frame (`CaseShot`): 3/2 aspect, browser-chrome top bar with 3 dots + url pill, image (when src provided) covers below with object-top
- [ ] Empty-state placeholder (no src): two text-bar lines + 2x2 grid mock with the same accent-tinted radial gradient palette as other placeholders
- [ ] Tagline: font-display semibold 14px with 18px rounded icon (bad red-tint × or good accent-tint ✓)
- [ ] Checklist <ul>: 12px-gap col, 14px body (13px @700px), 22px circle icons (20px @700px), `<em>` highlights in ink + font-medium
- [ ] Card foot: dashed top border, italic 12px ink-3 text; `<strong>` children non-italic in ink-2
- [ ] Results strip: 4-col on desktop, 2-col @1100px and @700px, 1px gap as border trick (`bg-line` shows through grid gaps), 18px rounded card with overflow-hidden
- [ ] Each result: clamp(28px,3vw,44px) brand-gradient text-clipped number (28px @1100px, 24px @700px), 12px ink-2 label, mono 9px uppercase tag
- [ ] CTA strip: pill on desktop with arrow chevron (rotated borders) + ink-bg button with brand-glow shadow; lifts 2px + deepens shadow on hover; stacks to rounded-18px card on @700px
- [ ] Hardcoded portfolio pages (`_nbyg-kobenhavn`, `_efedra-clinic`) — no `.case-*` (non-`hp-case-*`) class references remain (verified via grep)

### Tasks S5.1–S5.3 — `hero.css` (736 lines) → utilities + `hero-effects.css` (30 lines)

Hero is the most visible page. Eyeball every effect at 1440px on `/` and `/en`:
- [ ] Background glow gradient (radial, behind hero content) present and positioned correctly
- [ ] Grain overlay subtle texture (from hero-effects.css)
- [ ] Device mockup proportions, position, glow halo
- [ ] Primary CTA shimmer animation on hover (uses Btn primitive's `::before`)
- [ ] Ghost CTA border on hover; play-icon span variant
- [ ] Marquee ticker scrolls left at 40s/loop (uses shared `marquee` keyframe with duration override via `animate-[marquee_40s_linear_infinite]`)
- [ ] Stats grid divider lines between stat cells
- [ ] Feature chips render with correct icons
- [ ] Nav layout: confirmed dead — the legacy `.nav` / `.brand` / `.lang` / `.nav-cta` rules in hero.css were never consumed by `HeroEditorial` JSX (page header lives in a separate component), so they were deleted with the file
- [ ] Hero H1 + H2 sizes match legacy (`<H1 variant="hp">` reconciled to `clamp(36px,5vw,64px) / 0.96 / -0.035em / uppercase` with `@640 leading 0.98`; `<H2 variant="hp">` reconciled to `clamp(34px,4vw,56px) / 1.05 / -0.02em` with `@700 clamp 28-40px` to match `.hp-h2` from homepage.css)
- [ ] At narrow viewport (1100px / 800px / 640px), responsive shrink behavior preserved
- [ ] `hero-effects.css` line count is 30 (≤80 budget). Contents: `.hero-grain` SVG-noise + mix-blend-mode overlay, `@keyframes hero-pulse`, `@keyframes float`. Two new `--animate-*` tokens (`--animate-hero-pulse`, `--animate-float`) registered in `@theme`
- [ ] 3 floating device-tag pills use dynamic inline `style={{ top, left, animationDelay }}` (per-pill offsets cannot be static utilities) — single targeted `react/forbid-dom-props` eslint-disable with reason; zero new warnings vs baseline

### Session 6 — `calculator.css` (1570 lines) → utilities + Heading variants
Affected page: `/calculator`. Full click-through:
- [ ] Each calculator step renders correctly
- [ ] Info-card visualizations preserved
- [ ] Summary panel layout + state transitions
- [ ] After-submit confirmation states
- [ ] Lead-form integration (uses HeroUI inputs — Session 3 patterns apply)
- [ ] Calculator buttons (.calc-btn-primary, .calc-btn-ghost) visual parity vs legacy
- [ ] Heading sizes match across all sub-components

### Task S3.2 — `contact-split.css` deleted
Affected pages: `/contacts`, `/en/contacts` (the only consumers of `<ContactSplit>`).
- [ ] Section background: vertical gradient from `var(--bg)` to `oklch(0.13 0.02 300)` (slight purple tint at bottom)
- [ ] Section horizontal padding: 48px desktop, 32px ≤1100px, 18px ≤700px
- [ ] HeroAuditBanner (renders only with `?source=hero-audit` query): accent-tinted card with 8px accent-soft dot + 4px outer glow; bottom-margin 32px desktop, 22px ≤700px
- [ ] Two-column grid: 4fr (channels) / 6fr (form) at ≥900px; collapses to single column with 36px gap ≤900px
- [ ] Two H2s use new `H2 variant="contact-split"` (clamp 28-36px / line-height 1.05 / tracking -0.02em)
- [ ] Italic `<em>` in both H2s uses horizontal 3-stop OKLCH gradient (blue→purple→magenta) — NOT the vertical accent gradient used elsewhere
- [ ] Channel rows: grid `36px | 1fr | auto`, hover bumps border to `line-strong` + bg lift + 2px translateX
- [ ] Featured row (Telegram): accent-tinted border + bg, icon swapped to brand gradient + white, time text in accent-soft
- [ ] On ≤500px: channel row reflows to 2-row grid (icon + main first, time below in column 2 left-aligned)
- [ ] Form card backdrop: `oklch(0.13 0.005 300 / 0.7)` with `backdrop-blur-[8px]`, line-strong border, 22px radius (16px ≤700px)
- [ ] Meta line (📍/🕒/🌐) renders inline mono text with subtle separators

### Task S3.1 — `turnkey-list.css` deleted
Affected pages: `/` and `/en` (homepage `<TurnkeyList>`), `/pricing` and `/en/pricing` (pricing page consumers).
- [ ] Section backdrop: layered radial accent (top-right at 80%/10%) + accent-2 (bottom-left at 10%/90%) gradients still visible
- [ ] Eyebrow pill: 6px accent dot (`before:`) with 8px glow before the label, mono uppercase text
- [ ] H2: clamp(34-52px) / line-height 1.05 / tracking -0.02em — uses new `H2 variant="turnkey"`; italic `<em>` still renders with vertical accent-soft→accent brand gradient text fill
- [ ] Cards grid: 3 columns at ≥1000px, 2 columns at ≤1000px, single column at ≤560px
- [ ] Each card: 40x40 accent-tinted icon box (border + bg use relative-color `oklch(from var(--color-accent) l c h / …)`), absolute mono number (e.g. `01`) in top-right
- [ ] Card title: 15.5px font-actay semibold (small label, intentionally NOT a `<H3>` variant — comment in code explains)
- [ ] Footer card (Чого ми не робимо / What we don't do): dashed border, 2-column item list with em-dash `::before` markers, italic footer line
- [ ] On ≤700px: footer list collapses to single column

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
| `homepage.css` | 2321 | **Each needs own session/spec** — covers ~10 components |
| `blog.css` | 334 | Trim only (kept for `.prose-*` markdown) |

**Recommended follow-up order** (per original plan, easiest→hardest):
1. Single follow-up session: team-cards, services, outcome, page-hero (~4 hours)
2. Single follow-up session: image-text, comparison, launch-cta, final (~half-day)
3. Single follow-up session: turnkey-list, contact-split, lead-form (~half-day)
4. **One session per heavy file:** case, hero, calculator, homepage
5. Final session: blog.css trim, then Phase D (globals cleanup + ESLint flip-to-error)

### Session 7 — `homepage.css` (2321 lines) → utilities + shared primitives
Affected pages: every homepage-component consumer (homepage, all marketing pages, calculator, blog, pricing, etc.). Spot-check:
- [ ] Homepage `/` and `/en` — full visual sweep
- [ ] Header + nav dropdowns hover + open state
- [ ] Locale switcher open/close + active state
- [ ] Mobile burger → X morph (≤700px viewport)
- [ ] Mobile drawer slide-in + stagger animations on items
- [ ] Footer columns + social icons
- [ ] Shared `.hp-section` rhythm preserved across every page using a homepage component
- [ ] Shared `.hp-eyebrow` pill renders identically wherever it appears


---

## Phase 2 — Mobile-first inversion (Sessions 1–5)

### Custom breakpoint scale (IMPORTANT for new developers)

This codebase uses a CUSTOM Tailwind breakpoint scale that does NOT match Tailwind's defaults:

| Token | Width | Tailwind default for comparison |
|---|---|---|
| `xs` | 380px | (not in defaults) |
| `sm` | 640px | 640px ✓ (matches) |
| `md` | 700px | 768px ✗ (custom) |
| `lg` | 800px | 1024px ✗ (custom) |
| `xl` | 1100px | 1280px ✗ (custom) |

Defined via `@theme --breakpoint-*` in `src/app/globals.css`. Generates `xs:`, `sm:`, `md:`, `lg:`, `xl:` (mobile-first min-width) and `max-xs:`, etc. (max-width, kept for outliers).

### Spacing tokens migrated

`--gutter-x` and `--section-y*` are now `@theme --spacing-*` tokens consumed via Tailwind utilities (`px-gutter-x`, `py-section-y`, etc.). The `:root` compat shim no longer defines these — the color/container tokens remain (Phase 3 scope).

### Inversion pattern

Every `max-[Npx]:` utility at canonical breakpoints (380/640/700/800/1100) was inverted to mobile-first equivalent. Outliers (760/900/960/1080/1200/1440) stay as `max-[Npx]:`. Where mobile-first was infeasible due to cascade interactions with non-canonical outliers on the same property, the canonical breakpoint was rewritten in `max-{token}:` form (e.g., `max-sm:`, `max-lg:`) — same semantics as the original `max-[640px]:` but named.

### Files using `max-{token}:` instead of full mobile-first inversion

These files had complex same-property cascade with non-canonical outliers; canonical max-[Npx] was rewritten to max-{token} form rather than full inversion. Visual parity preserved either way:
- `src/components/ui/Btn.tsx` (1440 + 640 stack)
- `src/components/blocks/comparison/cmp-table.tsx` (table reflow)
- `src/components/blocks/final/faq.tsx` (FAQ svg sizing)
- `src/components/blocks/image-text/index.tsx` (lines 188, 192)
- `src/components/homepage/bento.tsx` (mobile 1x1 reflow)
- `src/components/homepage/process.tsx` (5-col timeline)
- `src/components/homepage/stack.tsx` (5/3/2 col grid with :nth-child border resets)
- `src/components/layout/hp-header.tsx` + `locale-switcher.tsx`
- `src/components/blocks/hero/index.tsx` (27 occurrences, dense 1440/1080 outlier interleaving)
- `src/components/blocks/vertical-timeline/index.tsx` line 140 (max-[1080px] became min-[1080px] outlier — functionally equivalent)

### Visual verification (REQUIRED before merge)

Phase 2 must NOT change rendering at any viewport. Eyeball each page at 1440 / 1100 / 800 / 700 / 640 / 380 px and compare against Phase 1 baseline:

- [ ] `/` and `/en` — hero, marquee, bento, cases, process, pull-quote, finalcta, footer
- [ ] `/about` and `/en/about` — page hero, stats, image-text, values-secondary-row, team
- [ ] `/portfolio` UK+EN — list grid
- [ ] `/portfolio/[slug]` UK+EN — Sanity case + hardcoded cases (nbyg-kobenhavn, efedra-clinic)
- [ ] `/process`, `/pricing` UK+EN
- [ ] `/calculator` — full multi-step click-through
- [ ] `/contacts`, `/blog`, `/blog/[slug]` UK+EN
- [ ] Mobile menu drawer (≤700px viewport): burger morph, stagger animations
- [ ] Header dropdowns and locale switcher (≥800px viewport)
- [ ] FAQ accordion across pages
- [ ] Hero block at 640px viewport (highest-risk single component, 27 inversions)
- [ ] Bento grid mobile 1x1 reflow
- [ ] Comparison table mobile card mode
- [ ] Primary + ghost buttons at every breakpoint

If any page regresses, the inversion at that block was wrong — restore from git and re-invert with correct semantics.

### Viewport meta

`src/app/layout.tsx` now exports `viewport: { width: "device-width", initialScale: 1, viewportFit: "cover" }`. Inspect any rendered page's `<head>` to confirm.

### Phase 3 scope (out of Phase 2)

- Touch-target audit (≥44×44px on interactive elements)
- Color-token migration (`var(--bg)` → `var(--color-bg)` etc.); delete `:root` compat shim
- HeroUI dark-theme review under mobile-first baseline
