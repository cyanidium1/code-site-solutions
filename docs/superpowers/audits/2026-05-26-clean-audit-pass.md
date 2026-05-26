# Clean Audit Pass — Phase 7

**Date:** 2026-05-26
**Branch:** refactor/style-system-unification
**Scope:** Find logic bugs, structural issues, architectural drift; apply safe cleanups inline.

## Cleanups applied this session

- 6 files swept of stale Phase-N / "Phase X will…" comments (globals.css, Btn, Container, Section, Heading, turnkey-list).
- 2 dead primitives deleted (`DotGrid`, `TextGradient`) — both had zero consumers anywhere in `src/` outside `components/ui/index.ts`.
- 2 unused `// eslint-disable-next-line no-console` directives removed (case-page, industry-page) — `console.warn` is allowed by eslint-config-next, so the disables triggered "Unused eslint-disable" lint warnings.
- 0 commented-out code blocks found (clean).
- 0 debug `console.log` calls found in `src/` (the one `console.log` in `src/app/api/lead/route.ts` is intentional production logging gated by env).
- 0 stale `TODO: convert/replace/remove/migrate` refactor leftovers found.

## Findings (need judgment, NOT fixed)

### Finding 1: Two parallel `cn()` implementations
- **Category:** Architectural drift
- **Where:** `src/lib/shared/cn.ts` and `src/components/ui/cn.ts`
- **What:** Two identical `cn()` helpers exist. `@/lib/shared/cn` is imported by 6 blocks (comparison/cmp-table, image-text, reasons, stats-bar, team-cards, vertical-timeline). `@/components/ui` re-exports the ui/cn.ts version. Both wrap `twMerge(clsx(inputs))`.
- **Evidence:**
  ```
  src/lib/shared/cn.ts:4   export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
  src/components/ui/cn.ts:9 export function cn(...inputs: ClassValue[]): string { return twMerge(clsx(inputs)); }
  ```
- **Recommended action:** Delete `src/lib/shared/cn.ts` and migrate the 6 import sites to `import { cn } from "@/components/ui"`. The ui version has a JSDoc + explicit `: string` return type and is the canonical place for class merging now that the primitives library is established.
- **Risk if unfixed:** Low. Both implementations are bit-identical, but having two import paths obscures which is canonical and invites future divergence.

### Finding 2: `<button>` elements default to `type="submit"` (3 sites)
- **Category:** Logic bug / a11y
- **Where:**
  - `src/components/blocks/hero/index.tsx:497` (primary CTA fallback)
  - `src/components/blocks/hero/index.tsx:521` (ghost CTA fallback)
  - `src/components/blocks/comparison/comparison.tsx:201,204`
  - `src/components/ui/Btn.tsx:76` (the primitive)
- **What:** None of these set `type="button"`. HTML default is `type="submit"`. None are currently inside a `<form>`, so behaviour is benign today, but if the comparison block or hero is ever embedded in a form (e.g. inside a future calculator-shaped wrapper), these buttons will submit it.
- **Evidence:**
  ```jsx
  <button className={btnClass("primary")}>
    <span>{ctaPrimaryLabel}</span>
  </button>
  ```
- **Recommended action:** Default `type="button"` inside the `Btn` primitive when `as !== "a"`. Then call sites inherit the safe default. Optional follow-up: add `type="button"` to the bare-`<button>` usages in hero and comparison.
- **Risk if unfixed:** Medium. No active form embeds these today, but the failure mode is silent and easy to introduce.

### Finding 3: EN homepage missing FAQ section; section order diverges from UK
- **Category:** i18n inconsistency
- **Where:** `src/app/page.tsx` (141 lines) vs `src/app/en/page.tsx` (276 lines)
- **What:** The two homepages compose different sets of sections in different orders.
  - UK: `Marquee → TurnkeyList → Industries → Bento → Process → Cases → Pricing → PullQuoteSwiper → FAQ → LaunchCta`
  - EN: `Marquee → TurnkeyList → Industries → Bento → Process → Cases → PullQuoteSwiper → Pricing → Stack → LaunchCta`
  - UK has `<FAQ>` after PullQuoteSwiper. EN has no FAQ at all.
  - EN has `<Stack>` (after pricing). UK has no Stack section.
  - EN puts PullQuoteSwiper before Pricing; UK puts it after.
