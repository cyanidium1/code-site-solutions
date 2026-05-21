# Launch-CTA Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current bottom CTA pairing (`FinalCta3` + `Newsletter`) on the homepage and the three `vs-*` comparison pages with a single new "Launch-CTA" block — a two-column section with a heading, supporting paragraph, and a single CTA button (no email form) on the left, and an oversized device-mockup image on the right that overflows the container into the right gutter. UA + EN parity throughout.

**Architecture:**
- New reusable block lives in `src/components/blocks/launch-cta/` (component + CSS), matching the folder pattern used by `case`, `comparison`, `cta-banner`, `hero`, etc. It does NOT live under `homepage/` because it is shared across multiple pages.
- The block is fully self-translated: it consumes a `LaunchCta` namespace via `next-intl`'s `useTranslations` (same pattern as `Newsletter`). The button `href` is computed with `localizePath("/contacts", locale === "en")` so UA renders `/contacts` and EN renders `/en/contacts`.
- The hero device image (`public/Frame 1321315552.webp`) is renamed and moved to `public/home/launch-cta-devices.webp` to fit the existing `public/home/` convention.
- The `Newsletter` component, its i18n keys, and its CSS stay untouched — it remains in use on pricing, portfolio, about, case, legal, and other pages.
- `FinalCta3` itself is NOT deleted — it's still imported by `case-page`, `legal-stub`, `about`, `pricing`, `portfolio` (UA + EN), and `portfolio/_*` story pages. Only its usages on the homepage and `vs-*` pages are removed.
- Image-overflow trick: section uses `overflow: hidden` so the image is allowed to extend past the inner container on the right; the image is positioned with `left: calc(50% - 40px)` so its left edge sits 40px left of section centre and it then flows off the right edge. At narrow widths the layout collapses to a stacked single column where the image is constrained to `max-width: 100%`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5.9, Tailwind v4 (only used here for shared tokens via CSS vars), plain CSS in `src/components/blocks/launch-cta/launch-cta.css`, `next-intl` for messages, `next/image` for the mockup. No tests exist on adjacent components — verification is `npm run typecheck`, `npm run lint`, and a browser preview check at 1920 / 1440 / 1100 / 768 / 390 widths in both locales.

---

## Files Touched

**New:**
- `src/components/blocks/launch-cta/index.tsx` — `LaunchCta` component.
- `src/components/blocks/launch-cta/launch-cta.css` — block styles.
- `public/home/launch-cta-devices.webp` — renamed/moved device mockup.

**Modified:**
- `messages/uk.json` — add `LaunchCta` namespace.
- `messages/en.json` — add `LaunchCta` namespace.
- `src/app/page.tsx` — swap final blocks.
- `src/app/en/page.tsx` — swap final blocks.
- `src/components/vs-wordpress/index.tsx` — swap final blocks (file is shared by UA + EN routes).
- `src/components/vs-freelancers/index.tsx` — swap final blocks.
- `src/components/vs-constructors/index.tsx` — swap final blocks.

**Deleted:**
- `public/Frame 1321315552.webp` — moved (rename).

---

## Task 1: Move and rename the device-mockup asset

**Files:**
- Delete: `public/Frame 1321315552.webp`
- Create: `public/home/launch-cta-devices.webp`

- [ ] **Step 1: Move the file (single git-friendly rename)**

Run (from `Frontend/`):

```powershell
Move-Item "public/Frame 1321315552.webp" "public/home/launch-cta-devices.webp"
```

Expected: file appears at the new path, original path no longer exists.

- [ ] **Step 2: Confirm no other code references the old name**

Use Grep tool with pattern `Frame 1321315552` across `src/`.
Expected: zero matches. If anything matches, fix it before continuing.

- [ ] **Step 3: Commit**

```bash
git add public/home/launch-cta-devices.webp public/Frame\ 1321315552.webp
git commit -m "chore(assets): move launch-cta device mockup into public/home/"
```

---

## Task 2: Add `LaunchCta` i18n strings

**Files:**
- Modify: `messages/uk.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add the UA namespace**

Insert into `messages/uk.json` immediately after the closing brace of the existing `"Newsletter"` block (preserve JSON validity — keep the comma):

```json
  "LaunchCta": {
    "heading": "Запустимо сайт, який працює на бізнес",
    "sub": "Отримайте консультацію та розберемо ваш проєкт: структура, функціонал, терміни та бюджет. Пояснимо, що дійсно потрібно, а на чому не варто зливати гроші.",
    "button": "Звʼязатися з нами",
    "imageAlt": "Макет сайту на ноутбуці та смартфоні"
  },
