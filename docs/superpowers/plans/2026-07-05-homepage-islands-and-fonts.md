# Homepage Islands & Font Trim Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the HeroUI/react-aria/framer-motion/formik/yup vendor chunk (149 KB transfer, 70% unused) from the homepage critical path and cut font bytes/preloads, attacking the measured LCP bottleneck: 1,050 ms of element render delay caused by main-thread hydration.

**Architecture:** Three "islands": (1) the FAQ accordion is rewritten on native `<details>/<summary>` — zero JS, better SEO (answers land in SSR HTML), HeroUI gone from that block entirely; (2) the mobile-menu Drawer and (3) the lead-modal Modal + LeadForm (which drags formik+yup along) become `next/dynamic` chunks mounted on first interaction, so their JS never loads unless the user opens them. Fonts switch Manrope and JetBrains Mono to Google's variable files (2 files instead of ~8 static weight files) and drop the never-rendered Actay BoldItalic. Every task re-measures with the Task-1 tooling from the previous plan.

**Tech Stack:** Next.js 15.5.20 (App Router), HeroUI (being removed from these paths), Tailwind v4, next/font, Lighthouse runner (`npm run perf:local` / `perf:prod`).

**Measured context (2026-07-05, production /en):**
| Fact | Value |
|---|---|
| Mobile LCP subparts | TTFB 180 ms, load delay 269 ms, load 108 ms, **render delay 1,053 ms** |
| Chunk `5400` (HeroUI+react-aria+framer-motion+formik+yup) | 531 KB raw / 149 KB transfer, **105 KB unused** on homepage |
| Font preloads in `<head>` | 6 woff2 files |
| Main CSS | 306 KB raw / ~44 KB transfer (192 KB app utilities, 60 KB HeroUI, 44 KB theme vars, 6 KB property registrations) |
| Reference local median (previous round, "final (all tasks)") | score 53, LCP 6.1s, TBT 917ms, FCP 2.5s |

