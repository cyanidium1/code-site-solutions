# About + Calculator imagery additions — implementation plan

Date: 2026-05-26
Touches: `about/page.tsx`, `PageHero`, `Bento`, `WebsiteCalculator`, `public/*`.

## Context

Five visual additions are required across the About page and the Calculator. Source assets are dropped at `Frontend/public/*.png`:

| Dropped file                  | Task | Target slot                                                  |
| ----------------------------- | ---- | ------------------------------------------------------------ |
| `hero.png`                    | 4    | About page hero (right column, overlapping stats)            |
| `logo.png`                    | 2    | Behind values bento (empty 4th-col area, xl+)                |
| `differences.png`             | 3    | Behind VS bento (empty 4th-col area, xl+)                    |
| `calc social left.png`        | 5    | Calculator social-proof, left side (mobile mockup)           |
| `calc social right.png`       | 5    | Calculator social-proof, right side (laptop mockup)          |

Confirmed decisions (from clarifying questions):

- Bento background images are visible **xl and up only (≥1100px)** — that's where the grid becomes 4 cols and a real empty slot exists.
- About hero overlap is implemented by **extending `PageHero` with an optional inline `stats` prop**. The page drops the standalone `<StatsBar>` so the image can overflow into the stats card from a single section.
- All five PNGs get **WebP-converted via ImageMagick**:
  - `hero.png` → `public/about/hero.webp`, q90 max effort, resize to max 1600px wide
  - `logo.png` → `public/about/values-logo.webp`, q80 max effort, resize to max 1200px wide
  - `differences.png` → `public/about/differences.webp`, q80 max effort, resize to max 1600px wide
  - `calc social left.png` → `public/calculator/social-left.webp`, q80, max 800px wide
  - `calc social right.png` → `public/calculator/social-right.webp`, q80, max 1000px wide
  - Source PNGs are deleted from `public/` root after conversion. The team folder has existing `team` photos – we use a new `public/about/` folder for these.

The "team · 2026" `GradPlaceholder` block (`<ImageText>` "Не агенція. Не фрилансер.") is **commented out** until a real team photo is available — content kept intact in the file so it's a one-line uncomment when the photo lands.

## Audit notes

- `PageHero` (`src/components/blocks/page-hero/index.tsx`) already supports an `image` prop and a 2-col grid (`1.5fr / 1fr`, collapsing at <=960px). It has no stats and no image overflow. We extend it.
- `StatsBar` (`src/components/blocks/stats-bar/index.tsx`) is a thin standalone section. We'll move its visual into PageHero as an inline option and stop rendering the separate block on About. Other consumers of `StatsBar` (if any) keep working — we change the page, not the block. Verified usage: `grep StatsBar src` — only `about/page.tsx`.
- `Bento` (`src/components/homepage/bento.tsx`) renders `<section class={hpSectionClass}>` and is shared. The decoration image must live in the page composition (around the Bento) so we don't pollute Bento's API for one-off usage. Solution: wrap the about-page Bentos in a positioned shell that paints the image absolutely behind the grid, gated by `hidden xl:block`.
- The values bento has 3 cells at xl (4-col grid) → empty slot at column 4. Differences bento has 3 cells → same layout.
- Calculator "social proof" section (`WebsiteCalculator.tsx:336–375`) currently:
  - Sits inside a bordered translucent card (`border border-line rounded-[22px] …`)
  - First child is a `<p>` with `social.line` translation (i18n key `social.line`)
  - Then logo pills, then testimonial figure
  - We **remove the outer card border + bg**, lift the top `<p>` to an `<h2>` using `hpH2Class` (the same heading helper used by sibling sections, with `emChunk` rich-text rendering for `<em>` styling — but `social.line` has only `<strong>`, so no em styling needed, just the white/purple heading style). Add two absolutely-positioned `Image` mockups on left/right, scoped to the section using the same pattern as `.hp-pqs-mockup`.

## Tasks

Tasks are split so each can be implemented and verified independently. Suggested order: 1 → 2 → 3 → 4 → 5 → 6.

### Task 1 — Assets: convert PNGs to WebP and move into folders

**Files**
- Delete: `public/calc social left.png`, `public/calc social right.png`, `public/differences.png`, `public/hero.png`, `public/logo.png`
- Create: `public/about/hero.webp`, `public/about/values-logo.webp`, `public/about/differences.webp`, `public/calculator/social-left.webp`, `public/calculator/social-right.webp`

**Commands** (PowerShell; ImageMagick `magick` is in PATH):

