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

const BTN_BASE =
  "inline-flex items-center gap-2.5 px-[26px] py-[13px] rounded-full font-sans font-semibold text-[13.5px] tracking-[0.04em] no-underline cursor-pointer transition-[transform,box-shadow,background,color,border-color] duration-200 max-[800px]:justify-center max-[800px]:px-[22px] max-[800px]:py-[14px]";

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
    <section className="relative py-[100px] px-12 bg-bg max-[800px]:py-[60px] max-[800px]:px-6">
      <div className="max-w-container mx-auto">
        <div className="cta-banner-card relative px-12 py-16 border border-line rounded-[28px] overflow-hidden text-center flex flex-col items-center max-[800px]:px-6 max-[800px]:py-11 max-[800px]:rounded-[22px]">
          {eyebrow ? (
            <span className="cta-banner-eyebrow relative inline-flex items-center gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] text-[var(--ink-3)] uppercase mb-6">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="relative font-display font-bold text-[clamp(28px,3.6vw,48px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[780px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent max-[800px]:text-[clamp(24px,6.5vw,34px)]">
            {heading}
          </h2>
          {sub ? (
            <p className="relative mt-4.5 font-sans text-[16px] leading-[1.55] text-[var(--ink-2)] max-w-[620px] max-[800px]:text-[14.5px]">
              {sub}
            </p>
          ) : null}
          <div className="relative mt-9 flex gap-3 flex-wrap justify-center max-[800px]:mt-7 max-[800px]:flex-col max-[800px]:w-full max-[800px]:items-stretch">
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
                className={`${BTN_BASE} bg-transparent text-ink border border-[var(--line-2)] hover:border-[oklch(from_var(--accent)_l_c_h_/_0.5)] hover:bg-[oklch(1_0_0_/_0.04)]`}
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
