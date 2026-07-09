import { CheckIcon } from "./icons";

// React-hoisted style (see blocks/case/index.tsx for the rationale): costs
// bytes only on routes that render this card, no extra request.
const CARD_WASH_CSS = `
.csb-services-card-wash::after{background-image:linear-gradient(180deg,oklch(0.12 0.005 300 / 0.78) 0%,oklch(0.12 0.005 300 / 0.92) 60%,oklch(0.12 0.005 300 / 0.96) 100%),radial-gradient(ellipse 80% 60% at 70% 30%,oklch(from var(--color-accent) l c h / 0.18),transparent 70%)}
`;

export type Feature = {
  icon: React.ReactNode;
  bg: string;
  title: string;
  items: React.ReactNode[];
};

/**
 * Compact secondary feature — icon + title + first bullet only.
 * Used for "secondary" services (the last 3 of 6) so the grid isn't
 * 6 uniform cards (the AI-smell pattern). Visually reads as an
 * addendum: smaller padding, no bg image, single-line summary.
 */
export function SecondaryFeatureCard({ icon, title, items }: Feature) {
  // Use the first bullet as a one-line description if available.
  const blurb = items.length > 0 ? items[0] : null;
  return (
    <div className="relative px-4 py-3.5 border border-line rounded-[14px] bg-[oklch(0.16_0.005_300)] transition-[border-color,background] duration-[200ms] flex items-center gap-3 hover:border-line-strong hover:bg-[oklch(0.18_0.005_300)] md:px-5 md:py-4 md:gap-4">
      <div className="w-8 h-8 shrink-0 rounded-lg bg-accent-12 text-accent-soft border border-accent-22 flex items-center justify-center md:w-9 md:h-9 [&>svg]:w-[18px] [&>svg]:h-[18px]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[12px] tracking-[0.04em] uppercase leading-tight text-ink mb-1 md:text-[13px]">
          {title}
        </div>
        {blurb ? (
          <div className="text-[11.5px] leading-[1.45] text-ink-dim line-clamp-1 [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium md:text-[12.5px]">
            {blurb}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function FeatureCard({ icon, title, items, bg }: Feature) {
  return (
    <div className="relative pt-[22px] px-5 pb-6 border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] flex flex-col gap-3.5 overflow-hidden isolate md:pt-7 md:px-[26px] md:pb-[30px] md:gap-[18px] after:content-[''] after:absolute after:inset-0 after:-z-[1] after:pointer-events-none after:transition-opacity after:duration-300 csb-services-card-wash">
      <style href="csb-services-card" precedence="csb">{CARD_WASH_CSS}</style>
      <div
        className="absolute inset-0 -z-[2] bg-cover bg-center [filter:saturate(0.7)]"
        // eslint-disable-next-line react/forbid-dom-props -- dynamic background-image URL
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="w-[38px] h-[38px] rounded-[10px] bg-brand-gradient flex items-center justify-center text-[oklch(1_0_0_/_0.95)] shadow-[0_8px_20px_oklch(from_var(--color-accent)_l_c_h_/_0.3)] md:w-11 md:h-11 md:rounded-xl">
        {icon}
      </div>
      <h3 className="font-display font-bold text-[13px] tracking-[0.05em] uppercase leading-[1.2] text-ink text-balance md:text-[15px]">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5 [&>li]:flex [&>li]:items-start [&>li]:gap-2.5 [&>li]:text-[12px] [&>li]:leading-[1.5] [&>li]:text-ink-dim [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium md:[&>li]:text-[13px]">
        {items.map((it, i) => (
          <li key={i}>
            <span className="w-4 h-4 rounded-full bg-accent-18 text-accent-soft border border-accent-25 mt-0.5 inline-flex items-center justify-center shrink-0">
              <CheckIcon />
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
