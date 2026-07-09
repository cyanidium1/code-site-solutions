# Drop HeroUI + split heavy styles off Tailwind — design

**Date:** 2026-07-08 · **Goal:** cut the render-blocking main stylesheet
(307 KB raw / 44.8 KB gzip) without visual or accessibility regressions.
Two independent levers, one PR each.

## Measured baseline (2026-07-08, master @ b5ec369)

- Main CSS chunk: **307,412 B raw / 44,704 B gzip** (`.next/static/css/498f4bf5b52b01ec.css`).
- HeroUI-attributed rules (referencing `--heroui` vars): **~60 KB raw**, incl.
  the 4.5 KB `.light` + 4.2 KB `.dark` theme blocks.
- Homepage `/en` coverage (postcss selector-match vs SSR HTML): page needs
  ~70 KB raw (~13 KB gzip); **227.6 KB raw is unused by the homepage** — top
  offenders are our ~470–830 B arbitrary-value gradient/shadow/mask utilities
  and HeroUI theme/slider rules.
- HeroUI imports survive in exactly 7 files (providers, lead-form,
  calculator/LeadForm, lead-modal/dialog, about/team-section,
  layout/mobile-menu-drawer, portfolio-filters). All are behind lazy
  boundaries except `providers.tsx`.
- `framer-motion` has **zero** imports in src — it exists only as a
  `@heroui/react` peer dep and goes away with it.
- **Zero** `dark:` Tailwind variants in src; site is pinned dark
  (`next-themes` `defaultTheme="dark" enableSystem={false}`), so
  `darkMode: "class"` in `tailwind.config.ts` protects nothing.

## Lever A — remove HeroUI, ship our own primitives

### New primitives (in `src/components/ui/`, exported from `index.ts`)

All dark-theme styled with existing `var(--color-…)` tokens / Tailwind token
utilities; no new dependencies. Styling defaults reproduce the current HeroUI
slot-class treatments so call sites shed their `!important` + `data-[…]` hacks.

