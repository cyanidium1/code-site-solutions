# Frontend Code Reorganization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the Frontend codebase into clearly-bucketed folders (components, types, utils, server/client functions, constants, content) with one component/function per file, removing duplicated content arrays, type definitions, and pricing constants.

**Architecture:**
- New top-level buckets under `src/`: `constants/`, `content/`, `types/`, plus refactored `lib/` (split into `lib/server/`, `lib/client/`, `lib/shared/`).
- Routes in `src/app/**` become thin: import data from `content/`, render components from `components/`.
- Each component file exports exactly one component. Sibling helpers extracted to neighbor files.
- Monoliths (homepage, vs-* pages) decomposed into one-section-per-file folders.
- Locale-split content lives in `src/content/{uk,en}/`; locale-agnostic config lives in `src/constants/`.

**Tech Stack:** Next.js 15 (App Router, RSC), TypeScript, next-intl, Sanity client, Formik+Yup, Tailwind, HeroUI.

**Verification:** No test suite exists. Each task verifies with `npm run typecheck` (must pass) and inspection that imports resolve. Phase-end gates run `npm run build`. Behavior must be byte-identical to current — these are pure mechanical extractions.

**Ground rules:**
- Never change rendered output during a move. If you need to fix a bug, file it separately.
- Move + re-export shim (temporary) is allowed when many callers reference an old path; remove the shim in the same phase.
- Preserve `"use client"` / `"use server"` directives — moving code across the client/server boundary requires explicit confirmation.
- Use absolute paths via the existing `@/` alias (already configured in `tsconfig.json`).

---

## Target Directory Structure

```
src/
├── app/                     # routes only — thin pages, no inline content/types/helpers
│   ├── (uk routes)/page.tsx
│   ├── en/**/page.tsx
│   ├── api/lead/route.ts
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/              # one component per file; folders by feature
│   ├── blocks/              # reusable content blocks (hero, faq, comparison, etc.)
│   ├── calculator/          # calculator UI — split state from display
│   ├── case-page/
│   ├── homepage/            # one section per file (was a 980-line monolith)
│   ├── industry-page/
│   ├── layout/              # site header, footer, mobile menu, locale switcher
│   ├── legal/
│   ├── portfolio/
│   ├── shared/              # generic primitives (SectionHead, SwiperWrapper, ScrollReveal)
│   └── vs-pages/            # ONE shared layout used by vs-constructors/freelancers/wordpress
├── content/                 # data formerly inlined in pages — localized
│   ├── uk/
│   │   ├── homepage.ts      # tiers, FAQ, industries, bento, process, partners
│   │   ├── about.ts         # team, values, clients
│   │   ├── process.ts
│   │   ├── pricing.ts
│   │   ├── services.ts
│   │   ├── contacts.ts      # (already in lib/contacts.ts — move here)
│   │   └── comparisons/
│   │       ├── vs-constructors.ts
│   │       ├── vs-freelancers.ts
│   │       └── vs-wordpress.ts
│   └── en/                  # same shape as uk/
├── constants/               # locale-agnostic config (magic numbers, enums, route lists)
│   ├── site.ts              # SITE_ORIGIN, ORG_ID (was lib/site.ts)
│   ├── pricing-tiers.ts     # TIER_AMOUNTS, TIER_NAMES, TIER_WEEKS (was lib/pricing/tiers.ts)
│   ├── calculator-config.ts # PROJECT_TYPE_CONFIG, CMS_UPGRADES, etc. (was lib/pricing-calculator-config.ts)
│   ├── i18n-routes.ts       # (was lib/i18n-routes.ts)
│   ├── nav.ts               # header + footer nav items
│   └── form-options.ts      # BUSINESS_OPTS_BY_LOCALE, TIER_OPTS_BY_LOCALE
├── types/                   # shared TypeScript types (no runtime code)
│   ├── faq.ts               # FAQItem
│   ├── pricing.ts           # TierProps, TableRowData, CalculatorInput, CalculatorEstimate
│   ├── homepage.ts          # Industry, BentoCell, MarqueeLogo, CaseRef, TestimonialItem
│   ├── comparisons.ts       # Sign, Cost, CompareRow, Builder, PatternRow, DontDo
│   ├── lead.ts              # LeadValues
│   ├── sanity.ts            # (was lib/sanity/types.ts — moved as-is)
│   └── global.d.ts          # (already exists at /types/global.d.ts — keep root location)
├── lib/                     # pure logic; split by runtime
│   ├── server/              # functions that must NOT bundle into the client
│   │   ├── sanity-client.ts
│   │   ├── sanity-fetch.ts
│   │   ├── sanity-queries.ts
│   │   └── fetch-testimonials.ts
│   ├── client/              # functions only used inside "use client" components
│   │   └── (calculator state hooks if any extracted)
│   └── shared/              # pure functions safe in either runtime (no React, no fetch)
│       ├── cn.ts            # was utils.ts
│       ├── format-price.ts  # was formatters/price.ts
│       ├── format-eur.ts    # was components/calculator/formatters.ts
│       ├── calculate-website-estimate.ts
│       ├── case-presentation.ts
│       ├── page-url.ts      # pageUrl() helper from old site.ts
│       └── rich-text.tsx    # Portable text renderer
├── i18n/
│   └── request.ts
└── middleware.ts
```

### Naming conventions (apply throughout)
- Files: `kebab-case.ts`. Component files: `kebab-case.tsx` (one PascalCase component per file).
- Folders with multiple files use no `index.ts` barrel unless re-exporting >3 entries. Import the file directly.
- Types files: noun, no `-types` suffix (e.g. `pricing.ts`, not `pricing-types.ts`).
- Constants files: noun, no `-constants` suffix (e.g. `nav.ts`, not `nav-constants.ts`).
- Suffix `.server.ts` only when the file uses `server-only` package or fetch+secrets; otherwise place in `lib/server/`.

---

## Phase 0 — Baseline

### Task 0.1: Snapshot the current build

**Files:** none.

