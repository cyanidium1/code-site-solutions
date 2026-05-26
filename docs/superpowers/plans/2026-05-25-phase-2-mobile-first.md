# Phase 2 — Mobile-First Inversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the style system from desktop-first to mobile-first scaling, bake the existing scattered breakpoint values into `@theme --breakpoint-*` tokens, migrate spacing tokens from `:root` to `@theme`, invert canonical-breakpoint `max-[]:` utilities, add viewport meta.

**Architecture:** Per [the spec](../specs/2026-05-25-phase-2-mobile-first-design.md): custom 5-tier breakpoint scale (xs 380 / sm 640 / md 700 / lg 800 / xl 1100); spacing tokens (`--gutter-x`, `--section-y*`) move from `:root` to `@theme`; primitives + consumers shift to mobile-first utility stacks; color tokens stay in compat shim (Phase 3 scope).

**Tech Stack:** Next.js 15.5, React 19, Tailwind CSS 4.2.4, HeroUI 2.8, TypeScript 5.9.

**Spec:** [docs/superpowers/specs/2026-05-25-phase-2-mobile-first-design.md](../specs/2026-05-25-phase-2-mobile-first-design.md)

**Parent plan / Phase 1:** [2026-05-24-style-system-unification-followup.md](2026-05-24-style-system-unification-followup.md)

---

## Shared procedures (apply per task)

### Verification

```bash
cd Frontend
npm run typecheck
npm run lint
npm run build
```

All three must pass. Zero new lint errors. Zero `react/forbid-dom-props` errors (rule is in `error` mode as of Phase 1 Session 8).

### Visual parity

Phase 2 must NOT change any rendering at any viewport. If a conversion changes pixel output, it's a bug. Spot-check the affected page(s) at 1440px / 1100px / 800px / 700px / 640px / 380px after each session.

### Commit cadence

One commit per task unless noted. Format: `refactor(styles-p2): <task summary>`.

### Working branch

Continue on `refactor/style-system-unification` (the Phase 1 PR branch) — the entire style system landed there, and Phase 2 is a continuation. Alternative: cut a new branch `refactor/style-system-mobile-first` if Phase 1 PR has been merged by the time Phase 2 starts; document the decision in the first commit.

---

# Session 1: Foundation — tokens + viewport meta + docs

Three small changes: add breakpoint tokens, add spacing tokens, add viewport meta.

## Task 1.1: Add `@theme --breakpoint-*` tokens

**Files:**
- Modify: `Frontend/src/app/globals.css`

- [ ] **Step 1: Add breakpoint block to `@theme`**

Inside the existing `@theme { ... }` block in `src/app/globals.css`, add at the top (after the opening brace):

```css
  /* ─────────────────────────────────────────────────────────────────────
     CUSTOM BREAKPOINT SCALE — does NOT match Tailwind defaults.
     These values preserve the Phase 1 visual design exactly. Generates
     Tailwind 4 utilities `xs:`, `sm:`, `md:`, `lg:`, `xl:` (mobile-first
     min-width) and `max-xs:`/`max-sm:`/etc. (max-width, kept for outliers).
     NOTE for new developers: `md:` is 700px here, NOT Tailwind's default
     768px. `lg:` is 800px, NOT 1024px. See docs/superpowers/specs/2026-
     05-25-phase-2-mobile-first-design.md for rationale.
     ───────────────────────────────────────────────────────────────────── */
  --breakpoint-xs: 380px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 700px;
  --breakpoint-lg: 800px;
  --breakpoint-xl: 1100px;
```

- [ ] **Step 2: Verify utilities generate**

Add a temporary test usage in any file (e.g., a comment-only JSX className):
```tsx
<div className="hidden sm:block md:flex lg:grid xl:inline" />
```
Run `npm run build`. If utilities compile (no Tailwind error), the tokens work. Remove the test usage before committing.

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add src/app/globals.css
git commit -m "refactor(styles-p2): add @theme --breakpoint-* tokens (xs 380, sm 640, md 700, lg 800, xl 1100)"
```

## Task 1.2: Add `@theme --spacing-gutter-*` / `--spacing-section-y*` tokens

**Files:**
- Modify: `Frontend/src/app/globals.css`

- [ ] **Step 1: Update the existing spacing block in `@theme`**

The Phase 1 `@theme` block already has placeholder `--spacing-*` tokens but they were never wired to consumer utilities. Replace the existing spacing block with:

```css
  /* Section vertical rhythm + horizontal gutter.
     Phase 2 endpoint: base values are MOBILE; primitives stack
     responsive utilities (sm:/lg:/etc.) to reach desktop values.
     Generates utilities: px-gutter-x, py-section-y, py-section-y-md,
     py-section-y-lg, etc. Consumers should prefer the utility-stack
     pattern on primitives rather than var() references. */
  --spacing-gutter-x: 24px;          /* mobile baseline (≤640) */
  --spacing-gutter-sm: 32px;         /* sm+ */
  --spacing-gutter-md: 48px;         /* lg+ desktop gutter */

  --spacing-section-y: 56px;         /* mobile baseline */
  --spacing-section-y-md: 36px;      /* tight variant mobile */
  --spacing-section-y-lg: 72px;      /* lg variant mobile */
