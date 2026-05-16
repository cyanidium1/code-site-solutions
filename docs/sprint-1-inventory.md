# Sprint 1 — Phase 0 inventory

> **Branch:** `audit-sprint-1` · **Snapshot:** 2026-05-16
> Phase 0 of the Sprint 1 prompt. No code changes yet — this document
> establishes ground truth before the four implementation tasks. Phase 1
> waits on user approval.

---

## Critical finding before reading further

**The Sprint 1 prompt is based on a stale picture of the repo.** Several
premises in the prompt are factually wrong against the current `master`:

1. **`/vs-*` pages are not empty.** `/vs-wordpress`, `/vs-constructors`,
   `/vs-freelancers` are fully built, rich, ~1300-line files with UA + EN
   copy already shipped (commits `2323660`, `abf26e0`, `9b6b066`). They
   render via hand-coded `Record<Locale, Content>` objects in
   [src/components/vs-wordpress/index.tsx](src/components/vs-wordpress/index.tsx),
   [src/components/vs-constructors/index.tsx](src/components/vs-constructors/index.tsx),
   [src/components/vs-freelancers/index.tsx](src/components/vs-freelancers/index.tsx).
   They are linked from the footer and the sitemap. They live at flat
   routes (`/vs-wordpress`, not `/vs/wordpress`).
2. **The proposed `/vs/[slug]` route does not exist** and was never
   planned — the current pattern is a top-level flat path per competitor,
   not a dynamic nested slug.
3. **The prompt's `/vs/*` copy is shorter and different from what is
   already shipped.** Pulling the prompt's copy in would *replace* longer,
   already-translated UA+EN content with shorter UA-only blocks. That is
   a regression, not the "scaffold from empty" the prompt assumes.
4. **The current homepage tier list is 3 tiers, not 4.** Homepage shows
   Landing / Spec for industry / Custom. `/pricing` shows 4 tiers:
   Landing / Multi-page / Specialized / Custom. The two are not aligned.
5. **Industry page Sanity schema doesn't have a comparison-page block
   library**, but it does have several block types (`comparisonBlock`,
   `reasonsBlock`, `caseBlock`, `faqBlock`, etc.) that overlap with what
   `/vs-*` pages render — see §0.2.
6. **`next-intl` is installed and used**, but only for header/footer/nav
   chrome. Page bodies use either Sanity (`loc(field, locale)`) or
   hand-coded `Record<Locale, Content>` objects — see §0.3.

**These findings change the shape of every task.** Before Phase 1
implementation, I need confirmation on the questions listed in
"Decisions needed before Phase 1" at the end of this document.

---

## 0.1 — Component inventory

All marketing-page block components live under
[src/components/blocks](src/components/blocks) and each has a colocated
CSS file. They are framework-agnostic in that they take props, not data
sources — the props come from either Sanity (`/sites-for/[slug]`) or
hand-coded objects (`/vs-*`, `/`, `/pricing`).

### Hero family

| File | Export | Props (summary) | Used by | Status |
|---|---|---|---|---|
| [src/components/blocks/hero/index.tsx](src/components/blocks/hero/index.tsx) | `HeroEditorial` | `eyebrow`, `h1Lines[]`, `h1Num`, `h1NumLabel`, `lede`, `features[]`, `ctaPrimaryLabel`, `ctaSecondaryLabel`, `ctaSecondaryShowPlay`, `showStats`, `stats[]`, `showTicker`, `tickerItems[]`, `deviceTags[]`, `deviceMockupSrc` | `/`, `/en`, `/sites-for/[slug]`, `/vs-wordpress`, `/vs-constructors`, `/vs-freelancers` (and EN twins) | **Needs extension.** CTAs are bare `<button>`s — no `ctaPrimaryHref` / `ctaSecondaryHref` props. Task 2 (homepage CTA-2 → `/contacts?source=hero-audit`) requires adding those props before it can be implemented cleanly. |
| [src/components/blocks/page-hero/index.tsx](src/components/blocks/page-hero/index.tsx) | `PageHero` | `breadcrumbs[]`, `eyebrow`, `headline`, `sub` | `/pricing`, `/calculator`, `/contacts` | Ready as-is. |

### Stat / metric rows

