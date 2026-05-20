# Homepage Audit — Implementation Plan

Locked plan for the homepage audit fixes. Out of scope: PullQuote rework (only its CTA button changes here).

References used throughout:
- Page entry: [src/app/page.tsx](../src/app/page.tsx)
- Hero block: [src/components/blocks/hero/index.tsx](../src/components/blocks/hero/index.tsx), [hero.css](../src/components/blocks/hero/hero.css)
- Homepage blocks: [src/components/homepage/index.tsx](../src/components/homepage/index.tsx), [homepage.css](../src/components/homepage/homepage.css)
- Header: [src/components/homepage/hp-header.tsx](../src/components/homepage/hp-header.tsx)
- Process block: [src/components/homepage/process.tsx](../src/components/homepage/process.tsx)
- Layout: [src/app/layout.tsx](../src/app/layout.tsx)
- Tokens: [src/app/globals.css](../src/app/globals.css)

---

## Locked decisions (from review)

- **Container content width:** 1440px on all viewports (single `--container-max` token). Gutters (`padding-inline`) live on the outer wrapper and sit outside the 1440 cap. At 1920 viewport: 48 + 1440 + 48 = 1536 centered.
- **Actay scope:** `.h1` only. `.hp-h2` and `.case-h2` stay on Manrope.
- **H1 size:** `clamp(36px, 5vw, 64px)`, `text-transform: uppercase`.
- **Mobile-menu breakpoint:** stays at `<800`. The 800–1100 tier reduces nav font/gap, CTA padding, brand size — whatever it takes to fit.
- **`.btn-primary` shimmer:** kept on all four usages (hero + Process + Cases + PullQuote) for now.

---

## Commit order

Ten self-contained commits. Each ends with a browser check at 1920 / 1440 / 1100 / 800 / 375.

1. `chore(fonts): convert ActayWide otf→woff2 and wire next/font/local`
2. `feat(hero): apply ActayWide to h1, clamp(36,5vw,64) uppercase`
3. `fix(hero): lede 14px across breakpoints`
4. `fix(hero): drop trailing arrow from secondary CTA label`
5. `fix(a11y): wrap homepage content in <main>, drop <main> from HeroEditorial`
6. `perf(hero): swap raw <img> for next/image with priority + sizes`
7. `style(layout): bump --container-max to 1440 and introduce --gutter-x ladder`
8. `feat(header): group nav+cta with 92px gap, responsive ladder 800–1100`
9. `refactor(buttons): extract .btn-primary/.btn-ghost to shared stylesheet`
10. `feat(homepage): use .btn-primary in Process, Cases, PullQuote CTAs`

---

## 1. Convert ActayWide fonts + wire `next/font/local`

**Goal:** ship Actay Bold + BoldItalic as woff2, expose as `--font-actay`.

### Files

- `public/fonts/ActayWide-Bold.otf` (existing) → produce `ActayWide-Bold.woff2`
- `public/fonts/ActayWide-BoldItalic.otf` (existing) → produce `ActayWide-BoldItalic.woff2`
- [src/app/layout.tsx](../src/app/layout.tsx)

### Steps

1. **Convert `.otf` → `.woff2`** (pick one):
   - **Recommended — Python `fonttools`:**
     ```powershell
     pip install fonttools brotli
     python -c "from fontTools.ttLib import TTFont; f=TTFont(r'public/fonts/ActayWide-Bold.otf'); f.flavor='woff2'; f.save(r'public/fonts/ActayWide-Bold.woff2')"
     python -c "from fontTools.ttLib import TTFont; f=TTFont(r'public/fonts/ActayWide-BoldItalic.otf'); f.flavor='woff2'; f.save(r'public/fonts/ActayWide-BoldItalic.woff2')"
     ```
   - Alt: `npm i -D woff2` then `npx woff2_compress public/fonts/ActayWide-Bold.otf`.
   - Alt: online converter (cloudconvert / convertio) — once-off.
2. Confirm both `.woff2` files exist in `public/fonts/`. Keep the `.otf` files in the repo for now (delete in a later cleanup commit).
3. Wire `next/font/local` in [layout.tsx](../src/app/layout.tsx):
   ```ts
   import localFont from "next/font/local";

   const actay = localFont({
     src: [
       { path: "../../public/fonts/ActayWide-Bold.woff2",       weight: "700", style: "normal" },
       { path: "../../public/fonts/ActayWide-BoldItalic.woff2", weight: "700", style: "italic" },
     ],
     variable: "--font-actay",
     display: "swap",
     preload: true,
   });
   ```
   Append `${actay.variable}` to the `<html>` className (alongside `manrope.variable` and `jetbrains.variable`).

