import {
  CheckIcon,
  CHECK_PILL,
  BENEFIT_LIST,
} from "./mocks";

// Re-export the device-mock components so the directory's public API stays
// identical: `industry-page` imports these from `@/components/blocks/outcome`.
export { MockImage, MockPages, MockBookingForm, MockAdmin } from "./mocks";

const BENEFIT_ROW_BASE =
  "grid grid-cols-1 gap-[22px] items-center py-8 border-t border-line relative last:border-b last:border-line md:gap-7 md:py-10 xl:grid-cols-2 xl:gap-12 xl:py-14";

const BENEFIT_ROW_REVERSE_ORDER =
  "[&>:first-child]:-order-1 [&>:last-child]:order-0 xl:[&>:first-child]:order-2 xl:[&>:last-child]:order-1";

const BENEFIT_TEXT = "px-0 xl:px-2";

const BENEFIT_ROW_NUM =
  "font-mono text-[11px] text-ink-3 tracking-[0.08em] mb-3.5 inline-flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-px before:bg-accent-soft";

const BENEFIT_H3 =
  "font-display font-bold text-[22px] leading-[1.1] tracking-[-0.025em] mb-6 text-ink text-balance max-w-full md:text-[clamp(24px,2.6vw,32px)] xl:max-w-[18ch] [&_em]:italic [&_em]:font-light [&_em]:text-accent-soft";

export type OutcomeBenefitRow = {
  feature: string;
  heading: React.ReactNode;
  items: React.ReactNode[];
  mock: React.ReactNode;
};

export type OutcomeProps = {
  recapEyebrow: React.ReactNode;
  recapText: React.ReactNode;
  directionsEyebrow: React.ReactNode;
  directionsTitle: React.ReactNode;
  directionsLede: React.ReactNode;
  replaceLabel: React.ReactNode;
  replaceItems: React.ReactNode[];
  allowedLabel: React.ReactNode;
  allowedItems: React.ReactNode[];
  benefitsHeading: React.ReactNode;
  benefitsSub: React.ReactNode;
  benefitHeroValue: React.ReactNode;
  benefitHeroLede: React.ReactNode;
  benefitHeroSource: React.ReactNode;
  benefitHeroBullets: React.ReactNode[];
  benefitRows: OutcomeBenefitRow[];
};

