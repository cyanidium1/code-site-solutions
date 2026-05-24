# Style System Unification — Design Spec

**Date:** 2026-05-24
**Status:** Approved (Approach A)
**Scope:** Phase 1 of a two-phase refactor. Phase 1 unifies styling onto a single Tailwind-first system. Phase 2 (separate spec) inverts the responsive model from desktop-first to mobile-first.

---

## 1. Goal

Replace the current mix of three styling systems (global semantic CSS, Tailwind utilities, inline `style={{}}`) with a single Tailwind-first system backed by centralized tokens and a small primitives library.

Drivers (in priority order):
1. **Maintainability** — one obvious place to change a color, a spacing value, or a container width.
2. **Onboarding / velocity** — a new dev can add a new section by composing primitives + utilities, without learning three subsystems or three breakpoint scales.
3. **Designer handoff** — `tailwind.config.ts` (or Tailwind 4 `@theme`) becomes the single source of truth that maps to a Figma token export.

Non-goals for Phase 1:
- Mobile-first inversion (Phase 2).
- Theming / dark mode / white-label (not a driver).
- HeroUI replacement (kept as-is).
- Visual redesign — output should look pixel-identical to current site at desktop widths.

---

## 2. End-State Architecture

### 2.1 Styling layers (allowed)

| Layer | Purpose | Where it lives |
|---|---|---|
| **Tokens** | Colors, spacing scale, container widths, breakpoints, type scale, shadows, radii, animations | `tailwind.config.ts` extended via Tailwind 4 `@theme` in `globals.css` |
| **Tailwind utilities** | All composition: spacing, color, typography, flex/grid in component JSX | `className=` strings in `.tsx` |
| **Primitives** | Reusable patterns extracted from repeated utility strings | `src/components/ui/` (new directory) |
| **Inline `style={{}}`** | Dynamic CSS variables passed to children ONLY | `.tsx` files, gated by ESLint rule |
| **Global CSS** | Resets, `@theme` token block, keyframes, third-party overrides | `globals.css`, `keyframes.css`, `vendor.css` |

### 2.2 Styling layers (forbidden, post-refactor)

- Component-scoped semantic CSS files (`hero.css`, `comparison.css`, etc.) — deleted.
- Inline styles for static values (hardcoded colors, padding, layout).
- Custom breakpoints in CSS files (must use Tailwind breakpoint scale).
- `@apply` outside `globals.css` — and even inside, only for content we cannot wrap in a React primitive (e.g., markdown-generated `<p>` inside `.prose`).

---

## 3. Token System

### 3.1 Source of truth

All tokens live in **one** of:
- `tailwind.config.ts` `theme.extend` (Tailwind 3 style, current setup), OR
- `globals.css` `@theme { ... }` block (Tailwind 4 native; preferred for v4 idiomatic use).

We will use the `@theme` block since this is Tailwind 4.2. `tailwind.config.ts` is retained only for HeroUI plugin registration and any plugin config that doesn't fit `@theme`.

### 3.2 Token inventory (consolidated from current state)

| Category | Tokens | Current source | Target |
|---|---|---|---|
| Colors | `--bg`, `--ink`, `--accent`, `--accent-2`, `--line`, industry color scale | Split: `:root` in globals.css + `tailwind.config.ts` extend | `@theme` only |
| Spacing | `--gutter-x` (48/32/24/18), `--section-y` (100/80/56) | `:root` + media query overrides | `@theme` with responsive values driven by Tailwind breakpoints in primitives |
| Container widths | `--container-max: 1440px`, `--container-h1`, `--container-narrow` | `:root` | `@theme` `--container-*` |
| Breakpoints | 1100/800/700/380px (custom, scattered) | Component CSS files | Tailwind defaults: `sm:640 md:768 lg:1024 xl:1280 2xl:1536` (single scale) |
| Type scale | `.h1`, `.hp-h2`, `.case-h2`, etc. as classes | `globals.css` semantic classes | `<H1>` / `<H2>` primitives with utility strings; sizes as theme tokens |
| Shadows | `accent-glow` | `tailwind.config.ts` | `@theme --shadow-*` |
| Animations | `marquee`, `fade-up`, `svg-glow-*` | `tailwind.config.ts` keyframes | `@theme --animate-*` + `keyframes.css` |
| Easing | `ease-soft` | `globals.css` `@layer utilities` | `@theme --ease-*` |