**CSS-weight decision (investigated, mostly parked — record, don't implement):**
- No unused HeroUI light theme exists in the built CSS (verified: no `:root,.light` block) — nothing to strip there.
- Per-route CSS splitting is not achievable: Tailwind v4 emits one stylesheet for all sources, imported at the root layout. This is architectural.
- The 2026-05-25 CSS audit's remaining micro-items are worth ~3–6 KB raw (<1 KB gz) — poor ROI, skipped (YAGNI).
- The only big CSS lever left is dropping HeroUI entirely (~60 KB raw): after this plan, HeroUI remains only in LeadForm inputs, Drawer, Modal, portfolio Select, about Modal, and the provider — all off the homepage critical path. Full removal is a future project, out of scope here.
- This plan's CSS reduction comes from the fonts chunk only (fewer `@font-face` rows).

**Known constraints (carried from the previous plan):**
- Build ONLY via `npm run build` (tailwind.config.ts guard throws without the `.heroui-tw` prebuild sync).
- After stopping a server, verify port 3000 is free (`netstat -ano | grep :3000`); `taskkill //PID <pid> //F` holdouts — Windows children survive shell kills.
- Lighthouse prints EPERM cleanup noise on Windows; the runner tolerates it.
- ESLint forbids raw `<img>` and direct `next/image`; not touched here but don't introduce them.
- Minimal diffs; run `npm run typecheck` when touching TS; 50 tests must stay green (`npm test`).

**Working directory:** `C:\GitHub23\code-site-workspace\Frontend` (branch off `master`).

---

### Task 0: Branch

- [ ] **Step 1:**

```bash
git checkout master && git pull && git checkout -b perf/homepage-islands
```

Expected: clean tree on new branch.

---

### Task 1: Baseline — homepage JS graph before changes

**Files:**
- Modify: `docs/perf-log.md` (append rows)

- [ ] **Step 1: Build and capture First Load JS**

```bash
npm run build 2>&1 | tail -60
```
Record First Load JS for `/`, `/en`, `/contacts`, `/en/contacts` and the shared-chunks line.

- [ ] **Step 2: Capture which script chunks the homepage document loads**

```bash
npm run start   # background
curl -s http://localhost:3000/en -o /tmp/en-base.html
node -e "
const html=require('fs').readFileSync('/tmp/en-base.html','utf8');
const srcs=[...html.matchAll(/<script[^>]*src=\"([^\"]+)\"/g)].map(m=>m[1]);
console.log(srcs.join('\n')); console.log('script count:', srcs.length);
"
```
Save the list (note especially any chunk in the 100+ KB class — the current build's equivalent of `5400-*.js`; identify it by size: `ls -la .next/static/chunks | sort -k5 -n | tail -8`). Stop the server; verify port free.

- [ ] **Step 3: Append a baseline row to docs/perf-log.md**

Add: `| 2026-07-05 | local | islands baseline (pre-changes): homepage loads N scripts incl <bigchunk> (X KB) | — | — | — | — | — |` with real values.

- [ ] **Step 4: Commit**

```bash
git add docs/perf-log.md
git commit -m "perf: record homepage JS-graph baseline before islands work"
```

---

### Task 2: FAQ — replace HeroUI Accordion with native `<details>/<summary>`

The FAQ is client-only for one reason (the show-more toggle); the accordion behavior itself is free from the platform. Native `<details>` also puts the answers into SSR HTML (they currently hydrate in), an SEO win. Modern browsers animate it via `interpolate-size`/`::details-content`; older ones get an instant toggle — acceptable, the current spring animation is subtle.

**Files:**
- Modify: `src/components/blocks/final/faq.tsx` (rewrite the render; keep data/props/API identical)

- [ ] **Step 1: Rewrite faq.tsx**

Keep everything from line 1 through the `FAQ_BG` constant (imports minus HeroUI, `FAQ_INITIAL_VISIBLE`, `DEFAULT_FAQ_UK`, `FAQ_BG`) but: delete the `import { Accordion, AccordionItem } from "@heroui/react";` line and the whole `FAQ_MOTION_PROPS` constant. Replace the class constants and the JSX from `FAQ_ITEM` down with:

```tsx
// Native <details> accordion. Open-state styling uses Tailwind's `open:`
// variant (matches details[open]) and `group-open/faq:` on descendants.
// Animation: `interpolate-size` + ::details-content transition — Chromium
// 131+/Safari 18.2+ animate the expand; older browsers toggle instantly.
const FAQ_ITEM =
  "group/faq border border-line rounded-[14px] bg-[oklch(0.16_0.005_300)] overflow-hidden transition-[border-color] duration-200 open:border-line-strong " +
  "[interpolate-size:allow-keywords] " +
  "[&::details-content]:[transition:height_250ms_ease,content-visibility_250ms_allow-discrete] [&::details-content]:overflow-hidden [&::details-content]:h-0 open:[&::details-content]:h-auto";

const FAQ_ITEM_TRIGGER =
  "flex items-center justify-between gap-3 p-[18px] cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden md:py-[22px] md:px-6 md:gap-4";

const FAQ_ITEM_TITLE =
  "font-sans text-[13px] font-semibold text-ink leading-[1.35] md:text-[15px]";

const FAQ_ITEM_CONTENT =
  "px-[18px] pt-0 pb-[18px] text-[13px] leading-[1.65] text-ink-dim text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "[&_.rich-link]:text-accent-soft [&_.rich-link]:font-medium [&_.rich-link]:underline [&_.rich-link]:decoration-[oklch(0.7_0.14_295_/_0.4)] [&_.rich-link]:underline-offset-[3px] [&_.rich-link]:transition-[color,text-decoration-color] [&_.rich-link]:duration-200 [&_.rich-link:hover]:text-ink [&_.rich-link:hover]:decoration-ink " +
  "md:px-6 md:pb-[22px] md:text-[14px]";

// The +/× indicator pill. Sits inside <summary>; hover via the summary's
// group/trigger, open-state via the parent <details>' group/faq.
const FAQ_PLUS =
  "w-[26px] h-[26px] rounded-full border border-line-strong bg-transparent text-ink-dim " +
  "inline-flex items-center justify-center shrink-0 " +
  "transition-[background-color,color,border-color,transform] duration-[250ms] " +
  "group-hover/trigger:text-accent-soft group-hover/trigger:border-accent-40 " +
  "group-open/faq:bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] group-open/faq:border-transparent group-open/faq:text-[oklch(1_0_0_/_0.98)] " +
  "[&_svg]:w-[11px] [&_svg]:h-[11px] [&_svg]:transition-transform [&_svg]:duration-[250ms] group-open/faq:[&_svg]:rotate-45 " +
  "md:w-8 md:h-8 md:[&_svg]:w-[13px] md:[&_svg]:h-[13px]";
```

And the component below (props, locale resolution, `expanded` state, `hasOverflow`/`visible`/`toggleLabel`, the `<section>`, `FAQ_BG` div, `<H2>` and the show-more `<button>` block all stay EXACTLY as they are today) — only the `<Accordion>…</Accordion>` element is replaced by:

```tsx
        <div className="flex flex-col gap-3">
          {visible.map((it, i) => (
            <details key={i} className={FAQ_ITEM}>
              <summary className={`group/trigger ${FAQ_ITEM_TRIGGER}`}>
                <span className={FAQ_ITEM_TITLE}>{it.q}</span>
                <span className={FAQ_PLUS} aria-hidden="true">
                  <Plus size={13} strokeWidth={2.2} />
                </span>
              </summary>
              <div className={FAQ_ITEM_CONTENT}>{renderRich(it.a)}</div>
            </details>
          ))}
        </div>
```

Do NOT add a `name` attribute to the `<details>` elements — the current behavior is `selectionMode="multiple"` (several items open at once), and `name` would make them exclusive.

- [ ] **Step 2: Typecheck + tests**

```bash
npm run typecheck && npm test
```
Expected: clean, 50/50.

- [ ] **Step 3: Verify no @heroui import remains in faq.tsx**

```bash
grep -n "heroui" src/components/blocks/final/faq.tsx && echo "FAIL" || echo "OK"
```

- [ ] **Step 4: Visual + behavior check (Playwright, chromium is installed)**

`npm run build && npm run start`, then with a throwaway script in the OS temp dir against `http://localhost:3000/en`:
- FAQ section renders 5 `<details>` items; answers text IS present in the raw SSR HTML (`curl -s http://localhost:3000/en | grep -c "details"` ≥ 5 and one known answer substring is present — pick a phrase from the EN FAQ content on the page).
- Clicking a summary opens the item (details gains `open` attribute; content visible; plus pill gets the gradient class state).
- Multiple items can be open at once.
- "Show all N questions" button reveals the remaining items; "Show fewer" collapses the list.
- Mobile 375px viewport: item paddings look right (screenshot for the record).
Stop the server; verify port free.

- [ ] **Step 5: Commit**

```bash
git add src/components/blocks/final/faq.tsx
git commit -m "perf: FAQ on native details/summary — drops HeroUI Accordion from the homepage and puts answers in SSR HTML"
```

---

### Task 3: Mobile menu — lazy-load the Drawer on first tap

Split `mobile-menu.tsx`: the burger button (tiny, always rendered) stays; everything Drawer-related moves to a new file loaded via `next/dynamic` only after the first tap.

**Files:**
- Create: `src/components/layout/mobile-menu-drawer.tsx`
- Modify: `src/components/layout/mobile-menu.tsx`

- [ ] **Step 1: Create mobile-menu-drawer.tsx**

Move INTO the new file, unchanged: the `Drawer/DrawerContent/DrawerBody` + `lucide` (`ChevronRight`, `X`) + `next-intl` + nav-constant imports, `Logo`, `headerBrandClass`, `useI18nRegistry`, `NavWorkLabel`, ALL `drawer*Class` constants (lines 51–109 of the current file), the route-change-close `useEffect` + `openedAt` ref, the `navLinks`/stagger-index/`ctaHref`/`allServicesHref` computation, and the whole `<Drawer>…</Drawer>` JSX. The new file's shape:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { ChevronRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { localizePath, resolveServiceHref } from "@/constants/i18n-routes";
import { HEADER_NAV_LINKS, SERVICE_NAV_LINKS } from "@/constants/nav";
import Logo from "./logo/logo";
import { headerBrandClass } from "./header-classes";
import { useI18nRegistry } from "./i18n-registry-provider";
import { NavWorkLabel } from "./nav-work-label";

// [PASTE the drawerClassNames…drawerStaggerClass constants here verbatim
//  from the current mobile-menu.tsx lines 51–109, including their comments]

export function MobileMenuDrawer({
  isOpen,
  onOpenChange,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const locale = useLocale();
  const isEn = locale === "en";
  const t = useTranslations("Nav");
  const tServices = useTranslations("ServiceNav");

  // Close on route change — [move the openedAt ref + useEffect here verbatim]

  const registry = useI18nRegistry();
  // [move ctaHref / allServicesHref / navLinks / stagger indices here verbatim]

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="right"
      size="full"
      backdrop="blur"
      hideCloseButton
      classNames={drawerClassNames}
    >
      {/* [the existing DrawerContent render-prop JSX, verbatim] */}
    </Drawer>
  );
}
```

- [ ] **Step 2: Rewrite mobile-menu.tsx as the thin trigger**

```tsx
"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

// Drawer JS (HeroUI modal machinery) loads only after the first tap —
// it's never needed for first paint. ssr:false is safe: the drawer is
// closed (renders nothing user-visible) until opened.
const MobileMenuDrawer = dynamic(
  () => import("./mobile-menu-drawer").then((m) => m.MobileMenuDrawer),
  { ssr: false },
);

// [BurgerIcon + burger*Class constants stay here verbatim, lines 18–49]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // Once true, the drawer chunk stays mounted so close animations work.
  const [hasOpened, setHasOpened] = useState(false);
  const t = useTranslations("Nav");

  const openMenu = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        className={burgerBtnClass}
        aria-label={t("menuLabel")}
        aria-expanded={isOpen}
        onClick={openMenu}
      >
        <BurgerIcon open={isOpen} />
      </button>
      {hasOpened ? (
        <MobileMenuDrawer
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onClose={closeMenu}
        />
      ) : null}
    </>
  );
}
```

Note: `useDisclosure` from `@heroui/use-disclosure` is intentionally replaced by `useState` in this file so the trigger imports nothing from HeroUI. The `onClose` prop feeds the drawer's route-change effect.

- [ ] **Step 3: Typecheck + tests + no-heroui check on the trigger**

```bash
npm run typecheck && npm test
grep -n "heroui" src/components/layout/mobile-menu.tsx && echo "FAIL" || echo "OK"
```

- [ ] **Step 4: Behavior check (Playwright, 375px viewport, production build)**

`npm run build && npm run start`; verify on `http://localhost:3000/en`:
- Before tapping: no request for the drawer chunk (record network; the drawer chunk is identifiable as a new `_next/static/chunks/*.js` request that fires at tap time).
- Tap burger → drawer chunk loads → drawer opens (panel visible, backdrop blurred).
- Tap a nav link → navigates and the drawer closes.
- Re-open → close via X button works.
Stop server; port free.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/mobile-menu.tsx src/components/layout/mobile-menu-drawer.tsx
git commit -m "perf: lazy-load the mobile-menu drawer on first tap"
```

---

### Task 4: Lead modal — lazy-load Modal + LeadForm on first open

Same pattern. The context/provider/hook API stays identical (call sites don't change); only the dialog UI becomes a dynamic chunk. This also removes formik + yup + HeroUI Input/Select/Textarea from every page's first load (the /contacts page imports LeadForm directly and is unaffected).

**Files:**
- Create: `src/components/blocks/lead-modal/dialog.tsx`
- Modify: `src/components/blocks/lead-modal/index.tsx`

- [ ] **Step 1: Create dialog.tsx**

```tsx
"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { LeadForm } from "@/components/blocks/lead-form";
import type { LeadFormLocale } from "@/constants/form-options";
import type { OpenLeadModalOptions } from "./index";

