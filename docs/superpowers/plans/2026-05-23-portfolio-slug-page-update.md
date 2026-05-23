# Portfolio Slug Page Update Plan

**Goal:** Align `/portfolio/[slug]` (+ `/en/...`) with home-page visual language. Single renderer: `Frontend/src/components/case-page/index.tsx`.

**Architecture:** Reuse existing components. Two Sanity schema additions (`hero.heroImage`, `imageTextBlock.image2` + `centeredLayout`); no new block types. CMS data fixes shipped as both seed edits + editor checklist.

---

## Audit summary

| # | Requirement | Status | Fix |
|---|---|---|---|
| 1 | All headings → Actay-Wide | ✅ already global via `globals.css:83` (`h1,h2,h3,.hp-h2,…`) | verify only |
| 2 | Hero image (separate field, right of text, above MetaStrip) | ❌ `PageHero` is text-only; no `heroImage` field in Sanity | add field + prop |
| 3 | "Other projects" → white pill button | ❌ uses `.hp-link` (underline) at `case-page/index.tsx:663` | swap to `.btn-primary .hp-section-cta` (home page pattern, `cases.tsx:106`) |
| 4 | CTA → home-style (text + image + contacts link) | ❌ uses `FinalCta3` (3 cards) | replace with `<LaunchCta locale={locale}/>` (translations already in `messages/*.json`) |
| 5 | Outcome → text middle, images on sides | ❌ centered variant stacks vertically | rework `imageTextBlock` schema (add `image2`, `centeredLayout`) + `ImageText` component (new horizontal layout, adapted from `.hp-pqs-slide-inner`); drop YT embed + ScreenshotPending fallback for centered |
| 6 | Hero "Wordpress" → "Tilda" | ❌ seed `seed-efedra-clinic.ts:219` (`застарілого WordPress`); seed comment line 17 already flags this | fix seed + editor checklist |
| 7 | Solution "platform" → "site" | ❌ seed `seed-efedra-clinic.ts:284` (`над платформою`) | fix seed + editor checklist |
| 8 | Localization audit | All page chrome ternaries OK; all case content via `loc()`; Efedra is UA-only by design | editor checklist for new fields |

---

## Tasks

### Task 1 — Verify headings (no-op expected)

`grep -RnE "<h[1-3]" Frontend/src/components/{case-page,blocks/page-hero,blocks/image-text,blocks/launch-cta}` — all hits should be `h1`/`h2`/`h3` (covered by globals.css). Anything styled as a heading via `<div>`/`<p>` → fix the tag.

### Task 2 — Sanity schema + GROQ

**Files:** `Sanity/schemaTypes/documents/caseStudy.ts`, `Sanity/schemaTypes/blocks/imageTextBlock.ts`, `Sanity/queries/caseStudy.ts`.

1. Add to `hero` fields (above `metrics`):
   ```ts
   defineField({ name: 'heroImage', title: 'Зображення hero (справа від тексту, над stats-bar)', type: 'imageWithLocalizedAlt' }),
   ```
2. In `imageTextBlock`, after `image`, add:
   ```ts
   defineField({ name: 'image2', title: 'Друге зображення (centered + horizontal)', type: 'imageWithLocalizedAlt', hidden: ({parent}) => parent?.variant !== 'centered' }),
   defineField({ name: 'centeredLayout', title: 'Centered layout', type: 'string',
     options: { list: [{title:'Vertical', value:'vertical'},{title:'Horizontal (text middle, 2 side images)', value:'horizontal'}], layout: 'radio' },
     initialValue: 'vertical', hidden: ({parent}) => parent?.variant !== 'centered' }),
   ```
3. GROQ `CASE_STUDY_BY_SLUG_QUERY` — project new image fields:
   - In `hero{...}` add `"heroImage": heroImage ${IMAGE_WITH_ALT},`
   - Replace `sections[]{ _type, _key, ... }` with a typed projection that keeps `...` and adds:
     ```groq
     _type == "imageTextBlock" => { "image": image ${IMAGE_WITH_ALT}, "image2": image2 ${IMAGE_WITH_ALT} },
     _type == "mediaGalleryBlock" => { images[]{ _key, "image": image ${IMAGE_WITH_ALT}, caption ${LOCALIZED_STRING}, alt ${LOCALIZED_STRING}, displayMode, objectPosition } }
     ```

Verify in Studio (`npm run dev`); commit in Sanity repo.

### Task 3 — TS types mirror schema

`Frontend/src/types/sanity.ts`: add `heroImage?: ImageWithLocalizedAlt | null` to `hero`; add `image2?: ImageWithLocalizedAlt | null; centeredLayout?: "vertical" | "horizontal"` to `imageTextBlock` section. `npx tsc --noEmit` clean.

### Task 4 — `PageHero` accepts `image`

`Frontend/src/components/blocks/page-hero/index.tsx`: add `image?: ReactNode` prop. When set, wrap text + image in `<div className="page-hero-grid">`; when not set, render the existing single-column markup unchanged.