export function Outcome({
  recapEyebrow,
  recapText,
  directionsEyebrow,
  directionsTitle,
  directionsLede,
  replaceLabel,
  replaceItems,
  allowedLabel,
  allowedItems,
  benefitsHeading,
  benefitsSub,
  benefitHeroValue,
  benefitHeroLede,
  benefitHeroSource,
  benefitHeroBullets,
  benefitRows,
}: OutcomeProps) {
  const hasHero = Boolean(
    benefitHeroValue || benefitHeroLede || benefitHeroBullets.length > 0,
  );
  return (
    <section className="relative py-14 lg:py-[100px] px-[18px] md:px-8 xl:px-12 bg-bg overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_90%_10%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_40%_50%_at_5%_80%,oklch(from_var(--color-accent-2)_l_c_h_/_0.08),transparent_70%)]" />
      <div className="relative z-[2] max-w-container mx-auto">
        {/* Recap pull-quote */}
        {recapEyebrow || recapText ? (
          <div className="max-w-[760px] mx-auto mb-14 text-center relative xl:mb-20">
            {recapEyebrow ? (
              <div className="inline-flex items-center gap-2.5 pl-3 pr-3.5 py-[7px] border border-line-strong rounded-full text-[11px] font-medium tracking-[0.12em] text-ink-dim bg-[oklch(1_0_0_/_0.025)] mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                <span>{recapEyebrow}</span>
              </div>
            ) : null}
            {recapText ? (
              <p className="font-display font-normal text-[18px] leading-[1.45] tracking-[-0.015em] text-ink text-balance md:text-[clamp(20px,2.2vw,28px)] md:leading-[1.4] [&_em]:italic [&_em]:font-medium [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_strong]:text-ink [&_strong]:font-bold">
                {recapText}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Directions card */}
        <article className="relative border border-line-strong rounded-[18px] bg-[linear-gradient(180deg,oklch(1_0_0_/_0.02),oklch(1_0_0_/_0.005))] px-5 py-6 mb-14 overflow-hidden md:p-8 md:mb-20 md:rounded-3xl xl:pt-11 xl:px-12 xl:pb-11 xl:mb-[120px] before:content-[''] before:absolute before:top-0 before:right-0 before:w-[200px] before:h-[200px] before:pointer-events-none before:bg-[radial-gradient(circle_at_top_right,oklch(from_var(--color-accent)_l_c_h_/_0.12),transparent_70%)]">
          {directionsEyebrow ? (
            <div className="inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.12em] text-accent-soft uppercase mb-3.5 before:content-[''] before:w-[22px] before:h-px before:bg-accent-soft">
              {directionsEyebrow}
            </div>
          ) : null}
          <h3 className="font-display font-bold text-[22px] leading-[1.05] tracking-[-0.025em] mb-[18px] text-ink text-balance max-w-[24ch] md:text-[clamp(26px,3.2vw,38px)] [&_em]:italic [&_em]:font-light [&_em]:text-accent-soft">
            {directionsTitle}
          </h3>
          <p className="text-[14px] leading-[1.7] text-ink-dim mb-[26px] max-w-[70ch] md:text-[15px] md:mb-9 [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium">
            {directionsLede}
          </p>
          <div className="grid grid-cols-1 gap-7 pt-[22px] border-t border-dashed border-line md:grid-cols-2 md:gap-8 md:pt-7 xl:gap-12">
            <div>
              <h4 className="font-display text-[11px] font-bold tracking-[0.15em] uppercase text-ink-3 mb-[18px] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.05_60)]" />
                {replaceLabel}
              </h4>
              <ul className="list-none flex flex-col gap-3 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.55] [&>li]:text-ink-dim [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium md:[&>li]:text-[14px]">
                {replaceItems.map((it, i) => (
                  <li key={i}>
                    <span className="w-[18px] h-[18px] rounded-full shrink-0 mt-px inline-flex items-center justify-center text-[4px] text-ink-3 border border-line-strong">
                      ●
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-[11px] font-bold tracking-[0.15em] uppercase text-ink-3 mb-[18px] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-soft shadow-[0_0_8px_var(--color-accent-soft)]" />
                {allowedLabel}
              </h4>
              <ul className="list-none flex flex-col gap-3 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.55] [&>li]:text-ink-dim [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium md:[&>li]:text-[14px]">
                {allowedItems.map((it, i) => (
                  <li key={i}>
                    <span className={CHECK_PILL}><CheckIcon /></span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Benefits header */}
        <header
          className={`mb-10 pb-[22px] ${hasHero ? "border-b border-line" : ""} grid grid-cols-1 gap-6 items-start xl:mb-14 xl:pb-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-14 xl:items-end`}
        >
          <h2 className="font-display font-bold text-[clamp(24px,6vw,32px)] leading-none tracking-[-0.035em] text-ink text-balance max-w-full md:text-[clamp(34px,4.6vw,60px)] xl:max-w-[16ch] [&_em]:italic [&_em]:font-light [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
            {benefitsHeading}
          </h2>
          {benefitsSub ? (
            <p className="text-[14px] leading-[1.65] text-ink-dim text-pretty pb-2 md:text-[15px] [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium">
              {benefitsSub}
            </p>
          ) : null}
        </header>

        {/* Benefit hero — hidden when no content. Skipping the box avoids
            rendering an empty gradient frame for industries that don't ship
            a hero metric. */}
        {hasHero ? (
          <div className="grid grid-cols-1 gap-[22px] items-center px-[22px] py-6 mb-8 border border-accent-35 rounded-[18px] bg-[linear-gradient(135deg,oklch(from_var(--color-accent)_l_c_h_/_0.10),oklch(from_var(--color-accent-2)_l_c_h_/_0.06)_60%,transparent)] relative overflow-hidden shadow-[0_30px_60px_oklch(from_var(--color-accent)_l_c_h_/_0.18)] md:gap-7 md:p-8 md:rounded-3xl xl:grid-cols-2 xl:gap-12 xl:py-11 xl:px-12 before:content-[''] before:absolute before:top-[-40%] before:right-[-20%] before:w-[60%] before:h-[180%] before:pointer-events-none before:bg-[radial-gradient(ellipse_at_center,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%)]">
            <div className="relative z-[2]">
              <div className="font-display font-bold text-[48px] leading-[0.85] tracking-[-0.05em] bg-brand-gradient bg-clip-text text-transparent tabular-nums mb-3.5 md:text-[clamp(52px,7vw,80px)] min-[1080px]:text-[clamp(56px,8vw,96px)]">
                {benefitHeroValue}
              </div>
              <div className="text-[14px] leading-[1.5] text-ink font-medium mb-2 md:text-[15px]">
                {benefitHeroLede}
              </div>
              <div className="font-mono text-[11px] text-ink-3 tracking-[0.04em]">
                {benefitHeroSource}
              </div>
            </div>
            <ul className="list-none flex flex-col gap-3.5 relative z-[2] [&>li]:flex [&>li]:items-center [&>li]:gap-3 [&>li]:text-[14px] [&>li]:text-ink [&>li]:font-medium md:[&>li]:text-[15px]">
              {benefitHeroBullets.map((b, i) => (
                <li key={i}>
                  <span className={CHECK_PILL}><CheckIcon /></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Benefit rows */}
        {benefitRows.map((row, idx) => {
          const reverse = idx % 2 === 1;
          return (
            <div
              key={idx}
              className={`${BENEFIT_ROW_BASE}${reverse ? ` ${BENEFIT_ROW_REVERSE_ORDER}` : ""}`}
            >
              {row.mock}
              <div className={BENEFIT_TEXT}>
                <div className={BENEFIT_ROW_NUM}>{row.feature}</div>
                <h3 className={BENEFIT_H3}>{row.heading}</h3>
                <ul className={BENEFIT_LIST}>
                  {row.items.map((it, i) => (
                    <li key={i}>
                      <span className={CHECK_PILL}><CheckIcon /></span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
