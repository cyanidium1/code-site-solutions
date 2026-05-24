# Style System Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the project's mix of global semantic CSS, Tailwind utilities, and inline `style={{}}` with a single Tailwind-first system backed by centralized `@theme` tokens and a `src/components/ui/` primitives library.

**Architecture:** Tokens live exclusively in Tailwind's `@theme` block. Repeated utility patterns are extracted into ~10 small React primitives. Component CSS files are deleted block by block; the only CSS files remaining are `globals.css` (resets + tokens + a few `@layer utilities`), `keyframes.css`, `vendor.css` (Swiper/HeroUI overrides), `hero-effects.css` (≤80 lines for effects Tailwind can't express), and `blog.css` (markdown `.prose-*`).

**Tech Stack:** Next.js 15.5, React 19, Tailwind CSS 4.2.4, HeroUI 2.8, `clsx` 2.1, `tailwind-merge` 3.5 (both already installed), TypeScript 5.9, ESLint 9 (`next lint`).

**Spec:** [docs/superpowers/specs/2026-05-24-style-system-unification-design.md](../specs/2026-05-24-style-system-unification-design.md)

**Out of scope (Phase 2, separate plan):** mobile-first inversion of media queries, viewport meta hardening, touch-target audit.

---

## File Structure

### Files created

- `src/app/globals.css` — rewritten (not new, but heavily restructured)
- `src/app/keyframes.css` — keyframe definitions extracted from `tailwind.config.ts`
- `src/app/vendor.css` — Swiper + HeroUI overrides consolidated
- `src/components/blocks/hero/hero-effects.css` — small residual CSS that doesn't translate to Tailwind utilities (grain overlay, ticker mask, complex pseudo-elements)
- `src/components/ui/index.ts` — barrel export for primitives
- `src/components/ui/cn.ts` — `clsx` + `tailwind-merge` className helper
- `src/components/ui/Container.tsx`
- `src/components/ui/Section.tsx`
- `src/components/ui/Heading.tsx` — exports `H1`, `H2`, `H3`
- `src/components/ui/Btn.tsx`
- `src/components/ui/MetaStrip.tsx`
- `src/components/ui/GradPlaceholder.tsx`
- `src/components/ui/ScreenshotPending.tsx`
- `src/components/ui/DotGrid.tsx`
- `src/components/ui/TextGradient.tsx`
- `src/app/dev/primitives/page.tsx` — gated demo page that renders each primitive side-by-side with its legacy semantic-class equivalent for visual parity check (deleted at end of plan)

### Files modified

- `tailwind.config.ts` — strip everything except HeroUI plugin registration, content globs, fontFamily (Manrope + JetBrains injected via Next font), and references that Tailwind 4 `@theme` cannot express
- `src/app/layout.tsx` — import `keyframes.css` and `vendor.css` in addition to `globals.css`
- `eslint.config.mjs` — add `react/forbid-dom-props` rule for inline static styles
- All `.tsx` files under `src/` that currently use `import "*.css"` (~22 files) — remove import, replace usages with primitives + utilities
- All `.tsx` files with inline `style={{}}` for static values (33 files identified in audit) — replace with utilities

### Files deleted

20 CSS files: `buttons.css`, `cta-banner.css`, `launch-cta.css`, `turnkey-list.css`, `reasons.css`, `services.css`, `team-cards.css`, `lead-form.css`, `outcome.css`, `contact-split.css`, `page-hero.css`, `image-text.css`, `final.css`, `calculator.css`, `homepage.css`, `case.css`, `comparison.css`, `hero.css` (replaced by `hero-effects.css`), plus `pull-quote-swiper.css` and `swiper-wrapper.css` (contents folded into `vendor.css`).

---

## Verification Workflow (applies to every task)

Every block-migration task ends with the same verification steps. Reference: "Verify changes" below.

**Verify changes:**

```bash
cd Frontend
npm run typecheck    # must pass
npm run lint         # must pass (warnings allowed during Phase A-C, blocking in Phase D)
npm run build        # must succeed
```

Then start the dev server (or use the running one) and visually inspect the affected pages in the browser preview at 1440px width. Compare against baseline screenshots from Task 1.

**Affected pages per block:** documented in each task. If unsure, run:

```bash
cd Frontend
grep -rln "import.*<css-filename>" src/
```

**Commit cadence:** one commit per task. Commit message: `refactor(styles): <task summary>`.

---

# Phase A — Foundation

## Task 1: Baseline & pre-flight

**Files:**
- Create: `Frontend/docs/superpowers/baselines/2026-05-24-pre-refactor/` (screenshot directory)

- [ ] **Step 1: Confirm clean working tree**

Run: `cd Frontend && git status`
Expected: working tree clean. If not, commit or stash existing work before starting.

- [ ] **Step 2: Create refactor branch**

```bash
cd Frontend
git checkout -b refactor/style-system-unification
```

- [ ] **Step 3: Capture desktop baseline screenshots**

Start dev server (`npm run dev`), then use the preview tool to screenshot the following pages at 1440px viewport. Save each PNG into `docs/superpowers/baselines/2026-05-24-pre-refactor/`:

- `/` (homepage)
- `/en` (homepage EN)
- `/about`
- `/en/about`
- `/pricing`
- `/process`
- `/calculator`
- `/portfolio`
- `/portfolio/_nbyg-kobenhavn`
- `/portfolio/_efedra-clinic`
- `/blog` (if any blog index exists)
- `/contact` (if exists)

These are the visual-parity reference. After each block migration, re-screenshot the affected pages and diff against these.

- [ ] **Step 4: Confirm tooling versions**

```bash
cd Frontend
node -v
npm ls tailwindcss clsx tailwind-merge
```
Expected: Node ≥ 20, Tailwind 4.2.4, clsx 2.1.1, tailwind-merge 3.5.0. No new installs needed.

- [ ] **Step 5: Commit**

```bash
cd Frontend
git add docs/superpowers/baselines/
git commit -m "chore(styles): capture pre-refactor visual baseline"
```

---

## Task 2: HeroUI token-clash spike

**Files:** none (investigation only)

- [ ] **Step 1: List HeroUI's expected CSS variables**

```bash
cd Frontend
grep -rn "var(--heroui" node_modules/@heroui/theme/dist 2>/dev/null | head -40
```

Note any variable names HeroUI consumes. We need to ensure our `@theme` block does not redefine HeroUI's `--heroui-*` namespace.

- [ ] **Step 2: Confirm namespace separation**

Verify our tokens use `--bg`, `--ink`, `--accent`, etc. (no `--heroui-*` prefix). HeroUI defines its own; the two coexist. If any collision is found (e.g., HeroUI happens to read `--background`), record it in the spec's "Risks" section and pick an alternative name.

- [ ] **Step 3: Confirm HeroUI dark theme still applies**

Open any page that uses HeroUI (e.g., a button or input in `lead-form`) in the running dev server. Confirm theme tokens render correctly — no regression expected; this is a sanity check before we start changing tokens.

No commit (no file changes).

---

## Task 3: Add `@theme` token block to `globals.css`

**Files:**
- Modify: `Frontend/src/app/globals.css`

- [ ] **Step 1: Add `@theme` block above existing `:root`**

After the `@config` import line, insert this block (this is additive — `:root` definitions remain temporarily for backwards compatibility):

