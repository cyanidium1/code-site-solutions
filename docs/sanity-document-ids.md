# Sanity document IDs and the public API

Canonical doc for **this repo** (Next.js consumer). Admin Studio, reupload scripts, and manifests: **`code-site-solutions-admin`** — sibling repo `docs/sanity-document-ids.md` and `README.md`.

## 1. The rule

Any **root** document `_id` that contains a **`.`** is a Content Lake **sub-path**. On a **public** dataset those documents are **auth-only**:

- Readable with Studio login or an API **read token**
- **Not** returned to **unauthenticated** queries

This frontend uses `@sanity/client` in `src/lib/server/sanity-client.ts` with:

- **No token**
- `perspective: "published"`
- CDN enabled by default (`NEXT_PUBLIC_SANITY_USE_CDN`)

That stack **never** returns dotted-ID documents.

| Misconception | Fact |
|---------------|------|
| Schema field `status: "published"` | Editorial semantics only — does **not** make dotted IDs public |
| Studio label **Published** | Same — does **not** override `_id` path rules |
| `createOrReplace` + `status: "published"` in admin | Same — dot in `_id` still auth-only |
| Content Releases | Not on free plan; was **not** the cause of the 2026 incident |
| GROQ `limit` / “forgot Publish” alone | Check dotted IDs **first** when Studio count ≠ public count |

Official reference: [IDs and paths](https://www.sanity.io/docs/content-lake/ids) — *unauthenticated users cannot read documents whose `_id` contains a `.` (sub-path).*

## 2. Examples

| `_id` | Visible on this site (no token) |
|-------|----------------------------------|
| UUID `lOTgaDd8FU4wgJ8F4K9w0O` | Yes, after Publish |
| `caseStudy-co2lab` (hyphen, no dot) | Yes, after Publish — OK for new scripts in theory; **production uses UUIDs** after June 2026 |
| `caseStudy.co2lab` | **No** |
| `industryPage.medicine` | **No** |
| `blogPost.*`, `pricingPlan.*` | **No** |
| `countryOption.UA`, `budgetBucketOption.3-7k` | **No** |
| `testimonial.*` | **No** |
| `drafts.<uuid>` | Draft only until Publish → published id becomes `<uuid>` |

## 3. Historical incident (June 2026 — resolved)

### Symptom (before migration)

- **Many** documents visible in Studio / authenticated CLI
- **Fewer** on the live site: `/portfolio`, `/sites-for/*`, blog, pricing, filter options, testimonials
- Example that confused debugging: **21** case studies in Studio vs **8** on `/portfolio` (not a GROQ `limit`)

### Cause

Admin seeds and one-offs used `{type}.{slug}` IDs (`caseStudy.efedra-clinic`, `industryPage.medicine`, `countryOption.UA`, …). The frontend correctly used **no token** and `perspective: "published"`.

### Token commit context

| Commit | Note |
|--------|------|
| `99f39a6` | Introduced optional server read token + `perspective: "published"` |
| `fde693e` | Hardcoded project `4lk0x7o9` (Vercel had stale `vh20xg14`) |
| `97993ee` | Removed token from prod client — **exposed** dotted-ID gap; did **not** create it |

A server read token had temporarily “fixed” missing content by authenticating sub-path documents. That masked misconfigured IDs; it was not the right production model.

### Fix (admin repo, June 2026)

Reupload scripts copied content to **Studio UUIDs** and deleted dotted documents. Studio **cannot rename** `_id`.

| Type | Count migrated (approx.) |
|------|---------------------------|
| `caseStudy.*` | 13 |
| `industryPage.*` | 8 |
| `blogPost.*`, `pricingPlan.*` | 3 each |
| `countryOption.*`, `budgetBucketOption.*`, `testimonial.*` | options + testimonials |

ID maps: `code-site-solutions-admin/backups/reupload-case-studies-2026-06-04/manifest.json`, `reupload-options-testimonials-2026-06-04/manifest.json`, `reupload-content-pages-2026-06-04/manifest.json`.

**Current expectation:** public CDN counts align with Studio for published content; dotted user-content IDs should be **zero**.

## 4. Frontend-specific guidance

### URLs vs `_id`

Routes use **`slug.current`**, not `_id`:

- `/portfolio/[slug]`, `/en/portfolio/[slug]`
- `/sites-for/[slug]`, blog slugs, etc.

Keep GROQ filters on `slug.current` (and schema `status` where intended). Changing slug does not fix a dotted `_id`; migrating `_id` does not require slug changes if slugs were preserved in manifests.

### Production client

- **Do not** add `SANITY_API_TOKEN` / `SANITY_API_READ_TOKEN` to the default `sanityClient` to mask missing CMS documents.
- **Do not** blame portfolio “limits” or Content Releases before checking for dotted IDs.
- Optional temporary server-only token: explicit comment + ticket to remove after IDs are fixed in admin — not the default architecture.

### GROQ

`status == "published"` reflects the schema field. It does **not** make `caseStudy.foo` visible without a token.

## 5. Diagnosis

### Public count (matches this website)

```bash
node --input-type=commonjs -e "
const {createClient}=require('@sanity/client');
createClient({projectId:'4lk0x7o9',dataset:'production',apiVersion:'2024-10-01',useCdn:false,perspective:'published'})
  .fetch('count(*[_type==\"caseStudy\"])').then(console.log);
"
```

Compare with Studio; counts should match after migration.

### Dotted IDs (run from admin repo, CLI login)

```bash
cd ../code-site-solutions-admin
npx sanity documents query '*[_type in ["caseStudy","industryPage","blogPost","pricingPlan","countryOption","budgetBucketOption","testimonial"] && _id match "*.*" && !(_id match "_.*")]{_id,_type}'
```

**Expect `[]`** after migration.

Case studies only:

```bash
npx sanity documents query 'count(*[_type=="caseStudy" && _id match "caseStudy.*"])'
```

**Expect `0`.**

## 6. If dotted IDs reappear

Repair only in **admin** (dry-run: omit `--apply`):

```bash
cd ../code-site-solutions-admin
npm run reupload:dotted-case-studies -- --apply
npm run reupload:dotted-options-testimonials -- --apply
npm run reupload:dotted-content-pages -- --apply
```

Legacy admin `seed:*` scripts that recreated `{type}.{slug}` IDs were **removed** (June 2026). Do not reintroduce them.

Editors: **+ New** in Studio (UUID) → copy content → update references → delete dotted doc. Do not rely on duplicate-from-dotted-doc (may keep `_system.base.id` on old id).

## 7. Related repos

| Repo | Role |
|------|------|
| [`code-site-solutions-admin`](../code-site-solutions-admin/) | Studio, schema, `reupload:dotted-*`, `backups/*/manifest.json` |
| **code-site-solutions** (this repo) | Next.js site — public CDN consumer, `src/lib/server/sanity-queries.ts` |

## References

- [Ash: Missing documents in unauthenticated query results](https://ash.gd/posts/2021-09-25-missing-sanity-documents-in-unauthenticated-query-results/)
- Admin: `npm run seed:calculator-v2` — calculator singletons still use fixed IDs **without** dots