```

- [ ] **Step 2: Add the EN namespace**

Insert into `messages/en.json` in the same position:

```json
  "LaunchCta": {
    "heading": "Let's launch a website that works for your business",
    "sub": "Book a consultation and we'll go through your project: structure, functionality, timeline, and budget. We'll explain what you actually need — and where it's not worth spending money.",
    "button": "Get in touch",
    "imageAlt": "Website mockup on a laptop and smartphone"
  },
```

- [ ] **Step 3: Validate JSON**

Run:

```powershell
node -e "JSON.parse(require('fs').readFileSync('messages/uk.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('ok')"
```

Expected: prints `ok`. Any SyntaxError means a trailing-comma or quote mistake — fix and rerun.

- [ ] **Step 4: Commit**

```bash
git add messages/uk.json messages/en.json
git commit -m "i18n: add LaunchCta strings for UA + EN"
```

---

## Task 3: Create the `LaunchCta` component

**Files:**
- Create: `src/components/blocks/launch-cta/index.tsx`
- Create: `src/components/blocks/launch-cta/launch-cta.css`

- [ ] **Step 1: Create the CSS**

Write `src/components/blocks/launch-cta/launch-cta.css`:

```css
/* Launch-CTA block — bottom-of-page consultation CTA with overflowing device image.
   Design source: 1920px wide. Image left edge sits at calc(50% - 40px) of the
   inner container; section uses overflow: hidden so the image flows off the
   right edge into the gutter. */

.lcta-section {
  position: relative;
  padding: var(--section-y) var(--gutter-x);
  background: var(--bg);
  overflow: hidden;
}

.lcta-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  position: relative;
  min-height: 480px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 32px;
}

.lcta-content {
  position: relative;
  z-index: 2;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.lcta-heading {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: clamp(32px, 3.4vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--ink);
  text-transform: uppercase;
  text-wrap: balance;
}

.lcta-sub {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-2);
  max-width: 46ch;
}

.lcta-button {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%);
  color: #fff;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 30px oklch(from var(--accent) l c h / 0.25);
}
.lcta-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 36px oklch(from var(--accent) l c h / 0.35);
}
.lcta-button:focus-visible {
  outline: 2px solid var(--accent-soft);
  outline-offset: 3px;
}

/* Image: positioned absolutely so it can overflow the inner container.
   Left edge at 50% - 40px of inner container, width grows until it hits the
   right viewport edge; we cap it with a max-width so it never gets absurd. */
.lcta-image-wrap {
  position: absolute;
  top: 50%;
  left: calc(50% - 40px);
  transform: translateY(-50%);
  width: calc(50% + 40px + var(--gutter-x));
  max-width: 1120px;
  pointer-events: none;
}
.lcta-image-wrap img {
  width: 100%;
  height: auto;
  display: block;
}

/* ── Tablet / narrow desktop: pull image fully into container, allow shorter heading column. */
@media (max-width: 1280px) {
  .lcta-inner {
    min-height: 420px;
  }
  .lcta-image-wrap {
    left: calc(50% - 24px);
    width: calc(50% + 24px + var(--gutter-x));
  }
}

