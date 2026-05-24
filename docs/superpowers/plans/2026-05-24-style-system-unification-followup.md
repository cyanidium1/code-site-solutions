# Style System Unification — Follow-Up Plan (Sessions 2+)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish Phase C (block-by-block CSS deletion) and Phase D (globals cleanup + ESLint enforcement) of the style-system refactor described in [`docs/superpowers/specs/2026-05-24-style-system-unification-design.md`](../specs/2026-05-24-style-system-unification-design.md).

**Architecture:** Same as the parent plan — Tailwind-first with `@theme` tokens + `src/components/ui/` primitives + small `vendor.css` / `keyframes.css` / `hero-effects.css` (the last is created in Session 5). No design changes.

**Tech Stack:** Next.js 15.5, React 19, Tailwind CSS 4.2.4, HeroUI 2.8, `clsx` + `tailwind-merge`, TypeScript 5.9, ESLint 9.

**Parent plan:** [`2026-05-24-style-system-unification.md`](2026-05-24-style-system-unification.md) — Tasks 1–25 + 28 already complete on `refactor/style-system-unification`. This plan supersedes the remaining tasks (26, 27, 29–47) with updated decomposition.

---

## Where we are

Already merged into the open branch (PR #7):

| Phase | Status | Notes |
|---|---|---|
| Phase A — Foundation | ✅ Done | `@theme` tokens, primitives library, demo page, swiper CSS hoist fix |
| Phase B — Inline-style cleanup | ✅ Done | 33 files converted, ESLint rule in warn mode, shared `ValuesSecondaryRow` + `nbyg-shared` extracted |
| Phase C — block CSS deletion | 🟡 3 of 18 | `buttons.css`, `cta-banner.css`, `reasons.css` deleted. 15 files remain. |
| Phase D — Globals cleanup + enforcement | ⏸ Not started | 5 tasks (rewrite globals, trim tailwind config, ESLint→error, delete demo, final verify) |

Working branch: `refactor/style-system-unification`. New work continues on this branch unless the PR is merged first.

---

## Session structure

Eight sessions, each ending with a clean commit/push checkpoint. Each session is self-contained and can be picked up independently.

| # | Session | Files / scope | Effort | Risk |
|---|---|---|---|---|
| 1 | Small block deletions | team-cards, services, outcome, page-hero (4 files) | ~2h | Low |
| 2 | Medium block deletions | image-text, comparison, launch-cta, final (4 files) | ~3h | Low-Med |
| 3 | Heavy single-component deletions | turnkey-list, contact-split, lead-form (3 files) | ~3h | Med (HeroUI in lead-form) |
| 4 | case.css | 470 lines | ~2h | Med |
| 5 | hero.css | 736 lines + create `hero-effects.css` | ~3-4h | **High** (most visible page) |
| 6 | calculator.css | 1,570 lines | ~3-4h | Med |
| 7 | homepage.css | 2,321 lines (≈14 component groups) | **Multi-session**, see breakdown | Med-High |
| 8 | Cleanup + Phase D | blog.css trim, globals.css rewrite, config trim, ESLint→error, delete demo, final verify | ~2h | Low |

---

## Shared procedures (reference, do not repeat per task)

### Block-migration procedure

For every block CSS file being deleted:

1. **Read** the CSS file end-to-end and the consumer `.tsx` files.
2. **Categorize** each rule: layout (→ utility), color/typography (→ utility), pseudo-elements (→ `before:`/`after:` utility), genuinely complex / `:has()` / scroll-driven (→ keep in a tiny sidecar CSS file — only if absolutely necessary).
3. **Convert consumers**: replace semantic class names with Tailwind utility strings or with primitives from `@/components/ui` where the markup matches their intent. Remove the `import "./<block>.css";` line.
4. **Verify Heading sizes**: if the block uses heading text (`.h1`, `.hp-h2`, etc.), reconcile the size values in `src/components/ui/Heading.tsx`'s `sizes` table against the legacy CSS rule. The placeholders in Phase A are not authoritative.
5. **Delete the CSS file**.
6. **Verify**: `npm run typecheck && npm run lint && npm run build`. Visually compare affected pages at 1440px.
7. **Commit**: one commit per block. Message format: `refactor(styles): delete <block>.css with utilities + primitives`.

### CSS cascade safety

**If the consumer `.tsx` imports a third-party stylesheet** (e.g. `swiper/css`, `yet-another-react-lightbox/styles.css`, HeroUI sub-themes), hoist that import to `src/app/layout.tsx` **before** deleting the block CSS. Otherwise the cascade flips and the third-party defaults override our utilities. This is the same bug class fixed in Phase A commit `5c5567a`.

Check for third-party imports with:
```bash
cd Frontend && grep -n "^import \"[a-z]" src/components/<block>/*.tsx
```

If any non-relative CSS imports are present, hoist them to `layout.tsx` in the same task (or as a precursor commit) before deleting the block CSS.

### Verification commands (run after every block deletion)

```bash
cd Frontend
npm run typecheck     # must pass
npm run lint          # must pass (no new react/forbid-dom-props warnings)
npm run build         # must succeed
```

Visual sweep: re-screenshot the affected page at 1440px and compare against baseline. Acceptable: sub-pixel anti-aliasing. Not acceptable: layout shift, missing pseudo-element decoration, missing animation.

### `<Btn>` vs `btnClass()` helper

- For `<button>` or `<a>`: use `<Btn variant="primary|ghost">`.
- For Next.js `<Link>` (most CTAs): use `className={btnClass("primary", "optional-extra-class")}`. The helper returns the Tailwind class string only.
- For "play" icon span inside a ghost button: use `<span className={PLAY_ICON_CLASS}>▶</span>`.
- All three are exported from `@/components/ui`.

### Append per-block manual-verification notes

After each block deletion, append a short block to `docs/superpowers/MANUAL-VERIFICATION.md` under the "Phase C" section, listing pages affected and what to eyeball.

---

# Session 1: Small block deletions

Four files, 31–66 lines each. All follow the standard block-migration procedure. The CSS in these is mostly fragile-bits-only (pseudo-elements, gradient backgrounds) — JSX already uses Tailwind utilities for the bulk.

## Task S1.1: Delete `team-cards.css`

**Files:**
- Delete: `Frontend/src/components/blocks/team-cards/team-cards.css`
- Modify: `Frontend/src/components/blocks/team-cards/index.tsx`

- [ ] **Step 1: Read CSS + consumer**
  ```bash
  cd Frontend
  cat src/components/blocks/team-cards/team-cards.css
  cat src/components/blocks/team-cards/index.tsx
  ```

- [ ] **Step 2: Categorize and rewrite consumer**
  - For each rule in `team-cards.css`, identify whether the consumer uses the class. Rewrite consumer `className` strings using Tailwind utilities (or arbitrary values for things like custom gradients).
  - Keep pseudo-elements as `before:`/`after:` utilities.
  - If the block uses HeroUI components, ensure no class conflict.

- [ ] **Step 3: Remove the import**
  Delete `import "./team-cards.css";` from `index.tsx`.

- [ ] **Step 4: Delete the file**
  ```bash
  cd Frontend
  rm src/components/blocks/team-cards/team-cards.css
  ```

- [ ] **Step 5: Verify**
  ```bash
  cd Frontend
  npm run typecheck && npm run lint && npm run build
  ```

- [ ] **Step 6: Update manual-verification doc**
  Append to `docs/superpowers/MANUAL-VERIFICATION.md`:
  ```markdown
  ### Task S1.1 — `team-cards.css` deleted
  Affected pages: any page using `<TeamSection>` (e.g. `/about`, `/en/about`).
  - [ ] Team card grid layout preserved at 1440px and 800px
  - [ ] Card hover/focus states unchanged
  - [ ] Avatar placeholder visuals preserved
  ```

- [ ] **Step 7: Commit**
  ```bash
  cd Frontend
  git add -A
  git commit -m "refactor(styles): delete team-cards.css with utilities"
  ```

## Task S1.2: Delete `services.css`

**Files:**
- Delete: `Frontend/src/components/blocks/services/services.css`
- Modify: `Frontend/src/components/blocks/services/index.tsx` (and any other consumers)

- [ ] **Step 1: Find consumers**
  ```bash
  cd Frontend
  grep -rln "services.css\|class.*services-" src/
  ```

- [ ] **Step 2: Read + convert** (same procedure as S1.1 steps 1–2)

- [ ] **Step 3: Remove import + delete file + verify + manual-verification append + commit** (same shape as S1.1 steps 3–7)

  Commit message: `refactor(styles): delete services.css with utilities`

  Manual-verification append:
  ```markdown
  ### Task S1.2 — `services.css` deleted
  Affected pages: anywhere `<Services>` block renders (homepage industry-specific pages, services sub-pages).
  - [ ] Service card grid preserved
  - [ ] Background image url() still applies (dynamic via inline `style` with eslint-disable comment, retained from Phase B)
  - [ ] Hover states unchanged
  ```

## Task S1.3: Delete `outcome.css`

**Files:**
- Delete: `Frontend/src/components/blocks/outcome/outcome.css`
- Modify: `Frontend/src/components/blocks/outcome/index.tsx`

- [ ] **Steps 1–7: Same procedure as S1.1**

  Commit message: `refactor(styles): delete outcome.css with utilities`

  Manual-verification append:
  ```markdown
  ### Task S1.3 — `outcome.css` deleted
  Affected pages: any page using `<Outcome>` block (case study pages, marketing pages).
  - [ ] Outcome section layout preserved
  - [ ] Device mockup positioning unchanged
  ```

## Task S1.4: Delete `page-hero.css`

**Files:**
- Delete: `Frontend/src/components/blocks/page-hero/page-hero.css`
- Modify: `Frontend/src/components/blocks/page-hero/index.tsx`

- [ ] **Step 1: Reconcile Heading sizes**
  Before deleting, open `src/components/blocks/page-hero/page-hero.css` and find any rule for `.page-hero-h1` (font-size, line-height, tracking, weight). Compare to `<H1 variant="page-hero">` in `src/components/ui/Heading.tsx`. If the values differ, **update the `sizes` table in `Heading.tsx`** to match the legacy values exactly. The Heading primitive is the source of truth from here forward.

- [ ] **Step 2: Steps 2–7 same procedure as S1.1**

  Commit message: `refactor(styles): delete page-hero.css; reconcile <H1 variant="page-hero"> size`

  Manual-verification append:
  ```markdown
  ### Task S1.4 — `page-hero.css` deleted
  Affected pages: every page that uses `<PageHero>` — `/about`, `/portfolio`, `/portfolio/*`, `/blog`, `/contacts`, `/process`, `/pricing` (UK + EN of each).
  - [ ] Page hero H1 size matches legacy (compare side-by-side if needed)
  - [ ] Breadcrumb `display: contents` still works (Phase B converted to `className="contents"`)
  - [ ] Eyebrow chip styling unchanged
  ```

---

# Session 2: Medium block deletions

Four files, 130–172 lines each. More rules per file, more time to convert, same procedure.

## Task S2.1: Delete `image-text.css`

**Files:**
- Delete: `Frontend/src/components/blocks/image-text/image-text.css`
- Modify: `Frontend/src/components/blocks/image-text/index.tsx`

- [ ] **Steps follow block-migration procedure.** This block has `side`/`side-with-list`/`centered` variants — each needs its rules ported. Use `<Container>` and `<Section>` primitives where appropriate.

- [ ] **Note**: a contributor (you, in an interactive session) may have made uncommitted changes to `image-text.css` prior to this session — `git diff src/components/blocks/image-text/image-text.css` will show them. Read those changes first and incorporate any intentional differences into the converted JSX before deleting the file.

  Commit message: `refactor(styles): delete image-text.css with utilities`

## Task S2.2: Delete `comparison.css`

**Files:**
- Delete: `Frontend/src/components/blocks/comparison/comparison.css`
- Modify: `Frontend/src/components/blocks/comparison/index.tsx`

- [ ] **Step 1: Handle relative-color OKLCH syntax**
  Rules like `oklch(from var(--accent) l c h / 0.2)` are valid Tailwind 4 arbitrary values:
  ```
  bg-[oklch(from_var(--color-accent)_l_c_h_/_0.2)]
  ```
  Underscores escape spaces inside the arbitrary value. Wrap dashes in the variable name with parens if needed.

- [ ] **Steps 2–7: Standard block-migration procedure.**

  Commit message: `refactor(styles): delete comparison.css with utilities (relative-color OKLCH preserved)`

## Task S2.3: Delete `launch-cta.css`

**Files:**
- Delete: `Frontend/src/components/blocks/launch-cta/launch-cta.css`
- Modify: `Frontend/src/components/blocks/launch-cta/index.tsx`

- [ ] **Standard block-migration procedure.**

  Commit message: `refactor(styles): delete launch-cta.css with utilities`

## Task S2.4: Delete `final.css`

**Files:**
- Delete: `Frontend/src/components/blocks/final/final.css`
- Modify: `Frontend/src/components/blocks/final/index.tsx` (and any consumers using `.faq-*` / `.social-*` classes if defined here)

- [ ] **Step 1: Inspect HeroUI accordion integration**
  `final.css` contains FAQ accordion styling that overrides HeroUI's defaults. Check that the override rules can be replaced with utility classes passed to HeroUI's `classNames` prop on the `<Accordion>` component — that's HeroUI's documented theming hook and avoids CSS-cascade fragility.

- [ ] **Steps 2–7: Standard block-migration procedure.**

  Commit message: `refactor(styles): delete final.css with utilities + HeroUI classNames`

---

# Session 3: Heavy single-component deletions

Three files, 236–281 lines each. All single-component scope but more complex internals.

## Task S3.1: Delete `turnkey-list.css`

**Files:**
- Delete: `Frontend/src/components/blocks/turnkey-list/turnkey-list.css`
- Modify: `Frontend/src/components/blocks/turnkey-list/index.tsx`

- [ ] **Standard block-migration procedure.** Reconcile any `.turnkey-list-h2` / `.turnkey-list-title` heading sizes against `<H2>` primitive's `sizes` table (Step 1 of S1.4).

  Commit message: `refactor(styles): delete turnkey-list.css with utilities`

## Task S3.2: Delete `contact-split.css`

**Files:**
- Delete: `Frontend/src/components/blocks/contact-split/contact-split.css`
- Modify: `Frontend/src/components/blocks/contact-split/index.tsx`

- [ ] **Step 1: Note `.contact-split-heading` size**
  Reconcile against `<H2>` primitive (same as S3.1).

- [ ] **Steps 2–7: Standard block-migration procedure.**

  Commit message: `refactor(styles): delete contact-split.css with utilities`

## Task S3.3: Delete `lead-form.css`

**Files:**
- Delete: `Frontend/src/components/blocks/lead-form/lead-form.css`
- Modify: `Frontend/src/components/blocks/lead-form/index.tsx`

- [ ] **Step 1: Audit HeroUI input theming**
  This block uses HeroUI inputs heavily. Determine whether existing CSS overrides should:
  - Move to `classNames` props on HeroUI inputs (preferred — same pattern as S2.4 FAQ accordion)
  - Stay in a `vendor.css` block as a last resort
  - Be deleted entirely if HeroUI's default theming now suffices

  Document the choice in the commit message.

- [ ] **Steps 2–7: Standard block-migration procedure.**

  Commit message: `refactor(styles): delete lead-form.css; HeroUI inputs use classNames API`

  Manual-verification append (HeroUI is fragile):
  ```markdown
  ### Task S3.3 — `lead-form.css` deleted
  - [ ] Form inputs render with correct dark-theme styling
  - [ ] Focus ring + error state colors match prior visual
  - [ ] Submit button hover/active preserved
  - [ ] Lead form lives on /contacts, /en/contacts, /calculator — verify all three
  ```

---

# Session 4: Delete `case.css`

Single 470-line file. Used by `src/components/case-page/index.tsx` (Sanity-driven case renderer, already touched in Phase B Task 21).

## Task S4.1: Delete `case.css`

**Files:**
- Delete: `Frontend/src/components/blocks/case/case.css`
- Modify: `Frontend/src/components/case-page/index.tsx` (and any other consumers)

- [ ] **Step 1: Find all consumers**
  ```bash
  cd Frontend
  grep -rln "case.css\|class.*case-" src/
  ```

- [ ] **Step 2: Read case.css in chunks**
  470 lines is too long to convert in one pass. Read it in three chunks of ~150 lines each. For each chunk, list the selectors and which JSX element / consumer uses them. Build the conversion table before editing JSX.

- [ ] **Step 3: Reconcile `.case-h2` size**
  Update `<H2 variant="case">` in `src/components/ui/Heading.tsx` to match the legacy `.case-h2` font-size / line-height / tracking values from this file.

- [ ] **Step 4: Convert consumers in batches**
  Group conversions by section (case hero, case body, case meta strip, case media gallery, related cases). After each section converts, run typecheck to catch missed classes early.

- [ ] **Step 5: Delete the file + verify + manual-verification append + commit**

  Commit message: `refactor(styles): delete case.css with utilities (470 lines → JSX utilities)`

  Manual-verification append:
  ```markdown
  ### Task S4.1 — `case.css` deleted
  Affected pages: every Sanity case-study URL. Spot-check at minimum:
  - [ ] `/portfolio/[any-published-case-slug]` (UK + EN)
  - [ ] `<H2 variant="case">` size matches legacy across all sections
  - [ ] YouTube embed section (Phase B Task 21 converted; re-verify)
  - [ ] Meta strip + related-cases section visual parity
  ```

---

# Session 5: Delete `hero.css` (create `hero-effects.css`)

Single 736-line file — **highest visual-regression risk**. Hero is the first thing users see. Budget extra care.

## Task S5.1: Audit hero.css and plan the split

**Files:** none (investigation only)

- [ ] **Step 1: Read hero.css end-to-end**
  Open `src/components/blocks/hero/hero.css`. Read all 736 lines.

- [ ] **Step 2: Categorize every rule**
  Make a scratch list. For each rule, mark one of:
  - `U` — convertible to Tailwind utility (vast majority should be U)
  - `T` — typography that lives in `<H1 variant="hp">` / `<H2 variant="hp">` already
  - `E` — genuinely-not-a-utility effect: grain overlay, ticker mask, fixed-position backdrop, complex `:has()` selectors, scroll-driven animations

  Only `E` rules survive in the new `hero-effects.css`. Target: **≤ 80 lines** of `E` rules total. If more, push back and re-examine before continuing — most "effects" are utility-expressible.

- [ ] **Step 3: Reconcile `<H1 variant="hp">` and `<H2 variant="hp">` sizes**
  Update `src/components/ui/Heading.tsx` `sizes` table from the legacy `.hp-h1` / `.hp-h2` rules. This is the only Heading variant migration after Phase D; do it right.

- [ ] **Step 4: Write the plan as a comment block** in the converted `index.tsx` or in a scratch file before changing code. This forces clarity before editing.

  No commit — investigation only.

## Task S5.2: Create `hero-effects.css` with only the E-rules

**Files:**
- Create: `Frontend/src/components/blocks/hero/hero-effects.css`

- [ ] **Step 1: Write the file**
  Paste only the rules marked `E` in S5.1 Step 2. Add a one-line comment above each rule explaining why it cannot be a utility.

- [ ] **Step 2: Import from `hero/index.tsx`**
  Replace `import "./hero.css";` with `import "./hero-effects.css";` at the top of `src/components/blocks/hero/index.tsx`.

- [ ] **Step 3: Verify file is ≤ 80 lines**
  ```bash
  cd Frontend
  wc -l src/components/blocks/hero/hero-effects.css
  ```
  If > 80, return to S5.1 Step 2 and re-examine whether some `E` rules can in fact become utilities.

- [ ] **Step 4: Verify + commit**
  ```bash
  cd Frontend
  npm run typecheck && npm run lint && npm run build
  git add -A
  git commit -m "refactor(styles): extract hero-effects.css (only non-utility rules retained)"
  ```

## Task S5.3: Convert hero JSX in batches

**Files:**
- Modify: `Frontend/src/components/blocks/hero/index.tsx`

- [ ] **Step 1: Convert nav + header section** (everything above `<HeroGrid>`)
  Replace semantic class names with utilities. Commit.
  ```bash
  cd Frontend
  git commit -m "refactor(styles): convert hero nav/header to utilities"
  ```

- [ ] **Step 2: Convert hero-left content** (eyebrow, H1, sub, features, CTAs)
  Use `<H1 variant="hp">` for the main headline. Replace stats grid. Commit.

- [ ] **Step 3: Convert hero-right (device mockup)**
  Device positioning, glow, grid background. Commit.

- [ ] **Step 4: Convert ticker section**
  Marquee animation already in `keyframes.css`. Convert ticker layout. Commit.

- [ ] **Step 5: Delete `hero.css`**
  ```bash
  cd Frontend
  rm src/components/blocks/hero/hero.css
  ```

- [ ] **Step 6: Verify thoroughly**
  ```bash
  cd Frontend
  npm run typecheck && npm run lint && npm run build
  ```
  Visual checks at 1440px on `/` and `/en`:
  - Background glow gradient
  - Grain overlay (effect from hero-effects.css)
  - Device mockup at correct position and scale
  - Primary CTA shimmer animation on hover
  - Ghost CTA + play icon child
  - Stats grid divider lines
  - Marquee ticker scrolls smoothly
  - Feature chips below CTAs

- [ ] **Step 7: Update manual-verification doc and commit**
  Manual-verification append:
  ```markdown
  ### Tasks S5.1–S5.3 — `hero.css` → `hero-effects.css` (≤80 lines)
  Hero is the most visible page. Eyeball every effect:
  - [ ] Background glow gradient present and positioned correctly
  - [ ] Grain overlay subtle texture visible (hero-effects.css)
  - [ ] Device mockup proportions + position match baseline
  - [ ] Primary CTA shimmer animation on hover (uses Btn primitive's `::before`)
  - [ ] Marquee ticker scrolls left at 30s/loop
  - [ ] Stats grid divider lines between stat cells
  - [ ] Feature chips render with correct icons
  ```
  ```bash
  cd Frontend
  git add -A
  git commit -m "refactor(styles): delete hero.css (736 lines → utilities + 80-line hero-effects.css)"
  ```

---

# Session 6: Delete `calculator.css`

Single 1,570-line file. Used by `WebsiteCalculator.tsx` + sub-components. Multiple distinct sub-blocks: info cards, multi-step form, summary, lead form integration.

## Task S6.1: Map calculator.css to sub-components

**Files:** none (investigation)

- [ ] **Step 1: Find consumers**
  ```bash
  cd Frontend
  ls src/components/calculator/
  grep -rln "calculator.css" src/
  ```

- [ ] **Step 2: Group rules by sub-component**
  Read `calculator.css` and group each rule under one of: `.calc-section-head`, `.calc-info-card`, `.calc-manual-intro`, `.calc-summary*`, `.calc-after-*`, `.calc-lead*`, `.calc-group*`, `.calc-btn-primary` / `.calc-btn-ghost`, `.calc-step-*`. List each group with line range.

- [ ] **Step 3: Decide whether to extract sub-components**
  If a sub-component is rendered in > 1 place (or > 100 lines of CSS), extract its JSX + Tailwind into `src/components/calculator/<sub-name>.tsx`. This is the same pattern as `ValuesSecondaryRow` in Phase B.

  No commit — investigation.

## Task S6.2: Migrate calculator sub-component groups one-by-one

Each sub-component is its own Step. After every Step, run typecheck + visual check and commit. Do not delete `calculator.css` until all consumers are converted.

- [ ] **Step 1: Convert `.calc-section-head` and shared layout** — commit
- [ ] **Step 2: Convert `.calc-info-card`** — commit
- [ ] **Step 3: Convert `.calc-manual-intro` + `.calc-after-*`** — commit
- [ ] **Step 4: Convert `.calc-summary*`** — commit
- [ ] **Step 5: Convert `.calc-step-*` (multi-step form)** — commit
- [ ] **Step 6: Convert `.calc-lead*` + `.calc-btn-primary` / `.calc-btn-ghost`** — commit
- [ ] **Step 7: Convert any remaining `.calc-group*`** — commit

## Task S6.3: Delete `calculator.css`

- [ ] **Step 1: Confirm zero references remain**
  ```bash
  cd Frontend
  grep -rln "calc-\|calculator.css" src/ | grep -v node_modules
  ```
  Output should be empty except for `src/components/calculator/calculator.css` itself.

- [ ] **Step 2: Delete + verify + manual-verification append + commit**
  Commit message: `refactor(styles): delete calculator.css (1570 lines → per-sub-component utilities)`

  Manual-verification append: full click-through of `/calculator` page — every step, info card, summary state.

---

# Session 7: Delete `homepage.css` (multi-batch)

Single 2,321-line file covering ~14 component groups. Decompose into batches; each batch is its own commit. May span 2–3 sessions in practice — pause cleanly between batches.

## Task S7.1: Map homepage.css class prefixes to consumer files

**Files:** none (investigation)

- [ ] **Step 1: Catalog class prefixes**
  Read homepage.css and group selectors by prefix. Identified groups (from audit):

  | Prefix | Approx classes | Consumer |
  |---|---|---|
  | `.hp-section`, `.hp-inner`, `.hp-eyebrow`, `.hp-sub`, `.hp-link`, `.hp-section-cta`, `.hp-pull-cta`, `.hp-section-head` | 8 | Shared by all homepage components |
  | `.hp-marquee*` | 5 | `homepage/marquee.tsx` |
  | `.hp-industry*` | 13 | `homepage/industries.tsx` |
  | `.hp-bento*` | 80+ | `homepage/bento.tsx` (biggest chunk) |
  | `.hp-process*` | 7 | `homepage/process.tsx` |
  | `.hp-cases-grid`, `.hp-case-*` | 18 | `homepage/cases.tsx`, `blocks/related-card`, portfolio pages |
  | `.hp-pricing-wrap` | 1 | homepage pricing wrapper |
  | `.hp-stack*` | 5 | `homepage/stack.tsx` |
  | `.hp-pull*` | 11 | `homepage/pull-quote.tsx`, `pull-quote-swiper/` |
  | `.hp-urgency-*` | 3 | urgency badge component |
  | `.hp-finalcta-*` | 7 | `homepage/final-cta3.tsx` |
  | `.hp-news-*` | 7 | newsletter widget |
  | `.hp-footer-*` | 14 | `homepage/footer.tsx` |
  | `.hp-header-*`, `.hp-nav-*`, `.hp-locale-*` | 25 | `homepage/header.tsx`, `layout/mobile-menu.tsx` (locale switcher) |
  | `.hp-burger-*`, `.hp-drawer-*` | 40+ | `layout/mobile-menu.tsx` |

- [ ] **Step 2: Decide migration order**
  Recommended order (low-risk → high-risk):
  1. Shared `.hp-section` / `.hp-inner` / `.hp-eyebrow` etc. — but defer DELETION until last (consumers across all batches still reference them)
  2. `.hp-marquee*` — small, isolated
  3. `.hp-stack*` — small
  4. `.hp-urgency-*`, `.hp-news-*`, `.hp-finalcta-*` — small, isolated
  5. `.hp-pricing-wrap`, `.hp-process*`, `.hp-pull*` — medium
  6. `.hp-industry*` — medium
  7. `.hp-cases-grid` / `.hp-case-*` — used by multiple files (including portfolio pages via legacy class refs), be careful
  8. `.hp-footer-*` — large but isolated
  9. `.hp-header-*` / `.hp-nav-*` / `.hp-locale-*` — large
  10. `.hp-burger-*` / `.hp-drawer-*` — largest single chunk; mobile menu
  11. Final pass: convert remaining shared `.hp-section` / `.hp-inner` etc.; delete `homepage.css`

  No commit — planning.

## Tasks S7.2 – S7.12: One task per class-prefix group

Each task follows the **block-migration procedure** but scoped to one prefix group rather than one file. The CSS file is shared across tasks until the last one deletes it. Between batches, both the rules-being-removed AND the rules-still-pending coexist in `homepage.css`.

For each prefix group:

- [ ] **Step 1**: Identify the consumer `.tsx` file(s). List all rules with that prefix in `homepage.css`.
- [ ] **Step 2**: Reconcile any heading variants (`<H1>`/`<H2>`/`<H3>`) used by the consumer.
- [ ] **Step 3**: Convert the consumer's `className` strings to Tailwind utilities.
- [ ] **Step 4**: Delete the matching rules from `homepage.css` (but leave the file intact for other batches).
- [ ] **Step 5**: Verify (`npm run typecheck && npm run lint && npm run build`) + visual sweep of `/` and `/en` plus any other affected page.
- [ ] **Step 6**: Append per-task entry to MANUAL-VERIFICATION.md.
- [ ] **Step 7**: Commit. Message: `refactor(styles): migrate .hp-<prefix>* to utilities`.

The 11 sub-tasks within Session 7 are (in execution order from S7.1 Step 2):

| # | Prefix | Commit message |
|---|---|---|
| S7.2 | `.hp-marquee*` | `refactor(styles): migrate .hp-marquee* to utilities` |
| S7.3 | `.hp-stack*` | `refactor(styles): migrate .hp-stack* to utilities` |
| S7.4 | `.hp-urgency-*`, `.hp-news-*`, `.hp-finalcta-*` | `refactor(styles): migrate hp-urgency/news/finalcta to utilities` |
| S7.5 | `.hp-pricing-wrap`, `.hp-process*`, `.hp-pull*` | `refactor(styles): migrate hp-pricing/process/pull-quote to utilities` |
| S7.6 | `.hp-industry*` | `refactor(styles): migrate .hp-industry* to utilities (keep --accent-color CSS var)` |
| S7.7 | `.hp-bento*` (split further if needed) | `refactor(styles): migrate .hp-bento* to utilities` |
| S7.8 | `.hp-cases-grid`, `.hp-case-*` | `refactor(styles): migrate .hp-case* to utilities` |
| S7.9 | `.hp-footer-*` | `refactor(styles): migrate .hp-footer* to utilities` |
| S7.10 | `.hp-header-*`, `.hp-nav-*`, `.hp-locale-*` | `refactor(styles): migrate .hp-header/nav/locale* to utilities` |
| S7.11 | `.hp-burger-*`, `.hp-drawer-*` | `refactor(styles): migrate .hp-burger/drawer* to utilities` |
| S7.12 | Shared `.hp-section`, `.hp-inner`, etc. + delete file | `refactor(styles): delete homepage.css (final shared classes migrated)` |

**Note on `.hp-bento*` (Task S7.7)**: 80+ classes covering Bento grid layout + multiple Bento visualization sub-components (`.hp-bento-commits`, `.hp-bento-weeks`, `.hp-bento-price`, `.hp-bento-tl`, `.hp-bento-timer`, `.hp-bento-stack`, etc.). If converting all in one task feels too risky, split further into Bento grid (S7.7a) and Bento visuals (S7.7b). Document the split in commit messages.

**Note on `.hp-case-*` (Task S7.8)**: Already partially migrated in Phase B (NbygRelatedCard, RelatedCard in `blocks/related-card`). Remaining consumers reference these classes directly without using the primitives. Migrate those to use the primitive or the `hp-case-*` utility classes inline.

---

# Session 8: Cleanup and Phase D

Final session. Trim `blog.css`, rewrite globals, trim Tailwind config, flip ESLint to error, delete demo page, run success-criteria verification.

## Task S8.1: Trim `blog.css` to use `@theme` tokens

**Files:**
- Modify: `Frontend/src/components/blocks/blog/blog.css`

- [ ] **Step 1: Read current blog.css**
  ```bash
  cd Frontend
  cat src/components/blocks/blog/blog.css
  ```

- [ ] **Step 2: Replace hardcoded values with `@apply` to utilities**
  For each rule that targets markdown-generated HTML (`.blog-prose p`, `.blog-prose h2`, etc.), replace hardcoded `color: #...` / `font-size: ...` / `line-height: ...` with `@apply text-ink-dim text-base leading-relaxed;` (substitute the appropriate utility for each property).

  Example pattern:
  ```css
  /* before */
  .blog-prose p {
    color: #b8b3c4;
    font-size: 16px;
    line-height: 1.7;
  }

  /* after */
  .blog-prose p {
    @apply text-ink-dim text-base leading-relaxed;
  }
  ```

- [ ] **Step 3: Verify**
  ```bash
  cd Frontend
  npm run typecheck && npm run build
  ```
  Visual check: open any blog post and confirm prose styling unchanged.

- [ ] **Step 4: Commit**
  ```bash
  cd Frontend
  git add src/components/blocks/blog/blog.css
  git commit -m "refactor(styles): trim blog.css to use @theme tokens via @apply"
  ```

## Task S8.2: Rewrite `globals.css` to target form

**Files:**
- Modify: `Frontend/src/app/globals.css`

- [ ] **Step 1: Remove legacy `:root` token block**
  Delete the entire `:root { color-scheme: dark; --bg: ...; ... }` block (lines below the `@theme` block). All tokens now live in `@theme`. The `@theme` block exposes the same names at `:root` automatically so existing `var(--bg)` references in any remaining inline styles still work.

- [ ] **Step 2: Remove `@media` overrides on `:root`**
  Delete every `@media (max-width: ...) { :root { --section-y: ...; ... } }` block. After this, `--spacing-section-y` and `--spacing-gutter-x` are fixed at desktop values across all viewports — **this is the intentional Phase 1 endpoint**. Phase 2 reintroduces responsive scaling as mobile-first utilities in primitives.

- [ ] **Step 3: Remove legacy semantic classes**
  Delete `.h1`, `.hp-h1`, `.hp-h2`, `.case-h1`, `.case-h2`, `.page-hero-h1`, `.container-page`, the `.calc-*` heading family selectors, and the `.about-values-secondary` responsive grid overrides. If `npm run build` fails because something still references them, that's a missed consumer — track it down and convert before continuing.

- [ ] **Step 4: Remove the global `h1, h2, h3` font-family override**
  Currently `globals.css` applies `font-family: var(--font-actay)` to every `h1`/`h2`/`h3` via a global selector. After this step, the `<H1>`/`<H2>`/`<H3>` primitives apply `font-actay` explicitly via Tailwind utility — the global selector is no longer needed and should be deleted to prevent accidental application to non-primitive headings.

- [ ] **Step 5: Keep**
  - `@import "tailwindcss"` + `@config "../../tailwind.config.ts"`
  - The full `@theme { ... }` block
  - `html { scroll-behavior: smooth }`
  - `html, body { background, color }` and the `body { font-feature-settings, overflow-x: clip, ... }` rules
  - The `@layer utilities { .text-gradient, .text-gradient-brand, .grid-bg, .dotted-bg, .ease-soft }` block

- [ ] **Step 6: Verify**
  ```bash
  cd Frontend
  npm run typecheck && npm run lint && npm run build
  ```
  Then visually sweep every page in the baseline list. Any remaining reference to deleted classes will visually regress (unstyled element). Fix and re-verify.

- [ ] **Step 7: Commit**
  ```bash
  cd Frontend
  git add src/app/globals.css
  git commit -m "refactor(styles): trim globals.css to @theme + utilities (remove legacy :root + semantic classes)"
  ```

## Task S8.3: Trim `tailwind.config.ts`

**Files:**
- Modify: `Frontend/tailwind.config.ts`

- [ ] **Step 1: Verify `@theme --font-*` tokens generate Tailwind utilities**
  Before deleting `theme.extend.fontFamily`, confirm that the existing `@theme --font-display`, `--font-sans`, `--font-actay`, `--font-mono` definitions generate the corresponding `font-display`/`font-sans`/`font-actay`/`font-mono` utilities. Test:
  ```bash
  cd Frontend
  # Temporarily add a test usage in any .tsx file and run build
  ```
  If utilities work: proceed to Step 2. If not: keep `theme.extend.fontFamily` block.

- [ ] **Step 2: Strip `theme.extend`** (or leave fontFamily only)

  Target minimal config:
  ```ts
  import type { Config } from "tailwindcss";
  import { heroui } from "@heroui/theme";

  const config: Config = {
    content: [
      "./src/**/*.{ts,tsx,mdx}",
      "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    plugins: [
      heroui({
        themes: {
          dark: {
            colors: {
              background: "#121212",
              foreground: "#f5f3f7",
              primary: { DEFAULT: "#7c4dde", foreground: "#ffffff" },
              secondary: { DEFAULT: "#5d2dad", foreground: "#ffffff" },
            },
          },
        },
      }),
    ],
  };

  export default config;
  ```

- [ ] **Step 3: Verify**
  ```bash
  cd Frontend
  npm run build
  ```
  If utilities like `bg-accent`, `text-ink`, `max-w-container` fail to compile, `@theme` is not picking up the tokens. Restore the deleted `theme.extend` blocks and diagnose.

- [ ] **Step 4: Commit**
  ```bash
  cd Frontend
  git add tailwind.config.ts
  git commit -m "refactor(styles): minimize tailwind.config.ts to plugin + content (all tokens in @theme)"
  ```

## Task S8.4: Promote ESLint rule to error

**Files:**
- Modify: `Frontend/eslint.config.mjs`

- [ ] **Step 1: Flip severity**
  Change `"react/forbid-dom-props": ["warn", ...]` to `["error", ...]`.

- [ ] **Step 2: Verify**
  ```bash
  cd Frontend
  npm run lint
  ```
  Expected: zero errors. Any error is a missed inline static style — find and convert.

- [ ] **Step 3: Commit**
  ```bash
  cd Frontend
  git add eslint.config.mjs
  git commit -m "chore(lint): error on inline static styles (Phase 1 enforcement complete)"
  ```

## Task S8.5: Delete `/dev/primitives` demo

**Files:**
- Delete: `Frontend/src/app/dev/primitives/page.tsx`

- [ ] **Step 1: Remove the directory**
  ```bash
  cd Frontend
  rm -r src/app/dev/primitives
  # Remove parent dir if empty
  if [ -z "$(ls -A src/app/dev 2>/dev/null)" ]; then rmdir src/app/dev; fi
  ```

- [ ] **Step 2: Verify build**
  ```bash
  cd Frontend
  npm run build
  ```

- [ ] **Step 3: Commit**
  ```bash
  cd Frontend
  git add -A
  git commit -m "chore: remove dev/primitives demo page (Phase 1 complete)"
  ```

## Task S8.6: Final success-criteria verification

**Files:** none — verification only.

- [ ] **Step 1: Criterion 1 — only allowed CSS files remain**
  ```bash
  cd Frontend
  find src -name "*.css" -type f
  ```
  Expected output (exactly):
  ```
  src/app/globals.css
  src/app/keyframes.css
  src/app/vendor.css
  src/components/blocks/hero/hero-effects.css
  src/components/blocks/blog/blog.css
  ```
  Anything else → investigate.

- [ ] **Step 2: Criterion 2 — `globals.css` shape**
  Read `src/app/globals.css`. Confirm:
  - No `:root { --foo: ... }` definitions outside the `@theme` block
  - No legacy semantic classes (`.h1`, `.hp-h2`, `.case-h2`, `.container-page`, `.btn-*`)
  - No `@media (max-width: ...)` overriding `:root` tokens
  - `@theme` block + utilities `@layer` + html/body rules remain

- [ ] **Step 3: Criterion 3 — zero inline static styles**
  ```bash
  cd Frontend
  npm run lint
  ```
  Expected: zero `react/forbid-dom-props` errors.

- [ ] **Step 4: Criterion 4 — tokens only from `@theme`**
  ```bash
  cd Frontend
  grep -c "^@theme\|^  --" src/app/globals.css
  ```
  All `--` definitions should be inside the `@theme` block.

- [ ] **Step 5: Criterion 5 — primitives adopted**
  ```bash
  cd Frontend
  grep -rln 'from "@/components/ui"' src/app src/components | wc -l
  ```
  Expected: ≥ 80% of page files (`src/app/**/page.tsx`) import from `@/components/ui`.

- [ ] **Step 6: Criterion 6 — visual parity**
  Re-screenshot every page from the baseline list. Diff each against the Phase A baseline (`docs/superpowers/baselines/2026-05-24-pre-refactor/` if captured). Acceptable: sub-pixel anti-aliasing. Not acceptable: layout shift, missing effects, color changes.

- [ ] **Step 7: Criterion 7 — UK/EN parity**
  Spot-check that every page with an EN mirror renders identically modulo translated text:
  - `/about` vs `/en/about`
  - `/portfolio/<slug>` vs `/en/portfolio/<slug>`
  - `/process`, `/pricing`, `/blog`, `/contacts`

- [ ] **Step 8: Final commit (only if any cleanup needed)**
  If Steps 1–7 surfaced any missed item, fix it. Commit message: `refactor(styles): final success-criteria verification + cleanup`.

- [ ] **Step 9: Update the PR description**
  Open the PR (or new PR if branch was merged and we're on a fresh branch). Check off each completed criterion in the test plan. Note Phase 1 is complete and Phase 2 (mobile-first inversion) is the next planned spec.

---

# After this plan

Phase 1 of the style-system refactor is complete. The next planned work:

1. **Phase 2 brainstorm** — mobile-first inversion. Re-introduce responsive scaling in primitives (`<Container>` becomes `px-4 md:px-8 lg:px-12` instead of fixed `px-12`). Audit `hero-effects.css` for desktop assumptions. Add explicit viewport meta. Touch-target audit. Should produce its own spec + plan + sessions.

2. **`<Btn>` API polish** — once Phase 2 lands and the primitive's responsive behavior is settled, consider whether `<Btn>` should support `asChild` slot pattern (like Radix UI) so `<Link>` consumers can use `<Btn>` directly without the `btnClass()` helper escape hatch.

3. **Heading sizes consolidation** — if Phase C reveals more than four variant categories (`default`, `hp`, `case`, `page-hero`), expand the `<Heading>` `sizes` table. Track all heading variants encountered in `MANUAL-VERIFICATION.md` and roll into a Phase 2 sub-task.