| File | Export | Props | Used by | Status |
|---|---|---|---|---|
| [src/components/blocks/stats-bar/index.tsx](src/components/blocks/stats-bar/index.tsx) | `StatsBar` | `items: { value, label }[]` | `/calculator`, `/sites-for/[slug]` (via `statsBlock`) | Ready as-is. Same look as the "metric strip" the prompt describes. |

### PAS-style cards (3-causes block)

| File | Export | Props | Used by | Status |
|---|---|---|---|---|
| [src/components/blocks/reasons/index.tsx](src/components/blocks/reasons/index.tsx) | `Reasons` | `eyebrow`, `eyebrowNum`, `heading`, `metaRows[]`, `items: Reason[]` (`n`, `tag`, `title`, `body`, `stat`), `footText`, `footCtaLabel` | `/sites-for/medicine` (via `reasonsBlock`) | Ready as-is. **This is the existing PAS card row** the prompt refers to. |

### Comparison tables + pricing tiers

| File | Exports | Props | Used by | Status |
|---|---|---|---|---|
| [src/components/blocks/comparison/index.tsx](src/components/blocks/comparison/index.tsx) | `Comparison`, `Tier`, `TableRow`, `TierProps`, `TableRowData` | `Comparison`: heading, headers, rows, contact form fields, tiers. `Tier`: `name`, `price`, `priceLabel`, `weeks`, `popular`, `popularLabel`, `includes`, `excludes`, `ctaLabel`, `ctaGhost`, `ctaHref` | `/`, `/pricing`, `/sites-for/[slug]` (via `comparisonBlock`), all `/vs-*` pages | **Mostly ready.** `Tier` already accepts `ctaHref`. To add a `Кому підходить` line for Task 4 it needs one new prop, e.g. `bestFor?: React.ReactNode`. |

The `Tier` component is the single shared pricing-card. `Comparison` is the bigger combined block (header table + form + tiers grid) used inside the medicine page.

### Outcome / before-after blocks

| File | Exports | Used by |
|---|---|---|
| [src/components/blocks/outcome/index.tsx](src/components/blocks/outcome/index.tsx) | `Outcome`, `MockPages`, `MockBookingForm`, `MockAdmin` | `/sites-for/[slug]` (via `outcomeBlock`) |
| [src/components/blocks/case/index.tsx](src/components/blocks/case/index.tsx) | `Case` | `/sites-for/[slug]` (via `caseBlock`) |

Both are tightly themed for industry pages but their props are generic
enough to reuse on `/vs-*` if needed.

### Image + text

| File | Export | Used by | Status |
|---|---|---|---|
| [src/components/blocks/image-text/index.tsx](src/components/blocks/image-text/index.tsx) | `ImageText` (variants: `side`, `side-with-list`, `centered`) | `/pricing`, `/sites-for/[slug]` (via `imageTextBlock`) | Ready as-is. Has optional `cta` prop. |

### FAQ / Audit / Footer (final block group)

| Export | File | Used by | Status |
|---|---|---|---|
| `FAQ` (heading + `items: FAQItem[]`) | [src/components/blocks/final/index.tsx](src/components/blocks/final/index.tsx) | `/`, `/pricing`, `/contacts`, `/calculator`, `/sites-for/[slug]`, all `/vs-*` | Ready as-is. |
| `Audit` (lead-magnet form for medicine) | same | `/sites-for/medicine` (via `auditBlock`) | Tightly themed for medicine audit. |
| `ClinicFooter` | same | `/sites-for/[slug]` only | Industry-specific footer, NOT used elsewhere. |

### CTA bands

| File | Export | Used by | Status |
|---|---|---|---|
| [src/components/blocks/cta-banner/index.tsx](src/components/blocks/cta-banner/index.tsx) | `CtaBanner` (`eyebrow`, `heading`, `sub`, `ctaPrimary`, `ctaSecondary`) | `/pricing` | Ready as-is. Takes `{ label, href }` for each CTA. |
| `FinalCta3` | [src/components/homepage/index.tsx](src/components/homepage/index.tsx:984) | `/`, `/en`, `/pricing`, `/contacts`, all `/vs-*` | Ready as-is. 3-card final CTA section. |

### Lead form + contact split

| File | Export | Props | Used by | Status |
|---|---|---|---|---|
| [src/components/blocks/lead-form/index.tsx](src/components/blocks/lead-form/index.tsx) | `LeadForm`, `LeadFormVariant` | `source?`, `variant?` | `/contacts` (via `ContactSplit`) | **Already reads `?tier=` and prefills the tier select** via `useSearchParams()`. Adds `source` to the POST body to `/api/lead`. |
| [src/components/blocks/contact-split/index.tsx](src/components/blocks/contact-split/index.tsx) | `ContactSplit` | `source?`, `variant?` | `/contacts` | Ready as-is. |

