import "./cta-banner.css";

export type CtaBannerAction = { label: string; href: string };

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function CtaBanner({
  eyebrow,
  heading,
  sub,
  ctaPrimary,
  ctaSecondary,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  sub?: React.ReactNode;
  ctaPrimary: CtaBannerAction;
  ctaSecondary?: CtaBannerAction;
}) {
  return (
    <section className="cta-banner">
      <div className="cta-banner-container">
        <div className="cta-banner-card">
          {eyebrow ? (
            <span className="cta-banner-eyebrow">{eyebrow}</span>
          ) : null}
          <h2 className="cta-banner-heading">{heading}</h2>
          {sub ? <p className="cta-banner-sub">{sub}</p> : null}
          <div className="cta-banner-actions">
            <a
              href={ctaPrimary.href}
              className="cta-banner-btn cta-banner-btn-primary"
            >
              {ctaPrimary.label}
              {ARROW}
            </a>
            {ctaSecondary ? (
              <a
                href={ctaSecondary.href}
                className="cta-banner-btn cta-banner-btn-secondary"
              >
                {ctaSecondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
