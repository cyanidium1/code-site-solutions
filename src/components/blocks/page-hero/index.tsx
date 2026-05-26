import Link from "next/link";
import type { ReactNode } from "react";
import { H1 } from "@/components/ui";

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
      <H1 variant="page-hero" className="mt-6 text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
        {headline}
      </H1>
      <p className="mt-6 font-sans text-[15px] leading-[1.55] text-ink-dim lg:text-[17px]">
        {sub}
      </p>
    </div>
  );

  return (
    <section className="page-hero relative overflow-hidden bg-bg pt-[72px] lg:pt-[120px] px-6 lg:px-12">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_80%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),radial-gradient(ellipse_40%_50%_at_10%_100%,oklch(from_var(--color-accent-2)_l_c_h_/_0.04),transparent_70%)] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,oklch(1_0_0_/_0.022)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.022)_1px,transparent_1px)] before:bg-[length:64px_64px] before:[mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]" />
      <div className="relative z-[1] max-w-container mx-auto">
        {image ? (
          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-12 items-center max-[960px]:grid-cols-1 max-[960px]:gap-8">
            {text}
            <div className="flex items-center justify-center [&>img]:max-w-full [&>img]:h-auto [&>img]:block [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:block [&>video]:max-w-full [&>video]:h-auto [&>video]:block">{image}</div>
          </div>
        ) : (
          text
        )}
      </div>
    </section>
  );
}
