import Link from "next/link";
import type { ReactNode } from "react";
import "./page-hero.css";

export type Crumb = { label: string; href?: string };

export function PageHero({
  breadcrumbs = [],
  eyebrow,
  headline,
  sub,
  image,
}: {
  breadcrumbs?: Crumb[];
  eyebrow: string;
  headline: ReactNode;
  sub: ReactNode;
  image?: ReactNode;
}) {
  const text = (
    <div className="page-hero-text">
      {breadcrumbs.length > 0 && (
        <nav
          className="flex flex-wrap gap-2 items-center font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--ink-3)] mb-9 max-[800px]:mb-6 [&_a]:text-[var(--ink-2)] [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-ink"
          aria-label="Breadcrumbs"
        >
          {breadcrumbs.map((c, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="contents">
                {i > 0 && (
                  <span className="text-[var(--ink-3)] opacity-60">/</span>
                )}
                {c.href && !isLast ? (
                  <Link href={c.href}>{c.label}</Link>
                ) : (
                  <span className="text-[var(--ink-3)]">{c.label}</span>
                )}
              </span>
            );
          })}
        </nav>
      )}
      <span className="page-hero-eyebrow inline-flex items-center gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] text-[var(--ink-3)] uppercase">
        {eyebrow}
      </span>
      <h1 className="mt-6 font-display font-bold text-[clamp(36px,4.6vw,60px)] leading-[1.05] tracking-[-0.02em] text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
        {headline}
      </h1>
      <p className="mt-6 font-sans text-[17px] leading-[1.55] text-[var(--ink-2)] max-[800px]:text-[15px]">
        {sub}
      </p>
    </div>
  );

  return (
    <section className="page-hero relative overflow-hidden bg-bg pt-[var(--section-y-lg)] px-12 max-[800px]:px-6">
      <div className="page-hero-bg absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-[1] max-w-container mx-auto">
        {image ? (
          <div className="page-hero-grid">
            {text}
            <div className="page-hero-image">{image}</div>
          </div>
        ) : (
          text
        )}
      </div>
    </section>
  );
}