### Verification

- DevTools → Computed → `--font-actay` resolves on `<html>`.
- Network: `ActayWide-Bold.woff2` returns 200 with long-cache headers (Next.js handles this).
- No layout shift when the font loads (Bold weight is similar to Manrope 700 so swap should be subtle).

---

## 2. Hero `.h1` — Actay, 64px clamp, uppercase

**Goal:** apply Actay font, uppercase casing, and 64px desktop cap with mobile step-down via `clamp`.

### File

- [src/components/blocks/hero/hero.css](../src/components/blocks/hero/hero.css)

### Changes

Edit `.h1` (currently line 223):

```diff
.h1 {
- font-family: 'Manrope', sans-serif;
+ font-family: var(--font-actay), 'Manrope', sans-serif;
  font-weight: 700;
- font-size: clamp(40px, 5.2vw, 76px);
+ font-size: clamp(36px, 5vw, 64px);
  line-height: 0.96;
  letter-spacing: -0.035em;
  margin: 0 0 28px;
  color: var(--ink);
+ text-transform: uppercase;
}
```

Edit `.h1 em` (currently line 232) — keep gradient + italic, switch to Actay:

```diff
.h1 em {
  font-style: italic;
  font-weight: 500;
- font-family: 'Manrope', sans-serif;
+ font-family: var(--font-actay), 'Manrope', sans-serif;
  background: linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%);
  ...
}
```

Notes:
- Actay only ships in weight 700; setting `font-weight: 500` here will fall back to Manrope for the lighter italic, which is fine (italic emphasis stays visually contrasted against the heavier uppercase Actay).
- If the visual feels off, switch `.h1 em` to `font-weight: 700` and let it pull `ActayWide-BoldItalic`. Decide visually.

**Remove now-redundant H1 font-size overrides** since the `clamp` covers them:

- [hero.css:628](../src/components/blocks/hero/hero.css:628) — `.h1 { font-size: clamp(40px, 5.6vw, 56px); }` (inside `@media (max-width: 1440px)`) → delete.
- [hero.css:663](../src/components/blocks/hero/hero.css:663) — `.h1 { font-size: clamp(36px, 5vw, 48px); }` (inside `@media (max-width: 1080px)`) → delete.
- [hero.css:716-719](../src/components/blocks/hero/hero.css:716) — `.h1 { font-size: clamp(38px, 11vw, 50px); line-height: 0.98; margin-bottom: 18px; }` (inside `@media (max-width: 640px)`) → keep line-height + margin-bottom, **delete the font-size** (clamp floor of 36px takes over).
- [hero.css:778](../src/components/blocks/hero/hero.css:778) — `.h1 { font-size: 36px; }` (inside `@media (max-width: 380px)`) → delete (already matches clamp floor).

### Verification

- 1920 viewport: H1 renders at 64px in uppercase Actay.
- 1024 viewport: H1 around 51px (5vw).
- 375 viewport: H1 at 36px (clamp floor).
- Italic accent ("приймає заявки") keeps gradient and italic.
- Italic padding-fix at [globals.css:85-93](../src/app/globals.css:85) (`.h1 em` `padding-inline-end: 0.16em`) still applies — no change.

---

## 3. Hero `.lede` — 14px across breakpoints

### File

- [src/components/blocks/hero/hero.css](../src/components/blocks/hero/hero.css)

### Changes

Edit `.lede` (currently line 270):

```diff
.lede {
- font-size: 16px;
+ font-size: 14px;
  line-height: 1.6;
  color: var(--ink-2);
  max-width: 460px;
  margin: 0 0 32px;
  text-wrap: pretty;
}
```

**Collapse responsive overrides** since 14 is now the single value:
- [hero.css:631](../src/components/blocks/hero/hero.css:631) — `.lede { max-width: 460px; font-size: 15px; margin-bottom: 24px; }` → drop the `font-size`, keep margin-bottom override if visually still needed (probably no — re-evaluate after the change).
- [hero.css:664](../src/components/blocks/hero/hero.css:664) — `.lede { max-width: 100%; font-size: 14.5px; }` → drop `font-size`, keep `max-width: 100%`.
- [hero.css:729](../src/components/blocks/hero/hero.css:729) — `.lede { font-size: 14px; ... }` → drop the redundant `font-size`, keep `line-height` and `margin-bottom`.

