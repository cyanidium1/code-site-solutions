# ClassName Slimming Implementation Plan (RSC payload round)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut 40–60 KB raw off the `/en` document (480.3 KB, of which 194 KB = Tailwind class strings paid twice via HTML + RSC flight) by converting the heaviest *repeated* class stacks into semantic classes, reducing hydration eval (the ~2.7 s `/en` bootup-time line).

**Report:** `docs/rsc-payload-report.md`. **Branch:** `perf/slim-classnames`. **Success metric:** document raw −40 KB+ AND a visible dent in `/en` bootup-time; rollback if bootup doesn't move.

**Architecture — where the CSS goes (decision matrix):**

| Component renders on | CSS home | Why |
|---|---|---|
| the homepage (this round's targets) | semantic classes in a `homepage-cards.css` **imported into `globals.css`** (same pattern as `keyframes.css`) | the homepage always loads the main sheet, which is *cached across views*; a hoisted `<style>` would itself ship twice per document — strictly worse for homepage styles |
| off-homepage routes only | hoisted `<style href precedence>` | PR #30 pattern; keeps main sheet lean |

**Guardrails (this is NOT a Tailwind migration):**
- Convert only stacks meeting the threshold: **≥600 B × ≥3 instances**, or ≥1 KB × ≥2. Singleton stacks stay Tailwind (no multiplier → no win).
- Byte-identical computed styles: same values, same custom breakpoints (`sm` 640 / `md` 700 / `lg` 800 / `xl` 1100 / `2xl` 1440 / `min-[1081px]` as written), `hover:`/`before:`/variants become real CSS.
- Semantic class names `hp-*` (homepage) with the remaining per-instance utilities kept inline.
- Watch cascade: the new classes are unlayered (beat `@layer utilities`); any sibling utility that must override a converted property must be folded into the CSS, not left to lose the cascade.

---

### Task 1: Audit — rank stacks by length × instances, freeze targets

**Files:** Create `tools/perf/classname-audit.mjs` (promoted from session scratchpad; also promote `flight-analyze.mjs` for before/after).

- [ ] Script: fetch served `/en` (and `/` for parity), extract `class="…"` attributes, group identical values, output `bytes × count = total` ranked table; same for flight `"className"` props.
- [ ] Record the baseline triple in the plan/PR: document raw 480.3 KB; flight 216.8 KB; className bytes 194 KB (903 attrs / 586 props).
- [ ] Freeze the target list: every group ≥600 B × ≥3 (expected: `homepage/business-value.tsx` biz-card ~1.4 KB×6, `blocks/value-stack` vs-card ~1.2 KB×3, bento/industries/process card stacks, hero feature rows). Commit the audit script.

### Task 2: Wave 1 — `business-value.tsx` end-to-end (proves the pattern)

**Files:** Create `src/app/homepage-cards.css` (imported from `globals.css` next to `keyframes.css`); modify `src/components/homepage/business-value.tsx`.

- [ ] Move the `group/biz-card` 1.4 KB stack into `.hp-biz-card { … }` + media queries; keep `group/biz-card` marker class inline (group-hover targets stay Tailwind).
- [ ] `npm run typecheck`; build; verify with browser computed-style diff (all six cards byte-identical style values, hover behavior intact).
- [ ] Measure the doc delta for this one component (expected ≈ −15 KB raw) — this validates the projection before spending the rest of the effort. Commit.

### Task 3: Wave 2 — remaining frozen targets

**Files:** Modify each target component; extend `homepage-cards.css`.

- [ ] Convert the rest of the frozen list from Task 1, one commit per component or logical group, typecheck green each step.
- [ ] For any target that turns out to be off-homepage-only, use the hoisted-style pattern instead (decision matrix above).

### Task 4: Measure, verify, ship

- [ ] Re-run `classname-audit.mjs` + `flight-analyze.mjs`: document raw, flight size, className share — table vs baseline.
- [ ] `npm run build`: main CSS raw/gzip growth (budget: +≤10 KB raw / +≤1.5 KB gzip — the moved stacks are gzip-friendly).
- [ ] Visual parity: preview screenshots + computed-style spot-checks of every converted section, desktop + mobile; console clean.
- [ ] Local Lighthouse 3-run: bootup-time `/en` line vs ~2,693 ms baseline; overall score/LCP/TBT sanity.
- [ ] Update `docs/rsc-payload-report.md` (results section) + `docs/perf-log.md`; push branch, open PR — **no merge without approval**.
