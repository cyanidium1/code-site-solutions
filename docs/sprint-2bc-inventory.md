# Sprint 2BC — Phase 0 inventory

> **Branch:** `audit-sprint-2bc` (off `audit-sprint-2a`) · **Snapshot:** 2026-05-16
> Phase 0 for Sprint 2BC — full EN localization of 5 core pages
> (`/pricing`, `/about`, `/process`, `/contacts`, `/portfolio`) plus the
> blog (`/blog`, `/blog/[slug]`) with schema extension and EN
> translations of the 3 Sprint 2A articles. No code or content
> changes yet. Phase 1 waits on approval.

---

## Critical findings before reading further

1. **`src/i18n/request.ts` hardcodes locale to `uk`.** Despite a complete
   `messages/en.json` (full key parity with `uk.json`, 549 lines each),
   every `useTranslations()` call returns UA strings regardless of
   pathname. The components that depend on `next-intl` today —
   `HpHeader`, `HpFooter`, `MobileMenu`, `LocaleSwitcher`, `Newsletter`,
   all 5 Calculator parts, `HeroAuditBanner` — render UA chrome even on
   `/en/...` routes. This is an **existing bug** that affects the
   already-shipped `/en/page.tsx`, `/en/calculator`, `/en/vs-*` pages.
   Fixing it is a prerequisite for Sprint 2BC because the new `/en/*`
   pages share those components. The fix is a single edit: read locale
   from pathname (`x-pathname` header is already piped through layout)
   and return `en` messages when the path starts with `/en`.

