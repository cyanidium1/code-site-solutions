# Phase 2 — Mobile-First Inversion Design Spec

**Date:** 2026-05-25
**Status:** Approved
**Parent spec:** [2026-05-24-style-system-unification-design.md](2026-05-24-style-system-unification-design.md) §10

## 1. Goal

Convert the style system from desktop-first to mobile-first responsive scaling. Bake the existing scattered breakpoint values into named `@theme --breakpoint-*` tokens. Migrate spacing tokens (`--gutter-x`, `--section-y`) from `:root` to `@theme`, then update consumers to use mobile-first utility stacks instead of `var()` references.

## 2. Non-goals

- Touch-target audit (deferred to Phase 3)
- Color-token migration (`var(--bg)` → `var(--color-bg)`) — Phase 1 punt; the `:root` color shim stays
- Visual redesign — output must remain pixel-identical at every existing breakpoint
- HeroUI dark-theme review

## 3. Architecture decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Custom breakpoint scale: `xs 380 / sm 640 / md 700 / lg 800 / xl 1100` defined via `@theme --breakpoint-*` | Preserves Phase 1 visual parity. Values are non-Tailwind-default; will be documented prominently. |
| 2 | Migrate spacing tokens to `@theme`, delete `:root` versions, convert consumers | Single source of truth for spacing. Mobile-first inversion fits naturally on the migration path. |
| 3 | Color tokens stay in `:root` compat shim | Out of scope; migrating `var(--bg)` etc. is its own follow-up. |
| 4 | Invert `max-[Npx]:` → `min-{name}:` only at canonical breakpoint values | Outliers (1080, 1440, 900, 760) stay as `max-[Npx]:` — they're legitimate one-off responsive rules. |
| 5 | Viewport meta in `layout.tsx` (`width=device-width, initial-scale=1, viewport-fit=cover`) | One-line change. Standard mobile hygiene. |

## 4. Token changes

### 4.1 Breakpoint tokens (new, in `@theme`)

```css
@theme {
  /* Custom breakpoint scale — values preserve the Phase 1 design's
     scattered breakpoints. Note: these COLLIDE with Tailwind defaults
     (md is 700 here, not 768; lg is 800 here, not 1024). All
     responsive utilities throughout the codebase use these values. */
  --breakpoint-xs: 380px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 700px;
  --breakpoint-lg: 800px;
  --breakpoint-xl: 1100px;
}
```

Generates Tailwind 4 utilities: `xs:`, `sm:`, `md:`, `lg:`, `xl:` (min-width, mobile-first) and `max-xs:`, etc. (max-width, desktop-first — kept available for outliers).

### 4.2 Spacing tokens (move from `:root` to `@theme`)

Mobile-first values at the base; consumers stack utilities to reach desktop values.

```css
@theme {
  --spacing-gutter-x: 24px;       /* mobile (was --gutter-x: 48px via :root) */
  --spacing-gutter-sm: 32px;      /* sm+ breakpoint width gutter */
  --spacing-gutter-md: 48px;      /* lg+ desktop gutter */

  --spacing-section-y: 56px;      /* mobile (was --section-y: 100px via :root) */
  --spacing-section-y-md: 36px;   /* tight variant mobile (was --section-y-tight: 56px) */
  --spacing-section-y-lg: 72px;   /* lg variant mobile (was --section-y-lg: 120px) */
}
```

Generates `px-gutter-x`, `py-section-y`, etc. utilities. The base value is mobile; primitives stack `lg:py-[100px]` etc. to reach desktop.

### 4.3 `:root` cleanup

After consumers migrate, remove the following definitions from `:root` in `globals.css`:

```css
--gutter-x
--section-y, --section-y-md, --section-y-tight, --section-y-lg
```

The color/ink/accent/line/container-* tokens stay (Phase 3 scope).

## 5. Primitive changes

### 5.1 `<Container>`

```tsx
// Before (desktop-first via --gutter-x token)
"mx-auto w-full px-(--gutter-x)"

// After (mobile-first utility stack)
"mx-auto w-full px-6 sm:px-8 lg:px-12"
```

Variants unchanged (default / h1 / narrow / prose / form).

### 5.2 `<Section>`

```tsx
// Variant defaults (mobile → desktop)
default: "py-14 lg:py-[100px]"      // 56 → 100
tight:   "py-9 lg:py-14"            // 36 → 56
md:      "py-14 lg:py-20"           // 56 → 80
lg:      "py-[72px] lg:py-[120px]"  // 72 → 120
```