- [ ] **Step 1:** `npm run typecheck` — expected: passes (record errors if any so they aren't blamed on the refactor).
- [ ] **Step 2:** `npm run build` — expected: succeeds. Record build output size.
- [ ] **Step 3:** `git status` — expected: clean working tree. Commit any uncommitted work before starting.

### Task 0.2: Create the new top-level directories

**Files:**
- Create: `src/constants/.gitkeep`
- Create: `src/content/uk/.gitkeep`, `src/content/en/.gitkeep`, `src/content/uk/comparisons/.gitkeep`, `src/content/en/comparisons/.gitkeep`
- Create: `src/types/.gitkeep`
- Create: `src/lib/server/.gitkeep`, `src/lib/client/.gitkeep`, `src/lib/shared/.gitkeep`
- Create: `src/components/layout/.gitkeep`, `src/components/vs-pages/.gitkeep`

- [ ] **Step 1:** Create empty directories with `.gitkeep` files.
- [ ] **Step 2:** `npm run typecheck` — expected: still passes (no code changed yet).
- [ ] **Step 3:** Commit: `chore(refactor): scaffold new folder structure`.

---

## Phase 1 — Extract shared types

Goal: every type used in >1 file lives under `src/types/`. Component files import types instead of defining them.

### Task 1.1: Extract `FAQItem`

**Files:**
- Create: `src/types/faq.ts`
- Modify: `src/components/blocks/final/index.tsx` (remove inline `type FAQItem`, import from `@/types/faq`)
- Modify: any file currently inlining FAQ item shape (search: `question:` + `answer:`)

- [ ] **Step 1:** Create `src/types/faq.ts`:

```ts
export type FAQItem = {
  question: string;
  answer: string;
};
```

- [ ] **Step 2:** In `src/components/blocks/final/index.tsx`, delete the inline `type FAQItem = ...` and add `import type { FAQItem } from "@/types/faq";` at the top.
- [ ] **Step 3:** Grep for inline FAQ types: `Grep pattern="question: string;\s*answer: string" type=tsx`. For each hit, replace inline definition with the import.
- [ ] **Step 4:** `npm run typecheck` — expected: passes.
- [ ] **Step 5:** Commit: `refactor(types): extract FAQItem to src/types/faq.ts`.

### Task 1.2: Extract pricing/calculator types

**Files:**
- Create: `src/types/pricing.ts`
- Modify: `src/components/blocks/comparison/index.tsx` (remove `TierProps`, `TableRowData`)
- Modify: `src/lib/pricing-calculator-config.ts` (move `CalculatorInput`, `CalculatorEstimate` out)
- Modify: `src/lib/calculate-website-estimate.ts` (import from new location)
- Modify: `src/components/calculator/*.tsx` (update imports)

- [ ] **Step 1:** Create `src/types/pricing.ts` and copy the following type definitions verbatim from their current homes:
  - `TierProps` (from `blocks/comparison/index.tsx`)
  - `TableRowData` (from `blocks/comparison/index.tsx`)
  - `CalculatorInput` (from `lib/pricing-calculator-config.ts`)
  - `CalculatorEstimate` (from `lib/pricing-calculator-config.ts`)
- [ ] **Step 2:** Re-export from old locations as a temporary shim: in each old file, replace the type definition with `export type { TierProps } from "@/types/pricing";` etc. This keeps existing imports working.
- [ ] **Step 3:** Update all importers to import directly from `@/types/pricing`. Use `Grep -l "TierProps|TableRowData|CalculatorInput|CalculatorEstimate"` to find them.
- [ ] **Step 4:** Delete the re-export shims from the old files.
- [ ] **Step 5:** `npm run typecheck` — expected: passes.
- [ ] **Step 6:** Commit: `refactor(types): extract pricing types to src/types/pricing.ts`.

### Task 1.3: Extract homepage display types

**Files:**
- Create: `src/types/homepage.ts`
- Modify: `src/components/homepage/index.tsx` (remove inline types `Industry`, `BentoCell`, `MarqueeLogo`, `CaseRef`, `TestimonialItem`)
- Modify: `src/app/page.tsx`, `src/app/en/page.tsx` (remove duplicate `Industry`, `BentoCell` definitions)

- [ ] **Step 1:** Create `src/types/homepage.ts` containing the union of all five types as defined in `components/homepage/index.tsx`. Compare carefully against the duplicates in `app/page.tsx` and `app/en/page.tsx` — if shapes differ, copy the *uk* version and note the divergence in the commit message.
- [ ] **Step 2:** Replace inline definitions with `import type { Industry, BentoCell, MarqueeLogo, CaseRef, TestimonialItem } from "@/types/homepage";`.
- [ ] **Step 3:** `npm run typecheck` — expected: passes.
- [ ] **Step 4:** Commit: `refactor(types): extract homepage section types`.

### Task 1.4: Extract comparison page types

**Files:**
- Create: `src/types/comparisons.ts`
- Modify: `src/components/vs-constructors/index.tsx`, `src/components/vs-freelancers/index.tsx`, `src/components/vs-wordpress/index.tsx` (remove inline types)

- [ ] **Step 1:** Open `vs-constructors/index.tsx` and copy each `type Sign`, `type Cost`, `type CompareRow`, `type Builder`, `type PatternRow`, `type DontDo`, `type Content` to `src/types/comparisons.ts`.
- [ ] **Step 2:** Diff the type definitions in vs-freelancers and vs-wordpress against vs-constructors. They should be identical — if any drift, the *vs-constructors* version is canonical (it's the largest/most-recent). Note any divergence in commit message; if a field is only used by one page, mark it `?` (optional) in the shared type.
- [ ] **Step 3:** Replace inline definitions in all three vs-* files with imports from `@/types/comparisons`.
- [ ] **Step 4:** `npm run typecheck` — expected: passes.
- [ ] **Step 5:** Commit: `refactor(types): extract comparison page types`.

### Task 1.5: Extract `LeadValues`

**Files:**
- Create: `src/types/lead.ts`
- Modify: `src/components/blocks/lead-form/index.tsx`, `src/components/calculator/LeadForm.tsx`

- [ ] **Step 1:** Create `src/types/lead.ts` with the `LeadValues` shape from `blocks/lead-form/index.tsx`.
- [ ] **Step 2:** Diff vs the `LeadValues` in `calculator/LeadForm.tsx`. If they differ, take the union and document the merge in the commit body.
- [ ] **Step 3:** Replace inline definitions with imports.
- [ ] **Step 4:** `npm run typecheck` — expected: passes.
- [ ] **Step 5:** Commit: `refactor(types): unify LeadValues in src/types/lead.ts`.

### Task 1.6: Move Sanity types

**Files:**
- Move: `src/lib/sanity/types.ts` → `src/types/sanity.ts`
- Modify: every file importing from `@/lib/sanity/types`

- [ ] **Step 1:** `git mv src/lib/sanity/types.ts src/types/sanity.ts` (or copy + delete on Windows).
- [ ] **Step 2:** Grep for `from "@/lib/sanity/types"` and replace with `from "@/types/sanity"`. Use Edit `replace_all` per file or a single Grep + per-file Edit pass.
- [ ] **Step 3:** `npm run typecheck` — expected: passes.
- [ ] **Step 4:** Commit: `refactor(types): move Sanity types to src/types/sanity.ts`.

### Phase 1 gate

- [ ] **Run** `npm run build` — expected: succeeds, no behavior change.
- [ ] **Confirm** every file under `src/types/` exports only types (no runtime values, no JSX). Run `Grep -L "^export type|^export interface" src/types/*.ts` — should be empty.

---

## Phase 2 — Extract constants (locale-agnostic config)

Goal: every `export const ARRAY = [...]` of options/config/routes lives under `src/constants/`. Components and content files import from there.

### Task 2.1: Move site constants

**Files:**
- Move: `src/lib/site.ts` → split into `src/constants/site.ts` (constants) + `src/lib/shared/page-url.ts` (the `pageUrl()` function)
- Modify: every importer

- [ ] **Step 1:** Create `src/constants/site.ts` containing `SITE_ORIGIN`, `ORG_ID`, `SITE_CONTACT` (the static const exports from old `lib/site.ts`).
- [ ] **Step 2:** Create `src/lib/shared/page-url.ts` containing the `pageUrl()` function. It may import from `@/constants/site` for `SITE_ORIGIN`.
- [ ] **Step 3:** Grep `from "@/lib/site"`. Split each import: type/constant imports go to `@/constants/site`; `pageUrl` goes to `@/lib/shared/page-url`.
- [ ] **Step 4:** Delete `src/lib/site.ts`.
- [ ] **Step 5:** `npm run typecheck` — expected: passes.
- [ ] **Step 6:** Commit: `refactor(constants): split site.ts into constants + lib/shared`.

### Task 2.2: Make pricing tiers the single source of truth

**Files:**
- Move: `src/lib/pricing/tiers.ts` → `src/constants/pricing-tiers.ts`
- Modify: `src/app/page.tsx`, `src/app/en/page.tsx`, `src/app/pricing/page.tsx`, `src/app/en/pricing/page.tsx` (delete inline `HOMEPAGE_TIERS`, import from constants; if shapes differ, the page-level shape moves to `content/`, see Phase 3)

- [ ] **Step 1:** Move the file and update imports (`Grep "from \"@/lib/pricing/tiers\""`).
- [ ] **Step 2:** Diff inline `HOMEPAGE_TIERS` in `app/page.tsx` against `TIER_AMOUNTS`/`TIER_NAMES`/`TIER_WEEKS`. The page array is a display projection — keep it as-is for now but make it derive from the constants (e.g. `const HOMEPAGE_TIERS = TIER_NAMES.map(...)`). Do NOT change rendered output.
- [ ] **Step 3:** Repeat for `app/en/page.tsx` and pricing pages.
- [ ] **Step 4:** `npm run typecheck` and visually diff the pages by running `npm run dev` and loading `/`, `/en`, `/pricing`, `/en/pricing`. Expected: no visual change.
- [ ] **Step 5:** Commit: `refactor(constants): canonicalize pricing-tiers, eliminate inline duplicates`.

### Task 2.3: Move calculator config

**Files:**
- Move: `src/lib/pricing-calculator-config.ts` → `src/constants/calculator-config.ts` (constants only; types already extracted in 1.2)
- Modify: every importer

- [ ] **Step 1:** Move the file. Update internal imports (any `import type` already points at `@/types/pricing` from Task 1.2).
- [ ] **Step 2:** Grep `from "@/lib/pricing-calculator-config"` and replace.
- [ ] **Step 3:** `npm run typecheck` — expected: passes.
- [ ] **Step 4:** Commit: `refactor(constants): move calculator config`.

### Task 2.4: Move i18n routes

**Files:**
- Move: `src/lib/i18n-routes.ts` → `src/constants/i18n-routes.ts`
- Modify: `src/middleware.ts`, `src/app/sitemap.ts`, `src/i18n/request.ts`, any other importers

- [ ] **Step 1:** Move and update imports.
- [ ] **Step 2:** `npm run typecheck`, then `npm run dev` and visit `/`, `/en`, `/en/about` to confirm routing still works.
- [ ] **Step 3:** Commit: `refactor(constants): move i18n-routes`.

### Task 2.5: Extract navigation constants

**Files:**
- Move: `src/components/homepage/header-nav.ts` → `src/constants/nav.ts` (rename exports to clarify scope, e.g. `HEADER_NAV_ITEMS`)
- Move: `src/components/homepage/header-services.ts` → fold into `src/constants/nav.ts` as `HEADER_SERVICE_ITEMS`
- Modify: `src/components/homepage/hp-header.tsx`, `hp-footer.tsx`, `mobile-menu.tsx`

- [ ] **Step 1:** Create `src/constants/nav.ts`. Copy both files' exports in, renaming for clarity. Document any reordering in commit body.
- [ ] **Step 2:** Update imports in hp-header.tsx, hp-footer.tsx, mobile-menu.tsx.
- [ ] **Step 3:** Delete the two old files.
- [ ] **Step 4:** `npm run typecheck`. Spot-check navigation in `npm run dev`.
- [ ] **Step 5:** Commit: `refactor(constants): consolidate nav constants`.

### Task 2.6: Extract form options

**Files:**
- Create: `src/constants/form-options.ts`
- Modify: `src/components/blocks/lead-form/index.tsx`, `src/components/calculator/LeadForm.tsx` (remove inline `BUSINESS_OPTS_BY_LOCALE`, `TIER_OPTS_BY_LOCALE`)

- [ ] **Step 1:** Create `src/constants/form-options.ts`. Copy both constants from `blocks/lead-form/index.tsx`.
- [ ] **Step 2:** Diff against any duplicate definitions in `calculator/LeadForm.tsx`. If identical, both files import from constants. If they differ, save both: `LEAD_FORM_BUSINESS_OPTS_BY_LOCALE` and `CALCULATOR_BUSINESS_OPTS_BY_LOCALE` — and note in commit body why they differ (likely scope: lead form has more options).
- [ ] **Step 3:** Update imports.
- [ ] **Step 4:** `npm run typecheck`. Spot-check the lead form and calculator form render correctly.
- [ ] **Step 5:** Commit: `refactor(constants): extract form options`.

### Phase 2 gate

- [ ] **Run** `npm run build` — expected: succeeds.
- [ ] **Confirm** every file under `src/constants/` exports only primitives, arrays, or plain-object literals (no functions, no JSX, no runtime imports from `react`/`next`). Grep should show nothing matching `^export function` or `<.*>` (JSX) inside `src/constants/`.

---

## Phase 3 — Extract page content into `src/content/`

Goal: routes in `src/app/**` contain only layout + composition. All large content arrays (FAQs, industries, bento cells, team data, comparison rows) live in `src/content/{uk,en}/`. EN and UK content live side-by-side, importable by the matching route.

### Task 3.1: Extract homepage content

**Files:**
- Create: `src/content/uk/homepage.ts`, `src/content/en/homepage.ts`
- Modify: `src/app/page.tsx`, `src/app/en/page.tsx`

- [ ] **Step 1:** In `src/content/uk/homepage.ts`, export named constants for every inline data array currently in `src/app/page.tsx`: `HOMEPAGE_TIERS`, `HOMEPAGE_FAQ`, `HOMEPAGE_INDUSTRIES`, `HOMEPAGE_BENTO`, `HOMEPAGE_PROCESS`, `HOMEPAGE_PARTNERS`, `HOMEPAGE_CASES`, `HOMEPAGE_JSON_LD`. Use the type imports already extracted in Phase 1 (e.g. `import type { Industry } from "@/types/homepage"`).
- [ ] **Step 2:** Repeat for `src/content/en/homepage.ts`, copying from `src/app/en/page.tsx`.
- [ ] **Step 3:** Rewrite `src/app/page.tsx` to be ~50-100 lines: imports + JSX composition. All arrays come from `@/content/uk/homepage`.
- [ ] **Step 4:** Repeat for `src/app/en/page.tsx`.
- [ ] **Step 5:** `npm run typecheck`. Run `npm run dev`, load `/` and `/en`, visually confirm identical rendering.
- [ ] **Step 6:** Commit: `refactor(content): extract homepage data to src/content/{uk,en}/homepage.ts`.

### Task 3.2: Extract about-page content

**Files:**
- Create: `src/content/uk/about.ts`, `src/content/en/about.ts`
- Modify: `src/app/about/page.tsx`, `src/app/en/about/page.tsx`, `src/components/about/team-section.tsx`

- [ ] **Step 1:** Extract `TEAM`, `VALUES`, `CLIENTS`, any inline FAQ from `app/about/page.tsx` into `content/uk/about.ts`.
- [ ] **Step 2:** Repeat for EN.
- [ ] **Step 3:** In `components/about/team-section.tsx`, accept `team` as a prop instead of holding it inline; the data flows from the page.
- [ ] **Step 4:** Rewrite both about page files as thin composition.
- [ ] **Step 5:** `npm run typecheck`, then visually verify both about pages.
- [ ] **Step 6:** Commit: `refactor(content): extract about-page data`.

### Task 3.3: Extract process-page content

**Files:**
- Create: `src/content/uk/process.ts`, `src/content/en/process.ts`
- Modify: `src/app/process/page.tsx`, `src/app/en/process/page.tsx`

- [ ] **Step 1:** Extract STEPS array (and any other inline content) for both locales.
- [ ] **Step 2:** Rewrite both pages thin.
- [ ] **Step 3:** `npm run typecheck`. Visual verify.
- [ ] **Step 4:** Commit: `refactor(content): extract process-page data`.

### Task 3.4: Extract pricing-page content

**Files:**
- Create: `src/content/uk/pricing.ts`, `src/content/en/pricing.ts`
- Modify: `src/app/pricing/page.tsx`, `src/app/en/pricing/page.tsx`

- [ ] **Step 1:** Extract FAQ, comparison rows, tier display arrays. Reference `@/constants/pricing-tiers` for canonical numbers — content holds display labels/copy only.
- [ ] **Step 2:** Rewrite both pages thin.
- [ ] **Step 3:** `npm run typecheck`. Visual verify.
- [ ] **Step 4:** Commit: `refactor(content): extract pricing-page data`.

### Task 3.5: Extract services content (used by `blocks/services`)

**Files:**
- Create: `src/content/uk/services.ts`, `src/content/en/services.ts`
- Modify: `src/components/blocks/services/index.tsx` to accept `services` prop instead of inlining the array.
- Modify: callers of `<Services />` to pass the right locale's content.

- [ ] **Step 1:** Move the inline `SERVICES` array to both locale files.
- [ ] **Step 2:** Refactor the component to be data-driven via props.
- [ ] **Step 3:** Update each `<Services />` usage site.
- [ ] **Step 4:** `npm run typecheck`. Visual verify any page using the services block.
- [ ] **Step 5:** Commit: `refactor(content): extract services data, make blocks/services data-driven`.

### Task 3.6: Extract comparison-page content (vs-constructors / freelancers / wordpress)

**Files:**
- Create: `src/content/uk/comparisons/vs-constructors.ts`, `src/content/en/comparisons/vs-constructors.ts`
- Create: `src/content/uk/comparisons/vs-freelancers.ts`, `src/content/en/comparisons/vs-freelancers.ts`
- Create: `src/content/uk/comparisons/vs-wordpress.ts`, `src/content/en/comparisons/vs-wordpress.ts`
- Modify: `src/components/vs-constructors/index.tsx`, `src/components/vs-freelancers/index.tsx`, `src/components/vs-wordpress/index.tsx` (data inlined here moves out)

Note: this task is data extraction only. The component split happens in Phase 5 (Task 5.3). Doing them separately keeps each commit reviewable.

- [ ] **Step 1:** For each of the 3 comparison components, the file currently holds *both* UK and EN content arrays gated by locale. Pull each language's content into the matching `content/{uk,en}/comparisons/vs-*.ts` file as named exports (e.g. `VS_CONSTRUCTORS_CONTENT: Content`, typed via `@/types/comparisons`).
- [ ] **Step 2:** Replace the inline arrays in each component with `import { VS_CONSTRUCTORS_CONTENT as UK_CONTENT } from "@/content/uk/comparisons/vs-constructors";` plus the EN import; the existing locale-pick logic stays in place for now.
- [ ] **Step 3:** `npm run typecheck`. Visual verify all six comparison page renders (/vs-constructors, /vs-freelancers, /vs-wordpress and EN variants).
- [ ] **Step 4:** Commit: `refactor(content): extract comparison-page data`.

### Task 3.7: Move contacts data into content

**Files:**
- Move: `src/lib/contacts.ts` → split into `src/content/uk/contacts.ts` + `src/content/en/contacts.ts` (each holds only its own locale's data; consumers import the right one)
- Modify: every importer of `@/lib/contacts`

- [ ] **Step 1:** Split the file by locale. Type imports continue from `@/types/...` if needed (or define narrow local types in the same file if not shared).
- [ ] **Step 2:** Update consumers. A consumer that needs both locales (e.g. footer) imports both and picks by `useLocale()` or route prop.
- [ ] **Step 3:** Delete `src/lib/contacts.ts`.
- [ ] **Step 4:** `npm run typecheck`. Visual verify footer and `/contacts` (uk + en).
- [ ] **Step 5:** Commit: `refactor(content): split contacts by locale`.

### Phase 3 gate

- [ ] **Run** `npm run build` — expected: succeeds.
- [ ] **Confirm** files in `src/app/**/page.tsx` are dramatically smaller. Spot check: `src/app/page.tsx` should be < ~120 lines (was 287). `src/app/en/page.tsx` should be < ~150 lines (was 494).
- [ ] **Confirm** no `export const SOMETHING_ARRAY = [` declarations remain inside `src/app/**`. Run `Grep "^const [A-Z_]+ = \[" src/app` — should return nothing meaningful.

---

## Phase 4 — Split lib/ into server / client / shared

Goal: every `lib/` file is unambiguous about runtime. Files that fetch with secrets or import Sanity move to `lib/server/`. Pure utilities used in both runtimes move to `lib/shared/`. Files used only inside `"use client"` components move to `lib/client/`.

### Task 4.1: Move shared (pure, runtime-agnostic) utilities

**Files:**
- Move: `src/lib/utils.ts` → `src/lib/shared/cn.ts` (rename — file holds only `cn()`)
- Move: `src/lib/formatters/price.ts` → `src/lib/shared/format-price.ts`
- Move: `src/components/calculator/formatters.ts` → `src/lib/shared/format-eur.ts` (rename: file holds `formatEur` + `formatPercent`)
- Move: `src/lib/calculate-website-estimate.ts` → `src/lib/shared/calculate-website-estimate.ts`
- Move: `src/lib/case-presentation.ts` → `src/lib/shared/case-presentation.ts`
- Move: `src/lib/rich-text.tsx` → `src/lib/shared/rich-text.tsx`

- [ ] **Step 1:** Move each file. Update all imports. Use one commit per file or one bulk commit, your call — but type-check between each rename.
- [ ] **Step 2:** Delete the now-empty `src/lib/formatters/` folder.
- [ ] **Step 3:** `npm run typecheck` and `npm run build`. Expected: both pass.
- [ ] **Step 4:** Commit: `refactor(lib): move shared utilities to lib/shared/`.

### Task 4.2: Move server-only modules

**Files:**
- Move: `src/lib/sanity/client.ts` → `src/lib/server/sanity-client.ts`
- Move: `src/lib/sanity/fetch.ts` → `src/lib/server/sanity-fetch.ts`
- Move: `src/lib/sanity/queries.ts` → `src/lib/server/sanity-queries.ts`
- Move: `src/lib/sanity/locale.ts` → `src/lib/server/sanity-locale.ts` (or `lib/shared/` if used in client too — check first)
- Move: `src/lib/sanity/portable.tsx` → `src/lib/shared/sanity-portable.tsx` (renders React; usable on both runtimes — keep in shared)
- Move: `src/lib/sanity/image.tsx` → `src/lib/shared/sanity-image.tsx` (same)
- Move: `src/components/homepage/pull-quote-swiper/fetch-testimonials.ts` → `src/lib/server/fetch-testimonials.ts`

- [ ] **Step 1:** Before moving each Sanity file, check whether it imports `next/headers`, uses `process.env`, or is currently only imported from server components (page.tsx, layout.tsx, route.ts, or other server files). If yes → `lib/server/`. If it renders JSX with no server-only API usage → `lib/shared/`.
- [ ] **Step 2:** Move files. Update all imports.
- [ ] **Step 3:** Delete the now-empty `src/lib/sanity/` and `src/lib/pricing/` folders.
- [ ] **Step 4:** Add `import "server-only";` at the top of every file in `lib/server/` (provides build-time safety against accidental client bundling).
- [ ] **Step 5:** `npm run typecheck` and `npm run build`. Expected: both pass; build will error if any `"use client"` file accidentally imports a `server-only` module — fix by either re-categorizing the module or refactoring the caller.
- [ ] **Step 6:** Commit: `refactor(lib): move server-only modules to lib/server/`.

### Task 4.3: Identify client-only helpers (if any)

**Files:** TBD by inspection.

- [ ] **Step 1:** Grep for any `lib/shared/` file that imports React hooks, `framer-motion`, or `next-themes` runtime hooks. Such a file likely should be `lib/client/` or split.
- [ ] **Step 2:** If none found, that's fine — leave `lib/client/` empty for future client-only utilities. Document "no client-only helpers currently" in the commit body.
- [ ] **Step 3:** Commit if any moves were needed.

### Phase 4 gate

- [ ] **Run** `npm run build` — expected: succeeds with no `server-only` violation warnings.
- [ ] **Confirm** `src/lib/` directly contains no `.ts` / `.tsx` files — only the three subfolders.

---

## Phase 5 — Decompose monolithic component files

Goal: every component file exports one component. Files over ~250 lines are split into a folder.

### Task 5.1: Split `components/homepage/index.tsx` (~980 lines, 7+ components)

**Files:**
- Convert: `src/components/homepage/index.tsx` (980 lines) → `src/components/homepage/` folder with one file per section.

New layout:
```
src/components/homepage/
├── marquee.tsx
├── industries.tsx
├── bento.tsx
├── process-section.tsx       # NOT the same as homepage/process.tsx (which is client-side)
├── cases.tsx
├── stack.tsx
├── section-head.tsx          # the helper SectionHead — but consider moving to components/shared/ since vs-* also uses it; see Task 5.4
├── hp-header.tsx             # already its own file — keep
├── hp-footer.tsx             # already its own file — keep
├── mobile-menu.tsx           # already its own file — keep
├── locale-switcher.tsx       # already its own file — keep
├── newsletter.tsx            # already its own file — keep
├── scroll-reveal.tsx         # already its own file — keep
├── process.tsx               # already its own file (client animation) — keep but rename to process-animation.tsx for clarity
├── pull-quote-swiper/        # already its own folder — keep
└── related-card-reexport.tsx # if the index re-exports blocks/related-card, replace re-export with direct imports at call sites and delete this
```

- [ ] **Step 1:** Read the full `index.tsx`. Identify each exported component and its dependency footprint (props, types, inline subcomponents, content arrays — content arrays should already be gone after Phase 3).
- [ ] **Step 2:** For each component, create the new file. Move the component code in. Move any subcomponent used only by it to the same file. If a subcomponent is shared, move it to `components/shared/` instead.
- [ ] **Step 3:** Delete the old `index.tsx` or replace it with a barrel re-export *temporarily* (one commit) to avoid churning all call sites.
- [ ] **Step 4:** Update all callers (`Grep "from \"@/components/homepage\""`) to import the specific file (`@/components/homepage/bento`, etc.). Then remove the temporary barrel.
- [ ] **Step 5:** Rename `process.tsx` → `process-animation.tsx` if it conflicts with the new `process-section.tsx`.
- [ ] **Step 6:** `npm run typecheck`. Run `npm run dev`, load `/` and `/en`, visually verify every section renders unchanged.
- [ ] **Step 7:** Commit: `refactor(homepage): split monolithic index.tsx into one section per file`.

### Task 5.2: Split `components/calculator/CalculatorControls.tsx` (520 lines)

**Files:**
- Convert: `src/components/calculator/CalculatorControls.tsx` → folder `src/components/calculator/controls/` with one sub-control per file. Suggested split:
  - `project-type-control.tsx`
  - `design-complexity-control.tsx`
  - `pages-control.tsx`
  - `cms-control.tsx`
  - `seo-control.tsx`
  - `features-control.tsx`
  - `integrations-control.tsx`
  - `controls-shell.tsx` (the Formik wrapper that composes them all — this replaces the old `CalculatorControls`)

- [ ] **Step 1:** Identify each logical sub-control block. They likely already have visual section dividers.
- [ ] **Step 2:** Extract each sub-control to its own file. Each accepts the relevant Formik field props or values via a narrow prop interface (not the whole form state).
- [ ] **Step 3:** Rewrite `controls-shell.tsx` to compose them.
- [ ] **Step 4:** Update `WebsiteCalculator.tsx` to import the shell.
- [ ] **Step 5:** `npm run typecheck`. Manually test the calculator: change project type, page count, features, observe estimate updates.
- [ ] **Step 6:** Commit: `refactor(calculator): split CalculatorControls into per-section files`.

### Task 5.3: Unify vs-constructors / vs-freelancers / vs-wordpress (~1700-1900 lines each)

**Files:**
- Create: `src/components/vs-pages/vs-page-layout.tsx` (the shared layout + section composition extracted from the three files)
- Create: `src/components/vs-pages/vs-hero.tsx`, `vs-comparison-table.tsx`, `vs-pattern-section.tsx`, `vs-dont-do-section.tsx`, `vs-cta-section.tsx`, etc. — one file per distinct section of a comparison page.
- Modify: `src/components/vs-constructors/index.tsx`, `vs-freelancers/index.tsx`, `vs-wordpress/index.tsx` → each becomes a ~30-line file that does `<VsPageLayout content={VS_CONSTRUCTORS_CONTENT_UK or _EN} />`.

- [ ] **Step 1:** Open all three current files side-by-side. Diff their JSX. The non-content portions (layout, section wrappers, helpers like `SectionHead`, `VsLayout`) should be ~95% identical — confirm before continuing.
- [ ] **Step 2:** Build `vs-page-layout.tsx` driven entirely by the `Content` type (from `@/types/comparisons`, see Task 1.4). Every section reads from `content.*` fields.
- [ ] **Step 3:** Extract each visual section as its own file under `components/vs-pages/`, taking narrow props (the specific slice of `Content` they need — not the whole `Content` object).
- [ ] **Step 4:** Rewrite the three `vs-*/index.tsx` to thin wrappers selecting the right content per locale.
- [ ] **Step 5:** `npm run typecheck`. Run `npm run dev`, visit all six comparison pages, visually diff against the pre-refactor screenshots. Expected: identical.
- [ ] **Step 6:** Commit: `refactor(vs-pages): unify three comparison pages into shared layout`.

### Task 5.4: Lift `SectionHead` into `components/shared/`

**Files:**
- Create: `src/components/shared/section-head.tsx`
- Modify: `src/components/homepage/section-head.tsx` (delete after migration), `src/components/vs-pages/vs-page-layout.tsx`, any other inline copies.

- [ ] **Step 1:** Pick the most fully-featured `SectionHead` definition (likely the homepage one).
- [ ] **Step 2:** Move to `components/shared/section-head.tsx`. Confirm prop API covers all current usages by diffing with the inline versions.
- [ ] **Step 3:** Update all importers; delete the duplicates.
- [ ] **Step 4:** `npm run typecheck`. Visual verify a few pages.
- [ ] **Step 5:** Commit: `refactor(shared): lift SectionHead to components/shared`.

### Task 5.5: Split `components/blocks/final/index.tsx` (532 lines)

**Files:**
- Convert: `src/components/blocks/final/index.tsx` → folder `src/components/blocks/final/` with:
  - `faq-section.tsx` (the FAQ component)
  - `social-icons.tsx` (the SocialIcon component)
  - `final.tsx` (the main exported component composing FAQ + social)

- [ ] **Step 1:** Identify the three logical pieces. Extract.
- [ ] **Step 2:** Update importers (likely few — the block is used from page composition).
- [ ] **Step 3:** `npm run typecheck`. Visual verify the final block on any page that uses it.
- [ ] **Step 4:** Commit: `refactor(blocks): split blocks/final into per-component files`.

### Task 5.6: Split `components/blocks/comparison/index.tsx` (438 lines)

**Files:**
- Convert: `components/blocks/comparison/index.tsx` → folder `components/blocks/comparison/` with `tier.tsx`, `table-row.tsx`, `comparison.tsx` (main).

- [ ] **Step 1:** Extract `Tier` and `TableRow` components into their own files. Types already live in `@/types/pricing` from Task 1.2.
- [ ] **Step 2:** Update importers.
- [ ] **Step 3:** `npm run typecheck`. Visual verify pricing/comparison renders.
- [ ] **Step 4:** Commit: `refactor(blocks): split blocks/comparison`.

### Task 5.7: Split `components/blocks/lead-form/index.tsx` (547 lines)

**Files:**
- Convert to folder: `components/blocks/lead-form/` with:
  - `lead-form.tsx` (main)
  - `validation.ts` (Yup schema — extract)
  - `submit.ts` (submission handler — extract; this can call `/api/lead`)
  - Constants already extracted in Task 2.6.

- [ ] **Step 1:** Pull the Yup schema into its own file.
- [ ] **Step 2:** Pull the submit/onSubmit handler into its own file.
- [ ] **Step 3:** Trim `lead-form.tsx` to component-only.
- [ ] **Step 4:** `npm run typecheck`. Manually submit a test lead in dev to confirm wiring.
- [ ] **Step 5:** Commit: `refactor(lead-form): split into component / validation / submit`.

### Task 5.8: Audit and split remaining 250+ line component files

Candidates from the audit (re-check line count after prior phases — many shrink once content is extracted):
- `src/components/about/team-section.tsx` (~400 lines)
- `src/components/case-page/index.tsx` (~680 lines)
- `src/components/industry-page/index.tsx` (~681 lines)
- `src/components/blocks/hero/index.tsx` (~307 lines)
- `src/components/blocks/services/index.tsx` (~388 lines)
- `src/components/blocks/outcome/index.tsx` (~337 lines)
- `src/components/calculator/WebsiteCalculator.tsx` (~380 lines)
- `src/components/calculator/LeadForm.tsx` (~285 lines)
- `src/components/calculator/EstimateSummary.tsx` (~240 lines)
- `src/components/homepage/mobile-menu.tsx` (~266 lines)

For each:

- [ ] **Step 1:** Re-measure line count after Phases 1-4. If under 250 lines, skip.
- [ ] **Step 2:** If still over, identify the largest sibling components or repeated JSX sub-trees inside. Convert the file to a folder.
- [ ] **Step 3:** Extract each substantial sub-piece (usually 50+ lines or a self-contained widget) to its own file.
- [ ] **Step 4:** `npm run typecheck`. Visual verify the affected page.
- [ ] **Step 5:** Commit per file: `refactor(<folder>): split <name> into per-component files`.

### Task 5.9: Move site-chrome components to `components/layout/`

**Files:**
- Move: `src/components/homepage/hp-header.tsx` → `src/components/layout/site-header.tsx`
- Move: `src/components/homepage/hp-footer.tsx` → `src/components/layout/site-footer.tsx`
- Move: `src/components/homepage/mobile-menu.tsx` → `src/components/layout/mobile-menu.tsx`
- Move: `src/components/homepage/locale-switcher.tsx` → `src/components/layout/locale-switcher.tsx`

Rationale: these render on every page, not just the homepage. The "homepage" folder name is misleading.

- [ ] **Step 1:** Move files. Rename exports if you renamed files (`HpHeader` → `SiteHeader`).
- [ ] **Step 2:** Update importers — primarily `src/app/layout.tsx` and `src/app/en/layout.tsx`.
- [ ] **Step 3:** `npm run typecheck`. Visual verify header + footer + mobile menu on a few pages.
- [ ] **Step 4:** Commit: `refactor(layout): move site chrome to components/layout/`.

### Phase 5 gate

- [ ] **Run** `npm run build` — expected: succeeds.
- [ ] **Confirm** no component file under `src/components/` is over ~300 lines. Spot-check with `Grep -c "^" src/components/**/*.tsx` (rough line count) — investigate any outliers.
- [ ] **Confirm** every component file exports exactly one default-or-named React component. Files exporting `>1` component should be split (rare exception: tightly-coupled helpers like a `Provider` + its `useContext` hook in the same file).

---

## Phase 6 — Polish + documentation

### Task 6.1: Convert `app/page.tsx` and `app/en/page.tsx` (and other duplicated locale pages) to share a single component

**Files:**
- For each route that exists at both `/foo` and `/en/foo` with near-identical structure: create `src/components/pages/<name>.tsx` taking `locale` (or content) as a prop. Both route files become 5-line wrappers.

This is optional polish — only do if the diff is genuinely small. Many pages will differ enough in content shape that keeping two files is clearer.

- [ ] **Step 1:** Diff each pair (`app/<route>/page.tsx` vs `app/en/<route>/page.tsx`). Score the structural overlap.
- [ ] **Step 2:** For pairs >90% identical: extract shared component, wrap both routes around it.
- [ ] **Step 3:** Leave the rest alone. Document the decision in the commit body for transparency.
- [ ] **Step 4:** `npm run typecheck` + visual verify each affected pair.
- [ ] **Step 5:** Commit: `refactor(routes): share page components between locale routes (where applicable)`.

### Task 6.2: Add a README to each top-level src/ folder

**Files:**
- Create: `src/components/README.md`, `src/constants/README.md`, `src/content/README.md`, `src/lib/README.md`, `src/types/README.md`.

Each README is short (15-30 lines) and answers:
- What belongs here?
- What does NOT belong here? (point to the right sibling)
- Naming convention.
- A 2-3 file example.

- [ ] **Step 1:** Draft each README. Keep them tight — these are quick-reference for the next developer, not handbooks.
- [ ] **Step 2:** Commit: `docs: add per-folder READMEs explaining the structure`.

### Task 6.3: Update the root `README.md` and `docs/PROJECT_AUDIT.md`

**Files:**
- Modify: `Frontend/README.md` — add a "Project structure" section linking to the per-folder READMEs.
- Modify: `Frontend/docs/PROJECT_AUDIT.md` — note that the audit has been acted on (or update to reflect new structure).

- [ ] **Step 1:** Update READMEs.
- [ ] **Step 2:** Commit: `docs: document new project structure`.

### Phase 6 gate (final)

- [ ] **Run** `npm run typecheck` — expected: passes.
- [ ] **Run** `npm run build` — expected: passes; bundle size should be ≤ baseline from Task 0.1 (it should not have regressed; minor wins possible from better client/server splits).
- [ ] **Run** `npm run dev` and click through every top-level route (uk + en variants). Expected: no visual or functional regression.
- [ ] **Final commit:** none — phases already committed.

---

## Summary of moves (quick reference)

| From | To | Kind |
|---|---|---|
| inline types in components/pages | `src/types/{faq,pricing,homepage,comparisons,lead}.ts` | type extraction |
| `src/lib/sanity/types.ts` | `src/types/sanity.ts` | move |
| `src/lib/site.ts` (constants) | `src/constants/site.ts` | move |
| `src/lib/site.ts` (`pageUrl()`) | `src/lib/shared/page-url.ts` | move |
| `src/lib/pricing/tiers.ts` | `src/constants/pricing-tiers.ts` | move |
| `src/lib/pricing-calculator-config.ts` | `src/constants/calculator-config.ts` | move |
| `src/lib/i18n-routes.ts` | `src/constants/i18n-routes.ts` | move |
| `src/components/homepage/header-nav.ts` + `header-services.ts` | `src/constants/nav.ts` | consolidate |
| inline `BUSINESS_OPTS_BY_LOCALE` / `TIER_OPTS_BY_LOCALE` | `src/constants/form-options.ts` | extract |
| inline page data (FAQ, tiers, industries, bento, team, comparisons) | `src/content/{uk,en}/<page>.ts` | extract |
| `src/lib/contacts.ts` | `src/content/{uk,en}/contacts.ts` | split by locale |
| `src/lib/utils.ts` | `src/lib/shared/cn.ts` | move + rename |
| `src/lib/formatters/price.ts` | `src/lib/shared/format-price.ts` | move |
| `src/components/calculator/formatters.ts` | `src/lib/shared/format-eur.ts` | move |
| `src/lib/calculate-website-estimate.ts` | `src/lib/shared/calculate-website-estimate.ts` | move |
| `src/lib/case-presentation.ts` | `src/lib/shared/case-presentation.ts` | move |
| `src/lib/rich-text.tsx` | `src/lib/shared/rich-text.tsx` | move |
| `src/lib/sanity/{client,fetch,queries,locale}.ts` | `src/lib/server/sanity-*.ts` | move + add `server-only` |
| `src/lib/sanity/{portable,image}.tsx` | `src/lib/shared/sanity-*.tsx` | move |
| `src/components/homepage/pull-quote-swiper/fetch-testimonials.ts` | `src/lib/server/fetch-testimonials.ts` | move |
| `src/components/homepage/index.tsx` (980 lines) | one file per section under `src/components/homepage/` | split |
| `src/components/calculator/CalculatorControls.tsx` (520 lines) | one file per sub-control under `src/components/calculator/controls/` | split |
| `src/components/vs-{constructors,freelancers,wordpress}/index.tsx` | `src/components/vs-pages/vs-page-layout.tsx` + sections; route components become thin wrappers | unify |
| `src/components/blocks/final/index.tsx` (532 lines) | `src/components/blocks/final/{faq-section,social-icons,final}.tsx` | split |
| `src/components/blocks/comparison/index.tsx` (438 lines) | `src/components/blocks/comparison/{tier,table-row,comparison}.tsx` | split |
| `src/components/blocks/lead-form/index.tsx` (547 lines) | `lead-form.tsx` + `validation.ts` + `submit.ts` | split |
| `src/components/homepage/{hp-header,hp-footer,mobile-menu,locale-switcher}.tsx` | `src/components/layout/` | move |
| `SectionHead` (inlined in 2+ files) | `src/components/shared/section-head.tsx` | consolidate |

## Estimated effort

- Phase 0: <30 min
- Phase 1 (types): ~2-3 hrs
- Phase 2 (constants): ~2 hrs
- Phase 3 (content extraction): ~4-6 hrs — biggest content-handling phase
- Phase 4 (lib split): ~1-2 hrs
- Phase 5 (component decomposition): ~6-10 hrs — biggest refactor phase
- Phase 6 (polish + docs): ~1-2 hrs

**Total: ~18-25 hours of focused work, spread across ~50 commits.**

Phase boundaries are review gates — `npm run build` must pass at each gate before continuing.

## What this plan deliberately does NOT do

- Does not add tests (the repo has none; adding them is separate scope).
- Does not change rendered output. If a refactor reveals a bug, file it separately.
- Does not migrate prose content into Sanity (one suggested audit follow-up — out of scope here).
- Does not introduce new abstractions beyond folder organization. No new HOCs, hooks, or design-system primitives — only moves and splits.
- Does not change package dependencies or build config.
