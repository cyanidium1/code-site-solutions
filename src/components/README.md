# `src/components/`

React components. **One component per file** wherever practical.

## Layout

```
components/
├── shared/      # generic primitives used across many pages
│                # (SectionHead, SwiperWrapper)
├── layout/      # persistent site chrome (hp-header, hp-footer,
│                # mobile-menu, locale-switcher)
├── blocks/      # reusable content blocks, one folder per block
│                # (hero, comparison, final, lead-form, services, …)
├── homepage/    # homepage sections (one file per section)
├── calculator/  # interactive pricing calculator
├── case-page/   # Sanity-driven case-study page
├── industry-page/  # Sanity-driven /sites-for/[slug] page
├── about/       # /about-specific helpers
├── portfolio/   # /portfolio-specific helpers
├── legal/       # /legal-* helpers
└── vs-{constructors,freelancers,wordpress}/   # comparison pages
                # (content + types live in src/content/comparisons/)
```

## Rules

1. **One component per file.** Sibling helpers used only by that component
   may stay inline; if a helper is reused, lift it to a neighbour file.
2. **No inline page content.** Localized copy, FAQ arrays, tier tables
   move to `src/content/`. Components take data via props.
3. **No inline shared types.** If a type is used in 2+ files, move it to
   `src/types/`.
4. **Barrels (`index.tsx`) are thin re-exports**, never component bodies.
   Consumers may import the barrel for convenience; internal references
   point at the specific file.
5. **CSS is co-located** (`blocks/comparison/comparison.css` lives next to
   `blocks/comparison/comparison.tsx`).

## Naming

- Folders: `kebab-case` (matching the block / page slug).
- Component files: `kebab-case.tsx`. The exported component is the
  PascalCase form of the filename (`tier.tsx` → `Tier`).
- Subcomponent files split out of a parent get a descriptive name
  (`bento.tsx` for the Bento section in `homepage/`).

## Example: a multi-component block

```
blocks/final/
├── index.tsx   # barrel: re-exports FAQ, Audit
├── faq.tsx     # FAQ accordion (one component)
└── audit.tsx   # Audit lead form (one component)
```