**Breakpoint consolidation is a hard decision in this spec:** the existing 1100/1080/1024/900/800/700/640/380 scattered values get rounded to the nearest Tailwind default during migration. Any layout that genuinely breaks at a non-Tailwind width gets an arbitrary-value override (`max-[1100px]:`), not a custom breakpoint. Phase 2 will revisit.

---

## 4. Primitives Library

New directory: `src/components/ui/`. Each primitive is a thin React component that owns the canonical utility string for one pattern.

### 4.1 Primitives to build (Phase 1)

| Primitive | Replaces | Notes |
|---|---|---|
| `<Container>` | `.container-page`, inline `maxWidth: var(--container-max)`, ad-hoc `mx-auto max-w-[1440px] px-12` | Variants: `default` (1440), `h1` (narrower for heading rows), `narrow` |
| `<Section>` | Section wrappers with `--section-y` padding | Variant prop for tighter/looser vertical rhythm |
| `<H1>`, `<H2>`, `<H3>` | `.h1`, `.hp-h2`, `.case-h2`, `.page-hero-h1` | `as` prop for semantic override; variant for case/hp/page contexts |
| `<Btn>` | `.btn-primary`, `.btn-ghost`, `.btn-play` (from buttons.css) | Variants: `primary | ghost | play`; sizes: `sm | md | lg` |
| `<MetaStrip>` | Inline meta strip patterns in portfolio pages | Monospace metadata row, accepts label/value pairs |
| `<GradPlaceholder>` | GradPlaceholder duplicated across about and portfolio pages | Props: `from`, `to`, `label`. Uses `style={{ "--from": ..., "--to": ... }}` and consumes them via Tailwind arbitrary values. |
| `<ScreenshotPending>` | ScreenshotPending in 2+ portfolio pages | Single source of placeholder visuals |
| `<DotGrid>` | Repeated dot-grid backgrounds | Pure CSS pattern, no inline gradient strings |
| `<TextGradient>` | `.text-gradient`, `.text-gradient-brand` | Wraps children with the gradient utility |

### 4.2 Primitive rules

- One file per primitive: `src/components/ui/Container.tsx`, etc.
- No primitive imports another primitive's CSS — primitives compose by Tailwind class merging only.
- Primitives accept `className` and merge it (using `clsx` or `tailwind-merge`) so callers can extend without forking.
- No primitive owns layout outside its scope — `<Section>` does not know what its children are.

### 4.3 What does NOT become a primitive

- One-off layout (used once or twice) — stays as utilities inline in the page.
- Content components that already exist (Hero, Comparison, Calculator) — they become consumers of primitives, not primitives themselves.

---

## 5. Inline-Style Policy

### 5.1 Allowed

```tsx
// Dynamic CSS variable passed to children
<li style={{ "--i": idx } as React.CSSProperties}>...</li>

// Token-bridged dynamic value (e.g., gradient computed from props)
<GradPlaceholder from="#abc" to="#def" />
// Internally: <div style={{ "--from": from, "--to": to }} className="bg-[linear-gradient(...,var(--from),var(--to))]" />
```

### 5.2 Forbidden

```tsx
// Static value — must be Tailwind utility
<div style={{ padding: "0 48px 24px" }} />        // → className="px-12 pb-6"
<div style={{ maxWidth: "var(--container-max)" }} /> // → <Container>
<div style={{ color: "var(--accent)" }} />        // → className="text-accent"
<div style={{ display: "contents" }} />           // → className="contents"
```

### 5.3 Enforcement

- ESLint rule `react/forbid-dom-props` configured to flag `style` on intrinsic elements, with an allowlist of property names matching `^--` (CSS custom properties).
- Tracked as a lint warning during migration, error after the file is migrated.

---

## 6. Per-File Migration Plan (CSS files)

22 CSS files exist today. Target state:

