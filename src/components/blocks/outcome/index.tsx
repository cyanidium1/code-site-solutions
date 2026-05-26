function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const VISUAL_SHELL =
  "relative rounded-[14px] border border-[var(--color-line-strong)] bg-[linear-gradient(135deg,oklch(0.18_0.005_300),oklch(0.14_0.006_300))] aspect-[16/11] overflow-hidden flex items-center justify-center shadow-[0_30px_60px_oklch(0_0_0_/_0.4)] md:aspect-[4/3] md:rounded-[18px] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.04)_1px,transparent_0)] before:bg-[length:20px_20px]";

const VISUAL_BAR =
  "absolute top-0 left-0 right-0 h-[30px] flex items-center gap-1.5 px-3.5 bg-[oklch(0.16_0.004_300)] border-b border-[oklch(1_0_0_/_0.06)] [&>span:not(.url)]:w-[9px] [&>span:not(.url)]:h-[9px] [&>span:not(.url)]:rounded-full [&>span:not(.url)]:bg-[oklch(0.3_0.005_60)]";

const VISUAL_URL =
  "url flex-1 ml-2 h-4 bg-[oklch(0.22_0.005_300)] rounded font-mono text-[9px] text-[var(--color-ink-3)] inline-flex items-center px-2.5 max-w-[200px]";

const VISUAL_CONTENT =
  "absolute inset-x-0 bottom-0 top-[30px] p-6 flex flex-col gap-3.5";

const CHECK_PILL =
  "w-[18px] h-[18px] rounded-full shrink-0 mt-px inline-flex items-center justify-center bg-accent-18 text-accent-soft border border-accent-30";

const BENEFIT_LIST =
  "flex flex-col gap-3 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.55] [&>li]:text-[var(--color-ink-dim)] [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium [&>li_mark]:bg-accent-18 [&>li_mark]:text-accent-soft [&>li_mark]:px-1.5 [&>li_mark]:py-px [&>li_mark]:rounded [&>li_mark]:font-medium md:[&>li]:text-[14px]";

