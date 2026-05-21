# Homepage Pricing + Hero + Swiper Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update homepage pricing to a new 3-tier system (Landing $800+ / Corporate Website $3,500+ / Custom Platform $6,000+), update 4 industry prices, restructure the testimonial slider to a centered-quote layout with decorative mockups, swap the hero image, and clean Ukrainian leaks from the `/en` homepage. Both `/` (UA) and `/en` (EN) must stay in sync.

**Architecture:**
- A new `src/lib/pricing/tiers.ts` module centralizes tier names + amounts so they're set in one place and consumed by the Bento "Pricing in the brief" visual, the Pricing section cards, the Pricing section heading, and the FAQ. Locale-formatted strings come from `formatPrice()` (already exists).
- Industry tile prices remain inline literals (one place per locale — no shared constants needed for 8 entries).
- PullQuoteSwiper restructure is CSS-only: the existing slide JSX (`hp-pqs-mockup--left` / `hp-pqs-body` / `hp-pqs-mockup--right` siblings) gets repositioned via `position: absolute` on the mockups, with the body element centered in the grid.
- Hero image swap is a `public/` asset drop + `deviceMockupSrc` prop change + a few floating-pill class repositions in `hero.css`.
- Ukrainian-leak audit is a ripgrep pass plus targeted manual reads — any Cyrillic in components rendered on `/en` is a bug.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5.9, Tailwind v4, next-intl, plain CSS modules under `src/components/**/*.css`, Swiper (testimonial slider). No tests currently exist on these components — verification is via `npm run typecheck`, `npm run lint`, and visual check against the live URL at the listed viewports.

---

## Files Touched

**New:**
- `src/lib/pricing/tiers.ts` — single source of truth for tier names + amounts.
- `public/hero/hero-mockup.webp` — new hero asset (you drop the file; plan only references the path).

**Modified:**
- `src/components/homepage/index.tsx` — `PriceTableVisual` (Bento "Pricing in the brief" visual), `DEFAULT_BENTO`.
- `src/app/page.tsx` — `HOMEPAGE_TIERS` (rename + reprice), `HOMEPAGE_FAQ` (price + name updates), pricing-section heading, hero `deviceMockupSrc`.
- `src/app/en/page.tsx` — `EN_INDUSTRIES` (4 price changes), `EN_TIERS` (rename + reprice), pricing-section heading, hero `deviceMockupSrc`, any Cyrillic-leak fixes found in step Audit-1.
- `src/components/homepage/index.tsx` — `DEFAULT_INDUSTRIES` (4 price changes in UA).
- `src/components/homepage/pull-quote-swiper/pull-quote-swiper.css` — full layout rewrite.
- `src/components/blocks/hero/hero.css` — `.device-tag-1/2/3` repositioning to match new mockup.