### Verification

- Lede reads at 14px from 1920 down to 375.
- Wrap count on home lede ("Готовий сайт за 4–10 тижнів. Ваша участь…"): aim for 4–5 lines at 460px max-width.

---

## 4. Hero secondary CTA — fix double arrow

### File

- [src/app/page.tsx](../src/app/page.tsx) (line 221)

### Change

```diff
- ctaSecondaryLabel="Безкоштовний аудит сайту за 24 год →"
+ ctaSecondaryLabel="Безкоштовний аудит сайту за 24 год"
  ctaSecondaryShowPlay={false}
```

Component already appends an SVG arrow when `ctaSecondaryShowPlay=false` ([hero/index.tsx:206-216](../src/components/blocks/hero/index.tsx:206)). One arrow renders.

**No component change.** Other consumers of `HeroEditorial` should already follow the "no trailing arrow in label" rule, but grep to confirm none of them double-up:

```
grep -rn "ctaSecondaryShowPlay" src/
```

### Verification

- Home: secondary CTA shows "Безкоштовний аудит сайту за 24 год" followed by **one** SVG arrow icon.

---

## 5. Fix `<main>` semantic scope

**Goal:** exactly one `<main>` per page, wrapping all primary content.

### Files

- [src/components/blocks/hero/index.tsx](../src/components/blocks/hero/index.tsx) (line 150)
- [src/app/page.tsx](../src/app/page.tsx) (line 192)
- Every page that renders `HeroEditorial` (audit pass)

### Steps

