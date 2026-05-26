# Phase 3 Implementation Plan — Color tokens + touch-target + HeroUI

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to execute one subagent per session. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all consumer `var(--bg)` / `var(--ink)` / `var(--accent)` / `var(--line)` / `--container-*` references to canonical `@theme` `--color-*` / `--container-*` names; delete the `:root` compat shim; audit + fix touch-targets to ≥44×44px; verify + fix HeroUI components.

**Architecture:** Mechanical search-and-replace per the mapping table in spec §4. Plus interactive-element audit + HeroUI spot-check.

**Spec:** [docs/superpowers/specs/2026-05-25-phase-3-color-tokens-touch-heroui-design.md](../specs/2026-05-25-phase-3-color-tokens-touch-heroui-design.md)

**Branch:** continue on `refactor/style-system-unification` (PR #7 already open). Push after Session 7.

---

## Shared verification

After each commit:
```bash
cd Frontend
npm run typecheck && npm run lint && npm run build
```
All three pass. Zero new `react/forbid-dom-props` errors.

---

# Session 1: Color migration foundation — CSS files

## Task 1.1: Build the migration inventory

```bash
cd Frontend
# Find all consumer refs
grep -rnE "var\(--(bg|bg-subtle|bg-raised|ink|ink-2|ink-3|ink-muted|line|line-2|accent|accent-soft|accent-deep|accent-2|container-[a-z]+)\)" src/ | grep -v node_modules
```

Save the output. Count occurrences. Group by file (which files have the most matches).

## Task 1.2: Migrate CSS files

Five CSS files to sweep: `globals.css`, `vendor.css`, `keyframes.css`, `blocks/blog/blog.css`, `blocks/hero/hero-effects.css`.

For each, replace per the mapping table:

```
var(--bg)            → var(--color-bg)
var(--bg-subtle)     → var(--color-bg-subtle)
var(--bg-raised)     → var(--color-bg-raised)
var(--ink)           → var(--color-ink)
var(--ink-2)         → var(--color-ink-dim)
var(--ink-3)         → var(--color-ink-3)
var(--ink-muted)     → var(--color-ink-muted)
var(--line)          → var(--color-line)
var(--line-2)        → var(--color-line-strong)
var(--accent)        → var(--color-accent)
var(--accent-soft)   → var(--color-accent-soft)
var(--accent-deep)   → var(--color-accent-deep)
var(--accent-2)      → var(--color-accent-2)
```

The `--container-*` names are identical in `:root` and `@theme` — no migration needed for those.

Commit: `refactor(styles-p3): migrate var() color refs in CSS files`

## Task 1.3: Verify

```bash
cd Frontend
grep -rnE "var\(--(bg|bg-subtle|bg-raised|ink|ink-2|ink-3|ink-muted|line|line-2|accent|accent-soft|accent-deep|accent-2)\)" src/app src/components 2>&1 | grep "\.css:" | grep -v node_modules
```

The CSS-file portion should be empty after Session 1. JSX/TSX files still have refs — those are migrated in Sessions 2-4.

---

# Session 2: JSX migration batch 1 — blocks + primitives

## Task 2.1: Inventory blocks + primitives

```bash
cd Frontend
grep -rnE "var\(--(bg|bg-subtle|bg-raised|ink|ink-2|ink-3|ink-muted|line|line-2|accent|accent-soft|accent-deep|accent-2)\)" src/components/blocks src/components/ui 2>&1 | grep -v node_modules
```

## Task 2.2: Migrate per the table

Apply the same mapping table per file. Verify after each batch of ~10 files.

Commit: `refactor(styles-p3): migrate var() color refs in blocks + primitives`

---

# Session 3: JSX migration batch 2 — pages + homepage + layout

## Task 3.1: Inventory

```bash
cd Frontend
grep -rnE "var\(--(bg|bg-subtle|bg-raised|ink|ink-2|ink-3|ink-muted|line|line-2|accent|accent-soft|accent-deep|accent-2)\)" src/app src/components/homepage src/components/layout 2>&1 | grep -v node_modules
```

## Task 3.2: Migrate per the table

Commit: `refactor(styles-p3): migrate var() color refs in pages + homepage + layout`

---

# Session 4: JSX migration batch 3 — hero + calculator + final cleanup

## Task 4.1: Inventory + migrate

```bash
cd Frontend
grep -rnE "var\(--(bg|bg-subtle|bg-raised|ink|ink-2|ink-3|ink-muted|line|line-2|accent|accent-soft|accent-deep|accent-2)\)" src/components/blocks/hero src/components/calculator src/components/portfolio src/components/about 2>&1 | grep -v node_modules
```

Hero has the densest concentration; isolate it in its own commit if convenient.

Commits:
- `refactor(styles-p3): migrate var() color refs in hero block`
- `refactor(styles-p3): migrate var() color refs in calculator`
- `refactor(styles-p3): migrate var() color refs in portfolio + about (final batch)`

## Task 4.2: Verify zero consumer refs remain

```bash
cd Frontend
grep -rnE "var\(--(bg|bg-subtle|bg-raised|ink|ink-2|ink-3|ink-muted|line|line-2|accent|accent-soft|accent-deep|accent-2)\)" src/ | grep -v node_modules
```

MUST return empty. If anything remains, migrate and re-grep.

---

# Session 5: Delete `:root` color shim + final verification

## Task 5.1: Delete `:root` block

**File:** `src/app/globals.css`

1. Read the current `:root { ... }` block.
2. Confirm via Session 4 grep that zero consumers reference these tokens.
3. Delete the ENTIRE `:root { ... }` block.

The remaining `globals.css` retains: `@import "tailwindcss"`, `@config "../../tailwind.config.ts"`, the `@theme { ... }` block, `html { scroll-behavior: smooth }`, `html, body { background, color }`, `body { font-feature-settings, overflow-x: clip, ... }`, `h1, h2, h3 em { padding-inline-end, box-decoration-break }` italic fix, `@utility max-w-container-*` declarations (from the hotfix), `@layer utilities { .text-gradient*, .grid-bg, .dotted-bg, .ease-soft }`.

## Task 5.2: Update `html, body` rule to use canonical names

```css
html,
body {
  background: var(--color-bg);
  color: var(--color-ink);
}
```

(Previously was `var(--bg)` / `var(--ink)` — these worked via the deleted `:root` block. Now must use `--color-*`.)

## Task 5.3: Verify

```bash
cd Frontend
npm run typecheck && npm run lint && npm run build
```

Visual sweep at desktop + mobile: any element rendering with browser-default colors (white text on white bg, etc.) means a consumer reference still resolves to `unset` — find it.

## Task 5.4: Commit

```bash
git add src/app/globals.css
git commit -m "refactor(styles-p3): delete :root color shim (all consumers migrated to @theme names)"
```

---

# Session 6: Touch-target audit + fix

## Task 6.1: Inventory interactive elements

For each interactive-element category in spec §5, list every file + line where it's defined or styled. Use grep targeting the relevant utility patterns:

```bash
cd Frontend
# Buttons
grep -rln "btnClass\|<Btn\|<button" src/ | grep -v node_modules
# Links (header, footer, drawer)
grep -rln "hpLinkClass\|drawerLinkBaseClass\|footerColListClass\|navLinkClass" src/ | grep -v node_modules
# Form inputs
grep -rln "@heroui/react.*Input\|@heroui/react.*Textarea\|@heroui/react.*Select" src/ | grep -v node_modules
# HeroUI Accordion / details
grep -rln "Accordion\b\|<details" src/ | grep -v node_modules
```

## Task 6.2: For each file, verify touch-target compliance

For each interactive class string (e.g., `drawerLinkBaseClass`, `footerColListClass`, etc.), check the utilities:
- Does it set `min-h-11` or padding/height ≥ 44px at mobile viewport?
- If not: add `min-h-11 min-w-11` OR adjust padding to reach 44px touch area.

For elements where adding `min-h-11` would force a visible layout change, use the `before:` hit-area trick:
```tsx
"relative before:content-[''] before:absolute before:inset-[-Npx]"
```
Where `N` is the additional inset needed to extend the hit area to 44×44 without changing visible bounds. Add `pointer-events-none` to the `before:` element to avoid intercepting events from siblings (the parent should still receive them).

## Task 6.3: Commit per file area

- `chore(a11y): touch-target ≥44px on Btn primitive`
- `chore(a11y): touch-target ≥44px on header + footer links`
- `chore(a11y): touch-target ≥44px on mobile-menu drawer items`
- `chore(a11y): touch-target ≥44px on lead-form + calculator inputs`
- `chore(a11y): touch-target ≥44px on FAQ accordion triggers`

## Task 6.4: Document exceptions

For any exception (interactive element where 44×44 forces an unacceptable layout change), append to `docs/superpowers/MANUAL-VERIFICATION.md` under a new "Touch-target exceptions" section with the specific element + reason + risk assessment.

---

# Session 7: HeroUI verification + fix

## Task 7.1: Spot-check each HeroUI component

For each consumer per spec §6 list:

1. **Drawer** (`src/components/layout/mobile-menu.tsx`):
   - Click burger → drawer slides in from right
   - Click backdrop → drawer closes (Issue 5 hotfix verification)
   - Stagger animation fires on items
   - Dark theme: drawer panel bg dark, items white text, no light flashes
   - On `/blog/<slug>` (sticky reading-progress bar) and `/calculator` (sticky summary): drawer overlay sits ABOVE the sticky element when open

2. **Accordion** (`src/components/blocks/final/faq.tsx`):
   - Click title → expands smoothly
   - Indicator (+ / ×) rotates
   - Content prose dark theme correct
   - Multiple items can be open/closed independently
   - Keyboard nav: tab to title, Enter/Space opens

3. **Input/Textarea/Select** (`src/components/blocks/lead-form/index.tsx`, `src/components/calculator/LeadForm.tsx`):
   - Focus ring renders
   - Error state visible
   - Placeholder text dark-theme correct
   - Dropdown popover (Select) bg + items dark-theme

4. **useDisclosure** (`src/components/layout/mobile-menu.tsx`):
   - `isOpen` state propagates correctly
   - `onClose` from any source (backdrop, esc, button) updates the state

## Task 7.2: Fix anything broken

For each issue found, fix via `classNames` prop or wrapping div utilities. Do NOT patch HeroUI internals.

Commit per fix: `fix(heroui): <component>: <issue>`.

## Task 7.3: Append to MANUAL-VERIFICATION.md

Append Phase 3 final section documenting the audit results — what was verified, what was fixed, what was flagged as a known issue (if any).

## Task 7.4: Final push + PR update

```bash
cd Frontend
git push
```

Update PR #7 description to note Phase 3 is complete and list the major changes (color shim deleted, touch-targets compliant, HeroUI verified).

---

# After this plan

Phase 3 complete. The style-system refactor (Phases 1+2+3) is done. Potential follow-up:

- **Light theme** (multi-theme support, currently dark-only)
- **Component library swap** (replace HeroUI if pain points emerge)
- **Performance optimization** (CSS bundle audit)
- **Visual redesign** (out of scope for the refactor effort; would warrant its own brainstorm)
