# Code-Site.Solutions — Project Audit

> **Status (2026-05-22):** structural reorganization acted on.
> See `docs/superpowers/plans/2026-05-22-frontend-reorganization.md` for
> the executed plan and the per-folder READMEs under `src/` for the
> resulting conventions. Pages dropped from 4 269 to 2 412 lines (-44%);
> three vs-* monoliths (5 343 lines combined) shrank to 1 551 lines
> with content extracted to `src/content/comparisons/`.

**Project:** code-site-solutions (Code-Site.Art marketing site)  
**Audit date:** 2026-05-20  
**Scope:** Full read-only review of repository structure, stack, integrations, risks, and third-party tooling  
**Prior audit:** `docs/TECH_AUDIT_BEFORE_NEW_PAGES.md` (2026-04-30) — largely superseded; this report reflects current state

---

## 1. Executive summary

This is a **production marketing site** for a Ukrainian/European web studio, built on **Next.js 15 App Router** with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Sanity CMS** for dynamic content (industry pages, case studies, blog). The site is **bilingual (UA + EN)** via path-prefix routing (`/` = Ukrainian, `/en/*` = English) rather than `[locale]` segments.

**Maturity:** The project has evolved significantly since the April audit. Sanity is wired, dynamic routes exist for industries/portfolio/blog, sitemap/robots are present, lead capture goes to Telegram, and EN localization is substantial.

**Top risks today:**

| Severity | Issue |
|----------|--------|
| **High** | `robots.ts` **disallows `/blog`** while `sitemap.ts` **lists blog URLs** — contradictory SEO signals |
| **High** | `/api/lead` has **no rate limiting, CSRF, or bot protection** |
| **High** | Three compare-page components are **~1.7–1.9k lines each** — maintenance and bundle risk |
| **Medium** | `comparison` and `final` blocks still `"use client"` without clear need; `framer-motion` is unused |
| **Medium** | `services` block still hotlinks **6 Unsplash images**; most marketing images still use raw `<img>` |
| **Medium** | **No automated tests, no CI**, no Sanity webhook revalidation |
| **Low** | Duplicate `NextIntlClientProvider` on `/en` routes; hardcoded EN slug maps drift from Sanity |

Overall: **architecturally sound and shippable**, with SEO/API/maintainability gaps to close before scaling content further.

---

## 2. Tech stack

### 2.1 Runtime & framework

| Layer | Technology | Version (package.json) |
|-------|------------|------------------------|
| Framework | Next.js (App Router) | ^15.5.15 |
| UI library | React | ^19.0.0 |
| Language | TypeScript (strict) | ^5.9.3 |
| Styling | Tailwind CSS v4 + PostCSS | ^4.2.4 |
| UI kit | HeroUI (@heroui/react) | ^2.8.10 |
| Animation (declared, unused) | framer-motion | ^12.38.0 |
| Icons | lucide-react | ^0.469.0 |
| i18n | next-intl | ^4.11.0 |
| Theming | next-themes | ^0.4.6 |
| CMS | @sanity/client | ^7.22.0 |
| Forms | Formik + Yup | ^2.4.9 / ^1.7.1 |
| Utilities | clsx, tailwind-merge | — |
| Lightbox | yet-another-react-lightbox | ^3.31.0 |

### 2.2 Tooling & quality

| Tool | Present? | Notes |
|------|----------|-------|
| ESLint (flat config) | ✅ | `eslint-config-next` + ignores `raw_design`, `.next` |
| TypeScript `tsc --noEmit` | ✅ | `npm run typecheck` |
| Prettier | ❌ | Not configured |
| Husky / lint-staged | ❌ | No pre-commit hooks |
| Unit / E2E tests | ❌ | No Jest, Vitest, Playwright, etc. |
| CI (GitHub Actions) | ❌ | No `.github/workflows` |
| Vercel config | ❌ | No `vercel.json` (likely default Next deploy) |

### 2.3 Fonts & assets

- **next/font/google:** Manrope + JetBrains Mono (cyrillic subsets, `display: swap`)
- **Images:** Sanity CDN (`cdn.sanity.io`) allowed in `next.config.ts`; `SanityImg` wrapper uses `next/image`
- **Public folder:** Minimal — only calculator preview SVGs under `public/calculator/design/`
- Large legacy assets (`raw-design/`, 60 MB mp4) from the old audit appear **removed** from `public/`

---

## 3. Repository structure