```

Delete the old block from `@theme`:
```css
  --spacing-section-y: 100px;
  --spacing-section-y-md: 80px;
  --spacing-section-y-tight: 56px;
  --spacing-section-y-lg: 120px;
  --spacing-gutter-x: 48px;
```

(If the old block doesn't exist verbatim, check the current `@theme` block in `globals.css` and remove whatever spacing-token definitions are there.)

- [ ] **Step 2: Verify utilities generate**

Test usage:
```tsx
<div className="px-gutter-x py-section-y" />
```
Build should pass.

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add src/app/globals.css
git commit -m "refactor(styles-p2): rewrite @theme --spacing-* tokens to mobile-first baseline"
```

## Task 1.3: Add viewport meta to `layout.tsx`

**Files:**
- Modify: `Frontend/src/app/layout.tsx`

- [ ] **Step 1: Read current layout.tsx**

```bash
cd Frontend
cat src/app/layout.tsx | head -60
```

Confirm there is no existing `viewport` export.

- [ ] **Step 2: Add viewport export**

After the `metadata` export, add:

```ts
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
```

Note: `Viewport` type may already be re-exported by `next` package. If `import type { Viewport } from "next"` fails, try `import { type Viewport } from "next"`.

- [ ] **Step 3: Verify build**

```bash
cd Frontend
npm run build
```
Look for the `viewport` field in the generated `<head>` of any page (check `.next/server/app/[route]/page.html` if curious).

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/app/layout.tsx
git commit -m "refactor(styles-p2): add explicit viewport meta (device-width, viewport-fit=cover)"
```

---

# Session 2: Rewrite `<Container>` + `<Section>` primitives

Convert the two foundational layout primitives from desktop-first `var()` references to mobile-first utility stacks.

## Task 2.1: Rewrite `<Container>` primitive

**Files:**
- Modify: `Frontend/src/components/ui/Container.tsx`

- [ ] **Step 1: Read current implementation**

```bash
cd Frontend
cat src/components/ui/Container.tsx
```

Current base className is `"mx-auto w-full px-(--gutter-x)"`. The `(--gutter-x)` is Tailwind 4 arbitrary-property syntax reading the `:root --gutter-x` token (set responsively via `:root` media queries — those were removed in Phase 1 Session 8 already, so the value is currently fixed at 48px).

- [ ] **Step 2: Replace base className**

Change the base className from:
```tsx
"mx-auto w-full px-(--gutter-x)"
```
to:
```tsx
"mx-auto w-full px-6 sm:px-8 lg:px-12"
```

Values: `px-6` = 24px (mobile), `sm:px-8` = 32px (640+), `lg:px-12` = 48px (800+ — matches Phase 1 desktop value).

- [ ] **Step 3: Verify**

```bash
cd Frontend
npm run typecheck && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/components/ui/Container.tsx
git commit -m "refactor(styles-p2): mobile-first <Container> (px-6 sm:px-8 lg:px-12)"
```

## Task 2.2: Rewrite `<Section>` primitive variants

**Files:**
- Modify: `Frontend/src/components/ui/Section.tsx`

- [ ] **Step 1: Read current implementation**

```bash
cd Frontend
cat src/components/ui/Section.tsx
```

Current `yClass` table uses `py-(--section-y)`, `py-(--section-y-md)`, `py-(--section-y-tight)`, `py-(--section-y-lg)` — all reading `:root` tokens.

- [ ] **Step 2: Rewrite the variant table**

Replace the `yClass: Record<Variant, string>` object with:

```tsx
const yClass: Record<Variant, string> = {
  default: "py-14 lg:py-[100px]",      // 56px mobile → 100px desktop
  tight: "py-9 lg:py-14",              // 36px → 56px
  md: "py-14 lg:py-20",                // 56px → 80px
  lg: "py-[72px] lg:py-[120px]",       // 72px → 120px
};
```

Verify the Variant type still includes all four keys (`default | tight | md | lg`).

- [ ] **Step 3: Update docstring**

If there's a JSDoc comment above the Section function explaining the legacy `--section-y` token mapping, update it to reflect mobile-first:

```tsx
/**
 * Vertical-rhythm wrapper. Mobile-first utility stack: base values
 * target ≤800px viewports, `lg:` overrides reach desktop values.
 * Reconciled with Phase 1's --section-y / --section-y-md / --section-y-lg
 * legacy spacing tokens at the lg breakpoint (800px+).
 */
