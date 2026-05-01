# Tech Audit — Before Adding New Pages

**Project:** code-site-solutions (Code-Site.Art)
**Stack:** Next.js 15.5 (App Router) · React 19 · TypeScript 5.9 · Tailwind v4 · HeroUI v2 · next-intl v4
**Audit date:** 2026-04-30
**Audit scope:** Full read-only review. No files modified.

---

## 1. Executive summary

The codebase is a Next.js App Router site for a Ukrainian web-studio. It is in a transitional state: the homepage and one industry page (`/sites-for/medicine`) plus one case study (`/portfolio/efedra-clinic`) are production-quality, but most of the navigation links from the homepage footer (8 industry pages, vs/* compare pages, /process, /contacts, /policy, /offer, /public-contract, /legal) are broken — the routes don't exist yet.

The architecture is sound: a clean **block-component pattern** (`src/components/blocks/*`) with each block colocated with its own CSS file, design-token system in `globals.css`, and a Storybook-style `/app/stories/*` playground. **Content is 100% hardcoded in TSX** — there is no CMS, no data layer, no shared FAQ/team/case data sources. Several blocks duplicate copy across pages (e.g. FAQ items in `MEDICINE_FAQ`, `PRICING_FAQ`, `ABOUT_FAQ`, and `final/index.tsx::DEFAULT_FAQ`).

**Three issues are blockers if you scale to more industry/case pages without action:**

1. **Content is not modeled.** Every new industry page will hand-author tiers, FAQ, services, comparison, and JSON-LD. There's no shared data shape — refactoring later will touch every page.
2. **`dangerouslySetInnerHTML` is used to inject `<em>` tags inside data strings** (5 places across `comparison/`, `final/`, `services/`). Once data moves to a CMS this becomes an XSS surface.
3. **Image strategy is broken.** All 8 `<img>` usages bypass `next/image`; `services/index.tsx` pulls 6 hero images from `images.unsplash.com` at runtime; `efedra-demo.mp4` is **60 MB** sitting in `/public`. There are no responsive image sizes and no LCP optimisation.

**No critical risks** — but **High-severity** technical debt should be retired before `/sites-for/legal`, `/sites-for/accounting`, `/sites-for/ecommerce` etc. are added, otherwise the debt 8x's.

---

## 2. Current architecture map

```
code-site-solutions/
├── src/
│   ├── app/                          ← App Router root
│   │   ├── layout.tsx                ← html/body, fonts, providers, intl
│   │   ├── providers.tsx             ← HeroUI + next-themes (defaultTheme: dark)
│   │   ├── globals.css               ← tokens + utilities
│   │   ├── page.tsx                  ← / (homepage)
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── blog/page.tsx             ← placeholder "coming soon"
│   │   ├── calculator/page.tsx       ← thin wrapper → WebsiteCalculator
│   │   ├── portfolio/page.tsx        ← list of cases (1 live, 7 disabled)
│   │   ├── portfolio/efedra-clinic/page.tsx  ← only live case study
│   │   ├── sites-for/medicine/page.tsx       ← only live industry page
│   │   └── stories/                  ← component playgrounds (5)
│   │       ├── cta-banner/page.tsx
│   │       ├── image-text/page.tsx
│   │       ├── page-hero/page.tsx
│   │       ├── stats-bar/page.tsx
│   │       └── team-cards/page.tsx
│   │
│   ├── components/
│   │   ├── blocks/                   ← page-level marketing blocks
│   │   │   ├── hero/         (270 + 703 css)
│   │   │   ├── comparison/   (407 + 161 css)
│   │   │   ├── final/        (407 +  22 css)  ← composite: FAQ + Audit + ClinicFooter
│   │   │   ├── outcome/      (384 +  57 css)
│   │   │   ├── services/     (289 +  64 css)  ← uses Unsplash CDN
│   │   │   ├── case/         (287 + 434 css)
│   │   │   ├── team-cards/   (241 +  31 css)
│   │   │   ├── reasons/      (205 +  44 css)
│   │   │   ├── image-text/   (178 +  15 css)
│   │   │   ├── cta-banner/   ( 71 +  63 css)
│   │   │   ├── page-hero/    ( 55 +  41 css)
│   │   │   └── stats-bar/    ( 31, no css)
│   │   ├── homepage/                 ← homepage-only sections
│   │   │   ├── index.tsx     (938 lines — 11 exported sections)
│   │   │   ├── hp-header.tsx (69, "use client")
│   │   │   ├── newsletter.tsx (49, "use client")
│   │   │   ├── header-services.ts
│   │   │   └── homepage.css  (~1380 lines)
│   │   ├── calculator/               ← isolated pricing calculator
│   │   │   ├── WebsiteCalculator.tsx (217)
│   │   │   ├── CalculatorControls.tsx (511)
│   │   │   ├── EstimateSummary.tsx (148)
│   │   │   ├── LeadForm.tsx (204, HeroUI inputs)
│   │   │   ├── PriceBreakdown.tsx (89)
│   │   │   ├── OptionCard.tsx (49)
│   │   │   ├── formatters.ts
│   │   │   └── calculator.css (~1315 lines)
│   │   └── portfolio/
│   │       └── efedra-case-gallery.tsx (101, "use client", lightbox)
│   │
│   ├── i18n/request.ts               ← next-intl config (locale: "uk", single file)
│   └── lib/
│       ├── pricing-calculator-config.ts (350)
│       ├── calculate-website-estimate.ts (81)
│       └── utils.ts                   ← cn()
│
├── messages/uk.json                   ← only contains Meta.title/description
├── public/
│   ├── EfedraCaseCreenshots/          ← 63 MB total, mp4 = 60 MB ⚠
│   ├── raw-design/                    ← 2.4 MB, raw HTML/CSS source design ⚠ (shipped to prod)
│   └── calculator/design/             ← preview SVGs
└── tailwind.config.ts                 ← v4 config (also bridged from globals.css @config)
```

**Layout strategy.** There is **no nested layout**. `src/app/layout.tsx` does fonts + Providers + `NextIntlClientProvider`. Every page is responsible for rendering its own `<HpHeader />` and footer (`<HpFooter />` or `<ClinicFooter />`). This is fine for now but means each new page must remember to import and place the header — easy to forget.

**Routing surface.**
- ✅ Live: `/`, `/about`, `/pricing`, `/blog`, `/calculator`, `/portfolio`, `/portfolio/efedra-clinic`, `/sites-for/medicine`, `/stories/*`
- ❌ Linked but missing (will 404): `/sites-for/{legal,accounting,ecommerce,saas,real-estate,cosmetology,education}`, `/vs/{wordpress,constructors,freelancers}`, `/process`, `/contacts`, `/policy`, `/offer`, `/public-contract`, `/legal`, `/portfolio/{nbyg-bornholm,tatarka,...}`

---

## 3. Route inventory

| Route | File | Server/Client | Metadata | JSON-LD | Notes |
|---|---|---|---|---|---|
| `/` | `app/page.tsx` | server | inherited from layout | Org + WebSite | 11 homepage sections + inline pricing tiers |
| `/about` | `app/about/page.tsx` | server | ✅ (canonical) | AboutPage + Person + Org + Breadcrumb | 631 lines, mixed inline `<img>` + GradPlaceholder |
| `/pricing` | `app/pricing/page.tsx` | server | ✅ (canonical) | FAQPage + OfferCatalog | 564 lines, hardcoded `<em>` HTML in tier strings |
| `/portfolio` | `app/portfolio/page.tsx` | server | ✅ (canonical) | Breadcrumb + CollectionPage | 8 cases, 7 disabled (href: null) |
| `/portfolio/efedra-clinic` | `app/portfolio/efedra-clinic/page.tsx` | server | ✅ (canonical, og.type=article) | Breadcrumb + Article | 503 lines hand-coded; 60 MB mp4 referenced |
| `/sites-for/medicine` | `app/sites-for/medicine/page.tsx` | server | ✅ (canonical) | Service + Breadcrumb + FAQPage | Template for all future industry pages |
| `/calculator` | `app/calculator/page.tsx` | server (delegates) | ✅ | – | thin wrapper around `<WebsiteCalculator>` (client) |
| `/blog` | `app/blog/page.tsx` | server | ✅ | – | "Coming soon" placeholder, 33 lines |
| `/stories/cta-banner` | demo | server | minimal | – | dev playground |
| `/stories/image-text` | demo | server | minimal | – | dev playground |
| `/stories/page-hero` | demo | server | minimal | – | dev playground |
| `/stories/stats-bar` | demo | server | minimal | – | dev playground |
| `/stories/team-cards` | demo | server | minimal | – | dev playground |

**Headings:** No page renders an explicit `<h1>` directly — the H1 comes from the `<PageHero>` / `<HeroEditorial>` component. This is OK provided each page actually mounts one of those at the top. ⚠ The homepage uses `HeroEditorial` (good); `/blog` does **not** mount any hero component, so it has **no H1** at all.

---

## 4. Component inventory

### 4.1 Block components (`src/components/blocks/*`)

| Block | LOC | "use client" | Needed? | dangerouslySetInnerHTML | Forms | Image strategy |
|---|---|---|---|---|---|---|
| `hero` | 270 | — | n/a | — | — | local `<img>` `/raw-design/assets/mockup.png` (1.3 MB) |
| `comparison` | 407 | ✅ | ❌ no hooks | **3×** (tier name, includes, excludes) | 1 demo (preventDefault, no handler) | — |
| `final` | 407 | ✅ | ❌ no hooks | **1×** (FAQ answer) | 1 demo (audit form) | — |
| `outcome` | 384 | — | n/a | — | — | local `<img>` `/raw-design/assets/benefit-*` |
| `services` | 289 | — | n/a | **1×** (feature item) | — | **6× Unsplash hotlinks** ⚠ |
| `case` | 287 | — | n/a | — | — | local `<img>` `/raw-design/assets/case-*` |
| `team-cards` | 241 | — | n/a | — | — | optional `<img>` + initials fallback |
| `reasons` | 205 | — | n/a | — | — | — |
| `image-text` | 178 | — | n/a | — | — | accepts `image: ReactNode` (caller's choice) |
| `cta-banner` | 71 | — | n/a | — | — | — |
| `page-hero` | 55 | — | n/a | — | — | — |
| `stats-bar` | 31 | — | n/a | — | — | — |

**Findings:**
- `comparison/index.tsx` and `final/index.tsx` are **wrongly marked `"use client"`** — they have no hooks, no event handlers other than `e.preventDefault()` on demo forms. Removing the directive would let them render on the server and shrink the JS bundle.
- `services/index.tsx` line 87, `comparison/index.tsx` lines 129/148/165, `final/index.tsx` line 165 use `dangerouslySetInnerHTML` to inject `<em>` markup contained in data strings. This pattern (HTML inside data) blocks moving content to a CMS without a sanitizer.
- `final/index.tsx` is a **composite export** — it bundles `FAQ`, `Audit`, `ClinicFooter`, and a default `Final`. This couples three unrelated concerns.
- `outcome/index.tsx` repeats a benefit-row JSX block 3 times instead of mapping over an array.

### 4.2 Homepage components (`src/components/homepage/`)

`index.tsx` is **938 lines** and exports 11 named sections (`Marquee`, `Industries`, `Bento`, `Process`, `Cases`, `Stack`, `PullQuote`, `FinalCta3`, `HpFooter`, plus `SectionHead`, `LighthouseVisual`, `MigrationVisual` privately). Each has hardcoded defaults. Once you add a second locale or a CMS, this file must be split.

`Newsletter` lives in its own file (49 lines, `"use client"`, justified by `useState`).
`HpHeader` (69 lines, `"use client"`, justified by `usePathname` + `useEffect` + `useRef`).

### 4.3 Calculator (`src/components/calculator/`)

A self-contained, well-architected feature. `WebsiteCalculator` orchestrates `CalculatorControls` (511 lines), `EstimateSummary`, `LeadForm` (HeroUI inputs), `PriceBreakdown`, `OptionCard`. Pure config in `lib/pricing-calculator-config.ts` (350 lines). `LeadForm.onSubmit` only `console.info`s — **no backend integration**. CSS is a single 1,315-line `calculator.css`.

### 4.4 Portfolio
- `efedra-case-gallery.tsx` (101 lines, `"use client"` justified) uses `yet-another-react-lightbox`. Inline-style magic numbers (padding 10px, fontSize 11) bypass the design tokens.

### 4.5 Exported but possibly unused
- Multiple sub-exports inside blocks (`Nav`, `DeviceMockup`, `FeatureChip` from hero; `MockPages`, `MockBookingForm`, `MockAdmin` from outcome; `CrossIcon`, `CheckIcon` from case) — verify usage before scaling. The `/stories/` pages already serve as proof-of-life for some of these.

---

## 5. Styling inventory

### 5.1 Architecture

- **Tailwind v4** (`@tailwindcss/postcss` + `autoprefixer`) with a v3-style config bridged via `@config "../../tailwind.config.ts"` inside `globals.css`. This is intentional but unusual — confirm the team is comfortable maintaining both `tailwind.config.ts` (font, color, animation extends, HeroUI plugin) and per-block `*.css` files.
- Design tokens live as CSS custom properties in `:root` (`globals.css:4–25`): `--bg`, `--bg-subtle`, `--bg-raised`, `--ink/dim/muted/-2/-3`, `--line/-strong/-2`, `--accent/soft/deep/-2`. Tailwind config exposes them as `bg-bg`, `text-ink`, `border-line`, `text-accent`, etc.
- **Hybrid pattern**: utility classes in JSX (Tailwind) + per-block CSS for gradients, pseudo-elements, animations, and complex hover states. Each block has a sibling `*.css` file imported by either the block itself (`hero`, `case`, `team-cards`, `cta-banner`, `image-text`, `services`, `outcome`, `reasons`, `page-hero`) or the page that uses it (`comparison.css` is imported in `pricing/page.tsx` and `app/page.tsx`).

### 5.2 Inventory

| File | Lines | Class prefix | Imported by |
|---|---|---|---|
| `app/globals.css` | 121 | `.text-gradient`, `.grid-bg`, `.dotted-bg`, `.container-page`, `.ease-soft` | `app/layout.tsx` (global) |
| `homepage/homepage.css` | ~1380 | `.hp-*` | `homepage/index.tsx` + several pages |
| `blocks/hero/hero.css` | 703 | `.hero-*`, `.nav-*`, `.btn-*`, `.device-*` | `blocks/hero/index.tsx` |
| `blocks/case/case.css` | 434 | `.case-*` | `blocks/case/index.tsx` |
| `blocks/comparison/comparison.css` | 161 | `.cmp-*` | `app/page.tsx`, `app/pricing/page.tsx` |
| `blocks/services/services.css` | 64 | `.services-*`, `.feature-card` | `blocks/services/index.tsx` |
| `blocks/cta-banner/cta-banner.css` | 63 | `.cta-banner-*` | `blocks/cta-banner/index.tsx` |
| `blocks/outcome/outcome.css` | 57 | `.outcome-*`, `.directions-*` | `blocks/outcome/index.tsx` |
| `blocks/reasons/reasons.css` | 44 | `.reasons-bg`, `.reason` | `blocks/reasons/index.tsx` |
| `blocks/page-hero/page-hero.css` | 41 | `.page-hero-*` | `blocks/page-hero/index.tsx` |
| `blocks/team-cards/team-cards.css` | 31 | `.team-cards-*` | `blocks/team-cards/index.tsx` |
| `blocks/final/final.css` | 22 | `.faq-bg`, `.audit-bg` | `blocks/final/index.tsx` |
| `blocks/image-text/image-text.css` | 15 | `.image-text-eyebrow` | `blocks/image-text/index.tsx` |
| `calculator/calculator.css` | ~1315 | `.calc-*` | `calculator/WebsiteCalculator.tsx` |
| **Total** | **~4,450** | | |

### 5.3 Marker classes (do NOT delete)

These are semantic anchors used both in TSX and inside the CSS for ::before/::after, gradients, and grid backgrounds. Removing them silently breaks visuals. Document them and treat as a public API of the codebase:

- Homepage: `.hp-section`, `.hp-inner`, `.hp-h2`, `.hp-eyebrow`, `.hp-eyebrow-dot`, `.hp-section-head`, `.hp-sub`, `.hp-link`
- Block-specific: `.faq-bg`, `.audit-bg`, `.reasons-bg`, `.cta-banner-bg`, `.page-hero-bg`, `.outcome-bg`, `.case-bg`, `.cmp-bg`, `.services-bg`
- Eyebrow pattern: `.image-text-eyebrow`, `.team-cards-eyebrow`, similar variants
- Calculator scope: all `.calc-*` (form-state styling on HeroUI inputs)

### 5.4 Issues

- **Breakpoint inconsistency.** Per-block CSS uses different mobile breakpoints: `380px` (hero only), `640px` (hero), `700px` (case, comparison), `760px` (calculator), `800px` (homepage), `1100px` (everywhere). Tailwind's default `sm/md/lg/xl` is unused inside CSS files. Visual jumps between adjacent sections are inevitable on screens between 640–800 px.
- **Dark surface tokens missing.** `oklch(0.18 0.008 300)` and `oklch(0.14 0.005 300)` are hardcoded in `calculator.css` and `case.css` (>20× total). No `--bg-card` / `--bg-input` tokens exist.
- **No spacing/radius/shadow scale.** All paddings are inline px. Border radii (`999px`, `18px`, `14px`, `12px`, `10px`, `6px`) are hardcoded each time.
- **Duplicated text-gradient utilities.** `globals.css` has `.text-gradient`, `.text-gradient-brand`, `.text-gradient-soft` — `.text-gradient` and `.text-gradient-soft` are identical (lines 50–60 and 74–84).
- **Likely-dead selectors** in `hero.css`: header comment (lines 16–22) flags `.laptop*`, `.phone*`, `.hero-split`, `.h1-split`, `.eyebrow-center`, `.cta-center` as removed — verify these are actually gone. `.btn-play` (line 372), `.device-tag-1/2/3` (463–483) need usage check.
- **Bundle splitting**: per-block CSS is imported via TSX side-effect imports; in Next.js App Router this generally yields per-route CSS but `homepage.css` is imported from many pages and effectively becomes global.

---

## 6. Performance

| Item | Status | Detail |
|---|---|---|
| `next/image` adoption | ❌ 0 uses | All 8 `<img>` tags bypass image optimisation |
| Remote images | ⚠ | `services/index.tsx` lines 98–148 hotlinks 6 Unsplash photos directly |
| Local image weights | ⚠ | `mockup.png` 1.3 MB (used in hero, every page that mounts hero) |
| Video assets | ⚠ | `efedra-demo.mp4` is **60 MB** in `/public` |
| `/public/raw-design` | ⚠ | 2.4 MB of design source (HTML/CSS/JSX) ships with prod build |
| Unnecessary `"use client"` | ⚠ | `comparison`, `final` |
| Font loading | ✅ | `next/font/google` for Manrope, Inter, JetBrains Mono with `display: swap` |
| Font duplication | ⚠ | `app/layout.tsx:55–68` adds a second `<link>` to `fonts.googleapis.com/css2` while also using `next/font` — the manual `<link>` should be removed |
| Bundle size from icons | ⚠ | `homepage/index.tsx` imports 21 lucide-react icons; OK with tree-shaking but watch for 4.x SDK regressions |
| `framer-motion` listed in deps | ⚠ | declared in `package.json` but no source import found — verify before next build |
| `yet-another-react-lightbox` | ✅ | Used only by `efedra-case-gallery.tsx` (client-only) |
| HeroUI bundle | ⚠ | Provider mounted globally; only `LeadForm` actually uses HeroUI components — most pages pay the cost for nothing |

---

## 7. SEO and metadata

**Strong points:**
- All public pages (except `/stories/*`) export `metadata`.
- Canonical via `metadataBase` (`https://code-site.art`) in `layout.tsx` plus per-page `alternates.canonical`.
- JSON-LD coverage is genuinely good: Org + WebSite (homepage), AboutPage + Person + Breadcrumb (about), FAQPage + OfferCatalog (pricing), Service + FAQPage (medicine), Article (efedra), CollectionPage (portfolio).

**Issues:**
- **`/blog` has no H1** and is a placeholder; should at least be `noindex` or hidden from the footer until ready.
- **Homepage footer links to 18 routes that don't exist** (industry pages, vs/* compare pages, /process, /contacts, /policy, /offer, /public-contract, /legal). Search engines crawling these will 404.
- **No `robots.txt` and no `sitemap.xml`/`sitemap.ts`** — both should be added before more pages are crawled.
- **No `og:image`** specified globally or per page (only `og:title` + `og:description` + `og:type`).
- **Multilingual readiness:** `next-intl` is wired (single locale `uk`), `messages/uk.json` has only `Meta.title/description` and is not used anywhere — pages set their own `metadata.title` directly. There is **no localized routing** (no `[locale]` segment), so adding RU/EN means restructuring the `app/` tree.
- **Heading hierarchy:** rely entirely on PageHero/HeroEditorial mounting an H1. Verify each new industry page mounts one. Inside blocks the hierarchy is mostly H2 → H3.
- **Internal linking:** the homepage links forward, but the live pages don't link back to siblings (e.g., `/sites-for/medicine` doesn't cross-link `/portfolio/efedra-clinic` even though it's the canonical case for that industry).

---

## 8. Content / model readiness (this is the big one before scaling)

**Today, every piece of content lives inline:**

| Content type | Where it lives now | Repeats? |
|---|---|---|
| Pricing tiers | inline TSX in `app/page.tsx` (HOMEPAGE_TIERS) and `app/pricing/page.tsx` (TIERS, 4 tiers) | yes — homepage tier list ≠ pricing-page tier list |
| FAQ | `MEDICINE_FAQ` (medicine), `PRICING_FAQ` (pricing), `ABOUT_FAQ` (about), `DEFAULT_FAQ` in `final/index.tsx`, `CALCULATOR_FAQ` in `WebsiteCalculator.tsx` | **yes — 5 FAQ stores** |
| Industry list | `DEFAULT_INDUSTRIES` in `homepage/index.tsx` + `SERVICE_NAV_LINKS` in `header-services.ts` | yes — **2 sources of truth** for the same list |
| Cases (portfolio) | `DEFAULT_CASES` (homepage) + `CASES` (portfolio page) | yes — **2 different shapes** |
| Industry-page body (services, comparison, outcome, reasons) | Hardcoded defaults inside each block's TSX, then **overridden via props** per industry page | partially — same default copy appears on every page that doesn't pass props |
| Footer links (solutions, company, compare, legal) | inline arrays in `homepage/index.tsx:808–837` | yes |
| Contact info (phone, email, telegram) | repeated in `homepage/index.tsx`, `LeadForm.tsx`, `app/page.tsx` JSON-LD, every page's JSON-LD `Organization` | **yes — 5+ copies** |
| `stripHtml` utility | redefined in `app/pricing/page.tsx:299` and `app/sites-for/medicine/page.tsx:31` | yes — duplicate |

**What should come from a CMS (recommended Sanity schemas):**

1. `siteSettings` — phone, email, socials, footer link groups, marquee logos, schema-org Org block.
2. `industry` — slug, hero (eyebrow + h1 + lede + features + stats), reasons, services items, comparison table, outcome stats, FAQ, related cases, JSON-LD Service block.
3. `caseStudy` — slug, hero, gallery, before/after pairs, outcome stats, pull-quote, related cases.
4. `pricingTier` — name, price, weeks, includes/excludes, popular flag, CTA — single source for homepage + /pricing + JSON-LD `OfferCatalog`.
5. `faqItem` (with category enum: `medicine`, `pricing`, `about`, `calculator`, `general`) — single bag, filtered per page.
6. `compareTarget` — for `/vs/wordpress` etc.
7. `vacancy` / `teamMember` — about page.

The blocks already accept props (their default constants are just fallbacks), so wiring Sanity is mostly a question of **fetching → mapping → `<Block ...props />`**, not refactoring the components themselves. The blocker is the `dangerouslySetInnerHTML` pattern (HTML inside data strings) — that has to die before user-editable content is allowed in.

---

## 9. High-risk files

| File | LOC | Risk | Why |
|---|---|---|---|
| `src/components/homepage/index.tsx` | 938 | **High** | 11 sections + private visuals in one file; once you split locales or CMS-fetch, you must split this. |
| `src/components/calculator/calculator.css` | ~1315 | Medium | Calculator-specific. Move to CSS Modules later, but stable for now. |
| `src/components/homepage/homepage.css` | ~1380 | Medium | Imported globally; touches every page. Most marker-class density of any file. |
| `src/components/blocks/comparison/index.tsx` | 407 | **High** | Wrong `"use client"`; 3× `dangerouslySetInnerHTML`; demo form with no submit handler. |
| `src/components/blocks/final/index.tsx` | 407 | **High** | Composite export (FAQ + Audit + Footer); wrong `"use client"`; `dangerouslySetInnerHTML`; demo form. |
| `src/app/about/page.tsx` | 631 | Medium | 3 inline mini-components (GradPlaceholder, FounderAvatar, PortfolioCard) and 4 large inline data arrays. |
| `src/app/pricing/page.tsx` | 564 | Medium | TIERS array contains `<em>` HTML strings; duplicates `stripHtml`. |
| `src/app/portfolio/efedra-clinic/page.tsx` | 503 | Medium | Single hand-coded case study; the template every future case page would clone. |
| `src/components/blocks/services/index.tsx` | 289 | **High** | 6 Unsplash hotlinks at runtime; `dangerouslySetInnerHTML`. |
| `public/EfedraCaseCreenshots/efedra-demo.mp4` | – | **High** | 60 MB video served from `/public`; deploy weight + bandwidth. |
| `public/raw-design/` | – | Medium | 2.4 MB of source HTML/CSS/JSX shipped to prod. Move to `raw_design/` (already exists at repo root) or `.gitignore`. |

---

## 10. Technical debt list

### Critical
*(none — nothing currently blocks the site or causes correctness bugs in production)*

### High
1. **Industry pages don't exist** but are linked from the footer and header dropdown — every miss is a 404. Either build them (the goal of this audit) or remove the links until they ship.
2. **Content model missing.** FAQs, tiers, industries, cases, and contact info are duplicated across 5+ files. Adding 7 more industry pages multiplies this. Decide CMS vs. shared-data-file before scaling.
3. **`dangerouslySetInnerHTML` for `<em>` injection** in `comparison/index.tsx` (×3), `final/index.tsx` (×1), `services/index.tsx` (×1). Replace with `ReactNode` / structured data before any of this content becomes user-editable.
4. **`services/` block hotlinks Unsplash images** — replace with local optimized assets (or `next/image` with allowed remote pattern, after deciding the assets are safe to depend on).
5. **`/public/EfedraCaseCreenshots/efedra-demo.mp4` is 60 MB.** Move to a video host (Cloudflare Stream / Mux / YouTube unlisted) or compress aggressively + lazy-load.
6. **`comparison/index.tsx` and `final/index.tsx` are unnecessarily client-only.** Remove `"use client"`.
7. **No `next/image` anywhere.** All `<img>` tags should migrate; remote images need `next.config.ts` `images.remotePatterns`.

### Medium
8. **Homepage component file is 938 lines.** Split into `Marquee.tsx`, `Industries.tsx`, `Bento.tsx`, etc. before adding more sections.
9. **Three SSOT violations** for the industry list, the case list, and contact info. Centralise.
10. **`stripHtml` duplicated** in `app/pricing/page.tsx` and `app/sites-for/medicine/page.tsx`. Move to `src/lib/`.
11. **Manual `<link>` to fonts.googleapis.com** in `app/layout.tsx:55–68` duplicates `next/font` work and forces a runtime CSS request. Remove.
12. **No `robots.txt` / `sitemap.xml`** — Next.js can generate both via `app/sitemap.ts` and `app/robots.ts`.
13. **`/blog` placeholder is indexable.** Set `metadata.robots = { index: false, follow: false }` until content exists.
14. **Footer links to non-existent legal pages** (`/policy`, `/offer`, `/public-contract`, `/legal`).
15. **Breakpoint inconsistency** across CSS files (380/640/700/760/800/1100). Pick 3–4 canonical breakpoints, ideally matching Tailwind defaults.
16. **HeroUI Provider is global** but used only in the calculator's LeadForm. Either commit (use HeroUI more broadly) or scope the provider to `/calculator`.
17. **`framer-motion` in `package.json` with no imports** — remove or start using.
18. **Lone `messages/uk.json`** — single key (`Meta`), unused by any page (pages set metadata directly). Either commit to `next-intl` or delete the dependency to reduce surface area.
19. **`/public/raw-design/`** ships ~2.4 MB of source design files to production; either move to a sibling top-level dir (`raw_design/` already exists) or .gitignore.
20. **HeroUI dark theme** is configured in `tailwind.config.ts` but the `theme.extend.colors` in the same file already does the same job via CSS vars — pick one source of truth.

### Low
21. `outcome/index.tsx` repeats benefit row JSX 3× — convert to `.map()`.
22. `comparison/index.tsx` has 25-line className constants (`TIER_BASE`, `TIER_DEFAULT`, `TIER_POP`) that should be hoisted to a shared constants file.
23. Calculator inline magic numbers in `efedra-case-gallery.tsx` (padding 10, fontSize 11) bypass tokens.
24. `globals.css:50–84` has duplicate `.text-gradient` and `.text-gradient-soft` definitions.
25. Likely-dead selectors in `hero.css` (e.g. `.btn-play`, `.device-tag-*`); needs a usage scan.
26. `LeadForm.onSubmit` only `console.info`s — wire to a real endpoint (or note as intentional pre-launch).
27. `Newsletter` form does the same — `setSubmitted(true)` with no request.
28. Homepage `Cases` section uses an `<img>` with `src` from `c.coverImage`; should be `next/image` once next/image lands.
29. JSON-LD assumes `https://code-site.art` is canonical — confirm and centralise the origin in one constant (today repeated in every page).

---

## 11. Recommendations before adding new pages

The point of this audit is: **don't 8x the debt by templating-then-cloning the medicine page**. Do these first.

### 11.1 Stabilise (must-do)
1. Decide content source: **Sanity** (recommended given Stack section advertises it) **or** a typed `src/content/` folder. Either way, define schemas for `siteSettings`, `industry`, `caseStudy`, `pricingTier`, `faqItem`.
2. Replace `dangerouslySetInnerHTML` for `<em>` with either `ReactNode` props or a tiny `<RichText>` component that renders a small allow-list. This is the gating change for letting CMS data into blocks.
3. Remove `"use client"` from `comparison/index.tsx` and `final/index.tsx`.
4. Add `app/sitemap.ts` and `app/robots.ts`. Mark `/blog`, `/stories/*`, all unfinished routes as `noindex`.
5. Ship one industry page worth of content with the new content model, then duplicate. Rather than handcrafting each new page.
6. Move `efedra-demo.mp4` off `/public` (Mux / Cloudflare Stream / YouTube). Compress remaining `EfedraCaseCreenshots/*.png` (≥500 KB each) and migrate to `next/image`.
7. Delete the manual `<link rel="stylesheet">` to Google Fonts in `app/layout.tsx:55–68` (already covered by `next/font`).

### 11.2 De-duplicate
8. Single industry-list source (`SERVICE_NAV_LINKS` + `DEFAULT_INDUSTRIES` → one). Same for `DEFAULT_CASES` vs portfolio `CASES`.
9. Move `stripHtml` and a `SITE_ORIGIN` constant to `src/lib/`.
10. Consolidate FAQ stores; index them by category and filter at render time.

### 11.3 Polish (can wait, but cheap)
11. Split `homepage/index.tsx` into one file per section.
12. Pick 3 canonical breakpoints; replace ad-hoc media queries.
13. Add `--bg-card`, `--bg-input`, `--radius-*`, `--space-*`, `--shadow-*` tokens.
14. Migrate `services/index.tsx` Unsplash URLs to local `/public/services/*.jpg` (compressed, sized).
15. Add an `og:image` (1200×630) to layout metadata.
16. Either commit to HeroUI (use across forms) or scope the provider to `/calculator` only.

---

## 12. Safe implementation order

This is the order we'd take **before** writing any new industry/case page:

1. **(0.5d)** Decide content source. Document in `docs/CONTENT_MODEL.md`.
2. **(0.5d)** Sitemap + robots + `noindex` on placeholders. Ship.
3. **(0.5d)** Remove `"use client"` from `comparison`/`final`. Remove duplicate font `<link>`. Move `stripHtml` + `SITE_ORIGIN` to `lib/`. Delete `messages/uk.json` *or* commit to next-intl in earnest. Move `framer-motion` out of `package.json` if not used.
4. **(1–2d)** Remove `dangerouslySetInnerHTML` from blocks. Replace `<em>` HTML strings with `ReactNode` markers (e.g. `{ text, emphasis: [start, end] }` or just split into `before`, `em`, `after`). Update affected pages.
5. **(1d)** Single source of truth for industries, cases, footer links, contact info. Create `src/data/industries.ts`, `src/data/cases.ts`, `src/data/site.ts`. Stop importing `header-services.ts` separately.
6. **(0.5d)** Delete `public/raw-design/` (move to repo-root `raw_design/` if needed). Compress big PNGs. Lift `efedra-demo.mp4` off `/public`.
7. **(1d)** Migrate `<img>` → `next/image`. Add `next.config.ts` image config (no remotePatterns until you decide on Unsplash). Replace Unsplash hotlinks with local assets.
8. **(1–2d)** Wire chosen CMS (Sanity recommended) for `siteSettings`, `industry`, `pricingTier`, `caseStudy`, `faqItem`. Ship `/sites-for/medicine` reading from CMS — this becomes the template.
9. **(0.5d each)** Add new industry pages by just adding CMS documents — no new TSX.
10. **(1d)** Add `/process`, `/contacts`, plus the legal pages (`/policy`, `/offer`, `/public-contract`, `/legal`). These can be MDX or simple static.

Total **~7–10 working days** to land the foundation; then each new industry page becomes a CMS entry instead of a TSX file.

---

## 13. Acceptance checklist (before merging the first new page)

Tick each box before opening a PR for `/sites-for/<industry>`:

### Architecture
- [ ] No `dangerouslySetInnerHTML` is reached from CMS-sourced strings.
- [ ] No new `"use client"` directive that has no hooks/state/effects.
- [ ] Page imports blocks via stable named exports and passes data, not hardcoded copy.
- [ ] No new `stripHtml`, `SITE_ORIGIN`, or industry-list duplicates.
- [ ] Header (`HpHeader`) and footer (`HpFooter`) mounted exactly once on the page.

### SEO
- [ ] `metadata.title`, `metadata.description`, `metadata.alternates.canonical` set.
- [ ] `metadata.openGraph` includes `title`, `description`, `type`, `url`, and an `og:image`.
- [ ] Page renders exactly one `<h1>` (verify in DOM, not just the source).
- [ ] JSON-LD includes `Service` (or `Article` for cases) + `BreadcrumbList`; `@id`s are stable URLs.
- [ ] `app/sitemap.ts` includes the new route.
- [ ] No links to non-existent pages anywhere on the new page.
- [ ] No `robots: { index: false }` left on by accident.

### Performance
- [ ] All raster images go through `next/image` with explicit `width/height` (or `fill` + sized container).
- [ ] No image > 300 KB committed; videos < 5 MB or hosted off-public.
- [ ] No new remote image domain without an entry in `next.config.ts`.
- [ ] `npm run build` succeeds; route-level First Load JS doesn't regress more than +5 kB vs. `/sites-for/medicine`.
- [ ] Lighthouse mobile: Performance ≥ 90, SEO = 100, Accessibility ≥ 95.

### Styling
- [ ] No new hardcoded `oklch(...)` values that bypass `--bg/--ink/--accent/--line` tokens (or token gap added to `globals.css` first).
- [ ] No new ad-hoc media-query breakpoints — use the 3 canonical ones.
- [ ] No new marker class without a sibling `*.css` definition.

### Content
- [ ] Tier prices, FAQ items, contact info all sourced from a single store (CMS or `src/data/`).
- [ ] FAQs displayed and FAQs in JSON-LD are the **same list** (no drift).
- [ ] `/portfolio/<case>` for the relevant industry is cross-linked.

### Hygiene
- [ ] `npm run typecheck` clean.
- [ ] `npm run lint` clean.
- [ ] `git status` shows no unintended changes to `public/raw-design/`, `messages/`, `tsconfig.tsbuildinfo`, or `.claude/`.

---

*End of audit. Nothing in the codebase was modified.*