```
code-site-solutions/
├── src/
│   ├── app/                    # Next.js App Router (41 page.tsx files)
│   │   ├── layout.tsx          # Root: fonts, metadata, NextIntl, Providers
│   │   ├── page.tsx            # UA homepage
│   │   ├── en/                 # EN mirror (layout + pages)
│   │   ├── sites-for/[slug]/   # Sanity-driven industry pages (UA)
│   │   ├── portfolio/[slug]/   # Sanity-driven case studies (UA)
│   │   ├── blog/, blog/[slug]/ # Sanity-driven blog (UA)
│   │   ├── api/lead/           # Lead POST → Telegram
│   │   ├── sitemap.ts          # Dynamic sitemap (Sanity + static)
│   │   ├── robots.ts
│   │   ├── stories/            # Component playgrounds (6 routes)
│   │   └── portfolio/_*        # Legacy static case pages (underscore prefix)
│   ├── components/
│   │   ├── blocks/             # Reusable marketing blocks (~15 blocks)
│   │   ├── homepage/           # Homepage sections + header/footer (~950 LOC index)
│   │   ├── calculator/         # Pricing calculator feature
│   │   ├── industry-page/      # Sanity → industry page renderer (~680 LOC)
│   │   ├── case-page/          # Sanity → case study renderer (~680 LOC)
│   │   ├── vs-*/               # Compare pages (very large, ~1.7–1.9k LOC each)
│   │   ├── legal/              # Legal stub pages
│   │   └── portfolio/          # efedra lightbox gallery
│   ├── lib/
│   │   ├── sanity/             # client, fetch, queries, types, portable, image
│   │   ├── site.ts             # SITE_ORIGIN, SITE_CONTACT (centralized)
│   │   ├── i18n-routes.ts      # EN slug sets, locale switcher mapping
│   │   ├── rich-text.tsx       # Safe RichText (em/link segments)
│   │   └── pricing-calculator-config.ts, calculate-website-estimate.ts
│   ├── i18n/request.ts         # next-intl locale from x-pathname header
│   └── middleware.ts           # Accept-Language redirect + pathname header
├── messages/
│   ├── uk.json                 # ~550 lines — Nav, Footer, ServiceNav, etc.
│   └── en.json                 # EN UI strings
├── scripts/                    # Sanity seeders, QA crawlers, translators (tsx)
├── docs/                       # Sprint inventories, setup, prior audit
├── types/global.d.ts
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── eslint.config.mjs
└── .env.example
```

**Excluded from TS compile:** `raw_design`, `_legacy` (directories referenced in tsconfig but empty or absent in workspace)

**Related repo (external):** `code-site-solutions-admin` — Sanity Studio + schema; GROQ queries must stay in sync with `src/lib/sanity/queries.ts`

---

## 4. Architecture

### 4.1 Rendering model

- **Server Components by default** for pages; client boundaries at header, calculator, forms, FAQ accordion, lightbox, scroll-reveal
- **No root nested layouts per section** — each page mounts `<HpHeader />` + footer itself
- **Dynamic CMS pages:** thin `page.tsx` files delegate to `IndustryPageView` / `CasePageView`
- **ISR:** portfolio `[slug]` uses `revalidate = 3600` + `generateStaticParams` from Sanity

### 4.2 Content architecture

```
Sanity CMS (production dataset)
    ↓ GROQ (queries.ts, mirrored from admin repo)
sanityFetch() with Next.js cache { revalidate, tags }
    ↓
IndustryPageView / CasePageView / Blog pages
    ↓
Block components (hero, services, comparison, FAQ, …)
```

**Static/hardcoded content still exists:**

- Homepage tiers (`HOMEPAGE_TIERS` in `app/page.tsx`)
- Pricing page tiers (UA + EN pages)
- Compare pages (`vs-wordpress`, `vs-constructors`, `vs-freelancers`) — massive inline TSX
- `services` block default Unsplash backgrounds
- `EN_INDUSTRY_SLUGS`, `EN_CASE_SLUGS`, `EN_BLOG_SLUG_MAP` in `i18n-routes.ts`

### 4.3 Block component pattern

Marketing UI is organized as **colocated block + CSS**:

- `src/components/blocks/<name>/index.tsx` + `<name>.css`
- Design tokens in `globals.css` (`--bg`, `--ink`, `--accent`, etc.)
- Tailwind utilities + bespoke CSS for gradients/animations

**Improvement since April audit:** `dangerouslySetInnerHTML` for `<em>` in blocks appears **removed**; `renderRich()` / Portable Text used instead. JSON-LD injection via `dangerouslySetInnerHTML` remains (standard pattern).

