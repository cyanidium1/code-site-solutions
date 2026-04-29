import Link from "next/link";
import "./page-hero.css";

export type Crumb = { label: string; href?: string };

export function PageHero({
  breadcrumbs = [],
  eyebrow,
  headline,
  sub,
}: {
  breadcrumbs?: Crumb[];
  eyebrow: string;
  headline: React.ReactNode;
  sub: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-bg pt-[120px] px-12 pb-20 max-[800px]:pt-20 max-[800px]:px-6 max-[800px]:pb-[60px]">
      <div className="page-hero-bg absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-[1] max-w-container mx-auto">
        {breadcrumbs.length > 0 && (
          <nav
            className="flex flex-wrap gap-2 items-center font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--ink-3)] mb-9 max-[800px]:mb-6 [&_a]:text-[var(--ink-2)] [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-ink"
            aria-label="Breadcrumbs"
          >
            {breadcrumbs.map((c, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={i} style={{ display: "contents" }}>
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
        <h1 className="mt-6 font-display font-bold text-[clamp(36px,4.6vw,60px)] leading-[1.05] tracking-[-0.02em] text-ink max-w-[920px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
          {headline}
        </h1>
        <p className="mt-6 font-sans text-[17px] leading-[1.55] text-[var(--ink-2)] max-w-[720px] max-[800px]:text-[15px]">
          {sub}
        </p>
      </div>
    </section>
  );
}
