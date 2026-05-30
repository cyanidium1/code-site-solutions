# Swiper Alignment + Locale-Switcher Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore correct pull-quote slider alignment on the home page and restore correct enable/disable behaviour of the locale-switcher across every route on the site.

**Architecture:**
- **Issue 1 (slider)** is a pure CSS cascade regression: the dynamically-imported `swiper/css` chunk now loads after `vendor.css`, so Swiper's base `.swiper { margin-left: auto }` rule wins over `.hp-pqs-swiper { margin-left: -50vw }`. Fix is to raise specificity on the breakout rule (compound selector `.swiper.hp-pqs-swiper`). If that fails for any reason we replace the negative-margin trick with a `transform: translateX` trick that touches a property Swiper's base CSS never sets.
- **Issue 2 (locale switch)** is split into two phases:
  - **Phase B (now):** the existing hardcoded slug sets in `src/constants/i18n-routes.ts` are stale. Audit the live content (Sanity + filesystem routes) and rewrite the constants so the enabled/disabled state is exactly correct for every page that ships today.
  - **Phase C (conditional, only if Phase B verifies clean):** replace the hardcoded sets with a Sanity-driven registry, fetched once per route group at the layout level and exposed to client components via React context. The path-based resolver keeps running client-side (so it reacts to client-side navigation correctly) but its slug sets come from the registry, not from hardcoded constants. No client-side Sanity fetches; no page-level prop threading; the footer's services dropdown and the header's services dropdown ride the same registry. Status of original C-1 (per-page prop threading) proposal: superseded — see Phase C feasibility note below.

**Tech Stack:** Next.js 15 App Router, React 19 client components, Tailwind v4 utilities, `vendor.css` for hand-authored overrides, Swiper React bindings, `next-intl` for locale state, Sanity for CMS data (`sanityFetch` server-only).

---

## File Structure

**Phase A (slider):**
- Modify: `src/app/vendor.css:62-69` — boost specificity / swap to transform trick
- (No other files touched)

**Phase B (slug remap):**
- Modify: `src/constants/i18n-routes.ts` — rewrite `EN_LOCALIZED_ROOTS`, `EN_INDUSTRY_SLUGS`, `EN_CASE_SLUGS`, `EN_BLOG_SLUG_MAP` from the audited inventory
- Create: `docs/audits/2026-05-30-locale-switcher-inventory.md` — the audited table that justifies every entry (kept so future contributors can diff against it)

**Phase C (dynamic registry via layout context, conditional):**
- Create: `src/lib/server/i18n-registry.ts` — server-only, cached fetch of all EN-aware Sanity docs; exposes `getEnRegistry()` returning `{ industries: Set, cases: Set, blogUaToEn: Map, blogEnToUa: Map }`.
- Create: `src/components/layout/i18n-registry-provider.tsx` — client React context that exposes the registry to client components.
- Modify: `src/app/(uk)/layout.tsx`, `src/app/(en)/layout.tsx` — make async; `await getEnRegistry()`; wrap `{children}` in `<I18nRegistryProvider value={registry}>`.
- Modify: `src/constants/i18n-routes.ts` — change the four helpers (`resolveLocaleAlternate`, `hasEnIndustry`, `hasEnCase`, `uaBlogToEnSlug` / `enBlogToUaSlug`) so each accepts an explicit `registry` argument; keep the current hardcoded sets as `__FALLBACK_REGISTRY` for the rare case where context is missing (e.g. tests, Sanity outage). `EN_LOCALIZED_ROOTS` stays as a real constant — it's filesystem-rooted, not Sanity-rooted.
- Modify: `src/components/layout/locale-switcher.tsx`, `src/components/layout/mobile-menu.tsx`, `src/components/layout/hp-header.tsx`, `src/components/layout/hp-footer.tsx` — read registry from context (`useI18nRegistry()`) and pass it into the helpers.
- Modify: server consumers — `src/app/sitemap.ts`, `src/lib/server/fetch-testimonials.ts`, `src/app/(en)/en/portfolio/page.tsx`, `src/lib/shared/case-card-item.ts` (if any callers are server-side) — `await getEnRegistry()` directly and pass it into the helpers instead of importing the now-deprecated module-level constants.
- Optionally delete: `EN_INDUSTRY_SLUGS`, `EN_CASE_SLUGS`, `EN_BLOG_SLUG_MAP` once nothing imports them. Keep them only inside `__FALLBACK_REGISTRY` if the fallback path is retained.
- **Pages and shared view components (industry-page, case-page, vs-*, legal-stub) require NO changes** — they don't import the helpers directly and the header/footer they render pick up context from the layout.

---

## Phase A — Swiper alignment

### Task A1: Boost specificity on the `.hp-pqs-swiper` breakout rule

**Files:**
- Modify: `src/app/vendor.css:62-69`

- [ ] **Step 1: Edit the rule to use a compound selector**

Replace the existing block (lines 62–69):

```css
.hp-pqs-swiper {
  position: relative;
  z-index: 1;
  width: 100vw;
  max-width: none;
  left: 50%;
  margin-left: -50vw;
}
```

with:

```css
/* Compound selector raises specificity from (0,1,0) to (0,2,0) so this
   wins over Swiper's base `.swiper { margin-left: auto }` regardless of
   stylesheet load order. The dynamic-import of SwiperWrapper puts
   `swiper/css` AFTER vendor.css in the cascade (see commit b14fbd8); the
   old single-class rule lost the `margin-left` declaration to Swiper's
   default and the slider drifted right by ~50% of the section's content
   width. Do not weaken this back to `.hp-pqs-swiper` without first
   re-hoisting the swiper/css imports into the root layout. */
.swiper.hp-pqs-swiper {
  position: relative;
  z-index: 1;
  width: 100vw;
  max-width: none;
  left: 50%;
  margin-left: -50vw;
  margin-right: -50vw; /* defeats `.swiper { margin-right: auto }` too */
}
```

