# `src/constants/`

Locale-agnostic configuration: data tables, enums, routes, option lists.

## What belongs

- `export const X = {…}` / `export const X = […]` data tables.
- Small pure helpers tightly coupled with the data in the same file
  (e.g. `localizePath` co-located with route tables; `pageUrl` with `SITE_ORIGIN`).
- Type aliases that are inseparable from the data (e.g. `HeaderNavLink` next to `HEADER_NAV_LINKS`).

## What does NOT belong

- React components → `src/components/`
- JSX, hooks, or anything importing `react` / `next/*` runtime APIs.
- Locale-specific page content (FAQs, headlines, copy) → `src/content/`
- Types reused across many files → `src/types/`
- Anything that calls `fetch` or reads env vars → `src/lib/server/`

## Naming convention

- One subject per file. Noun, no `-constants` suffix.
  - ✅ `nav.ts`, `pricing-tiers.ts`, `i18n-routes.ts`
  - ❌ `nav-constants.ts`, `constants.ts`
- Exported names: `SCREAMING_SNAKE_CASE` for tables, `PascalCase` for types,
  `camelCase` for helpers.

## Example

```ts
// src/constants/pricing-tiers.ts
import type { PriceLocale } from "@/lib/shared/format-price";

export type TierKey = "landing" | "corporate" | "custom";

export const TIER_AMOUNTS: Record<TierKey, number> = {
  landing: 800,
  corporate: 3500,
  custom: 6000,
};
```

## Verification

```bash
# No React/Next runtime imports.
grep -rE "from .(react|next|@heroui|lucide-react|formik|framer-motion)" src/constants/
# Should print nothing.
```