2. **None of the 5 core UA pages use `useTranslations`** — they all
   have hardcoded UA strings inline (614/643/556/144/234 lines for
   pricing/about/process/contacts/portfolio respectively). The existing
   `/en/vs-*` pages don't either; they share a `Record<Locale,
   Content>` map inside their feature module
   (e.g. `getVsWordpressContent("en")`). The `/en/page.tsx` homepage is
   a separate 540-line standalone TSX with EN content inline. This
   matches **Pattern A** from the prompt — Sprint 2BC will follow.

3. **Sprint 2A added `/blog` and `/blog/[slug]` but they are UA-only,
   with the locale switcher correctly disabled on those routes** (see
   `resolveLocaleAlternate` returning `en: null` for `/blog*` after the
   c0c8276 hotfix). Sprint 2BC undoes that disable by adding `/en/blog`
   and `/en/blog/[slug]` and registering them in `EN_LOCALIZED_ROOTS`.
   Until those routes exist, the disable stays in place.

4. **The author object on `blogPost` is non-localized.** `name`,
   `role`, `bio` are plain strings. Author info doesn't change between
   locales for our use case (one person, same job title in both
   languages), so we'll keep this field as-is and not add `authorEn`
   shadow fields. The source file's PART B does not provide separate EN
   author copy.

5. **Blog cover images are non-localized static assets** under
   `/public/blog/` (per the cover-images commit). The alt text is
   currently a single string. Source file's PART B does provide
   different EN alt text for each cover (charts have the same image but
   the alt sentence should be translated). Will need an `altEn` shadow
   on `coverImage` or a separate `coverImageAltEn` field.

6. **Sprint 2A added one bug not yet fixed: the `BlogPostRef` GROQ
   projection at `src/lib/sanity/queries.ts` (and the admin mirror)
   still queries `title { uk, ru, en }` and `excerpt { uk, ru, en }` —
   but Sprint 2A changed those fields to plain strings.** That
   projection is used by `relatedPosts` on `industryPage` and
   `caseStudy`. It returns malformed data today (the strings come back
   as `null` for `uk/en/ru`). No frontend rendering currently consumes
   that — `relatedPosts` is queried but never displayed — so it's not a
   visible regression, but it should be fixed during Sprint 2BC since
   we're touching blog queries anyway.

---

## 1. Current EN coverage in routes

**EN pages that exist today** (`src/app/en/**/page.tsx`):

| Route | Mirrors | Content storage |
|---|---|---|
| `/en` | `/` | Standalone TSX, hardcoded EN content (540 lines) |
| `/en/calculator` | `/calculator` | Shared `<WebsiteCalculator>` (next-intl, currently broken — see Critical Finding #1) |
| `/en/portfolio/[slug]` | `/portfolio/[slug]` | Sanity-driven (`caseStudy.title.en` etc.); 404s if EN title absent |
| `/en/portfolio/_nbyg-kobenhavn` | `/portfolio/_nbyg-kobenhavn` | Legacy hand-coded EN twin |
| `/en/sites-for/[slug]` | `/sites-for/[slug]` | Sanity-driven (`industryPage.title.en` etc.); 404s if EN absent; gate via `EN_INDUSTRY_SLUGS` |
| `/en/vs-constructors` | `/vs-constructors` | `Record<Locale, Content>` in `vs-constructors` module |
| `/en/vs-freelancers` | `/vs-freelancers` | Same pattern |
| `/en/vs-wordpress` | `/vs-wordpress` | Same pattern |

**UA pages WITHOUT EN twins** (everything the user wants to ship plus the rest):

| Route | Why missing | Sprint 2BC? |
|---|---|---|
| `/pricing` | No EN file | ✅ Sprint 2BC |
| `/about` | No EN file | ✅ Sprint 2BC |
| `/process` | No EN file | ✅ Sprint 2BC |
| `/contacts` | No EN file | ✅ Sprint 2BC |
| `/portfolio` (listing) | No EN file | ✅ Sprint 2BC |
| `/blog` | UA-only per Sprint 2A | ✅ Sprint 2BC |
| `/blog/[slug]` | UA-only per Sprint 2A | ✅ Sprint 2BC |
| `/legal`, `/policy`, `/offer`, `/public-contract` | Compliance copy; needs legal-locale review | ❌ Separate sprint |
| `/stories/*` | Internal storybook routes, no EN need | ❌ Out of scope |

---

## 2. Where each page's content lives

### `/pricing` ([src/app/pricing/page.tsx](src/app/pricing/page.tsx), 614 lines)

- **Storage**: hardcoded UA strings inline in TSX (metadata + section
  copy + tier definitions + FAQ items).
- **Sanity dependency**: none for content. Pulls case studies for the
  `<Cases>` block (Sanity-driven, locale-aware via `<Cases locale={...}>`
  prop).
- **Composable blocks used**: `PageHero`, `TurnkeyList`, `Tier`,
  `CtaBanner`, `FAQ`, `Bento`, `FinalCta3`. All accept props — easy to
  reuse with EN strings.
- **JSON-LD**: emitted inline (BreadcrumbList, likely Service).
- **EN twin pattern**: **Pattern A** — new `app/en/pricing/page.tsx`
  with hardcoded EN strings, identical block composition.

### `/about` ([src/app/about/page.tsx](src/app/about/page.tsx), 643 lines)

- **Storage**: hardcoded UA inline.
- **Component**: `<TeamSection>` from
  `src/components/about/team-section.tsx` — team data is also
  hardcoded UA inside that component (Fedir's role string, bio, etc.).
- **Sanity dependency**: `<Cases>` block (cases come from Sanity).
- **EN twin pattern**: **Pattern A**. `TeamSection` will need to accept
  EN labels via prop or use a `Record<Locale, ...>` map similar to the
  vs-* pattern. Simpler: pass `locale` prop and have an internal map.

### `/process` ([src/app/process/page.tsx](src/app/process/page.tsx), 556 lines)

- **Storage**: hardcoded UA.
- **Component**: `<VerticalTimeline>` (process steps). Steps are passed
  in as props from the page. EN twin just passes EN-translated step
  data.
- **EN twin pattern**: **Pattern A**.

### `/contacts` ([src/app/contacts/page.tsx](src/app/contacts/page.tsx), 144 lines)

- **Storage**: hardcoded UA inline. Page is mostly a `PageHero` +
  `ContactSplit` + `FAQ`.
- **Component**: `ContactSplit` from `src/components/blocks/contact-split/`
  — accepts props for channels, brief form labels, etc.
- **Hero-audit banner**: rendered conditionally via `HeroAuditBanner`
  which uses `useTranslations` — so it's already half-localized (relies
  on the i18n fix from Critical Finding #1).
- **EN twin pattern**: **Pattern A**.

### `/portfolio` (listing) ([src/app/portfolio/page.tsx](src/app/portfolio/page.tsx), 234 lines)

- **Storage**: page chrome (hero, eyebrow, sub, filters labels, CTAs)
  hardcoded UA. Card data comes from Sanity (`caseStudy` docs with
  `title { uk, en }`, `region`, etc.).
- **EN twin pattern**: **Pattern A** for the chrome; cards adopt EN via
  the existing `loc(field, "en")` localization helper.

### `/blog` listing ([src/app/blog/page.tsx](src/app/blog/page.tsx))

- **Storage**: Sanity-driven via `BLOG_POSTS_LIST_QUERY`. Page chrome
  (hero H1/lede, metadata) hardcoded UA.
- **EN twin pattern**: **Pattern A** for chrome. The Sanity query needs
  to filter by EN content presence (only show posts where `slugEn`
  exists) and return EN fields.

### `/blog/[slug]` post ([src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx))

- **Storage**: Sanity-driven via `BLOG_POST_BY_SLUG_QUERY`. Page chrome
  hardcoded UA.
- **EN twin pattern**: **Pattern B** for content (Sanity schema
  extension with EN shadow fields, plus `slugEn` for separate EN URL
  slugs) + **Pattern A** for chrome.

### Confirmation: blog post fields are flat (per Sprint 2A)

Looking at the admin `blogPost.ts` schema as it stands at the end of
Sprint 2A: `title`, `metaTitle`, `metaDescription`, `eyebrow`, `lede`,
`category`, `tags`, `body`, `faq[]`, `relatedPostSlugs` are all
plain strings (non-localized). `author` is a flat object,
`coverImage` is `{ src, alt }`, `readingTimeMinutes` is a number,
`publishedAt`/`updatedAt` are datetimes. ✓ — matches Phase 0
expectations.

### Blocking dependencies on localized blog content

- **`relatedPosts` on `industryPage` and `caseStudy`**: those docs have
  a `references[]` to `blogPost`. Their existing GROQ projection
  (`BLOG_POST_REF`) still queries `title { uk, ru, en }` which is now
  stale (Sprint 2A made title plain). This isn't a Sprint 2BC blocker
  — `relatedPosts` is queried but not rendered anywhere — but it should
  be cleaned up during Sprint 2BC since we're touching blog queries.
- **Sitemap**: blog posts are emitted UA-only via Sprint 2A
  (5c8b8ea). Sprint 2BC needs to emit `/en/blog/<slugEn>` for any post
  with `slugEn` present.
- **Navigation**: `Nav.blog` key exists in both `messages/uk.json`
  ("Блог") and `messages/en.json` ("Blog"). Header dropdown link
  always points to `/blog` regardless of locale (a known minor bug —
  the EN header should link to `/en/blog`). Fix during Sprint 2BC.

---

## 3. Component-level localization gaps

### Already using `useTranslations` (next-intl)

Files that import from `next-intl`:

- `src/components/homepage/hp-header.tsx` — `Nav`, `ServiceNav`,
  `LocaleSwitcher` namespaces.
- `src/components/homepage/hp-footer.tsx` — `Footer`, `Newsletter`,
  `Nav` namespaces.
- `src/components/homepage/mobile-menu.tsx` — `Nav`, `ServiceNav`,
  `LocaleSwitcher`.
- `src/components/homepage/locale-switcher.tsx` — `LocaleSwitcher`.
- `src/components/homepage/newsletter.tsx` — `Newsletter`.
- `src/components/blocks/contact-split/HeroAuditBanner.tsx` — likely
  `Audit`/`HeroAudit` namespace.
- `src/components/calculator/*.tsx` (5 files) — `Calculator` namespace.

**These all work correctly IF `request.ts` returns the right messages
file. Today it always returns UA — see Critical Finding #1.**

### Components with hardcoded inline strings

(Anything used by the 5 core pages but not currently using
`useTranslations`)

- `src/components/blocks/page-hero/index.tsx` — accepts breadcrumbs,
  eyebrow, headline, sub as props. **No inline strings. ✓**
- `src/components/blocks/turnkey-list/index.tsx` — accepts items array.
  **No inline strings.** Used by `/pricing`.
- `src/components/blocks/comparison/index.tsx` (Tier component) —
  accepts props. **No inline strings.** Used by `/pricing`.
- `src/components/blocks/cta-banner/index.tsx` — accepts eyebrow,
  heading, sub, CTAs. **No inline strings. ✓**
- `src/components/blocks/final/index.tsx` (FAQ + Audit + ClinicFooter)
  — FAQ accepts items prop. **No inline UA strings in FAQ. ✓** Audit
  has DEFAULT props in UA but accepts overrides — used by industry
  page, not by any of Sprint 2BC's 5 core pages.
- `src/components/blocks/contact-split/index.tsx` — accepts heading,
  channels, brief form labels. **Channels labels are passed in.** ✓
- `src/components/about/team-section.tsx` — team data is hardcoded UA
  inside the component (Fedir's bio, etc.). **NEEDS WORK** — accept
  team data via prop or add internal `Record<Locale, TeamData>` map.
- `src/components/blocks/vertical-timeline/` — used by `/process`,
  accepts steps prop. **No inline strings.** ✓
- `src/components/blocks/lead-form/` — used by `/contacts`. **Uses
  hardcoded UA labels.** Needs locale prop or use `useTranslations`.
- `src/components/homepage/index.tsx` — exports `Bento`, `Cases`,
  `Stack`, `FinalCta3`, `Industries`, `Process`, `Marquee`, etc. Most
  accept content via props (the homepage and the existing EN
  `/en/page.tsx` already prove this works). ✓
- `src/components/blocks/related-card/index.tsx` (Sprint 2A) — fully
  prop-driven. ✓

### Per-page string-extraction work

| Page | Extraction effort |
|---|---|
| `/en/pricing` | None — all strings pass as props. Just clone the page file with EN copy. |
| `/en/about` | Extract team data from `TeamSection`. ~1 hour. |
| `/en/process` | None — steps pass as data. |
| `/en/contacts` | Localize `LeadForm` (CSR component, labels are inline). ~30 min. |
| `/en/portfolio` | None — minimal chrome. |
| `/en/blog`, `/en/blog/[slug]` | Schema extension + GROQ + seed (see §7) plus EN chrome strings. |

---

## 4. `EN_LOCALIZED_ROOTS` current state

Current ([src/lib/i18n-routes.ts:36-41](src/lib/i18n-routes.ts)):

```ts
export const EN_LOCALIZED_ROOTS: ReadonlySet<string> = new Set([
  "/vs-wordpress",
  "/vs-constructors",
  "/vs-freelancers",
  "/calculator",
]);
```

Industry slugs separately via `EN_INDUSTRY_SLUGS`: `["medicine"]`.
Case slugs separately via `EN_CASE_SLUGS`: `["nbyg-kobenhavn"]`.

### Adds for Sprint 2BC

After Phase 1 ships, add:
```
"/pricing", "/about", "/process", "/contacts", "/portfolio", "/blog"
```

Plus: `resolveLocaleAlternate()` needs a new branch for `/blog/[slug]`
that maps UA slug ↔ EN slug. The mapping isn't a simple prefix swap
(slugs differ per article, per the source file: `skilky-koshtuye-sayt-2026`
↔ `website-cost-2026-breakdown` etc.). Two options:

- **(a)** Hardcode an `EN_BLOG_SLUG_MAP: Record<string, string>` in
  `i18n-routes.ts` for the 3 articles; the switcher reads it. Simple,
  static, but needs updating whenever a new article ships.
- **(b)** Resolve dynamically by querying Sanity for `slugEn` given a
  UA slug. Async, can't run in the synchronous switcher render — would
  need a server-component prop drilling pattern.

Recommend **(a)** for Sprint 2BC. With only 3 articles and slow growth,
the hardcoded map is the right cost/complexity trade.

---

## 5. Sitemap state

[src/app/sitemap.ts](src/app/sitemap.ts) today:

- **Static routes** with EN hreflang (in `EN_LOCALIZED_PATHS` set):
  `/`, `/vs-wordpress`, `/vs-constructors`, `/vs-freelancers`,
  `/calculator`. These emit both UA and EN URLs with `alternates.languages`.
- **Static routes** WITHOUT EN: `/about`, `/pricing`, `/portfolio`,
  `/blog`. UA-only emission.
- **Sanity industry pages**: EN URL emitted when slug ∈ `EN_INDUSTRY_SLUGS`.
- **Sanity case studies**: EN URL emitted when `title.en` is set.
- **Sanity blog posts**: UA-only emission (Sprint 2A).

### Adds for Sprint 2BC

- Move `/about`, `/pricing`, `/portfolio`, `/blog` into the
  `EN_LOCALIZED_PATHS` set (so they get UA + EN entries with
  `alternates.languages`).
- Add `/process`, `/contacts` to `STATIC_ROUTES` if not already there
  AND add to `EN_LOCALIZED_PATHS`.
- Blog posts: emit `/en/blog/<slugEn>` for any post whose `slugEn`
  field is populated. Hreflang alternates point between UA slug and EN
  slug.

---

## 6. Translation strategy per page

Per the prompt's "recommend ONE of three patterns":

| Page | Pattern | Why |
|---|---|---|
| `/en/pricing` | **A** — new TSX with inline EN | Page is already a standalone TSX with hardcoded UA; cloning is fastest. Matches `/en/page.tsx` precedent. |
| `/en/about` | **A** — new TSX + extend `TeamSection` to accept locale-aware data | Same standalone-TSX pattern; team data is the only piece that needs a localized data source (added inside the component as a `Record<Locale, …>` map). |
| `/en/process` | **A** — new TSX | Steps pass as data props; no schema changes. |
| `/en/contacts` | **A** — new TSX + localize `LeadForm` labels | Localize the form component once (via `useTranslations` or locale prop); reuse for both. |
| `/en/portfolio` | **A** — new TSX | Chrome is tiny; cards already get EN via `loc(field, "en")`. |
| `/en/blog` listing | **A** for chrome + **B** for content (already in Sanity) | Chrome strings inline; content comes from Sanity with the new EN shadow fields. |
| `/en/blog/[slug]` | **A** chrome + **B** content | Same pattern. |

**Pattern C (`messages/*.json`)** — not recommended for these pages.
The site's existing convention is to use messages JSON only for tiny
shared chrome strings (nav labels, footer headings, calculator
controls). Long marketing copy lives in TSX or Sanity. Pattern C would
break that consistency and put 1,000+ string keys into the JSON files.

---

## 7. Proposed `blogPost` schema EN extension shape

### Admin schema additions (`schemaTypes/documents/blogPost.ts`)

```ts
// Existing UA fields stay as-is. Add shadow EN fields:

defineField({ name: 'titleEn', title: 'Title (EN)', type: 'string', group: 'basic' }),
defineField({
  name: 'slugEn',
  title: 'Slug (EN, separate from UK)',
  type: 'slug',
  group: 'basic',
  options: { source: 'titleEn', maxLength: 96 },
}),
defineField({ name: 'eyebrowEn', title: 'Eyebrow (EN)', type: 'string', group: 'content' }),
defineField({ name: 'ledeEn', title: 'Lede (EN)', type: 'text', rows: 3, group: 'content' }),

// Body — separate blogBody portable text, EN custom blocks reused
defineField({ name: 'bodyEn', title: 'Body (EN)', type: 'blogBody', group: 'content' }),

// FAQ shadow array. Same shape as `faq`, different content.
defineField({
  name: 'faqEn',
  title: 'FAQ (EN)',
  type: 'array',
  group: 'content',
  of: [/* same shape as faq */],
}),

