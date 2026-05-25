# Phase 3 Design Spec — Color tokens, touch-target audit, HeroUI review

**Date:** 2026-05-25
**Status:** Approved
**Parent spec:** [2026-05-24-style-system-unification-design.md](2026-05-24-style-system-unification-design.md) §10 (Phase 2 preview); [2026-05-25-phase-2-mobile-first-design.md](2026-05-25-phase-2-mobile-first-design.md) §11

## 1. Goal

Three combined sub-projects:

- **Sub-project A — Color-token migration**: Migrate every `var(--bg)` / `var(--ink)` / `var(--accent)` / `var(--line)` / `var(--container-*)` / legacy alias consumer reference to the canonical `@theme` names (`var(--color-*)`). Delete the `:root` compat shim from `globals.css`.
- **Sub-project B — Touch-target audit + fix**: Verify every interactive element meets the 44×44px touch-target minimum (WCAG 2.5.5 / Apple HIG / Material Design). Fix anything below threshold.
- **Sub-project C — HeroUI verification + fix**: Spot-check each HeroUI consumer (Drawer, Accordion, Input/Textarea/Select) renders correctly at mobile + desktop and the dark theme is intact. Fix anything broken.

## 2. Non-goals

- Visual redesign (Phase 3 must produce pixel-identical output at all viewports unless a touch-target fix forces a layout change, which is a documented exception).
- Replacing HeroUI with another component library.
- Adding new colors, animations, or breakpoints.
- Reorganizing primitives or breaking any public-API surface.

## 3. Architecture decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Full deletion of `:root` color shim | Single source of truth. The shim was a Phase 1 punt; Phase 3 finishes the migration. |
| 2 | Mechanical name-mapping per the table below | No design judgement needed per consumer; same as Phase 2's `var(--gutter-x)` migration approach. |
| 3 | Touch-target minimum: 44×44px | WCAG 2.5.5 AAA recommendation. Apple HIG = 44pt; Material Design = 48dp. 44 is the widely-adopted floor. |
| 4 | HeroUI verification = visual spot-check + classNames-prop fixes only | We're not patching HeroUI internals. If a behavior breaks that we can't fix via `classNames` or wrapper styles, document and defer. |

## 4. Color-token migration map

The complete name-mapping:

| Legacy `:root` var | Canonical `@theme` var |
|---|---|
| `--bg` | `--color-bg` |
| `--bg-subtle` | `--color-bg-subtle` |
| `--bg-raised` | `--color-bg-raised` |
| `--ink` | `--color-ink` |
| `--ink-2` (legacy alias) | `--color-ink-dim` |
| `--ink-3` | `--color-ink-3` |
| `--ink-muted` | `--color-ink-muted` |
| `--line` | `--color-line` |
| `--line-2` (legacy alias) | `--color-line-strong` |
| `--accent` | `--color-accent` |
| `--accent-soft` | `--color-accent-soft` |
| `--accent-deep` | `--color-accent-deep` |
| `--accent-2` | `--color-accent-2` |
| `--container-max` | `--container-max` (no rename — `@theme --container-*` uses the same name) |
| `--container-h1` | `--container-h1` |
| `--container-narrow` | `--container-narrow` |
| `--container-prose` | `--container-prose` |
| `--container-form` | `--container-form` |

Container tokens already share names — only the `:root` definitions get deleted; consumers stay.

Note: the Tailwind utility class names (`bg-bg`, `text-ink-dim`, `border-line-strong`) are unaffected — they're derived from `@theme` via `--color-*` tokens already. This migration is purely about consumer `var()` references in CSS / inline-style / arbitrary-value contexts.

## 5. Touch-target audit scope

Interactive elements to walk:

- **Buttons**: `<Btn>` primitive (primary/ghost variants), HeroUI Buttons in lead-form/calculator
- **Links**: nav links (`hp-header.tsx`, `hp-footer.tsx`), drawer links (`mobile-menu.tsx`), inline links inside prose (blog), `<a>`-rendered links via `btnClass()` helper
- **Form inputs**: HeroUI `Input`/`Textarea`/`Select` (lead-form), calculator checkboxes, calculator range sliders, calculator OptionCard
- **Triggers**: HeroUI Accordion (FAQ), HeroUI `<details>` (locale switcher), mobile-menu burger button
- **Custom interactive**: `OptionCard` in calculator, breadcrumb home-link