```pwsh
$pub = "C:\GitHub23\code-site-workspace\Frontend\public"
New-Item -ItemType Directory -Force "$pub\about" | Out-Null

# Hero — q90, max width 1600
magick "$pub\hero.png" -resize "1600x>" -define webp:method=6 -quality 90 "$pub\about\hero.webp"
# Values logo (CS mark) — q80, max width 1200, keep alpha
magick "$pub\logo.png" -resize "1200x>" -define webp:method=6 -quality 80 "$pub\about\values-logo.webp"
# Differences mockup — q80, max width 1600
magick "$pub\differences.png" -resize "1600x>" -define webp:method=6 -quality 80 "$pub\about\differences.webp"
# Calc social left (phone) — q80, max width 800
magick "$pub\calc social left.png" -resize "800x>" -define webp:method=6 -quality 80 "$pub\calculator\social-left.webp"
# Calc social right (laptop) — q80, max width 1000
magick "$pub\calc social right.png" -resize "1000x>" -define webp:method=6 -quality 80 "$pub\calculator\social-right.webp"

# Remove originals once conversion succeeds and sizes look right
Remove-Item "$pub\hero.png","$pub\logo.png","$pub\differences.png","$pub\calc social left.png","$pub\calc social right.png"
```

**Verify**: `magick identify <each .webp>` to confirm dimensions; visually open the WebPs and confirm no quality regression vs source.

### Task 2 — Comment out "Хто ми" `ImageText` block on About page

**File**: `src/app/about/page.tsx`

Wrap the `<ImageText … />` block (lines ~185–206 — "Section 3: Хто ми") in `{/* */}` with a TODO note:

```tsx
{/* Section 3: Хто ми — temporarily hidden, awaiting real team photo (replaces GradPlaceholder).
    Restore once `public/about/team-2026.webp` exists. */}
{/* <ImageText
  variant="side"
  imageVariant="imageRight"
  …
/> */}
```

Also remove the now-unused imports (`ImageText`, `GradPlaceholder` definition, `type { CSSProperties }`) **or** leave them in place if the team photo is expected back soon. **Recommendation**: leave both in place — file is one uncomment away from working, and the unused import is local. Add `// eslint-disable-next-line @typescript-eslint/no-unused-vars` if linter complains.

**Verify**: `npm run lint` clean; About page renders without the section; stats bar still sits directly below hero (until Task 4 collapses the two).

### Task 3 — Add CS logo decoration behind values Bento

**File**: `src/app/about/page.tsx`

Wrap the values `<Bento>` block in a relatively-positioned shell and paint the logo absolutely in the 4th-col area. Constraints:

- Only visible at xl (`hidden xl:block`).
- Doesn't take pointer events (`pointer-events-none`).
- Preserve the logo's intrinsic aspect ratio; place it so the visible shape lands in roughly the rightmost 1/4 column of the cards row (per design screenshot, image-2 reference box ~579×326 from card-row top).
- `z-index` below the cards, above the section bg.

Sketch:

```tsx
<section className="relative">
  <div
    aria-hidden
    className="hidden xl:block pointer-events-none absolute inset-0 z-0"
  >
    {/*
      Logo positioned over the right ~25% of the bento row.
      Card row top sits below the eyebrow+heading (~roughly 200-260px from section top).
      Use percentage-based offsets so it stays aligned at 1100px+ widths.
    */}
    <Image
      src="/about/values-logo.webp"
      alt=""
      width={600}
      height={340}
      sizes="(min-width: 1100px) 600px, 0px"
      className="absolute right-[2%] top-[40%] w-[clamp(360px,30vw,580px)] h-auto opacity-90 [filter:drop-shadow(0_20px_30px_oklch(0_0_0_/_0.45))]"
    />
  </div>
  <Bento
    eyebrow="ЦІННОСТІ"
    heading={…}
    cells={VALUES_CELLS.slice(0, 3)}
  />
</section>
<ValuesSecondaryRow … />
```

Exact `top` / `right` / `width` values to be **fine-tuned in the browser**: reference image-2 shows the logo centered roughly in the empty 4th column at the card-row height. Numbers above are the starting point — confirm against design screenshot at 1280×800 and 1440×900.

**Verify**:
- xl+ viewport: logo behind cards in the empty 4th column area, doesn't intercept clicks, no horizontal scroll.
- Below xl: logo hidden, layout unchanged.
- `next/image` actually serves the WebP, lazy by default (this image is below the fold).

### Task 4 — Add screenshot decoration behind VS Bento

**File**: `src/app/about/page.tsx`

Same pattern as Task 3, applied to the `VS_CELLS` Bento. From image-3 the screenshot mockup overlaps the right 25–30% of the card row with the keyboard/laptop bleeding slightly below the cards. Important: the file has a soft purple glow that extends ~10% beyond the device — when computing position, target the **device center**, not the file center, so the glow can overhang.