// SEO shadows
defineField({ name: 'metaTitleEn', title: 'Meta title (EN)', type: 'string', group: 'seo' }),
defineField({ name: 'metaDescriptionEn', title: 'Meta description (EN)', type: 'text', group: 'seo' }),

// Cover alt shadow (image asset itself stays language-neutral).
// Lives inside coverImage object as a second field altEn alongside alt.

// Related posts EN: optional override, otherwise resolve UA slugs via slugEn lookup.
defineField({
  name: 'relatedPostSlugsEn',
  title: 'Related posts (EN slugs, max 3)',
  type: 'array',
  of: [{ type: 'string' }],
  group: 'related',
}),
```

### Frontend GROQ + types

- `BLOG_POSTS_LIST_QUERY` accepts a `$locale` parameter; selects
  `title` / `titleEn` etc. based on locale at projection time. Or
  always returns both and the page picks. **Recommend the
  parameterized projection** — keeps the wire payload small.
- `BLOG_POST_BY_SLUG_QUERY` matches by `slug.current == $slug` (UA) OR
  `slugEn.current == $slug` (EN). Two separate queries probably
  cleaner: `BLOG_POST_BY_UK_SLUG_QUERY` and `BLOG_POST_BY_EN_SLUG_QUERY`.
- `BlogPostDoc` and `BlogPostListItem` types remain plain strings for
  the current-locale fields; the resolver picks UA or EN before
  returning.

### Static params on EN route

```ts
// app/en/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY_EN, // filters where defined(slugEn.current)
    revalidate: 300,
  });
  return posts.map((p) => ({ slug: p.slug }));
}
```

If `slugEn` is not present on a doc → that doc is invisible on EN
listing AND its EN URL 404s. UA listing keeps showing the UA version
unaffected.

### EN slug map for the 3 Sprint 2A articles

Per the source file's PART B header:

```
skilky-koshtuye-sayt-2026      → website-cost-2026-breakdown
tilda-7200-za-3-roky           → tilda-7200-over-3-years
dohovir-z-veb-studieyu-7-punktiv → web-studio-contract-7-items
```

These will be set as `slugEn.current` on each doc via the seed (re-run
of `scripts/seed-blog-posts.ts` with the new shadow fields populated).

### `relatedPostSlugsEn` resolution

For each EN post, surface 2 related posts via either:

- The new `relatedPostSlugsEn` array on the doc (explicit EN slugs)
- OR resolve UA `relatedPostSlugs` to their EN counterparts via a slug
  map (read `slugEn.current` for each referenced doc)

Recommend the latter (cleaner — keeps related-post curation
single-sourced). Implementation: in the query, follow each UA slug
through Sanity to get `slugEn.current`.

---

## Summary of deltas needed for Phase 1

### Frontend repo

- `src/i18n/request.ts` — read locale from `x-pathname` header, return
  `en.json` for `/en/...` routes. **Prerequisite — fixes existing
  bug.**
- `src/lib/i18n-routes.ts` — `EN_LOCALIZED_ROOTS` adds 6 paths;
  `resolveLocaleAlternate` adds blog slug-map branch.
- `src/app/en/pricing/page.tsx` — new file, inline EN copy from
  PART A.1.
- `src/app/en/about/page.tsx` — new file (+ extend `TeamSection`).
- `src/app/en/process/page.tsx` — new file.
- `src/app/en/contacts/page.tsx` — new file (+ localize `LeadForm`).
- `src/app/en/portfolio/page.tsx` — new file.
- `src/app/en/blog/page.tsx` — new file, queries EN-aware list.
- `src/app/en/blog/[slug]/page.tsx` — new file, EN-aware fetch.
- `src/lib/sanity/queries.ts` — EN-aware blog queries; fix stale
  `BLOG_POST_REF` projection.
- `src/lib/sanity/types.ts` — extend `BlogPostDoc` /
  `BlogPostListItem`; types stay plain strings (resolved by GROQ).
- `src/app/sitemap.ts` — promote `/about`, `/pricing`, `/portfolio`,
  `/blog`, `/process`, `/contacts` into `EN_LOCALIZED_PATHS`; emit EN
  blog posts.
- `src/components/about/team-section.tsx` — locale-aware team data.
- `src/components/calculator/LeadForm.tsx` (or wherever the contact
  form lives) — use `useTranslations` for labels.

### Admin repo

- `schemaTypes/documents/blogPost.ts` — add EN shadow fields
  (titleEn, slugEn, eyebrowEn, ledeEn, bodyEn, faqEn, metaTitleEn,
  metaDescriptionEn, coverImage.altEn, relatedPostSlugsEn).
- `queries/blogPost.ts` — mirror frontend EN-aware queries.
- `scripts/seed-blog-posts.ts` — populate EN shadow fields for the 3
  Sprint 2A articles from PART B (verbatim).

### Out of scope (separate sprints)

- 6 disabled industry pages without UA content (Legal, Accounting,
  E-commerce, SaaS, Cosmetology, Education) — wait for UA first.
- Legal pages (`/policy`, `/offer`, `/public-contract`, `/legal`) —
  needs legal translator.
- DE / PL locales — future.

---

## Open questions for the user before Phase 1

1. **`src/i18n/request.ts` fix scope.** The fix is small but its
   effects ripple — every existing `/en/...` route gets a different
   header/footer/calculator chrome render. Risk: a subtle EN message
   key was never added or has a typo; rendering breaks. Acceptable
   risk?
2. **`messages/en.json` audit.** Should I verify key parity (and
   value-presence) between `uk.json` and `en.json` BEFORE the
   `request.ts` fix? A quick scan suggests parity, but a missing
   string would render as a `MISSING_MESSAGE` error in production.
3. **Team data locale model.** Add `Record<Locale, TeamData>` inside
   `team-section.tsx`, or expose a `data` prop and the page passes EN
   data? Either works; the former is more contained.
4. **Slug mapping for blog.** Hardcoded `EN_BLOG_SLUG_MAP` (option a)
   vs Sanity-driven dynamic (option b)? Recommend (a).
5. **`relatedPostSlugsEn`**: explicit per-doc array or resolved from
   UA slugs at query time? Recommend resolution.
6. **The stale `BLOG_POST_REF` projection** — clean up during Sprint
   2BC (cleaner) or leave for later (smaller diff)? It's a 5-line fix.
7. **JSON-LD `Service` schema on `/en/pricing`** — match the
   `industryPage` `Service` shape? Or `Offer`-only as on the UA
   `/pricing` today (need to verify which it actually uses).

Awaiting approval before Phase 1.