**Read-only / reference (no edits):**
- `src/lib/formatters/price.ts` — `formatPrice()` is the canonical formatter; do not duplicate its logic.
- `src/components/blocks/comparison/index.tsx` — `Tier` component shape (used to know what props to set in `EN_TIERS` / `HOMEPAGE_TIERS`).
- `src/components/blocks/final.tsx` — `FAQ` component shape (we're only editing its data, not the component).

---

## Phase 0 — Worktree + Branch Setup

### Task 0: Create isolated worktree

**Files:** none yet.

- [ ] **Step 1: Use the using-git-worktrees skill to create an isolated worktree off `master`.**

The skill will pick the worktree path and branch name. Expected branch name: `feat/homepage-pricing-hero-update` (or whatever the skill chooses).

- [ ] **Step 2: Verify clean working tree.**

Run: `git status`
Expected: `nothing to commit, working tree clean` (or only the worktree creation noise).

---

## Phase 1 — Centralize Tier Data

### Task 1: Add `src/lib/pricing/tiers.ts`

**Files:**
- Create: `src/lib/pricing/tiers.ts`

- [ ] **Step 1: Write the module.**

```ts
/**
 * Canonical tier definitions for the homepage Pricing section, the
 * "Pricing in the brief" Bento visual, and the FAQ. Update prices here
 * and they propagate everywhere automatically.
 *
 * Amounts are in USD (whole dollars). Names are i18n-keyed: callers
 * read `name[locale]` to render the correct string.
 */

import type { PriceLocale } from "@/lib/formatters/price";

export type TierKey = "landing" | "corporate" | "custom";

export const TIER_AMOUNTS: Record<TierKey, number> = {
  landing: 800,
  corporate: 3500,
  custom: 6000,
};

export const TIER_NAMES: Record<TierKey, Record<PriceLocale, string>> = {
  landing: { uk: "Лендінг", en: "Landing" },
  corporate: { uk: "Корпоративний сайт", en: "Corporate Website" },
  custom: { uk: "Кастомна платформа", en: "Custom Platform" },
};

export const TIER_WEEKS: Record<TierKey, Record<PriceLocale, string>> = {
  landing: { uk: "1-2 тижні", en: "1–2 weeks" },
  corporate: { uk: "4-8 тижнів", en: "4–8 weeks" },
  custom: { uk: "8-16 тижнів", en: "8–16 weeks" },
};

export const TIER_ORDER: TierKey[] = ["landing", "corporate", "custom"];
```

- [ ] **Step 2: Verify TS compiles.**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit.**

```bash
git add src/lib/pricing/tiers.ts
git commit -m "feat(pricing): centralize tier names/amounts/weeks per locale"
```

---

## Phase 2 — Industries Grid Price Updates

The four prices the user specified change. The other four (medicine, renovation, legal, finance) stay unchanged per clarification.

### Task 2: Update EN industries

**Files:**
- Modify: `src/app/en/page.tsx` lines 76–152 (the `EN_INDUSTRIES` const)

- [ ] **Step 1: Update E-commerce (lines 114–122).** Change `price: "From $5,000 · 6–10 weeks"` to `price: "From $3,000 · 6–10 weeks"`. Leave description and tags unchanged.

- [ ] **Step 2: Update Auto industry (lines 123–132).** Change `price: "From $5,000 · 6–10 weeks"` to `price: "From $3,000 · 6–10 weeks"`.

- [ ] **Step 3: Update Real Estate (lines 133–142).** Change `price: "From $5,000 · 6–10 weeks"` to `price: "From $4,000 · 6–10 weeks"`.

- [ ] **Step 4: Update Courses & Landings (lines 143–151).** Change `price: "From $3,500 · 4–8 weeks"` to `price: "From $800 · 4–8 weeks"`.

- [ ] **Step 5: Verify file diff matches the 4 changes above; no other lines moved.**

Run: `git diff src/app/en/page.tsx`
Expected: 4 hunks, each a single-line price change.

### Task 3: Update UA industries

**Files:**
- Modify: `src/components/homepage/index.tsx` — locate the `DEFAULT_INDUSTRIES` const (was reported around lines 133–206 by the explorer; verify before editing).

- [ ] **Step 1: Open the file and grep for the const.**

Run: `Grep "DEFAULT_INDUSTRIES" src/components/homepage/index.tsx`
Read the surrounding ~80 lines.

- [ ] **Step 2: Apply 4 price changes (Ukrainian formatting — NBSP thousands separator).**

| Industry | New `price` string |
|---|---|
| E-commerce | `"Від $3 000 · 6-10 тижнів"` |
| Авто-індустрія | `"Від $3 000 · 6-10 тижнів"` |
| Нерухомість | `"Від $4 000 · 6-10 тижнів"` |
| Курси і лендинги | `"Від $800 · 4-8 тижнів"` |

The space between `$` digits is **NBSP** (U+00A0), matching the `formatPrice("uk")` convention. Easiest way to insert NBSP in code: copy from an existing UA price string in the same file, or type ` ` in a TS string literal (no — string template won't render the escape; use the literal NBSP character via clipboard).

- [ ] **Step 3: Verify diff is 4 lines.**

Run: `git diff src/components/homepage/index.tsx`

- [ ] **Step 4: Commit.**

```bash
git add src/app/en/page.tsx src/components/homepage/index.tsx
git commit -m "feat(industries): reprice ecom/auto/realestate/courses on both locales"
```

---

## Phase 3 — Bento "Pricing in the Brief" Visual

The visual is `PriceTableVisual` in `src/components/homepage/index.tsx` ~lines 405–428. Currently hardcoded to `en` locale and three old amounts.

### Task 4: Make `PriceTableVisual` locale-aware + use the centralized tiers

**Files:**
- Modify: `src/components/homepage/index.tsx` (the `PriceTableVisual` function)
- Modify: `src/components/homepage/index.tsx` (the `BentoVisual` switch — pass `locale` through)
- Modify: `src/components/homepage/index.tsx` (the `Bento` component or its caller — accept/pass a `locale` prop)

- [ ] **Step 1: Add a `locale` prop to `Bento` if it doesn't already have one. Default to `"uk"`.**

Read: `src/components/homepage/index.tsx` around the `Bento` component export.

If the signature is currently `export function Bento({ eyebrow, heading, cells })`, change to:

```ts
export function Bento({
  eyebrow,
  heading,
  cells,
  locale = "uk",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  cells: BentoCell[];
  locale?: PriceLocale;
}) {
  // ...existing body, but pass `locale` into BentoVisual
}
```

Add this import at the top of the file if not present:

```ts
import type { PriceLocale } from "@/lib/formatters/price";
```

- [ ] **Step 2: Thread `locale` into `BentoVisual`.** Update the `switch` so `case "price":` returns `<PriceTableVisual locale={locale} />`. Other visual cases get the same prop only if they need it (most don't; `WarrantyTimelineVisual` and `SupportTimerVisual` use Cyrillic-only labels — see Phase 6 audit).

- [ ] **Step 3: Replace the `PriceTableVisual` body.**

```ts
import { TIER_AMOUNTS, TIER_NAMES, TIER_ORDER } from "@/lib/pricing/tiers";

function PriceTableVisual({ locale }: { locale: PriceLocale }) {
  // Trailing "+" is a "starting from" shorthand in this Bento visual.
  // formatPrice handles the locale-aware number; we append the suffix.
  const rows = TIER_ORDER.map((key) => ({
    name: TIER_NAMES[key][locale],
    price: `${formatPrice(TIER_AMOUNTS[key], { locale })}+`,
    accent: key === "corporate",
  }));
  return (
    <div className="hp-bento-vis hp-bento-price" aria-hidden="true">
      {rows.map((r) => (
        <div key={r.name} className="hp-bento-price-row">
          <span className="hp-bento-price-name">{r.name}</span>
          <span className="hp-bento-price-dots" />
          <span
            className={`hp-bento-price-num${r.accent ? " is-accent" : ""}`}
          >
            {r.price}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Pass `locale="en"` from `/en/page.tsx`.**

Modify `src/app/en/page.tsx` ~line 429 (`<Bento eyebrow=...`) to add `locale="en"`.

- [ ] **Step 5: Update the Bento card subtitle string for "Pricing in the brief".**

The `stat` value on both `EN_BENTO` (line 182 in `src/app/en/page.tsx`) and `DEFAULT_BENTO` (line 545 in `src/components/homepage/index.tsx`) currently shows `"$3.5K+"` / `"$3.5k+"`. The corporate tier is still $3,500 so this stat stays. **No change to `stat`.** Verify by reading both lines.

- [ ] **Step 6: Typecheck + lint.**

Run: `npm run typecheck && npm run lint`
Expected: zero errors. (Lint may report unused imports if the old hardcoded `formatPrice` call is no longer the only usage — check and adjust.)

- [ ] **Step 7: Commit.**

```bash
git add src/components/homepage/index.tsx src/app/en/page.tsx
git commit -m "feat(bento): locale-aware Pricing-in-brief visual, drives off TIER_AMOUNTS"
```

---

## Phase 4 — Pricing Section Tiers (Rename + Reprice)

### Task 5: Update `EN_TIERS`

**Files:**
- Modify: `src/app/en/page.tsx` lines 205–266

Per the clarification: rename + reprice in place, keep "best for" copy roughly the same. The `popularLabel`, `priceLabel`, `bestForLabel`, `includes.heading`, `includes.items`, and `ctaLabel` strings stay as-is.

- [ ] **Step 1: Replace `EN_TIERS` with the new shape.**

```ts
const EN_TIERS: TierProps[] = [
  {
    name: TIER_NAMES.landing.en,                       // "Landing"
    price: formatPrice(TIER_AMOUNTS.landing, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.landing.en,                      // "1–2 weeks"
    bestFor: "Fast launch of one offer, MVP, hypothesis testing.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Includes",
      items: [
        "Responsive build",
        "SEO-first structure",
        "Form integrations",
        "1-year warranty",
      ],
    },
    ctaLabel: "Choose Landing",
  },
  {
    popular: true,
    popularLabel: "★ MOST POPULAR",
    name: TIER_NAMES.corporate.en,                     // "Corporate Website"
    price: formatPrice(TIER_AMOUNTS.corporate, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.corporate.en,                    // "4–8 weeks"
    bestFor:
      "Businesses with compliance needs (healthcare, legal, accounting) that need industry-specific integrations.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Landing, plus",
      items: [
        "CMS, blog",
        "5+ integrations",
        "Local SEO",
        "Compliance: GDPR / HIPAA-ready",
        "EN + 1 extra language",
      ],
    },
    ctaLabel: "Choose Corporate",
  },
  {
    name: TIER_NAMES.custom.en,                        // "Custom Platform"
    price: formatPrice(TIER_AMOUNTS.custom, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.custom.en,                       // "8–16 weeks"
    bestFor:
      "Complex products with bespoke logic — SaaS, marketplace, B2B portal.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Corporate, plus",
      items: [
        "Architectural session",
        "Dedicated team",
        "SLA + 24/7 support",
        "Custom integrations",
      ],
    },
    ctaLabel: "Talk to us",
    ctaGhost: true,
  },
];
```

Add this import at the top of `src/app/en/page.tsx` if not present:

```ts
import { TIER_AMOUNTS, TIER_NAMES, TIER_WEEKS } from "@/lib/pricing/tiers";
```

- [ ] **Step 2: Update the pricing-section heading on `/en` (line ~479).**

Current:
```tsx
<h2 className="hp-h2">
  Transparent pricing — from <em>$1,000</em> to <em>$14,000+</em>
</h2>
```

New:
```tsx
<h2 className="hp-h2">
  Transparent pricing — from <em>$800</em> to <em>$6,000+</em>
</h2>
```

### Task 6: Update `HOMEPAGE_TIERS` (UA)

**Files:**
- Modify: `src/app/page.tsx` lines 22–78

- [ ] **Step 1: Replace `HOMEPAGE_TIERS` with the new shape.**

```ts
const HOMEPAGE_TIERS: TierProps[] = [
  {
    name: TIER_NAMES.landing.uk,                       // "Лендінг"
    price: formatPrice(TIER_AMOUNTS.landing, { locale: "uk" }),
    weeks: TIER_WEEKS.landing.uk,                      // "1-2 тижні"
    bestFor:
      "Швидкий запуск однієї пропозиції, MVP, тестування гіпотези.",
    includes: {
      heading: "Що входить",
      items: [
        "Адаптивна верстка",
        "SEO-структура",
        "Інтеграція форм",
        "Гарантія 1 рік",
      ],
    },
    ctaLabel: "Обрати Лендінг",
  },
  {
    popular: true,
    popularLabel: "★ НАЙПОПУЛЯРНІШЕ",
    name: TIER_NAMES.corporate.uk,                     // "Корпоративний сайт"
    price: formatPrice(TIER_AMOUNTS.corporate, { locale: "uk" }),
    weeks: TIER_WEEKS.corporate.uk,                    // "4-8 тижнів"
    bestFor:
      "Бізнесу з compliance вимогами (медицина, право, бухгалтерія), що потребує галузевих інтеграцій.",
    includes: {
      heading: "Все з Лендінгу +",
      items: [
        "CMS, блог",
        "5+ інтеграцій",
        "Локальне SEO",
        "Compliance: МОЗ / RODO / HIPAA-aware",
        "UA + RU",
      ],
    },
    ctaLabel: "Обрати Корпоративний",
  },
  {
    name: TIER_NAMES.custom.uk,                        // "Кастомна платформа"
    price: formatPrice(TIER_AMOUNTS.custom, { locale: "uk" }),
    weeks: TIER_WEEKS.custom.uk,                       // "8-16 тижнів"
    bestFor:
      "Складним продуктам із власною логікою — SaaS, маркетплейс, B2B-портал.",
    includes: {
      heading: "Все з Корпоративного +",
      items: [
        "Архітектурна сесія",
        "Dedicated team",
        "SLA + 24/7 support",
        "Custom integrations",
      ],
    },
    ctaLabel: "Зв'язатися",
    ctaGhost: true,
  },
];
```

Add import at the top of `src/app/page.tsx`:

```ts
import { TIER_AMOUNTS, TIER_NAMES, TIER_WEEKS } from "@/lib/pricing/tiers";
```

- [ ] **Step 2: Update the pricing-section heading on `/` (around line 257).**

Current:
```tsx
<h2 className="hp-h2">
  Прозорий прайс — від <em>$1 000</em> до <em>$14 000+</em>
</h2>
```

New (note NBSP between `$` and `800` is not needed since `800` is < 1000, but keep NBSP for `$6 000`):
```tsx
<h2 className="hp-h2">
  Прозорий прайс — від <em>$800</em> до <em>$6 000+</em>
</h2>
```

- [ ] **Step 3: Typecheck + lint.**

Run: `npm run typecheck && npm run lint`
Expected: zero errors.

- [ ] **Step 4: Commit.**

```bash
git add src/app/page.tsx src/app/en/page.tsx
git commit -m "feat(pricing): rename tiers (Landing/Corporate/Custom Platform) and reprice"
```

---

## Phase 5 — FAQ Updates (UA only)

The English homepage has no FAQ; the FAQ lives only on `/`. Update its 2 price-bearing answers.

### Task 7: Patch `HOMEPAGE_FAQ`

**Files:**
- Modify: `src/app/page.tsx` lines 80–153

- [ ] **Step 1: Update the first FAQ answer (lines 82–94 — "Скільки коштує мій сайт?").**

Replace the existing answer array with one that uses the centralized tier names and amounts:

```ts
{
  q: "Скільки коштує мій сайт?",
  a: [
    "Залежить від типу. ",
    { em: TIER_NAMES.landing.uk },             // "Лендінг"
    " — від ",
    { em: formatPrice(TIER_AMOUNTS.landing, { locale: "uk" }) },  // "$800"
    ". ",
    { em: TIER_NAMES.corporate.uk },           // "Корпоративний сайт"
    " (медицина, юристи, бухгалтерія, нерухомість і т.д.) — від ",
    { em: formatPrice(TIER_AMOUNTS.corporate, { locale: "uk" }) }, // "$3 500"
    ". ",
    { em: TIER_NAMES.custom.uk },              // "Кастомна платформа"
    " з нестандартною архітектурою — від ",
    { em: formatPrice(TIER_AMOUNTS.custom, { locale: "uk" }) },    // "$6 000"
    ". Точна цифра — у ",
    { link: { href: "/calculator", text: "калькуляторі" } },
    " або після 30-хв розмови.",
  ],
},
```

- [ ] **Step 2: Update the second FAQ answer (lines 95–106 — "Скільки часу від брифу до запуску?").**

Replace `{ em: "Лендінг" }` references etc. with the tier-name constants. Since the existing answer uses the bare strings "Лендінг", "Industry-сайт", "Custom", reword to use the new names:

```ts
{
  q: "Скільки часу від брифу до запуску?",
  a: [
    { em: TIER_NAMES.landing.uk },            // "Лендінг"
    " — ",
    { em: TIER_WEEKS.landing.uk },            // "1-2 тижні"
    ". ",
    { em: TIER_NAMES.corporate.uk },          // "Корпоративний сайт"
    " — ",
    { em: TIER_WEEKS.corporate.uk },          // "4-8 тижнів"
    ". ",
    { em: TIER_NAMES.custom.uk },             // "Кастомна платформа"
    " — ",
    { em: TIER_WEEKS.custom.uk },             // "8-16 тижнів"
    ". Це з усіма правками, контентом і SEO. Без сюрпризів — фіксована дата в договорі.",
  ],
},
```

- [ ] **Step 3: Update the FAQ item about scaling up from a landing (lines 138–144 — "Можна почати з лендінгу і пізніше дорости до повного сайту?").**

The answer text mentions "Landing" by name. Change `"Стартуєте з Landing — ..."` to `"Стартуєте з Лендінгу — ..."` so the user-facing copy matches the new tier name. Keep the rest of the answer.

- [ ] **Step 4: Scan the remaining 5 FAQ items for any other tier-name or price references; fix in place if found.** (Walkthrough only — based on the audit, the other 5 don't reference tier names or prices.)

- [ ] **Step 5: Typecheck.**

Run: `npm run typecheck`
Expected: zero errors.

- [ ] **Step 6: Commit.**

```bash
git add src/app/page.tsx
git commit -m "feat(faq): align FAQ price/name references with new tier system"
```

---

## Phase 6 — PullQuoteSwiper Layout Restructure

Per the chosen strategy: absolute-positioned mockups behind a centered quote. The slide JSX (one `<div class="hp-pqs-slide">` per slide containing 3 child elements) does not need to change — only the CSS that arranges the children.

### Task 8: Rewrite swiper CSS

**Files:**
- Modify: `src/components/homepage/pull-quote-swiper/pull-quote-swiper.css`

- [ ] **Step 1: Read the full current CSS file to confirm the class names + slide markup match the report.**

Read: `src/components/homepage/pull-quote-swiper/pull-quote-swiper.css` (whole file).
Read: `src/components/homepage/pull-quote-swiper/client.tsx` lines for the `<div className="hp-pqs-slide">` block — confirm the children classes are `hp-pqs-mockup hp-pqs-mockup--left`, `hp-pqs-body`, and `hp-pqs-mockup hp-pqs-mockup--right`.

- [ ] **Step 2: Replace the `.hp-pqs-slide` block, the two mockup blocks, and the responsive breakpoints with this layout:**

```css
/* Each slide is a centered quote with two absolutely-positioned
   decorative mockups behind it. Removes the squeeze-at-intermediate-
   widths bug from the old 3-column grid. */
.hp-pqs-slide {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
  padding: 48px 24px;
}

.hp-pqs-body {
  position: relative;
  z-index: 2;
  max-width: var(--container-prose);
  width: 100%;
  text-align: center;
  /* Solid-ish background so absolute mockups behind don't hurt readability */
  background: radial-gradient(
    ellipse at center,
    oklch(0.18 0.008 60 / 0.7) 0%,
    oklch(0.18 0.008 60 / 0) 70%
  );
  padding: 32px 16px;
}

.hp-pqs-mockup {
  position: absolute;
  z-index: 1;
  display: flex;
  filter: drop-shadow(0 30px 40px oklch(0 0 0 / 0.45));
  pointer-events: none;
}

.hp-pqs-mockup--left {
  bottom: 8%;
  left: 0;
  transform: translateX(-12%);
}
.hp-pqs-mockup--left img {
  max-width: 280px;
  width: 100%;
  height: auto;
}

.hp-pqs-mockup--right {
  bottom: 12%;
  right: 0;
  transform: translateX(12%);
}
.hp-pqs-mockup--right img {
  max-width: 380px;
  width: 100%;
  height: auto;
}

/* Tablet: shrink + pull mockups closer in so they don't cut off the viewport */
@media (max-width: 1100px) {
  .hp-pqs-slide { min-height: 440px; }
  .hp-pqs-mockup--left { transform: translateX(-4%); }
  .hp-pqs-mockup--left img { max-width: 220px; }
  .hp-pqs-mockup--right { transform: translateX(4%); }
  .hp-pqs-mockup--right img { max-width: 300px; }
}

/* Narrow tablet: hide both mockups; centered quote only */
@media (max-width: 900px) {
  .hp-pqs-mockup { display: none; }
  .hp-pqs-slide { min-height: 320px; padding: 32px 16px; }
}

/* Mobile: tighter spacing */
@media (max-width: 640px) {
  .hp-pqs-slide { min-height: 280px; padding: 24px 12px; }
  .hp-pqs-body { padding: 16px 8px; }
}
```

- [ ] **Step 3: Remove the old `.hp-pqs-slide { display: grid; ... }` and the old `@media (max-width: 700px) { ... grid-template-columns: 1fr ... display: none on --right }` blocks — they're fully replaced.**

Keep: the `.hp-pqs` container, `.hp-pqs-swiper`, `.hp-pqs-quote` typography, `.hp-pqs-quote em` accent, author block (`.hp-pqs-author`, etc.), and pagination/arrow styles. Don't touch those.

- [ ] **Step 4: Update the Next.js `<Image sizes>` props in `client.tsx` to match the new max-widths.**

Read: `src/components/homepage/pull-quote-swiper/client.tsx` — find the two `<Image>` components.

Phone mockup: `sizes="(max-width: 900px) 0px, (max-width: 1100px) 220px, 280px"` (0px below 900 since the image is `display: none`).
Laptop mockup: `sizes="(max-width: 900px) 0px, (max-width: 1100px) 300px, 380px"`.

- [ ] **Step 5: Boot the dev server and visually verify at the three viewport widths from the screenshots.**

Run: `npm run dev`
Open `http://localhost:3000/en` and resize the browser to:
- 1206 × 770 — both mockups visible, neither cropped at the section edge; quote centered.
- 870 × 770 — both mockups visible, smaller, tighter to the quote.
- 714 × 770 — mockups hidden, quote-only.

If any breakpoint still looks wrong, tweak the `max-width` thresholds in the CSS and re-check.

- [ ] **Step 6: Commit.**

```bash
git add src/components/homepage/pull-quote-swiper/pull-quote-swiper.css \
        src/components/homepage/pull-quote-swiper/client.tsx
git commit -m "feat(swiper): centered-quote layout with absolutely-positioned mockups"
```

---

## Phase 7 — Hero Image + Pill Positions

### Task 9: Add the new hero asset

**Files:**
- Create: `public/hero/hero-mockup.webp`

- [ ] **Step 1: Confirm the user has dropped the new image at `public/hero/hero-mockup.webp`.**

Run: `ls public/hero/`
Expected: `hero-mockup.webp` (or whatever the user chose — adjust subsequent steps to match the filename).

If missing: pause and ask the user to drop the asset before proceeding. Do not commit a placeholder.

- [ ] **Step 2: Verify the file is a reasonable size for hero use (under 400 KB ideally).**

Run: `ls -la public/hero/hero-mockup.webp`
Expected: file present, single-digit hundreds of KB.

### Task 10: Wire the new hero image into both pages

**Files:**
- Modify: `src/app/page.tsx` line 239 (`deviceMockupSrc`)
- Modify: `src/app/en/page.tsx` line 377 (`deviceMockupSrc`)

- [ ] **Step 1: Replace `deviceMockupSrc="/raw-design/assets/hero-devices.webp"` with `deviceMockupSrc="/hero/hero-mockup.webp"` on both files.**

- [ ] **Step 2: Visually verify the hero on `/` and `/en` at desktop (1440px+) and mobile (375px).**

Run: `npm run dev` (if not still running) and check both homepages.

### Task 11: Reposition floating pills

**Files:**
- Modify: `src/components/blocks/hero/hero.css`

The new image (per screenshot 4) has:
- A laptop centered/right with a "Finance League" website visible on it,
- A phone front-left foreground showing a colorful (Efedra/Tatarka) site,
- A monitor (small) back-left with the dark "Kondor" gaming PC site.

The pills should annotate the laptop (the most prominent device) without occluding the phone in the foreground. Target positions for the three `device-tag` pills:

- [ ] **Step 1: Replace the `.device-tag-1 / .device-tag-2 / .device-tag-3` rules with these positions:**

```css
/* Pill 1: "Custom code" — above the laptop, top-left of the device cluster */
.device-tag-1 { top: 4%;  left: 26%;  animation-delay: 0s; }

/* Pill 2: "TypeScript 5.7" — top-right of the laptop screen */
.device-tag-2 { top: 8%;  right: -2%; animation-delay: -2s; }

/* Pill 3: "Lighthouse 98" — bottom-right, below the laptop, clear of the phone */
.device-tag-3 { bottom: 6%; right: 4%; animation-delay: -4s; }
```

Rationale: pill 1 moves inward (was `left: -2%`) so it sits over the laptop's top-left corner instead of floating off the page. Pill 2 stays top-right of the laptop. Pill 3 moves up slightly (was `bottom: 18%`) so it sits below the laptop and to the right of the phone.

- [ ] **Step 2: Update the corresponding tablet/mobile breakpoints in the same file.**

Find the `@media (max-width: 1440px)` block that hides `.device-tag-2`. Verify it still hides `device-tag-2` (the right-edge pill is the most likely to crowd on narrow desktops). At `@media (max-width: 640px)` keep the rule that hides all pills.

- [ ] **Step 3: Visually verify at 1920px (desktop), 1206px (intermediate), and 640px (mobile).**

Open `/en` on the dev server, resize, confirm pills sit on the laptop without overlapping the phone in the foreground.

- [ ] **Step 4: Commit.**

```bash
git add public/hero/hero-mockup.webp \
        src/app/page.tsx src/app/en/page.tsx \
        src/components/blocks/hero/hero.css
git commit -m "feat(hero): new device-mockup image and repositioned floating pills"
```

---

## Phase 8 — Ukrainian-Leak Audit on `/en`

The user reports that `/en` shows mixed UA/EN text in places. Any Cyrillic character (Ukrainian alphabet: А–Я, а–я, plus Ї, ї, І, і, Є, є, Ґ, ґ) in a string that ends up on `/en` is the bug.

### Task 12: Grep for Cyrillic in EN render paths

**Files:** read-only audit step.

- [ ] **Step 1: Grep for Cyrillic in `src/app/en/**`.**

Run:
```
Grep "[А-Яа-яЇїІіЄєҐґ]" src/app/en --output_mode content
```
Expected: zero matches (these files should be pure EN strings).

Any match is a bug. Note the file + line.

- [ ] **Step 2: Grep for Cyrillic in components that render on `/en`.**

The components rendered on `/en` are (from `src/app/en/page.tsx`): `HpHeader`, `HeroEditorial`, `Marquee`, `TurnkeyList`, `Industries`, `Bento`, `Process`, `Cases`, `PullQuoteSwiper`, the inline `<section id="pricing">`, `Stack`, `FinalCta3`, `Newsletter`, `HpFooter`.

For each, the strings either come from props (controlled by `/en/page.tsx`) or are hardcoded inside the component. Hardcoded Cyrillic is a leak.

Run:
```
Grep "[А-Яа-яЇїІіЄєҐґ]" src/components --output_mode content -n
```

Filter the results: any file in this list is a candidate leak — `homepage/*`, `blocks/hero/*`, `blocks/comparison/*`, `blocks/turnkey-list/*`, `blocks/final.tsx`. Files specific to UA-only pages (e.g. `blocks/case-page/*` if they only render on `/portfolio/[slug]`) are not leaks.

- [ ] **Step 3: For each leak found, classify it.**

For each Cyrillic occurrence in a component rendered on `/en`, decide:
- **Hardcoded user-facing string** → must be made locale-aware. Add a `locale` prop or read the text from a translation file. Document the fix in a follow-up task.
- **Default value (`= "..."`) that `/en/page.tsx` overrides** → not a leak, but a footgun. Note for future cleanup; don't fix in this PR.
- **`aria-label` / decorative / dev-only** → real bug; fix.

Known suspects from the explorer report:
- `WarrantyTimelineVisual` and `SupportTimerVisual` in `src/components/homepage/index.tsx` use hardcoded Cyrillic labels ("Старт", "Запуск", "+1 рік", "Зрив дедлайну", "робочих годин SLA"). The Bento on `/en` uses `EN_BENTO` which has `"warranty"` and may have `"support"` visuals — confirm. If yes, these are leaks.

- [ ] **Step 4: Write a punch-list of leaks.**

Format the findings as:

| File | Line | Cyrillic string | Where it renders on /en | Fix |
|---|---|---|---|---|
| (e.g.) `src/components/homepage/index.tsx` | 432 | `"Старт"` | `WarrantyTimelineVisual`, used by Bento `warranty` cell on /en | Add `locale` prop; `points[].label = locale === "en" ? "Start" : "Старт"` |

Save the punch-list to `docs/superpowers/plans/audit-leaks.md` so the fixes can be scoped or split into a follow-up.

### Task 13: Fix audit findings

**Files:** depends on Task 12 output.

- [ ] **Step 1: For each leak in the punch-list, edit the component to accept a `locale` prop (or read locale-aware strings) and pass `locale="en"` from `/en/page.tsx`.** Default to UA so `/` keeps working without changes.

For the known `WarrantyTimelineVisual` and `SupportTimerVisual` cases, follow the pattern from Task 4 (locale prop threaded through `Bento` → `BentoVisual` → the specific visual). Concrete strings:

```ts
// WarrantyTimelineVisual
const points = locale === "en"
  ? [{ label: "Start" }, { label: "Launch", mid: true }, { label: "+1 year", end: true }]
  : [{ label: "Старт" }, { label: "Запуск", mid: true }, { label: "+1 рік", end: true }];
const footL = locale === "en" ? "Missed deadline" : "Зрив дедлайну";

// SupportTimerVisual
const sub = locale === "en" ? "business-hour SLA" : "робочих годин SLA";
```

- [ ] **Step 2: After fixes, re-run the grep from Step 1 of Task 12.**

Run: `Grep "[А-Яа-яЇїІіЄєҐґ]" src/components --output_mode content -n` again, then re-render `/en` mentally: any Cyrillic remaining in components rendered on `/en` is still a bug.

- [ ] **Step 3: Visual spot-check `/en` end-to-end.**

Run: `npm run dev` and load `http://localhost:3000/en`. Scroll the full page slowly. Eyeball every text element for Cyrillic. Areas most likely to leak:
- Bento visuals (warranty timeline, support timer, weeks progress)
- Pricing tier `popularLabel` / `ctaLabel` (if any default to UA)
- FinalCta3 default props
- Newsletter default props
- HpFooter

- [ ] **Step 4: Typecheck + lint.**

Run: `npm run typecheck && npm run lint`
Expected: zero errors.

- [ ] **Step 5: Commit.**

```bash
git add -A
git commit -m "fix(en): resolve Ukrainian text leaks in homepage components"
```

---

## Phase 9 — Final Verification + PR

### Task 14: Full verification

- [ ] **Step 1: Run all checks.**

```bash
npm run typecheck
npm run lint
npm run build
```

All three must succeed. Build is the most reliable end-to-end check (catches RSC-only errors that `next dev` masks).

- [ ] **Step 2: Boot prod build locally + walk both pages.**

```bash
npm run start
```

Open `http://localhost:3000/` (UA) — verify:
- Industries grid shows new prices for ecom ($3 000), auto ($3 000), real estate ($4 000), courses ($800); other 4 unchanged at $3 500.
- Pricing section: 3 cards titled "Лендінг" / "Корпоративний сайт" / "Кастомна платформа" at $800 / $3 500 / $6 000.
- Pricing-section heading: "Прозорий прайс — від $800 до $6 000+".
- Bento "Прозорий прайс" card visual lists Лендінг $800+, Корпоративний $3 500+, Кастомна $6 000+.
- FAQ Q1 answer references the new tier names + prices.
- Testimonial slider: centered quote, mockups bottom-left + bottom-right; resize to 870px (mockups closer in), 700px (mockups hidden), 375px (mockups hidden, tight quote).
- Hero shows the new mockup image; pills sit on the laptop without occluding the phone.

Open `http://localhost:3000/en` — verify the EN equivalents, and **scroll for any Cyrillic**.

- [ ] **Step 3: Commit any final touch-ups.**

If the visual review flags anything, fix and commit. Otherwise skip.

### Task 15: Open the PR

- [ ] **Step 1: Push the branch.**

```bash
git push -u origin feat/homepage-pricing-hero-update
```

- [ ] **Step 2: Open the PR with the gh CLI if available, otherwise instruct the user to open it via the GitHub UI.**

PR title: `feat(homepage): repriced tiers, restructured testimonial slider, new hero image`

PR body:

```markdown
## Summary

- New shared `src/lib/pricing/tiers.ts` drives tier names, amounts, and weeks across the Pricing section, the "Pricing in the brief" Bento visual, and the FAQ.
- Renamed + repriced tiers: Landing → $800+, Corporate Website → $3,500+, Custom Platform → $6,000+ (was $1,000 / $3,500 / $14,000, names Landing / Industry Pro / Custom).
- Industries grid: E-commerce $3,000, Auto $3,000, Real Estate $4,000, Courses & Landings $800. Other 4 unchanged.
- PullQuoteSwiper: layout restructured to centered quote with absolutely-positioned decorative mockups. Mockups hide below 900px; quote-only on tablet and mobile. Fixes the cropped-laptop and squeezed-column bugs at intermediate widths.
- Hero: new `public/hero/hero-mockup.webp` asset, floating pills repositioned over the laptop.
- Audit + fix: Ukrainian leaks in components rendered on `/en` (notably `WarrantyTimelineVisual`, `SupportTimerVisual`) are now locale-aware.

## Test plan

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `/` (UA) visually correct at 1920 / 1206 / 870 / 714 / 375
- [ ] `/en` visually correct at the same widths
- [ ] `/en` shows zero Cyrillic anywhere on the page
- [ ] FAQ on `/` Q1 + Q2 mention the new tier names and prices
```

---

## Self-Review

**1. Spec coverage:**
- PullQuoteSwiper better at multiple screen sizes → Phase 6 (Task 8). ✓
- Hero image + sizing + pill positions → Phase 7 (Tasks 9–11). ✓
- Recheck `/en` for UA leaks → Phase 8 (Tasks 12–13). ✓
- "Build your industry" prices: e-com $3,000, auto $3,000, real estate $4,000, courses & landings $800, both locales → Phase 2 (Tasks 2–3). ✓
- "Why us → pricing in the brief": Landing $800+, Corporate Website $3,500+, Custom Platform $6,000+ → Phase 1 (tiers module) + Phase 3 (Task 4). ✓
- Pricing section same names/prices as Why-us → Phase 4 (Tasks 5–6). ✓
- FAQ same names/prices → Phase 5 (Task 7). ✓
- All texts translated and formatted → Phase 1 establishes `TIER_NAMES` per locale; `formatPrice()` provides locale-aware formatting; Phase 5 covers UA FAQ; Phase 8 catches any remaining UA leaks on `/en`. ✓

**2. Placeholder scan:** No TBD / TODO / "add appropriate error handling" / "similar to Task N" entries. All code blocks are complete and inline.

**3. Type consistency:** `TIER_AMOUNTS`, `TIER_NAMES`, `TIER_WEEKS`, `TIER_ORDER`, `TierKey` are defined in Task 1 and consumed unchanged in Tasks 4, 5, 6, 7. `PriceLocale` is imported from the existing `src/lib/formatters/price.ts`. `Bento` gains an optional `locale?: PriceLocale` prop in Task 4 and the callers in Tasks 4 step 4 + Task 13 thread it through.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-21-homepage-pricing-and-hero-update.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
