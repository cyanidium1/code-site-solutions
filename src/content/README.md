# `src/content/`

Localized page content — the data formerly inlined inside `src/app/**/page.tsx`.

## What belongs

- Locale-keyed copy: FAQ items, hero text, bento cells, comparison-page data.
- Tightly-coupled content + its variant-specific type (e.g.
  `comparisons/vs-wordpress.tsx` exports both the `Content` type and
  `VS_WORDPRESS_UK` / `VS_WORDPRESS_EN` data).
- Self-contained content that may include JSX (rich-text fragments,
  embedded icons). Use `.tsx` when JSX is involved; `.ts` otherwise.

## What does NOT belong

- Components → `src/components/`
- Locale-agnostic config / option arrays (tier prices, nav links) → `src/constants/`
- Types used in components beyond their own content file → `src/types/`

## Layout

```
content/
├── uk/                       # Ukrainian-only data
│   ├── about.tsx
│   ├── homepage.ts
│   ├── pricing.ts
│   └── process.tsx
├── en/                       # English-only data
│   ├── about.tsx
│   ├── homepage.ts
│   ├── pricing.tsx
│   └── process.ts
├── comparisons/              # vs-* page content (type + both locales per file)
│   ├── vs-wordpress.tsx
│   ├── vs-constructors.tsx
│   └── vs-freelancers.tsx
├── contacts.ts               # both locales in one file (Record<Locale, ...>)
└── lead-form.ts              # lead-form strings, both locales
```

## Conventions

- **Locale split:** when a consumer statically knows its locale (e.g.
  `app/page.tsx` is UA, `app/en/page.tsx` is EN), keep content in
  `content/{uk,en}/`. When a single consumer switches locales at runtime
  via `Record<Locale, ...>`, keep content in one file (e.g. `contacts.ts`).
- **Naming:** match the route or block name. `process.tsx` mirrors
  `app/process/page.tsx`.
- **Exports:** `SCREAMING_SNAKE_CASE` constants (`PROCESS_STEPS`,
  `HOMEPAGE_FAQ`, `VS_WORDPRESS_UK`).

## Example

```tsx
// src/content/uk/process.tsx
import type { TimelineStep } from "@/components/blocks/vertical-timeline";

export const PROCESS_STEPS: TimelineStep[] = [
  { n: "01", title: "Бриф", duration: "1 день · безкоштовно", body: "…" },
  // …
];
```

```tsx
// src/app/process/page.tsx
import { PROCESS_STEPS } from "@/content/uk/process";
```
