import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { FAQ } from "@/components/blocks/final";
import { ContactSplit } from "@/components/blocks/contact-split";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { H2 } from "@/components/ui";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { MiniCalc } from "@/components/landing-page/mini-calc";
import { SanityImg } from "@/lib/shared/sanity-image";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { loc } from "@/lib/shared/sanity-locale";
import { fetchCaseStudies } from "@/components/case-page/data";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
import type { Locale } from "@/constants/locales";
import type { LandingPageContent } from "@/types/landing";
import type { BentoCell } from "@/types/homepage";

/* Local copies of the eyebrow / em-heading treatments used by turnkey-list —
   those constants are module-private there, so the strings live here too. */
const EYEBROW_CLASS =
  "inline-flex items-center gap-2.5 py-1.5 px-3 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase " +
  "before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)]";

const HEADING_EM_CLASS =
  "[&_em]:not-italic [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent";

const ALL_CASES_LINK_CLASS =
  "inline-flex items-center gap-2 min-h-11 py-2.5 px-5 border border-line-strong rounded-full font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline " +
  "transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-accent-40";

/* Monochrome client-logo rail under the hero. Same files + intrinsic
   dimensions as the homepage marquee (src/components/homepage/marquee.tsx);
   rendered here as a static strip, not a scrolling loop. */
const HERO_LOGOS = [
  { src: "/partners/efedra.webp", alt: "Efedra Clinic", w: 242, h: 100 },
  { src: "/partners/aleko.webp", alt: "Aleko", w: 1014, h: 69 },
  { src: "/partners/glimmer.webp", alt: "Glimmer", w: 300, h: 86 },
  { src: "/partners/kondor.webp", alt: "Kondor", w: 683, h: 58 },
  { src: "/partners/bravo.webp", alt: "Bravo", w: 317, h: 69 },
  { src: "/partners/solid-renovation.webp", alt: "Solid Renovation", w: 611, h: 78 },
  { src: "/partners/finance-league.webp", alt: "Finance League", w: 490, h: 85 },
  { src: "/partners/uneed.webp", alt: "Uneed", w: 342, h: 92 },
];

/** Digit groups separated by a plain space ("$6 000") must never wrap. */
function nb(s: string) {
  return s.replace(/(\d) (\d)/g, "$1 $2");
}

function em([plain, emphasized]: [string, string]) {
  return (
    <>
      {nb(plain)}
      <em>{nb(emphasized)}</em>
    </>
  );
}

/** Shared section header: eyebrow pill + H2 (+ optional sub), with a giant
    outlined section numeral ghosted behind — the page reads as a numbered
    spec sheet from top to bottom. */