```

- [ ] **Step 4: Verify**

```bash
cd Frontend
npm run typecheck && npm run build
```

- [ ] **Step 5: Commit**

```bash
cd Frontend
git add src/components/ui/Section.tsx
git commit -m "refactor(styles-p2): mobile-first <Section> variants (base mobile, lg: desktop)"
```

---

# Session 3: Migrate `var(--gutter-x)` / `var(--section-y*)` consumers

Find every consumer that uses these spacing tokens directly via `var()` and either replace with the Tailwind utility (`px-gutter-x`, `py-section-y`) OR convert to mobile-first stack. The choice depends on whether the consumer is reading the token verbatim (utility works) or computing with it (needs explicit stack).

## Task 3.1: Inventory consumers

**Files:** none (investigation)

- [ ] **Step 1: Find all `var(--gutter-x)` references**

```bash
cd Frontend
grep -rn "var(--gutter-x)" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v node_modules
```

- [ ] **Step 2: Find all `var(--section-y*)` references**

```bash
cd Frontend
grep -rnE "var\(--section-y(-[a-z]+)?\)" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v node_modules
```

- [ ] **Step 3: Build a conversion list**

For each match, classify:
- **Utility-compatible**: the `var()` is used in a `px-`/`py-` arbitrary-property utility like `px-(--gutter-x)`. Replace with `px-gutter-x` / `py-section-y` / etc.
- **Inline style**: the `var()` is inside a `style={{}}` prop. Convert to a Tailwind utility class (mobile-first stack).
- **Computed**: the `var()` is in a `calc()` or arbitrary-value expression. Leave as-is BUT verify it still resolves correctly — since the `:root` definitions will be deleted in Session 5, any remaining `var(--gutter-x)` after this session is a bug.

Write the list as a comment block in the first task file you touch in S3.2, OR keep a scratch list externally — your call.

No commit (investigation).

## Task 3.2: Convert consumers in batches

For each file containing a `var(--gutter-x)` or `var(--section-y*)` reference (from the inventory in 3.1), apply the conversion. Commit after every batch of ~5 files OR per logical area (homepage / hero / pages / etc.).

### Step pattern per file

- [ ] **Read** the file's full context around each match.
- [ ] **Decide** the conversion:
  - `px-(--gutter-x)` → `px-gutter-x`
  - `py-(--section-y)` → `py-section-y`
  - `py-(--section-y-tight)` → `py-section-y-md` (note: tight became md in the token rename; `--section-y-md` is the new mobile baseline for the tight variant; verify by reading Section.tsx after Task 2.2)
  - `py-(--section-y-lg)` → `py-section-y-lg`
  - For inline `style={{ padding: "var(--gutter-x)" }}` patterns: replace with utility class `className="px-gutter-x"` or, better, mobile-first stack `className="px-6 sm:px-8 lg:px-12"` if the consumer needs responsive scaling beyond what the static token provides.
- [ ] **Apply** the edit.
- [ ] **Verify** after every ~5 files: `npm run typecheck && npm run lint && npm run build`.
- [ ] **Commit** per batch: `refactor(styles-p2): migrate var(--gutter-x) / var(--section-y*) in <area>` (e.g., `homepage components`, `hero block`, `portfolio pages`).

### Important: token rename mapping

Phase 1's `@theme` block had `--spacing-section-y-tight: 56px`. Task 1.2 renamed/restructured to `--spacing-section-y-md: 36px` (now the tight variant's MOBILE value). If a consumer used `py-(--section-y-tight)`, the new utility is `py-section-y-md` BUT the value semantics changed (was 56px, now 36px). If the consumer relied on the 56px tight value at desktop, they need a mobile-first stack: `py-9 lg:py-14` (matches the Section primitive's `tight` variant).

Apply this rule: if a consumer uses `py-(--section-y-tight)` directly, replace with `py-9 lg:py-14`. Do NOT use `py-section-y-md` alone — the value semantics shifted.

## Task 3.3: Verify zero remaining references

- [ ] **Step 1: Final grep**

```bash
cd Frontend
grep -rn "var(--gutter-x)" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v node_modules
grep -rnE "var\(--section-y(-[a-z]+)?\)" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v node_modules
```

Both must return empty.

- [ ] **Step 2: If any remain**, convert them. Commit. Re-grep.

---

# Session 4: JSX `max-[]` → `min-{name}:` inversion at canonical breakpoints

Convert every `max-[Npx]:` arbitrary utility whose `Npx` matches a canonical breakpoint (380, 640, 700, 800, 1100) to mobile-first equivalent. Outliers at non-canonical widths stay as-is.

## Task 4.1: Inventory canonical-breakpoint `max-[]` usages

**Files:** none (investigation)

- [ ] **Step 1: Grep for each canonical width**

```bash
cd Frontend
grep -rnE "max-\[(380|640|700|800|1100)px\]:" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules | wc -l
```

Note the total count. Expected: ~80–120 occurrences.

- [ ] **Step 2: Break down by file area**

```bash
cd Frontend
grep -rlnE "max-\[(380|640|700|800|1100)px\]:" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules
```

Group consumer files by area (hero / calculator / homepage shared / blocks / pages). This shapes the batching for Session 4.2.

No commit (investigation).

## Task 4.2: Convert in batches per file area

For each file area, apply the inversion pattern. Commit per area.

### Conversion patterns (apply per-utility, not blindly)

Each `max-[Npx]:utility` represents "apply `utility` BELOW `Npx` width." The mobile-first equivalent depends on what the surrounding base utility does.

**Pattern A — "Shrink at narrow" (size reduction)**:
```tsx
// Before: base is desktop value, max-[] applies smaller value below the breakpoint
"text-[64px] max-[640px]:text-[48px]"