Minimum: 44×44px touch area at mobile viewport (≤sm:640px). Implementation usually means `min-h-11 min-w-11` (Tailwind `min-h-11` = 44px). Padding may need to increase to reach the threshold without changing visible appearance — use the `before:` content-extension trick where appropriate (`<a>` element with `relative` + `before:absolute before:inset-[-Npx] before:content-['']` to extend hit area beyond visible bounds).

Where a fix would force a visible layout change, document the exception and either:
- Accept the layout change (and re-verify visual parity at desktop) — preferred
- Skip the fix and document in `MANUAL-VERIFICATION.md` as a known a11y deviation (last resort)

## 6. HeroUI verification scope

Components to verify:

- **Drawer** (`mobile-menu.tsx`): backdrop click-to-close (Issue 5 hotfix), panel slide-in, stagger animations, dark theme on items
- **Accordion** (FAQ blocks): expand/collapse animation, indicator rotate, title typography, content prose
- **Input/Textarea/Select** (lead-form, calculator): focus ring, error state, placeholder, dark-theme background, dropdown popover styling
- **useDisclosure** (mobile-menu): open/close state propagation

Verification = render at 1440/800/640 mobile and confirm:
- Visual rendering matches Phase 2 baseline
- Interactive behavior works (click, focus, escape, click-outside)
- Dark theme applied (no white flashes, no incorrect default contrast)

Fix anything broken via `classNames` prop. Don't patch HeroUI internals.

## 7. Session structure

7 sessions total. Each produces a clean commit/push checkpoint.

| # | Scope | Effort | Risk |
|---|---|---|---|
| 1 | Color migration foundation: build mapping table, sweep CSS files (`globals.css`, `vendor.css`, `keyframes.css`, `blog.css`, `hero-effects.css`) | ~1 h | Low |
| 2 | Color migration JSX batch 1: blocks + primitives | ~2 h | Low |
| 3 | Color migration JSX batch 2: pages + homepage + layout | ~2 h | Low |
| 4 | Color migration JSX batch 3: hero + calculator + final cleanup | ~1.5 h | Med (hero has dense `var()` usage) |
| 5 | Delete `:root` color block + final verification + grep audit | ~30 min | Low (predicated on Sessions 1-4 leaving zero consumers) |
| 6 | Touch-target audit + fix | ~2 h | Med (may surface 10-20 fixes; each requires visual eyeball) |
| 7 | HeroUI verification + fix | ~1.5 h | Med (may surface dark-theme glitches not caught by build/lint) |

## 8. Success criteria

1. `:root` block in `src/app/globals.css` is GONE (only `@theme`, `html/body` rules, and `@layer utilities` remain).
2. Zero consumer references to the 13 legacy `var(--bg)` / `var(--ink)` / etc. names (per the mapping table) anywhere in `src/`.
3. `npm run typecheck && npm run lint && npm run build` all pass.
4. Every interactive element (per §5 list) has ≥44×44px touch area at mobile viewport — verified by reading utility classes (`min-h-11 min-w-11` or equivalent).
5. HeroUI components render correctly at 1440/800/640px viewports; interactive behavior works; dark theme is intact.
6. Visual parity preserved (sub-pixel anti-aliasing differences acceptable; layout shifts not).

## 9. Out of scope (potential Phase 4)

- Theming / multi-theme support (light theme, white-label)
- Component library swap (replace HeroUI)
- New accessibility features (focus management for SPA navigation, ARIA-live for form errors, keyboard shortcuts)
- Performance optimization (CSS bundle audit, critical-CSS extraction)
- Visual redesign

## 10. Risks

- **Hero block density**: hero has the most `var()` color references. Session 4 should isolate hero in its own commit.
- **HeroUI internal collisions**: a HeroUI breaking change in a patch release could surface during Session 7. We treat that as an upstream-bug report, not a Phase 3 fix.
- **Container tokens**: `--container-*` names happen to be identical in `:root` and `@theme`. The `:root` deletion in Session 5 must verify no consumer references stop resolving (they shouldn't, because `@theme` exposes the same names).
- **Touch-target conflicts**: some interactive elements live inside dense layouts (table cells, marquee items, calculator nested controls) where adding 44px hit areas may visually break the layout. Document exceptions per §5.