### Other utility blocks (not directly relevant to Sprint 1)

`team-cards`, `services` (`Services` + `MEDICINE_FEATURE_ICONS`),
`turnkey-list`, `vertical-timeline`. None of these are touched by the
four tasks.

### Homepage section components (used only on `/` and `/en`)

[src/components/homepage/index.tsx](src/components/homepage/index.tsx) is
a 1044-line module exporting `Marquee`, `Industries`, `Bento`,
`Process` (re-export), `Cases`, `Stack`, `PullQuote`, `FinalCta3`,
`Newsletter` (re-export), `HpFooter` (re-export), `HpHeader`
(re-export). These are page-section sized and not reused on other
pages.

### Verdict for Phase 1 task mapping

- **Task 1 (vs-*):** Every block the prompt's `/vs/*` copy needs already
  exists. The current `/vs-*` pages already use `HeroEditorial`, a
  custom inline "Cost cards" grid, the side-by-side `cmp-table` markup
  from [comparison.css](src/components/blocks/comparison/comparison.css),
  `Tier` for pricing, `FAQ` for FAQ, and `FinalCta3` for the bottom CTA.
- **Task 2 (hero CTA):** Blocked on adding `ctaPrimaryHref` and
  `ctaSecondaryHref` props to `HeroEditorial`. Trivial change.
- **Task 4 (Pro Plus tier):** Blocked on adding a `bestFor` prop to
  `Tier` (or rendering "Кому підходить" inside an existing
  `includes`/`excludes` slot, which would be hacky).

---

## 0.2 — Sanity schema inventory

### Where schemas live

The Sanity studio lives in a **separate repository**
(`code-site-solutions-admin`) per the header comment in
[src/lib/sanity/queries.ts](src/lib/sanity/queries.ts:2-7). This repo
contains only the GROQ queries and TS types — the schema source files
are not here. I can read the schema shape from
[src/lib/sanity/types.ts](src/lib/sanity/types.ts), which mirrors it
hand-typed.

### Schemas powering marketing-page content

| Schema (doc type) | Inferred from | Powers | Localization model |
|---|---|---|---|
| `industryPage` | `IndustryPageDoc` | `/sites-for/[slug]` (UK) and `/en/sites-for/[slug]` (when `title.en` is set) | `LocalizedString = Partial<Record<"uk"\|"ru"\|"en", string>>`. EN content is shadow-fields like `bodyEn`/`textEn` for portable-text blocks. |
| `caseStudy` | `CaseStudyDoc` | `/portfolio/[slug]` and `/en/portfolio/[slug]` | Same localization model. |
| `blogPost` | `BlogPostRef` (and referenced by `industryPage.relatedPosts`) | Listed for relations, but `/blog` is a placeholder page in this repo. | Same. |

### Block types the `industryPage.sections[]` array accepts

From the `IndustrySection` discriminated union in
[src/lib/sanity/types.ts](src/lib/sanity/types.ts:327-339):

- `imageTextBlock` → renders via `ImageText`
- `statsBlock` → renders via `StatsBar`
- `faqBlock` → renders via `FAQ`
- `pricingBlock` (separate from comparisonBlock — pricing tiers only)
- `comparisonBlock` → renders via `Comparison` (table + form + tiers)
- `reasonsBlock` → renders via `Reasons` (the PAS card row)
- `servicesBlock` → renders via `Services`
- `outcomeBlock` → renders via `Outcome`
- `caseBlock` → renders via `Case`
- `auditBlock` → renders via `Audit`
- `ctaBlock` → renders via... nothing (the switch in
  [src/components/industry-page/index.tsx](src/components/industry-page/index.tsx:234)
  has no case for `ctaBlock`. It's defined in the type union but never
  rendered. Probably dead code in the schema, or used only via Studio
  preview).
- `richTextBlock` → renders inline portable-text wrapper

### Block types `caseStudy.sections[]` accepts

From `CaseStudySection` ([src/lib/sanity/types.ts](src/lib/sanity/types.ts:409-417)):
`imageTextBlock`, `statsBlock`, `quoteBlock`, `mediaGalleryBlock`,
`beforeAfterBlock`, `testimonialBlock`, `ctaBlock`, `richTextBlock`.

