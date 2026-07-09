import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import type { Crumb } from "@/components/blocks/page-hero";
import { Btn, H1 } from "@/components/ui";

// React-hoisted style (see blocks/case/index.tsx for the rationale): costs
// bytes only on routes that render this hero, no extra request.
// NOTE: gradient values match blocks/page-hero + about/sections (one shared
// utility string before the 2026-07 CSS split) — tweak together.
const HERO_CSS = `
.csb-case-hero-bg{background-image:radial-gradient(ellipse 60% 60% at 80% 20%,oklch(from var(--color-accent) l c h / 0.06),transparent 70%),radial-gradient(ellipse 40% 50% at 10% 100%,oklch(from var(--color-accent-2) l c h / 0.04),transparent 70%)}
.csb-case-hero-bg::before{background-image:linear-gradient(to right,oklch(1 0 0 / 0.022) 1px,transparent 1px),linear-gradient(to bottom,oklch(1 0 0 / 0.022) 1px,transparent 1px)}
`;

/**
 * Case-study hero layout preserved from PageHero before 27ba5ee (about-page
 * stats + image overlap). Two-column grid with natural-aspect image on the
 * right — not the home-hero bleed pattern used by PageHero when `stats` is set.
 */
export function CasePageHero({
  breadcrumbs = [],
  eyebrow,
  headline,
  sub,
  image,
  cta,
}: {
  breadcrumbs?: Crumb[];
  eyebrow: string;
  headline: ReactNode;
  sub: ReactNode;
  image?: ReactNode;
  cta?: { label: string; href: string };
}) {
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
        className="mt-6 text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent"
      >
        {headline}
      </H1>
      <p className="mt-6 font-sans text-[15px] leading-[1.55] text-ink-dim lg:text-[17px]">
        {sub}
      </p>
      {cta?.href && cta.label ? (
        <Btn
          as="a"
          variant="primary"
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-8"
        >
          {cta.label}
          <ArrowUpRight size={18} strokeWidth={1.8} />
        </Btn>
      ) : null}
    </div>
  );

  return (
    <section className="case-page-hero relative overflow-hidden bg-bg pt-[72px] lg:pt-[120px] px-6 lg:px-12">
      <style href="csb-case-hero" precedence="csb">{HERO_CSS}</style>
      <div className="absolute inset-0 z-0 pointer-events-none csb-case-hero-bg before:content-[''] before:absolute before:inset-0 before:bg-[length:64px_64px] before:[mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]" />
      <div className="relative z-[1] max-w-container mx-auto">
        {image ? (
          <div className="grid grid-cols-1 gap-8 items-center min-[961px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] min-[961px]:gap-12">
            {text}
            <div className="flex items-center justify-center [&>img]:max-w-full [&>img]:h-auto [&>img]:block [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:block [&>video]:max-w-full [&>video]:h-auto [&>video]:block">
              {image}
            </div>
          </div>
        ) : (
          text
        )}
      </div>
    </section>
  );
}