- [ ] **Step 2: Verify the dev server is running**

Run (PowerShell):

```powershell
npm --prefix Frontend run dev
```

Expected: server listening on http://localhost:3000.

- [ ] **Step 3: Open the homepage with the preview tool and reload**

Use `mcp__Claude_Preview__preview_start` if not already started, then `mcp__Claude_Preview__preview_eval` with `window.location.reload()`.

- [ ] **Step 4: Inspect the slider container**

Use `mcp__Claude_Preview__preview_inspect` on the `.hp-pqs-swiper` element. Read `marginLeft`, `width`, `left`.

Expected computed styles:
- `width: <viewport-width>px` (i.e. 100vw resolved)
- `marginLeft: <-(viewport-width / 2)>px`
- `left: 50%` → resolves to `<section-content-width / 2>px`

If `marginLeft` resolves to `0px` or `auto`, the override did not take — proceed to Task A2.

- [ ] **Step 5: Take a screenshot at common breakpoints**

Use `mcp__Claude_Preview__preview_resize` then `mcp__Claude_Preview__preview_screenshot` for each of: 1440×900, 1100×800, 900×800, 640×900.

Expected: the slide content (avatar, blockquote, mockup) is horizontally centred in every screenshot. Compare against the misaligned baseline screenshot the user provided.

- [ ] **Step 6: Commit**

```bash
git add Frontend/src/app/vendor.css
git commit -m "fix(swiper): raise .hp-pqs-swiper specificity to beat .swiper base"
```

### Task A2 (fallback, only if A1 step 4 shows `marginLeft` still being overridden): replace the margin trick with a transform trick

**Files:**
- Modify: `src/app/vendor.css` (block edited in A1)

- [ ] **Step 1: Swap the rule to use `transform` instead of negative margins**

Replace the block written in A1 with:

```css
/* Transform-based full-bleed: Swiper's base CSS sets margin-left/right
   on `.swiper`, but never sets `transform`. Using transform sidesteps
   the cascade race entirely. width:100vw + left:50% + translateX(-50%)
   centres a 100vw element relative to the viewport regardless of how
   much horizontal padding the parent section has. */
.hp-pqs-swiper {
  position: relative;
  z-index: 1;
  width: 100vw;
  max-width: none;
  left: 50%;
  transform: translateX(-50%);
}
```

- [ ] **Step 2: Reload the preview**

`mcp__Claude_Preview__preview_eval` → `window.location.reload()`.

- [ ] **Step 3: Re-inspect**

`mcp__Claude_Preview__preview_inspect` on `.hp-pqs-swiper`. Expect:
- `width` ≈ viewport width
- `transform: matrix(1, 0, 0, 1, -<viewport/2>, 0)` (a translateX of about -50vw)
- `left` resolves to ~50% of parent

- [ ] **Step 4: Re-screenshot at 1440 / 1100 / 900 / 640**

Same as A1 step 5. Expect centred content.

- [ ] **Step 5: Commit**

```bash
git add Frontend/src/app/vendor.css
git commit -m "fix(swiper): full-bleed via transform to bypass .swiper cascade"
```

---

## Phase B — Remap hardcoded slug sets

**Why an inventory document first:** the only way to know whether each switcher entry should be enabled is to enumerate (a) every UA route the app actually ships, (b) every EN route the app actually ships, and (c) every Sanity doc whose EN shadow fields are populated. Eyeballing the constants is what got us into this mess. The inventory is the source of truth that Phase B writes against — keep it in the repo so the next person can re-run it.

### Task B1: Capture the filesystem-route inventory

**Files:**
- Create: `Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md`

- [ ] **Step 1: Enumerate UA page files**

Run:

```bash
ls Frontend/src/app/\(uk\)/*/page.tsx Frontend/src/app/\(uk\)/page.tsx 2>/dev/null
ls Frontend/src/app/\(uk\)/*/*/page.tsx 2>/dev/null
```

Capture the full list. The top-level routes (one segment) are the candidates for `EN_LOCALIZED_ROOTS`. Sub-segment routes go through the regex matchers in `resolveLocaleAlternate`.

- [ ] **Step 2: Enumerate EN page files**

Run:

```bash
ls Frontend/src/app/\(en\)/en/*/page.tsx Frontend/src/app/\(en\)/en/page.tsx 2>/dev/null
ls Frontend/src/app/\(en\)/en/*/*/page.tsx 2>/dev/null
```

- [ ] **Step 3: Create the audit doc and paste both lists**

Create `Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md` with this structure (fill the lists from steps 1 and 2):

```markdown
# Locale-switcher inventory — 2026-05-30

## UA filesystem routes
- /
- /about
- ... (full enumeration from `ls`)

## EN filesystem routes
- /en
- /en/about
- ...

## Top-level routes with both UA and EN page.tsx
(Intersection of the two lists, single-segment only — these are the
correct contents of `EN_LOCALIZED_ROOTS`.)

## UA-only top-level routes (must stay disabled)
(UA top-levels with no EN twin: /legal, /offer, /policy, /public-contract,
/stories, ...)

## Dynamic-route inventory
### /sites-for/[slug]
- (filled in B2)
### /portfolio/[slug]
- (filled in B3)
### /blog/[slug]
- (filled in B4)
```

- [ ] **Step 4: Commit the skeleton**

```bash
git add Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md
git commit -m "docs(audit): start locale-switcher inventory (skeleton + filesystem routes)"
```

### Task B2: Inventory `/sites-for/<slug>` against Sanity

**Files:**
- Modify: `Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md`