- **Evidence:** `git diff --stat src/app/page.tsx src/app/en/page.tsx` shows 141 vs 276 LOC.
- **Recommended action:** Decision needed from the marketing owner: is the FAQ deliberately UK-only (because the `DEFAULT_FAQ` content is hand-tuned for the UA medical clinic vertical)? Is the EN `Stack` section intentional? Either reconcile the structure (preferred for maintainability) or add a comment at the top of each page documenting why they differ.
- **Risk if unfixed:** Medium. EN visitors get a measurably thinner page than UK visitors; conversion/SEO impact unclear without analytics.

### Finding 4: EN page consumes block content via props; UK page does not
- **Category:** Architectural drift / structural inconsistency
- **Where:** `src/app/page.tsx` vs `src/app/en/page.tsx`
- **What:** EN passes explicit props (`eyebrow`, `heading`, `sub`, `items={EN_INDUSTRIES}`, `cells={EN_BENTO}`, `items={EN_TIERS}`) to `<TurnkeyList>`, `<Industries>`, `<Bento>`, `<Process>`, `<Cases>`. UK relies on each component's default content (hardcoded inside the component file for the UK locale).
  ```tsx
  // page.tsx
  <Industries />
  <Bento />
  // en/page.tsx
  <Industries eyebrow="" heading={<>Built for <em>your industry.</em></>} sub="..." items={EN_INDUSTRIES} />
  <Bento eyebrow="..." heading={...} cells={EN_BENTO} locale="en" />
  ```
- **Recommended action:** Pick one pattern. The EN approach (content lives in `src/content/{locale}/`) is cleaner and easier to localize. Migrate UK content out of the component bodies into `src/content/uk/homepage.ts` and pass via props symmetrically. This would also enable the UK FAQ items to be moved out of `blocks/final/faq.tsx`'s `DEFAULT_FAQ` constant, which today is in a component file.
- **Risk if unfixed:** Low (technical). Medium (maintenance) — adding a new homepage locale (DK?) would require duplicating each component's defaults.

### Finding 5: `Marquee` accepts a `label` prop only on EN; UK passes nothing
- **Category:** i18n / structural drift
- **Where:** `src/app/page.tsx:107` vs `src/app/en/page.tsx:144`
- **What:** `<Marquee />` (UK) vs `<Marquee label="47+ BUSINESSES TRUSTED · UA · EU · US · DK" />` (EN). UK relies on the component's default `label`.
- **Recommended action:** Same as Finding 4 — pass the label from the page in both locales. Or document the default-fallback contract explicitly in the component's prop comment.
- **Risk if unfixed:** Low. Behaviour is correct; just inconsistent.

### Finding 6: `MetaStrip` primitive has zero consumers
- **Category:** Architectural drift
- **Where:** `src/components/ui/MetaStrip.tsx`
- **What:** Exported from `@/components/ui` barrel, but never imported anywhere except a doc-comment reference in `src/components/portfolio/nbyg-shared.tsx` ("`MetaStrip` and `RelatedCard` may be promoted to a generic…"). The actual consumer uses `NbygMetaStrip` from the portfolio-shared module instead.
- **Recommended action:** Either (a) wire up the portfolio pages to use `MetaStrip` from `@/components/ui` and delete `NbygMetaStrip`, or (b) delete `MetaStrip` and update the doc comment. Holding a primitive in reserve is fine if the promotion plan is real; otherwise it's just clutter.
- **Risk if unfixed:** Very low. Dead code costs a few bytes; harmless until someone wonders which one to use.

### Finding 7: `pickRichText` duplicated verbatim in case-page and industry-page
- **Category:** Architectural drift / DRY
- **Where:** `src/components/case-page/index.tsx:63-77` and `src/components/industry-page/index.tsx:59-73`
- **What:** The locale-aware rich-text picker (`if locale=en && en?.length return en; else dev warn`) is duplicated byte-for-byte. Both consume `RichTextSimple`.
- **Recommended action:** Extract to `src/lib/shared/pick-rich-text.ts` and import from both pages.
- **Risk if unfixed:** Low. Two-file divergence is easy to spot.

### Finding 8: Container `<As>` cast loses strict typing
- **Category:** Type leak (mild)
- **Where:** `src/components/ui/Container.tsx:35`
- **What:** `As: ElementType` accepts any string/component; the spread `{...rest}` passes `HTMLAttributes<HTMLElement>` which won't match e.g. `<As as="a">`'s `<a>` attribute shape (no `href` in `HTMLAttributes`).
- **Recommended action:** Either constrain `as` to a small union (`"div" | "section" | "main"`) or generic-parameterize the props type. Current usage is `div`/`section`/`main` only, so a string-union is the safest minimal fix.
- **Risk if unfixed:** Low. Misuse would surface at the call site via a TS error today, since the `Container` consumers don't override attribute shape.