1. **`Field.tsx` — `Input` + `Textarea`.** Native `<input>`/`<textarea>` in a
   label/wrapper/description/error shell. Props: `label`, `isRequired`,
   `description`, `errorMessage`, `isInvalid`, `classNames`
   (`{label, wrapper, input, description, error}`) + native attributes —
   formik's `{...field}` spread works untouched. `useId()` wires
   `htmlFor`/`aria-describedby`/`aria-invalid`; error text has the alert
   styling and is referenced from the control. Focus styling via
   `focus-within:` on the wrapper (replaces HeroUI's `data-[focus=true]`);
   invalid via `aria-invalid`-driven variants. `minRows` → `rows` on textarea.

2. **`Select.tsx` — APG select-only combobox** (the expensive one).
   API: `{ label, placeholder, options: {key,label}[], value, onChange(v),
   disallowEmptySelection?, description?, errorMessage?, isInvalid?,
   classNames? }` — call sites migrate from `selectedKeys`/`onSelectionChange`
   + `<SelectItem>` children to an options array (all current usage is
   single-select).
   - Trigger: `<button role="combobox" aria-haspopup="listbox" aria-expanded
     aria-controls aria-activedescendant aria-labelledby>`. DOM focus stays on
     the trigger (APG-recommended activedescendant pattern) — this also keeps
     `<dialog>` focus containment trivial.
   - Popup: absolutely-positioned `role="listbox"` under the trigger (no
     portal), `max-h` + overflow scroll, options `role="option"
     aria-selected`, mount/unmount with a `@starting-style` fade.
   - Keyboard: Down/Up/Enter/Space open; open state: Down/Up move active
     option, Home/End jump, Enter/Space select+close, Esc closes
     (stopPropagation so a containing dialog stays open), Tab closes,
     printable-character typeahead (500 ms buffer). Active option
     `scrollIntoView({block:"nearest"})`.
   - Pointer: hover sets active, click selects, outside `pointerdown` closes.
   - Non-portal risk: inside the lead modal (`overflow:auto` body) a long
     listbox extends the modal's scroll area instead of floating above it.
     Accepted for v1; verified in preview.

3. **`Dialog.tsx` — `Modal` + `Drawer` on native `<dialog>`.**
   Shared `useDialogSync(ref, isOpen, onOpenChange)` hook: `showModal()`/
   `close()` sync, native `close`/`cancel` events → `onOpenChange(false)`,
   backdrop click (`event.target === dialog`) closes, exit animation via a
   `data-closing` attribute + transition-end/timeout before `close()`.
   - Native `<dialog>` gives focus trap, Esc, top-layer, and focus return for
     free; `::backdrop` styled with the `backdrop:` variant (blur + dim).
   - Scroll lock: `html:has(dialog:modal){overflow:hidden}` in globals.css.
   - `Modal`: sizes `lg`(512px)/`2xl`(672px), center placement,
     `scrollBehavior: inside` (body slot scrolls), built-in close button
     (lucide `X` — kills the `fill-current` hack), `ModalHeader/Body/Footer`
     as styled slot divs. Entry: fade+scale (`@starting-style`),
     `motion-reduce:` disables.
   - `Drawer`: right slide-over panel, `max-w-[420px] w-screen`, full height,
     entry/exit translate-X, `hideCloseButton` (mobile menu keeps its own).

4. **`Btn` (existing) gains `isLoading`** (spinner + `disabled` +
   `aria-busy`) — no separate Button primitive; team-section and lead-form
   buttons become `Btn`/native buttons with their current visual classes.

### Call-site migrations (7 files)

Keep formik/yup; keep each form's visual identity via `classNames` overrides
(now plain CSS-state variants, no `!`). `useDisclosure` → `useState`.
Render-prop `ModalContent`/`DrawerContent` children flatten into plain JSX;
`close` callbacks become `onOpenChange(false)`/`onClose`.

### Removals once HeroUI is gone

- `HeroUIProvider` from `providers.tsx` (NextThemes/Consent/LeadModal stay).
- `tailwind.config.ts` **deleted** (only held the heroui plugin, `.heroui-tw`
  glob + guard, and no-op `darkMode`); `@config` line dropped from
  `globals.css` — Tailwind v4 Oxide auto-detection takes over content
  scanning (verify built CSS parity).
- `@source inline("fill-current")` dropped from `globals.css`.
- `tools/sync-heroui-tw-sources.mjs`, `predev`/`prebuild` hooks, `.heroui-tw/`
  (+ its `.gitignore` entry).
- `package.json`: `@heroui/react`, `@heroui/system`, `@heroui/theme`,
  `framer-motion`.

**Expected win:** ~60 KB raw HeroUI CSS out of the main sheet (~11.5 KB gzip)
plus the HeroUI/framer-motion JS out of the lazy chunks.

## Lever B — move heavy arbitrary-value utilities to CSS modules

Tailwind v4 emits one root stylesheet, so every route ships every page's
giant `bg-[radial-gradient(…oklch(from var(--color-accent))…)]` utilities.
Moving those class strings out of scanned sources stops Tailwind emitting
them; a component-scoped `*.module.css` then rides Next's per-route CSS
code-splitting instead of the homepage's critical path.

- **Scope: only the big/specialized offenders on off-homepage components** —
  the ~470–830 B gradient/mask/shadow arbitrary values in `blocks/*`,
  `about/sections`, `case-page/*`, `calculator/*` (incl. slider-thumb shadow
  stacks), `portfolio/*`, `vs-wordpress`. NOT a wholesale migration; ordinary
  utilities stay Tailwind.
- Homepage components (`homepage/*`) keep theirs — a module there still loads
  with the homepage and buys nothing for its critical path.
- Files already touched by Lever A (lead-form, calculator/LeadForm,
  team-section, mobile-menu-drawer) are excluded to keep the PRs
  conflict-free; their few gradients are small.
- Pattern per component: `<name>.module.css` with a semantic class
  (`.bgGlow`, `.thumbShadow`…) referencing the same `var(--color-…)` tokens;
  `hover:`/`after:` variants become `:hover`/`::after` rules. Visuals must be
  byte-identical (same computed values).
- Cascade note: CSS-module rules are unlayered and therefore beat
  `@layer utilities` — same winner as today where the arbitrary utility was
  the only background/shadow declaration; no specificity hacks needed.

**Expected win:** measured by re-running the coverage script; ceiling ~30 KB
gzip off the homepage-shipped sheet (most of the 227 KB unused raw tail).

## Verification (both levers)

`npm run typecheck`; `npm run build` + gzip main CSS; coverage script
(scratchpad `css-coverage.mjs`) before/after; preview-browser pass: lead form
(page + modal), calculator form, portfolio filters, team bio modal, mobile
menu drawer — keyboard nav, focus trap/return, Esc/overlay dismiss, console
clean, CLS ~0; `npm run perf:local` directional check. Results →
`docs/perf-log.md` + auto-memory.

## PR structure

- PR 1 (`perf/drop-heroui`): Lever A + this spec/plan docs.
- PR 2 (`perf/split-heavy-css`): Lever B, branched from master, independent.
- No merges/deploys without explicit user approval.
