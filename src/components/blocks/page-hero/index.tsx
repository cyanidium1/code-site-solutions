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
    <section className="page-hero">
      <div className="page-hero-bg" />
      <div className="page-hero-container">
        {breadcrumbs.length > 0 && (
          <nav className="page-hero-breadcrumbs" aria-label="Breadcrumbs">
            {breadcrumbs.map((c, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={i} style={{ display: "contents" }}>
                  {i > 0 && <span className="page-hero-crumb-sep">/</span>}
                  {c.href && !isLast ? (
                    <Link href={c.href}>{c.label}</Link>
                  ) : (
                    <span className="page-hero-crumb-current">{c.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
        )}
        <span className="page-hero-eyebrow">{eyebrow}</span>
        <h1 className="page-hero-h1">{headline}</h1>
        <p className="page-hero-sub">{sub}</p>
      </div>
    </section>
  );
}