| File | Action | Notes |
|---|---|---|
| `src/app/globals.css` | **Rewrite** | Keep resets. Move all tokens into `@theme`. Remove media-query token overrides (handled by primitives). Keep `@layer utilities` only for `text-gradient`, `grid-bg`, `dotted-bg`, `container-page` (deprecated path during migration). |
| `keyframes.css` (new) | **Create** | Extract all `@keyframes` definitions. |
| `vendor.css` (new) | **Create** | Swiper overrides, HeroUI overrides if any. |
| `blog/blog.css` | **Keep, trimmed** | `.prose-*` markdown styling — Tailwind utilities can't reach markdown-generated DOM. Reduce to `@apply` rules referencing tokens. |
| `buttons/buttons.css` | **Delete** | Replaced by `<Btn>` primitive. |
| `hero/hero.css` | **Delete (hardest)** | 700+ lines. Most converts to Tailwind utilities on the JSX. Genuine outliers (complex `:has()` selectors, ticker animation, grain overlay if it uses background-blend) move to a tiny `hero-effects.css` ≤ 80 lines. |
| `comparison/comparison.css` | **Delete** | Grid + relative-color gradients become utilities; any unsupported gradient syntax keeps a single line via arbitrary value. |
| `case/case.css` | **Delete** | Replaced by primitives + utilities. |
| `contact-split/contact-split.css` | **Delete** | Split layout = grid utilities. |
| `cta-banner/cta-banner.css` | **Delete** | |
| `final/final.css` | **Delete** | FAQ accordion uses HeroUI; remaining is layout. |
| `image-text/image-text.css` | **Delete** | Image+text layouts are utility-friendly. |
| `launch-cta/launch-cta.css` | **Delete** | |
| `lead-form/lead-form.css` | **Delete** | Form fields use utilities + HeroUI. |
| `outcome/outcome.css` | **Delete** | |
| `page-hero/page-hero.css` | **Delete** | |
| `reasons/reasons.css` | **Delete** | |
| `services/services.css` | **Delete** | |
| `team-cards/team-cards.css` | **Delete** | |
| `turnkey-list/turnkey-list.css` | **Delete** | |
| `calculator/calculator.css` | **Delete** | Complex but utility-convertible. |
| `homepage/homepage.css` | **Delete** | Bento grid → grid utilities. |
| `homepage/pull-quote-swiper/pull-quote-swiper.css` | **Move to `vendor.css`** | Swiper-specific overrides. |
| `shared/swiper/swiper-wrapper.css` | **Move to `vendor.css`** | |

**Net result:** 22 CSS files → 4 (`globals.css`, `keyframes.css`, `vendor.css`, `hero-effects.css`) + the trimmed `blog.css`.

---

## 7. Migration Strategy

### 7.1 Order

The two phases of work map to two specs. Within Phase 1 (this spec), order:

1. **Foundation** — set up `@theme` tokens, create `src/components/ui/` directory, build primitives (no consumer changes yet). Verify primitives render at parity with existing semantic classes via a `/dev/primitives` test page.
2. **Easy consumers** — pages that only use Tailwind + inline styles (stories, legal, about). Convert inline styles to utilities/primitives. Delete no CSS yet.
3. **Block-by-block CSS deletion** — for each `*/<block>.css` file, convert all consumers in one pass, delete the CSS file, verify visually. Order from smallest/simplest to largest:
   - buttons, cta-banner, launch-cta, turnkey-list, reasons, services, team-cards, lead-form, outcome, contact-split, page-hero, image-text, final, calculator, homepage, case, comparison
   - **hero last** (highest risk, most complex)
4. **Globals cleanup** — once all component CSS is gone, rewrite `globals.css` to its target form; delete deprecated `.h1`, `.btn-*` shims left for compatibility.
5. **Lint enforcement** — flip `react/forbid-dom-props` from warning to error.

### 7.2 Parallel-safe boundaries

Each block is independently mergeable. A PR per block (or per ~3 small blocks) keeps diffs reviewable. The hero PR is its own merge unit.

### 7.3 Visual regression strategy

- Manual: before/after screenshot per page (desktop only — mobile-first is Phase 2) at `/`, `/about`, `/portfolio/*`, `/pricing`, `/process`, `/calculator`, `/blog/*`.
- Automated (optional, recommended): add Playwright screenshot baselines before Phase 1 starts; diff per PR.