### Comparison page (`/vs/*`) schemas: **do not exist**

There is no `comparisonPage` schema. No Sanity document drives any
`/vs-*` route. **`/vs-*` is 100 % hand-coded TS** in
[src/components/vs-wordpress/index.tsx](src/components/vs-wordpress/index.tsx)
(both UA and EN copy as two `Content` const objects), and the same
shape in `vs-constructors` and `vs-freelancers`.

### Can `industryPage` cover `/vs/*`?

Mostly yes, by reuse:

- Hero → existing `hero` field on `industryPage` (eyebrow, heading,
  lede, features, deviceTags) — **fits**.
- Metric strip → `statsBlock` — **fits**.
- 3-PAS cards (prompt's "PAS row") → `reasonsBlock` — **fits**.
- Comparison table → `comparisonBlock` — **fits structurally but
  columns are hardcoded**: it has `param / wp / wix / custom`. For
  generic `vs-*`, columns need to be a generic pair (`competitor /
  custom`). This is a schema mismatch.
- "Honesty" block (`Коли WordPress — все ще ОК`) → no existing block.
  Closest match: `reasonsBlock` (3 items with title + body) or
  `imageTextBlock` with `variant="side-with-list"` and `bulletList`.
- CTA band → `ctaBlock` (defined in schema but unrendered today) or
  reuse `CtaBanner` outside the section list.

### Reuse path vs new-schema path

Two options, both load-bearing decisions for Phase 1:

**Option A — reuse `industryPage`.** Add a `category: "industry" |
"comparison"` field to the existing schema and use it to control header
copy. Reuses every block. Cost: `comparisonBlock` columns are wrong
shape for generic competitor comparisons, so it would need either a
new `vsComparisonBlock` schema or to keep the awkward `wp / wix /
custom` triplet.

**Option B — introduce `comparisonPage`.** New top-level doc type that
mirrors `industryPage` but with its own `vsTable` block (two columns)
and reuses every other block (`statsBlock`, `reasonsBlock`,
`imageTextBlock`, `faqBlock`, `ctaBlock`). Cleaner separation, more
schema work, and **requires changes in the admin repo, which is not
checked in here.**

Both options touch the admin repo. **The admin repo is not in this
worktree** — Phase 1 will need either coordination with that repo or
the work to live in this repo's hand-coded path.

---

## 0.3 — i18n inventory

### Library

`next-intl@4.11.0` ([package.json](package.json)).

### Configuration

[src/i18n/request.ts](src/i18n/request.ts) always loads
`messages/uk.json` — `getRequestConfig` is hardcoded to locale `uk`.
The EN messages come from a **separate `NextIntlClientProvider`** in
[src/app/en/layout.tsx](src/app/en/layout.tsx) that loads
`messages/en.json` and sets `locale="en"` for the subtree.

So there is no Next.js-style `[locale]` segment. The locales are split
by route prefix:

- `/` and everything under it → UA (loaded via `getRequestConfig`)
- `/en` and everything under it → EN (loaded via the EN layout's
  separate provider)

### Locale detection / persistence

[src/middleware.ts](src/middleware.ts) does Accept-Language sniffing
**only on `/`** to bounce a first-time EN-preferring visitor to `/en`.
`NEXT_LOCALE` cookie persists the user's pick. Once on `/en/foo`, the
user stays there until they switch.

### Locale switcher behavior

[src/components/homepage/locale-switcher.tsx](src/components/homepage/locale-switcher.tsx) +
[src/lib/i18n-routes.ts](src/lib/i18n-routes.ts) handle the mapping.
The `UK` indicator in the header is **not cosmetic** — it actually
switches the locale via `resolveLocaleAlternate(pathname)`, which
preserves page context for paths that have EN counterparts.

EN-localized roots whitelisted in
[src/lib/i18n-routes.ts](src/lib/i18n-routes.ts:36-40): `/vs-wordpress`,
`/vs-constructors`, `/vs-freelancers`. Plus industry pages that have
`title.en` set (currently `medicine`), plus case studies likewise
(currently `nbyg-kobenhavn`).

### Message catalogs

Just two namespaces' worth of strings:
[messages/uk.json](messages/uk.json) and
[messages/en.json](messages/en.json) — 67 lines each. Top-level keys:
`Meta`, `Nav`, `ServiceNav`, `Footer`, `Newsletter`, `LocaleSwitcher`.

That's it. Every other UA/EN string lives in code:

- `/sites-for/[slug]`: Sanity localized fields, picked via
  [src/lib/sanity/locale.ts](src/lib/sanity/locale.ts)'s `loc()` helper.
- `/vs-*`: two `Content` const objects per file (`UK` and `EN`),
  picked by `getVsWordpressContent(locale)` etc.
- Homepage `/` (UA) and `/en` (EN): two separate `page.tsx` files,
  one per locale, each with copy hardcoded in JSX.
- `/calculator`: **English copy hardcoded in JSX**. No locale split. No
  `useTranslations` calls anywhere in calculator components.

### Which files actually call `useTranslations`?

Only 5 files, all chrome:
[hp-footer.tsx](src/components/homepage/hp-footer.tsx),
[hp-header.tsx](src/components/homepage/hp-header.tsx),
[locale-switcher.tsx](src/components/homepage/locale-switcher.tsx),
[mobile-menu.tsx](src/components/homepage/mobile-menu.tsx),
[newsletter.tsx](src/components/homepage/newsletter.tsx).

### Naming convention in `messages/*.json`

camelCase keys, dot-namespaced (`Footer.solutions.healthcare`). Phase 1
calculator translations must follow this convention.

### Calculator translation status

[src/components/calculator/WebsiteCalculator.tsx](src/components/calculator/WebsiteCalculator.tsx),
`CalculatorControls.tsx`, `EstimateSummary.tsx`, `LeadForm.tsx`,
`PriceBreakdown.tsx`, `OptionCard.tsx` — **zero `useTranslations`
calls**. Every label is a hardcoded English string in JSX. Plus the
config object in
[src/lib/pricing-calculator-config.ts](src/lib/pricing-calculator-config.ts)
has 64+ English `label:` / `hint:` strings on option records.
Translating the calculator requires either:

1. Lifting all `label`/`hint` strings out of the config and onto the
   component layer that consumes them, threading `t(...)` through; or
2. Keeping the config keys but mapping each option ID to a translation
   key (e.g. `t("calculator.basics.landing")`), with the config
   carrying only IDs/prices.

Option 2 is much less invasive and matches how Sanity content is
fetched once and rendered with `loc()`.

### Calculator route under EN

No `/en/calculator` route exists. To make the existing locale switcher
toggle the calculator, an `/en/calculator/page.tsx` needs to be added,
or the `EN_LOCALIZED_ROOTS` set in
[src/lib/i18n-routes.ts](src/lib/i18n-routes.ts:36-40) needs
`/calculator` added so the switcher knows to route there.

### Decision the prompt asks but cannot answer with code-only research

The prompt's translation table for Task 3 keys translations as e.g.
`calculator.hero.title`. This matches **dot-namespaced lowercase**
keys, not the project's existing **PascalCase top-level** namespace
convention (`Nav.services`, `Footer.compare.wordpress`). The cleanest
fit with the existing catalogs is **Calculator.hero.title**
(PascalCase namespace + dot path). **Confirm before Phase 1** so the
namespace is right the first time.

---

## 0.4 — Routing inventory for `/vs/*`

### Routes that exist today

All flat top-level routes — no `app/vs/[slug]` dynamic route:

- [src/app/vs-wordpress/page.tsx](src/app/vs-wordpress/page.tsx) — renders `<VsWordpressView locale="uk" />`
- [src/app/vs-constructors/page.tsx](src/app/vs-constructors/page.tsx) — `<VsConstructorsView locale="uk" />`
- [src/app/vs-freelancers/page.tsx](src/app/vs-freelancers/page.tsx) — `<VsFreelancersView locale="uk" />`
- [src/app/en/vs-wordpress/page.tsx](src/app/en/vs-wordpress/page.tsx) — `<VsWordpressView locale="en" />`
- [src/app/en/vs-constructors/page.tsx](src/app/en/vs-constructors/page.tsx)
- [src/app/en/vs-freelancers/page.tsx](src/app/en/vs-freelancers/page.tsx)

### What they actually render

Each one ships a full marketing page with hero, "hidden costs" grid,
side-by-side comparison table (custom inline `cmp-table` markup, not
`Comparison` block), case-study before/after block, SEO myth-buster
cards, admin comparison + capabilities, 5-step process, "what we don't
do" filter, 3-tier pricing using `Tier` from
[blocks/comparison](src/components/blocks/comparison/index.tsx), FAQ
via `FAQ`, FinalCta3.

UA and EN content live as two `Content` const objects in the same view
component file (e.g.
[src/components/vs-wordpress/index.tsx](src/components/vs-wordpress/index.tsx:169-1273):
`UK` block followed by `EN` block). View component picks via
`getVsWordpressContent(locale)`.

### Are these pages "empty"?

No. They render hundreds of lines of finished UA+EN content. The
Sprint 1 prompt's claim that `/vs/*` pages return empty HTML does not
match `master` at commit `a731da3`.

### Footer / nav references to `/vs/*`

Footer column "compare" in
[src/components/homepage/hp-footer.tsx](src/components/homepage/hp-footer.tsx:34-38):
links to `/vs-wordpress`, `/vs-constructors`, `/vs-freelancers` (or
their `/en/...` counterparts when locale is EN). Sitemap in
[src/app/sitemap.ts](src/app/sitemap.ts:21-23) emits the same three
flat paths plus EN alternates.

No reference anywhere to `/vs/[slug]` or `/vs/wordpress`.

### What needs to change for Task 1

This is where the prompt's premise breaks worst.

- The prompt wants `/vs/[slug]` as a single dynamic route fed by Sanity.
  Today, the routes are flat per-competitor at `/vs-wordpress` etc.,
  fed by hand-coded TS.
- The prompt's copy is shorter and lighter than what's already shipped.
  Pasting it in verbatim would *replace* longer, already-translated
  UA+EN content with shorter UA-only content — a regression.
- Restructuring three top-level routes into one dynamic route would
  break the footer/nav/sitemap links + the `EN_LOCALIZED_ROOTS`
  whitelist in [i18n-routes.ts](src/lib/i18n-routes.ts), and every
  inbound link from `/calculator?source=vs-wordpress` and elsewhere.

There are three coherent ways forward; all need an explicit decision:

1. **Take the prompt at face value**: replace the existing pages with a
   single `/vs/[slug]` route fed by Sanity, using the prompt's shorter
   copy. Loses the existing rich content + EN copy.
2. **Migrate to Sanity but keep current content**: keep flat paths,
   move the existing `Content` objects into Sanity as
   `comparisonPage` documents, switch view components to read from
   Sanity. Preserves current content; touches admin repo.
3. **Skip Task 1 in this sprint**: the pages are already shipped with
   richer content than the prompt would have produced. Acknowledge
   that the prompt was based on a stale picture. Apply Tasks 2, 3, 4
   only.

I recommend **Option 3** unless the user has a specific reason to
shrink the live `/vs-*` copy down to the prompt's version.

---

## 0.5 — Pricing source of truth

There is **no single source of truth**. Tier names and prices live in
five distinct places:

| Location | Tiers | Notes |
|---|---|---|
| [src/app/page.tsx](src/app/page.tsx:21-71) (`HOMEPAGE_TIERS`) | Landing $1 000 / **Spec for industry** $3 500 / Custom $14 000 (3 tiers) | UA homepage hero block list. |
| [src/app/en/page.tsx](src/app/en/page.tsx:204-257) (`EN_TIERS`) | Landing $1,000 / **Spec for industry** $3,500 / Custom $14,000 (3 tiers) | EN homepage. |
| [src/app/pricing/page.tsx](src/app/pricing/page.tsx:98-214) (`TIERS`) | Landing $1 000 / **Multi-page** $3 000 / **Specialized** $3 500 / Custom $14 000 (4 tiers) — plus JSON-LD `OfferCatalog` at lines 350-388 listing all four | The only place "Multi-page" exists at the tier level. |
| `/vs-*` pricing tiers (3 pricing tiers per competitor) | Different shape — these are migration-priced (e.g. `$1 000 / $3 500 / $5 000`), not the four-tier ladder | Lives in each `Content` UK/EN object. Separate concern from the four main tiers, don't touch for Task 4. |
| [src/components/blocks/lead-form/index.tsx](src/components/blocks/lead-form/index.tsx:61-67) (`TIER_OPTS`) | Starter / Business / Industry Pro / Enterprise (4 select options, IDs `starter`, `business`, `industry`, `enterprise`) | Form select. The `?tier=` URL param normalizer at lines 90-103 maps `multi`/`multipage`/`specialized`/`advanced` → `industry`/`business`. **This is how `/pricing` CTAs feed the form.** |

### Other places "Multi-page" appears

From `grep`:

- [src/app/pricing/page.tsx:128](src/app/pricing/page.tsx) — `name: "Multi-page"` (the actual tier)
- [src/app/pricing/page.tsx:362](src/app/pricing/page.tsx) — `name: "Business — Multi-page"` (the JSON-LD offer)
- [src/components/blocks/lead-form/index.tsx:95](src/components/blocks/lead-form/index.tsx) — `multipage: "business"` (alias map for `?tier=` query param)
- [src/lib/pricing-calculator-config.ts:83](src/lib/pricing-calculator-config.ts) — `label: "Multi-page website"` (calculator project-type label)
- [src/lib/pricing-calculator-config.ts:249](src/lib/pricing-calculator-config.ts) — `"Multi-page website"` (calculator package preset label)

### Calculator package presets vs `/pricing` tiers

Different axes:

- **`/pricing` tiers** = engagement tier (Landing / Multi-page /
  Specialized / Custom) → maps to `?tier=` form preset.
- **Calculator packages** in
  [pricing-calculator-config.ts](src/lib/pricing-calculator-config.ts):
  `landing` / `multiPage` / `ecommerce` (these are
  `ProjectType` enum values — describe what the project IS, not the
  engagement tier).

The prompt's Task 4 says "Calculator packages untouched" — confirmed
**that is correct.** They are not the same thing as `/pricing` tiers.
The `"Multi-page website"` label in the calculator config is the
project type, not the dropped tier.

### Blast radius of dropping "Multi-page" tier

To drop it cleanly per Task 4:

- Remove from [src/app/pricing/page.tsx](src/app/pricing/page.tsx:128-154) `TIERS`
- Remove from [src/app/pricing/page.tsx](src/app/pricing/page.tsx:360-368) JSON-LD `OfferCatalog`
- Remove `?tier=business` link from `Tier.ctaHref`
- Keep `business` in [lead-form](src/components/blocks/lead-form/index.tsx:62) `TIER_OPTS` for backward compatibility (old links from emails still work), OR remove and let the `multi/multipage → business` alias still route to a valid option after rename — **decision needed**
- Rename FAQ q on
  [pricing/page.tsx:275](src/app/pricing/page.tsx:275) (`Чому
  індустріальні сайти (Industry Pro) дорожчі за Business?`) since
  "Business" no longer maps to a tier — the answer references it
- Add new Pro Plus tier at $7,500
- Add `Кому підходить` prop to `Tier` and populate for all 4 tiers
- Sync homepage `/` and `/en` tier lists: rename "Spec for industry" →
  "Industry Pro" and decide whether the homepage gets 4 tiers or stays
  at 3. The prompt only says "homepage pricing section matches" —
  ambiguous between "rename to match `/pricing`" and "include all 4
  tiers." **Decision needed.**

---

## 0.6 — Existing telemetry / form-source tracking

### How submissions are tracked

Flow: form → POST `/api/lead` → Telegram bot.

- [src/components/blocks/lead-form/index.tsx](src/components/blocks/lead-form/index.tsx:171-181)
  POSTs `{ ...values, source }` to `/api/lead`.
- [src/app/api/lead/route.ts](src/app/api/lead/route.ts:21-36)
  renders the message with `Сторінка: <source>` as the first line of
  the Telegram message. Defaults to `/contacts` when missing.

### `?source=` pattern in the wild

`?source=` is **read off the URL only indirectly** today. The relevant
flow is:

1. `LeadForm` is rendered inside `ContactSplit` which accepts a
   `source` *prop*. The prop is hardcoded to `"contacts"` in
   [src/app/contacts/page.tsx](src/app/contacts/page.tsx:135).
2. The form's `source` body field is set from that prop, not from the
   URL.

What IS read from the URL is `?tier=`, in
[lead-form/index.tsx:120-126](src/components/blocks/lead-form/index.tsx):

```ts
const searchParams = useSearchParams();
const initialValues = useMemo<LeadValues>(() => {
  const tier = normalizeTier(searchParams?.get("tier") ?? null);
  return { ...INITIAL, tier };
}, [searchParams]);
```

Outbound links DO use `?source=`:
- `/vs-*` pages link to `/calculator?source=vs-wordpress` (etc.).
- `/pricing` tier CTAs link to `/contacts?tier=starter|business|advanced|enterprise`.

But on `/contacts`, the `source` field on the POST body is the *prop*
`"contacts"`, not the URL param. So `?source=hero-audit` arriving at
`/contacts` would currently be **ignored** unless wired up.

### Smallest addition to wire `?source=` into form telemetry

Add one more line to the `initialValues` `useMemo` in
[lead-form/index.tsx:123](src/components/blocks/lead-form/index.tsx):
read `?source=` from the URL, and if present, override the `source`
sent in the POST body. Two-line change. The `LeadFormProps.source`
prop remains the default; the URL param wins when present.

### Source field display

The Telegram message header reads `Сторінка: <source>` (Ukrainian for
"Page"). Routing the URL param through means the Telegram message
shows `Сторінка: hero-audit` (or whatever the source string is) — no
new banner needed in Telegram.

### What the prompt also asks for: a banner on `/contacts` when `?source=hero-audit`

This requires a new client-side `useSearchParams` check on the
contacts page (or inside `ContactSplit`) to render a small banner
above the form when the source matches `hero-audit`. ~10 lines of
client code. No pattern in the codebase currently does this — the
"audit lead-magnet form" block (`Audit` in
[blocks/final](src/components/blocks/final/index.tsx:247-330)) is its
own self-contained form, not a banner overlay on `/contacts`. So this
is a small new pattern, not a reuse.

---

## Decisions needed before Phase 1

I will not start coding until I have answers (or "go your best
judgement") on these:

1. **`/vs/*` (Task 1).** Three options laid out in §0.4. Recommend
   **skipping Task 1** since the pages are already shipped with content
   richer than the prompt would produce. Confirm or override.
2. **Homepage tier list (Task 4).** Today: 3 tiers (Landing / Spec for
   industry / Custom). `/pricing`: 4 tiers. After dropping Multi-page
   and adding Pro Plus, should the homepage:
   - (a) Stay at 3 tiers (Landing / Industry Pro / Custom), or
   - (b) Match `/pricing` and show all 4 (Landing / Industry Pro / Pro
     Plus / Custom)?
3. **Tier rename on homepage**: "Spec for industry" → "Industry Pro"?
   The prompt implies yes by referring to "Industry Pro" everywhere,
   but never says rename. Confirm.
4. **Calculator i18n namespace key style.** Existing project uses
   PascalCase top-level (`Nav.services`); prompt uses lowercase dot
   path (`calculator.hero.title`). I'd default to
   `Calculator.hero.title` to match the existing convention. Confirm.
5. **Hero CTA `href` props (Task 2).** OK to add
   `ctaPrimaryHref` / `ctaSecondaryHref` to `HeroEditorial` since the
   current `<button>` elements have no link target? This is a backward-
   compatible widening — old callers don't break.
6. **`?source=hero-audit` banner.** OK to add a small client banner
   above the form on `/contacts` rendered only when `?source=hero-audit`,
   plus wire `?source=` into the POST body? This is the smallest
   change that satisfies the prompt's acceptance criteria.
7. **Admin repo coordination.** Any task that adds Sanity schemas
   (Option B for Task 1) touches the `code-site-solutions-admin` repo
   which is not in this worktree. Confirm whether that's in scope for
   this sprint or out of scope.

---

## Files inspected

- All `src/app/**/*.tsx` and `src/components/**/*.tsx` referenced above
- [src/lib/sanity/queries.ts](src/lib/sanity/queries.ts), [src/lib/sanity/types.ts](src/lib/sanity/types.ts), [src/lib/sanity/client.ts](src/lib/sanity/client.ts), [src/lib/sanity/fetch.ts](src/lib/sanity/fetch.ts)
- [src/lib/i18n-routes.ts](src/lib/i18n-routes.ts), [src/i18n/request.ts](src/i18n/request.ts), [src/middleware.ts](src/middleware.ts)
- [src/lib/pricing-calculator-config.ts](src/lib/pricing-calculator-config.ts) (top ~150 lines)
- [src/app/api/lead/route.ts](src/app/api/lead/route.ts)
- [messages/uk.json](messages/uk.json), [messages/en.json](messages/en.json)
- [src/app/sitemap.ts](src/app/sitemap.ts)
- [package.json](package.json)
- Git history: `a731da3` through `35a59d2`