- [ ] **Step 1: Query Sanity for every published industryPage and its EN-field presence**

Open a Sanity Vision tab (Sanity Studio → Vision) or run the equivalent through the project's Sanity CLI. Query:

```groq
*[_type == "industryPage" && status == "published" && defined(slug.current)]{
  "slug": slug.current,
  "hasEnTitle": defined(title.en) && title.en != "",
  "hasEnHero": defined(hero.heading.en) && hero.heading.en != "",
  status,
  order
} | order(slug asc)
```

An industry page is "EN-available" iff `hasEnTitle && hasEnHero` (heuristic — if your team has a different rule, document it). Adjust if the EN content gate is stricter (e.g. requires `seoEn.title`).

- [ ] **Step 2: Cross-reference with `EN_INDUSTRY_SLUGS`**

Compare the query result against the current set (`medicine`, `renovation`, `legal`, `finance`, `ecommerce`, `auto`, `real-estate`, `courses`).

Record in the inventory doc, under `### /sites-for/[slug]`:

```markdown
| slug         | UA published | EN content present | Currently in EN_INDUSTRY_SLUGS | Should be in set |
| ------------ | ------------ | ------------------ | ------------------------------ | ---------------- |
| medicine     | ✓            | ✓                  | ✓                              | ✓                |
| ...          | ...          | ...                | ...                            | ...              |
```

Highlight any row where "Currently" ≠ "Should be" — those are the drifts.

- [ ] **Step 3: Commit the slice**

```bash
git add Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md
git commit -m "docs(audit): inventory industry-page slugs vs EN content"
```

### Task B3: Inventory `/portfolio/<slug>` against Sanity

**Files:**
- Modify: `Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md`

- [ ] **Step 1: Query published case studies for EN content**

```groq
*[_type == "caseStudy" && status == "published" && defined(slug.current)]{
  "slug": slug.current,
  "hasEnTitle": defined(title.en) && title.en != "",
  "hasEnHeroHeading": defined(hero.heading.en) && hero.heading.en != "",
  featured
} | order(slug asc)
```

- [ ] **Step 2: Cross-reference with `EN_CASE_SLUGS`**

Current set: `{"nbyg-kobenhavn"}`.

Record under `### /portfolio/[slug]` with the same column structure as B2.

- [ ] **Step 3: Commit**

```bash
git add Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md
git commit -m "docs(audit): inventory case-study slugs vs EN content"
```

### Task B4: Inventory `/blog/<slug>` against Sanity (bidirectional map)

**Files:**
- Modify: `Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md`

- [ ] **Step 1: Query published blog posts including the EN slug**

```groq
*[_type == "blogPost" && status == "published" && defined(slug.current)]{
  "uaSlug": slug.current,
  "enSlug": slugEn.current,
  "hasEnTitle": defined(titleEn) && titleEn != "",
  "hasEnLede": defined(ledeEn) && ledeEn != ""
} | order(uaSlug asc)
```