These exact values match Phase 1 visual rendering at each viewport.

### 5.3 `<Heading>`

No change. Phase 1 reconciliation already established `clamp()`-based fluid sizing in every variant. The reconciliations done per-block in Sessions 1–7 are mobile-first compatible.

## 6. JSX-level inversion

For every `max-[Npx]:` arbitrary utility whose `Npx` matches `{380, 640, 700, 800, 1100}`, convert to mobile-first equivalent:

| Legacy `max-[]` | Mobile-first replacement |
|---|---|
| `max-[1100px]:foo` | `xl:foo` flipped → `foo` on base, mobile variant absent (or use `max-xl:foo` if pattern is "remove at xl") |
| `max-[800px]:foo` | `lg:foo` flipped |
| `max-[700px]:foo` | `md:foo` flipped |
| `max-[640px]:foo` | `sm:foo` flipped |
| `max-[380px]:foo` | `xs:foo` flipped |

The flip pattern depends on what `foo` does:

- **"Shrink at narrow"** (`max-[640px]:text-[14px]` shrinks text below 640): mobile-first becomes `text-[14px] sm:text-[16px]` — base is the smaller value, `sm:` scales up.
- **"Hide at narrow"** (`max-[800px]:hidden`): becomes `hidden lg:block`.
- **"Stack at narrow"** (`max-[700px]:flex-col`): becomes `flex-col md:flex-row`.
- **"Stretch at narrow"** (`max-[640px]:w-full`): becomes `w-full sm:w-auto`.

Each conversion needs the engineer to read the full utility chain to understand what the base + override pair achieves and invert accordingly. Not a mechanical search-and-replace.

Outliers at non-canonical breakpoints (`max-[1080px]:`, `max-[1440px]:`, `max-[900px]:`, `max-[760px]:`, `max-[960px]:`) stay as-is — they represent one-off responsive rules that don't fit the canonical scale.

## 7. Viewport meta

Add to `src/app/layout.tsx`:

```tsx
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
```

## 8. Documentation

- Comment in `globals.css` above the `@theme --breakpoint-*` block explaining the custom scale and its divergence from Tailwind defaults.
- Append to `MANUAL-VERIFICATION.md`: a "Phase 2" section documenting the breakpoint scale, the spacing-token migration, and the inversion rules.
- Update PR description (PR #7 or a new Phase 2 PR) with the breakpoint-scale gotcha called out prominently.

## 9. Session plan (5 sessions)

| # | Scope | Effort | Risk |
|---|---|---|---|
| 1 | Foundation: `--breakpoint-*` + `--spacing-*` tokens in `@theme`; viewport meta; doc update | ~30 min | Low |
| 2 | Rewrite `<Container>` + `<Section>` primitives; update `cn`-helper consumers | ~1.5 h | Low |
| 3 | Consumer migration: replace `var(--gutter-x)` / `var(--section-y*)` in ~40 component files | ~2 h | Med |
| 4 | JSX `max-[]` → `min-{name}:` inversion at canonical breakpoints (~80–120 rewrites) | ~2.5 h | Med (visual parity per block) |
| 5 | Cleanup: remove `:root --gutter-x` / `:root --section-y*` definitions; final verification | ~30 min | Low |

## 10. Success criteria

1. `@theme --breakpoint-*` tokens defined; `xs/sm/md/lg/xl` utilities work in JSX.
2. `@theme --spacing-gutter-*` / `--spacing-section-y*` tokens defined and consumed via Tailwind utilities (`px-gutter-x`, `py-section-y`, etc.) where appropriate.
3. `:root` block in `globals.css` no longer defines `--gutter-x` or `--section-y*` (the color tokens remain — Phase 3 scope).
4. Zero consumer references to `var(--gutter-x)` or `var(--section-y*)` remain.
5. Every `max-[Npx]:` utility at canonical breakpoint values has been inverted to mobile-first; outliers preserved.
6. Viewport meta exported from `src/app/layout.tsx`.
7. `npm run typecheck && npm run lint && npm run build` all pass.
8. Visual parity at 1440px, 1100px, 800px, 700px, 640px, 380px viewports — every page renders identically to Phase 1 end-state.

## 11. Phase 3 preview (out of scope)

- Touch-target audit
- `var(--bg)` / `var(--ink)` / `var(--accent)` / `var(--line)` / `var(--container-*)` migration to `--color-*` / `--*` namespace; delete `:root` compat shim
- HeroUI internal-theming review now that mobile-first is the baseline
