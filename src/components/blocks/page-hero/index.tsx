import Link from "next/link";
import type { ReactNode } from "react";
import { cn, H1 } from "@/components/ui";

export type Crumb = { label: string; href?: string };

export type PageHeroStat = { value: ReactNode; label: string };

export function PageHero({
  breadcrumbs = [],
  eyebrow,
  headline,
  sub,
  image,
  stats,
}: {
  breadcrumbs?: Crumb[];
  eyebrow: string;
  headline: ReactNode;
  sub: ReactNode;
  image?: ReactNode;
  stats?: PageHeroStat[];
}) {
  const statsCard = stats?.length ? (
    <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-3.5 px-[18px] py-4 border border-line rounded-[18px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] lg:flex-nowrap lg:gap-6 lg:px-7 lg:py-5">
      {stats.map((it, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 flex flex-col gap-1.5 basis-[calc(50%-7px)] min-w-[120px] lg:basis-auto lg:min-w-0",
            i > 0 && "lg:border-l lg:border-line lg:pl-6",
          )}
        >
          <span className="font-display font-bold text-[22px] tracking-[-0.03em] leading-none text-ink lg:text-[28px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
            {it.value}
          </span>
          <span className="font-sans text-[9px] text-ink-3 uppercase tracking-[0.08em] leading-[1.3] lg:text-[10px]">
            {it.label}
          </span>
        </div>
      ))}
    </div>
  ) : null;

  /*
   * When the hero carries both `stats` and an `image`, the left column grows
   * to a home-hero-style ~1000px max so the stats card spans wide. To keep
   * the H1/sub from running edge-to-edge of that wider column, we cap their
   * width with `max-w-[50vw]` (matches `H1_LINE_CLASS` from `blocks/hero`).
   * Without the image+stats combo the original behavior is preserved.
   */
  const constrainText = Boolean(image && stats?.length);

  const text = (
    <div>
      {breadcrumbs.length > 0 && (
        <nav
          className="flex flex-wrap gap-2 items-center font-mono text-[11px] tracking-[0.1em] uppercase text-ink-3 mb-6 lg:mb-9 [&_a]:text-ink-dim [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-ink"
          aria-label="Breadcrumbs"
        >
          {breadcrumbs.map((c, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="contents">
                {i > 0 && (
                  <span className="text-ink-3 opacity-60">/</span>
                )}
                {c.href && !isLast ? (
                  <Link href={c.href}>{c.label}</Link>
                ) : (
                  <span className="text-ink-3">{c.label}</span>
                )}
              </span>
            );
          })}
        </nav>
      )}
      <span className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)]">
        {eyebrow}
      </span>
      <H1
        variant="page-hero"
        className={cn(
          "mt-6 text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent",
          constrainText && "max-w-full min-[961px]:max-w-[600px]",
        )}
      >
        {headline}
      </H1>
      <p
        className={cn(
          "mt-6 font-sans text-[15px] leading-[1.55] text-ink-dim lg:text-[17px]",
          constrainText && "max-w-full min-[961px]:max-w-[600px]",
        )}
      >
        {sub}
      </p>
    </div>
  );

  const sectionPad = stats?.length
    ? "pt-[72px] lg:pt-[120px] pb-10 lg:pb-16"
    : "pt-[72px] lg:pt-[120px]";

  return (
    <section
      className={`page-hero relative overflow-hidden bg-bg ${sectionPad} px-6 lg:px-12`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_80%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),radial-gradient(ellipse_40%_50%_at_10%_100%,oklch(from_var(--color-accent-2)_l_c_h_/_0.04),transparent_70%)] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,oklch(1_0_0_/_0.022)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.022)_1px,transparent_1px)] before:bg-[length:64px_64px] before:[mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]" />
      <div className="relative z-[1] max-w-container mx-auto">
        {image ? (
          /*
           * Mirrors the homepage hero (HeroEditorial) overlap pattern:
           * left col grows to a ~1000px max so the stats card spans wide
           * (same as `HERO_GRID_CLASS` in blocks/hero); right col is
           * z-10 overflow-visible so the absolutely-positioned image
           * bleeds across the stats card. Image is sized with
           * `max-w-none` + a viewport-based clamp inside about/page.tsx
           * so it can exceed the right column width.
           */
          <div className="grid grid-cols-1 gap-8 items-stretch min-[961px]:grid-cols-[minmax(0,1000px)_minmax(0,1fr)] min-[961px]:gap-[22px] min-[961px]:items-end min-[1081px]:gap-7 2xl:gap-12">
            <div className="flex flex-col">
              {text}
              {statsCard}
            </div>
            <div className="relative h-full overflow-visible [order:-1] min-h-0 [contain:none] z-0 min-[961px]:[order:0] min-[961px]:min-h-[420px] min-[961px]:[contain:layout] min-[961px]:z-10">
              <div className="relative inset-auto flex items-center justify-center pointer-events-none min-[961px]:absolute min-[961px]:top-[-112px] min-[961px]:right-[-50%] [&>img]:h-auto [&>img]:block [&>img]:max-h-none [&>svg]:h-auto [&>svg]:block [&>video]:h-auto [&>video]:block">
                {image}
              </div>
            </div>
          </div>
        ) : (
          <>
            {text}
            {statsCard}
          </>
        )}
      </div>
    </section>
  );
}
