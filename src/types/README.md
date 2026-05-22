# `src/types/`

Shared TypeScript types. **No runtime code lives here** — these files compile to nothing.

## What belongs

- Interfaces and type aliases used by **2+ files**.
- Type-only re-exports from third-party packages (rare).

## What does NOT belong

- React components → `src/components/`
- Runtime constants → `src/constants/`
- Helper functions → `src/lib/shared/`
- Types used in **exactly one** file → keep them inline in that file.

## Naming convention

- One subject per file. Noun, no `-types` suffix.
  - ✅ `pricing.ts`, `homepage.ts`, `comparisons.ts`
  - ❌ `pricing-types.ts`, `types.ts`

## Example

```ts
// src/types/faq.ts
import type { RichText } from "@/lib/shared/rich-text";

export type FAQItem = { q: string; a: RichText };
```

```ts
// usage
import type { FAQItem } from "@/types/faq";
```

## Verification

A quick sanity check this folder stays types-only:

```bash
grep -rE "^export (const|function|class|let|var)" src/types/
# Should print nothing.
```