const COPY: Record<LeadFormLocale, { title: string; sub: string }> = {
  uk: {
    title: "Залиште заявку",
    sub: "Відповідаємо протягом 1–2 годин у робочий час.",
  },
  en: {
    title: "Request an estimate",
    sub: "We reply within 1–2 hours during business hours.",
  },
};

const MODAL_CLASSNAMES = {
  base: "!bg-[oklch(0.13_0.005_300)] !border !border-line text-ink !rounded-[22px]",
  backdrop: "!bg-[oklch(0.06_0.005_300/0.6)] !backdrop-blur-[6px]",
  header: "flex flex-col gap-1 px-6 pt-6 pb-2",
  body: "px-6 pb-7 pt-2",
  closeButton:
    "text-ink-3 hover:bg-[oklch(1_0_0/0.06)] hover:text-ink transition-colors",
};

export function LeadModalDialog({
  isOpen,
  onOpenChange,
  opts,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  opts: OpenLeadModalOptions;
}) {
  const locale = opts.locale ?? "uk";
  const copy = COPY[locale];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
      classNames={MODAL_CLASSNAMES}
    >
      <ModalContent>
        <ModalHeader>
          <span className="font-sans text-[22px] font-bold tracking-[-0.01em] text-ink">
            {opts.title ?? copy.title}
          </span>
          <span className="text-[13.5px] leading-[1.5] text-ink-dim font-normal">
            {opts.sub ?? copy.sub}
          </span>
        </ModalHeader>
        <ModalBody>
          {/* Remount per open so the form resets between sessions. */}
          <LeadForm
            key={`${opts.source ?? "modal"}-${isOpen}`}
            variant="compact"
            source={opts.source ?? "modal"}
            locale={locale}
            tier={opts.tier}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
```

- [ ] **Step 2: Rewrite index.tsx (provider keeps the API, loses the UI)**

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import type { LeadFormLocale } from "@/constants/form-options";

// Modal UI + LeadForm (formik/yup/HeroUI inputs) load only on first open —
// none of it is needed for first paint on any page. ssr:false is safe:
// the modal renders nothing until opened.
const LeadModalDialog = dynamic(
  () => import("./dialog").then((m) => m.LeadModalDialog),
  { ssr: false },
);

export type OpenLeadModalOptions = {
  /** Recorded as the lead source so the owner sees which CTA was clicked. */
  source?: string;
  locale?: LeadFormLocale;
  /** Preselects a pricing tier in the form. */
  tier?: string;
  /** Overrides the modal heading. */
  title?: string;
  /** Overrides the modal subheading. */
  sub?: string;
};

type LeadModalContextValue = {
  open: (opts?: OpenLeadModalOptions) => void;
  close: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Once true, the dialog chunk stays mounted so close animations work.
  const [hasOpened, setHasOpened] = useState(false);
  const [opts, setOpts] = useState<OpenLeadModalOptions>({});

  const open = useCallback((next?: OpenLeadModalOptions) => {
    setOpts(next ?? {});
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<LeadModalContextValue>(
    () => ({ open, close }),
    [open, close],
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      {hasOpened ? (
        <LeadModalDialog isOpen={isOpen} onOpenChange={setIsOpen} opts={opts} />
      ) : null}
    </LeadModalContext.Provider>
  );
}

export function useLeadModal(): LeadModalContextValue {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error("useLeadModal must be used within a LeadModalProvider");
  }
  return ctx;
}
```

Note: `useDisclosure` is replaced by `useState` (no `@heroui/use-disclosure` import remains). `COPY` and `MODAL_CLASSNAMES` moved to dialog.tsx. The `OpenLeadModalOptions` type stays exported from index.tsx (dialog.tsx imports it from `./index` — a type-only circular import, which TypeScript erases; if ESLint complains about the cycle, move the type to a new `src/components/blocks/lead-modal/types.ts` and import it in both files).

- [ ] **Step 3: Typecheck + tests + import check**

```bash
npm run typecheck && npm test
grep -n "heroui" src/components/blocks/lead-modal/index.tsx && echo "FAIL" || echo "OK"
```

- [ ] **Step 4: Behavior check (Playwright, production build)**

On `http://localhost:3000/en`:
- Before any CTA click: no request for the dialog chunk, and no formik/yup in loaded JS (assert the dialog chunk request is absent).
- Click the header CTA (or any modal-triggering CTA — header's is wired via `useLeadModal` in hp-header.tsx) → chunk loads → modal opens with title "Request an estimate" and the compact form renders (name/contact fields visible).
- Close (X / backdrop) works; reopen works and the form is reset.
- `/en/contacts` full form still renders server-side path unaffected (fields visible on load).
Stop server; port free.

- [ ] **Step 5: Commit**

```bash
git add src/components/blocks/lead-modal/index.tsx src/components/blocks/lead-modal/dialog.tsx
git commit -m "perf: lazy-load the lead modal dialog (and formik/yup/HeroUI inputs) on first open"
```

---

### Task 5: Measure the JS-graph delta

**Files:**
- Modify: `docs/perf-log.md`

- [ ] **Step 1: Build and compare First Load JS vs Task 1**

```bash
npm run build 2>&1 | tail -60
```
Compare `/`, `/en` First Load JS against the Task-1 numbers. Expected: a substantial drop (the 149 KB-transfer vendor chunk leaves the homepage graph; some smaller HeroUI-system remainder may stay via HeroUIProvider). `/contacts` should stay roughly unchanged (it genuinely uses the form). If homepage First Load JS did NOT drop, STOP — inspect `npm run build` output and the homepage script list (Step 2) to find what still pulls HeroUI, and report BLOCKED with the import chain.

- [ ] **Step 2: Confirm via the served document**

`npm run start`, then re-run the Task-1 Step-2 script-list capture. Expected: the big vendor chunk identified in Task 1 is no longer among the homepage's `<script src>` entries. Record before/after script counts.

- [ ] **Step 3: Local Lighthouse**

`npm run perf:local` (600000ms timeout). Append row: `| 2026-07-05 | local | islands: FAQ native + lazy drawer/modal (JS <before>→<after> KB first-load) | score | lcp | tbt | fcp | cls |`. Compare against the reference row (53 / 6.1s / 917ms). Stop server; port free.

- [ ] **Step 4: Commit**

```bash
git add docs/perf-log.md
git commit -m "perf: record homepage JS-graph and Lighthouse after islands work"
```

---

### Task 6: Fonts — variable Manrope + JetBrains Mono, drop unused Actay italic

Facts: Manrope weights 400/500/600/700 are all genuinely used (19/118/119/55 class occurrences) — dropping a weight means a 100+ site design change, rejected. But Manrope and JetBrains Mono are variable fonts on Google Fonts: omitting `weight` in next/font makes Next serve ONE variable file per subset covering all weights — fewer files, fewer preloads, same rendering. ActayWide-BoldItalic is preloaded but never rendered (no `italic` + `font-actay` combination exists in src; `[&_em]:not-italic` is used to suppress italics).

**Files:**
- Modify: `src/app/(uk)/layout.tsx:21-43` and `src/app/(en)/layout.tsx:21-43` (identical edits)
- Delete: `public/fonts/ActayWide-BoldItalic.woff2`

- [ ] **Step 1: Capture "before" font facts**

From the current production-build output: `curl -s http://localhost:3000/en | grep -o '<link rel="preload"[^>]*as="font"[^>]*>' | wc -l` (needs `npm run build && npm run start` first) — expect 6. Also total the woff2 sizes: `ls -la .next/static/media/*.woff2 | sort -k5 -n | tail -12`. Record both.

- [ ] **Step 2: Switch both layouts to variable fonts**

In BOTH `src/app/(uk)/layout.tsx` and `src/app/(en)/layout.tsx`, change the Manrope and JetBrains_Mono configs (leave `subsets`, `variable`, `display` as-is) by REMOVING the `weight` arrays:

```ts
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});
```

(next/font uses the variable axis file when `weight` is omitted for variable fonts; all weights 200–800 remain available to `font-medium`/`font-semibold`/etc.)

And in the `actay` localFont config, delete the BoldItalic entry so `src` contains only:

```ts
    {
      path: "../../../public/fonts/ActayWide-Bold.woff2",
      weight: "700",
      style: "normal",
    },
```

- [ ] **Step 3: Delete the italic font file**

```bash
git rm public/fonts/ActayWide-BoldItalic.woff2
```

- [ ] **Step 4: Build and compare**

```bash
npm run build && npm run start
curl -s http://localhost:3000/en | grep -o '<link rel="preload"[^>]*as="font"[^>]*>'
```
Expected: fewer font preloads than the Step-1 count (variable files replace per-weight files; exact count depends on subsets — record it). Compare `.next/static/media/*.woff2` totals vs Step 1. Also verify rendering: fetch `/en`, confirm the page still declares `@font-face` for Manrope with a weight RANGE (e.g. `font-weight:200 800`) in the fonts CSS chunk:

```bash
grep -o "font-weight:[0-9]* [0-9]*" .next/static/css/*.css | sort -u
```
Expected: range declarations present (proof the variable file is in use).

- [ ] **Step 5: Visual check**

Playwright or manual screenshot on `/en`: headings (Actay bold), body text (Manrope 400/500/600/700 — check a `font-semibold` nav label and `font-bold` heading render distinctly), `font-mono` labels (JetBrains). Compare against production visually. Weights must be distinguishable (a broken variable setup renders everything at 400).
Stop server; port free.

- [ ] **Step 6: Typecheck, tests, commit**

```bash
npm run typecheck && npm test
git add src/app/(uk)/layout.tsx src/app/(en)/layout.tsx
git commit -m "perf: variable Manrope/JetBrains Mono (one file per subset) and drop unused Actay italic"
```
(The `git rm` from Step 3 is already staged.)

- [ ] **Step 7: Measure**

`npm run build && npm run start`, `npm run perf:local`. Append row `| 2026-07-05 | local | variable fonts + drop Actay italic (preloads N→M) | ... |`. Stop server. Commit the log:

```bash
git add docs/perf-log.md
git commit -m "perf: record Lighthouse after font consolidation"
```

---

### Task 7: Record the CSS-weight investigation

**Files:**
- Modify: `docs/perf-log.md`

- [ ] **Step 1: Append the findings block**

Add at the bottom of `docs/perf-log.md`:

```markdown
## CSS weight investigation (2026-07-05)

Main chunk composition at 306 KB raw / ~44 KB transfer: 192 KB app Tailwind
utilities, 60 KB HeroUI (13 scoped components), 44 KB theme vars, 6 KB
property registrations. Parked conclusions:
- No unused HeroUI light theme in the build (verified — only `.dark` vars).
- Per-route CSS splitting impossible: Tailwind v4 emits one stylesheet, imported at root.
- Remaining micro-cleanups from the 2026-05-25 CSS audit ≈ 3–6 KB raw — skipped (YAGNI).
- The one big lever left is removing HeroUI entirely (~60 KB CSS + provider JS):
  after the islands work it survives only in LeadForm/Drawer/Modal/Selects —
  all off the critical path. Future project.
```

- [ ] **Step 2: Commit**

```bash
git add docs/perf-log.md
git commit -m "docs: record CSS-weight investigation conclusions"
```

---

### Task 8: Final gate + PR

- [ ] **Step 1: Full gate**

```bash
npm run typecheck && npm test && npm run build
```

- [ ] **Step 2: Final measurement**

`npm run start`, `npm run perf:local`, append `| 2026-07-05 | local | islands+fonts final | ... |` row, stop server, commit:

```bash
git add docs/perf-log.md
git commit -m "perf: record final local Lighthouse for islands+fonts round"
```

- [ ] **Step 3: Push + PR**

```bash
git push -u origin perf/homepage-islands
gh pr create --title "Homepage islands + font trim: pull HeroUI/formik off the critical path" --body "$(cat <<'EOF'
## Summary
- FAQ rewritten on native <details>/<summary>: HeroUI Accordion + framer-motion gone from the homepage, answers now in SSR HTML (SEO win). Modern browsers animate via interpolate-size; older ones toggle instantly.
- Mobile-menu Drawer and lead-modal Modal (+ LeadForm with formik/yup) now load on first interaction via next/dynamic - their vendor chunk (149 KB transfer, measured 70% unused on homepage load) leaves the homepage critical path.
- Fonts: Manrope + JetBrains Mono switched to Google variable files (fewer files/preloads, all weights preserved); never-rendered ActayWide-BoldItalic dropped.
- CSS-weight investigation recorded in docs/perf-log.md: no quick wins left; the remaining lever is full HeroUI removal (future project).
- All numbers in docs/perf-log.md (First Load JS deltas + 3-run Lighthouse medians per task).

## Why
Production traces showed LCP is render-delay-bound (~1,050 ms of main-thread hydration while the LCP image sits downloaded), and the biggest contributor was JS that the homepage never executes: HeroUI/react-aria/framer-motion/formik/yup for components only used behind interactions.

## Verification
- npm run typecheck / npm test / npm run build green at every task
- Playwright behavior checks: FAQ open/multi-open/show-more; drawer lazy-loads on tap, closes on nav; modal lazy-loads on CTA, form resets per open; /contacts form unaffected
- Font rendering verified (weight range @font-face present; weights visually distinct)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: After merge+deploy: `npm run perf:prod`, append the prod row, compare with the 49/8.9s/869ms post-refactor baseline.**

---

## Deferred / out of scope

- Full HeroUI removal (~60 KB CSS + provider JS) — future project; islands work is the prerequisite.
- Hero drop-shadow filter / non-composited animation simplification — separate measured experiment (investigation fix #3).
- The single remaining CSS copy inside the RSC flight payload (~340 KB of the 485 KB document) — upstream Next.js issue; consider filing with our measurements.
- Manrope weight-count reduction (400/500/600/700 all genuinely used; a consolidation is a design decision, not a perf task).