```tsx
<section className="relative overflow-hidden">
  <div
    aria-hidden
    className="hidden xl:block pointer-events-none absolute inset-0 z-0"
  >
    <Image
      src="/about/differences.webp"
      alt=""
      width={880}
      height={1000}
      sizes="(min-width: 1100px) 700px, 0px"
      className="absolute right-[-3%] top-[28%] w-[clamp(420px,38vw,720px)] h-auto"
    />
  </div>
  <Bento
    eyebrow="ВІДМІННОСТІ"
    heading={…}
    cells={VS_CELLS}
  />
</section>
```

`overflow-hidden` on the wrapper section is required if the glow halo would otherwise create horizontal scrollbars.

**Verify**: identical checks to Task 3, plus confirm the image's purple halo doesn't introduce a horizontal scrollbar at xl breakpoint boundary.

### Task 5 — About hero image + inline stats

**Files**: `src/components/blocks/page-hero/index.tsx`, `src/app/about/page.tsx`

**5a. Extend `PageHero`**

Add an optional `stats?: { value: ReactNode; label: string }[]` prop. When present, render a `StatsBar`-style card *inside* the section, at the bottom of the left column. The image (when present) is positioned absolutely so it overlaps the stats card from the right at lg+ (this project's lg = 800), per the home-hero pattern.

Concretely:

- Convert the section's inner from a 2-col grid that height-aligns to a 2-col grid where:
  - Left col: breadcrumbs + eyebrow + H1 + sub + (when `stats`) the stats card
  - Right col: a `relative` device-stage div (similar to `HERO_RIGHT_CLASS` in `blocks/hero/index.tsx`) containing the image absolutely positioned, slightly translated left so it bleeds over the stats card.
- The right column collapses below mobile breakpoint (existing `max-[960px]:grid-cols-1` already handles this; keep the same behavior — on mobile, image stacks above stats).

Approximate utility classes (mirroring home `HeroEditorial` patterns):

```tsx
<div className="relative">
  <Image
    src="/about/hero.webp"
    alt=""
    width={1700}
    height={1500}
    priority
    fetchPriority="high"
    sizes="(max-width: 960px) 100vw, 50vw"
    className="w-[clamp(420px,55vw,900px)] -translate-x-[8%] h-auto [filter:drop-shadow(0_50px_60px_oklch(0_0_0_/_0.55))_drop-shadow(0_20px_30px_oklch(0_0_0_/_0.35))]"
  />
</div>
```

Stats card (reused from `StatsBar`'s inner JSX — copied verbatim into PageHero, not re-imported, to keep the block self-contained):

```tsx
{stats?.length ? (
  <div className="mt-10 flex flex-wrap items-center gap-3.5 px-[18px] py-4 border border-line rounded-[18px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] lg:flex-nowrap lg:gap-6 lg:px-7 lg:py-5">
    {stats.map((it, i) => (
      <div key={i} className={cn("flex-1 flex flex-col gap-1.5 basis-[calc(50%-7px)] min-w-[120px] lg:basis-auto lg:min-w-0", i > 0 && "lg:border-l lg:border-line lg:pl-6")}>
        <span className="font-display font-bold text-[22px] tracking-[-0.03em] leading-none text-ink lg:text-[28px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
          {it.value}
        </span>
        <span className="font-sans text-[9px] text-ink-3 uppercase tracking-[0.08em] leading-[1.3] lg:text-[10px]">{it.label}</span>
      </div>
    ))}
  </div>
) : null}
```

Important: position right col so the image **overflows into the stats card**. This means the section needs `pb-[bigger]` so the image isn't cut off, and the image's container is `absolute right-0 top-1/2 -translate-y-1/2` (or `top-[20%]`) — fine-tune in browser. Mirror the home hero's `[filter:drop-shadow(...)]` so the device gets the same shadow stack.

The eslint comment from existing `GradPlaceholder` (`react/forbid-dom-props`) is no longer relevant once `GradPlaceholder` usage is removed.

**5b. Update `about/page.tsx`**

- Drop `<StatsBar items={…} />` and pass those items directly into `<PageHero stats={…} image={<Image …/>} />`.
- Keep eyebrow/breadcrumbs/headline/sub as today.

**Verify**:
- Desktop ≥960px: hero image sits on the right and overlaps the bottom-right of the stats card with the same drop shadow as the home page.
- Tablet/mobile <960px: image stacks above the stats card, no overflow.
- Lighthouse: image is set `priority + fetchPriority="high"` since it's above the fold — match home hero behavior.

### Task 6 — Calculator social-proof restyle + side images

**File**: `src/components/calculator/WebsiteCalculator.tsx`

Changes inside the `{/* Section: Social proof */}` block:

1. **Remove the bordered card**. Replace the outer `<div className="border border-line rounded-[22px] bg-[radial-gradient...] px-7 py-8 …">` with a centered text-aligned wrapper that has no border/no bg, but keeps padding for breathing room.
2. **Promote the top line to a heading**. Today it's a `<p>` rendering `t.rich("social.line")` with `<strong>` chunks. Replace with:
   ```tsx
   <h2 className={hpH2Class}>{t.rich("social.line", { em: emChunk, strong: (chunks) => <strong>{chunks}</strong> })}</h2>
   ```
   `hpH2Class` is already imported in the file (used by sibling sections). `<em>` becomes the purple gradient if the translator adds it; today the translation has only `<strong>` (white → ink in this design system). **Translation check**: confirm `social.line` value in `messages/uk.json` / `messages/en.json` — if the goal is purple highlight on key phrase, the translation needs `<em>` markup. Otherwise headings stay white. Not changing copy in this task — only the rendering element.
3. **Add side images** mirroring `.hp-pqs-mockup` from `vendor.css`. Since this section is a one-off, scope styles inline rather than reusing the swiper-specific CSS classes:

   ```tsx
   <section className={`${hpSectionClass} py-10`}>
     <div className={hpInnerClass}>
       <div className="relative flex flex-col items-center gap-[18px] text-center px-7 py-8">
         {/* Left mockup — hidden below 900px (match hp-pqs behavior) */}
         <div className="hidden min-[900px]:block absolute left-0 bottom-[6%] z-0 pointer-events-none [filter:drop-shadow(0_30px_40px_oklch(0_0_0_/_0.45))]">
           <Image
             src="/calculator/social-left.webp"
             alt=""
             width={400}
             height={800}
             sizes="(max-width: 900px) 0px, (max-width: 1100px) 220px, 280px"
             className="w-[clamp(220px,20vw,280px)] h-auto"
           />
         </div>

         {/* Heading + logos + testimonial — unchanged structure, just no border/bg */}
         <div className="relative z-[1] flex flex-col items-center gap-[18px] max-w-[820px] mx-auto">
           <h2 className={hpH2Class}>{t.rich("social.line", { em: emChunk, strong: (chunks) => <strong>{chunks}</strong> })}</h2>
           <div className="inline-flex flex-wrap justify-center gap-3"> … logos … </div>
           <figure className="…"> … testimonial unchanged … </figure>
         </div>

         {/* Right mockup */}
         <div className="hidden min-[900px]:block absolute right-0 bottom-[10%] z-0 pointer-events-none [filter:drop-shadow(0_30px_40px_oklch(0_0_0_/_0.45))]">
           <Image
             src="/calculator/social-right.webp"
             alt=""
             width={1000}
             height={600}
             sizes="(max-width: 900px) 0px, (max-width: 1100px) 300px, 380px"
             className="w-[clamp(300px,28vw,380px)] h-auto"
           />
         </div>
       </div>
     </div>
   </section>
   ```

   Breakpoint `900px` mirrors the existing pull-quote rule: mockups hidden ≤900px so they don't cramp the central content.

4. The testimonial `<figure>` stays inside its bordered card — the user said "remove the section border", not the testimonial border. Keep it.

**Verify**:
- Calculator page: outer social section no longer has the rounded card outline; heading is sized as an h2 (matches sibling section headings); two mockups sit symmetrically left/right behind the content from 900px up.
- ≤900px: mockups hidden, heading + logos + testimonial stack vertically.
- A11y: images have empty `alt` (decorative); heading remains a single h2 per section.

## Cross-cutting verification (after all tasks)

1. `npm run lint` — clean.
2. `npm run build` — typechecks + builds.
3. `npm run dev` and walk the About + Calculator pages at four widths: 360, 800, 1100, 1440. Capture screenshots for the PR.
4. Confirm no PNGs left in `public/` root (`Get-ChildItem public/*.png`).
5. `grep -r "calc social\|differences.png\|hero.png\|logo.png" src` returns nothing (no stale references to old paths).

## Out of scope

- English version of any text — Task 6 doesn't change `messages/en.json`. If `social.line` copy itself needs adjustment for h2 emphasis, that's a follow-up content change.
- Animation/parallax on the bento background images. Static drop-shadow only.
- Restoring the "Хто ми" section — depends on a team photo that doesn't exist yet.

## Files changed (summary)

- `public/about/hero.webp` (new), `public/about/values-logo.webp` (new), `public/about/differences.webp` (new), `public/calculator/social-left.webp` (new), `public/calculator/social-right.webp` (new) — Task 1.
- `public/{hero,logo,differences,calc social left,calc social right}.png` — deleted — Task 1.
- `src/app/about/page.tsx` — Tasks 2, 3, 4, 5b.
- `src/components/blocks/page-hero/index.tsx` — Task 5a.
- `src/components/calculator/WebsiteCalculator.tsx` — Task 6.

No content/i18n file changes required.
