# Logo + Cases Page Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the text wordmark in the header/mobile menu with the imported SVG logo from the legacy code-site.art site, unify the portfolio (cases) page card design with the homepage cases block by reusing `RelatedCard`, and rewrite the portfolio hero headline to drop the "39 under NDA" mention while making the public-case count dynamic from Sanity.

**Architecture:**
1. Logo lives in `src/components/icons/logo/` today but is unused, broken (imports `@/i18n/navigation`, which doesn't exist), and references undefined Tailwind animation classes. Move it to `src/components/layout/logo/` (where header/footer/mobile-menu live), rename files to kebab-case, fix the `Link` import to `next/link`, and register the missing `svg-glow-*` keyframes in `tailwind.config.ts`. Then swap the `<em>Code-Site</em>.art` text node in `hp-header.tsx` and `mobile-menu.tsx` for `<Logo />`.
2. Both `app/portfolio/page.tsx` and `app/en/portfolio/page.tsx` declare a private inline `PortfolioCard` that builds the same simple gradient-mockup tile (image 2 in spec). The homepage `cases.tsx` uses the richer `RelatedCard` block (image 1) via a `refToCaseItem` mapper. Extract that mapper to `src/lib/shared/case-card-item.ts` so it is callable from all three call sites, then replace both `PortfolioCard` definitions with `<RelatedCard>` calls.
3. The EN portfolio hero currently reads "8 public cases. 39 under NDA. The numbers are real." Drop the NDA mention. Make the public count dynamic by passing `cases.length` into the headline (already in scope on both `page.tsx` files). Apply the same dynamic-count framing to UA. Also clean up the EN `metadata.title` / `metadata.description` / `openGraph.title` strings that still reference NDA.

**Tech Stack:** Next.js 15 (App Router, Server Components), TypeScript, Tailwind v4, HeroUI for the mobile drawer, Sanity for case studies (already wired via `fetchCaseStudies`). No test framework configured — verification is via `npm run lint`, `npm run build`, and visual checks in `npm run dev`.

**Scope notes:**
- The new `LogoSVG.tsx` references `animate-svg-glow-blue|pink|dark`. These classes do not exist anywhere in the codebase or in `tailwind.config.ts`. They must be added or the animation will silently no-op.
- The new `Logo.tsx` imports `Link` from `@/i18n/navigation`. That path does not exist in this workspace (only `src/i18n/request.ts` is present). The rest of the codebase uses `next/link` directly. We will follow that convention.
- The header brand is wrapped in its own `<Link>` today. The new `Logo` component already renders its own `<Link>` internally, so the wrapping `<Link>` in `hp-header.tsx` and `mobile-menu.tsx` is removed when swapping in `<Logo />`.
- Both portfolio pages use `presentationForCase` for the per-industry color/gradient/tech label. `RelatedCard` accepts a `gradient` prop and a `metrics` array of chips — `refToCaseItem` already maps these correctly.

---

## File Structure

**New files:**
- `src/components/layout/logo/logo.tsx` — small wrapper component, renders `<Link href="/"><LogoSVG /></Link>`. Replaces the misplaced `src/components/icons/logo/Logo.tsx`.
- `src/components/layout/logo/logo-svg.tsx` — pure SVG, gradient defs + paths, animated via Tailwind class. Replaces `src/components/icons/logo/LogoSVG.tsx`.
- `src/lib/shared/case-card-item.ts` — exports `caseRefToCardItem(ref, locale)` returning the same shape `RelatedCard` consumes. Lifted from `components/homepage/cases.tsx` so it can be reused on the portfolio pages.

**Modified files:**
- `tailwind.config.ts` — add three `svg-glow-*` keyframes + animation utilities.
- `src/components/layout/hp-header.tsx` — replace the `<Link href={homeHref} className="hp-header-brand">…</Link>` block with `<Logo />` (passing through `homeHref` if we want explicit locale routing — see Task 4).
- `src/components/layout/mobile-menu.tsx` — same swap inside `hp-drawer-head`.
- `src/components/homepage/cases.tsx` — import the shared mapper instead of declaring `refToCaseItem` locally.
- `src/app/portfolio/page.tsx` — delete the inline `PortfolioCard`; render `<RelatedCard>` via the shared mapper; rewrite the hero `headline` to use `cases.length`; update metadata.
- `src/app/en/portfolio/page.tsx` — same as above, EN copy; also rewrite `metadata.title`, `metadata.description`, `openGraph.title` to drop NDA.

**Deleted files:**
- `src/components/icons/logo/Logo.tsx`
- `src/components/icons/logo/LogoSVG.tsx`
- The empty `src/components/icons/logo/` directory (and `src/components/icons/` if it has no other contents — verify before deleting).

---

## Task 1: Add svg-glow keyframes to Tailwind config

The new `LogoSVG` references `animate-svg-glow-blue|pink|dark` but those classes don't exist. Register them so the gradient shimmer actually plays.

**Files:**
- Modify: `tailwind.config.ts:71-84`

- [ ] **Step 1: Add three keyframes and three animation utilities**

In `tailwind.config.ts`, extend the existing `keyframes` and `animation` blocks. The keyframes shift the gradient stops to create a subtle left-to-right shimmer; the animation runs slowly and indefinitely so the effect is ambient.

```ts
keyframes: {
  marquee: {
    "0%": { transform: "translateX(0%)" },
    "100%": { transform: "translateX(-50%)" },
  },
  "fade-up": {
    "0%": { opacity: "0", transform: "translateY(8px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  "svg-glow-blue": {
    "0%, 100%": { filter: "drop-shadow(0 0 0 oklch(0.55 0.18 295 / 0))" },
    "50%":       { filter: "drop-shadow(0 0 8px oklch(0.70 0.14 295 / 0.45))" },
  },
  "svg-glow-pink": {
    "0%, 100%": { filter: "drop-shadow(0 0 0 oklch(0.70 0.18 350 / 0))" },
    "50%":       { filter: "drop-shadow(0 0 8px oklch(0.78 0.16 350 / 0.45))" },
  },
  "svg-glow-dark": {
    "0%, 100%": { filter: "drop-shadow(0 0 0 oklch(0 0 0 / 0))" },
    "50%":       { filter: "drop-shadow(0 0 6px oklch(0.55 0.18 295 / 0.35))" },
  },
},
animation: {
  marquee: "marquee 30s linear infinite",
  "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
  "svg-glow-blue": "svg-glow-blue 4s ease-in-out infinite",
  "svg-glow-pink": "svg-glow-pink 4s ease-in-out infinite",
  "svg-glow-dark": "svg-glow-dark 4s ease-in-out infinite",
},
```

- [ ] **Step 2: Verify tailwind picks up the new utilities**

Run: `npm run lint`
Expected: no new errors (lint is stricter than build for unused references; should pass clean).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(tailwind): register svg-glow-blue/pink/dark animations for header logo"
```

---

## Task 2: Move and rename logo component, fix Link import

The new logo files currently sit under `components/icons/logo/` with PascalCase filenames and a broken `@/i18n/navigation` import. Move them next to the rest of the header chrome and align with the kebab-case convention used by `hp-header.tsx`, `mobile-menu.tsx`, `locale-switcher.tsx`.

**Files:**
- Create: `src/components/layout/logo/logo.tsx`
- Create: `src/components/layout/logo/logo-svg.tsx`
- Delete: `src/components/icons/logo/Logo.tsx`
- Delete: `src/components/icons/logo/LogoSVG.tsx`

- [ ] **Step 1: Create `src/components/layout/logo/logo-svg.tsx`**

Body of `LogoSVG` is identical to the imported file except: rename file, no other changes. Paste the full component (do not trim — the gradient defs and 14 paths are load-bearing):

```tsx
"use client";
import { twMerge } from "tailwind-merge";
import { useId } from "react";

interface LogoSVGProps {
  className?: string;
  variant?: "blue" | "pink" | "dark";
  animated?: boolean;
}

export default function LogoSVG({
  className = "",
  variant = "blue",
  animated = true,
}: LogoSVGProps) {
  // useId() returns ":r0:" style ids; sanitize so they're valid SVG ids.
  const rawId = useId().replace(/:/g, "").replace(/[^a-zA-Z0-9]/g, "");
  const uniqueId = rawId || `id-${Math.random().toString(36).substring(2, 9)}`;
  const gradientIdBlue = `logo-gradient-blue-${uniqueId}`;
  const gradientIdPink = `logo-gradient-pink-${uniqueId}`;
  const gradientIdDark = `logo-gradient-dark-${uniqueId}`;

  const fillValue = animated
    ? variant === "blue"
      ? `url(#${gradientIdBlue})`
      : variant === "pink"
        ? `url(#${gradientIdPink})`
        : `url(#${gradientIdDark})`
    : "currentColor";

  const animationClass = animated
    ? variant === "blue"
      ? "animate-svg-glow-blue"
      : variant === "pink"
        ? "animate-svg-glow-pink"
        : "animate-svg-glow-dark"
    : "";

  return (
    <div className={twMerge("inline-block", animationClass)}>
      <svg
        viewBox="0 0 129 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={twMerge("w-auto h-[12px]", className)}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientIdBlue} x1="129" y1="10" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(125 64.5 5)">
            <stop offset="22.37%" stopColor="#fff" />
            <stop offset="94.04%" stopColor="#b5daff" />
          </linearGradient>
          <linearGradient id={gradientIdPink} x1="129" y1="10" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(125 64.5 5)">
            <stop offset="22.37%" stopColor="#fff" />
            <stop offset="94.04%" stopColor="#ffb5e6" />
          </linearGradient>
          <linearGradient id={gradientIdDark} x1="129" y1="10" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(125 64.5 5)">
            <stop offset="22.37%" stopColor="#000" />
            <stop offset="94.04%" stopColor="#b5daff" />
          </linearGradient>
        </defs>
        <path d="M16.7342 7.52095V9.98699L10.8677 6.26807V3.71898L16.7342 4.95911e-05V2.46609L12.5662 4.99352L16.7342 7.52095Z" fill={fillValue} />
        <path d="M22.8121 4.99357L18.6442 2.46614V9.53674e-05L24.5106 3.71902V6.26811L18.6442 9.98704V7.52099L22.8121 4.99357Z" fill={fillValue} />
        <path d="M2.87258 9.03033C0.67314 9.03033 0 8.38764 0 6.26822V3.27141C0 1.14115 0.669226 0.509296 2.87258 0.509296H8.05418C9.42393 0.509296 10.054 1.28919 10.2693 1.75857L9.11476 2.84897C8.9543 2.51318 8.63339 2.19184 7.93286 2.19184H2.88432C2.07812 2.19184 1.79634 2.46264 1.79634 3.2678V6.27544C1.79634 6.99395 1.9568 7.3514 2.88432 7.3514H7.99547C8.70775 7.3514 9.00127 7.01561 9.16173 6.69427L10.3162 7.77023C10.1166 8.23961 9.4709 9.0195 8.10114 9.0195H2.87258V9.03033Z" fill={fillValue} />
        <path d="M25.9122 9.03035V0.509315H33.6807C35.9232 0.509315 36.5807 1.19172 36.5807 3.27143V6.26824C36.5807 8.35878 35.9232 9.03035 33.6807 9.03035H25.9122ZM34.7687 3.28226C34.7687 2.44099 34.4752 2.19186 33.6807 2.19186H27.736V7.35503H33.6807C34.4987 7.35503 34.7687 7.12034 34.7687 6.27907V3.28226Z" fill={fillValue} />
        <path d="M38.251 9.03035V0.509315H47.1231V2.19186H40.063V4.07299H46.9196V5.45224H40.063V7.35864H47.1231V9.03035H38.251Z" fill={fillValue} />
        <path d="M66.3979 6.56436C66.3979 8.37328 65.5917 9.0268 63.3923 9.0268H56.1208C56.5161 7.3587 56.1208 9.00152 56.5083 7.35508H63.271C64.2494 7.35508 64.5312 7.14567 64.5312 6.41272C64.5312 5.69421 64.2611 5.47035 63.3101 5.47035H59.5648C57.3497 5.47035 56.6374 4.741 56.6374 3.18122V2.89598C56.6374 1.199 57.3771 0.50576 59.6157 0.50576H66.7736C66.5584 1.1304 66.7619 0.541867 66.1984 2.20275H59.6157C58.7312 2.20275 58.4768 2.46271 58.4768 3.13067C58.4768 3.79864 58.7312 4.07304 59.6157 4.07304H63.3062C65.5996 4.07304 66.394 4.76628 66.394 6.26468V6.56436H66.3979Z" fill={fillValue} />
        <path d="M66.4374 9.03024L69.2943 0.51281H71.3333L68.5194 8.99052L66.4374 9.03024Z" fill={fillValue} />
        <path d="M74.7222 9.03023V2.19535H71.5718L72.1236 0.512806H79.8999V2.19535H76.5303V9.03023H74.7222Z" fill={fillValue} />
        <path d="M80.6913 9.03035V0.509315H89.5634V2.19186H82.5033V4.07299H89.3599V5.45224H82.5033V7.35864H89.5634V9.03035H80.6913Z" fill={fillValue} />
        <path d="M101.503 0.509315L96.4462 9.03035H98.3756L103.178 0.509315H101.503ZM103.859 1.28921L102.919 2.96092L104.551 5.71581H101.369L100.618 7.05174H105.24L106.395 9.03396H108.461L103.859 1.28921Z" fill={fillValue} />
        <path d="M117.047 9.03032L113.854 6.24293H110.942V9.03032H109.118V0.509285H116.66C118.621 0.509285 119.306 1.21335 119.306 3.14503V3.66496C119.306 5.74467 118.46 6.21405 116.179 6.21405L119.599 9.0231H117.047V9.03032ZM117.505 3.43388C117.505 2.60344 117.4 2.20988 116.605 2.20988H110.942V4.84562H116.605C117.251 4.84562 117.505 4.58566 117.505 3.84188V3.43388Z" fill={fillValue} />
        <path d="M123.822 9.03023V2.19535H120.453V0.512806H129V2.19535H125.63V9.03023H123.822Z" fill={fillValue} />
        <path d="M92.1452 9.05203C92.7655 9.05203 93.2684 8.58808 93.2684 8.01578C93.2684 7.44348 92.7655 6.97954 92.1452 6.97954C91.5248 6.97954 91.022 7.44348 91.022 8.01578C91.022 8.58808 91.5248 9.05203 92.1452 9.05203Z" fill={fillValue} />
        <path d="M53.8825 4.05475H48.877V5.42678H53.8825V4.05475Z" fill={fillValue} />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/layout/logo/logo.tsx`**

Use `next/link` (the rest of the layout already does — see `hp-header.tsx:3`). The legacy `@/i18n/navigation` does not exist here. The component is server-renderable (no `"use client"`) so it can be dropped into both client (`hp-header.tsx`, `mobile-menu.tsx`) and server contexts.

```tsx
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import LogoSVG from "./logo-svg";

interface LogoProps {
  className?: string;
  href?: string;
  variant?: "blue" | "pink" | "dark";
  onClick?: () => void;
}

export default function Logo({
  className = "",
  href = "/",
  variant = "blue",
  onClick,
}: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={twMerge(
        "relative inline-block outline-none text-white",
        className,
      )}
      aria-label="Code-Site.Art — home"
    >
      <LogoSVG variant={variant} animated={true} />
    </Link>
  );
}
```

Note the additions vs the imported file: `href` is now a prop (so the caller can pass locale-aware `homeHref`); `onClick` is a prop so the mobile drawer can close itself on click; `aria-label` is added because the SVG carries no accessible name.

- [ ] **Step 3: Delete the old logo files and empty parent dirs**

```bash
git rm src/components/icons/logo/Logo.tsx src/components/icons/logo/LogoSVG.tsx
# If icons/logo is now empty:
git rm -r src/components/icons/logo
# Only if src/components/icons has no other files:
# (verify with `ls src/components/icons` first; do not delete if anything remains)
```

- [ ] **Step 4: Lint to confirm no stale imports**

Run: `npm run lint`
Expected: pass clean. Nothing imports the old paths today (the existing files are unused), so this should be a no-op.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/logo/logo.tsx src/components/layout/logo/logo-svg.tsx
git commit -m "feat(layout): add header Logo component (relocated from icons/logo, uses next/link)"
```

---

## Task 3: Wire `<Logo />` into the desktop header

Replace the text wordmark in `hp-header.tsx` with the SVG logo.

**Files:**
- Modify: `src/components/layout/hp-header.tsx:53-55`

- [ ] **Step 1: Add the import**

At the top of `src/components/layout/hp-header.tsx`, after the existing imports for `LocaleSwitcher` and `MobileMenu`, add:

```ts
import Logo from "./logo/logo";
```

- [ ] **Step 2: Replace the brand `<Link>` block**

Find the existing block at `hp-header.tsx:53-55`:

```tsx
<Link href={homeHref} className="hp-header-brand" onClick={closeDd}>
  <em>Code-Site</em>.art
</Link>
```

Replace it with (Logo renders its own `<Link>`):

```tsx
<Logo href={homeHref} className="hp-header-brand" onClick={closeDd} />
```

- [ ] **Step 3: Trim CSS that no longer applies (optional but recommended)**

The `.hp-header-brand` selector (`homepage.css:1587-1603`) styles a text wordmark (`font-family: 'Manrope'`, `font-size: 16px`, `<em>` gradient fill). When the child is now an SVG, the font properties are dead, but the layout properties (`white-space: nowrap`, `flex-shrink: 0`) are still useful for the wrapping anchor.

Reduce the rule to only the layout-relevant bits:

```css
.hp-header-brand {
  text-decoration: none;
  color: var(--ink);
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
```

Delete the `.hp-header-brand em { … }` rule entirely (no `<em>` inside anymore) and the per-breakpoint `font-size` overrides at `homepage.css:1911` and `homepage.css:1921`.

If you would rather defer the CSS cleanup, leave the rules in place — they are harmless when the child is an SVG. Flag it as follow-up.

- [ ] **Step 4: Visual check in dev**

Run: `npm run dev` (or use the preview tools). Open http://localhost:3000. Confirm:
- The logo renders in the header in place of the text.
- The shimmer animation plays.
- Clicking it navigates to `/`.
- On the EN site (`/en`) it navigates to `/en` (the `homeHref` prop carries locale).
- Resize to <800px: header collapses to mobile, logo stays visible (mobile menu replaces nav).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/hp-header.tsx src/components/homepage/homepage.css
git commit -m "feat(header): swap text wordmark for SVG Logo component"
```

---

## Task 4: Wire `<Logo />` into the mobile drawer head

Same swap inside the HeroUI drawer, plus the close-on-click handler.

**Files:**
- Modify: `src/components/layout/mobile-menu.tsx:119-125`

- [ ] **Step 1: Add the import**

After the existing imports in `mobile-menu.tsx`, add:

```ts
import Logo from "./logo/logo";
```

- [ ] **Step 2: Replace the brand `<Link>` block**

Find `mobile-menu.tsx:119-125`:

```tsx
<Link
  href={isEn ? "/en" : "/"}
  className="hp-header-brand"
  onClick={close}
>
  <em>Code-Site</em>.art
</Link>
```

Replace with:

```tsx
<Logo
  href={isEn ? "/en" : "/"}
  className="hp-header-brand"
  onClick={close}
/>
```

- [ ] **Step 3: Visual check**

Run dev server, resize browser to <800px so the burger appears. Open the drawer. Confirm:
- The logo (not text) appears in the drawer header.
- Tapping the logo closes the drawer AND navigates to home.
- Locale: on `/en`, tapping logo goes to `/en`.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/mobile-menu.tsx
git commit -m "feat(mobile-menu): swap drawer wordmark for SVG Logo component"
```

---

## Task 5: Extract `refToCaseItem` to a shared module

Today the mapping from `CaseStudyRef` → card-shaped item lives privately inside `components/homepage/cases.tsx`. Tasks 6–7 need the same mapping on the portfolio pages, so lift it before duplicating logic.

**Files:**
- Create: `src/lib/shared/case-card-item.ts`
- Modify: `src/components/homepage/cases.tsx:27-53` (delete local copy, import shared)

- [ ] **Step 1: Create `src/lib/shared/case-card-item.ts`**

Copy the body of `refToCaseItem` from `components/homepage/cases.tsx:27-53` and the `CaseItem` type from `components/homepage/cases.tsx:13-25` into a new shared file. Rename the function to `caseRefToCardItem` so it reads well from the call site, and export both.

```ts
import { hasEnCase } from "@/constants/i18n-routes";
import { loc } from "@/lib/shared/sanity-locale";
import { presentationForCase } from "@/lib/shared/case-presentation";
import type { CaseStudyRef, Locale } from "@/types/sanity";

export type CaseCardItem = {
  name: string;
  industry: string;
  region: string;
  year: string;
  chips: string[];
  metrics: string;
  gradient: string;
  /** `null` renders the card as a coming-soon tile (no link). */
  href: string | null;
  coverImage?: string;
  coverImageAlt?: string;
};

export function caseRefToCardItem(
  c: CaseStudyRef,
  locale: Locale,
): CaseCardItem {
  const pres = presentationForCase(c.slug, c.industrySlug);
  const name = loc(c.title, locale) || c.client || c.slug;
  const region = loc(c.region, locale);
  const year = c.year ? String(c.year) : "";
  // EN listing should deep-link into /en/portfolio/<slug> only when the
  // case actually has EN content; otherwise fall back to the UA URL so
  // the user doesn't bounce to a 404 on click.
  const href =
    locale === "en"
      ? hasEnCase(c.slug)
        ? `/en/portfolio/${c.slug}`
        : `/portfolio/${c.slug}`
      : `/portfolio/${c.slug}`;
  return {
    name,
    industry: pres.label,
    region,
    year,
    chips: [pres.label, pres.tech],
    metrics: loc(c.metricsLine, locale) || "",
    gradient: pres.gradient,
    href,
    coverImage: c.coverImage?.asset?.url,
    coverImageAlt: loc(c.coverImage?.alt, locale) || name,
  };
}
```

- [ ] **Step 2: Update `components/homepage/cases.tsx` to import the shared mapper**

Open `src/components/homepage/cases.tsx`. Delete the local `CaseItem` type (lines 13-25) and the local `refToCaseItem` function (lines 27-53). Replace with an import at the top:

```ts
import {
  caseRefToCardItem,
  type CaseCardItem,
} from "@/lib/shared/case-card-item";
```

Rename the `items` prop type to `CaseCardItem[]` (replaces removed local `CaseItem`):

```ts
items?: CaseCardItem[];
```

Update the call site in the same file (was `.map((c) => refToCaseItem(c, locale))`):

```ts
const finalItems: CaseCardItem[] =
  items ??
  (await fetchCaseStudies()).slice(0, 3).map((c) => caseRefToCardItem(c, locale));
```

Everything else in `cases.tsx` stays — `RelatedCard` props are unchanged.

- [ ] **Step 3: Build to confirm nothing else broke**

Run: `npm run lint && npm run build`
Expected: clean. The homepage cases block must render identically since we only moved the mapper.

- [ ] **Step 4: Visual regression check**

Run dev server, open `/`. Scroll to the CASES section. The two card tiles must render the same as before (cover image, chips, name, region/year line, metrics line, ↗ arrow on hover).

- [ ] **Step 5: Commit**

```bash
git add src/lib/shared/case-card-item.ts src/components/homepage/cases.tsx
git commit -m "refactor(cases): extract caseRefToCardItem mapper to lib/shared for reuse"
```

---

## Task 6: Replace the UA portfolio `PortfolioCard` with `<RelatedCard>` and reframe the hero

**Files:**
- Modify: `src/app/portfolio/page.tsx`

- [ ] **Step 1: Replace imports**

Open `src/app/portfolio/page.tsx`. Drop the inline `PortfolioCard` (lines 32-113) entirely. Add a `RelatedCard` import and the shared mapper:

```ts
import { RelatedCard } from "@/components/blocks/related-card";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
```

Remove the now-unused imports of `ArrowUpRight`, `loc`, `CaseStudyRef`, and `presentationForCase` (those were only used by the deleted card). Keep `Link` (still used in JSON-LD / nowhere else? — verify with lint after editing; if not used, drop it too).

- [ ] **Step 2: Render `<RelatedCard>` in the grid**

Replace the existing grid (currently `cases.map((c) => <PortfolioCard … />)`) with:

```tsx
<div className="hp-cases-grid">
  {cases.map((c) => {
    const item = caseRefToCardItem(c, "uk");
    const metaLine = [item.industry, item.region, item.year]
      .filter(Boolean)
      .join(" · ");
    return (
      <RelatedCard
        key={c._id}
        metrics={item.chips}
        title={item.name}
        eyebrow={metaLine || undefined}
        sub={item.metrics || undefined}
        coverImage={
          item.coverImage
            ? { src: item.coverImage, alt: item.coverImageAlt ?? item.name }
            : undefined
        }
        gradient={item.gradient}
        href={item.href}
      />
    );
  })}
</div>
```

This is the exact same shape `components/homepage/cases.tsx:88-103` uses, so the home and portfolio grids render identically.

- [ ] **Step 3: Rewrite the hero headline to use a dynamic count and drop NDA**

Ukrainian numeric agreement changes BOTH the adjective and the noun:
- `1` → nominative singular: "1 **реальний кейс**"
- `2, 3, 4` → nominative plural: "2 **реальні кейси**"
- `0, 5+, 11–14` → genitive plural: "5 **реальних кейсів**"

Encode that with a helper that returns the inflected `"<adjective> <noun>"` fragment. Add to `src/lib/shared/case-card-item.ts`:

```ts
/** Returns "реальний кейс" / "реальні кейси" / "реальних кейсів" by count. */
export function ukRealCasesPhrase(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return "реальних кейсів";
  if (mod10 === 1) return "реальний кейс";
  if (mod10 >= 2 && mod10 <= 4) return "реальні кейси";
  return "реальних кейсів";
}
```

Then in `src/app/portfolio/page.tsx`:

```ts
import { ukRealCasesPhrase } from "@/lib/shared/case-card-item";
```

```tsx
headline={
  <>
    {cases.length} {ukRealCasesPhrase(cases.length)} з{" "}
    <em>реальними метриками</em>
  </>
}
```

(The post-`з` adjective "реальними метриками" is instrumental plural and stays constant regardless of count, so it can sit inside `<em>`.)

Leave the `sub` line as-is — it does not mention NDA. Leave `eyebrow="/ PORTFOLIO"` alone.

- [ ] **Step 4: Update metadata to drop NDA reference**

The UA metadata.title/description (`page.tsx:16-18`) do not mention NDA, so nothing to change here. Confirm by reading the file after editing.

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Expected: clean. If lint flags unused imports (`Link`, `ArrowUpRight`, `loc`, etc.) remove them.

- [ ] **Step 6: Visual check**

Run dev server, open `/portfolio`. Confirm:
- The cards now have the richer cover image (when present) and styled chip row, matching the homepage CASES block.
- Hero headline reads "N реальних кейсів з реальними метриками" where N matches Sanity case count (currently 2 per spec image, but will scale).
- No "NDA" copy anywhere on the page.

- [ ] **Step 7: Commit**

```bash
git add src/app/portfolio/page.tsx
git commit -m "feat(portfolio/uk): use RelatedCard; reframe hero with dynamic case count"
```

---

## Task 7: Same treatment for EN portfolio + metadata cleanup

**Files:**
- Modify: `src/app/en/portfolio/page.tsx`

- [ ] **Step 1: Replace imports & drop inline `PortfolioCard`**

Open `src/app/en/portfolio/page.tsx`. Delete `PortfolioCard` (lines 42-126). Add:

```ts
import { RelatedCard } from "@/components/blocks/related-card";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
```

Drop the now-unused imports (`ArrowUpRight`, `loc`, `CaseStudyRef`, `presentationForCase`, `hasEnCase`, possibly `Link`). Keep what's still referenced (the JSON-LD block uses `hasEnCase`, so keep that one).

- [ ] **Step 2: Render `<RelatedCard>` in the grid**

Replace the `cases.map((c) => <PortfolioCard … />)` block with the same pattern as Task 6 step 2, but with locale `"en"`:

```tsx
<div className="hp-cases-grid">
  {cases.map((c) => {
    const item = caseRefToCardItem(c, "en");
    const metaLine = [item.industry, item.region, item.year]
      .filter(Boolean)
      .join(" · ");
    return (
      <RelatedCard
        key={c._id}
        metrics={item.chips}
        title={item.name}
        eyebrow={metaLine || undefined}
        sub={item.metrics || undefined}
        coverImage={
          item.coverImage
            ? { src: item.coverImage, alt: item.coverImageAlt ?? item.name }
            : undefined
        }
        gradient={item.gradient}
        href={item.href}
      />
    );
  })}
</div>
```

- [ ] **Step 3: Rewrite the hero headline**

EN plural is simple. Use the helper from Task 6:

```ts
import { enCasesNoun } from "@/lib/shared/case-card-item";
```

Add to the shared file alongside `ukRealCasesPhrase`:

```ts
/** "case" when n === 1, otherwise "cases". */
export function enCasesNoun(n: number): string {
  return n === 1 ? "case" : "cases";
}
```

Replace the headline at `page.tsx:195-199` (was "8 public cases. 39 under NDA. The numbers are real."):

```tsx
headline={
  <>
    {cases.length} real {enCasesNoun(cases.length)}. The{" "}
    <em>numbers are real</em>.
  </>
}
```

Update the `sub` prop to drop the NDA-flavored "Cases you can verify on Google and email the client about" tail? Re-read the user's instruction: only the headline must be reframed, but keeping NDA-adjacent framing in the sub contradicts the spirit of the change. Trim it:

```tsx
sub='Every case is a full breakdown with "before / after" and metrics. ×3.2 inquiries, $4M raised, 24 leads/mo.'
```

(Drops "Cases you can verify on Google and email the client about." — that's the NDA-adjacent half. If you want to keep it, leave the original `sub` untouched and only update the headline.)

- [ ] **Step 4: Clean up EN metadata strings**

`metadata.title` (`page.tsx:17`) and `openGraph.title` (`page.tsx:29`) both read `"Portfolio — 8 public cases, more under NDA | Code-Site.Art"`. Replace both with:

```ts
title: "Portfolio — real projects with real metrics | Code-Site.Art",
```

`metadata.description` (`page.tsx:19-20`) opens with `"Real projects with real numbers. ×3.2 inquiries, $4M raised, 24 leads/mo. Cases you can check in Google and ask the client about."`. The tail half implies NDA. Trim it:

```ts
description:
  "Real projects with real numbers. ×3.2 inquiries, $4M raised, 24 leads/mo.",
```

Apply the same edit to `openGraph.description` (`page.tsx:31-32`) — it already matches the trimmed form.

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Expected: clean. Drop any unused imports flagged.

- [ ] **Step 6: Visual check**

Run dev server, open `/en/portfolio`. Confirm:
- Cards match the homepage cases block (image, chips, name, meta, metrics).
- Hero reads "N real cases. The numbers are real." where N is the count.
- Sub does not mention "verify on Google" / NDA.
- Page `<title>` (browser tab) does not mention NDA. Inspect via devtools or the preview tool.

- [ ] **Step 7: Commit**

```bash
git add src/app/en/portfolio/page.tsx
git commit -m "feat(portfolio/en): use RelatedCard; reframe hero+metadata, drop NDA copy"
```

---

## Task 8: Final verification across both portfolios and home

Catch regressions one more time before closing out.

- [ ] **Step 1: Full build**

Run: `npm run lint && npm run build`
Expected: clean exit. Build output should mention `/portfolio`, `/en/portfolio`, `/`, and case detail routes.

- [ ] **Step 2: Manual smoke test in dev**

Run: `npm run dev`. Walk through:
1. `/` — header logo renders (animated); CASES section unchanged; "See all work" CTA goes to `/portfolio`.
2. `/portfolio` — same header logo; UA hero shows dynamic count "N реальних кейсів…"; cards match home design.
3. `/en/portfolio` — same header logo; EN hero shows "N real cases. The numbers are real."; cards match.
4. Burger menu on each page → drawer header shows SVG logo; tap closes drawer + navigates home.
5. Click into a case (e.g. `/portfolio/efedra-clinic`) — case page still renders; "Related cases" block below still uses its own RelatedCard rendering (untouched by this plan).

- [ ] **Step 3: No-op CSS audit**

Quick grep for orphan references:

```bash
git grep -n "hp-header-brand em"           # should be 0 hits if you cleaned css in Task 3
git grep -n "code-site\.art" -- src/        # confirm no stray text wordmark JSX
git grep -nE "under NDA|public cases"      # should be 0 hits in src/
```

If any of these surface unexpected results, fix or note as follow-up.

---

## Self-Review

**Spec coverage:**
- Replace current header logo with the imported SVG logo, on both desktop and mobile → Tasks 2–4.
- Move/rename the component → Task 2 (`components/icons/logo/` → `components/layout/logo/`, kebab-case filenames).
- Align portfolio card design with homepage cases block → Tasks 5–7 (extract mapper, use `RelatedCard` on both portfolio pages).
- Reframe portfolio title: drop NDA, use Sanity case count, preserve "numbers are real" intent → Tasks 6 (UA) & 7 (EN).
- "Use total count of cases in sanity cms" → `cases.length` reads directly from `fetchCaseStudies()` which already exists.

**Placeholder scan:** No "TBD", no "add appropriate error handling", no "similar to Task N". Every code change shows the actual replacement.

**Type consistency:** `caseRefToCardItem` returns `CaseCardItem`; both portfolio pages destructure the same fields (`chips`, `name`, `metrics`, `coverImage`, `coverImageAlt`, `gradient`, `href`). `RelatedCard` props (`metrics: string[]`, `coverImage?: { src; alt }`, `gradient?: string`, `href: string | null`) match those fields exactly.

**Known gap to flag:** The CSS cleanup in Task 3 Step 3 is marked optional. If skipped, the `.hp-header-brand` font rules become dead code but cause no visual issue — flag as follow-up rather than block the plan.
