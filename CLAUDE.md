# CLAUDE.md — code-site-solutions

Next.js 15 (App Router) marketing site for Code-Site.Art. Ukrainian at `/`, English at `/en/*` (`next-intl`). Sanity CMS for portfolio, blog, and industry pages; static content in `src/content/`.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run build
```

## Layout conventions

- Thin routes in `src/app/`; copy in `src/content/{uk,en}/`; shared config in `src/constants/`.
- Server-only Sanity code: `src/lib/server/` (must `import "server-only"`).
- GROQ mirrors admin repo: keep `sanity-queries.ts` in sync with `code-site-solutions-admin/queries/*`.
- Folder READMEs under `src/{components,constants,content,lib,types}/` define where new files go.

## Images (read before adding/changing any image)

**Required:** [`docs/images.md`](docs/images.md)

- Sanity-hosted → `<SanityImg>` (`@/lib/shared/sanity-image`) — Sanity CDN transforms; never route Sanity images through `/_next/image`.
- `/public` or non-Sanity remote → `<AppImage>` (`@/lib/shared/app-image`).
- `sizes` is mandatory on both — use `IMG_SIZES` presets (`@/lib/shared/image-sizes`).
- No direct `next/image` imports, no raw `<img>` (ESLint errors). Exceptions (SVG, marquee logos) need a disable comment citing docs/images.md.
- og:image URLs from Sanity: wrap in `sanityCdn(url, { w: 1200, q: 70 })`.

## Sanity (read before changing CMS fetches)

**Required:** [`docs/sanity-document-ids.md`](docs/sanity-document-ids.md)

### Public client (`src/lib/server/sanity-client.ts`)

- Project `4lk0x7o9`, dataset `production` (hardcoded until Vercel env is fixed).
- **No read token** — public CDN, `perspective: "published"`.
- **Correct for production.** Do not add a token to “fix” missing CMS rows.

### Dot rule (summary)

Root `_id` with a **`.`** → auth-only on public datasets; unauthenticated fetches **never** return it. Schema `status: "published"` and Studio **Published** do **not** override this.

| `_id` | On live site (no token) |
|-------|-------------------------|
| Studio UUID | Yes, after Publish |
| `caseStudy.co2lab`, `industryPage.medicine`, `blogPost.*`, `pricingPlan.*`, `countryOption.UA`, … | **No** |

**URLs use `slug.current`**, not `_id`. If Studio count ≠ public count, check dotted IDs in admin — not GROQ `limit`, Releases, or Publish alone.

### June 2026 (resolved)

Dotted IDs were migrated to UUIDs in admin (`reupload:dotted-*`, manifests under `backups/reupload-*-2026-06-04/`). Historical symptom was e.g. many cases in Studio vs fewer on `/portfolio` — **not** current state.

Verify dotted IDs are gone (admin CLI):

```bash
cd ../code-site-solutions-admin
npx sanity documents query '*[_type in ["caseStudy","industryPage","blogPost","pricingPlan","countryOption","budgetBucketOption","testimonial"] && _id match "*.*" && !(_id match "_.*")]{_id,_type}'
```

Public case count:

```bash
node --input-type=commonjs -e "const {createClient}=require('@sanity/client');createClient({projectId:'4lk0x7o9',dataset:'production',apiVersion:'2024-10-01',useCdn:false,perspective:'published'}).fetch('count(*[_type==\"caseStudy\"])').then(console.log)"
```

## Related repos

| Repo | Role |
|------|------|
| `code-site-solutions-admin` | Studio, schema, `reupload:dotted-*`, backups/manifests — [`CLAUDE.md`](../code-site-solutions-admin/CLAUDE.md) |

## Cursor rules

`.cursor/rules/sanity-document-ids.mdc` — guardrails for `src/lib/server/sanity*.ts`.

## Code style

- Minimal diffs; match existing patterns in the file you edit.
- No drive-by refactors; run `npm run typecheck` when touching types or server code.
- Do not hard-code dotted Sanity `_id` literals in `src/` (grep `caseStudy\.` etc. before committing).
