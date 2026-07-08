# Drop HeroUI + Split Heavy CSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the render-blocking main stylesheet (307 KB raw / 44.8 KB gzip) by removing HeroUI in favour of in-house primitives (Lever A, own PR) and moving giant route-specific arbitrary-value utilities into per-component CSS modules (Lever B, own PR).

**Architecture:** Lever A adds four primitive modules to `src/components/ui/` (Field, Select, Dialog, Btn.isLoading) styled with existing tokens, migrates the 7 HeroUI consumer files, then deletes the HeroUI toolchain (provider, tailwind.config.ts, sync script, deps). Lever B creates `*.module.css` files next to off-homepage components and swaps the giant `bg-[…gradient…]`/shadow/mask utilities for semantic module classes so Next code-splits them per route.

**Tech Stack:** Next.js 15, React 19, Tailwind v4 (Oxide auto-detection after A), native `<dialog>`, CSS modules. No new dependencies.

**Verification per repo pattern (no component test infra):** `npm run typecheck`, `npm run build` + gzip measurement, scratchpad `css-coverage.mjs`, preview-browser a11y pass. Spec: `docs/superpowers/specs/2026-07-08-drop-heroui-and-split-css-design.md`.

---

## Lever A — branch `perf/drop-heroui` off master

### Task A1: Field primitive (Input + Textarea)

**Files:** Create `src/components/ui/Field.tsx`; modify `src/components/ui/index.ts`.

- [ ] Implement `Input` and `Textarea` sharing a `FieldShell` (label / wrapper / description / error). Props: `label`, `isRequired`, `description`, `errorMessage`, `isInvalid`, `classNames?: {label,wrapper,input,description,error}`, plus spread native attrs (formik `{...field}` compatible). `useId()` for `htmlFor` + `aria-describedby`; `aria-invalid` on the control; `aria-live="polite"` error line. Default classes reproduce the lead-form treatment: wrapper `border border-line-strong bg-[oklch(0.16_0.005_300/0.7)] rounded-xl focus-within:border-accent-soft hover:border-ink-3 …`; required star via `after:` on label. `minRows` → `rows` for Textarea.
- [ ] Export from `index.ts`; `npm run typecheck` passes.

### Task A2: Select primitive (APG select-only combobox)

**Files:** Create `src/components/ui/Select.tsx`; modify `src/components/ui/index.ts`.

- [ ] API: `{label, placeholder, options: {key,label}[], value, onChange(v), disallowEmptySelection?, description?, errorMessage?, isInvalid?, classNames?}`. Trigger `<button type="button" role="combobox" aria-haspopup="listbox" aria-expanded aria-controls aria-activedescendant aria-labelledby>`; DOM focus stays on trigger. Listbox: absolutely positioned div `role="listbox"`, options `role="option" aria-selected id={id}-opt-{key}`, `max-h-64 overflow-auto z-50`, `@starting-style` fade-in.
- [ ] Keyboard: closed — Down/Up/Enter/Space open (Down also moves active to first/selected); open — Down/Up move active, Home/End jump, Enter/Space select+close, Esc close + `stopPropagation` (containing `<dialog>` must stay open), Tab close, printable chars typeahead with 500 ms buffer. Active option `scrollIntoView({block:"nearest"})`.
- [ ] Pointer: option mouse-enter sets active, click selects+closes, outside `pointerdown` closes. Chevron (lucide `ChevronDown`) rotates on open.
- [ ] Styling defaults reproduce `SELECT_TRIGGER_CLASS`/`SELECT_POPOVER_CLASS`/`SELECT_ITEM_CLASS` from `blocks/lead-form/index.tsx:82-110` minus `!`/`data-[…]` hacks (use `aria-expanded:`, `aria-selected:`, active-tracking data attr `data-active`). Typecheck passes.

### Task A3: Dialog primitives (Modal + Drawer on native `<dialog>`)

**Files:** Create `src/components/ui/Dialog.tsx`; modify `src/components/ui/index.ts`, `src/app/globals.css`.

- [ ] `useDialogSync(ref, isOpen, onOpenChange)`: `showModal()` when `isOpen`, guarded `close()`; native `close` event → `onOpenChange(false)`; backdrop click (`e.target === dialog`) → close; exit: set `data-closing`, `close()` after transition-end with 250 ms timeout fallback (reduced-motion safe).
- [ ] `Modal` (`size: "lg" | "2xl"` → `max-w-[512px]`/`max-w-[672px]`, centered, inner scroll) with `ModalHeader/ModalBody/ModalFooter` slot divs and built-in close button (lucide `X`, `aria-label`), `hideCloseButton?`, `classNames?: {base, backdrop-ish via base, header, body, footer, closeButton}`. Entry fade+scale via `@starting-style`; `backdrop:` blur+dim; `motion-reduce:transition-none`.
- [ ] `Drawer`: right slide-over `h-dvh max-w-[420px] w-screen ms-auto me-0 rounded-none`, translate-X entry/exit, `hideCloseButton` default true.
- [ ] `globals.css`: add `html:has(dialog:modal){overflow:hidden}` scroll lock.
- [ ] Typecheck passes.

### Task A4: `Btn` gains `isLoading`

**Files:** Modify `src/components/ui/Btn.tsx`.