### 4.4 Locale strategy

Documented in `middleware.ts`:

1. `/` → UA by default; first visit may 302 to `/en` based on `Accept-Language` or `NEXT_LOCALE` cookie
2. `/en/*` → EN catalog
3. Deep links are **not** auto-redirected
4. `x-pathname` header → `layout.tsx` sets `<html lang>` and `i18n/request.ts` loads messages

**Locale switcher** uses `resolveLocaleAlternate()` in `i18n-routes.ts` — disables EN button when no translation exists (good UX).

**Caveat:** EN blog slug mapping is **hardcoded** (`EN_BLOG_SLUG_MAP`) while Sanity also stores `slugEn` — two sources of truth.

---

## 5. Routing inventory

### 5.1 Public routes (representative)

| Area | UA | EN | Data source |
|------|----|----|-------------|
| Home | `/` | `/en` | Static TSX |
| About, Process, Pricing, Contacts, Calculator | ✅ | ✅ | Static + messages |
| Compare | `/vs-*` (3) | `/en/vs-*` | Huge static components |
| Industries | `/sites-for/[slug]` | `/en/sites-for/[slug]` | Sanity |
| Portfolio | `/portfolio`, `/portfolio/[slug]` | `/en/...` | Sanity + legacy `_` routes |
| Blog | `/blog`, `/blog/[slug]` | `/en/blog/...` | Sanity |
| Legal stubs | `/policy`, `/offer`, `/legal`, `/public-contract` | — | `LegalStub`, `noindex` |
| Stories (dev) | `/stories/*` | — | Block playgrounds |
| API | `/api/lead` | — | Telegram |

### 5.2 Legacy / duplicate routes

- `portfolio/_efedra-clinic/page.tsx` and `portfolio/_nbyg-kobenhavn/page.tsx` (underscore = private in Next.js routing semantics for static segments)
- Dynamic `[slug]` is the **canonical** path for Sanity cases
- Risk: **duplicate content URLs** if legacy static pages are still linked

---

## 6. Third-party services & integrations