### 7.4 Localization

Every change must be applied to both `src/app/<route>` and `src/app/en/<route>` mirrors. The 11-inline-style `about/page.tsx` has a UK and EN twin — both convert together in the same PR.

---

## 8. Risks & Open Questions

### Risks

- **`hero.css` complexity** — 700 lines includes a fixed background, grain overlay, device mockup positioning, nav, ticker animation. Some effects may not have clean Tailwind equivalents and will need to stay in a small dedicated CSS file. Mitigation: hero gets its own PR, scheduled last, with explicit budget to keep up to ~80 lines of CSS.
- **Breakpoint consolidation** — collapsing 8 custom breakpoint values to Tailwind's 5 will cause visible 1–10px reflow at certain widths. Most fall close to a Tailwind default; outliers use arbitrary-value `max-[1100px]:` syntax during Phase 1. Phase 2 (mobile-first) will revisit.
- **HeroUI styling conflicts** — HeroUI ships its own design tokens. We need to verify that overriding our `@theme` colors does not collide with HeroUI's expected CSS variables. Spike before Phase 1 starts.
- **Tailwind 4 `@theme` maturity** — v4 is recent. If `@theme` proves limiting, fall back to `tailwind.config.ts` `theme.extend` (functionally equivalent, less idiomatic). Decision deferred to foundation step.
- **CSS bundle size** — currently 22 CSS files concatenate; post-refactor, Tailwind generates a single utility sheet. Bundle should shrink, but JIT regeneration on dev may slow first paint. Acceptable.

### Open questions

- **Q1:** Do we adopt `clsx` or `tailwind-merge` for primitive className merging? (Default: `clsx` for simple cases, `tailwind-merge` only if conflict-resolution becomes a problem.)
- **Q2:** Should `<H1>` enforce `<h1>` semantics, or accept an `as` prop and default to a `<div>` for non-heading usages? (Default: enforce `<h1>` for `<H1>`; provide `<DisplayText>` for non-semantic large text if needed.)
- **Q3:** Keep `tailwind.config.ts` at all, or move 100% to `@theme`? (Default: keep `tailwind.config.ts` for HeroUI plugin registration; everything else in `@theme`.)
- **Q4:** Lint enforcement aggressiveness — block PRs that introduce new inline static styles, or warn-only until Phase 1 is done? (Default: warn during migration, error after.)

---

## 9. Success Criteria

Phase 1 is complete when:

1. Zero `.css` files exist under `src/components/**/*.css` except `blog.css`, `hero-effects.css`, `pull-quote-swiper.css` (moved to vendor), `swiper-wrapper.css` (moved to vendor).
2. `globals.css` contains only: resets, `@theme` token block, and `@layer utilities` for `text-gradient`/`grid-bg`/`dotted-bg`. No legacy semantic classes (`.h1`, `.btn-*`) remain — all consumers have moved to primitives.
3. Zero inline `style={{}}` props with static values (verified by lint rule passing in error mode).
4. All design tokens are sourced from `@theme` or `tailwind.config.ts` — no `:root { --foo: ... }` definitions in `globals.css` outside the `@theme` block.
5. `src/components/ui/` exists with the primitives in §4.1 and is imported by ≥80% of pages.
6. Visual parity at desktop widths: no unintentional change in screenshot baselines.
7. Both UK (`src/app/<route>`) and EN (`src/app/en/<route>`) mirrors converted.

---

## 10. Phase 2 Preview (out of scope for this spec)

After Phase 1 lands, a separate spec covers:
- Inverting `@media (max-width: ...)` queries (now only in `globals.css` for token overrides — already reduced surface) to mobile-first base + `@media (min-width: ...)` scaling up.
- Auditing every primitive's default utilities for mobile sensibility (e.g., `<Container>` default becomes `px-4 md:px-8 lg:px-12` instead of `px-12 max-md:px-6`).
- Reviewing hardcoded pixel widths in `hero-effects.css` for mobile scaling.
- Adding explicit viewport meta + touch-target audit.

Phase 1's discipline of consolidating breakpoints to Tailwind's scale makes Phase 2 a mechanical Tailwind exercise rather than CSS archaeology.
