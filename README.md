# code-site-solutions

<!-- redeploy: pick up Sanity project env (NEXT_PUBLIC_SANITY_PROJECT_ID) -->

Next.js 15 (App Router) marketing site for Code-Site.Art. Sanity-driven
content for cases, blog, and industry pages; statically authored content
for everything else.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## Project structure

```
src/
├── app/          # Next.js routes — thin pages, no inline content
├── components/   # React components (one per file)
├── content/      # localized page content (FAQs, headlines, comparison data)
├── constants/    # locale-agnostic config (tiers, nav, routes, options)
├── types/        # shared TypeScript types (types-only — no runtime)
├── lib/          # pure logic split by runtime
│   ├── server/   # touches env / fetch / db; must `import "server-only"`
│   ├── shared/   # pure helpers, safe in either runtime
│   └── client/   # only usable in "use client" components (currently empty)
├── i18n/         # next-intl request config
└── middleware.ts # locale routing (UK default, EN opt-in)
```

Each top-level folder under `src/` has its own README explaining what
belongs where, what does not, and the naming convention. Read those when
adding a new file:

- [`src/components/README.md`](src/components/README.md) — one component per file
- [`src/constants/README.md`](src/constants/README.md) — data tables + route helpers
- [`src/content/README.md`](src/content/README.md) — localized page copy
- [`src/lib/README.md`](src/lib/README.md) — server / shared / client split
- [`src/types/README.md`](src/types/README.md) — types-only, no runtime

## Tech stack

- **Framework:** Next.js 15 (App Router, RSC)
- **Language:** TypeScript (strict)
- **CMS:** Sanity (queries in `src/lib/server/sanity-queries.ts`)
- **i18n:** `next-intl` — UK at `/`, EN at `/en/*`
- **Styling:** Tailwind v4 + per-block CSS files
- **UI:** HeroUI + Lucide icons + Framer Motion + Swiper
- **Forms:** Formik + Yup

## Routing

`/` and `/{about,pricing,process,…}` serve Ukrainian. `/en/…` serves
English. Locale-aware path resolution lives in
[`src/constants/i18n-routes.ts`](src/constants/i18n-routes.ts).

## Where to put a new thing

| What you're adding                              | Where it goes                                 |
|-------------------------------------------------|-----------------------------------------------|
| A new page                                      | `src/app/<route>/page.tsx` (thin composition) |
| Hero/FAQ/tier data for that page                | `src/content/{uk,en}/<name>.ts` (or `.tsx` if JSX) |
| A new reusable block                            | `src/components/blocks/<name>/`               |
| A new constant table (nav, options, …)          | `src/constants/<name>.ts`                     |
| A new shared type used by 2+ files              | `src/types/<name>.ts`                         |
| A new Sanity query / server fetch               | `src/lib/server/<name>.ts` (+ `server-only`)  |
| A new pure helper                               | `src/lib/shared/<name>.ts`                    |