### Finding 9: Sanity client constants exported but unused externally
- **Category:** Dead exports (judgement call — kept because they're typically API surface)
- **Where:** `src/lib/server/sanity-client.ts:15-17` exports `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`.
- **What:** Grep shows no consumers outside the defining file.
- **Recommended action:** Either consume them in a debug endpoint / build script, or convert from `export const` to local `const`. They look like deliberate API surface for studio embedding, so deletion is risky without checking the wider repo. Flagging for owner review, not deleting.
- **Risk if unfixed:** Very low.

### Finding 10: `pricing` content uses different extensions across locales
- **Category:** Inconsistency
- **Where:** `src/content/uk/pricing.ts` (uk uses `.ts`); `src/content/en/pricing.tsx` (en uses `.tsx`).
- **What:** Same module shape, different file extension. Likely the EN one needs `.tsx` because it embeds JSX in copy; UK keeps it plain string. Worth checking if the UK file embeds any HTML that should be JSX too.
- **Recommended action:** Confirm both files use the same data shape; rename the `.ts` to `.tsx` if it ever embeds `<em>` markup, or move richer formatting into the components. Symmetry helps onboarding.
- **Risk if unfixed:** Very low.

### Finding 11: Hero CTA fallback `<button>` is rendered when `ctaPrimaryHref` is empty — yet the labels are always passed
- **Category:** Dead code / logic smell
- **Where:** `src/components/blocks/hero/index.tsx:491-538`
- **What:** Both call sites (`src/app/page.tsx`, `src/app/en/page.tsx`) always pass `ctaPrimaryHref` and `ctaSecondaryHref`. The `<button>` branches at lines 497 and 521 are unreachable in production today. The other consumers (`vs-constructors`, `vs-freelancers`, etc.) also always pass hrefs.
- **Evidence:** `grep -rn "HeroEditorial" src/ --include="*.tsx"` shows 4 consumers, all pass both hrefs.
- **Recommended action:** Either make `ctaPrimaryHref` / `ctaSecondaryHref` required props (delete the fallback branches) or wire up an `onClick` handler shape for the truly buttonless case. The current shape protects against a runtime undefined but is mostly noise.
- **Risk if unfixed:** Low.

### Finding 12: Footer link arbitrary-value color `text-ink-3` token name vs `text-[var(--color-ink-3)]` raw access
- **Category:** Token-system consistency
- **Where:** Multiple files use both forms for the same token. Example: `src/components/blocks/turnkey-list/index.tsx:178` uses `text-[var(--color-ink-dim)]`; `src/components/blocks/final/faq.tsx:131` uses both `text-[var(--color-ink-dim)]` and `text-ink-dim` in adjacent strings.
- **What:** Tailwind 4's `@theme` registration means `text-ink-dim` and `text-[var(--color-ink-dim)]` resolve to the same value, but the bare utility is preferred for legibility + IDE autocomplete.
- **Evidence:** `grep -rn "text-\[var(--color-ink" src/ --include="*.tsx" | wc -l` shows ~40+ residual raw-var usages.
- **Recommended action:** A sweep to convert `text-[var(--color-ink-dim)]` → `text-ink-dim`, `text-[var(--color-ink-3)]` → `text-ink-3`, etc. Mechanical; verify Tailwind output is byte-identical via build-time diff. Defer to a future small-task PR.
- **Risk if unfixed:** Very low.

### Finding 13: Hero `[...Array(2)].map((_, i) => ...)` for ticker duplicate
- **Category:** Performance smell / micro
- **Where:** `src/components/blocks/hero/index.tsx:590`
- **What:** Creating a temp 2-element array just to render two copies of the marquee track. `Array.from({length: 2})` would skip the sparse-slot quirk but the real win is to inline two `<div className={TICKER_ROW_CLASS}>` blocks. The pattern recurs in `src/components/homepage/marquee.tsx`.
- **Recommended action:** Optional cleanup. Inline both copies; no behaviour change.
- **Risk if unfixed:** Negligible.

### Finding 14: `case-page/index.tsx` is 557 lines and mixes data fetching, rendering, JSON-LD, metadata, and section dispatch
- **Category:** Architectural drift
- **Where:** `src/components/case-page/index.tsx`
- **What:** Contains: `pathFor`, `pickRichText`, `hasEnglishCaseContent`, `fetchCaseStudy`, `fetchCaseStudies`, `buildCaseStudyMetadata`, `buildJsonLd`, the section dispatch switch, `CasePageView`, and helpers. A `case-page/` directory with split files (fetchers.ts, jsonld.ts, sections.tsx, view.tsx) would mirror the structure used by other large pages.
- **Recommended action:** Refactor into module boundaries. Defer until next feature touches this file.
- **Risk if unfixed:** Low. The file is readable but is the first place to grow further when new section types land.

### Finding 15: Two TODO comments referencing absent founder assets
- **Category:** Documentation drift
- **Where:** `src/app/portfolio/_nbyg-kobenhavn/page.tsx:242-243` and the EN mirror.
- **What:** `{/* TODO: screenshots gallery — awaiting assets from founder. */}` and `{/* TODO: outcome YouTube walkthrough — awaiting video from founder. */}` — these have been in the file long enough that "awaiting" may no longer be accurate. The same TODOs appear in both locales.
- **Recommended action:** Confirm with the case owner whether the assets are coming. If not, delete the TODOs (the case ships fine without them) or convert into a ticketed reminder elsewhere.
- **Risk if unfixed:** Very low.

## Spec compliance check

- [x] Single source of truth for tokens (`@theme` in globals.css) — confirmed; only `globals.css`, `keyframes.css`, `blog.css`, `hero-effects.css`, `compatibility.css` remain (5 files).
- [x] Zero `:root` color shim — confirmed; `:root` only appears in `globals.css` for cookie-bar overrides, not colors.
- [x] Zero inline static styles (ESLint rule in error mode) — `npm run lint` reports zero `react/forbid-dom-props` errors.
- [x] Touch-target ≥44×44px on interactive elements — primitives (`Btn`, drawer buttons, burger, faq toggle) all enforce `min-h-11`.
- [x] Custom breakpoint scale documented + consumed via `xs/sm/md/md-wide/lg/xl/2xl` utilities — confirmed in globals.css. Phase 6 added `md-wide` and `2xl`; both consumed via `max-md-wide:` / `max-2xl:` prefixes.
- [x] Color tokens consumed via `--color-*` names (not legacy `--bg` / `--ink`) — confirmed by grep; only the `--color-*` form appears in `@theme`. Finding 12 notes opportunistic conversion from `text-[var(--color-ink-dim)]` raw-var arbitrary-value to the canonical `text-ink-dim` utility, which is cosmetic.

All six success criteria pass.

## Architectural observations

The primitive surface is healthy. `Btn`, `Container`, `Section`, `Heading` each have a focused responsibility, sensible variants, and consumers respect them (108 `<Container>` / `<Section>` consumers; 27 `<H2>` consumers). The recent Phase 6 hoist of seven long classNames into module-level constants paid off — `homepage/shared.ts` (8 exports, all heavily consumed) and the per-block `*_CLASS` constants make the JSX bodies considerably more readable. The `Heading` variant table (15 variants × 3 levels = 45 cells) is the largest concentration of design tokens in a single primitive and remains legible because the `font-actay` repetition is the only signal of "this is a heading".

The `cn` duplication (Finding 1) and the symmetry gap between `page.tsx` and `en/page.tsx` (Findings 3-5) are the two structural issues that would most reward a small follow-up PR. Both are mechanical to fix; neither blocks anything. The case-page index file (Finding 14) is the next refactor candidate when its content evolves.

Bundle-wise the Phase 6 audit reported 102 kB shared first-load, unchanged after Phase 7 deletions (the two dead primitives didn't make it into any chunk). Tree-shaking via the barrel re-export was already eliminating them; explicit deletion is hygienic but not measurable.

## Phase 8+ candidates

Prioritized list (small / medium / large × risk × outcome):

1. **(small / low / clarity)** Merge `lib/shared/cn.ts` into `components/ui/cn.ts`; migrate 6 imports. Finding 1.
2. **(small / low / safety)** Default `type="button"` in `Btn` primitive; spot-fix the 3 bare `<button>` sites. Finding 2.
3. **(small / low / DRY)** Extract `pickRichText` into `lib/shared/`. Finding 7.
4. **(medium / medium / i18n)** Reconcile EN/UK homepage section sets — decide on FAQ presence in EN and Stack presence in UK. Findings 3-5.
5. **(medium / low / consistency)** Migrate UK component-internal defaults into `src/content/uk/homepage.ts` to mirror EN's pattern. Finding 4.
6. **(small / low / consistency)** Sweep `text-[var(--color-*)]` raw-var occurrences to bare `text-*` utilities. Finding 12.
7. **(medium / medium / arch)** Split `case-page/index.tsx` into per-concern modules. Finding 14.
8. **(small / low / hygiene)** Delete the 2 portfolio TODOs or convert to issues. Finding 15.

No critical findings. 2 medium-impact items (Findings 2, 3). Remaining are minor / hygienic.