1. **In `HeroEditorial`**, change the wrapper:
   ```diff
   - <main className="hero">
   + <div className="hero">
   ```
   The `.hero` class is unaffected (it doesn't care about the tag).
2. **In [src/app/page.tsx](../src/app/page.tsx:192)**, wrap the entire content tree in `<main>`:
   ```tsx
   <>
     <script type="application/ld+json" .../>
     <HpHeader />
     <main>
       <HeroEditorial ... />
       <TurnkeyList />
       <Marquee />
       <Industries />
       <Bento />
       <Process />
       <Cases />
       <section className="hp-section" id="pricing">...</section>
       <PullQuote ... />
       <FAQ ... />
       <FinalCta3 ... />
       <Newsletter />
     </main>
     <HpFooter />
   </>
   ```
3. **Audit every other consumer** of `HeroEditorial`. Grep and apply the same `<main>` wrap to each page so they don't silently lose the landmark:
   ```
   grep -rn "HeroEditorial" src/app
   ```
   Expected hits: `/`, `/en`, `/about`, `/sites-for/[slug]`, `/vs-*`, `/process`, `/pricing`, `/portfolio`, `/contacts`, etc. Each gets the same `<main>{...}</main>` wrap around its content tree (between header and footer).

### Verification

- DevTools → Accessibility → Landmarks shows exactly one `<main>` per page.
- Lighthouse a11y: no "Document does not have a `<main>` landmark" warning.

---

## 6. Hero `<img>` → `next/image`

### Files

- [src/components/blocks/hero/index.tsx](../src/components/blocks/hero/index.tsx) (lines 7-29, `DeviceMockup`)
- [src/components/blocks/hero/hero.css](../src/components/blocks/hero/hero.css) (`.mockup img` rules)

### Steps

1. **Get intrinsic dimensions** of `public/raw-design/assets/hero-devices.webp`:
   ```powershell
   Add-Type -AssemblyName System.Drawing
   $img = [System.Drawing.Image]::FromFile("$PWD/public/raw-design/assets/hero-devices.webp")
   "$($img.Width) x $($img.Height)"; $img.Dispose()
   ```
   Plug the real values into the `width`/`height` props below.

2. **Rewrite `DeviceMockup`:**
   ```tsx
   import Image from "next/image";

   export function DeviceMockup({ src, alt = "" }: { src?: string; alt?: string }) {
     return (
       <div className="mockup">
         {src ? (
           <Image
             src={src}
             alt={alt}
             width={/* real width */}
             height={/* real height */}
             priority
             fetchPriority="high"
             sizes="(max-width: 640px) 100vw, (max-width: 1440px) 60vw, 1000px"
             className="mockup-img"
           />
         ) : (
           <div className="mockup-placeholder" aria-hidden="true">
             <div className="mockup-placeholder-bar">
               <span /><span /><span />
             </div>
           </div>
         )}
       </div>
     );
   }
   ```

3. **Update CSS selectors** in [hero.css](../src/components/blocks/hero/hero.css):
   - Change `.mockup img { ... }` (line 532) and `@media (max-width: 1440px) .mockup img { ... }` (line 621) and the mobile override at line 689 — switch the selector to `.mockup .mockup-img` (or `.mockup img` still works since next/image renders an `<img>`, but explicit class is safer because next/image injects inline `width`/`height` styles).
   - The `clamp(560%, 660%, 780%)` overflow trick must remain — verify it still works alongside next/image's auto-inserted `style="color:transparent"` and intrinsic sizing. May need `style={{ width: "auto", height: "auto" }}` override on the `<Image>` if Next forces dimensions inline.
   - **Alternative cleaner approach to evaluate:** drop the percentage clamp entirely and use `<Image fill sizes="..." style={{ objectFit: 'contain' }} />` inside `.hero-right` (which already has `aspect-ratio: 16/10`). Prototype both during the commit and pick whichever lays out correctly with no overlap on `.device-tag` floats.

### Verification

- Lighthouse: LCP element is the device mockup, served as WebP via `_next/image?url=...`.
- Network: srcset URLs fire on viewport resize.
- No CLS during hero load.
- Drop-shadow filter from `.mockup img` still visible.

---

## 7. Container width — bump to 1440 + introduce `--gutter-x` ladder

**Goal:** content area = 1440px on all viewports; outer horizontal padding follows a single ladder shared by hero, header, sections, footer.

### Files

- [src/app/globals.css](../src/app/globals.css)
- [src/components/blocks/hero/hero.css](../src/components/blocks/hero/hero.css)
- [src/components/homepage/homepage.css](../src/components/homepage/homepage.css)
- [tailwind.config.ts](../tailwind.config.ts) (cleanup)

### 7a. Tokens

In [globals.css](../src/app/globals.css):

```diff
- --container-max: 1240px;
- --container-max-wide: 1440px;
+ --container-max: 1440px;
  --container-h1: 920px;
  --container-narrow: 880px;
  --container-prose: 760px;
  --container-form: 720px;

+ /* Horizontal gutter ladder — shared by hero, header, sections, footer. */
+ --gutter-x: 48px;
```

Add media-query overrides for `--gutter-x`:

```css
@media (max-width: 1100px) { :root { --gutter-x: 32px; } }
@media (max-width: 700px)  { :root { --gutter-x: 24px; } }
@media (max-width: 380px)  { :root { --gutter-x: 18px; } }
```

Breakpoint targets:
- ≥1100: 48px (current hero/section default)
- 700–1100: 32px (current hero ≤1440 default)
- 380–700: 24px (current section ≤700 default)
- <380: 18px (current hero ≤640 default)

### 7b. Migrate `padding-inline` to `var(--gutter-x)`

Apply globally — find every `48px` horizontal padding on outer wrappers and replace with `var(--gutter-x)`.

| Selector | File | Change |
|---|---|---|
| `.hp-section` | [homepage.css:10](../src/components/homepage/homepage.css:10) | `padding: var(--section-y) var(--gutter-x);` |
| `.hp-section.tight` | [homepage.css:15](../src/components/homepage/homepage.css:15) | `padding: var(--section-y-tight) var(--gutter-x);` |
| `.hp-header` | [homepage.css:1565](../src/components/homepage/homepage.css:1565) | `padding: 0 var(--gutter-x);` |
| `.hp-footer` (search line) | [homepage.css:~1452](../src/components/homepage/homepage.css) | `padding: var(--section-y-md) var(--gutter-x) 32px;` |
| `.hero` | [hero.css:165](../src/components/blocks/hero/hero.css:165) | `padding: 24px var(--gutter-x) 60px;` |
| `.hp-marquee-label` | [homepage.css:117](../src/components/homepage/homepage.css:117) | `padding: 0 var(--gutter-x);` |
| `.hp-marquee-track` (currently `0 32px`) | [homepage.css:146](../src/components/homepage/homepage.css:146) | leave or align — confirm intent |
| `.turnkey-list` outer | [turnkey-list.css:3](../src/components/blocks/turnkey-list/turnkey-list.css:3) | `padding: var(--section-y-tight) var(--gutter-x);` |

**Delete now-redundant responsive overrides** that hard-code horizontal padding values, since `--gutter-x` is media-query-aware:
- [hero.css:613](../src/components/blocks/hero/hero.css:613) `.hero { padding: 32px 32px 56px; }` — drop the X-padding from this override.
- [hero.css:673](../src/components/blocks/hero/hero.css:673) `.hero { padding: 0 18px 36px; }` — same.
- [homepage.css:2134](../src/components/homepage/homepage.css:2134) `.hp-section { padding: var(--section-y) 24px; }` — drop, ladder handles it.
- [homepage.css:2135](../src/components/homepage/homepage.css:2135) `.hp-section.tight { padding: var(--section-y-tight) 24px; }` — drop.
- [homepage.css:2288](../src/components/homepage/homepage.css:2288) `.hp-footer` mobile padding — drop the X-padding.

Vertical padding (`section-y`, etc.) stays as-is — only the X-padding tokens change.

### 7c. Cleanup

Delete the unused `--container-max-wide` token (only consumer is the Tailwind alias):

- [globals.css:25](../src/app/globals.css:25) — delete the token (already done in 7a above).
- [tailwind.config.ts:54](../tailwind.config.ts:54) — delete `"container-wide": "var(--container-max-wide)"` line.
- Grep one more time after the change to confirm no consumer:
  ```
  grep -rn "container-wide\|container-max-wide" src/ tailwind.config.ts
  ```

### Verification

- At 1920 viewport: hero, header, sections all visually align at left edge (240px from viewport edge: 192px empty + 48px gutter).
- At 1024 viewport: same alignment, 32px gutter.
- At 768 viewport: same alignment, 32px gutter.
- At 600 viewport: same alignment, 24px gutter.
- The screenshot misalignment (header overflowing past section content at 808px) goes away — but the **root cause** at 808 was nav density (see Section 8), not container; this commit alone may not fully resolve 808.

---

## 8. Header — 92px gap, responsive ladder, brand never wraps

**Goal:** at desktop, brand at far left, nav at right with exactly 92px between nav and CTA. At 800–1100, scale everything down so it fits.

### Files

- [src/components/homepage/hp-header.tsx](../src/components/homepage/hp-header.tsx)
- [src/components/homepage/homepage.css](../src/components/homepage/homepage.css)

### 8a. JSX restructure

Wrap nav + CTA in a single group so they can share a flex gap:

```tsx
return (
  <header className="hp-header">
    <div className="hp-header-inner">
      <Link href={homeHref} className="hp-header-brand" onClick={closeDd}>
        <em>Code-Site</em>.art
      </Link>
      <div className="hp-header-end">
        <nav className="hp-header-nav" aria-label={t("menuLabel")}>
          {/* existing dropdown + nav links + locale switcher */}
        </nav>
        <Link href={ctaHref} className="hp-header-cta" onClick={closeDd}>
          {t("cta")}
        </Link>
      </div>
      <MobileMenu />
    </div>
  </header>
);
```

`MobileMenu` stays as a sibling — it's `display: none` ≥800 and toggles on at <800 (existing CSS at [homepage.css:1882-1886](../src/components/homepage/homepage.css:1882)).

### 8b. Base CSS (desktop ≥1100)

```css
.hp-header-inner {
  /* keep: max-width var(--container-max); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 18px 0; */
}
.hp-header-brand {
  white-space: nowrap;
  flex-shrink: 0;
  /* keep: font-family, font-weight, font-size:16px, color */
}
.hp-header-end {
  display: flex;
  align-items: center;
  gap: 92px;
  flex-shrink: 1;
  min-width: 0;
}
```

Outer `.hp-header-inner` (`space-between`) pushes brand left and `.hp-header-end` right. Inside the end group, nav and CTA sit 92px apart.

### 8c. Responsive ladder (800–1100)

Existing breakpoints in the file: 1440, 1100, 800, 700, 640. Use the existing 1100 + 800 boundary for header scaling. Add the following overrides near the existing header media queries:

```css
@media (max-width: 1440px) {
  .hp-header-end { gap: 56px; }
  .hp-header-nav { gap: 22px; }
  .hp-header-nav a,
  .hp-nav-dd > summary.hp-nav-dd-trigger { font-size: 10.5px; }
  .hp-header-cta { padding: 9px 16px; font-size: 11px; }
  .hp-header-brand { font-size: 15px; }
}

@media (max-width: 1100px) {
  .hp-header-end { gap: 32px; }
  .hp-header-nav { gap: 16px; }
  .hp-header-nav a,
  .hp-nav-dd > summary.hp-nav-dd-trigger { font-size: 10px; letter-spacing: 0.1em; }
  .hp-header-cta { padding: 8px 14px; font-size: 10.5px; letter-spacing: 0.04em; }
  .hp-header-brand { font-size: 14px; }
  .hp-header-inner { padding: 14px 0; }
}

/* <800 already handled: .hp-header-nav + .hp-header-cta display:none; burger shown.
   No change here. */
```

Tune the exact numbers during implementation by browser-checking at 1024, 900, 808 — the screenshot viewport. Goal: at 808, all 8 nav items + brand + locale + CTA fit on one line without wrap or overflow.

### 8d. Locale switcher

The locale switcher inside `.hp-header-nav` may also need a font-size reduction in the same ladder — find `.hp-locale-trigger` rules ([homepage.css:1745+](../src/components/homepage/homepage.css:1745)) and add matching `font-size` overrides in each tier.

### Verification

- **1920:** brand far left, `.hp-header-end` far right, 92px between nav and CTA (verify with DevTools ruler).
- **1100:** gap 32px, smaller text, fits cleanly.
- **808:** everything fits on one line, brand reads "Code-Site.art" without wrap.
- **800:** mobile menu kicks in, nav + CTA hidden.

---

## 9. Extract `.btn-primary` / `.btn-ghost` to shared stylesheet

**Goal:** make the hero primary button reusable on other blocks without forcing them to import `hero.css`.

### New file

`src/components/blocks/buttons/buttons.css`

Move the following blocks from [hero.css](../src/components/blocks/hero/hero.css) into the new file:

- `a.btn-primary, a.btn-ghost` text-decoration reset (lines 338-341)
- `.btn-primary` base + `::before` shimmer + `:hover` rules (lines 342-372)
- `.btn-ghost` base + `:hover` rules (lines 374-392)
- `.btn-play` rules (lines 393-404)
- Mobile button overrides at [hero.css:753-759](../src/components/blocks/hero/hero.css:753) (`.btn-primary, .btn-ghost { width: 100%; ... }` inside `@media (max-width: 640px)`) — move under the same media query in `buttons.css`.
- The intermediate override at [hero.css:643-644](../src/components/blocks/hero/hero.css:643) (`.btn-primary, .btn-ghost { padding: 13px 18px; font-size: 13px; }` inside `@media (max-width: 1440px)`) — move under the same media query.

### Consumers

Add an import at the top of:

- [src/components/blocks/hero/index.tsx](../src/components/blocks/hero/index.tsx): `import "@/components/blocks/buttons/buttons.css";` **before** the existing `import "./hero.css";`
- [src/components/homepage/index.tsx](../src/components/homepage/index.tsx): `import "@/components/blocks/buttons/buttons.css";`
- [src/components/homepage/process.tsx](../src/components/homepage/process.tsx): same import.

(Next.js dedupes CSS imports — importing in three places is safe.)

### Verification

- Hero primary CTA renders identically (shimmer still plays on hover).
- Remove the moved rules from `hero.css` — diff that file to confirm only the buttons block left.

---

## 10. Use `.btn-primary` in Process / Cases / PullQuote CTAs

### 10a. Process

**File:** [src/components/homepage/process.tsx:102-105](../src/components/homepage/process.tsx:102)

```diff
- <Link href={ctaHref} className="hp-link">
-   {ctaLabel}
-   <ArrowRight size={14} strokeWidth={1.8} />
- </Link>
+ <Link href={ctaHref} className="btn-primary hp-section-cta">
+   <span>{ctaLabel}</span>
+   <ArrowRight size={18} strokeWidth={1.8} />
+ </Link>
```

The `<span>` wrapper around the label is required so `.btn-primary::before` shimmer paints behind the text (verify by comparing the hero's `.btn-primary` markup at [hero/index.tsx:190-193](../src/components/blocks/hero/index.tsx:190)).

### 10b. Cases

**File:** [src/components/homepage/index.tsx:726-729](../src/components/homepage/index.tsx:726)

```diff
- <Link href={ctaHref} className="hp-link">
-   {ctaLabel}
-   <ArrowRight size={14} strokeWidth={1.8} />
- </Link>
+ <Link href={ctaHref} className="btn-primary hp-section-cta">
+   <span>{ctaLabel}</span>
+   <ArrowRight size={18} strokeWidth={1.8} />
+ </Link>
```

### 10c. PullQuote

**File:** [src/components/homepage/index.tsx:840-845](../src/components/homepage/index.tsx:840)

```diff
- <div style={{ marginTop: 24, textAlign: "center" }}>
-   <Link href={caseHref} className="hp-link">
-     {caseLabel ?? "Подивитись повний кейс"}
-     <ArrowUpRight size={14} strokeWidth={1.8} />
-   </Link>
- </div>
+ <div className="hp-pull-cta">
+   <Link href={caseHref} className="btn-primary">
+     <span>{caseLabel ?? "Подивитись повний кейс"}</span>
+     <ArrowUpRight size={18} strokeWidth={1.8} />
+   </Link>
+ </div>
```

### 10d. Supporting CSS

Add to [homepage.css](../src/components/homepage/homepage.css):

```css
.hp-section-cta {
  margin-top: 36px;
  align-self: flex-start;
}
.hp-pull-cta {
  margin-top: 32px;
  text-align: center;
}
```

Match the existing `.hp-link { margin-top: 36px }` spacing so the layout doesn't jump.

### 10e. Mobile

The `.btn-primary` mobile override (moved to `buttons.css` in Section 9) stretches buttons to `width: 100%`. Decide per usage whether this is desired:
- **Process / Cases:** CTA sits below a grid — full-width on mobile reads well. Keep.
- **PullQuote:** CTA is centered, short label — full-width may look heavy. Either keep, or scope an override on `.hp-pull-cta .btn-primary { width: auto; }`.

### Verification

- Hover shimmer plays on all four `.btn-primary` instances (hero + Process + Cases + PullQuote).
- Buttons line up vertically with section content (`align-self: flex-start` on `.hp-section-cta`).
- No leftover `.hp-link` rules need deletion — keep the class in case other pages use it (grep first to confirm).

---

## Cross-cutting verification (end of work)

Before requesting review, verify:

| Check | How |
|---|---|
| One `<main>` per page | DevTools → Accessibility tree on `/`, `/en`, `/about`, `/pricing`, `/portfolio`, `/contacts`, `/sites-for/medicine`, `/vs-wordpress` |
| Container alignment | Visual ruler at 1920, 1440, 1100, 808, 640 — header/hero/section left edges align |
| H1 typography | Actay loads, uppercase, clamp scales 36 → 64 |
| Lede font-size | 14px at all sizes |
| Hero double-arrow | Gone — exactly one arrow on secondary CTA |
| Hero image | `_next/image` URL, srcset, no CLS |
| Header at 808 | All items fit, brand doesn't wrap |
| Header gap | 92px at ≥1440 between nav and CTA (DevTools ruler) |
| `.btn-primary` shimmer | Plays on all 4 instances |
| Lighthouse a11y | No new warnings |
| Lighthouse perf | LCP ≤2.5s on home (hero device mockup is LCP candidate) |

---

## Out of scope

- PullQuote rework (`<blockquote>` semantics, author defaults coupling, bg radial scaling) — deferred. Only the CTA button change here.
- Other UI-pro-max audit items not in this scope:
  - Header CTA `:focus-visible` ring
  - Lede copy trim
  - Marquee width cap at 2K+
  - FinalCta3 promotion to primary button

---

## Risks

- **Container 1240 → 1440 is global.** Every page widens by 200px. Confirm visually on `/about`, `/pricing`, `/portfolio`, `/blog`, `/calculator`, `/process`. If anything regresses (e.g. a grid that looked balanced at 1240), fix in a follow-up rather than reverting the token.
- **`<main>` audit** touches ~15 page files. Easy to miss one — grep `HeroEditorial` after the hero change and visit each consumer.
- **`next/image` clamp overflow trick** is the most likely source of pixel-level regressions. Test the device mockup at every breakpoint after the swap; be ready to switch to `<Image fill>` if percentages break.
- **Actay BoldItalic on `<em>`** may feel too heavy at 64px uppercase. If so, leave `.h1 em` on Manrope italic 500 — that's the documented fallback.
- **Header ladder numbers** in Section 8c are starting values; tune in-browser at 1024/900/808.