```css
@theme {
  /* Colors — mirror current --bg, --ink, --accent, etc. */
  --color-bg: #121212;
  --color-bg-subtle: #1a1620;
  --color-bg-raised: #1f1a26;

  --color-ink: oklch(0.97 0.005 300);
  --color-ink-dim: oklch(0.78 0.012 300);
  --color-ink-3: oklch(0.55 0.01 300);
  --color-ink-muted: oklch(0.55 0.01 70);

  --color-line: oklch(1 0 0 / 0.08);
  --color-line-strong: oklch(1 0 0 / 0.14);

  --color-accent: oklch(0.55 0.18 295);
  --color-accent-soft: oklch(0.7 0.14 295);
  --color-accent-deep: oklch(0.45 0.2 285);
  --color-accent-2: oklch(0.45 0.20 285);

  --color-industry-healthcare: #0EA5E9;
  --color-industry-legal: #8B5CF6;
  --color-industry-accounting: #10B981;
  --color-industry-ecommerce: #F59E0B;
  --color-industry-saas: #0070F3;
  --color-industry-realestate: #EF4444;
  --color-industry-cosmetology: #EC4899;
  --color-industry-education: #14B8A6;

  /* Container widths — exposed as max-w-container-* utilities */
  --container-max: 1440px;
  --container-h1: 920px;
  --container-narrow: 880px;
  --container-prose: 760px;
  --container-form: 720px;

  /* Section vertical rhythm baseline (Phase 1: desktop values) */
  --spacing-section-y: 100px;
  --spacing-section-y-md: 80px;
  --spacing-section-y-tight: 56px;
  --spacing-section-y-lg: 120px;
  --spacing-gutter-x: 48px;

  /* Shadows */
  --shadow-accent-glow:
    0 4px 20px oklch(0.55 0.18 295 / 0.35),
    0 0 0 1px oklch(0.55 0.18 295 / 0.30);

  /* Easing */
  --ease-out-soft: cubic-bezier(0.2, 0.8, 0.2, 1);

  /* Background images */
  --background-image-hero-glow:
    radial-gradient(ellipse 1400px 700px at 50% -150px, oklch(0.55 0.18 295 / 0.40) 0%, oklch(0.55 0.18 295 / 0.12) 35%, transparent 70%);
  --background-image-brand-gradient:
    linear-gradient(180deg, var(--color-accent-soft) 0%, var(--color-accent) 100%);
  --background-image-text-gradient:
    linear-gradient(180deg, var(--color-accent-soft) 0%, var(--color-accent) 100%);

  /* Font families — kept here so they survive tailwind.config.ts trimming */
  --font-display: var(--font-manrope), system-ui, sans-serif;
  --font-sans: var(--font-manrope), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
}
```

- [ ] **Step 2: Verify tokens compile**

```bash
cd Frontend
npm run build
```
Expected: build passes. If any `--color-*` name collides with HeroUI, the build error will name it — rename and retry.

- [ ] **Step 3: Spot-check a Tailwind utility uses the new token**