// After: base is mobile value, sm:/md:/etc. applies larger value above the breakpoint
"text-[48px] sm:text-[64px]"
```

**Pattern B — "Hide at narrow"**:
```tsx
// Before
"block max-[800px]:hidden"

// After
"hidden lg:block"
```

**Pattern C — "Stack at narrow"**:
```tsx
// Before
"flex-row max-[700px]:flex-col"

// After
"flex-col md:flex-row"
```

**Pattern D — "Stretch at narrow"**:
```tsx
// Before
"w-auto max-[640px]:w-full"

// After
"w-full sm:w-auto"
```

**Pattern E — Multiple overrides on the same property**:
```tsx
// Before (3-tier shrink: desktop / 640 / 380)
"text-[64px] max-[640px]:text-[48px] max-[380px]:text-[36px]"

// After (mobile-first, 3-tier scale)
"text-[36px] xs:text-[48px] sm:text-[64px]"
```

**Outliers (preserve)**:
```tsx
// max-[1080px], max-[1440px], max-[900px], max-[760px], max-[960px], etc.
// These are NOT in {380, 640, 700, 800, 1100}. Leave as-is.
"grid-cols-3 max-[1080px]:grid-cols-2 max-[760px]:grid-cols-1"
```

### Per-area task steps

For each file area (~5 areas expected):

- [ ] **Read** every file in the area (use grep -ln output from 4.1 step 2).
- [ ] **Convert** every canonical-breakpoint `max-[]:` per the pattern above. Be careful: each utility chain needs to be read as a unit to invert correctly. Do NOT mechanically search-and-replace `max-[640px]:` with `sm:` — the semantics of the surrounding utility chain dictate the correct inversion.
- [ ] **Verify** after the area is done: `npm run typecheck && npm run lint && npm run build`. Visual sweep the affected pages at 1440/1100/800/700/640/380 — values must render identically to before.
- [ ] **Commit** with area-specific message: `refactor(styles-p2): invert max-[] → min-{name}: in <area>`.

### Recommended area order (lowest risk → highest)

1. Block primitives (`src/components/blocks/*/index.tsx`) — small, isolated.
2. Page components (`src/app/**/page.tsx`, `src/app/**/*.tsx`).
3. Homepage shared classes (`src/components/homepage/shared.ts`, individual homepage files).
4. Calculator sub-components (`src/components/calculator/*.tsx`).
5. **Hero** (`src/components/blocks/hero/index.tsx`) — last, highest visual risk.

## Task 4.3: Final inventory check

- [ ] **Step 1: Re-run the canonical-breakpoint grep**

```bash
cd Frontend
grep -rnE "max-\[(380|640|700|800|1100)px\]:" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules
```

Expected: empty output. If anything remains, it's a missed conversion — fix and re-grep.

- [ ] **Step 2: Spot-check non-canonical breakpoints survived**

```bash
cd Frontend
grep -rnE "max-\[(900|960|1080|1200|1440|760)px\]:" src/ --include="*.tsx" --include="*.ts" | head -10
```

These should still exist (outliers preserved). If any went missing, they were collateral damage from over-eager search-and-replace — restore from git.

---

# Session 5: Cleanup + final verification

Remove the spacing tokens from the `:root` compat shim now that nothing references them. Append Phase 2 verification entry to `MANUAL-VERIFICATION.md`. Update the PR.

## Task 5.1: Remove `--gutter-x` / `--section-y*` from `:root`

**Files:**
- Modify: `Frontend/src/app/globals.css`

- [ ] **Step 1: Read the current `:root` block**

```bash
cd Frontend
grep -nA 30 "^:root {" src/app/globals.css | head -40
```

- [ ] **Step 2: Delete the spacing token definitions**

From the `:root` block, remove these lines:

```css
  --gutter-x: 48px;
  --section-y: 100px;
  --section-y-md: 80px;
  --section-y-tight: 56px;
  --section-y-lg: 120px;
```

Also remove any leading comment block above them (the "Horizontal gutter ladder" and "Section vertical rhythm" docstrings).

The `:root` block retains: `color-scheme`, `--bg*`, `--ink*`, `--line*`, `--accent*`, `--container-*` (all color/container compat tokens — Phase 3 scope).

- [ ] **Step 3: Verify**

```bash
cd Frontend
npm run typecheck && npm run lint && npm run build
```

If any file still references `var(--gutter-x)` or `var(--section-y*)`, the build will surface it as an undefined-CSS-variable resolution (fallback to whatever the property's initial value is — visual regression). Cross-check with Task 3.3's grep result; it should already be empty.

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add src/app/globals.css
git commit -m "refactor(styles-p2): remove --gutter-x / --section-y* from :root (now @theme tokens)"
```

## Task 5.2: Append Phase 2 entry to `MANUAL-VERIFICATION.md`

**Files:**
- Modify: `Frontend/docs/superpowers/MANUAL-VERIFICATION.md`

- [ ] **Step 1: Append new section**

At the end of the file, add:

```markdown
---

## Phase 2 — Mobile-first inversion (Sessions 1–5)

### Custom breakpoint scale (IMPORTANT for new developers)

This codebase uses a CUSTOM Tailwind breakpoint scale that does NOT match Tailwind's defaults:

| Token | Width | Tailwind default for comparison |
|---|---|---|
| `xs` | 380px | (not in defaults) |
| `sm` | 640px | 640px ✓ (matches) |
| `md` | 700px | 768px ✗ (custom) |
| `lg` | 800px | 1024px ✗ (custom) |
| `xl` | 1100px | 1280px ✗ (custom) |

Defined via `@theme --breakpoint-*` in `src/app/globals.css`. Generates `xs:`, `sm:`, `md:`, `lg:`, `xl:` (mobile-first min-width) and `max-xs:`, etc. (max-width, kept for outliers).

### Spacing tokens migrated

`--gutter-x` and `--section-y*` are now `@theme --spacing-*` tokens consumed via Tailwind utilities (`px-gutter-x`, `py-section-y`, etc.). The `:root` compat shim no longer defines these — the color/container tokens remain (Phase 3 scope).

### Inversion pattern

Every `max-[Npx]:` utility at canonical breakpoints (380/640/700/800/1100) was inverted to mobile-first equivalent. Outliers (1080/1440/900/760/960) stay as `max-[Npx]:`.

### Visual verification

Phase 2 must NOT change rendering at any viewport. Eyeball each page at 1440 / 1100 / 800 / 700 / 640 / 380 px and compare against Phase 1 baseline:

- [ ] `/` and `/en` — hero, marquee, bento, cases, process, pull-quote, finalcta, footer
- [ ] `/about` and `/en/about` — page hero, stats, image-text, values-secondary-row, team
- [ ] `/portfolio` UK+EN — list grid
- [ ] `/portfolio/[slug]` UK+EN — sanity case + hardcoded cases (nbyg-kobenhavn, efedra-clinic)
- [ ] `/process`, `/pricing` UK+EN
- [ ] `/calculator` — full multi-step click-through
- [ ] `/contacts`, `/blog`, `/blog/[slug]` UK+EN
- [ ] Mobile menu drawer (≤700px viewport): burger morph, stagger animations
- [ ] Header dropdowns and locale switcher (≥800px viewport)
- [ ] FAQ accordion across pages

If any page regresses, the inversion at that block was wrong — restore from git and re-invert with correct semantics.

### Viewport meta

`src/app/layout.tsx` now exports `viewport: { width: "device-width", initialScale: 1, viewportFit: "cover" }`. Inspect any rendered page's `<head>` to confirm.

### Phase 3 scope (out of Phase 2)

- Touch-target audit (≥44×44px on interactive elements)
- Color-token migration (`var(--bg)` → `var(--color-bg)`); delete `:root` compat shim
- HeroUI dark-theme review under mobile-first
```

- [ ] **Step 2: Commit**

```bash
cd Frontend
git add docs/superpowers/MANUAL-VERIFICATION.md
git commit -m "docs(styles-p2): document Phase 2 breakpoint scale + verification checklist"
```

## Task 5.3: Run final success-criteria verification

**Files:** none (verification only)

Run each check from spec §10 (success criteria) and report PASS/FAIL.

- [ ] **Criterion 1: breakpoint utilities work**
  Spot-check by reading a recent commit's diff — any `sm:`/`md:`/`lg:`/`xl:`/`xs:` utility should compile. Confirmed if build passes.

- [ ] **Criterion 2: spacing tokens consumed via Tailwind**
  ```bash
  cd Frontend
  grep -rn "px-gutter-x\|py-section-y" src/ --include="*.tsx" | wc -l
  ```
  Expected: ≥ 30 occurrences (Container + Section + any direct consumers).

- [ ] **Criterion 3: `:root` no longer defines `--gutter-x` or `--section-y*`**
  ```bash
  cd Frontend
  grep -E "^\s+--(gutter-x|section-y)" src/app/globals.css
  ```
  Output should be empty for any line OUTSIDE the `@theme` block. (Inside `@theme` the `--spacing-*` versions exist — that's correct.)

- [ ] **Criterion 4: zero `var(--gutter-x)` / `var(--section-y*)` consumer references**
  ```bash
  cd Frontend
  grep -rn "var(--gutter-x)\|var(--section-y" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v node_modules
  ```
  Expected: empty.

- [ ] **Criterion 5: zero canonical-breakpoint `max-[]` utilities**
  ```bash
  cd Frontend
  grep -rnE "max-\[(380|640|700|800|1100)px\]:" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules
  ```
  Expected: empty.

- [ ] **Criterion 6: viewport meta exported**
  ```bash
  cd Frontend
  grep -n "export const viewport" src/app/layout.tsx
  ```
  Expected: 1 match.

- [ ] **Criterion 7: build + typecheck + lint pass**
  ```bash
  cd Frontend
  npm run typecheck && npm run lint && npm run build
  ```
  All three green.

- [ ] **Criterion 8: visual parity** — manual, per Task 5.2's checklist. Document any spotted regression as a follow-up issue, OR fix inline if it's a missed conversion.

- [ ] **Step 9: Push branch**

```bash
cd Frontend
git push
```

- [ ] **Step 10: Update PR**

If PR #7 is still open (Phase 1 PR was never merged), update its description to note Phase 2 is included. If PR #7 was merged and Phase 2 is on a new branch, open a new PR titled `refactor(styles-p2): mobile-first inversion + spacing token migration`.

```bash
cd Frontend
gh pr edit 7 --body "$(cat <<'EOF'
[updated PR body documenting Phase 1 + Phase 2 completion]
EOF
)"
```

(Or use `gh pr create` for a new PR — adapt based on branch state.)

---

# After this plan

Phase 2 complete. Phase 3 covers:

1. **Color-token migration**: search-and-replace `var(--bg)` → `var(--color-bg)`, `var(--ink)` → `var(--color-ink)`, etc. across all consumers; then delete the `:root` color compat shim.
2. **Touch-target audit**: enumerate every interactive element (button, link, nav item, drawer item, accordion trigger, form input). Verify minimum 44×44px hit area. Adjust padding where insufficient. Mobile-first values were defined in Phase 2 — Phase 3 confirms they meet accessibility standards.
3. **HeroUI dark-theme review** under the new mobile-first baseline.
