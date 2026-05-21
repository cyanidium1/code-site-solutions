# PullQuote → PullQuoteSwiper rework plan

Replace the static `PullQuote` block on the homepage with a Sanity-driven slider showing one testimonial at a time. Desktop layout mirrors today's PullQuote (centered quote + author block) but adds **two flanking images** — phone mockup on the left, laptop mockup on the right. Slider supports keyboard, touch, and click navigation, and pulls all entries from Sanity.

References used throughout:
- Current block: [src/components/homepage/index.tsx:786-851](../src/components/homepage/index.tsx#L786-L851) (`PullQuote` export)
- Current styles: [src/components/homepage/homepage.css:1175-1257](../src/components/homepage/homepage.css#L1175-L1257) (`.hp-pull*`)
- Homepage usage: [src/app/page.tsx:268-278](../src/app/page.tsx#L268-L278)
- Existing testimonial schema (section-level, industry pages): [src/lib/sanity/types.ts:324-329](../src/lib/sanity/types.ts#L324-L329)
- Sanity client/fetch: [src/lib/sanity/client.ts](../src/lib/sanity/client.ts), [src/lib/sanity/fetch.ts](../src/lib/sanity/fetch.ts)
- Sanity image renderer: [src/lib/sanity/image.tsx](../src/lib/sanity/image.tsx)
- Reference Swiper wrapper to adapt: `example/src/components/shared/swiper/SwiperWrapper.tsx` (folder is local-only — see Step 0)

---

## Locked decisions

| # | Question | Decision |
|---|---|---|
| Q1 | Slider library + wrapper | **Swiper** + custom `SwiperWrapper` adapted from `example/`. Wrapper provides arrow nav with disabled-state, configurable button position, optional Coverflow effect. Re-themed for our dark/purple palette using Lucide `ChevronLeft`/`ChevronRight` (not the example's external `ShevronIcon`). |
| Q2 | Content model | **Standalone `testimonial` document collection** (multiple docs, queryable site-wide). Sort by `order asc, _createdAt desc`. `featured` boolean reserved for future filtering (homepage filters `featured == true`). |
| Q3 | Images | **Fresh uploads per testimonial entry** (`mockupLeft` + `mockupRight` image fields with localized alt). |
| Q4 | Mobile layout | **Stack the phone mockup (`mockupLeft`) above the quote**, laptop mockup hidden. Phone fits a mobile screen visually; laptop framing would shrink to unreadable. Max-width 200px, centered. Falls back to quote-only if `mockupLeft` is missing. |
| Q5 | Controls | **Arrow buttons + keyboard + touch. No autoplay. Looping enabled.** Matches the example wrapper's default and the project's existing nav patterns (header dropdown chevron, calculator sliders). Buttons centered below the slide. Skip pagination dots — arrows are enough for ≤5 testimonials and reduce visual noise next to the quote. |
| Q6 | Case link | **Sanity reference to a `caseStudy` doc.** Resolved to `/portfolio/<slug>` (or `/en/portfolio/<slug>` per locale and the `hasEnCase` guard) the same way `Cases` block does at [homepage/index.tsx:649-672](../src/components/homepage/index.tsx#L649-L672). Optional. |
| Q7 | Studio schema | **Drafted in this plan** (Step 2a) for implementation in the sibling admin repo. Frontend code lands first, schema follows, then seed runs. |

---

## Step 0 — Gitignore the `example/` reference folder

`example/` holds the SwiperWrapper reference code the user provided. It must not be committed.

Add to `.gitignore`:
```
# Local-only reference code (Swiper wrapper template etc.)
/example
```

**Verification:** `git status --short` does not list any `example/` entries; `git check-ignore example` exits 0.

---

## Component & file inventory

### New (committed)
- `src/components/shared/swiper/SwiperWrapper.tsx` — generic reusable wrapper, adapted from `example/`, retheme'd for our palette.
- `src/components/shared/swiper/swiper-wrapper.css` — minimal supporting CSS (arrow button colors, disabled state).
- `src/components/homepage/pull-quote-swiper/index.tsx` — RSC shell that fetches and renders.
- `src/components/homepage/pull-quote-swiper/client.tsx` — client component using `SwiperWrapper`.
- `src/components/homepage/pull-quote-swiper/pull-quote-swiper.css` — slide-specific layout (3-col grid → mobile stack).
- `src/components/homepage/pull-quote-swiper/fetch-testimonials.ts` — typed server-side fetcher.
- `scripts/seed-homepage-testimonials.ts` — idempotent seed (creates 2 `testimonial` docs).
- `docs/sanity-schema/testimonial.draft.ts` — **studio schema draft**, copy into the admin repo's `schemas/` folder (or wherever testimonials should live).

### Modified
- `.gitignore` — add `/example` (Step 0).
- `package.json` — add `swiper` dependency; add `seed:homepage-testimonials` script.
- `src/lib/sanity/queries.ts` — add `HOMEPAGE_TESTIMONIALS_QUERY`.
- `src/lib/sanity/types.ts` — add `Testimonial` doc type + slide payload type.
- `src/components/homepage/index.tsx` — keep `PullQuote` exported (no breakage for future consumers); add `PullQuoteSwiper` re-export.
- `src/app/page.tsx`, `src/app/en/page.tsx` — replace `<PullQuote ... />` with `<PullQuoteSwiper locale="..." />`. Component is `async` (RSC) and self-fetches.

### Untouched
- The original `PullQuote` component itself (kept for any future use outside the homepage).
- Other Sanity schemas, fetchers, image helpers.

---

## Step 1 — Install Swiper

```powershell
npm install swiper
```

Swiper 11+. React bindings live in `swiper/react`; modules tree-shake. The example uses `Navigation` + `EffectCoverflow` — we'll need `Navigation` + `Keyboard` + `A11y` (Coverflow is optional, off by default in the wrapper).

**Verification:** `npm ls swiper` shows v11+; no peer-dep warnings; `npm run typecheck` clean.

---

## Step 2 — Sanity schema

### 2a. Studio schema draft (commit to `docs/sanity-schema/testimonial.draft.ts`)

The studio lives in a sibling admin repo per the comments in `scripts/seed-nbyg-kobenhavn.ts`. We ship the schema text in this PR as a draft file so the studio maintainer can copy/adapt:

```ts
// schemas/testimonial.ts — draft for admin repo
import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role / company",
      type: "localizedString",
    }),
    defineField({
      name: "authorInitials",
      title: "Author initials (avatar fallback)",
      type: "string",
      validation: (r) => r.max(3),
      description: "Up to 3 letters. Auto-derived from authorName if blank.",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "localizedText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mockupLeft",
      title: "Phone mockup (left on desktop, above quote on mobile)",
      type: "imageWithLocalizedAlt",
    }),
    defineField({
      name: "mockupRight",
      title: "Laptop mockup (right on desktop, hidden on mobile)",
      type: "imageWithLocalizedAlt",
    }),
    defineField({
      name: "caseRef",
      title: "Linked case study",
      type: "reference",
      to: [{ type: "caseStudy" }],
    }),
    defineField({
      name: "caseLabel",
      title: "Case-study link label",
      type: "localizedString",
      description: "Falls back to a localized default (\"See the full case study\" / \"Подивитись повний кейс\") if empty.",
    }),
    defineField({
      name: "featured",
      title: "Featured (show on homepage)",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "authorRole.en", media: "mockupLeft.image" },
  },
  orderings: [
    { title: "Order, ascending", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
```

The doc references existing studio types: `localizedString`, `localizedText`, `imageWithLocalizedAlt`, `caseStudy`. All already exist per the projections in [queries.ts](../src/lib/sanity/queries.ts).

### 2b. Frontend types — `src/lib/sanity/types.ts`

Append near the existing testimonial section (~line 329):

```ts
export type Testimonial = {
  _id: string;
  authorName?: string;
  authorRole?: LocalizedString;
  authorInitials?: string;
  linkedinUrl?: string;
  quote?: LocalizedText;
  mockupLeft?: SanityImage | null;
  mockupRight?: SanityImage | null;
  caseRef?: { slug?: string } | null;
  caseLabel?: LocalizedString;
  featured?: boolean;
  order?: number;
};
```

### 2c. Frontend query — `src/lib/sanity/queries.ts`

```ts
export const HOMEPAGE_TESTIMONIALS_QUERY = /* groq */ `
*[_type == "testimonial" && featured == true]{
  _id,
  authorName,
  authorRole ${LOCALIZED_STRING},
  authorInitials,
  linkedinUrl,
  quote ${LOCALIZED_TEXT},
  "mockupLeft": mockupLeft ${IMAGE_WITH_ALT},
  "mockupRight": mockupRight ${IMAGE_WITH_ALT},
  "caseRef": caseRef->{ "slug": slug.current },
  caseLabel ${LOCALIZED_STRING},
  featured,
  order
} | order(order asc, _createdAt desc)
`;
```

**Verification:** `npm run typecheck` clean. Run a one-off `sanityFetch<Testimonial[]>({ query: HOMEPAGE_TESTIMONIALS_QUERY })` in a scratch script and log to confirm shape.

---

## Step 3 — Seed script

`scripts/seed-homepage-testimonials.ts` — patterned on [seed-nbyg-kobenhavn.ts](../scripts/seed-nbyg-kobenhavn.ts):

- Loads `.env.local` for `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`.
- Creates **at least 2** `testimonial` docs with fixed `_id`s (e.g. `testimonial.nbyg-kobenhavn`, `testimonial.placeholder-2`) using `createOrReplace` for idempotency.
- Seed entry #1 = current homepage testimonial (Søren Hansen / NBYG København) including localized quote (UA + EN) — without `mockupLeft/Right` images for now (founder must supply). Script logs `TODO: upload mockupLeft/Right for testimonial.<id>` when fields are empty.
- Seed entry #2 = TBD placeholder with `featured: false` so it doesn't show up until copy/images land. Lets us confirm filtering works.
- Both reference the existing `caseStudy` doc by `_ref` where applicable (NBYG case).
- Adds `npm` script: `"seed:homepage-testimonials": "tsx scripts/seed-homepage-testimonials.ts"`.

**Verification:** run `npm run seed:homepage-testimonials`. Sanity studio shows 2 documents. `GROQ` query in Studio's Vision plugin (`*[_type == "testimonial" && featured == true]`) returns the seeded NBYG entry.

---

## Step 4 — Fetcher

`src/components/homepage/pull-quote-swiper/fetch-testimonials.ts`:

```ts
import { sanityFetch } from "@/lib/sanity/fetch";
import { HOMEPAGE_TESTIMONIALS_QUERY } from "@/lib/sanity/queries";
import { loc } from "@/lib/sanity/locale";
import { hasEnCase } from "@/lib/i18n-routes";
import type { Locale, Testimonial } from "@/lib/sanity/types";

export type TestimonialAsset = {
  src: string;
  alt: string;
  lqip?: string;
  width?: number;
  height?: number;
};

export type TestimonialSlide = {
  key: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  linkedinUrl?: string;
  mockupLeft?: TestimonialAsset;
  mockupRight?: TestimonialAsset;
  caseHref?: string;
  caseLabel?: string;
};

function deriveInitials(name?: string) {
  if (!name) return "";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function toAsset(img: Testimonial["mockupLeft"], locale: Locale): TestimonialAsset | undefined {
  if (!img?.asset?.url) return undefined;
  return {
    src: img.asset.url,
    alt: loc(img.alt, locale) || "",
    lqip: img.asset.metadata?.lqip,
    width: img.asset.metadata?.dimensions?.width,
    height: img.asset.metadata?.dimensions?.height,
  };
}

function resolveCaseHref(slug: string | undefined, locale: Locale): string | undefined {
  if (!slug) return undefined;
  if (locale === "en") return hasEnCase(slug) ? `/en/portfolio/${slug}` : `/portfolio/${slug}`;
  return `/portfolio/${slug}`;
}

export async function fetchTestimonialSlides(locale: Locale): Promise<TestimonialSlide[]> {
  const docs = await sanityFetch<Testimonial[] | null>({
    query: HOMEPAGE_TESTIMONIALS_QUERY,
    revalidate: 300,
    tags: ["homepage-testimonials"],
  });
  if (!docs?.length) return [];

  return docs
    .map<TestimonialSlide>((t) => ({
      key: t._id,
      quote: loc(t.quote, locale) || "",
      authorName: t.authorName || "",
      authorRole: loc(t.authorRole, locale) || "",
      authorInitials: t.authorInitials || deriveInitials(t.authorName),
      linkedinUrl: t.linkedinUrl,
      mockupLeft: toAsset(t.mockupLeft, locale),
      mockupRight: toAsset(t.mockupRight, locale),
      caseHref: resolveCaseHref(t.caseRef?.slug, locale),
      caseLabel: loc(t.caseLabel, locale) || undefined,
    }))
    .filter((s) => s.quote.trim().length > 0);
}
```

5-minute `revalidate` matches the pattern used elsewhere. Tag `homepage-testimonials` lets a future on-demand revalidate hook target this single dataset.

---

## Step 5 — Generic `SwiperWrapper` (adapted from `example/`)

`src/components/shared/swiper/SwiperWrapper.tsx`:

Identical surface to the example component (same prop shape, same module-loading pattern, same prev/next ref dance) but with two adaptations for our codebase:

1. **Replace `ShevronIcon`** with Lucide's `ChevronLeft` + `ChevronRight` (Lucide is already used everywhere).
2. **Theme the arrow buttons** for dark/purple instead of white-on-dark. Move the hard-coded Tailwind classes out of the wrapper and into a small CSS file so theming can change without re-editing the wrapper.

```tsx
"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import { ReactNode, useRef, useLayoutEffect, useState } from "react";
import { Navigation, EffectCoverflow, Keyboard, A11y } from "swiper/modules";
import { Swiper } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import type { Swiper as SwiperType } from "swiper";
import type { SwiperModule } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import "./swiper-wrapper.css";

interface SwiperWrapperProps {
  children: ReactNode;
  breakpoints?: SwiperOptions["breakpoints"];
  swiperClassName?: string;
  loop?: boolean;
  uniqueKey?: string;
  buttonsPosition?: "right" | "center" | "onSlides";
  component?: ReactNode;
  additionalModules?: SwiperModule[];
  additionalOptions?: Partial<SwiperOptions>;
  showNavigation?: boolean;
  buttonsClassName?: string;
  showCoverflowEffect?: boolean;
  centeredSlides?: boolean;
  onSwiper?: (swiper: SwiperType) => void;
  onSlideChange?: (swiper: SwiperType) => void;
}

const buttonsPositionClass = {
  right: "sm:justify-end sm:ml-auto",
  center: "sm:justify-center",
  onSlides: "w-full justify-between",
};

export default function SwiperWrapper({
  children,
  breakpoints,
  swiperClassName,
  loop = false,
  buttonsPosition = "right",
  uniqueKey,
  component,
  additionalModules = [],
  additionalOptions = {},
  showNavigation = true,
  buttonsClassName,
  showCoverflowEffect = false,
  centeredSlides = false,
  onSwiper,
  onSlideChange,
}: SwiperWrapperProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const navigationSetupRef = useRef(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const setupNavigation = (swiperInstance: SwiperType) => {
    if (
      prevRef.current &&
      nextRef.current &&
      swiperInstance.params.navigation &&
      typeof swiperInstance.params.navigation === "object" &&
      !navigationSetupRef.current
    ) {
      navigationSetupRef.current = true;
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();

      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);

      swiperInstance.on("slideChange", () => {
        if (swiperInstanceRef.current) {
          setIsBeginning(swiperInstanceRef.current.isBeginning);
          setIsEnd(swiperInstanceRef.current.isEnd);
        }
      });
    }
  };

  useLayoutEffect(() => {
    if (!showNavigation) return;
    const swiperInstance = swiperInstanceRef.current;
    if (swiperInstance && prevRef.current && nextRef.current) {
      setupNavigation(swiperInstance);
    }
  });

  const modules = [
    ...(showNavigation ? [Navigation] : []),
    ...(showCoverflowEffect ? [EffectCoverflow] : []),
    Keyboard,
    A11y,
    ...additionalModules,
  ];

  return (
    <>
      <Swiper
        key={`${uniqueKey}-swiper`}
        onSwiper={(swiper) => {
          swiperInstanceRef.current = swiper;
          onSwiper?.(swiper);
        }}
        onSlideChange={onSlideChange}
        centeredSlides={centeredSlides}
        breakpoints={breakpoints}
        navigation={showNavigation ? { prevEl: ".custom-prev", nextEl: ".custom-next" } : false}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        loop={loop}
        speed={1000}
        coverflowEffect={
          showCoverflowEffect
            ? { rotate: 0, depth: 100, stretch: 0, modifier: 1, slideShadows: false }
            : {}
        }
        effect={showCoverflowEffect ? "coverflow" : undefined}
        modules={modules}
        className={swiperClassName}
        {...additionalOptions}
      >
        {children}
      </Swiper>
      {showNavigation && (
        <div
          key={`${uniqueKey}-buttons`}
          className={twMerge(
            "swiper-nav-row flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-10 mb-0.5",
            buttonsClassName,
          )}
        >
          {component}
          <div
            className={`flex justify-between sm:gap-3 items-center pointer-events-none ${buttonsPositionClass[buttonsPosition]}`}
          >
            <button
              ref={prevRef}
              aria-label="Previous slide"
              disabled={isBeginning && !loop}
              className="swiper-nav-btn"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next slide"
              disabled={isEnd && !loop}
              className="swiper-nav-btn"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
      {!showNavigation && component && (
        <div key={`${uniqueKey}-component`}>{component}</div>
      )}
    </>
  );
}
```

`src/components/shared/swiper/swiper-wrapper.css`:

```css
.swiper-nav-btn {
  position: relative;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  background: oklch(1 0 0 / 0.04);
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.2s, border-color 0.2s, opacity 0.2s, transform 0.2s;
}
.swiper-nav-btn:hover:not(:disabled) {
  background: oklch(from var(--accent) l c h / 0.12);
  border-color: oklch(from var(--accent) l c h / 0.5);
  transform: translateY(-1px);
}
.swiper-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.swiper-nav-btn:focus-visible {
  outline: 2px solid var(--accent-soft);
  outline-offset: 2px;
}
```

This `SwiperWrapper` is generic — future blocks (Cases carousel, Process carousel, etc.) can reuse it without copy-pasting Swiper setup boilerplate.

---

## Step 6 — `PullQuoteSwiper` consumer

### 6a. RSC shell — `src/components/homepage/pull-quote-swiper/index.tsx`

```tsx
import { fetchTestimonialSlides } from "./fetch-testimonials";
import type { Locale } from "@/lib/sanity/types";
import { PullQuoteSwiperClient } from "./client";
import "./pull-quote-swiper.css";

export async function PullQuoteSwiper({ locale = "uk" }: { locale?: Locale }) {
  const slides = await fetchTestimonialSlides(locale);
  if (slides.length === 0) return null; // hide entirely if no testimonials
  return (
    <section className="hp-section">
      <div className="hp-pqs">
        <div className="hp-pqs-bg" aria-hidden="true" />
        <PullQuoteSwiperClient slides={slides} />
      </div>
    </section>
  );
}
```

Wrapping in `.hp-section` inherits the unified `--gutter-x` + `--section-y` rhythm from the audit work.

### 6b. Client child — `src/components/homepage/pull-quote-swiper/client.tsx`

```tsx
"use client";

import { SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, ArrowUpRight } from "lucide-react";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import "@/components/blocks/buttons/buttons.css";
import type { TestimonialSlide } from "./fetch-testimonials";

export function PullQuoteSwiperClient({ slides }: { slides: TestimonialSlide[] }) {
  const single = slides.length <= 1;
  return (
    <SwiperWrapper
      uniqueKey="hp-pqs"
      swiperClassName="hp-pqs-swiper"
      loop={!single}
      showNavigation={!single}     // hide arrows when only 1 testimonial
      buttonsPosition="center"
      buttonsClassName="hp-pqs-nav-row"
      centeredSlides
      additionalOptions={{ slidesPerView: 1 }}
    >
      {slides.map((s) => (
        <SwiperSlide key={s.key}>
          <Slide slide={s} />
        </SwiperSlide>
      ))}
    </SwiperWrapper>
  );
}

function Slide({ slide }: { slide: TestimonialSlide }) {
  return (
    <article className="hp-pqs-slide">
      {slide.mockupLeft ? (
        <div className="hp-pqs-mockup hp-pqs-mockup--left">
          <Image
            src={slide.mockupLeft.src}
            alt={slide.mockupLeft.alt}
            width={slide.mockupLeft.width ?? 400}
            height={slide.mockupLeft.height ?? 800}
            placeholder={slide.mockupLeft.lqip ? "blur" : undefined}
            blurDataURL={slide.mockupLeft.lqip}
            sizes="(max-width: 700px) 200px, (max-width: 1100px) 220px, 280px"
          />
        </div>
      ) : null}

      <div className="hp-pqs-body">
        <blockquote className="hp-pqs-quote">«{slide.quote}»</blockquote>

        <div className="hp-pqs-author">
          {slide.authorInitials ? (
            <div className="hp-pqs-avatar">{slide.authorInitials}</div>
          ) : null}
          <div>
            <div className="hp-pqs-name">{slide.authorName}</div>
            <div className="hp-pqs-role">{slide.authorRole}</div>
          </div>
          {slide.linkedinUrl ? (
            <a
              href={slide.linkedinUrl}
              className="hp-pqs-li"
              target="_blank"
              rel="noreferrer"
              aria-label={`${slide.authorName} on LinkedIn`}
            >
              <Linkedin size={12} strokeWidth={1.6} /> LinkedIn
            </a>
          ) : null}
        </div>

        {slide.caseHref ? (
          <div className="hp-pqs-cta">
            <Link href={slide.caseHref} className="btn-primary">
              <span>{slide.caseLabel ?? "See the full case study"}</span>
              <ArrowUpRight size={18} strokeWidth={1.8} />
            </Link>
          </div>
        ) : null}
      </div>

      {slide.mockupRight ? (
        <div className="hp-pqs-mockup hp-pqs-mockup--right">
          <Image
            src={slide.mockupRight.src}
            alt={slide.mockupRight.alt}
            width={slide.mockupRight.width ?? 800}
            height={slide.mockupRight.height ?? 500}
            placeholder={slide.mockupRight.lqip ? "blur" : undefined}
            blurDataURL={slide.mockupRight.lqip}
            sizes="(max-width: 1100px) 0px, 360px"
          />
        </div>
      ) : null}
    </article>
  );
}
```

Notes:
- `single` slide → hide arrows + disable loop (Swiper warns otherwise; UX-wise there's nothing to navigate to).
- `«…»` punctuation stays — matches the existing PullQuote convention. **TODO** to localize in a follow-up (English usually uses `"…"`).
- `caseLabel` default is hard-coded EN. Same TODO: source from `messages/{uk,en}.json` once a localized default is needed.
- `<blockquote>` semantic upgrade (the audit deferred this — gets fixed here for free).

### 6c. Styles — `src/components/homepage/pull-quote-swiper/pull-quote-swiper.css`

Desktop (≥1100):

```css
.hp-pqs {
  position: relative;
  text-align: center;
  padding: 24px 0;
}
.hp-pqs-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 800px 360px at 50% 50%,
    oklch(from var(--accent) l c h / 0.10),
    transparent 70%
  );
}
.hp-pqs-swiper {
  position: relative;
  z-index: 1;
  max-width: var(--container-max);
  margin: 0 auto;
}

/* slide grid: phone | quote | laptop */
.hp-pqs-slide {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--container-prose)) minmax(0, 1fr);
  align-items: center;
  gap: 32px;
  padding: 24px;
}

.hp-pqs-mockup {
  display: flex;
  align-items: center;
  filter: drop-shadow(0 30px 40px oklch(0 0 0 / 0.45));
}
.hp-pqs-mockup--left  { justify-content: flex-end; }
.hp-pqs-mockup--right { justify-content: flex-start; }
.hp-pqs-mockup img {
  width: 100%;
  height: auto;
}
.hp-pqs-mockup--left img  { max-width: 240px; }
.hp-pqs-mockup--right img { max-width: 360px; }

.hp-pqs-body {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hp-pqs-quote {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: clamp(22px, 2.5vw, 32px);
  line-height: 1.4;
  color: var(--ink);
}
.hp-pqs-quote em {
  font-style: italic;
  background: linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.hp-pqs-author {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 36px;
}
.hp-pqs-avatar {
  display: inline-flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%);
  font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 18px; color: var(--bg);
}
.hp-pqs-name { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 16px; color: var(--ink); }
.hp-pqs-role { margin-top: 2px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-3); }
.hp-pqs-li {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-2);
  text-decoration: none; transition: color 0.2s;
}
.hp-pqs-li:hover { color: var(--ink); }
.hp-pqs-cta { margin-top: 32px; text-align: center; }

/* SwiperWrapper renders its nav row outside the Swiper element. We pull it
   centered with a top margin so the arrows sit below the slide. */
.hp-pqs-nav-row {
  margin-top: 32px;
  justify-content: center;
}
```

Tablet (≤1100):

```css
@media (max-width: 1100px) {
  .hp-pqs-slide {
    grid-template-columns: minmax(0, 200px) minmax(0, 1fr) minmax(0, 200px);
    gap: 20px;
  }
  .hp-pqs-mockup--left img  { max-width: 180px; }
  .hp-pqs-mockup--right img { max-width: 220px; }
}
```

Mobile (≤700) — phone stacks above quote, laptop hidden:

```css
@media (max-width: 700px) {
  .hp-pqs-slide {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 24px;
    padding: 16px 0;
  }
  .hp-pqs-mockup--left {
    justify-content: center;
    grid-row: 1;
  }
  .hp-pqs-mockup--left img { max-width: 200px; }
  .hp-pqs-body  { grid-row: 2; }
  .hp-pqs-mockup--right { display: none; }
  .hp-pqs-nav-row { margin-top: 24px; }
}
```

Swiper respects `prefers-reduced-motion` for its built-in transitions — no extra CSS needed; verify by toggling DevTools Rendering → "reduced motion".

---

## Step 7 — Wire into homepage

### 7a. UA — `src/app/page.tsx`

```diff
- <PullQuote
-   quote={
-     <>
-       Перед запуском нового сайту у нас було 3 заявки на місяць. Після
-       запуску — 24 у перший місяць. Команда написала контент,
-       провела QA, запустила. Нам залишилось лише отримати ключі.
-     </>
-   }
-   caseHref="/portfolio/nbyg-kobenhavn"
-   caseLabel="Подивитись повний кейс"
- />
+ <PullQuoteSwiper locale="uk" />
```

Remove the now-unused `PullQuote` from the `@/components/homepage` destructured import line. Update homepage CTA/quote content tests if any exist.

### 7b. EN — `src/app/en/page.tsx`

If the EN homepage has a corresponding PullQuote usage, swap it to `<PullQuoteSwiper locale="en" />` in the same slot (after the pricing section, before FAQ). If EN doesn't currently render one, add it where the UA page positions it for symmetry — but **only if Sanity has at least one `featured` testimonial with English content**, otherwise the section silently disappears (intended fallback).

### 7c. `src/components/homepage/index.tsx`

Append:
```ts
export { PullQuoteSwiper } from "./pull-quote-swiper";
```

Leave existing `PullQuote` export alone.

---

## Step 8 — Verification checklist

| Check | How |
|---|---|
| `npm install swiper` adds dep cleanly | `npm ls swiper` |
| `example/` not in git | `git status` shows no `example/`; `git check-ignore example` exits 0 |
| `npm run typecheck` clean | command |
| `npm run lint` clean | command |
| Slider renders 1 slide initially on `/` and `/en` | visit pages |
| Arrows visible only when ≥2 testimonials | seed both with `featured: true` to test |
| Arrow click advances slide | click |
| Arrow keyboard (← / →) advances slide | focus slider, key |
| Touch swipe at 375 | drag |
| Loop wraps at end | last → next goes to first |
| Disabled-state arrows (`loop: false`, 1 slide) | already covered by `single` branch — arrows hidden |
| Images via `next/image` | Network: `_next/image?url=…` URLs with srcset |
| `<blockquote>` semantic | DevTools → Elements |
| Empty Sanity data → section hidden | toggle `featured: false` on every testimonial, reload, confirm no DOM |
| `--gutter-x` alignment | slider container left/right edges match other sections at 1920 / 1100 / 808 / 375 |
| Mobile: phone mockup centered above quote, laptop hidden | resize to 375 |
| Mobile: no horizontal scroll | DevTools, look at `<html>` scrollWidth |
| Lighthouse a11y: arrow buttons have `aria-label` | run audit |

---

## Risks & follow-ups

1. **Swiper bundle size.** With only the modules we use (Navigation + Keyboard + A11y), tree-shaken core ≈ 30–40KB gz. Acceptable for the design we're shipping. Re-evaluate if multiple sliders go in and bundle balloons.
2. **Hydration mismatch.** Server renders the section shell + slides; client hydrates Swiper on top. Swiper React 11+ handles this without warnings as long as the first slide's DOM matches. Verify zero console warnings on first mount.
3. **`hasEnCase` coupling.** The fetcher's URL logic mirrors `refToCaseItem` in homepage/index.tsx. If the canonical mapping ever moves to a shared helper, refactor both sites together.
4. **Studio schema lag.** Frontend is ready as soon as types + queries land. Until the admin repo ships `schemas/testimonial.ts` and the seed runs, the slider returns `null` and the homepage loses the block. **Coordinate merge order**: schema PR in admin repo → seed run → this PR merge. Otherwise add a feature flag to render the old `PullQuote` as a fallback during the rollout window.
5. **Image dimensions.** Seed leaves `mockupLeft/Right` empty until the founder uploads assets. Until then, mobile renders quote-only and desktop renders quote-only too (`hp-pqs-mockup` blocks are conditionally rendered). **Acceptable** — matches existing seed posture.
6. **`caseLabel` i18n default.** Hard-coded EN today. Either source from `messages/{uk,en}.json` or require Sanity to always provide `caseLabel`. Deferred.
7. **Rich-text emphasis in quotes.** New schema's `quote` field is plain text — the existing PullQuote let JSX children render gradient italic via `<em>`. If we need inline emphasis, swap `quote` to the existing `richTextSimple` schema type and render via `<PortableText>` (helper already wired in `src/lib/sanity/portable.tsx`). Deferred.
8. **Swiper CSS specificity.** `swiper/css` injects global rules at low specificity; our `.swiper-nav-btn` overrides should win. If they don't, scope with `.hp-pqs .swiper-button-prev` etc. Verify in DevTools.

---

## Out of scope

- Industry-page / vs-page testimonial blocks (separate schema/render path).
- Studio schema PR (drafted here; ship in admin repo).
- Replacing `<em>` gradient styling on quote text (would need `richTextSimple` swap, see follow-up #7).
- Autoplay (excluded per Q5).
- Pagination dots (excluded per Q5 — arrows-only suffices for ≤5 testimonials).