| Service | Role | Configuration |
|---------|------|---------------|
| **Sanity** | CMS for industries, cases, blog, SEO images | `NEXT_PUBLIC_SANITY_*` (CDN reads, no server token) |
| **Telegram Bot API** | Lead notifications from forms | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` via `/api/lead` |
| **Google Fonts** | Via `next/font` only (no duplicate `<link>` in layout — fixed from prior audit) |
| **Unsplash** | Default imagery in `services` block | Hotlinked URLs, not in `next.config` remotePatterns |
| **Calendly** | Linked from contact constants | External |
| **Vercel** (assumed) | Hosting | `.vercel` gitignored; no explicit config in repo |

**Not present:** Analytics (GA4/Plausible), error tracking (Sentry), email provider (Resend/SendGrid), CRM, Sanity webhooks for on-demand revalidation, CDN beyond Sanity/Vercel defaults.

---

## 7. Sanity integration

### 7.1 Client & fetch

- `createClient` with `perspective: "published"`
- Token present → `useCdn: false`
- Missing env → `sanityClient = null` (graceful build)

`src/lib/sanity/fetch.ts` wraps `client.fetch` with `next: { revalidate, tags }`.

- Default revalidate: **60s**; sitemap/industry: **3600s**
- **No `revalidateTag` webhook** — content updates depend on time-based revalidation only

### 7.2 Queries & types

- `queries.ts` (~420 lines) — GROQ mirrored from admin repo
- `types.ts` (~577 lines) — strongly typed documents
- `portable.tsx` — custom Portable Text renderer (blog body blocks)
- `locale.ts` + `loc()` helper for `{ uk, en, ru }` fields

### 7.3 Scripts (content ops)

| Script | Purpose |
|--------|---------|
| `seed-medicine.ts`, `seed-renovation.ts`, etc. | Seed Sanity documents |
| `translate-medicine-en.ts` | EN content migration |
| `patch-industry-heroes.ts` | Content patches |
| `qa-crawl.ts`, `qa-link-sources.ts` | Local QA crawlers (not in npm scripts) |
| `verify-nbyg.ts` | Case verification |

Run via `tsx` — **no `npm run qa:*` aliases** in package.json.

---

## 8. Internationalization (next-intl)

- Messages: `messages/uk.json`, `messages/en.json` (~550 lines each)
- Used for: Nav, Footer, ServiceNav, calculator strings, etc.
- **Page metadata** often set directly in `page.tsx` / `generateMetadata`, not only from `Meta.*` keys
- **EN layout** (`app/en/layout.tsx`) adds a second `NextIntlClientProvider` — redundant with root provider but functional

**Hardcoded EN gates** (`src/lib/i18n-routes.ts`):

- `EN_INDUSTRY_SLUGS` — 8 industries (medicine, renovation, legal, finance, ecommerce, auto, real-estate, courses)
- `EN_CASE_SLUGS` — e.g. `nbyg-kobenhavn`
- `EN_BLOG_SLUG_MAP` — UA slug → EN slug for locale switcher

Must be updated manually when new EN content ships.

---

## 9. API & security

### 9.1 `/api/lead`

- Accepts JSON POST; formats MarkdownV2 message; sends to Telegram
- Falls back to `console.log` when env vars missing (dev-friendly, **prod risk** if misconfigured)
- **Missing:** input length limits, rate limiting, honeypot, CAPTCHA, IP throttling, request signing
- **Missing:** CSRF protection (less critical for JSON API but bots can spam)
- Always returns `{ ok: true }` even if Telegram fails (only logs error) — **silent failure** for users

### 9.2 Secrets

- `.env*.local` and `.env` gitignored
- `.env.example` exposes **public** Sanity project id (normal for Sanity)
- Sanity: no server API token — published content via CDN only

### 9.3 XSS surface

- CMS content rendered via Portable Text and `renderRich()` — **safer than prior `<em>` HTML strings**
- JSON-LD uses `JSON.stringify` in script tags — safe when data is app-controlled

---

## 10. Performance

| Area | Status | Detail |
|------|--------|--------|
| `next/image` for Sanity | ✅ | `SanityImg` with LQIP blur |
| `next/image` elsewhere | ❌ | Raw `<img>` in hero, case, team-cards, calculator |
| Unsplash in services | ⚠ | 6 runtime hotlinks, no `remotePatterns` |
| `framer-motion` | ❌ | In package.json, zero imports in `src/` |
| Client bundles | ⚠ | HeroUI globally; compare pages very large; `comparison`/`final` client-only |
| CSS volume | ⚠ | `homepage.css` ~2293 lines, `calculator.css` ~1576, `hero.css` ~779 |
| Font loading | ✅ | next/font only |
| Static generation | ✅ | Portfolio slugs prebuilt |
| Video assets | ✅ (improved) | Large mp4 no longer in `public/` per glob |

---

## 11. SEO

### 11.1 Strengths

- `metadataBase` + per-page canonicals
- Root layout `alternates.languages` (uk/en/x-default)
- Dynamic `sitemap.ts` with hreflang alternates for bilingual routes
- Rich JSON-LD on major pages (via script injection)
- Legal stubs correctly `noindex`
- Middleware preserves crawlable UA/EN URLs

### 11.2 Issues

**Critical inconsistency:**

`src/app/robots.ts` disallows `/blog`, but `src/app/sitemap.ts` includes `/blog`, `/blog/[slug]`, and EN blog URLs. Search engines receive mixed signals.

**Other gaps:**

- No global default `og:image` in root metadata (some blog posts pull from Sanity `ogImage`)
- `/stories/*` disallowed in robots but **not** `noindex` in page metadata — OK if disallow is honored
- Legacy portfolio underscore routes may still be discoverable if linked
- `EN_BLOG_SLUG_MAP` / sitemap / Sanity `slugEn` can drift

---

## 12. Code quality & technical debt

### 12.1 Resolved since April 2026 audit

- ✅ Sanity CMS integrated
- ✅ Dynamic industry + portfolio + blog routes
- ✅ `SITE_ORIGIN`, `SITE_CONTACT` centralized in `lib/site.ts`
- ✅ `sitemap.ts` and `robots.ts` exist
- ✅ Most navigation targets now have routes (process, contacts, vs-*, legal stubs)
- ✅ `renderRich()` replaces block-level `dangerouslySetInnerHTML` for emphasis
- ✅ `raw-design/` removed from public assets
- ✅ Duplicate Google Fonts `<link>` removed from layout
- ✅ next-intl fully adopted for UI chrome (not just Meta.title)

### 12.2 Remaining debt (prioritized)

**High**

1. Fix **robots vs sitemap** for `/blog`
2. Split or data-drive **vs-wordpress / vs-constructors / vs-freelancers** (~5k LOC combined)
3. Harden **`/api/lead`** (rate limit + fail loudly to client)
4. Remove **`framer-motion`** or use it
5. Audit **legacy `portfolio/_*` pages** vs `[slug]` — avoid duplicate SEO

**Medium**

6. Remove unnecessary `"use client"` from `comparison/index.tsx` (verify hooks/events first)
7. `final/index.tsx` uses `"use client"` for HeroUI Accordion — consider server FAQ + client island
8. Replace Unsplash defaults in `services/index.tsx` with Sanity/local assets
9. Migrate remaining `<img>` → `next/image`
10. Add Sanity **webhook** → `revalidatePath` / `revalidateTag`
11. Add **CI** (`typecheck`, `lint`, `build`) on PR
12. Register `npm run qa:crawl` for `scripts/qa-crawl.ts`
13. Sync `EN_*_SLUGS` with Sanity via query or codegen

**Low**

14. Split `homepage/index.tsx` (~950 LOC) into per-section files
15. Scope HeroUI provider to calculator/forms only (bundle win)
16. Consolidate homepage tiers with Sanity `pricingTier` docs
17. Add Prettier + optional husky
18. Double `NextIntlClientProvider` on `/en` — simplify to one provider

---

## 13. Testing & QA

| Type | Status |
|------|--------|
| Automated unit tests | None |
| E2E tests | None |
| Manual QA scripts | `scripts/qa-crawl.ts`, `qa-link-sources.ts` (local dev server checks: status, h1, JSON-LD, hreflang) |
| Story routes | `/stories/*` — visual component playground |
| Typecheck / lint | Available via npm, not enforced in CI |

---

## 14. Documentation

| File | Purpose |
|------|---------|
| `docs/setup.md` | Telegram bot setup for leads |
| `docs/TECH_AUDIT_BEFORE_NEW_PAGES.md` | Historical audit (partially outdated) |
| `docs/sprint-*-inventory.md` | Sprint planning / schema inventories |
| `docs/en-localization-source.md` | EN content strategy |
| `README.md` | **Empty** (only project name) |

**Gap:** No architecture overview, env var reference, or deploy runbook in README.

---

## 15. Dependency health notes

- **Modern stack:** Next 15, React 19, Tailwind 4 — bleeding edge; watch for ecosystem compatibility
- Recommend periodic `npm audit`
- **Peer dependency surface:** HeroUI + Tailwind 4 + Next 15 — verify after upgrades
- **Admin repo coupling:** Schema/query changes require coordinated deploys in two repos

---

## 16. Recommendations (ordered)

### Immediate (before next content sprint)

1. **Remove `/blog` from `robots.ts` disallow** (or remove blog from sitemap if blog should stay private)
2. Add **rate limiting** on `/api/lead` (e.g. Vercel middleware, Upstash, or simple in-memory window)
3. Return **error to client** when Telegram delivery fails
4. Delete **`framer-motion`** from dependencies if unused
5. Document env vars in README; keep `.env.example` in sync

### Short term (1–2 weeks)

6. Refactor compare pages: extract sections to blocks or Sanity documents
7. Add **GitHub Actions**: `npm ci && npm run typecheck && npm run lint && npm run build`
8. Sanity webhook for on-demand revalidation
9. Replace Unsplash + raw `<img>` with `SanityImg` / `next/image`
10. Deprecate or redirect **legacy `portfolio/_*` routes**

### Medium term

11. Single source for EN availability (query Sanity for `title.en` instead of hardcoded sets)
12. Split homepage monolith; align pricing tiers with CMS
13. Add lightweight analytics + error monitoring
14. E2E smoke test (Playwright): homepage, one industry slug, lead form mock

---

## 17. Acceptance metrics (suggested)

| Metric | Target |
|--------|--------|
| `npm run build` | Clean on CI |
| Lighthouse mobile (homepage) | Performance ≥ 85, SEO 100 |
| Blog indexability | robots + sitemap aligned |
| Lead API | < 10 req/min/IP, 4xx on abuse |
| Compare page LOC | < 400 per route file (after refactor) |
| Sanity publish → live | < 5 min (webhook) vs 60 min (today) |

---

## 18. File reference — key entry points

| Concern | Path |
|---------|------|
| Site constants | `src/lib/site.ts` |
| Locale routing | `src/middleware.ts`, `src/lib/i18n-routes.ts` |
| Sanity | `src/lib/sanity/*` |
| Industry template | `src/components/industry-page/index.tsx` |
| Case template | `src/components/case-page/index.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` |
| Leads API | `src/app/api/lead/route.ts` |
| UI strings | `messages/uk.json`, `messages/en.json` |
| Header services nav | `src/components/homepage/header-services.ts` |

---

*End of audit. Generated 2026-05-20.*