export function MockPages({
  url,
  tags,
}: { url: string; tags: React.ReactNode[] }) {
  return (
    <div className={VISUAL_SHELL}>
      <div className={VISUAL_BAR}>
        <span /><span /><span />
        <span className={VISUAL_URL}>{url}</span>
      </div>
      <div className={VISUAL_CONTENT}>
        <div className="grid grid-cols-3 gap-2 h-full md:gap-3">
          {tags.map((t, i) => (
            <div
              key={i}
              className="bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-lg px-1.5 py-2 flex flex-col gap-2 md:px-2.5 md:py-3"
            >
              <div className="font-mono text-[8px] text-accent-soft tracking-[0.08em] uppercase">
                {t}
              </div>
              <div className="h-[32%] min-h-9 bg-[linear-gradient(135deg,oklch(from_var(--color-accent)_l_c_h_/_0.2),oklch(0.3_0.01_300))] rounded-[5px]" />
              <div className="h-1 bg-[oklch(1_0_0_/_0.1)] rounded-[2px]" />
              <div className="h-1 bg-[oklch(1_0_0_/_0.1)] rounded-[2px] w-[60%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MOCK_FORM_STRINGS = {
  uk: {
    heading: "Запис на консультацію",
    name: "Олена Петрова",
    phone: "+380 ··",
    service: "Стоматологія / гігієна",
    cta: "Записатися",
  },
  en: {
    heading: "Book a consultation",
    name: "Emma Petersen",
    phone: "+44 ··",
    service: "Dental hygiene",
    cta: "Book →",
  },
} as const;

export function MockBookingForm({
  url,
  locale = "uk",
}: {
  url: string;
  locale?: string;
}) {
  const s =
    locale === "en" ? MOCK_FORM_STRINGS.en : MOCK_FORM_STRINGS.uk;
  return (
    <div className={VISUAL_SHELL}>
      <div className={VISUAL_BAR}>
        <span /><span /><span />
        <span className={VISUAL_URL}>{url}</span>
      </div>
      <div className={VISUAL_CONTENT}>
        <div className="bg-[oklch(0.16_0.005_300)] border border-[oklch(1_0_0_/_0.08)] rounded-[10px] p-3.5 m-auto w-[86%] flex flex-col gap-2.5 shadow-[0_20px_40px_oklch(0_0_0_/_0.4)] md:w-[70%] md:p-[18px]">
          <div className="font-display text-[11px] font-semibold text-ink mb-1 tracking-[-0.01em]">
            {s.heading}
          </div>
          <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-[var(--color-ink-3)]">
            {s.name}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-[var(--color-ink-3)]">
              {s.phone}
            </div>
            <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-[var(--color-ink-3)]">
              17:30
            </div>
          </div>
          <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-[var(--color-ink-3)]">
            {s.service}
          </div>
          <div className="h-[30px] mt-1 bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))] rounded-md flex items-center justify-center font-display text-[10px] font-semibold text-[oklch(1_0_0_/_0.95)] tracking-[0.02em]">
            {s.cta}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockAdmin({ url }: { url: string }) {
  return (
    <div className={VISUAL_SHELL}>
      <div className={VISUAL_BAR}>
        <span /><span /><span />
        <span className={VISUAL_URL}>{url}</span>
      </div>
      <div className={VISUAL_CONTENT}>
        <div className="grid grid-cols-[110px_1fr] gap-3 h-full">
          <div className="bg-[oklch(0.16_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-lg pt-3.5 px-2.5 pb-3.5 flex flex-col gap-2">
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-accent-30 border-l-2 border-l-accent-soft rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
          </div>
          <div className="bg-[oklch(0.16_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-lg p-3.5 flex flex-col gap-2.5">
            <div className="h-[22px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[22px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[60px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[22px] bg-[oklch(0.22_0.005_300)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

const BENEFIT_ROW_BASE =
  "grid grid-cols-1 gap-[22px] items-center py-8 border-t border-line relative last:border-b last:border-line md:gap-7 md:py-10 xl:grid-cols-2 xl:gap-12 xl:py-14";

const BENEFIT_ROW_REVERSE_ORDER =
  "[&>:first-child]:-order-1 [&>:last-child]:order-0 xl:[&>:first-child]:order-2 xl:[&>:last-child]:order-1";

const BENEFIT_TEXT = "px-0 xl:px-2";

const BENEFIT_ROW_NUM =
  "font-mono text-[11px] text-[var(--color-ink-3)] tracking-[0.08em] mb-3.5 inline-flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-px before:bg-[var(--color-accent-soft)]";

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
  return (
    <section className="relative py-14 lg:py-[100px] px-[18px] md:px-8 xl:px-12 bg-bg overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_90%_10%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_40%_50%_at_5%_80%,oklch(from_var(--color-accent-2)_l_c_h_/_0.08),transparent_70%)]" />
      <div className="relative z-[2] max-w-container mx-auto">
        {/* Recap pull-quote */}
        <div className="max-w-[760px] mx-auto mb-14 text-center relative xl:mb-20">
          <div className="inline-flex items-center gap-2.5 pl-3 pr-3.5 py-[7px] border border-[var(--color-line-strong)] rounded-full text-[11px] font-medium tracking-[0.12em] text-[var(--color-ink-dim)] bg-[oklch(1_0_0_/_0.025)] mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
            <span>{recapEyebrow}</span>
          </div>
          <p className="font-display font-normal text-[18px] leading-[1.45] tracking-[-0.015em] text-ink text-balance md:text-[clamp(20px,2.2vw,28px)] md:leading-[1.4] [&_em]:italic [&_em]:font-medium [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_strong]:text-ink [&_strong]:font-bold">
            {recapText}
          </p>
        </div>

        {/* Directions card */}
        <article className="relative border border-[var(--color-line-strong)] rounded-[18px] bg-[linear-gradient(180deg,oklch(1_0_0_/_0.02),oklch(1_0_0_/_0.005))] px-5 py-6 mb-14 overflow-hidden md:p-8 md:mb-20 md:rounded-3xl xl:pt-11 xl:px-12 xl:pb-11 xl:mb-[120px] before:content-[''] before:absolute before:top-0 before:right-0 before:w-[200px] before:h-[200px] before:pointer-events-none before:bg-[radial-gradient(circle_at_top_right,oklch(from_var(--color-accent)_l_c_h_/_0.12),transparent_70%)]">
          <div className="inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.12em] text-accent-soft uppercase mb-3.5 before:content-[''] before:w-[22px] before:h-px before:bg-[var(--color-accent-soft)]">
            {directionsEyebrow}
          </div>
          <h3 className="font-display font-bold text-[22px] leading-[1.05] tracking-[-0.025em] mb-[18px] text-ink text-balance max-w-[24ch] md:text-[clamp(26px,3.2vw,38px)] [&_em]:italic [&_em]:font-light [&_em]:text-accent-soft">
            {directionsTitle}
          </h3>
          <p className="text-[14px] leading-[1.7] text-[var(--color-ink-dim)] mb-[26px] max-w-[70ch] md:text-[15px] md:mb-9 [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium">
            {directionsLede}
          </p>
          <div className="grid grid-cols-1 gap-7 pt-[22px] border-t border-dashed border-line md:grid-cols-2 md:gap-8 md:pt-7 xl:gap-12">
            <div>
              <h4 className="font-display text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--color-ink-3)] mb-[18px] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.05_60)]" />
                {replaceLabel}
              </h4>
              <ul className="list-none flex flex-col gap-3 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.55] [&>li]:text-[var(--color-ink-dim)] [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium md:[&>li]:text-[14px]">
                {replaceItems.map((it, i) => (
                  <li key={i}>
                    <span className="w-[18px] h-[18px] rounded-full shrink-0 mt-px inline-flex items-center justify-center text-[4px] text-[var(--color-ink-3)] border border-[var(--color-line-strong)]">
                      ●
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--color-ink-3)] mb-[18px] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-soft shadow-[0_0_8px_var(--color-accent-soft)]" />
                {allowedLabel}
              </h4>
              <ul className="list-none flex flex-col gap-3 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.55] [&>li]:text-[var(--color-ink-dim)] [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium md:[&>li]:text-[14px]">
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
        <header className="mb-10 pb-[22px] border-b border-line grid grid-cols-1 gap-6 items-start xl:mb-14 xl:pb-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-14 xl:items-end">
          <h2 className="font-display font-bold text-[clamp(28px,9vw,38px)] leading-none tracking-[-0.035em] text-ink text-balance max-w-full md:text-[clamp(34px,4.6vw,60px)] xl:max-w-[16ch] [&_em]:italic [&_em]:font-light [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
            {benefitsHeading}
          </h2>
          <p className="text-[14px] leading-[1.65] text-[var(--color-ink-dim)] text-pretty pb-2 md:text-[15px] [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium">
            {benefitsSub}
          </p>
        </header>

        {/* Benefit hero — hidden when no content. Skipping the box avoids
            rendering an empty gradient frame for industries that don't ship
            a hero metric. */}
        {(benefitHeroValue || benefitHeroLede || benefitHeroBullets.length > 0) ? (
          <div className="grid grid-cols-1 gap-[22px] items-center px-[22px] py-6 mb-8 border border-accent-35 rounded-[18px] bg-[linear-gradient(135deg,oklch(from_var(--color-accent)_l_c_h_/_0.10),oklch(from_var(--color-accent-2)_l_c_h_/_0.06)_60%,transparent)] relative overflow-hidden shadow-[0_30px_60px_oklch(from_var(--color-accent)_l_c_h_/_0.18)] md:gap-7 md:p-8 md:rounded-3xl xl:grid-cols-2 xl:gap-12 xl:py-11 xl:px-12 before:content-[''] before:absolute before:top-[-40%] before:right-[-20%] before:w-[60%] before:h-[180%] before:pointer-events-none before:bg-[radial-gradient(ellipse_at_center,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%)]">
            <div className="relative z-[2]">
              <div className="font-display font-bold text-[64px] leading-[0.85] tracking-[-0.05em] bg-brand-gradient bg-clip-text text-transparent tabular-nums mb-3.5 md:text-[clamp(52px,7vw,80px)] min-[1080px]:text-[clamp(56px,8vw,96px)]">
                {benefitHeroValue}
              </div>
              <div className="text-[14px] leading-[1.5] text-ink font-medium mb-2 md:text-[15px]">
                {benefitHeroLede}
              </div>
              <div className="font-mono text-[11px] text-[var(--color-ink-3)] tracking-[0.04em]">
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
