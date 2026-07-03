# `src/lib/`

Pure logic — functions, helpers, runtime configuration. Split by where the
code is allowed to run.

## Layout

```
lib/
├── server/          # MUST NOT bundle into the client (touches env / fetch / db)
├── shared/          # safe to import from server OR client code
├── client/          # only usable inside "use client" components
│                    # (currently empty — no qualifying helpers exist)
└── cookie-consent/  # self-contained consent module (components + hooks +
                     # locales + styles) — exception to the "pure logic" rule
                     # so the whole folder is copy-paste reusable; see its README
```

## Where things go

| Module characteristic                           | Folder         |
|-------------------------------------------------|----------------|
| Calls `fetch` to Sanity / external APIs         | `lib/server/`  |
| Reads `process.env.SANITY_*` (or any secret)    | `lib/server/`  |
| Uses `next/headers`, `next/cookies`, `cache()`  | `lib/server/`  |
| Pure function (no fetch, no env, no DOM)        | `lib/shared/`  |
| Renders React with **no** server-only API       | `lib/shared/`  |
| Calls `useState`, `useEffect`, `useRouter`      | `lib/client/`  |

## Rules

1. **Files in `lib/server/` must begin with `import "server-only";`** — this
   makes the build fail loudly if any `"use client"` component accidentally
   imports them.
2. **`lib/shared/`** is the default — most utilities live here.
3. **No types** here unless they're the natural return shape of a helper
   in the same file. Shared types → `src/types/`.

## Examples

```ts
// src/lib/server/sanity-fetch.ts
import "server-only";
import { sanityClient } from "./sanity-client";

export async function sanityFetch<T>(query: string): Promise<T> {
  return sanityClient.fetch<T>(query);
}
```

```ts
// src/lib/shared/format-price.ts
export type PriceLocale = "uk" | "en";

export function formatPrice(amount: number, opts: { locale: PriceLocale }): string {
  return amount.toLocaleString(opts.locale === "uk" ? "uk-UA" : "en-US");
}
```

## Verification

```bash
# Every file under lib/server/ must declare server-only.
grep -L 'import "server-only"' src/lib/server/*.ts
# Should print nothing.
```