`Frontend/src/components/blocks/page-hero/page-hero.css`: append
```css
.page-hero-grid { display:grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap:48px; align-items:center; }
.page-hero-image { position:relative; border-radius:22px; overflow:hidden; border:1px solid var(--line); background:oklch(1 0 0 / 0.02); aspect-ratio:4/3; }
.page-hero-image > :is(img,svg,video) { width:100%; height:100%; object-fit:cover; object-position:top; display:block; }
@media (max-width:960px){ .page-hero-grid{grid-template-columns:1fr; gap:32px} .page-hero-image{aspect-ratio:16/9} }
```

### Task 5 — Wire `hero.heroImage` into `PageHero`

`Frontend/src/components/case-page/index.tsx`, in `CasePageView`:
```tsx
const heroImageNode = doc.hero?.heroImage?.asset?.url ? (
  <SanityImg image={doc.hero.heroImage} alt={loc(doc.hero.heroImage.alt, locale) || title} fill className="object-cover object-top" />
) : null;
```
Pass `image={heroImageNode}` to `<PageHero>`. Leave `<MetaStrip>` untouched — it stays below as the separate stats band.

### Task 6 — White pill button on "All cases" link

Same file, add `import "@/components/blocks/buttons/buttons.css";` at top. Replace the `.hp-link` related-cases CTA (line ~663):
```tsx
<Link href={locale === "en" ? "/en/portfolio" : "/portfolio"} className="btn-primary hp-section-cta">
  <span>{relatedLink}</span>
  <ArrowUpRight size={18} strokeWidth={1.8} />
</Link>
```
(Locale fix bundled — old code hard-linked to `/portfolio`.)

### Task 7 — Replace `FinalCta3` with `LaunchCta`

Same file:
- Drop `FinalCta3` from the homepage import; add `import { LaunchCta } from "@/components/blocks/launch-cta";`.
- Delete the now-unused `finalHeading` / `finalSub` ternaries (~lines 607-620).
- Replace `<FinalCta3 ... />` with `<LaunchCta locale={locale} />`.

### Task 8 — `ImageText` horizontal centered layout

`Frontend/src/components/blocks/image-text/index.tsx`:
- Add to props: `secondImage?: React.ReactNode; centeredLayout?: "vertical" | "horizontal";`.
- In the `isCentered` branch, if `centeredLayout === "horizontal"` AND both `image` and `secondImage` are truthy, render:
  ```tsx
  <section className={cn("image-text-centered-horizontal", sectionClassName)}>
    <div className="ithc-inner">
      <div className="ithc-mockup ithc-mockup--left" aria-hidden="true">{image}</div>
      <div className="ithc-body">
        {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
        <h2 className="ithc-h2">{heading}</h2>
        <div className="ithc-text">{bodyArr.map((p,i)=><p key={i}>{p}</p>)}</div>
        {showList && <ul className={listClass}>{/* same bullet markup as existing centered */}</ul>}
      </div>
      <div className="ithc-mockup ithc-mockup--right">{secondImage}</div>
    </div>
  </section>
  ```
- Otherwise fall through to the existing vertical centered render.

`image-text.css` — append CSS adapted from `pull-quote-swiper.css` (`.hp-pqs-slide-inner`, `.hp-pqs-mockup--left/--right`), renamed to `.ithc-*`. Mockups absolutely positioned at `left:0` / `right:0`, hide ≤900px, copy goes full-width below.

Key rules (full block omitted — pattern-match the swiper CSS):
```css
.image-text-centered-horizontal { position:relative; padding:var(--section-y) 0; overflow:hidden; background:var(--bg); }
.ithc-inner { position:relative; max-width:var(--container-max); margin:0 auto; padding:48px 24px; min-height:480px; display:flex; align-items:center; justify-content:center; }
.ithc-body { position:relative; z-index:2; max-width:var(--container-prose); text-align:center; padding:32px 16px; background: radial-gradient(ellipse at center, oklch(0.18 0.008 60 / 0.7), oklch(0.18 0.008 60 / 0) 70%); display:flex; flex-direction:column; align-items:center; }
.ithc-h2 { margin:16px 0 0; font-weight:700; font-size:clamp(28px,3.4vw,44px); line-height:1.1; letter-spacing:-0.02em; color:var(--ink); }
.ithc-h2 em { font-style:italic; background:linear-gradient(180deg, var(--accent-soft), var(--accent)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.ithc-text { margin-top:18px; display:flex; flex-direction:column; gap:12px; }
.ithc-text p { margin:0; font-family:'Manrope',sans-serif; font-size:16px; line-height:1.6; color:var(--ink-2); }
.ithc-mockup { position:absolute; z-index:1; display:flex; pointer-events:none; filter:drop-shadow(0 30px 40px oklch(0 0 0 / 0.45)); }
.ithc-mockup img { width:100%; height:auto; display:block; }
.ithc-mockup--left  { bottom:6%;  left:0;  max-width:280px; }
.ithc-mockup--right { bottom:10%; right:0; max-width:380px; }
@media (max-width:1100px){ .ithc-mockup--left{max-width:220px} .ithc-mockup--right{max-width:300px} .ithc-inner{min-height:440px} }
@media (max-width:900px){ .ithc-mockup{display:none} .ithc-inner{min-height:320px; padding:32px 16px} }
@media (max-width:640px){ .ithc-inner{min-height:280px; padding:24px 12px} .ithc-body{padding:16px 8px} }
```

