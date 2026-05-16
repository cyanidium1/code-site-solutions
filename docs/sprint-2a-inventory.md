# Sprint 2A — Phase 0 inventory

> **Branch:** `audit-sprint-2a` · **Snapshot:** 2026-05-16
> Phase 0 of the Sprint 2A prompt. No code or content changes yet — this
> document establishes ground truth before authoring 3 blog articles via
> Sanity. Phase 1 waits on user approval.

---

## Critical findings before reading further

Several premises in the Sprint 2A prompt are wrong against current `master`.
None of these are blockers, but each forces a decision before Phase 1
starts.

1. **The admin repo is not a git repository.** `code-site-solutions-admin`
   has no `.git/` directory — only the frontend (`code-site-solutions`) is
   versioned. The Phase 1 plan ("commit structure on `audit-sprint-2a`
   branch") implicitly assumes both repos are git-tracked. Schema changes
   to the admin repo will land as plain file edits with no commit history.
   Confirm desired handling before Phase 1.

2. **No `teamMember` doc type exists in Sanity.** The prompt says
   "author (reference to a `teamMember` doc — use existing `fedir` doc)"
   but there is no `teamMember` schema and no `fedir` document. The only
   document types are `blogPost`, `caseStudy`, `industryPage`. Author info
   today lives as plain strings (`authorName`, `authorRole`) inside
   `quoteBlock` / `servicesBlock.testimonial` / `testimonialBlock`. Two
   options:
   - **(a)** add a `teamMember` document type + seed a `fedir` doc, then
     reference it from `blogPost.author`. Heavier but matches the prompt
     literally.
   - **(b)** add a flat `author` object on `blogPost` (`{ name, role,
     avatar }`) and hardcode Fedir's values. Lighter, ships in minutes.
   No memory exists on this — needs your call.

3. **The blog UI is a 33-line "Скоро" placeholder with `robots:
   noindex, nofollow`.** `src/app/blog/page.tsx:1-34` is a single hero
   panel that says "Скоро / Готуємо матеріали…" and explicitly tells
   Google not to index. Phase 1 must (a) replace this file with a Sanity-
   driven listing, (b) flip `robots` to default (indexable), (c) add a
   per-post route `src/app/blog/[slug]/page.tsx` that does not exist yet.

4. **The `blogPost` body is `richTextSimple`, a deliberately minimal
   portable-text array — no custom blocks, no images, no lists, no
   headings.** `code-site-solutions-admin/schemaTypes/objects/
   richTextSimple.ts:9-46` registers `block` only with style `normal`,
   marks `strong`/`em` and a `link` annotation. There is **no h2/h3/h4
   style, no list, no image block, no embedded object**. The frontend
   renderer at `src/lib/sanity/portable.tsx:38-56` *does* support
   `h2/h3/h4/blockquote` rendering, but the schema cannot produce those
   blocks — the Studio editor only offers "Звичайний / Жирний / Курсив /
   Посилання". Phase 1 *will* need to either (a) extend `richTextSimple`
   with headings/lists/image **and** add the custom block types
   `tldrBox`, `ctaCallout`, `faqGroup`, `table`, `code`, or (b) author a
   dedicated `blogBody` portable-text type that supersedes
   `richTextSimple` on `blogPost.body`. The prompt itself acknowledges
   this in the "Required fields" line ("body (portable text with custom
   blocks: tldrBox, ctaCallout, table, image, code, faqGroup)").

5. **GROQ queries for blog posts exist in `admin/queries/blogPost.ts`
   but are NOT mirrored into the frontend.** The frontend's
   `src/lib/sanity/queries.ts` exports only `CASE_STUDIES_QUERY`,
   `CASE_STUDY_BY_SLUG_QUERY`, `INDUSTRY_PAGES_QUERY`,
   `INDUSTRY_PAGE_BY_SLUG_QUERY` — no `BLOG_POSTS_QUERY` or
   `BLOG_POST_BY_SLUG_QUERY`. The frontend cannot fetch any blog post
   today, even though the admin has a query file ready. Phase 1 must
   add these two exports to `src/lib/sanity/queries.ts` plus a
   `BlogPostDoc` type to `src/lib/sanity/types.ts` (only `BlogPostRef`
   exists today, used by relatedPosts on industry / case pages).

6. **The `/06 CASES` block on the homepage is inline markup, not a
   reusable `<CaseCard>` component.** The prompt says "render related
   articles as cards reusing whatever the homepage uses for /06 CASES".
   The Cases section is the `Cases()` function at
   `src/components/homepage/index.tsx:672-…` and the card JSX is
   hand-rolled inside its render (lines 700+). It is not extracted. To
   reuse it for related-article cards, Phase 1 has to either (a)
   extract a `<CaseCard>` / `<ContentCard>` and use it from both Cases
   and the related-articles strip, or (b) build a parallel BlogCard
   that shadows the visual style. Cleaner is (a); ymmv.

---

## 1. Blog page state

**`app/blog/page.tsx`** — exists. Placeholder. 33 lines.
`src/app/blog/page.tsx:1-34`:

- Renders `<HpHeader />` + a single `<section>` with eyebrow `/ БЛОГ`,
  H2 "Скоро", and a one-line sub. No list, no Sanity fetch.
- `export const metadata`: title "Блог — Code-Site.Art", canonical
  `/blog`, **`robots: { index: false, follow: false }`**.

**`app/blog/[slug]/page.tsx`** — **does not exist**. No per-post route.

**`app/en/blog/page.tsx`** — **does not exist**. No EN blog at all.
`src/app/en/` contains: `calculator`, `portfolio`, `sites-for`,
`vs-constructors`, `vs-freelancers`, `vs-wordpress`, `layout.tsx`,
`page.tsx`. No `blog/`.

**`app/en/blog/[slug]/page.tsx`** — **does not exist**.

---

## 2. Sanity `blogPost` schema

**Location:** `code-site-solutions-admin/schemaTypes/documents/
blogPost.ts:16-132`. Registered in `schemaTypes/index.ts:31,66`.

**Fields shipped today:**

| Field | Type | Notes |
|---|---|---|
| `title` | `localizedString` (uk/ru/en) | UK required |
| `slug` | `slug` | derived from `title.uk`, max 96 |
| `status` | radio `draft`/`published` | initial `draft` |
| `publishedAt` | `datetime` | no `updatedAt` field |
| `coverImage` | `imageWithLocalizedAlt` | alt UK warned, not errored |
| `excerpt` | `localizedText` | shown on related-post cards |
| `body` | `richTextSimple` | minimal PT — see §3 |
| `seo` | `seoFields` (title.uk, description.uk, ogImage) | UK title+description required when status=published |
| `relatedCases` | `array<reference→caseStudy>` | for cross-linking out |
| `relatedIndustries` | `array<reference→industryPage>` | for cross-linking out |

**Body type:** `richTextSimple` is portable text with **only**:
- One style: `normal` (no h2/h3/h4)
- Marks: `strong`, `em`, plus a custom `link` annotation
  (`href` + `newTab`)
- No lists, no images, no embedded blocks, no code, no quote style

**Schema gap vs. Phase 1 requirements** (everything the prompt lists as
"Required fields on each blogPost document" that doesn't exist yet):

| Required field | Status | Action needed |
|---|---|---|
| `slug` | ✅ exists | — |
| `title` (uk) | ✅ exists | — |
| `metaTitle` (uk) | ⚠ exists as `seo.title.uk` | reuse or alias |
| `metaDescription` (uk) | ⚠ exists as `seo.description.uk` | reuse or alias |
| `eyebrow` | ❌ missing | add `localizedString` |
| `lede` | ⚠ exists as `excerpt` (localizedText) | reuse |
| `coverImage` | ✅ exists | — |
| `ogImage` | ⚠ exists at `seo.ogImage` | reuse |
| `author` (ref `teamMember`) | ❌ missing — no `teamMember` doc type either | see Critical Finding #2 |
| `category` (string) | ❌ missing | add `string` (or `list` of allowed values) |
| `tags` (array string) | ❌ missing | add `array<string>` |
| `publishedAt` | ✅ exists | — |
| `updatedAt` | ❌ missing | add `datetime` |
| `readingTimeMinutes` | ❌ missing | add `number` (int) |
| `body` (PT w/ tldrBox, ctaCallout, table, image, code, faqGroup) | ❌ current type only allows normal + strong/em/link | add a new portable-text type `blogBody` with full block set + custom blocks |
| `faq` (separate field) | ⚠ `faqBlock` object type exists in admin, but is currently used only as a section block in `industryPage.sections[]` — `blogPost` has no `faq` field | add `faq` field of type `faqBlock` (reuse existing) |
| `relatedPostSlugs` (array string) | ❌ missing (current `blogPost` has `relatedCases` / `relatedIndustries` refs but not blog→blog) | add `array<string>` OR `array<reference→blogPost>` |

**`faqBlock` already exists** at `schemaTypes/blocks/faqBlock.ts` with
items `{ question: localizedString, answer: richTextSimple, answerEn:
richTextSimple }`. Reusable. ✅

**Localization model:** all human-readable strings on blogPost are
`localizedString` / `localizedText` (uk/ru/en branches). Phase 1 UA-only
posts fill `.uk` only — the prompt's "Do NOT translate to English — UA
only for now" is consistent with this shape.

---

## 3. Renderer

**Portable-text library:** custom — there is **no** `@portabletext/react`
dependency. The repo has its own renderer at
`src/lib/sanity/portable.tsx:38-78` that:

- Renders block styles: `normal` → `<p>`, `h2`/`h3`/`h4` → headings,
  `blockquote` → `<blockquote>`
- Renders marks: `strong`, `em`, `underline`, `code`, plus `link`
  annotation
- Has **no** custom-block dispatch (no `_type` switch beyond `block`)
- Has helper `PortableInline` (no `<p>` wrapper) and `plainPortable`
  (strips formatting → plain string, used for FAQ JSON-LD answer text)

**Consequence:** any new custom block types added to the Sanity schema
(`tldrBox`, `ctaCallout`, `code`, `image`, `table`, `faqGroup`) need a
matching renderer branch added to `portable.tsx` (or a parallel
`portable-blog.tsx` if we want to keep the simple renderer pristine).

**FAQ block rendering** — exists at
`src/components/blocks/final/index.tsx:187-233`. Signature:

```ts
FAQ({
  heading?: string;
  items?: { q: string; a: RichText }[];
}: { heading?, items? } = {})
```

Note the items shape uses `RichText` from `@/lib/rich-text` (a totally
different rich-text model — not the Sanity portable text). The
industry-page adapter at
`src/components/industry-page/index.tsx:504-517` already bridges
Sanity's `faqBlock.items[{ question, answer }]` → the FAQ component's
`{ q, a }` shape, and does so by **flattening `answer` (portable text)
into a single plain string via `plainPortable`** — losing any inline
bold/italic/links in the answer. Phase 1 should preserve the same
adapter approach for the blog page (or fix the adapter to pass through
formatted nodes).

**Mid-article CTA / pull-quote / TL;DR — no custom block types exist in
the schema, and the renderer has no dispatch for them.** Closest visual
equivalents available:

- `CtaBanner` (`src/components/blocks/cta-banner/index.tsx:20-71`) —
  full-width section card with eyebrow, heading, sub, primary CTA,
  optional secondary CTA. Visually heavy (py-100px, max-w-780 heading).
  Reusable for `ctaCallout`.
- No existing "TL;DR" / callout-box component. Phase 1 needs to build
  one from scratch.

**Internal links in portable text:** today done via the `link`
annotation in `richTextSimple` — a plain `href` string + `newTab`
boolean. There is **no `reference` mark** that points to another Sanity
doc. The renderer at `portable.tsx:11-28` emits `<a href={def.href}>`
straight from the string.

Phase 1 has two paths for internal article-to-article and article-to-
page links:
- **(a)** keep the `link` annotation; author plain paths like
  `/pricing`, `/blog/tilda-7200-za-3-roky`. Simple, but content authors
  can mistype slugs with no validation.
- **(b)** extend the schema with a `reference` annotation that points
  to `blogPost` / `industryPage` / `caseStudy`, plus a static-page enum
  for `/pricing`, `/calculator`, `/contacts`, `/portfolio`, `/process`,
  `/vs-wordpress`, `/vs-constructors`, `/vs-freelancers`. Renderer
  resolves the ref to a path on the way out.

The prompt prescribes (b) ("portable-text reference marks pointing to
existing pages"). Need a decision before Phase 1.

---

## 4. Schema.org for blog

**Article / BlogPosting JSON-LD on `/blog/[slug]`** — **does not exist**
(the route doesn't exist). Reference implementations of `Article` JSON-LD
do exist on other routes:

- `src/components/case-page/index.tsx:164` — `@type: "Article"` for case
  studies (Sanity-driven generic case-page renderer)
- `src/app/portfolio/_efedra-clinic/page.tsx:302` — hand-coded Article
- `src/app/portfolio/_nbyg-kobenhavn/page.tsx:306` and the EN twin —
  hand-coded Article

These are good templates. For blog posts we'd want `BlogPosting`
(or `Article`) with `headline`, `description`, `image`, `datePublished`,
`dateModified`, `author`, `publisher`, `mainEntityOfPage`. None exists
yet for `/blog/*`.

**FAQPage JSON-LD** — emitted on industry pages via
`src/components/industry-page/index.tsx:137-149`, sourced from the
`faqBlock` section. Pattern is reusable verbatim for blog posts. The
inside-graph shape uses `plainPortable(answer)` to flatten portable
text to plain text for the `acceptedAnswer.text` field.

**Sitemap entries for blog posts** — **none**. `src/app/sitemap.ts`
emits static routes (no `/blog` entry at all), Sanity industry pages,
and Sanity case studies, but no Sanity blog posts. Phase 1 must add a
blog-post-listing query and wire it into the sitemap; also add the
`/blog` listing route itself.

---

## 5. Listing page state

`/blog` today renders **zero** posts — it's the placeholder described
in §1. No Sanity fetch, no list, no sort, no filter, no pagination.
Categories / tag filters do not exist (the schema does not yet have a
category or tags field — see §2).

Once Phase 1 adds `BLOG_POSTS_QUERY` to the frontend and rebuilds
`/blog/page.tsx`, default sort should be `publishedAt desc, _createdAt
desc` (matches what `admin/queries/blogPost.ts:14` already specifies).
For 3 articles, no pagination is needed in this sprint.

---

## 6. i18n state for blog

**Existing message keys for blog UI** — minimal. In
`messages/uk.json:9` and `messages/en.json:9`:

```
"Nav": { ..., "blog": "Блог" / "Blog", ... }
"Footer": { ..., "company": { ..., "blog": "Blog", ... }, ... }
```

That's it. There are **no** message keys for:
- "Read more" / "Читати далі"
- "Reading time" / "<N> хв читання"
- "Table of contents"
- "Related articles" / "Схожі статті"
- "Published on" / "Опубліковано"
- "Updated" / "Оновлено"
- "Categories" / "Tags"
- "Back to blog"

Phase 1 will need to add a `Blog` namespace to both `uk.json` and
`en.json` (English values can be the literal English strings even
though the EN blog route doesn't exist yet — they'll be needed in
Sprint 5).

**`EN_LOCALIZED_ROOTS`** at `src/lib/i18n-routes.ts:36-41`:

```ts
export const EN_LOCALIZED_ROOTS: ReadonlySet<string> = new Set([
  "/vs-wordpress",
  "/vs-constructors",
  "/vs-freelancers",
  "/calculator",
]);
```

No `/blog` entry. The locale switcher's `resolveLocaleAlternate()`
also has no blog-post awareness (lines 60-78 only match
`/sites-for/<slug>`, `/portfolio/<slug>`, and top-level roots). For
this UA-only sprint that's fine — but a TODO/comment should be added
near `EN_LOCALIZED_ROOTS` flagging that blog post slugs will need
either inclusion here or a dedicated regex matcher when Sprint 5 ships
EN translations.

---

## Summary of deltas needed for Phase 1

These are the surface-area edits Phase 1 will touch. Listed here as a
contract — Phase 1 should not introduce changes outside this set
without flagging them.

**Admin repo (`code-site-solutions-admin`)** — schema work:
- Add `blogBody` portable-text type (or extend `richTextSimple`) with
  block styles h2/h3/h4 + lists + image + code, plus custom blocks
  `tldrBox`, `ctaCallout`. (`faqGroup` reuses existing `faqBlock`.)
- Add fields to `blogPost.ts`: `eyebrow`, `category`, `tags`,
  `updatedAt`, `readingTimeMinutes`, `faq`, `relatedPostSlugs` (or
  `relatedPosts` array of blogPost refs).
- Decide and implement author handling (Critical Finding #2).
- Optionally: extend `richTextSimple` link annotation with `reference`
  variant (Critical Finding §3, decision needed).

**Frontend repo (`code-site-solutions`)** — render work:
- `src/lib/sanity/queries.ts` — add `BLOG_POSTS_QUERY` +
  `BLOG_POST_BY_SLUG_QUERY` (mirror `admin/queries/blogPost.ts`,
  expanded for new fields).
- `src/lib/sanity/types.ts` — add `BlogPostDoc` (full doc), extend
  `BlogPostRef` if needed, add custom-block types.
- `src/lib/sanity/portable.tsx` — add custom-block dispatch for
  `tldrBox`, `ctaCallout`, plus heading/list/image support if we extend
  `richTextSimple`.
- `src/app/blog/page.tsx` — replace placeholder with Sanity-driven
  listing. Remove `robots: noindex`.
- `src/app/blog/[slug]/page.tsx` — new file. Article JSON-LD + FAQPage
  JSON-LD + full body render + related-articles strip.
- `src/components/blocks/blog/` (new) — `BlogCard`, `TldrBox`,
  `ArticleHeader`, `RelatedArticles`. Or extract a shared `ContentCard`
  from `Cases` (Critical Finding #6).
- `src/app/sitemap.ts` — query Sanity blog posts, emit `/blog/<slug>`
  entries. Decide if `/blog` listing itself gets a static entry.
- `messages/uk.json` + `messages/en.json` — `Blog` namespace.
- `src/lib/i18n-routes.ts` — TODO comment near `EN_LOCALIZED_ROOTS`
  flagging Sprint 5 follow-up.

**Content authoring path** — strongly recommend a one-off seed script
at `scripts/seed-blog-posts.ts` over hand-authoring in Studio:
- Existing pattern in `scripts/seed-medicine.ts` etc. is well-tested
  and idempotent (`createOrReplace` with fixed `_id`).
- Article body is long, with FAQ + structured callouts — Studio
  authoring would be error-prone for inline reference marks.
- A script enforces verbatim content from the source file the user
  pastes (the prompt requires "character-for-character" fidelity).

---

## Open questions for the user before Phase 1

1. **Admin repo is not git-tracked** — proceed with plain file edits
   in the admin repo and document the changes in this branch's PR
   description? Or `git init` the admin repo first?
2. **Author model** — go with (a) `teamMember` doc + reference, or (b)
   flat `author` object on `blogPost` with hardcoded values?
3. **Internal-link marks** — keep plain `href` strings, or extend
   schema with reference annotations as the prompt prescribes?
4. **`relatedPostSlugs`** — array of strings, or array of references
   to other `blogPost` docs?
5. **`/blog` listing** — sort `publishedAt desc` is fine; confirm no
   pagination needed for 3 posts.

Awaiting approval before Phase 1.

---

## Sprint 2C scope (deferred) — full EN locale for blog

Sprint 2A ships UA-only blog content. The locale switcher gracefully
disables the EN button on `/blog` and `/blog/<slug>` (see
`resolveLocaleAlternate` returning `en: null` and the disabled state in
`LocaleSwitcher` / `MobileMenu`), so EN visitors can still navigate the
rest of the site.

Full EN coverage is **Sprint 2C** — a separate PR. Scope:

- Extend `blogPost` schema with EN shadow fields:
  `titleEn`, `metaTitleEn`, `metaDescriptionEn`, `eyebrowEn`, `ledeEn`,
  `bodyEn` (portable text), `faqEn[]`. Mirror the pattern already used by
  `industryPage` (`title` localized, `richText.*En` shadows).
- Add routes `app/en/blog/page.tsx` and `app/en/blog/[slug]/page.tsx`.
- Translate the 3 existing Sprint 2A articles to EN (content file
  follow-up).
- Add `/blog` and `/blog/<slug>` to `EN_LOCALIZED_ROOTS` in
  `src/lib/i18n-routes.ts` once content exists, so the switcher
  enables and routes correctly instead of disabling.

Estimated effort: 6–10 hours dev + translation content.

Wait for explicit go-ahead before starting.