In any component temporarily add `className="bg-bg-subtle"` and confirm it renders the expected color in dev. Revert the change before commit.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/app/globals.css
git commit -m "refactor(styles): add @theme token block (additive, legacy :root retained)"
```

---

## Task 4: Extract keyframes into `keyframes.css`

**Files:**
- Create: `Frontend/src/app/keyframes.css`
- Modify: `Frontend/src/app/layout.tsx`
- Modify: `Frontend/tailwind.config.ts`

- [ ] **Step 1: Create `keyframes.css`**

Create `src/app/keyframes.css` with:

```css
@keyframes marquee {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

@keyframes fade-up {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes svg-glow-blue {
  0%, 100% { filter: drop-shadow(0 0 0 oklch(0.55 0.18 295 / 0)); }
  50%      { filter: drop-shadow(0 0 8px oklch(0.70 0.14 295 / 0.45)); }
}

@keyframes svg-glow-pink {
  0%, 100% { filter: drop-shadow(0 0 0 oklch(0.70 0.18 350 / 0)); }
  50%      { filter: drop-shadow(0 0 8px oklch(0.78 0.16 350 / 0.45)); }
}

@keyframes svg-glow-dark {
  0%, 100% { filter: drop-shadow(0 0 0 oklch(0 0 0 / 0)); }
  50%      { filter: drop-shadow(0 0 6px oklch(0.55 0.18 295 / 0.35)); }
}
```

- [ ] **Step 2: Append `--animate-*` entries to `@theme` in globals.css**

Inside the `@theme` block added in Task 3, add:

```css
  --animate-marquee: marquee 30s linear infinite;
  --animate-fade-up: fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  --animate-svg-glow-blue: svg-glow-blue 4s ease-in-out infinite;
  --animate-svg-glow-pink: svg-glow-pink 4s ease-in-out infinite;
  --animate-svg-glow-dark: svg-glow-dark 4s ease-in-out infinite;
```

- [ ] **Step 3: Import `keyframes.css` in `layout.tsx`**

In `src/app/layout.tsx`, immediately after the existing `import "./globals.css";` line:

```ts
import "./keyframes.css";
```

- [ ] **Step 4: Remove duplicated keyframes from `tailwind.config.ts`**

Delete the `keyframes` and `animation` properties from `theme.extend`. The `@theme` block plus the `keyframes.css` file is now the single source.

- [ ] **Step 5: Verify**

Run the verification workflow. Visually confirm marquee ticker on hero still animates and SVG glows on relevant components still fire.

- [ ] **Step 6: Commit**

```bash
cd Frontend
git add src/app/keyframes.css src/app/layout.tsx src/app/globals.css tailwind.config.ts
git commit -m "refactor(styles): extract keyframes to dedicated file, register via @theme"
```

---

## Task 5: Create `vendor.css` and consolidate Swiper overrides

**Files:**
- Create: `Frontend/src/app/vendor.css`
- Modify: `Frontend/src/app/layout.tsx`
- Delete: `Frontend/src/components/shared/swiper/swiper-wrapper.css`
- Delete: `Frontend/src/components/homepage/pull-quote-swiper/pull-quote-swiper.css`
- Modify: any `.tsx` that imports the two deleted files

- [ ] **Step 1: Locate consumers**

```bash
cd Frontend
grep -rln "swiper-wrapper.css\|pull-quote-swiper.css" src/
```

- [ ] **Step 2: Create `vendor.css` by concatenating both files**

Create `src/app/vendor.css` and paste the full contents of `swiper-wrapper.css` followed by the full contents of `pull-quote-swiper.css`. Add a comment header above each block:

```css
/* ============================================================
   Swiper wrapper overrides (from shared/swiper/swiper-wrapper.css)
   ============================================================ */
/* ...content... */

/* ============================================================
   Pull-quote swiper overrides (from homepage/pull-quote-swiper.css)
   ============================================================ */
/* ...content... */
```

- [ ] **Step 3: Import `vendor.css` in `layout.tsx`**

After the `keyframes.css` import:

```ts
import "./vendor.css";
```

- [ ] **Step 4: Remove imports from `.tsx` consumers**

For each `.tsx` file found in Step 1, delete the line that imports the deleted CSS.

- [ ] **Step 5: Delete the two CSS files**

```bash
cd Frontend
rm src/components/shared/swiper/swiper-wrapper.css
rm src/components/homepage/pull-quote-swiper/pull-quote-swiper.css
```

- [ ] **Step 6: Verify**

Run the verification workflow. Open any page using Swiper (homepage pull-quote) and confirm carousel behavior + styling unchanged.

- [ ] **Step 7: Commit**

```bash
cd Frontend
git add -A
git commit -m "refactor(styles): consolidate swiper css into vendor.css"
```

---

## Task 6: Create `src/components/ui/` scaffold with `cn` helper

**Files:**
- Create: `Frontend/src/components/ui/cn.ts`
- Create: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Create `cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create `index.ts` as empty barrel**

```ts
export { cn } from "./cn";
// Primitives added in subsequent tasks
```

- [ ] **Step 3: Verify**

```bash
cd Frontend
npm run typecheck
```
Expected: passes.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/components/ui/
git commit -m "feat(ui): scaffold primitives directory with cn helper"
```

---

## Task 7: `<Container>` primitive

**Files:**
- Create: `Frontend/src/components/ui/Container.tsx`
- Modify: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Implement `Container`**

```tsx
import { type HTMLAttributes, type ElementType } from "react";
import { cn } from "./cn";

type Variant = "default" | "h1" | "narrow" | "prose" | "form";

const widthClass: Record<Variant, string> = {
  default: "max-w-container",
  h1: "max-w-container-h1",
  narrow: "max-w-container-narrow",
  prose: "max-w-container-prose",
  form: "max-w-container-form",
};

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  as?: ElementType;
}

export function Container({
  variant = "default",
  as: As = "div",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <As
      className={cn(
        "mx-auto w-full px-(--spacing-gutter-x)",
        widthClass[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
```

Note: `px-(--spacing-gutter-x)` is Tailwind 4 arbitrary-property syntax that reads our `@theme` spacing token. The token's responsive override in `globals.css` `:root` still applies during Phase 1 (we delete it in Phase 2).

- [ ] **Step 2: Add to barrel**

In `src/components/ui/index.ts`:

```ts
export { Container } from "./Container";
```

- [ ] **Step 3: Verify**

```bash
cd Frontend
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/components/ui/
git commit -m "feat(ui): add Container primitive"
```

---

## Task 8: `<Section>` primitive

**Files:**
- Create: `Frontend/src/components/ui/Section.tsx`
- Modify: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Implement `Section`**

```tsx
import { type HTMLAttributes, type ElementType } from "react";
import { cn } from "./cn";

type Variant = "default" | "tight" | "lg" | "md";

const yClass: Record<Variant, string> = {
  default: "py-(--spacing-section-y)",
  tight: "py-(--spacing-section-y-tight)",
  lg: "py-(--spacing-section-y-lg)",
  md: "py-(--spacing-section-y-md)",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  as?: ElementType;
}

export function Section({
  variant = "default",
  as: As = "section",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <As className={cn(yClass[variant], className)} {...rest}>
      {children}
    </As>
  );
}
```

- [ ] **Step 2: Export from barrel**

```ts
export { Section } from "./Section";
```

- [ ] **Step 3: Verify & commit**

```bash
cd Frontend
npm run typecheck
git add src/components/ui/
git commit -m "feat(ui): add Section primitive"
```

---

## Task 9: `<Heading>` primitive (H1/H2/H3)

**Files:**
- Create: `Frontend/src/components/ui/Heading.tsx`
- Modify: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Inspect current heading sizes**

```bash
cd Frontend
grep -n "^\.h1\|^\.hp-h2\|^\.case-h2\|^\.page-hero-h1" src/app/globals.css
```

Note exact `font-size`, `line-height`, `letter-spacing`, and `font-weight` for each. The primitive's variant utility strings must match the current values pixel-for-pixel.

- [ ] **Step 2: Implement `Heading`**

```tsx
import { type HTMLAttributes } from "react";
import { cn } from "./cn";

type Level = 1 | 2 | 3;
type Variant = "default" | "hp" | "case" | "page-hero";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: Level;
  variant?: Variant;
}

/**
 * Utility strings below are derived from the legacy semantic classes
 * (.h1, .hp-h2, .case-h2, .page-hero-h1) in globals.css as of 2026-05-24.
 * Adjust the numbers in this table if Step 1 shows different values.
 */
const sizes: Record<Level, Record<Variant, string>> = {
  1: {
    default: "text-[64px] leading-[1.05] tracking-[-0.02em] font-semibold",
    hp: "text-[64px] leading-[1.05] tracking-[-0.02em] font-semibold",
    case: "text-[56px] leading-[1.05] tracking-[-0.02em] font-semibold",
    "page-hero": "text-[72px] leading-[1.02] tracking-[-0.02em] font-semibold",
  },
  2: {
    default: "text-[44px] leading-[1.1] tracking-[-0.01em] font-semibold",
    hp: "text-[44px] leading-[1.1] tracking-[-0.01em] font-semibold",
    case: "text-[40px] leading-[1.1] tracking-[-0.01em] font-semibold",
    "page-hero": "text-[44px] leading-[1.1] tracking-[-0.01em] font-semibold",
  },
  3: {
    default: "text-[28px] leading-[1.2] tracking-[-0.005em] font-semibold",
    hp: "text-[28px] leading-[1.2] tracking-[-0.005em] font-semibold",
    case: "text-[28px] leading-[1.2] tracking-[-0.005em] font-semibold",
    "page-hero": "text-[28px] leading-[1.2] tracking-[-0.005em] font-semibold",
  },
};

export function Heading({
  level,
  variant = "default",
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return (
    <Tag className={cn(sizes[level][variant], className)} {...rest}>
      {children}
    </Tag>
  );
}

export const H1 = (props: Omit<HeadingProps, "level">) => <Heading level={1} {...props} />;
export const H2 = (props: Omit<HeadingProps, "level">) => <Heading level={2} {...props} />;
export const H3 = (props: Omit<HeadingProps, "level">) => <Heading level={3} {...props} />;
```

- [ ] **Step 3: Reconcile Step 1 values into the table**

If the legacy class values from Step 1 differ from the literal numbers in the code above (likely — those were illustrative), edit the `sizes` table to match the legacy values exactly. The goal is pixel parity.

- [ ] **Step 4: Export from barrel**

```ts
export { Heading, H1, H2, H3 } from "./Heading";
```

- [ ] **Step 5: Verify & commit**

```bash
cd Frontend
npm run typecheck
git add src/components/ui/
git commit -m "feat(ui): add Heading primitive with H1/H2/H3 exports"
```

---

## Task 10: `<Btn>` primitive

**Files:**
- Create: `Frontend/src/components/ui/Btn.tsx`
- Modify: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Re-read `buttons.css`**

Open `src/components/blocks/buttons/buttons.css` and confirm the current visual: pill (`border-radius: 999px`), `padding: 16px 24px` for primary, `padding: 15px 22px` for ghost (border-compensated), 14px 600 font, shimmer pseudo-element on `.btn-primary::before`, lift on hover.

- [ ] **Step 2: Implement `Btn`**

```tsx
import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "primary" | "ghost" | "play";

const base = "inline-flex items-center gap-2.5 rounded-full font-sans text-sm font-semibold transition cursor-pointer no-underline";

const variantClass: Record<Variant, string> = {
  primary: cn(
    "relative overflow-hidden bg-ink text-bg font-semibold px-6 py-4",
    "shadow-accent-glow",
    "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_oklch(0.55_0.18_295/0.35),0_0_0_1px_oklch(1_0_0/0.1)_inset]",
    // Shimmer: caller must wrap the label in <span> for ::before to paint behind it
    "before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_30%,oklch(0.55_0.18_295/0.4)_50%,transparent_70%)] before:transition-transform before:duration-[600ms]",
    "hover:before:translate-x-full",
  ),
  ghost: cn(
    "bg-transparent text-ink border border-line-strong font-medium px-[22px] py-[15px]",
    "hover:border-ink-dim hover:bg-[oklch(1_0_0/0.04)]",
  ),
  play: cn(
    "w-[22px] h-[22px] p-0 justify-center bg-ink text-bg",
  ),
};

type BtnProps =
  | ({ as?: "button"; variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: "a"; variant?: Variant } & AnchorHTMLAttributes<HTMLAnchorElement>);

export function Btn(props: BtnProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = cn(base, variantClass[variant], className);

  if ("as" in props && props.as === "a") {
    const { as: _ignored, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { as?: "a" };
    return (
      <a className={classes} {...anchorRest}>
        {variant === "primary" ? <span className="relative z-10">{children}</span> : children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {variant === "primary" ? <span className="relative z-10">{children}</span> : children}
    </button>
  );
}
```

The wrapping `<span>` for `variant="primary"` is built in so callers do not have to remember it (the legacy CSS required manual wrapping — this is an improvement).

- [ ] **Step 3: Export from barrel**

```ts
export { Btn } from "./Btn";
```

- [ ] **Step 4: Verify & commit**

```bash
cd Frontend
npm run typecheck
git add src/components/ui/
git commit -m "feat(ui): add Btn primitive (primary/ghost/play)"
```

---

## Task 11: `<MetaStrip>` primitive

**Files:**
- Create: `Frontend/src/components/ui/MetaStrip.tsx`
- Modify: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Inspect current usage**

Open `src/app/portfolio/_nbyg-kobenhavn/page.tsx` and locate the `MetaStrip`-shaped inline-style section. Note the inline values used (padding, font-size, color of labels vs values). The primitive should reproduce that visual.

- [ ] **Step 2: Implement `MetaStrip`**

```tsx
import { cn } from "./cn";

interface MetaItem {
  label: string;
  value: string;
}

interface MetaStripProps {
  items: MetaItem[];
  className?: string;
}

export function MetaStrip({ items, className }: MetaStripProps) {
  return (
    <dl
      className={cn(
        "mx-auto flex max-w-container flex-wrap gap-x-12 gap-y-4 px-12 pb-6 font-mono text-xs uppercase tracking-wider text-ink-dim",
        className,
      )}
    >
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-1">
          <dt className="text-ink-muted">{label}</dt>
          <dd className="text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

Adjust spacing/typography in this file if Step 1 shows different values.

- [ ] **Step 3: Export & commit**

```ts
export { MetaStrip } from "./MetaStrip";
```

```bash
cd Frontend
npm run typecheck
git add src/components/ui/
git commit -m "feat(ui): add MetaStrip primitive"
```

---

## Task 12: `<GradPlaceholder>` primitive

**Files:**
- Create: `Frontend/src/components/ui/GradPlaceholder.tsx`
- Modify: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Inspect existing copies**

```bash
cd Frontend
grep -n "GradPlaceholder\b" src/ -r
```

Compare the implementations in `src/app/about/page.tsx` and `src/app/en/about/page.tsx` — they may already differ. Use the union of their props (`from`, `to`, optional `label`).

- [ ] **Step 2: Implement `GradPlaceholder`**

```tsx
import { type CSSProperties } from "react";
import { cn } from "./cn";

interface GradPlaceholderProps {
  from: string;
  to: string;
  label?: string;
  className?: string;
}

export function GradPlaceholder({ from, to, label, className }: GradPlaceholderProps) {
  return (
    <div
      style={{ "--gp-from": from, "--gp-to": to } as CSSProperties}
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-2xl",
        "bg-[linear-gradient(135deg,var(--gp-from),var(--gp-to))]",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] before:bg-[size:24px_24px]",
        className,
      )}
    >
      {label ? (
        <span className="absolute left-4 top-4 font-mono text-xs uppercase tracking-wider text-white/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
```

The dynamic colors flow through CSS custom properties (allowed under the inline-style policy), then a static Tailwind utility consumes them. No hardcoded gradient strings repeated per call site.

- [ ] **Step 3: Export & commit**

```ts
export { GradPlaceholder } from "./GradPlaceholder";
```

```bash
cd Frontend
npm run typecheck
git add src/components/ui/
git commit -m "feat(ui): add GradPlaceholder primitive (dynamic via CSS vars)"
```

---

## Task 13: `<ScreenshotPending>`, `<DotGrid>`, `<TextGradient>` primitives

**Files:**
- Create: `Frontend/src/components/ui/ScreenshotPending.tsx`
- Create: `Frontend/src/components/ui/DotGrid.tsx`
- Create: `Frontend/src/components/ui/TextGradient.tsx`
- Modify: `Frontend/src/components/ui/index.ts`

- [ ] **Step 1: Implement `ScreenshotPending`**

```tsx
import { cn } from "./cn";

interface ScreenshotPendingProps {
  label?: string;
  className?: string;
}

export function ScreenshotPending({ label = "SCREENSHOT PENDING", className }: ScreenshotPendingProps) {
  return (
    <div
      className={cn(
        "relative grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-2xl",
        "bg-[linear-gradient(135deg,#1a1620,#2a1f3a)]",
        className,
      )}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
        {label}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Implement `DotGrid`**

```tsx
import { cn } from "./cn";

interface DotGridProps {
  className?: string;
  /** Tailwind size utility; default 24px grid */
  size?: string;
}

export function DotGrid({ className, size = "24px" }: DotGridProps) {
  return (
    <div
      style={{ "--dg-size": size } as React.CSSProperties}
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)]",
        "[background-size:var(--dg-size)_var(--dg-size)]",
        className,
      )}
    />
  );
}
```

- [ ] **Step 3: Implement `TextGradient`**

```tsx
import { type HTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "default" | "brand";

const variantClass: Record<Variant, string> = {
  default: "bg-text-gradient bg-clip-text text-transparent",
  brand: "bg-brand-gradient bg-clip-text text-transparent",
};

interface TextGradientProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function TextGradient({ variant = "default", className, children, ...rest }: TextGradientProps) {
  return (
    <span className={cn(variantClass[variant], className)} {...rest}>
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Export all three**

```ts
export { ScreenshotPending } from "./ScreenshotPending";
export { DotGrid } from "./DotGrid";
export { TextGradient } from "./TextGradient";
```

- [ ] **Step 5: Verify & commit**

```bash
cd Frontend
npm run typecheck
git add src/components/ui/
git commit -m "feat(ui): add ScreenshotPending, DotGrid, TextGradient primitives"
```

---

## Task 14: Build `/dev/primitives` parity demo page

**Files:**
- Create: `Frontend/src/app/dev/primitives/page.tsx`

- [ ] **Step 1: Implement demo**

```tsx
import {
  Container,
  Section,
  H1,
  H2,
  H3,
  Btn,
  MetaStrip,
  GradPlaceholder,
  ScreenshotPending,
  DotGrid,
  TextGradient,
} from "@/components/ui";

export default function PrimitivesDemo() {
  return (
    <main>
      <Section>
        <Container>
          <H1>Primitives parity demo</H1>
          <p className="mt-4 text-ink-dim">
            Each block shows the primitive on the left and the legacy
            semantic-class equivalent on the right. They should look identical.
          </p>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Heading</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <H1 variant="hp">Primitive H1 hp</H1>
            <h1 className="h1 hp-h1">Legacy .h1 .hp-h1</h1>
            <H2 variant="case">Primitive H2 case</H2>
            <h2 className="case-h2">Legacy .case-h2</h2>
          </div>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Buttons</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Btn variant="primary">Primary</Btn>
              <Btn variant="ghost">Ghost</Btn>
            </div>
            <div className="flex gap-4">
              <button className="btn-primary"><span>Legacy primary</span></button>
              <button className="btn-ghost">Legacy ghost</button>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Gradient placeholder</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <GradPlaceholder from="#7c4dde" to="#5d2dad" label="Primitive" />
            <div style={{ background: "linear-gradient(135deg,#7c4dde,#5d2dad)", aspectRatio: "16/9", borderRadius: "1rem", position: "relative" }}>
              <span style={{ position: "absolute", left: 16, top: 16, font: "12px monospace", color: "rgba(255,255,255,0.7)" }}>LEGACY</span>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Meta strip</H2>
          <MetaStrip
            items={[
              { label: "Client", value: "Acme Co." },
              { label: "Year", value: "2026" },
              { label: "Role", value: "Design + Dev" },
            ]}
          />
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Text gradient</H2>
          <p className="mt-6 text-4xl">
            Hello <TextGradient>gradient</TextGradient> world.{" "}
            <span className="text-gradient">Legacy</span>
          </p>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Screenshot pending + dot grid</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <ScreenshotPending />
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-bg-subtle">
              <DotGrid />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
```

- [ ] **Step 2: Verify visually**

Start dev server, navigate to `http://localhost:3000/dev/primitives`. Each primitive should visually match its legacy counterpart. If they don't, adjust the primitive's utility string (do NOT change the legacy CSS — that's the reference).

Screenshot this page and save to `docs/superpowers/baselines/2026-05-24-pre-refactor/dev-primitives.png` as the parity reference for later tasks.

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add src/app/dev/primitives/
git commit -m "feat(ui): add /dev/primitives parity demo page"
```

---

# Phase B — Easy consumers (inline-style cleanup, no CSS deletions yet)

## Task 15: Convert `legal-stub` inline styles

**Files:**
- Modify: `Frontend/src/components/legal/legal-stub.tsx`

- [ ] **Step 1: Inspect**

Open `src/components/legal/legal-stub.tsx`. Identify the 5 inline `style={{...}}` props. For each, replace with Tailwind utilities or a primitive:

| Inline style | Replace with |
|---|---|
| `style={{ padding: "..." }}` | `className="px-* py-*"` |
| `style={{ maxWidth: "var(--container-max)" }}` | `<Container>` |
| `style={{ color: "var(--ink-muted)" }}` | `className="text-ink-muted"` |
| `style={{ background: "..." }}` | `className="bg-bg-subtle"` (or arbitrary value `bg-[...]`) |

- [ ] **Step 2: Verify**

Run the verification workflow. Open any page using `legal-stub` (likely `/privacy`, `/terms`) and confirm visual parity.

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add src/components/legal/legal-stub.tsx
git commit -m "refactor(styles): replace inline styles in legal-stub with utilities"
```

---

## Task 16: Convert `stories/image-text` page

**Files:**
- Modify: `Frontend/src/app/stories/image-text/page.tsx`

- [ ] **Step 1: Inspect & replace**

6 inline styles in this file. Apply the same mapping rules as Task 15. This is a demo/story page so visual parity matters less, but apply the rules consistently.

- [ ] **Step 2: Verify & commit**

```bash
cd Frontend
npm run typecheck && npm run lint && npm run build
git add src/app/stories/image-text/page.tsx
git commit -m "refactor(styles): replace inline styles in stories/image-text"
```

---

## Task 17: Convert `mobile-menu` (preserve dynamic CSS var)

**Files:**
- Modify: `Frontend/src/components/layout/mobile-menu.tsx`

- [ ] **Step 1: Identify which inline styles are dynamic**

5 inline styles. The `["--i" as string]: idx` stagger-index pattern is dynamic — **keep it as inline style** (per spec §5.1). Convert any others (static padding, color, etc.) to utilities.

- [ ] **Step 2: Tighten the CSS-var inline syntax**

Replace `style={{ ["--i" as string]: idx }}` with the cleaner:

```tsx
style={{ "--i": idx } as React.CSSProperties}
```

- [ ] **Step 3: Verify**

Open the dev site at narrow viewport, trigger mobile menu, confirm stagger animation still fires.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/components/layout/mobile-menu.tsx
git commit -m "refactor(styles): clean mobile-menu inline styles (keep --i CSS var)"
```

---

## Task 18: Convert `about` page (UK + EN together)

**Files:**
- Modify: `Frontend/src/app/about/page.tsx`
- Modify: `Frontend/src/app/en/about/page.tsx`

- [ ] **Step 1: Replace `GradPlaceholder` definitions**

Both files define a local `GradPlaceholder`. Delete the local definitions and import from `@/components/ui`:

```tsx
import { GradPlaceholder } from "@/components/ui";
```

- [ ] **Step 2: Replace remaining inline styles**

11 styles per file. Apply Task 15's mapping rules. Use `<Container>`, `<Section>`, `<H1>`, `<H2>` where the markup matches the primitive's intent.

- [ ] **Step 3: Verify**

Compare `/about` and `/en/about` against Task 1 baselines. Pixel parity expected.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/app/about/page.tsx src/app/en/about/page.tsx
git commit -m "refactor(styles): convert about (UK+EN) to primitives + utilities"
```

---

## Task 19: Convert `portfolio/_nbyg-kobenhavn` (UK + EN)

**Files:**
- Modify: `Frontend/src/app/portfolio/_nbyg-kobenhavn/page.tsx`
- Modify: `Frontend/src/app/en/portfolio/_nbyg-kobenhavn/page.tsx`

- [ ] **Step 1: Replace `ScreenshotPending` & `MetaStrip` definitions**

```tsx
import { ScreenshotPending, MetaStrip, Container, Section, GradPlaceholder } from "@/components/ui";
```

Delete local `ScreenshotPending` / `MetaStrip` definitions.

- [ ] **Step 2: Replace 8 inline styles per file**

Apply mapping rules. Related-card gradient backgrounds become `<GradPlaceholder>` with computed colors.

- [ ] **Step 3: Verify**

Compare against `/portfolio/_nbyg-kobenhavn` baseline. Pixel parity.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/app/portfolio/_nbyg-kobenhavn/ src/app/en/portfolio/_nbyg-kobenhavn/
git commit -m "refactor(styles): convert nbyg-kobenhavn portfolio page (UK+EN)"
```

---

## Task 20: Convert `portfolio/_efedra-clinic` (UK + EN)

**Files:**
- Modify: `Frontend/src/app/portfolio/_efedra-clinic/page.tsx`
- Modify: `Frontend/src/app/en/portfolio/_efedra-clinic/page.tsx`

- [ ] **Step 1: Replace local primitives with imports**

Same imports as Task 19. Delete local copies.

- [ ] **Step 2: Replace 6 inline styles per file**

Apply mapping rules.

- [ ] **Step 3: Verify & commit**

```bash
cd Frontend
npm run typecheck && npm run lint && npm run build
git add src/app/portfolio/_efedra-clinic/ src/app/en/portfolio/_efedra-clinic/
git commit -m "refactor(styles): convert efedra-clinic portfolio page (UK+EN)"
```

---

## Task 21: Convert `case-page/index.tsx`

**Files:**
- Modify: `Frontend/src/components/case-page/index.tsx`

- [ ] **Step 1: Inspect 7 inline styles**

Likely candidates: section wrapper maxWidth (→ `<Container>`), YouTube section layout (→ utilities), related-cards grid (→ `grid grid-cols-* gap-*`).

- [ ] **Step 2: Replace, verify, commit**

```bash
cd Frontend
npm run typecheck && npm run lint && npm run build
git add src/components/case-page/index.tsx
git commit -m "refactor(styles): convert case-page inline styles to primitives"
```

---

## Task 22: Sweep remaining inline-style files

**Files:** the ~22 remaining `.tsx` files with 1–4 inline styles each (identified in audit)

- [ ] **Step 1: Enumerate remaining files**

```bash
cd Frontend
grep -rln "style={{" src/ | sort
```

Subtract any already addressed in Tasks 15–21. The remainder should be ~22 files.

- [ ] **Step 2: Convert each file**

Work file-by-file, applying the mapping rules from Task 15. For `display: "contents"` (used for breadcrumb separators and ticker items), replace with `className="contents"`.

Files that mix dynamic CSS vars (allowed) with static styles (forbidden): keep the dynamic ones, convert the static ones.

- [ ] **Step 3: Verify after each ~5 files**

Run typecheck + lint + build after every batch of ~5 files. If anything breaks, isolate the culprit before continuing.

- [ ] **Step 4: Commit per batch**

Group commits by domain (e.g., "homepage components", "shared components"). Commit message format: `refactor(styles): replace inline styles in <area>`.

---

## Task 23: Add ESLint inline-style rule (warning mode)

**Files:**
- Modify: `Frontend/eslint.config.mjs`

- [ ] **Step 1: Add `react/forbid-dom-props` rule**

Add to the `rules` section:

```js
"react/forbid-dom-props": ["warn", {
  forbid: [
    {
      propName: "style",
      message:
        "Inline static styles are forbidden. Use Tailwind utilities or a primitive from @/components/ui. " +
        "Dynamic CSS custom properties (style={{ '--x': value }}) are allowed.",
    },
  ],
}],
```

Note: this rule cannot distinguish dynamic CSS vars from static values automatically. We accept that and rely on code review for that distinction. Files with legitimate dynamic-var usage (mobile-menu, GradPlaceholder, DotGrid) get a per-file `// eslint-disable-next-line react/forbid-dom-props` comment with a one-line reason.

- [ ] **Step 2: Add disable comments to legitimate users**

```bash
cd Frontend
grep -rln "style={{" src/components/ui src/components/layout/mobile-menu.tsx
```

For each remaining usage, add immediately above the `style={{`:

```tsx
// eslint-disable-next-line react/forbid-dom-props -- dynamic CSS custom property
```

- [ ] **Step 3: Verify**

```bash
cd Frontend
npm run lint
```

Expected: warnings (not errors) for any remaining static-style inline usage. Zero errors. The warning count should be near zero post-Phase B; any leftovers feed into Phase C cleanup.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add eslint.config.mjs src/
git commit -m "chore(lint): warn on inline static styles; document dynamic-var exceptions"
```

---

# Phase C — Block-by-block CSS deletion

For each block (Tasks 24–40), follow this **shared block-migration procedure**. The procedure is repeated in summary form per task; full detail lives here.

### Shared block-migration procedure

1. **Inventory**: read the CSS file end-to-end. List every selector and what it styles. Find consumers via `grep -rln "<block>.css\|className=\"[^\"]*<class>" src/`.
2. **Map**: for each selector, write down its Tailwind-utility equivalent (or primitive replacement). Use the spec's primitives where the markup matches their intent.
3. **Convert consumers**: edit each `.tsx` file to replace semantic classes with utilities/primitives. Remove the `import "./<block>.css";` line.
4. **Delete the CSS file** (`rm src/components/blocks/<block>/<block>.css`).
5. **Verify**: typecheck, lint, build, then visually compare affected pages against Task 1 baselines at 1440px.
6. **Commit**: `refactor(styles): replace <block>.css with utilities + primitives`.

For tasks that involve CSS effects Tailwind cannot express cleanly (complex pseudo-elements, `:has()`, scroll-driven animations), move that fragment to a small dedicated CSS file rather than forcing it into utilities. Only one block — Hero (Task 40) — is expected to need this; if any other block triggers it, push back and reconsider rather than proliferating side-CSS files.

---

## Task 24: Delete `buttons.css`

**Files:**
- Delete: `Frontend/src/components/blocks/buttons/buttons.css`
- Modify: all consumers of `.btn-primary` / `.btn-ghost` / `.btn-play`

- [ ] **Step 1: Find consumers**

```bash
cd Frontend
grep -rln "buttons.css" src/
grep -rln "btn-primary\|btn-ghost\|btn-play" src/
```

- [ ] **Step 2: Replace each consumer**

For each `<button className="btn-primary"><span>X</span></button>` → `<Btn variant="primary">X</Btn>` (the wrapping `<span>` is built into `<Btn>`, so the caller's `<span>` goes away).

For `<a className="btn-ghost">X</a>` → `<Btn as="a" variant="ghost" href="...">X</Btn>`.

For `.btn-play` similarly.

Remove `import "..../buttons.css";` from every consumer file.

- [ ] **Step 3: Delete the CSS file**

```bash
cd Frontend
rm src/components/blocks/buttons/buttons.css
```

Also delete the empty `buttons/` directory if nothing else lives in it.

- [ ] **Step 4: Verify**

Run verification workflow. Check hero, homepage, process, cases — any page with a primary CTA. Confirm shimmer + hover lift still work.

- [ ] **Step 5: Commit**

```bash
cd Frontend
git add -A
git commit -m "refactor(styles): replace buttons.css with <Btn> primitive"
```

---

## Task 25: Delete `cta-banner.css`

**Files:**
- Delete: `Frontend/src/components/blocks/cta-banner/cta-banner.css`
- Modify: `cta-banner` block component and any consumers using its classes

- [ ] **Step 1-6: Shared block-migration procedure (Task 24 template)**

Apply rules. Most cta-banner styling will be layout (flex/grid) + spacing + accent background — all Tailwind utility territory.

- [ ] **Commit**: `refactor(styles): replace cta-banner.css with utilities`

---

## Task 26: Delete `launch-cta.css`

**Files:**
- Delete: `Frontend/src/components/blocks/launch-cta/launch-cta.css`
- Modify: consumers

- [ ] **Apply shared block-migration procedure.**
- [ ] **Commit**: `refactor(styles): replace launch-cta.css with utilities`

---

## Task 27: Delete `turnkey-list.css`

**Files:**
- Delete: `Frontend/src/components/blocks/turnkey-list/turnkey-list.css`

- [ ] **Apply shared procedure.**
- [ ] **Commit**: `refactor(styles): replace turnkey-list.css with utilities`

---

## Task 28: Delete `reasons.css`

**Files:**
- Delete: `Frontend/src/components/blocks/reasons/reasons.css`

- [ ] **Apply shared procedure.** Reasons grid → `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-*` or whatever the legacy column count was. **Important**: preserve the legacy column-count exactly at 1440px (Phase 1 is parity-only); breakpoint inversion is Phase 2.
- [ ] **Commit**: `refactor(styles): replace reasons.css with utilities`

---

## Task 29: Delete `services.css`

**Files:**
- Delete: `Frontend/src/components/blocks/services/services.css`

- [ ] **Apply shared procedure.**
- [ ] **Commit**: `refactor(styles): replace services.css with utilities`

---

## Task 30: Delete `team-cards.css`

**Files:**
- Delete: `Frontend/src/components/blocks/team-cards/team-cards.css`

- [ ] **Apply shared procedure.**
- [ ] **Commit**: `refactor(styles): replace team-cards.css with utilities`

---

## Task 31: Delete `lead-form.css`

**Files:**
- Delete: `Frontend/src/components/blocks/lead-form/lead-form.css`

- [ ] **Apply shared procedure.** Pay attention to HeroUI input theming — confirm no class conflict between our utility overrides and HeroUI's component styles.
- [ ] **Commit**: `refactor(styles): replace lead-form.css with utilities`

---

## Task 32: Delete `outcome.css`

**Files:**
- Delete: `Frontend/src/components/blocks/outcome/outcome.css`

- [ ] **Apply shared procedure.**
- [ ] **Commit**: `refactor(styles): replace outcome.css with utilities`

---

## Task 33: Delete `contact-split.css`

**Files:**
- Delete: `Frontend/src/components/blocks/contact-split/contact-split.css`

- [ ] **Apply shared procedure.** Split layout → `grid grid-cols-2`.
- [ ] **Commit**: `refactor(styles): replace contact-split.css with utilities`

---

## Task 34: Delete `page-hero.css`

**Files:**
- Delete: `Frontend/src/components/blocks/page-hero/page-hero.css`

- [ ] **Apply shared procedure.** Page-hero uses `<H1 variant="page-hero">`. Breadcrumbs may use `contents` display.
- [ ] **Commit**: `refactor(styles): replace page-hero.css with utilities + Heading primitive`

---

## Task 35: Delete `image-text.css`

**Files:**
- Delete: `Frontend/src/components/blocks/image-text/image-text.css`

- [ ] **Apply shared procedure.** Breakout image patterns → `grid` utilities with negative margins as needed.
- [ ] **Commit**: `refactor(styles): replace image-text.css with utilities`

---

## Task 36: Delete `final.css`

**Files:**
- Delete: `Frontend/src/components/blocks/final/final.css`

- [ ] **Apply shared procedure.** Confirm FAQ accordion (HeroUI) is unaffected; social icons preserve their hover behavior.
- [ ] **Commit**: `refactor(styles): replace final.css with utilities`

---

## Task 37: Delete `calculator.css`

**Files:**
- Delete: `Frontend/src/components/calculator/calculator.css`

- [ ] **Apply shared procedure.** Calculator is complex — info cards, summary, multi-step layout. Take time on this one. Run `/calculator` page in dev and click through every state after migration.
- [ ] **Commit**: `refactor(styles): replace calculator.css with utilities`

---

## Task 38: Delete `homepage.css`

**Files:**
- Delete: `Frontend/src/components/homepage/homepage.css`

- [ ] **Apply shared procedure.** Bento grid, pull-quote swiper container, final CTA. Bento grid is `grid grid-cols-N gap-* [grid-template-areas:...]` — preserve exact area definitions.
- [ ] **Commit**: `refactor(styles): replace homepage.css with utilities`

---

## Task 39: Delete `case.css`

**Files:**
- Delete: `Frontend/src/components/blocks/case/case.css`

- [ ] **Apply shared procedure.** Case page layout is heavy; use `<H1 variant="case">`, `<H2 variant="case">` from Heading primitive.
- [ ] **Commit**: `refactor(styles): replace case.css with utilities + Heading primitive`

---

## Task 40: Delete `comparison.css`

**Files:**
- Delete: `Frontend/src/components/blocks/comparison/comparison.css`

- [ ] **Inspect first — this file uses relative-color OKLCH gradients**

```bash
cd Frontend
grep -n "oklch\|relative" src/components/blocks/comparison/comparison.css
```

Relative-color syntax (`oklch(from var(--accent) l c h / 0.2)`) is supported in modern browsers and works fine inside Tailwind arbitrary values: `bg-[oklch(from_var(--color-accent)_l_c_h/0.2)]`. Underscores escape spaces.

- [ ] **Apply shared procedure** with that arbitrary-value pattern for the gradient bits.
- [ ] **Commit**: `refactor(styles): replace comparison.css with utilities + arbitrary-value oklch`

---

## Task 41: Delete `hero.css` (replace with `hero-effects.css`)

**Files:**
- Delete: `Frontend/src/components/blocks/hero/hero.css`
- Create: `Frontend/src/components/blocks/hero/hero-effects.css`
- Modify: `Frontend/src/components/blocks/hero/index.tsx` (and any other consumers)

This is the largest single migration. Budget for it accordingly — review the whole hero block before changing anything.

- [ ] **Step 1: Read hero.css end-to-end**

Open the file. Categorize every rule into one of:
- **Layout** (flex/grid, sizing, spacing) — convertible to utilities
- **Typography** (font sizes for headings, stats) — convertible to utilities or Heading primitive
- **Color/background** — convertible
- **Effect** (grain overlay, ticker mask, complex pseudo-elements, scroll behavior, fixed-position backdrop) — these MAY stay in `hero-effects.css`

Write the categorization as a comment-block at the top of a scratch file or in the PR description.

- [ ] **Step 2: Create `hero-effects.css` with only the "effect" rules**

Target: ≤ 80 lines. If you exceed that, revisit — most rules belong as utilities. Acceptable contents: grain overlay using `background: url(...)` with blend-mode tricks, ticker mask (linear gradient mask-image), any selector using `:has()` or scroll-driven `animation-timeline`.

Add a one-line comment per rule explaining why it cannot be a utility.

- [ ] **Step 3: Convert `hero/index.tsx` consumers**

Replace semantic classes with utilities + primitives:

- `.h1` / `.hp-h1` → `<H1 variant="hp">`
- `.hp-h2` → `<H2 variant="hp">`
- Section padding → `<Section>`
- Container width → `<Container>` (with appropriate variant)
- Stats, ticker, device mockup positioning → utilities
- Nav layout → utilities
- Remaining effect classes → leave them, since `hero-effects.css` still defines them

Remove `import "./hero.css";` and add `import "./hero-effects.css";`.

- [ ] **Step 4: Delete `hero.css`**

```bash
cd Frontend
rm src/components/blocks/hero/hero.css
```

- [ ] **Step 5: Verify thoroughly**

Visual check at 1440px on `/` and `/en`. Compare against baseline. Hero is the most visible part of the site — any regression is high impact. Specifically confirm:
- Marquee ticker still scrolls smoothly
- Grain overlay renders
- Device mockup at correct position/size
- Primary CTA shimmer
- Background glow gradient

- [ ] **Step 6: Commit**

```bash
cd Frontend
git add -A
git commit -m "refactor(styles): replace hero.css with utilities, primitives, and hero-effects.css"
```

---

## Task 42: Trim `blog.css` to use `@theme` tokens

**Files:**
- Modify: `Frontend/src/components/blocks/blog/blog.css`

This is the one CSS file we keep, because markdown-generated `<p>`/`<h2>`/`<ul>` cannot be wrapped in primitives. We trim it to use `@apply` against `@theme` tokens so it stays in sync with the rest of the system.

- [ ] **Step 1: Inspect current blog.css**

Open the file. Identify any hardcoded color or spacing values that duplicate `@theme` tokens (e.g., `color: #f5f3f7;` that should be `color: var(--color-ink);`).

- [ ] **Step 2: Rewrite to use token references**

Replace hardcoded values with token references. Prefer `@apply` for things that map to Tailwind utilities (e.g., `@apply text-ink-dim;` instead of `color: var(--color-ink-dim);`) when the markdown-output element can take a single class via `.prose > p` style selectors.

Pattern:

```css
/* before */
.prose-stub p {
  color: #b8b3c4;
  font-size: 16px;
  line-height: 1.7;
}

/* after */
.prose-stub p {
  @apply text-ink-dim text-base leading-relaxed;
}
```

- [ ] **Step 3: Verify**

Open any blog page (e.g., `/blog/<slug>`) and confirm typography unchanged.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/components/blocks/blog/blog.css
git commit -m "refactor(styles): trim blog.css to use @theme tokens via @apply"
```

---

# Phase D — Globals cleanup and enforcement

## Task 43: Rewrite `globals.css` to its target form

**Files:**
- Modify: `Frontend/src/app/globals.css`

- [ ] **Step 1: Remove the legacy `:root` token block**

Delete the entire `:root { --bg: ...; --ink: ...; ... }` definition added before the refactor. All those tokens now live in `@theme`.

- [ ] **Step 2: Remove media-query `:root` overrides**

Delete the `@media (max-width: ...) { :root { --section-y: ...; ... } }` blocks. The Phase 2 spec will reintroduce responsive scaling via mobile-first `@media (min-width: ...)` in primitives' utility strings.

After this step, `--spacing-section-y` and `--spacing-gutter-x` are fixed at their desktop values across all viewports. **This is an intentional Phase 1 endpoint** — the site will be desktop-spaced at narrow widths until Phase 2 inverts the responsive model. Document this in the PR description.

- [ ] **Step 3: Remove legacy semantic classes**

Delete `.h1`, `.hp-h1`, `.hp-h2`, `.case-h1`, `.case-h2`, `.page-hero-h1`, `.container-page`, `.btn-*` and any other class that was previously consumed by `.tsx` files. If `npm run build` fails because something still references them, find and convert that consumer (you missed it in Phase C — add a task or just fix inline).

- [ ] **Step 4: Keep**

Retained: `@import "tailwindcss"`, `@config "../../tailwind.config.ts"`, the entire `@theme` block from Task 3+4, `html { scroll-behavior: smooth }`, `html, body { background, color }`, and the `@layer utilities { .text-gradient, .text-gradient-brand, .grid-bg, .dotted-bg, .ease-soft }` block (these are utility primitives, fine to keep).

- [ ] **Step 5: Verify**

```bash
cd Frontend
npm run typecheck && npm run lint && npm run build
```

Visual sweep all baseline pages. Confirm nothing references deleted classes.

- [ ] **Step 6: Commit**

```bash
cd Frontend
git add src/app/globals.css
git commit -m "refactor(styles): trim globals.css to @theme + utilities only"
```

---

## Task 44: Trim `tailwind.config.ts`

**Files:**
- Modify: `Frontend/tailwind.config.ts`

- [ ] **Step 1: Strip `theme.extend`**

Delete all of `theme.extend` — colors, maxWidth, backgroundImage, boxShadow, keyframes, animation, transitionTimingFunction. They all live in `@theme` now.

Keep: `content`, `darkMode`, `theme.extend.fontFamily` (if Tailwind 4 `--font-*` tokens in `@theme` prove insufficient — test first; if `@theme --font-display` works, remove this too), and `plugins` (HeroUI).

The minimal target:

```ts
import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#121212",
            foreground: "#f5f3f7",
            primary: { DEFAULT: "#7c4dde", foreground: "#ffffff" },
            secondary: { DEFAULT: "#5d2dad", foreground: "#ffffff" },
          },
        },
      },
    }),
  ],
};

export default config;
```

- [ ] **Step 2: Verify**

```bash
cd Frontend
npm run build
```

If utilities like `bg-accent` or `text-ink` break, the `@theme --color-*` namespace isn't being picked up. Diagnose: confirm `@theme` block syntax, confirm `@import "tailwindcss"` precedes it, confirm Tailwind v4 is actually running.

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add tailwind.config.ts
git commit -m "refactor(styles): minimize tailwind.config.ts to plugin + content"
```

---

## Task 45: Promote ESLint rule from warning to error

**Files:**
- Modify: `Frontend/eslint.config.mjs`

- [ ] **Step 1: Flip severity**

Change `"react/forbid-dom-props": ["warn", ...]` to `["error", ...]`.

- [ ] **Step 2: Verify**

```bash
cd Frontend
npm run lint
```

Expected: zero errors. Any remaining error is a missed inline static style — find and convert.

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add eslint.config.mjs
git commit -m "chore(lint): error on inline static styles"
```

---

## Task 46: Delete `/dev/primitives` demo page

**Files:**
- Delete: `Frontend/src/app/dev/primitives/page.tsx`

- [ ] **Step 1: Remove**

```bash
cd Frontend
rm -r src/app/dev/primitives
rmdir src/app/dev 2>/dev/null || true
```

- [ ] **Step 2: Commit**

```bash
cd Frontend
git add -A
git commit -m "chore: remove dev/primitives demo page"
```

---

## Task 47: Final success-criteria verification

**Files:** none (verification pass)

- [ ] **Step 1: Check criterion 1 — only allowed CSS files remain**

```bash
cd Frontend
find src -name "*.css" -type f
```

Expected:
```
src/app/globals.css
src/app/keyframes.css
src/app/vendor.css
src/components/blocks/hero/hero-effects.css
src/components/blocks/blog/blog.css
```

Anything else → it leaked through; investigate and resolve.

- [ ] **Step 2: Check criterion 2 — `globals.css` is clean**

Read `src/app/globals.css`. Confirm: no legacy semantic classes, no `:root` token block outside `@theme`, no media-query overrides.

- [ ] **Step 3: Check criterion 3 — no static inline styles**

```bash
cd Frontend
npm run lint
```

Expected: zero `react/forbid-dom-props` errors. Files using dynamic CSS vars have the per-line disable comment from Task 23.

- [ ] **Step 4: Check criterion 4 — tokens only from `@theme`**

```bash
cd Frontend
grep -n "^  --[a-z]" src/app/globals.css
```

Expected: all matches are inside the `@theme { ... }` block. None inside `:root { ... }`.

- [ ] **Step 5: Check criterion 5 — primitives adopted**

```bash
cd Frontend
grep -rln "from \"@/components/ui\"" src/app src/components | wc -l
```

Expected: at least 80% of page files (`src/app/**/page.tsx`) import from `@/components/ui`. Spot-check the ones that don't and confirm they genuinely have no need.

- [ ] **Step 6: Check criterion 6 — visual parity**

Re-screenshot all pages from Task 1 at 1440px. Diff each against the baseline. Acceptable diffs: zero. Sub-pixel anti-aliasing differences from Tailwind's compiled output vs hand-written CSS are tolerable; layout shifts are not.

- [ ] **Step 7: Check criterion 7 — UK/EN parity**

```bash
cd Frontend
diff <(ls src/app/about src/app/en/about) <(ls src/app/portfolio src/app/en/portfolio) 2>&1 | head
```

Spot-check that UK and EN versions of converted pages are structurally identical (modulo content/translations).

- [ ] **Step 8: Final commit (notes only) and open PR**

```bash
cd Frontend
git log --oneline refactor/style-system-unification ^main | wc -l
```

Confirm the commit history is clean and per-task. Open a PR titled `refactor: unify style system (Phase 1)` with a body that lists the success criteria and confirms each.

No additional commit unless `globals.css` or anything else needs a final touch-up.

---

# After this plan

Once merged, the next plan is the Phase 2 mobile-first inversion. Brief preview of what that plan covers:

1. Re-introduce responsive scaling for `--spacing-section-y` and `--spacing-gutter-x`, but mobile-first (`md:`/`lg:` increasing) instead of `max-width:` decreasing.
2. Audit every primitive's default utilities for mobile sensibility — `<Container>` becomes `px-4 md:px-8 lg:px-12` instead of fixed `px-12`.
3. Audit `hero-effects.css` and convert any remaining desktop assumptions.
4. Add explicit viewport meta + touch-target audit.
5. Adopt Tailwind's default breakpoints consistently (we already collapsed onto them in Phase 1 — Phase 2 inverts the direction).

Phase 1's discipline of consolidating to Tailwind's breakpoint scale and centralizing tokens means Phase 2 is a mechanical Tailwind exercise, not CSS archaeology.
