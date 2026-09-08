"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { btnClass } from "@/components/ui";
import { SanityImg } from "@/lib/shared/sanity-image";
import type { SanityImage } from "@/types/sanity";
import type { HeroFigure, HeroSlideContent, HeroSlideTheme } from "./types";

/** One slide, resolved: copy from the page, photograph from the CMS. */
export type ResolvedSlide = HeroSlideContent & {
  theme: HeroSlideTheme;
  cover?: SanityImage;
  coverAlt: string;
  caseHref: string | null;
};

const DWELL_MS = 6000;
/** The source crossfaded over 3s, which read as a page that never settles. */
const FADE_MS = 700;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Figures ───────────────────────────────────────────────────────────── */

/**
 * Counts the numeric part up on first view; anything that is not a plain
 * number ("4–10", "24/7", "×3.2") is printed as written. Kept as a raf loop
 * rather than a motion dependency — it is twelve lines and the bundle here
 * is the hero.
 */
function FigureValue({ value, run }: { value: string; run: boolean }) {
  const match = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const target = match ? parseFloat(match[2]) : NaN;
  const countable =
    match !== null && Number.isFinite(target) && !/[–/-]/.test(value);
  const decimals = countable && match![2].includes(".") ? 1 : 0;

  const [shown, setShown] = useState(() => (countable ? 0 : target));

  useEffect(() => {
    if (!countable || !run) return;
    if (prefersReducedMotion()) {
      setShown(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic — fast first, settles on the number
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [countable, run, target]);

  if (!countable) return <>{value}</>;
  return (
    <>
      {match![1]}
      {shown.toFixed(decimals)}
      {match![3]}
    </>
  );
}

function FigureCard({ figure, run }: { figure: HeroFigure; run: boolean }) {
  return (
    <li className="flex w-[calc(50%-5px)] flex-col items-center justify-center rounded-[6px] border-2 border-line-strong px-3 pb-3 pt-2 text-center backdrop-blur-[6px] sm:w-auto sm:flex-1 sm:px-4 sm:pb-4">
      <p className="m-0 font-marker text-[44px] font-medium uppercase leading-[0.95] text-ink [font-variant-numeric:tabular-nums] sm:text-[64px] xl:text-[80px]">
        <FigureValue value={figure.value} run={run} />
      </p>
      <p className="m-0 mt-1 font-actay text-[9px] font-bold uppercase leading-[1.25] text-ink-dim sm:text-[11px] xl:text-[12px]">
        {figure.label}
      </p>
    </li>
  );
}

/* ── Slide ─────────────────────────────────────────────────────────────── */

function Slide({
  slide,
  index,
  isActive,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
}: {
  slide: ResolvedSlide;
  index: number;
  isActive: boolean;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}) {
  const Title = index === 0 ? "h1" : "h2";
  return (
    <div
      // Inactive slides stay mounted and stacked so the crossfade has
      // something to fade to; only the active one takes pointer events.
      className={[
        "inset-0 transition-opacity ease-in-out",
        isActive
          ? "relative z-[2] opacity-100"
          : "pointer-events-none absolute z-[1] opacity-0",
      ].join(" ")}
      // eslint-disable-next-line react/forbid-dom-props -- per-slide wash colour and fade duration are data, not a fixed set of utilities
      style={{ transitionDuration: `${FADE_MS}ms` }}
      aria-hidden={!isActive}
      id={`hero-slide-${slide.id}`}
    >
      {/* Slide wash — the project's own colour, bleeding past the container. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -top-8 bottom-0 overflow-hidden sm:-inset-x-8 lg:-inset-x-12 lg:-top-14"
      >
        <div
          className="absolute inset-0"
          // eslint-disable-next-line react/forbid-dom-props -- the wash is the slide's own colour
          style={{
            background: `radial-gradient(ellipse 70% 90% at 82% 40%, ${slide.theme.wash}, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-[3]">
        <Title
          className="m-0 mb-4 max-w-[26ch] font-actay text-[clamp(28px,5.2vw,46px)] font-bold uppercase leading-[1.07] text-ink [text-wrap:balance] lg:mb-6 lg:max-w-[15ch]"
          data-speakable={index === 0 ? "hero-title" : undefined}
        >
          {slide.title}
        </Title>
        <p
          className="m-0 mb-7 max-w-[380px] font-sans text-[14px] font-light leading-[1.5] text-ink-dim lg:text-[16px]"
          data-speakable={index === 0 ? "hero-description" : undefined}
        >
          {slide.description}
        </p>

        <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <Link href={ctaPrimaryHref} className={btnClass("primary")}>
            <span>{ctaPrimaryLabel}</span>
          </Link>
          <Link
            href={ctaSecondaryHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-line-strong px-6 font-sans text-[14px] font-semibold text-ink no-underline transition-[border-color,color] duration-200 hover:border-accent-55 hover:text-accent-soft"
          >
            {ctaSecondaryLabel}
          </Link>
        </div>

        <ul className="m-0 flex list-none flex-wrap items-stretch gap-2.5 p-0 lg:max-w-[620px] lg:gap-[15px]">
          {slide.figures.map((f, i) => (
            <FigureCard key={i} figure={f} run={isActive} />
          ))}
          <li className="mt-1 flex w-full flex-col gap-2 lg:mt-3 lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
            <p className="m-0 font-actay text-[11px] font-bold uppercase leading-[1.3] text-ink-dim lg:text-[12px]">
              {slide.subtitle}
            </p>
            {slide.caseHref ? (
              <Link
                href={slide.caseHref}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 underline-offset-4 transition-colors duration-200 hover:text-accent-soft hover:underline"
              >
                {slide.caseLabel}
              </Link>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                {slide.caseLabel}
              </span>
            )}
          </li>
        </ul>
      </div>

      {/* Right edge runs to the viewport, not to the container: the
          picture is the page edge, the way the source had it. Top and
          bottom clear the section padding so it passes behind the
          header rather than starting under it. */}
      {slide.cover ? (
        <div className="pointer-events-none relative z-[2] -mx-6 mt-8 aspect-[16/11] sm:-mx-8 lg:absolute lg:-top-14 lg:bottom-[-3.5rem] lg:left-[46%] lg:right-[calc(50%-50vw)] lg:z-[1] lg:m-0 lg:aspect-auto lg:w-auto">
          <SanityImg
            image={slide.cover}
            alt={slide.coverAlt}
            fill
            sizes="(min-width: 800px) 56vw, 100vw"
            quality={70}
            priority={index === 0}
            className="object-cover object-center"
          />
          {/* Left edge dissolves into the page so the headline sits on a
              readable ground; below lg the same job is done along the top,
              where the band meets the copy. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-bg)_0%,transparent_30%)] lg:bg-[linear-gradient(90deg,var(--color-bg)_0%,oklch(from_var(--color-bg)_l_c_h_/_0.7)_28%,transparent_62%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,transparent,var(--color-bg))]"
          />
        </div>
      ) : null}
    </div>
  );
}

/* ── Carousel ──────────────────────────────────────────────────────────── */

export function HeroShowcaseClient({
  slides,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  slideLabelTemplate,
}: {
  slides: ResolvedSlide[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  /**
   * aria-label for a dot, with `{n}` standing in for the 1-based index.
   * A string, not a formatter: this crosses the server/client boundary and
   * functions are not serializable.
   */
  slideLabelTemplate: string;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (slides.length < 2 || paused || prefersReducedMotion()) return;
    timer.current = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      DWELL_MS,
    );
  }, [slides.length, paused]);

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  const go = (i: number) => {
    setCurrent(i);
    restart();
  };

  const active = slides[current];

  return (
    <>
      {/* Page backdrop — dual accent radials + the grain overlay. It used to
          ship with the old hero component; it is page-wide, so it moves here
          rather than disappearing with it. */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_70%_at_10%_90%,oklch(from_var(--color-accent-2)_l_c_h_/_0.06),transparent_70%),linear-gradient(180deg,var(--color-bg)_0%,var(--color-bg)_100%)]" />
      <div className="hero-grain" />

    <section
      className="relative overflow-hidden px-6 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-14 lg:pt-14"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Ghost wordmark in the slide's colour — the band the source closed
          its hero with, kept as a backdrop rather than a marquee so it costs
          no animation frame. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[0.3em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-marker text-[clamp(110px,19vw,300px)] font-medium uppercase leading-none opacity-70 transition-colors duration-700"
        // eslint-disable-next-line react/forbid-dom-props -- the wordmark takes the active slide's colour
        style={{ color: active?.theme.mark }}
      >
        Code-site.art
      </span>

      <div className="relative mx-auto grid max-w-container grid-cols-1 items-center gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-8">
        {/* Slide dots */}
        <ul className="order-2 m-0 flex list-none gap-3 p-0 lg:order-1 lg:flex-col lg:gap-4">
          {slides.map((s, i) => (
            <li key={s.id} className="leading-none">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={slideLabelTemplate.replace("{n}", String(i + 1))}
                aria-current={i === current}
                aria-controls={`hero-slide-${s.id}`}
                className={[
                  "h-3 w-3 cursor-pointer rounded-full border transition-[background-color,border-color] duration-300",
                  i === current
                    ? "border-accent-soft bg-accent-soft"
                    : "border-line-strong bg-transparent hover:bg-[oklch(1_0_0_/_0.35)]",
                ].join(" ")}
              />
            </li>
          ))}
        </ul>

        <div className="relative order-1 lg:order-2 lg:min-h-[clamp(430px,72vh,620px)]">
          {slides.map((s, i) => (
            <Slide
              key={s.id}
              slide={s}
              index={i}
              isActive={i === current}
              ctaPrimaryLabel={ctaPrimaryLabel}
              ctaPrimaryHref={ctaPrimaryHref}
              ctaSecondaryLabel={ctaSecondaryLabel}
              ctaSecondaryHref={ctaSecondaryHref}
            />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
