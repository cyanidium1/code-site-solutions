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

const BTN_BASE =
  "inline-flex items-center justify-center gap-2.5 px-[22px] py-[14px] rounded-full font-sans font-semibold text-[13.5px] tracking-[0.04em] no-underline cursor-pointer transition-[transform,box-shadow,background,color,border-color] duration-200 lg:justify-normal lg:px-[26px] lg:py-[13px]";

// Card background: 3-layer radial gradient. Inline as arbitrary value so
// no semantic class is needed; the long string is contained to this constant.
const CARD_BG =
  "bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_60%_at_100%_100%,oklch(from_var(--color-accent-2)_l_c_h_/_0.06),transparent_70%),oklch(1_0_0_/_0.02)]";

// Top accent line pseudo-element (legacy .cta-banner-card::before).
const TOP_ACCENT =
  "before:content-[''] before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.5),transparent)] before:pointer-events-none lg:before:inset-x-6";

// Subtle grid background overlay (legacy .cta-banner-card::after).
const GRID_OVERLAY =
  "after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_right,oklch(1_0_0_/_0.022)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.022)_1px,transparent_1px)] after:[background-size:48px_48px] after:[mask:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent_80%)] after:pointer-events-none";

// Eyebrow dot pseudo-element (legacy .cta-banner-eyebrow::before).
const EYEBROW_DOT =
  "before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)]";

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
    <section className="relative bg-bg px-6 py-14 lg:px-12 lg:py-[100px]">
      <div className="mx-auto max-w-container">
        <div
          className={`relative flex flex-col items-center overflow-hidden rounded-[22px] border border-line px-6 py-11 text-center lg:rounded-[28px] lg:px-12 lg:py-16 ${CARD_BG} ${TOP_ACCENT} ${GRID_OVERLAY}`}
        >
          {eyebrow ? (
            <span
              className={`relative mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-3)] ${EYEBROW_DOT}`}
            >
              {eyebrow}
            </span>
          ) : null}
          <h2 className="relative max-w-[780px] font-display text-[clamp(24px,6.5vw,34px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink lg:text-[clamp(28px,3.6vw,48px)] [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:italic [&_em]:text-transparent">
            {heading}
          </h2>
          {sub ? (
            <p className="relative mt-4.5 max-w-[620px] font-sans text-[14.5px] leading-[1.55] text-[var(--color-ink-dim)] lg:text-[16px]">
              {sub}
            </p>
          ) : null}
          <div className="relative mt-7 w-full flex flex-col items-stretch flex-wrap justify-center gap-3 lg:mt-9 lg:w-auto lg:flex-row lg:items-center">
            <a
              href={ctaPrimary.href}
              className={`${BTN_BASE} bg-brand-gradient text-white shadow-[0_4px_24px_oklch(0.55_0.18_295/_0.35)] hover:-translate-y-px hover:shadow-[0_6px_32px_oklch(0.55_0.18_295/_0.45)]`}
            >
              {ctaPrimary.label}
              {ARROW}
            </a>
            {ctaSecondary ? (
              <a
                href={ctaSecondary.href}
                className={`${BTN_BASE} border border-[var(--color-line-strong)] bg-transparent text-ink hover:border-[oklch(from_var(--color-accent)_l_c_h_/_0.5)] hover:bg-[oklch(1_0_0_/_0.04)]`}
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