### Task 9 — Rewire case-page `imageTextBlock` mapper

`Frontend/src/components/case-page/index.tsx`, in the `case "imageTextBlock":` branch:

**Centered branch (rewrite):**
```tsx
if (section.variant === "centered") {
  const img1 = section.image?.asset?.url
    ? <SanityImg image={section.image}  alt={loc(section.image.alt, locale)  || loc(section.heading, locale) || loc(doc.title, locale)} width={560} height={1120} />
    : null;
  const img2 = section.image2?.asset?.url
    ? <SanityImg image={section.image2} alt={loc(section.image2.alt, locale) || loc(section.heading, locale) || loc(doc.title, locale)} width={760} height={475} />
    : null;
  return (
    <ImageText variant="centered" centeredLayout={section.centeredLayout ?? "vertical"}
      eyebrow={loc(section.eyebrow, locale) || undefined}
      heading={formatLine(loc(section.heading, locale)) ?? ""}
      body={<PortableInline value={pickRichText(section.body, section.bodyEn, locale)} />}
      bulletList={section.bulletList?.map(b => loc(b, locale))}
      image={img1} secondImage={img2} />
  );
}
```

**Non-centered branch:** keep existing logic (image + `ScreenshotPending` fallback retained here only).

**Delete** the `YouTubeEmbed` helper (lines ~300-316). Verify no other references: `grep -Rn YouTubeEmbed Frontend/src`.

(Optional) `Sanity/schemaTypes/documents/caseStudy.ts` line ~115 — rename `youtubeId` title to "(наразі не використовується)" so editors know it's dead. Keep the field for back-compat.

### Task 10 — Update Efedra seed

`Sanity/scripts/seed-efedra-clinic.ts`:
- L17 (JSDoc): drop the "WordPress vs Tilda" inconsistency note; keep the "UA-only" sentence.
- L219: `WordPress` → `Tilda` (`застарілого WordPress` → `застарілої Tilda`).
- L284: `платформою` → `сайтом`.
- `HERO` object: add `heroImage: imageWithAlt(afterId, "Efedra Clinic — новий сайт на Next.js та Sanity"),` above `metrics`.
- `OUTCOME_SECTION`: add `centeredLayout: "horizontal"`, `image: imageWithAlt(mobileId, "...мобільна версія...")`, `image2: imageWithAlt(afterId, "...десктоп версія головної...")`. Drop the trailing bullet list nothing (keep existing bullets).
- Re-seed (`npm run seed:efedra-clinic`) **only if** Task 11 hasn't been applied in Studio — `createOrReplace` clobbers hand-edits.

### Task 11 — Editor checklist (CMS, no code)

Paste to marketer:

```
caseStudy.efedra-clinic — UK-only

1. Hero → Subheading: "WordPress" → "Tilda"
   "...Перенесли з застарілої Tilda на Next.js + Sanity..."

2. Sections → "/ 03 SOLUTION" → bullet 7:
   "Відсутність абонплати — повний контроль над сайтом"

3. Hero → "Зображення hero" (NEW): upload hero screenshot (right of text,
   above stats-bar). Distinct from coverImage (which is for /portfolio cards).
   alt.uk required.

4. Sections → "/ 04 OUTCOME":
   - Centered layout: "Horizontal".
   - "Зображення" → phone/portrait screenshot (left side).
   - "Друге зображення" (NEW) → laptop/landscape screenshot (right side).
   - alt.uk required on both. (caseStudy.youtubeId is no longer rendered.)

5. For every other case study, audit these fields (UK + EN if bilingual):
   title, region, duration, metricsLine, coverImage.alt, seo.{title,description},
   hero.{eyebrow, heading, subheading, heroImage.alt},
   each section: eyebrow, heading, body (UK), bodyEn (EN), bulletList,
     image.alt, image2.alt (centered+horizontal), image.caption (gallery),
     cta.label,
   quoteBlock: quote, authorRole.
   Missing EN.title → /en/<slug> returns 404 by design.
```

---

## Risks / order

- Sanity schema (Task 2) before frontend types (Task 3) before consumers (Tasks 5, 9).
- Task 9 deletes `YouTubeEmbed` — grep first.
- Task 2 changes `sections[]` GROQ from bare `...` to typed projection; fetch one case after deploy to verify other section types still come through.
- Task 10 re-seed will clobber Studio edits — pick one path (seed-first OR editor-first).

---

## Execution

Run via `superpowers:subagent-driven-development` (fresh subagent per task) or `superpowers:executing-plans` (batched inline). Which approach?