function SectionHead({
  index,
  eyebrow,
  heading,
  sub,
}: {
  index?: string;
  eyebrow: string;
  heading: [string, string];
  sub?: string;
}) {
  return (
    <div className="relative flex flex-col items-start mb-12 max-w-[840px]">
      {index ? (
        <span
          aria-hidden
          className="absolute -top-9 -left-1 lg:-top-14 font-actay font-bold uppercase text-[clamp(76px,9vw,132px)] leading-none text-transparent select-none pointer-events-none [-webkit-text-stroke:1px_oklch(1_0_0_/_0.08)]"
        >
          {index}
        </span>
      ) : null}
      <span className={EYEBROW_CLASS}>{eyebrow}</span>
      <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>{em(heading)}</H2>
      {sub ? (
        <p className="mt-5 font-sans text-base leading-[1.6] text-ink-dim max-w-[640px]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/** Fit / not-fit editorial columns ("when is a landing page the right tool"). */
function WhenSection({
  content,
  index,
}: {
  content: LandingPageContent["when"];
  index: string;
}) {
  return (
    <section className={`${hpSectionClass} overflow-hidden`}>
      <div
        aria-hidden
        className="absolute top-[-120px] right-[-140px] h-[380px] w-[380px] rounded-full bg-accent-8 blur-[110px] pointer-events-none"
      />
      <div className={hpInnerClass}>
        <SectionHead
          index={index}
          eyebrow={content.eyebrow}
          heading={content.heading}
          sub={content.sub}
        />
        <div
          aria-hidden
          className="h-px [background:linear-gradient(90deg,var(--color-accent-40),oklch(1_0_0_/_0.08)_45%,transparent)]"
        />
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="pt-7 md:pr-10 lg:pr-14">
            <h3 className="font-actay uppercase font-semibold text-[15.5px] text-ink leading-[1.2] m-0 mb-4">
              {content.fitTitle}
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {content.fit.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-dim"
                >
                  <Check
                    size={16}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 pt-7 border-t border-line md:mt-0 md:border-t-0 md:border-l md:pl-10 lg:pl-14">
            <h3 className="font-actay uppercase font-semibold text-[15.5px] text-ink-dim leading-[1.2] m-0 mb-4">
              {content.notFitTitle}
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {content.notFit.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-3"
                >
                  <Minus
                    size={16}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-ink-3"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-[13px] leading-[1.6] text-ink-3 italic max-w-[640px]">
          {content.foot}
        </p>
      </div>
    </section>
  );
}

/** "Not in the base package" footer card for the TurnkeyList block. */
function NotIncludedFooter({
  content,
}: {
  content: LandingPageContent["included"];
}) {
  return (
    <div className="p-[22px_26px_24px] border border-dashed border-line-strong rounded-2xl bg-[oklch(1_0_0_/_0.02)]">
      <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim mb-[14px]">
        {content.notIncludedTitle}
      </div>
      <ul
        className={
          "list-none m-0 p-0 grid grid-cols-1 gap-y-2 gap-x-7 md:grid-cols-2 " +
          "[&_li]:relative [&_li]:pl-[18px] [&_li]:text-[13.5px] [&_li]:leading-[1.5] [&_li]:text-ink-dim " +
          "[&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:text-ink-3"
        }
      >
        {content.notIncluded.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 text-[12.5px] leading-[1.6] text-ink-3 italic">
        {content.notIncludedFoot}
      </p>
    </div>
  );
}

/** "What the base price includes" — hairline spec-sheet grid (local variant;
    the shared TurnkeyList stays untouched for other pages). */
function IncludedSection({
  content,
  index,
}: {
  content: LandingPageContent["included"];
  index: string;
}) {
  return (
    <section className={`${hpSectionClass} overflow-hidden`}>
      <div
        aria-hidden
        className="absolute top-1/3 left-[-160px] h-[420px] w-[420px] rounded-full bg-[oklch(from_var(--color-accent-2)_l_c_h_/_0.07)] blur-[120px] pointer-events-none"
      />
      <div className={hpInnerClass}>
        <SectionHead
          index={index}
          eyebrow={content.eyebrow}
          heading={content.heading}
          sub={content.sub}
        />
        <div
          className={
            "grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-line overflow-hidden mb-6 " +
            "[&>*]:border-line [&>*]:border-t [&>*:first-child]:border-t-0 md:[&>*:nth-child(2)]:border-t-0 md:[&>*:nth-child(2n)]:border-l"
          }
        >
          {content.items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="flex items-start gap-4 p-5 lg:p-6">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-25 bg-accent-10 text-accent-soft">
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-actay uppercase font-semibold text-[13.5px] text-ink leading-[1.25]">
                    {it.title}
                  </span>
                  <span className="mt-1 block font-sans text-[13px] leading-[1.55] text-ink-dim">
                    {it.line}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <NotIncludedFooter content={content} />
      </div>
    </section>
  );
}

/** "How the price is built" — bento mosaic with gradient stats and a violet
    hover glow (local variant; the shared homepage Bento stays untouched). */
function PriceGrid({
  content,
  index,
}: {
  content: LandingPageContent["price"];
  index: string;
}) {
  const spanClass = (s: BentoCell["span"]) =>
    s === "2x1"
      ? "sm:col-span-2"
      : s === "3x1"
        ? "sm:col-span-2 lg:col-span-3"
        : s === "2x2"
          ? "sm:col-span-2 sm:row-span-2"
          : "";
  const unitsOf = (s: BentoCell["span"]) =>
    s === "2x1" ? 2 : s === "3x1" ? 3 : s === "2x2" ? 4 : 1;
  // A lone 1-track cell on the last row reads as an orphan — promote it to a
  // full-width feature strip instead.
  const totalUnits = content.cells.reduce((n, c) => n + unitsOf(c.span), 0);
  const featureLast = totalUnits % 4 === 1;
  return (
    <section className={`${hpSectionClass} overflow-hidden`}>
      <div
        aria-hidden
        className="absolute bottom-[-160px] left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full bg-accent-8 blur-[120px] pointer-events-none"
      />
      <div className={hpInnerClass}>
        <SectionHead index={index} eyebrow={content.eyebrow} heading={content.heading} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {content.cells.map((cell, ci) => {
            const Icon = cell.icon;
            if (featureLast && ci === content.cells.length - 1) {
              return (
                <div
                  key={cell.title}
                  className="relative overflow-hidden rounded-2xl border border-accent-25 col-span-full p-6 lg:px-8 [background:linear-gradient(100deg,var(--color-accent-12),oklch(1_0_0_/_0.015)_55%)]"
                >
                  <div
                    aria-hidden
                    className="absolute -left-16 top-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-accent-20 blur-[70px] pointer-events-none"
                  />
                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-30 bg-accent-12 text-accent-soft">
                        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-actay uppercase font-semibold text-[14.5px] text-ink leading-[1.25]">
                          {cell.title}
                        </span>
                        <span className="mt-1 block font-sans text-[13px] leading-[1.55] text-ink-dim max-w-[560px]">
                          {cell.body}
                        </span>
                      </span>
                    </div>
                    {cell.stat ? (
                      <div className="shrink-0 font-actay font-bold text-[clamp(26px,3vw,36px)] leading-none whitespace-nowrap bg-[linear-gradient(90deg,oklch(0.72_0.16_250),oklch(0.72_0.16_295),oklch(0.66_0.18_320))] bg-clip-text text-transparent">
                        {nb(cell.stat)}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={cell.title}
                className={`group relative overflow-hidden rounded-2xl border border-line bg-[oklch(1_0_0_/_0.015)] p-6 transition-colors duration-300 hover:border-accent-40 ${spanClass(cell.span)}`}
              >
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-accent-15 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                />
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className="text-accent-soft"
                  aria-hidden="true"
                />
                <div className="mt-4 font-actay uppercase font-semibold text-[13.5px] text-ink leading-[1.25]">
                  {cell.title}
                </div>
                {cell.stat ? (
                  <div className="mt-2 font-actay font-bold text-[26px] leading-none bg-[linear-gradient(90deg,oklch(0.72_0.16_250),oklch(0.72_0.16_295),oklch(0.66_0.18_320))] bg-clip-text text-transparent">
                    {nb(cell.stat)}
                  </div>
                ) : null}
                <div className="mt-2 font-sans text-[13px] leading-[1.55] text-ink-dim">
                  {cell.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Calculator CTA — full gradient band with light-beam texture and the
    devices mockup (local variant; the shared CtaBanner stays untouched). */
function CtaBand({ content }: { content: LandingPageContent["calcCta"] }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <div className="relative overflow-hidden rounded-[28px] px-7 py-12 lg:px-16 lg:py-16 [background:linear-gradient(115deg,oklch(0.32_0.13_290),oklch(0.45_0.2_285)_45%,oklch(0.5_0.19_320))]">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_60%_60%_at_50%_-10%,oklch(1_0_0_/_0.18),transparent_60%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-60 [background-image:linear-gradient(90deg,oklch(1_0_0_/_0.05)_1px,transparent_1px)] [background-size:72px_100%]"
          />
          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-center lg:text-left">
              <h2 className="m-0 font-actay uppercase font-bold text-[clamp(24px,3.4vw,40px)] leading-[1.12] text-[oklch(0.98_0.005_300)] [text-wrap:balance] [&_em]:not-italic [&_em]:text-[oklch(0.92_0.07_310)]">
                {em(content.heading)}
              </h2>
              <p className="mx-auto lg:mx-0 mt-4 mb-0 max-w-[560px] font-sans text-[15px] leading-[1.6] text-[oklch(0.95_0.02_300_/_0.85)]">
                {content.sub}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href={content.primaryHref}
                  className="inline-flex items-center gap-2 min-h-12 rounded-full bg-[oklch(0.98_0.005_300)] px-7 font-sans font-semibold text-[14px] text-[oklch(0.22_0.06_295)] no-underline transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {content.primaryLabel}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href={content.secondaryHref}
                  className="inline-flex items-center min-h-12 rounded-full border border-[oklch(1_0_0_/_0.35)] px-7 font-sans font-medium text-[14px] text-[oklch(0.98_0.005_300)] no-underline transition-colors duration-200 hover:bg-[oklch(1_0_0_/_0.1)]"
                >
                  {content.secondaryLabel}
                </Link>
              </div>
            </div>
            <div className="pointer-events-none select-none lg:-my-10 lg:-mr-8">
              <AppImage
                src="/home/launch-cta-devices.webp"
                alt=""
                aria-hidden="true"
                width={2074}
                height={1355}
                sizes={IMG_SIZES.half}
                className="block h-auto w-full max-w-[440px] mx-auto lg:max-w-none drop-shadow-[0_30px_60px_oklch(0.15_0.1_300_/_0.55)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Site-type page "Landing" — shared view for /landing, /en/landing,
 * /ru/landing. Server component: fetches the example case studies once per
 * render (ISR-cached by fetchCaseStudies' tags).
 */
export async function LandingPageView({
  locale,
  content,
}: {
  locale: Locale;
  content: LandingPageContent;
}) {
  const [cases, registry] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
  ]);
  const examples = content.examples.slugs
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => caseRefToCardItem(c, locale, registry));

  // Case covers for the tilted auto-scrolling reel across the hero bottom.
  const reel = (content.gallery?.slugs ?? [])
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> =>
      Boolean(c?.coverImage?.asset?.url),
    );

  // Section numbering for the ghost numerals — only sections present in
  // this page's content participate, so the sequence never skips.
  const numberedKeys = [
    "when",
    "included",
    "price",
    ...(content.priceTable ? ["priceTable"] : []),
    ...(content.stories ? ["stories"] : []),
    ...(content.platforms ? ["platforms"] : []),
    ...(content.gallery ? ["gallery"] : []),
  ];
  const num = (k: string) => `0${numberedKeys.indexOf(k) + 1}`;

  return (
    <>
      {/* 1 — Hero (two-column with the mini-calculator when configured) */}
      {content.miniCalc ? (
        <section className="relative pt-10 pb-4 lg:pt-16 lg:pb-6 px-6 sm:px-8 lg:px-12 bg-bg overflow-hidden">
          {/* Violet-horizon atmosphere: main bloom behind the calculator, a
              counter-glow bottom-left, and a faint vertical grid fading in
              and out vertically. Depth comes from illumination, not shadow. */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 [background:radial-gradient(ellipse_50%_44%_at_74%_26%,var(--color-accent-15),transparent_68%),radial-gradient(ellipse_56%_44%_at_8%_108%,oklch(from_var(--color-accent-2)_l_c_h_/_0.12),transparent_72%)]" />
            {/* Diagonal light beams sweeping across the canvas. */}
            <div className="absolute inset-0 [background:linear-gradient(72deg,transparent_44%,oklch(from_var(--color-accent)_l_c_h_/_0.05)_49%,transparent_54%),linear-gradient(112deg,transparent_58%,oklch(from_var(--color-accent-2)_l_c_h_/_0.05)_63%,transparent_68%)]" />
            <div className="absolute inset-0 [background-image:linear-gradient(90deg,oklch(1_0_0_/_0.028)_1px,transparent_1px)] [background-size:88px_100%] [mask-image:linear-gradient(180deg,transparent,black_35%,black_75%,transparent)] [-webkit-mask-image:linear-gradient(180deg,transparent,black_35%,black_75%,transparent)]" />
          </div>
          <div className="relative max-w-container mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-12 xl:grid-cols-[1.05fr_0.95fr] xl:gap-16 items-center">
            <div className="relative">
              {/* Giant outlined eyebrow word ghosted behind the headline. */}
              <span
                aria-hidden
                className="absolute -top-16 left-0 hidden lg:block font-actay font-bold uppercase whitespace-nowrap text-[clamp(64px,7vw,110px)] leading-none text-transparent select-none pointer-events-none [-webkit-text-stroke:1px_oklch(1_0_0_/_0.06)]"
              >
                {content.hero.eyebrow}
              </span>
              <span className={EYEBROW_CLASS}>{content.hero.eyebrow}</span>
              <h1 className={`mt-6 mb-0 font-actay uppercase font-bold text-[clamp(30px,4.6vw,56px)] leading-[1.08] text-ink [text-wrap:balance] ${HEADING_EM_CLASS}`}>
                {em(content.hero.headline)}
              </h1>
              <p className="mt-5 font-sans text-[15.5px] leading-[1.65] text-ink-dim max-w-[540px]">
                {content.hero.sub}
              </p>
              {content.hero.badges?.length ? (
                <div className="mt-9 grid grid-cols-2 gap-x-7 gap-y-6 max-w-[520px]">
                  {content.hero.badges.map((b, i) => (
                    <div
                      key={b.label}
                      className={i % 2 === 1 ? "border-l border-line pl-7" : ""}
                    >
                      <div className="font-actay uppercase font-bold text-[15px] text-ink leading-[1.15]">
                        {b.label}
                      </div>
                      <div className="mt-1.5 font-mono text-[10.5px] tracking-[0.06em] uppercase text-ink-3">
                        {b.sub}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="relative isolate">
              {/* Ultraviolet pool of light the calculator stands in. */}
              <div
                aria-hidden
                className="absolute -inset-x-12 top-1/4 -bottom-14 rounded-[50%] bg-accent-22 blur-[80px] pointer-events-none"
              />
              <div className="relative z-10">
                <MiniCalc content={content.miniCalc} locale={locale} />
              </div>
            </div>
          </div>
          {/* Tilted auto-scrolling reel of real project screens — full bleed,
              pauses on hover, every frame links to its case. */}
          {reel.length >= 4 ? (
            <div className="relative mt-14 lg:mt-20 -mx-6 sm:-mx-8 lg:-mx-12 rotate-[-2deg]">
              <div className="[mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
                <div className="flex w-max items-stretch gap-5 pr-5 [animation:marquee_55s_linear_infinite] hover:[animation-play-state:paused]">
                  {[...reel, ...reel].map((c, idx) => (
                    <Link
                      key={`${c.slug}-${idx}`}
                      href={`/portfolio/${c.slug}`}
                      tabIndex={idx >= reel.length ? -1 : undefined}
                      aria-hidden={idx >= reel.length ? true : undefined}
                      className="relative block w-[240px] sm:w-[290px] shrink-0 overflow-hidden rounded-xl border border-line-strong bg-surface transition-[border-color] duration-300 hover:border-accent-40"
                    >
                      <div className="relative aspect-[16/10]">
                        <SanityImg
                          image={c.coverImage!}
                          alt={loc(c.coverImage!.alt, locale) || loc(c.title, locale) || c.slug}
                          sizes={IMG_SIZES.cardThird}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          {/* Client-logo rail: real projects as social proof, separated from
              the hero by a glowing horizon hairline. */}
          <div className="relative max-w-container mx-auto mt-12 lg:mt-16">
            <div
              aria-hidden
              className="h-px [background:linear-gradient(90deg,transparent,var(--color-accent-40)_30%,var(--color-accent-40)_70%,transparent)]"
            />
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 lg:justify-between pt-7 pb-3">
              {HERO_LOGOS.map((l) => (
                <span key={l.src} className="inline-flex items-center" title={l.alt}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- exception per docs/images.md: 2–12 KB monochrome logo strip; optimizer round-trips cost more than they save */}
                  <img
                    src={l.src}
                    alt={l.alt}
                    width={l.w}
                    height={l.h}
                    loading="lazy"
                    decoding="async"
                    className="h-6 lg:h-7 w-auto max-w-[128px] object-contain opacity-40 [filter:brightness(0)_invert(1)] transition-opacity duration-300 hover:opacity-75"
                  />
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <PageHero
          breadcrumbs={[
            {
              label: content.breadcrumbHome,
              href: locale === "uk" ? "/" : `/${locale}`,
            },
            { label: content.breadcrumbSelf },
          ]}
          eyebrow={content.hero.eyebrow}
          headline={em(content.hero.headline)}
          sub={content.hero.sub}
        />
      )}

      {/* 2 — When a landing page fits / when it doesn't */}
      <WhenSection content={content.when} index={num("when")} />

      {/* 3 — Checklist: what the base price includes */}
      <IncludedSection content={content.included} index={num("included")} />

      {/* 4 — How the price is built (calculator-style option grid) */}
      <PriceGrid content={content.price} index={num("price")} />

      {/* 4.2 — Ready-made configuration price table */}
      {content.priceTable && (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead
              index={num("priceTable")}
              eyebrow={content.priceTable.eyebrow}
              heading={content.priceTable.heading}
            />
            <div className="overflow-x-auto rounded-2xl border border-line bg-[oklch(1_0_0_/_0.015)]">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="bg-accent-6">
                    {content.priceTable.headers.map((h) => (
                      <th
                        key={h}
                        className="py-3.5 px-5 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3 font-medium border-b border-line"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.priceTable.rows.map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-line last:border-b-0 transition-colors duration-150 hover:bg-accent-6"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={
                            "py-3.5 px-5 font-sans text-[13.5px] leading-[1.5] " +
                            (ci === 0
                              ? "font-semibold text-ink"
                              : ci === row.length - 2
                                ? "font-mono text-[13.5px] font-semibold text-accent-soft whitespace-nowrap"
                                : "text-ink-dim")
                          }
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12.5px] leading-[1.6] text-ink-3 italic max-w-[640px]">
              {content.priceTable.foot}
            </p>
          </div>
        </section>
      )}

      {/* 4.3 — Case stories with photos */}
      {content.stories && (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead
              index={num("stories")}
              eyebrow={content.stories.eyebrow}
              heading={content.stories.heading}
            />
            <div className="flex flex-col gap-12 lg:gap-16">
              {content.stories.items.map((story, i) => {
                const c = cases.find((x) => x.slug === story.slug);
                const image = c?.coverImage?.asset?.url ? c.coverImage : null;
                return (
                  <div
                    key={story.slug}
                    className={`grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12 items-center ${
                      i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <Link
                      href={`/portfolio/${story.slug}`}
                      className="group relative block"
                    >
                      {/* Underglow pool beneath the framed screenshot. */}
                      <div
                        aria-hidden
                        className="absolute -inset-x-8 top-1/2 -bottom-10 rounded-[50%] bg-accent-18 blur-[64px] pointer-events-none"
                      />
                      {/* Browser-window frame: we sell websites, so the case
                          photo is shown as a website — chrome bar with the
                          real portfolio URL, screenshot below. */}
                      <div
                        className={
                          "relative overflow-hidden rounded-2xl border border-line-strong bg-surface transition-transform duration-500 group-hover:rotate-0 " +
                          (i % 2 === 1 ? "lg:rotate-[1.2deg]" : "lg:rotate-[-1.2deg]")
                        }
                      >
                        <div className="flex items-center gap-1.5 h-8 px-3.5 border-b border-line bg-[oklch(1_0_0_/_0.03)]">
                          <span aria-hidden className="w-2 h-2 rounded-full bg-[oklch(1_0_0_/_0.14)]" />
                          <span aria-hidden className="w-2 h-2 rounded-full bg-[oklch(1_0_0_/_0.14)]" />
                          <span aria-hidden className="w-2 h-2 rounded-full bg-[oklch(1_0_0_/_0.14)]" />
                          <span className="ml-2 font-mono text-[10px] tracking-[0.02em] text-ink-3 truncate">
                            code-site.art/portfolio/{story.slug}
                          </span>
                        </div>
                        {image ? (
                          <div className="relative aspect-[16/10]">
                            <SanityImg
                              image={image}
                              alt={loc(image.alt, locale) || story.title}
                              sizes={IMG_SIZES.half}
                              fill
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[16/10] bg-[oklch(1_0_0_/_0.02)]" />
                        )}
                      </div>
                    </Link>
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
                        {story.kicker}
                      </div>
                      <h3 className="mt-3 mb-0 font-actay uppercase font-bold text-[clamp(20px,2.2vw,28px)] leading-[1.2] text-ink">
                        {story.title}
                      </h3>
                      {story.paragraphs.map((p) => (
                        <p
                          key={p.slice(0, 24)}
                          className="mt-4 mb-0 font-sans text-[14.5px] leading-[1.65] text-ink-dim"
                        >
                          {p}
                        </p>
                      ))}
                      <div className="mt-6 flex items-end gap-5 flex-wrap">
                        <div>
                          <div className="font-actay font-bold text-[34px] leading-none bg-[linear-gradient(90deg,oklch(0.72_0.16_250),oklch(0.72_0.16_295),oklch(0.66_0.18_320))] bg-clip-text text-transparent">
                            {story.stat.value}
                          </div>
                          <div className="mt-1.5 font-mono text-[11px] tracking-[0.06em] text-ink-3">
                            {story.stat.label}
                          </div>
                        </div>
                        <Link
                          href={`/portfolio/${story.slug}`}
                          className={ALL_CASES_LINK_CLASS}
                        >
                          {story.ctaLabel}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4.5 — Optional platform-limitations prose section */}
      {content.platforms && (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead
              index={num("platforms")}
              eyebrow={content.platforms.eyebrow}
              heading={content.platforms.heading}
            />
            <div className="max-w-[760px] flex flex-col gap-4">
              {content.platforms.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="m-0 font-sans text-[15px] leading-[1.65] text-ink-dim"
                >
                  {p}
                </p>
              ))}
              <ul className="list-none m-0 mt-2 p-0 flex flex-col gap-2.5">
                {content.platforms.bullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-dim"
                  >
                    <Minus
                      size={16}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-ink-3"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="m-0 mt-2 text-[13px] leading-[1.6] text-ink-3 italic">
                {content.platforms.foot}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {content.platforms.links.map((l) => (
                  <Link key={l.href} href={l.href} className={ALL_CASES_LINK_CLASS}>
                    {l.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5 — Calculator CTA */}
      <CtaBand content={content.calcCta} />

      {/* 5.5 — Photo gallery of works */}
      {content.gallery && (
        <section className={`${hpSectionClass} overflow-hidden`}>
          <div
            aria-hidden
            className="absolute top-[-100px] left-[20%] h-[360px] w-[560px] rounded-full bg-accent-8 blur-[120px] pointer-events-none"
          />
          <div className={hpInnerClass}>
            <SectionHead
              index={num("gallery")}
              eyebrow={content.gallery.eyebrow}
              heading={content.gallery.heading}
              sub={content.gallery.sub}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8 lg:pb-8 lg:[&>a:nth-child(3n+2)]:translate-y-8">
              {content.gallery.slugs
                .map((slug) => cases.find((c) => c.slug === slug))
                .filter((c): c is NonNullable<typeof c> =>
                  Boolean(c?.coverImage?.asset?.url),
                )
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/portfolio/${c.slug}`}
                    className="group relative block overflow-hidden rounded-[18px] border border-line no-underline transition-[border-color,box-shadow] duration-300 hover:border-accent-40 hover:shadow-[0_20px_60px_var(--color-accent-20)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <SanityImg
                        image={c.coverImage!}
                        alt={loc(c.coverImage!.alt, locale) || loc(c.title, locale) || c.slug}
                        sizes={IMG_SIZES.cardThird}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,oklch(0_0_0_/_0.78))]"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-3.5">
                        <span className="font-actay uppercase font-semibold text-[13.5px] text-ink truncate">
                          {loc(c.title, locale) || c.client || c.slug}
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-ink-3 transition-[transform,color] duration-[0.25s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            <Link href={content.gallery.allHref} className={ALL_CASES_LINK_CLASS}>
              {content.gallery.allLabel}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* 6 — Example landing pages from the portfolio (hidden when the
          gallery replaces it) */}
      {!content.gallery && (
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <div className="flex flex-col items-start mb-12 max-w-[840px]">
            <span className={EYEBROW_CLASS}>{content.examples.eyebrow}</span>
            <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>
              {em(content.examples.heading)}
            </H2>
            <p className="mt-5 font-sans text-base leading-[1.6] text-ink-dim max-w-[640px]">
              {content.examples.sub}
            </p>
          </div>
          {examples.length > 0 && (
            <div className={casesGridClass}>
              {examples.map((item) => {
                const metaLine = [item.industry, item.region, item.year]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <RelatedCard
                    key={item.href ?? item.name}
                    metrics={item.chips}
                    title={item.name}
                    eyebrow={metaLine || undefined}
                    sub={item.metrics || undefined}
                    coverImage={
                      item.coverImage
                        ? {
                            src: item.coverImage,
                            alt: item.coverImageAlt ?? item.name,
                          }
                        : undefined
                    }
                    gradient={item.gradient}
                    href={item.href}
                  />
                );
              })}
            </div>
          )}
          <Link href={content.examples.allHref} className={ALL_CASES_LINK_CLASS}>
            {content.examples.allLabel}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
      )}

      {/* 7 — FAQ */}
      <section className="bg-bg">
        <FAQ
          heading={content.faq.heading}
          items={content.faq.items}
          locale={locale}
        />
      </section>

      {/* 8 — Lead form. Compact: name + contact, details fold out on demand —
          the page already collected specifics via the hero mini-calculator. */}
      <ContactSplit source="landing-page" variant="compact" locale={locale} />
    </>
  );
}