A post is "EN-available" iff `enSlug && hasEnTitle && hasEnLede` (or whichever gate matches what `/en/blog/[slug]/page.tsx` actually requires to render — check that page's fetch+guard logic and use the same predicate; document the chosen rule in the inventory).

- [ ] **Step 2: Cross-reference with `EN_BLOG_SLUG_MAP`**

Current map: `skilky-koshtuye-sayt-2026 → website-cost-2026-breakdown`, `tilda-7200-za-3-roky → tilda-7200-over-3-years`, `dohovir-z-veb-studieyu-7-punktiv → web-studio-contract-7-items`.

Record under `### /blog/[slug]`:

```markdown
| uaSlug                          | enSlug (Sanity)      | EN gate passes | Currently in map | Should map to    |
| ------------------------------- | -------------------- | -------------- | ---------------- | ---------------- |
| skilky-koshtuye-sayt-2026       | website-cost-...     | ✓              | ✓ (matches)      | unchanged        |
| ...                             | ...                  | ...            | ...              | ...              |
```

Note any row where the Sanity `enSlug` doesn't match the hardcoded value — those are silent 404s today.

- [ ] **Step 3: Commit**

```bash
git add Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md
git commit -m "docs(audit): inventory blog slugs vs EN content"
```

### Task B5: Rewrite `EN_LOCALIZED_ROOTS` from the filesystem inventory

**Files:**
- Modify: `Frontend/src/constants/i18n-routes.ts:44-55`

- [ ] **Step 1: Build the new set from the "Top-level routes with both UA and EN" list in the inventory**

For every single-segment top-level route where **both** `app/(uk)/<seg>/page.tsx` and `app/(en)/en/<seg>/page.tsx` exist, include `/${seg}` in the set. Do not include `/` (handled by the early-return for `/` and `/en` at the top of `resolveLocaleAlternate`).

Today's expected union (verify against B1 output before editing): `/about`, `/blog`, `/calculator`, `/contacts`, `/portfolio`, `/pricing`, `/process`, `/vs-constructors`, `/vs-freelancers`, `/vs-wordpress`.

Replace lines 44–55 with:

```ts
/**
 * Top-level routes that have a fully-translated EN counterpart at
 * `/en<path>`. Used by the locale switcher to keep the user on the
 * same page when toggling languages instead of bouncing to `/en`.
 *
 * Source of truth: every single-segment top-level route where BOTH
 * `app/(uk)/<seg>/page.tsx` AND `app/(en)/en/<seg>/page.tsx` exist
 * on disk. Re-derive when adding/removing a top-level page.
 * Inventory: docs/audits/2026-05-30-locale-switcher-inventory.md
 */
export const EN_LOCALIZED_ROOTS: ReadonlySet<string> = new Set([
  "/about",
  "/blog",
  "/calculator",
  "/contacts",
  "/portfolio",
  "/pricing",
  "/process",
  "/vs-constructors",
  "/vs-freelancers",
  "/vs-wordpress",
]);
```

(Adjust the list if the inventory shows a discrepancy.)

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/constants/i18n-routes.ts
git commit -m "fix(i18n): re-derive EN_LOCALIZED_ROOTS from filesystem inventory"
```

### Task B6: Rewrite `EN_INDUSTRY_SLUGS` from the B2 inventory

**Files:**
- Modify: `Frontend/src/constants/i18n-routes.ts:14-23`

- [ ] **Step 1: Replace the set with the audited slug list**

For each row in the B2 table where "Should be in set" = ✓, include the slug. Drop the rest.

```ts
export const EN_INDUSTRY_SLUGS: ReadonlySet<string> = new Set([
  // Filled from docs/audits/2026-05-30-locale-switcher-inventory.md.
  // Each slug here MUST have a published industryPage in Sanity with
  // non-empty EN fields (title.en + hero.heading.en at minimum).
  // <slug-1>,
  // <slug-2>,
  // ...
]);
```

- [ ] **Step 2: Manual cross-check**

For each slug in the new set, hit `http://localhost:3000/en/sites-for/<slug>` in the preview and confirm the page renders (not 404, not blank EN fields). Use `mcp__Claude_Preview__preview_snapshot` to read the page title — it should be in English.

For each slug *removed* from the set, hit `http://localhost:3000/en/sites-for/<slug>` and confirm 404 or missing EN content (the page either notFound()s or shows obviously-fallback UA strings).

- [ ] **Step 3: Commit**

```bash
git add Frontend/src/constants/i18n-routes.ts
git commit -m "fix(i18n): re-derive EN_INDUSTRY_SLUGS from Sanity content"
```

### Task B7: Rewrite `EN_CASE_SLUGS` from the B3 inventory

**Files:**
- Modify: `Frontend/src/constants/i18n-routes.ts:33`

- [ ] **Step 1: Replace the set**

```ts
export const EN_CASE_SLUGS: ReadonlySet<string> = new Set([
  // Filled from docs/audits/2026-05-30-locale-switcher-inventory.md.
  // <slug-1>,
  // ...
]);
```

- [ ] **Step 2: Manual cross-check via preview**

Same pattern as B6 step 2: for every slug in the set, `/en/portfolio/<slug>` must render in English; for every slug *not* in the set, `/en/portfolio/<slug>` must 404 or render UA-fallback.

- [ ] **Step 3: Commit**

```bash
git add Frontend/src/constants/i18n-routes.ts
git commit -m "fix(i18n): re-derive EN_CASE_SLUGS from Sanity content"
```

### Task B8: Rewrite `EN_BLOG_SLUG_MAP` from the B4 inventory

**Files:**
- Modify: `Frontend/src/constants/i18n-routes.ts:99-103`

- [ ] **Step 1: Replace the map**

Use the Sanity-stored `enSlug` as the value. Do NOT preserve a hardcoded value that disagrees with Sanity (those are the silent-404 rows from B4).

```ts
export const EN_BLOG_SLUG_MAP: Record<string, string> = {
  // Filled from docs/audits/2026-05-30-locale-switcher-inventory.md.
  // Key = UA slug; value = Sanity `slugEn`. Only include posts whose
  // EN content gate passes (see audit for the exact predicate).
  // "<ua-slug>": "<en-slug>",
};
```

`UA_BLOG_SLUG_MAP` is derived from the inverse on line 106 — no edit needed; it picks up automatically.

- [ ] **Step 2: Manual cross-check via preview**

For each `[uaSlug → enSlug]` row: load `http://localhost:3000/blog/<uaSlug>`, click the EN switch, expect to land on `/en/blog/<enSlug>` and see the article render. Then load `/en/blog/<enSlug>`, click UA switch, expect to land back on `/blog/<uaSlug>`.

For each UA blog NOT in the map: load `/blog/<uaSlug>`, expect the EN switch button to render disabled (greyed-out, `aria-disabled="true"`, no navigation on click). Verify via `mcp__Claude_Preview__preview_snapshot` and `mcp__Claude_Preview__preview_click`.

- [ ] **Step 3: Commit**

```bash
git add Frontend/src/constants/i18n-routes.ts
git commit -m "fix(i18n): re-derive EN_BLOG_SLUG_MAP from Sanity content"
```

### Task B9: Full-site switcher verification sweep

**Files:** (none — verification only)

- [ ] **Step 1: Define the verification matrix**

The matrix is exactly the union of:
- Every top-level UA route (from B1).
- Every top-level EN route (from B1).
- Every `/sites-for/<slug>` and `/en/sites-for/<slug>` for slugs in B2.
- Every `/portfolio/<slug>` and `/en/portfolio/<slug>` for slugs in B3.
- Every `/blog/<uaSlug>` and `/en/blog/<enSlug>` for entries in B4.

- [ ] **Step 2: Walk the matrix in the preview**

For each row: load the URL, screenshot the open locale dropdown, confirm:
- The button for the OTHER locale is **enabled** iff that locale's page exists for this content.
- The button for the SAME locale is shown as active.
- Clicking the OTHER locale button navigates to a real page (no 404, content renders).

Use `mcp__Claude_Preview__preview_snapshot` to read DOM state without full screenshots when the volume is high. Screenshot at least every dynamic-route family root (3 screenshots: industry, case, blog) plus any row where the switch behaviour was previously wrong.

- [ ] **Step 3: Record results**

Append a "## Phase B verification" section to the inventory doc with a row per matrix entry: `OK` / `BUG: <what>`. If everything is `OK`, that's the green light to either stop here (Phase B-only outcome) or proceed to Phase C.

- [ ] **Step 4: Commit verification record**

```bash
git add Frontend/docs/audits/2026-05-30-locale-switcher-inventory.md
git commit -m "docs(audit): full-site locale-switcher verification (Phase B sign-off)"
```

---

## Phase C — Dynamic Sanity-driven registry via layout context (conditional)

**Run only if Phase B step B9 produced zero `BUG:` rows.** If B9 still shows drift bugs, the hardcoded approach is not the bottleneck and Phase C is premature — diagnose those first.

**Why this shape (vs the earlier per-page prop-threading proposal):** the original Phase C asked every page (~21 files) to `await resolveLocaleAlternateAsync(pathname)` and forward an `alternates` prop into `<HpHeader>`. That approach (a) hardcodes the pathname literal at each page (drift risk), (b) doesn't help the footer's services dropdown or the header's services dropdown — they read the same hardcoded slug sets — and (c) churns ~30 files for a single behavioural concern. This rewrite uses one server fetch per route group layout, surfaces the registry via React context, and lets the **existing client-side path-based resolver** keep working — it just reads slug sets from context instead of importing constants. 6 files vs ~30, same behaviour, same perf, more coverage.

**Performance gate:** before merging Phase C, measure Lighthouse Performance on `/` and `/en` (the static-rendered pages whose render path the new layout fetch will join). Phase C is a pass only if LCP regression ≤ 100 ms and there is no new render-blocking entry in the waterfall. The Sanity fetch must be `unstable_cache`d at module scope so it runs at most once per `revalidate` window across the whole build.

**Context-value freshness note:** layouts persist across same-route-group client-side navigations, so the registry context object is the same reference across navigations within `/(uk)/*` (or `/(en)/*`). That is correct here because the registry is *path-independent* — it's a registry of which slugs have EN, not which alternates apply to the current page. The current page's alternates are computed client-side from `usePathname()` + the registry, so navigation updates them naturally.

### Task C1: Server-side registry module

**Files:**
- Create: `Frontend/src/lib/server/i18n-registry.ts`

- [ ] **Step 1: Write the module**

```ts
import "server-only";
import { unstable_cache } from "next/cache";

import { sanityFetch } from "@/lib/server/sanity-fetch";

export type EnRegistry = {
  /** UA industry slugs whose Sanity industryPage has non-empty `title.en`. */
  industries: ReadonlySet<string>;
  /** UA case slugs whose Sanity caseStudy has non-empty `title.en`. */
  cases: ReadonlySet<string>;
  /** UA blog slug → EN blog slug, only for posts whose EN content gate passes. */
  blogUaToEn: ReadonlyMap<string, string>;
  /** Inverse of blogUaToEn, used by `/en/blog/[slug]` → `/blog/[slug]` resolution. */
  blogEnToUa: ReadonlyMap<string, string>;
};

// GROQ predicates MUST mirror the EN content gate used by the actual
// /en/<...> pages. Keep these in sync with `hasEnglishContent()` in
// components/industry-page/index.tsx and the `if (!post || !post.titleEn
// || !post.bodyEn?.length) notFound()` guard in app/(en)/en/blog/[slug]/page.tsx.
// If the gate diverges from the predicate, the registry over-reports
// availability and we re-introduce the "enabled but 404s" failure mode.
const INDUSTRY_EN_AVAILABLE_QUERY = /* groq */ `
*[_type == "industryPage" && status == "published" && defined(slug.current)
  && defined(title.en) && title.en != ""
].slug.current`;

const CASE_EN_AVAILABLE_QUERY = /* groq */ `
*[_type == "caseStudy" && status == "published" && defined(slug.current)
  && defined(title.en) && title.en != ""
].slug.current`;

const BLOG_EN_PAIRS_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && defined(slug.current)
  && defined(slugEn.current) && defined(titleEn) && titleEn != ""
  && defined(ledeEn) && ledeEn != ""
]{ "ua": slug.current, "en": slugEn.current }`;

async function fetchRegistry(): Promise<EnRegistry> {
  const [industries, cases, blogPairs] = await Promise.all([
    sanityFetch<string[]>({ query: INDUSTRY_EN_AVAILABLE_QUERY, revalidate: 300 }),
    sanityFetch<string[]>({ query: CASE_EN_AVAILABLE_QUERY, revalidate: 300 }),
    sanityFetch<Array<{ ua: string; en: string }>>({ query: BLOG_EN_PAIRS_QUERY, revalidate: 300 }),
  ]);
  return {
    industries: new Set(industries),
    cases: new Set(cases),
    blogUaToEn: new Map(blogPairs.map((p) => [p.ua, p.en])),
    blogEnToUa: new Map(blogPairs.map((p) => [p.en, p.ua])),
  };
}

// Cache keyed under a single shared label so all callers across a build
// hit the same entry. Next's data cache already dedupes identical fetches,
// but `unstable_cache` adds belt + braces: a single cached result across
// the three sub-queries, evicted together.
export const getEnRegistry = unstable_cache(
  fetchRegistry,
  ["i18n-en-registry"],
  { revalidate: 300, tags: ["i18n-alternates"] },
);

/**
 * Fallback used when context is missing (tests, Sanity outage, or a
 * server module that hasn't been migrated yet). The values mirror what
 * Phase B wrote into `src/constants/i18n-routes.ts` — keep them in sync
 * with that file (or import from it directly) so a fallback render
 * looks identical to today's behaviour.
 */
export const FALLBACK_REGISTRY: EnRegistry = {
  industries: new Set([
    "auto", "courses", "ecommerce", "finance", "legal", "real-estate",
  ]),
  cases: new Set(["nbyg-kobenhavn"]),
  blogUaToEn: new Map([
    ["skilky-koshtuye-sayt-2026", "website-cost-2026-breakdown"],
    ["tilda-7200-za-3-roky", "tilda-7200-over-3-years"],
    ["dohovir-z-veb-studieyu-7-punktiv", "web-studio-contract-7-items"],
  ]),
  blogEnToUa: new Map([
    ["website-cost-2026-breakdown", "skilky-koshtuye-sayt-2026"],
    ["tilda-7200-over-3-years", "tilda-7200-za-3-roky"],
    ["web-studio-contract-7-items", "dohovir-z-veb-studieyu-7-punktiv"],
  ]),
};

/**
 * Wrap `getEnRegistry` so a Sanity outage during build doesn't fail the
 * whole render — we fall back to the last-known-good hardcoded set and
 * emit a one-line server log so the outage is visible in CI/Vercel logs.
 */
export async function getEnRegistrySafe(): Promise<EnRegistry> {
  try {
    return await getEnRegistry();
  } catch (err) {
    console.warn(
      "[i18n-registry] Sanity fetch failed; using FALLBACK_REGISTRY.",
      err,
    );
    return FALLBACK_REGISTRY;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/lib/server/i18n-registry.ts
git commit -m "feat(i18n): server-side EN-availability registry from Sanity"
```

### Task C2: Client context provider

**Files:**
- Create: `Frontend/src/components/layout/i18n-registry-provider.tsx`

- [ ] **Step 1: Write the provider**

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";

import { FALLBACK_REGISTRY, type EnRegistry } from "@/lib/server/i18n-registry";

const I18nRegistryContext = createContext<EnRegistry>(FALLBACK_REGISTRY);

/**
 * Wraps children with the EN-availability registry so client components
 * (locale-switcher, mobile-menu, hp-header services dropdown, hp-footer
 * services list) can decide enabled/disabled state without importing
 * stale hardcoded slug sets.
 *
 * The `value` prop is serialised from a server component (see
 * `app/(uk)/layout.tsx` and `app/(en)/layout.tsx`); Maps and Sets survive
 * Next's serialisation. If a consumer renders outside this provider it
 * still works — the context defaults to FALLBACK_REGISTRY.
 */
export function I18nRegistryProvider({
  value,
  children,
}: {
  value: EnRegistry;
  children: ReactNode;
}) {
  return (
    <I18nRegistryContext.Provider value={value}>
      {children}
    </I18nRegistryContext.Provider>
  );
}

export function useI18nRegistry(): EnRegistry {
  return useContext(I18nRegistryContext);
}
```

- [ ] **Step 2: Verify Map/Set survive RSC serialisation**

Quick console check after the layout wiring (Task C3) lands: from the browser devtools on `/`, paste:

```js
window.__I18N_REGISTRY_PROBE__ // we'll wire this for one render to verify shape
```

If Next refuses to serialise `Map`/`Set` (it should accept them in React 19 + Next 15 RSC payloads, but worth confirming), fall back to serialising as plain arrays/objects and reconstructing inside the provider — keep the public `EnRegistry` shape the same:

```tsx
// Pseudo-code if needed:
// type SerializedRegistry = { industries: string[]; cases: string[]; blog: Array<[string, string]> };
// const serialized = { industries: [...value.industries], cases: [...value.cases], blog: [...value.blogUaToEn] };
// inside provider: useMemo to reconstruct Set/Map once.
```

- [ ] **Step 3: Commit**

```bash
git add Frontend/src/components/layout/i18n-registry-provider.tsx
git commit -m "feat(i18n): client context provider for EN-availability registry"
```

### Task C3: Wire the provider into both route-group layouts

**Files:**
- Modify: `Frontend/src/app/(uk)/layout.tsx`
- Modify: `Frontend/src/app/(en)/layout.tsx`

- [ ] **Step 1: Make the UK layout async and fetch the registry**

At the top of `Frontend/src/app/(uk)/layout.tsx`, add:

```tsx
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";
import { I18nRegistryProvider } from "@/components/layout/i18n-registry-provider";
```

Change the layout signature from `export default function UkRootLayout(` to `export default async function UkRootLayout(`. Inside the body, before the `return`:

```tsx
const i18nRegistry = await getEnRegistrySafe();
```

Wrap `{children}` (currently inside `<NextIntlClientProvider>` inside `<Providers>`) with the provider:

```tsx
<NextIntlClientProvider locale="uk" messages={ukMessages}>
  <Providers>
    <I18nRegistryProvider value={i18nRegistry}>
      {children}
    </I18nRegistryProvider>
  </Providers>
</NextIntlClientProvider>
```

- [ ] **Step 2: Mirror the change in the EN layout**

Same imports + async signature + `getEnRegistrySafe()` call + provider wrap inside `Frontend/src/app/(en)/layout.tsx`.

- [ ] **Step 3: Verify static rendering still works**

```bash
npm --prefix Frontend run build
```

Expected: build succeeds; route table reports `/` and `/en` (and other static routes) as prerendered (●), not dynamic (ƒ). If any page flipped to ƒ, the layout fetch is leaking dynamism — verify `unstable_cache` is taking effect.

- [ ] **Step 4: Commit**

```bash
git add Frontend/src/app/\(uk\)/layout.tsx Frontend/src/app/\(en\)/layout.tsx
git commit -m "feat(i18n): fetch EN registry in both root layouts; provide via context"
```

### Task C4: Parameterise the helpers in `i18n-routes.ts`

**Files:**
- Modify: `Frontend/src/constants/i18n-routes.ts`

- [ ] **Step 1: Add the `registry` parameter to each Sanity-rooted helper**

`hasEnIndustry`, `hasEnCase`, `uaBlogToEnSlug`, `enBlogToUaSlug`, and `resolveLocaleAlternate` currently read module-level constants. Change each to take an explicit `registry: EnRegistry` argument so the data source is injected by the caller. Sketch of the new signatures (full file edits below in tasks C5/C6/C7):

```ts
import type { EnRegistry } from "@/lib/server/i18n-registry";

export function hasEnIndustry(slug: string, registry: EnRegistry): boolean {
  return registry.industries.has(slug);
}

export function hasEnCase(slug: string, registry: EnRegistry): boolean {
  return registry.cases.has(slug);
}

export function uaBlogToEnSlug(uaSlug: string, registry: EnRegistry): string | undefined {
  return registry.blogUaToEn.get(uaSlug);
}

export function enBlogToUaSlug(enSlug: string, registry: EnRegistry): string | undefined {
  return registry.blogEnToUa.get(enSlug);
}

export function resolveServiceHref(uaHref: string, isEn: boolean, registry: EnRegistry): string {
  if (!isEn) return uaHref;
  const slug = uaHref.replace(/^\/sites-for\//, "");
  return hasEnIndustry(slug, registry) ? `/en/sites-for/${slug}` : "/en#solutions";
}

export function resolveLocaleAlternate(
  pathname: string,
  registry: EnRegistry,
): { uk: string | null; en: string | null } {
  // ...same body as today, but every `EN_INDUSTRY_SLUGS.has(...)` /
  // `EN_CASE_SLUGS.has(...)` / `EN_BLOG_SLUG_MAP[...]` / `UA_BLOG_SLUG_MAP[...]`
  // is replaced with the corresponding registry lookup.
}
```

`EN_LOCALIZED_ROOTS` stays as a real exported constant — it's filesystem-rooted, not Sanity-rooted, and the resolver still uses it directly.

`EN_INDUSTRY_SLUGS`, `EN_CASE_SLUGS`, `EN_BLOG_SLUG_MAP`, `UA_BLOG_SLUG_MAP` get **deleted**. The fallback values live in `FALLBACK_REGISTRY` inside `lib/server/i18n-registry.ts`.

- [ ] **Step 2: Run typecheck**

```bash
npm --prefix Frontend run typecheck
```

Expected: a wall of errors — every existing call site now passes too few arguments. That's fine; tasks C5–C7 update them. Leave them broken between commits is **not OK**; do the file edit in C4 in the same commit as C5–C7 or stash C4 until C5–C7 are queued.

Practical sequencing: do C4's resolver changes locally **without committing yet**, then move straight into C5–C7, and commit C4–C7 as a single atomic "wire registry through helpers + consumers" commit.

- [ ] **Step 3: (deferred — commit happens at end of C7)**

### Task C5: Update the four header/footer/switcher client components

**Files:**
- Modify: `Frontend/src/components/layout/locale-switcher.tsx`
- Modify: `Frontend/src/components/layout/mobile-menu.tsx`
- Modify: `Frontend/src/components/layout/hp-header.tsx`
- Modify: `Frontend/src/components/layout/hp-footer.tsx`

- [ ] **Step 1: locale-switcher.tsx**

Add the hook import:

```tsx
import { useI18nRegistry } from "./i18n-registry-provider";
```

Inside the component, before the `resolveLocaleAlternate(pathname)` call, read the registry:

```tsx
const registry = useI18nRegistry();
const { uk: ukHref, en: enHref } = resolveLocaleAlternate(pathname, registry);
```

- [ ] **Step 2: mobile-menu.tsx**

Same edit — add the import, read the registry, and update both the `resolveLocaleAlternate(pathname)` call and any `resolveServiceHref(s.href, isEn)` calls (search the file for both) to pass `registry`.

- [ ] **Step 3: hp-header.tsx**

Add the import. Inside `HpHeader`, read `const registry = useI18nRegistry();`. Update the `resolveServiceHref(item.href, isEn)` call (search for `resolveServiceHref` in this file) to pass `registry` as the third argument.

- [ ] **Step 4: hp-footer.tsx**

Add the import. Read `const registry = useI18nRegistry();`. Update the `hasEnIndustry(slug)` call (search for `hasEnIndustry` in this file) to pass `registry`.

- [ ] **Step 5: (deferred — commit happens at end of C7)**

### Task C6: Update server-side consumers

**Files:**
- Modify: `Frontend/src/app/sitemap.ts`
- Modify: `Frontend/src/lib/server/fetch-testimonials.ts`
- Modify: `Frontend/src/app/(en)/en/portfolio/page.tsx`
- Modify: `Frontend/src/lib/shared/case-card-item.ts` (only if its callers are server-side; if it's imported into a client tree, leave it on FALLBACK_REGISTRY for now and revisit in a follow-up — flag this in the commit message)

- [ ] **Step 1: Convert each call site to fetch the registry server-side**

Pattern, applied to each file:

```ts
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";

// inside the server function:
const registry = await getEnRegistrySafe();
// ...then pass `registry` to hasEnCase / hasEnIndustry / etc.
```

For `app/sitemap.ts` specifically, swap `EN_INDUSTRY_SLUGS.has(p.slug)` (line 105) for `registry.industries.has(p.slug)` after fetching the registry near the top of the sitemap function.

- [ ] **Step 2: For shared helpers used by both client and server**

`lib/shared/case-card-item.ts` calls `hasEnCase(c.slug)`. After C4, the helper requires a `registry` arg. Audit who calls `case-card-item.ts`:

```bash
grep -rln "case-card-item" Frontend/src/
```

If every caller is server-side, thread the registry as a new arg into `case-card-item.ts`'s exported functions and pass it from each call site. If any caller is a client component, leave the function unchanged and pull the registry from context at the client call site instead.

- [ ] **Step 3: (deferred — commit happens at end of C7)**

### Task C7: Verify, then commit C4–C7 atomically

**Files:** (none — verification only, then commit)

- [ ] **Step 1: Typecheck**

```bash
npm --prefix Frontend run typecheck
```

Expected: zero errors. If any remain, an unaddressed consumer is still calling the old signature; grep for the function name and fix.

- [ ] **Step 2: Full Phase-B9 verification matrix in the preview**

Same matrix as B9: every UA and EN route, dynamic-route families, every clickable EN button must navigate to a real page. Every disabled button must stay disabled. Use `mcp__Claude_Preview__preview_eval` with the same raw-HTML scrape we used in Phase B to spot-check the EN-button state on 7+ canonical routes.

- [ ] **Step 3: Lighthouse on `/` and `/en`**

Run a desktop Lighthouse pass (or your team's preferred perf script) on the prod build (`npm --prefix Frontend run build && npm --prefix Frontend run start`) for `/` and `/en`. Compare LCP and TTFB against the pre-C baseline captured before this phase. **Hard gate:** LCP regression ≤ 100 ms; no new render-blocking resource in the waterfall; no new entry in the long-tasks pane.

If LCP regressed > 100 ms: check whether the layout fetch is being amortised. Diagnose by adding a one-line `console.time("registry-fetch")` in `fetchRegistry`, rebuilding, and counting log lines per route. More than 1 line per locale per revalidate window means `unstable_cache` isn't sharing — investigate before committing.

- [ ] **Step 4: Commit C4–C7 as one atomic change**

```bash
git add Frontend/src/constants/i18n-routes.ts \
        Frontend/src/components/layout/locale-switcher.tsx \
        Frontend/src/components/layout/mobile-menu.tsx \
        Frontend/src/components/layout/hp-header.tsx \
        Frontend/src/components/layout/hp-footer.tsx \
        Frontend/src/app/sitemap.ts \
        Frontend/src/lib/server/fetch-testimonials.ts \
        Frontend/src/app/\(en\)/en/portfolio/page.tsx \
        Frontend/src/lib/shared/case-card-item.ts
git commit -m "refactor(i18n): registry-driven helpers; consumers read from context/server"
```

(Adjust the file list to whatever C6 actually touched — drop `case-card-item.ts` from this list if you deferred it.)

### Task C8 (optional but recommended): drift telemetry

**Files:**
- Create: `Frontend/scripts/check-i18n-registry-drift.ts`

The registry now IS the source of truth, so traditional drift checks (hardcoded vs Sanity) don't apply. But the *fallback* can drift away from Sanity, and that matters when the fallback fires (Sanity outage). Add a small script that asserts the fallback is still a reasonable subset of the live registry:

- [ ] **Step 1: Write the script**

```ts
import { FALLBACK_REGISTRY, getEnRegistry } from "@/lib/server/i18n-registry";

async function main() {
  const live = await getEnRegistry();
  const missing: string[] = [];
  for (const slug of FALLBACK_REGISTRY.industries) {
    if (!live.industries.has(slug)) missing.push(`industry/${slug}`);
  }
  for (const slug of FALLBACK_REGISTRY.cases) {
    if (!live.cases.has(slug)) missing.push(`case/${slug}`);
  }
  for (const [ua, en] of FALLBACK_REGISTRY.blogUaToEn) {
    if (live.blogUaToEn.get(ua) !== en) missing.push(`blog/${ua}->${en}`);
  }
  if (missing.length) {
    console.warn(
      "[i18n-fallback-drift] FALLBACK_REGISTRY contains entries no longer present in Sanity:",
      missing,
    );
    process.exit(1);
  }
  console.log("FALLBACK_REGISTRY is a subset of live Sanity registry: OK");
}

main();
```

- [ ] **Step 2: Wire into `package.json`**

```json
"check:i18n": "tsx scripts/check-i18n-registry-drift.ts"
```

Optionally invoke from CI on PRs that touch `lib/server/i18n-registry.ts` or `constants/i18n-routes.ts`.

- [ ] **Step 3: Commit**

```bash
git add Frontend/scripts/check-i18n-registry-drift.ts Frontend/package.json
git commit -m "chore(i18n): fallback-registry drift check vs live Sanity"
```

---

## Self-Review Notes

- **Spec coverage:** Phase A maps to user ask #1 (specificity-first, transform fallback). Phase B maps to ask #2 (remap to include all pages, not only Sanity-driven — covered by both `EN_LOCALIZED_ROOTS` rewrite from the filesystem and the per-content-type audits). Phase C maps to ask #3 (dynamic mapping, gated on Phase B success and on a measured performance check).
- **Placeholders:** No `TBD`; every step has actionable code or commands. The few `<slug-N>` placeholders inside the rewritten constants in Phase B are intentional — they're filled from the inventory the prior task produces, and the task explicitly says so.
- **Type consistency:** `EnRegistry` is introduced in C1 and is the single shared shape used by C2 (provider), C4 (helpers), C5 (client consumers), C6 (server consumers), and C8 (drift check). `FALLBACK_REGISTRY` is the same shape, exported alongside.
- **Rollback:**
  - Phase A: single-file CSS edit, revertable in one commit.
  - Phase B: per-constant commits, each independently revertable.
  - Phase C: C1 (registry module) and C2 (provider) are non-breaking — they add new files but don't yet change any rendering. C3 (layout wiring) adds the provider to the tree but with no consumers, also non-breaking. C4–C7 land as one atomic commit because changing helper signatures (C4) breaks the build until every consumer is updated (C5+C6); reverting that commit reverts the entire registry rollout in one shot. C8 is independent telemetry, revertable alone.
- **Why C4–C7 ship together:** the helper signature change in C4 is breaking; splitting it across commits leaves the tree non-compiling in the middle. The plan's earlier shape (optional-prop with fallback to today's resolver) allowed staged rollout but at the cost of double-wiring every component. Atomic is cleaner.