- [ ] `isLoading?: boolean` → `disabled`, `aria-busy`, spinner span (border-based `animate-spin` circle) before children. Typecheck passes; commit A1–A4 as "feat(ui): own Field/Select/Modal/Drawer primitives".

### Task A5: migrate the 5 lazy consumers

**Files:** Modify `src/components/blocks/lead-form/index.tsx`, `src/components/calculator/LeadForm.tsx`, `src/components/blocks/lead-modal/dialog.tsx`, `src/components/about/team-section.tsx`, `src/components/layout/mobile-menu-drawer.tsx`, `src/components/portfolio-filters/index.tsx`.

- [ ] lead-form: `Input/Textarea` keep `{...field}` spreads; three `Select`s pass `options={…}` + `value/onChange`; submit → `Btn` (or native button) with `isLoading`; slot-class constants slim down (drop `!` and `data-[…]`).
- [ ] calculator LeadForm: same; `disallowEmptySelection` on method select.
- [ ] lead-modal dialog: `Modal` + `ModalHeader/ModalBody`; keep remount-per-open `key`.
- [ ] team-section: `useDisclosure` → `useState`; `Modal size="2xl"` + Footer close `Btn`; render-prop flattens.
- [ ] mobile-menu-drawer: `Drawer`; render-prop `close` → `onClose` prop calls.
- [ ] portfolio-filters: `Select` with options array.
- [ ] `npm run typecheck` passes; commit "refactor: migrate HeroUI consumers to own primitives".

### Task A6: excise the HeroUI toolchain

**Files:** Modify `src/app/providers.tsx`, `src/app/globals.css`, `package.json`, `.gitignore`; delete `tailwind.config.ts`, `tools/sync-heroui-tw-sources.mjs`, `.heroui-tw/`.

- [ ] Remove `HeroUIProvider` from providers.tsx.
- [ ] globals.css: drop `@config "../../tailwind.config.ts"` and `@source inline("fill-current")`.
- [ ] Delete `tailwind.config.ts` + sync script; remove `predev`/`prebuild` from package.json; drop `.heroui-tw` from `.gitignore`.
- [ ] `npm uninstall @heroui/react @heroui/system @heroui/theme framer-motion`.
- [ ] Grep guard: `grep -r "@heroui\|framer-motion\|heroui" src tools package.json` → only comments allowed; clean them.
- [ ] `npm run build` succeeds; note new main-CSS raw/gzip; commit "perf: remove HeroUI toolchain (config, sync script, deps)".

### Task A7: verify Lever A

- [ ] Preview pass (preview_* tools): contacts lead form (labels, focus styles, select keyboard nav, invalid state, submit spinner), lead modal (open/Esc/overlay/focus return), calculator form, portfolio filters, about team modal, mobile menu drawer (slide-in, stagger, route-change close). Console free of a11y/hydration errors; CLS ~0.
- [ ] Measure: main CSS raw/gzip delta vs 307,412/44,704; coverage re-run; homepage First Load JS unchanged-or-better.
- [ ] Update `docs/perf-log.md`; push branch, open PR (no merge).

## Lever B — branch `perf/split-heavy-css` off master

### Task B1: inventory freeze + module pattern

**Files:** Create `<component>.module.css` beside each target; modify the component `.tsx`.

Targets (off-homepage; Lever-A files excluded): `blocks/hero`, `about/sections`, `blocks/value-stack`, `blocks/outcome` (+`mocks`), `blocks/services` (+`feature-card`), `blocks/case` (+`case-shot`), `blocks/comparison` (+`tier`), `blocks/contact-split`, `blocks/reasons`, `blocks/turnkey-list`, `blocks/final/faq`, `blocks/final/audit`, `blocks/cta-banner`, `blocks/related-card`, `blocks/page-hero`, `blocks/image-text`, `blocks/launch-cta`, `blocks/team-cards`, `case-page/case-page-hero`, `calculator/{WebsiteCalculator,CalculatorControls,MobileEstimateBar,EstimateSummary}` (incl. slider-thumb shadow stacks), `portfolio/efedra-case-gallery`, `vs-wordpress`, `app/(uk)/stories/image-text/page`.

- [ ] Per component: move each ≥~300 B arbitrary-value utility (gradient/mask/shadow, incl. `hover:`/`after:` forms) into `<name>.module.css` as a semantic class using the same `var(--color-…)`/`oklch(from …)` values; swap into `className` via `styles.x` (keep surrounding ordinary utilities). Underscores in arbitrary values become spaces in real CSS.
- [ ] Commit in route-sized batches (blocks, about+case, calculator, misc) with typecheck green each time.

### Task B2: measure + verify Lever B

- [ ] `npm run build`: main CSS raw/gzip delta; confirm new per-route CSS chunks appear and homepage `/en` HTML references no new blocking CSS link (module CSS for lazy/off-route components must not land in the homepage chunks).
- [ ] Coverage script re-run on `/en`: unused-by-page bytes should drop by roughly the moved volume; visual spot-check about/portfolio/calculator/industry/blog pages in preview (gradients identical).
- [ ] `npm run perf:local` directional; update `docs/perf-log.md`; push branch, open PR (no merge).

## Wrap-up

- [ ] Update auto-memory (`project_pagespeed_refactor_2026` + new/updated entries: HeroUI gone, tailwind.config deleted, sync-script memory obsolete).
- [ ] Present measured before/after CSS/JS deltas; timestamps.md `finished` line.