/* ── Stacked layout below 1024px: text above, image below in flow. */
@media (max-width: 1024px) {
  .lcta-inner {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    gap: 40px;
  }
  .lcta-content {
    max-width: none;
  }
  .lcta-image-wrap {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* ── Mobile tightening. */
@media (max-width: 700px) {
  .lcta-content {
    gap: 18px;
  }
  .lcta-heading {
    font-size: clamp(26px, 7vw, 36px);
  }
  .lcta-sub {
    font-size: 13.5px;
  }
  .lcta-button {
    padding: 12px 22px;
    font-size: 13px;
  }
}
```

- [ ] **Step 2: Create the component**

Write `src/components/blocks/launch-cta/index.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { localizePath } from "@/lib/i18n-routes";
import "./launch-cta.css";

export function LaunchCta({ locale = "uk" }: { locale?: "uk" | "en" } = {}) {
  const t = useTranslations("LaunchCta");
  const href = localizePath("/contacts", locale === "en");

  return (
    <section className="lcta-section" aria-labelledby="launch-cta-heading">
      <div className="lcta-inner">
        <div className="lcta-content">
          <h2 id="launch-cta-heading" className="lcta-heading">
            {t("heading")}
          </h2>
          <p className="lcta-sub">{t("sub")}</p>
          <Link href={href} className="lcta-button">
            {t("button")}
          </Link>
        </div>
        <div className="lcta-image-wrap" aria-hidden="false">
          <Image
            src="/home/launch-cta-devices.webp"
            alt={t("imageAlt")}
            width={1119}
            height={549}
            sizes="(max-width: 1024px) 90vw, 60vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify `localizePath` import path is correct**

Use Grep tool with pattern `^export.*localizePath` in `src/lib/i18n-routes.ts` (or `.tsx`).
Expected: a named export `localizePath` exists. If not, find the actual export and fix the import.

- [ ] **Step 4: Typecheck**

Run:

```powershell
npm run typecheck
```

Expected: passes with no errors related to `launch-cta`.

- [ ] **Step 5: Commit**

```bash
git add src/components/blocks/launch-cta
git commit -m "feat(blocks): add LaunchCta block for bottom-of-page consultation CTA"
```

---

## Task 4: Wire `LaunchCta` into the UA homepage

**Files:**
- Modify: `src/app/page.tsx:14-15` (imports), `src/app/page.tsx:283-292` (usage).

- [ ] **Step 1: Update imports**

Find the import block that currently imports `FinalCta3` and `Newsletter` from `@/components/homepage`. Remove both names from that import (the remaining named imports stay).

Then add a new import directly underneath:

```tsx
import { LaunchCta } from "@/components/blocks/launch-cta";
```

- [ ] **Step 2: Replace the JSX usage**

Locate this block around `src/app/page.tsx:283-292`:

```tsx
<FinalCta3
  urgency={
    <>
      Найближчий старт — <strong>через 2 тижні</strong>. На цей квартал
      лишилося <strong>2 з 4 слотів</strong>. Відповідаємо на заявку за
      4 робочі години.
    </>
  }
/>
<Newsletter />
```

Replace with:

```tsx
<LaunchCta locale="uk" />
```

- [ ] **Step 3: Typecheck + lint**

Run:

```powershell
npm run typecheck
npm run lint
```

Expected: both pass. Any "unused import" errors mean a leftover `FinalCta3` / `Newsletter` reference — remove it.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): replace FinalCta3 + Newsletter with LaunchCta on UA homepage"
```

---

## Task 5: Wire `LaunchCta` into the EN homepage

**Files:**
- Modify: `src/app/en/page.tsx:42-43` (imports), `src/app/en/page.tsx:518-528` (usage).

- [ ] **Step 1: Update imports**

Remove `FinalCta3` and `Newsletter` from the `@/components/homepage` import block. Add:

```tsx
import { LaunchCta } from "@/components/blocks/launch-cta";
```

- [ ] **Step 2: Replace the JSX usage**

Locate this block around `src/app/en/page.tsx:518-528`:

```tsx
<FinalCta3
  eyebrow="GET IN TOUCH"
  heading={
    <>
      Ready to <em>discuss your project?</em>
    </>
  }
  sub="Free 30-minute consult. No commitment. We'll know in 15 minutes if we're a fit."
  cards={EN_FINAL_CTA}
/>
<Newsletter />
```

Replace with:

```tsx
<LaunchCta locale="en" />
```

- [ ] **Step 3: Check if `EN_FINAL_CTA` is now unused**

Use Grep tool with pattern `EN_FINAL_CTA` in `src/app/en/page.tsx`.
Expected: only the definition remains. If so, delete the `EN_FINAL_CTA` constant declaration to silence the unused-variable lint error.

- [ ] **Step 4: Typecheck + lint**

Run:

```powershell
npm run typecheck
npm run lint
```

Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/app/en/page.tsx
git commit -m "feat(home): replace FinalCta3 + Newsletter with LaunchCta on EN homepage"
```

---

## Task 6: Swap final blocks on the `vs-wordpress` page

**Files:**
- Modify: `src/components/vs-wordpress/index.tsx:16` (import), `src/components/vs-wordpress/index.tsx:1693-1701` (usage).

`vs-wordpress` is a single component file consumed by both `/vs-wordpress` (UA) and `/en/vs-wordpress` routes. The current code receives a `locale` (or equivalent) through `c` (content object). We need to pick the locale string the new block expects.

- [ ] **Step 1: Confirm how locale is available in this component**

Read `src/components/vs-wordpress/index.tsx` lines 1–60 and locate where the locale flows in (e.g., via the `c` content object, via a `locale` prop, or via `getVsWordpressContent` return shape).

Expected outcome: you can answer "the locale value inside the render is `<X>`" where `<X>` is either a prop, a field on `c`, or derived from `c.locale`.

If the locale is not directly available, derive it: in `getVsWordpressContent(loc)` the argument is `"uk" | "en"` — pass that through as `c.locale` if it isn't already.

- [ ] **Step 2: Update imports**

Change line 16 from:

```tsx
import { HpHeader, Newsletter, HpFooter, FinalCta3 } from "@/components/homepage";
```

to:

```tsx
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
```

- [ ] **Step 3: Replace the JSX usage**

Find the block at lines 1693–1701:

```tsx
{/* 10 — Final CTA */}
<FinalCta3
  eyebrow={c.cta.eyebrow}
  heading={c.cta.heading}
  sub={c.cta.sub}
  cards={c.cta.cards}
/>

<Newsletter />
```

Replace with:

```tsx
{/* 10 — Final CTA */}
<LaunchCta locale={c.locale} />
```

(Use the locale source you confirmed in Step 1. If it's a different variable, substitute it.)

- [ ] **Step 4: Check `c.cta` is now unused**

If the only consumer of `c.cta` (and any `EN_FINAL_CTA`-like helper feeding it) was the block you just removed, delete the now-unused fields from the content object to keep the file tidy. If `c.cta` is also used elsewhere in the file, leave it.

Use Grep tool with pattern `c\.cta` in `src/components/vs-wordpress/`.

- [ ] **Step 5: Typecheck + lint**

```powershell
npm run typecheck
npm run lint
```

Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/vs-wordpress/index.tsx
git commit -m "feat(vs-wordpress): replace FinalCta3 + Newsletter with LaunchCta"
```

---

## Task 7: Swap final blocks on the `vs-freelancers` page

**Files:**
- Modify: `src/components/vs-freelancers/index.tsx:33` (import), `src/components/vs-freelancers/index.tsx:1912-1919` (usage).

- [ ] **Step 1: Confirm locale source**

Same approach as Task 6 Step 1 — read the top of `src/components/vs-freelancers/index.tsx` and identify the locale variable in scope at line 1912.

- [ ] **Step 2: Update imports**

Change line 33 from:

```tsx
import { HpHeader, Newsletter, HpFooter, FinalCta3 } from "@/components/homepage";
```

to:

```tsx
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
```

- [ ] **Step 3: Replace the JSX usage**

Find the block around lines 1912–1919:

```tsx
<FinalCta3
  eyebrow={c.cta.eyebrow}
  heading={c.cta.heading}
  sub={c.cta.sub}
  cards={c.cta.cards}
/>

<Newsletter />
```

Replace with:

```tsx
<LaunchCta locale={c.locale} />
```

(Substitute the actual locale variable you identified.)

- [ ] **Step 4: Remove unused `c.cta` fields if applicable**

Same check as Task 6 Step 4.

- [ ] **Step 5: Typecheck + lint**

```powershell
npm run typecheck
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/components/vs-freelancers/index.tsx
git commit -m "feat(vs-freelancers): replace FinalCta3 + Newsletter with LaunchCta"
```

---

## Task 8: Swap final blocks on the `vs-constructors` page

**Files:**
- Modify: `src/components/vs-constructors/index.tsx:21` (import), `src/components/vs-constructors/index.tsx:1737-1744` (usage).

- [ ] **Step 1: Confirm locale source**

Same as Task 6 Step 1.

- [ ] **Step 2: Update imports**

Change line 21 from:

```tsx
import { HpHeader, Newsletter, HpFooter, FinalCta3 } from "@/components/homepage";
```

to:

```tsx
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
```

- [ ] **Step 3: Replace the JSX usage**

Find the block around lines 1737–1744:

```tsx
<FinalCta3
  eyebrow={c.cta.eyebrow}
  heading={c.cta.heading}
  sub={c.cta.sub}
  cards={c.cta.cards}
/>

<Newsletter />
```

Replace with:

```tsx
<LaunchCta locale={c.locale} />
```

- [ ] **Step 4: Remove unused `c.cta` fields if applicable**

Same check as Task 6 Step 4.

- [ ] **Step 5: Typecheck + lint**

```powershell
npm run typecheck
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/components/vs-constructors/index.tsx
git commit -m "feat(vs-constructors): replace FinalCta3 + Newsletter with LaunchCta"
```

---

## Task 9: Browser verification (preview tools)

Use the `preview_*` MCP tools, not the Bash dev-server flow.

**Pages to visit:**
- `/` (UA homepage)
- `/en` (EN homepage)
- `/vs-wordpress` and `/en/vs-wordpress`
- `/vs-freelancers` and `/en/vs-freelancers`
- `/vs-constructors` and `/en/vs-constructors`

**Viewports to test at each page:**
- 1920 × 1080 (design target)
- 1440 × 900 (default container)
- 1100 × 800 (just above stack breakpoint)
- 768 × 1024 (stacked layout)
- 390 × 844 (mobile)

- [ ] **Step 1: Start the dev server**

Use `preview_start` (do NOT use Bash for this).

- [ ] **Step 2: For each page, at each viewport, verify**

For each combo:

1. `preview_resize` to the target viewport.
2. `preview_snapshot` and confirm:
   - Heading text matches the locale's `LaunchCta.heading`.
   - Sub-paragraph text matches `LaunchCta.sub`.
   - Button text matches `LaunchCta.button` and the button link is `/contacts` (UA) or `/en/contacts` (EN).
   - No FinalCta3 cards ("Open Calendly", "Open form", "Write @fedirdev") are present below the FAQ.
   - No Newsletter "Subscribe" form is present below.
3. `preview_screenshot` and visually check:
   - Image overflows the inner container on the right at 1920 / 1440 widths.
   - Image stacks below the text at 1024 and narrower.
   - Image is never clipped on top/bottom.
4. `preview_console_logs` and `preview_network` — confirm no 404 for `/home/launch-cta-devices.webp` and no console errors related to the block.

- [ ] **Step 3: Capture proof for the user**

Save one `preview_screenshot` per locale at 1920 × 1080 and one at 390 × 844 (4 total), and reference them in the final summary.

- [ ] **Step 4: Stop the dev server**

`preview_stop`.

---

## Task 10: Final sweep and commit any cleanup

- [ ] **Step 1: Hunt leftover references**

Use Grep tool from `Frontend/`:

- Pattern `Frame 1321315552` — expect 0 matches.
- Pattern `FinalCta3` in `src/app/page.tsx`, `src/app/en/page.tsx`, `src/components/vs-wordpress/`, `src/components/vs-freelancers/`, `src/components/vs-constructors/` — expect 0 matches in each.
- Pattern `Newsletter` in the same five files — expect 0 matches in each (Newsletter remains used in pricing/about/portfolio/case/legal and those should still match — that's correct).

- [ ] **Step 2: Final typecheck + lint + build**

```powershell
npm run typecheck
npm run lint
npm run build
```

Expected: all three pass. If `next build` fails on a Server Component issue with `useTranslations`, switch the `LaunchCta` component to take pre-resolved string props from the caller (heading/sub/button/imageAlt/href) and have each consuming page pass them via `useTranslations` in the parent. This is a known next-intl pitfall but should work in the current setup because adjacent components (Newsletter) already use `useTranslations` directly.

- [ ] **Step 3: If any cleanup was needed, commit**

```bash
git add -A
git commit -m "chore(cleanup): tidy stale imports after LaunchCta rollout"
```

(If no cleanup was needed, skip this commit.)

---

## Self-review checklist

- ✅ FinalCta3 + Newsletter removed from: UA home, EN home, vs-wordpress, vs-freelancers, vs-constructors. (Tasks 4–8.)
- ✅ LaunchCta added at the same insertion points. (Tasks 4–8.)
- ✅ Newsletter component, CSS, and i18n keys untouched (still used on pricing/about/portfolio/case/legal). (Task 3 — no `Newsletter` modification; Tasks 6–8 — only the local usage is removed.)
- ✅ FinalCta3 component untouched (still used on case-page, legal-stub, about, pricing, portfolio). (Task 3 — no FinalCta3 modification.)
- ✅ Image renamed + moved to `public/home/launch-cta-devices.webp`. (Task 1.)
- ✅ Locale-aware button: `localizePath("/contacts", locale === "en")`. (Task 3 Step 2.)
- ✅ Translations added for both locales with verbatim copy from the brief. (Task 2.)
- ✅ Responsive: 1920 design honoured; image overflows at desktop, stacks below 1024px. (Task 3 Step 1 CSS.)
- ✅ Image position spec ("left edge at 50% − 40px"): encoded as `left: calc(50% - 40px)`. (Task 3 Step 1 CSS, `.lcta-image-wrap`.)
- ✅ No email form on the new block. (Task 3 Step 2 — only a `Link` button, no `form`/`input`.)
- ✅ Verification step uses preview tools, not Bash. (Task 9.)
