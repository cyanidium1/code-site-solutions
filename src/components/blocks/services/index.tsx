function IcCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcDoctors() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 18c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcPrice() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcServices() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IcShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Default medicine-feature icons in the order used by `DEFAULT_FEATURES`.
 *  Re-exported so the CMS-driven `[slug]` page can reuse them by index — the
 *  industryPage schema doesn't carry an icon field. */
export const MEDICINE_FEATURE_ICONS: React.ReactNode[] = [
  <IcCalendar key="cal" />,
  <IcDoctors key="doc" />,
  <IcPrice key="price" />,
  <IcServices key="svc" />,
  <IcShield key="shield" />,
  <IcPin key="pin" />,
];

/**
 * Per-industry feature-icon sets. The 6 SVG primitives in this file are
 * intentionally generic (calendar, people, price-card, services-grid,
 * shield, pin) — they read as the right metaphor for medicine/renovation/
 * legal/etc. without being literal. Where a domain needs a *different*
 * 6-tuple we override below; otherwise it falls back to medicine.
 *
 * Slugs match the SERVICE_NAV_LINKS keys in `header-services.ts` and the
 * Sanity industry-page slug field. Add more rows as new industries ship.
 */
const INDUSTRY_FEATURE_ICONS: Record<string, React.ReactNode[]> = {
  medicine: MEDICINE_FEATURE_ICONS,
  // Renovation/Construction: visit booking, team, transparent estimate,
  // services catalog, warranty, location.  Reuses the same primitives —
  // they're already domain-neutral. Substitute domain-specific icons here
  // when commission-shooting them.
  renovation: MEDICINE_FEATURE_ICONS,
  legal: MEDICINE_FEATURE_ICONS,
  accounting: MEDICINE_FEATURE_ICONS,
  ecommerce: MEDICINE_FEATURE_ICONS,
  saas: MEDICINE_FEATURE_ICONS,
  cosmetology: MEDICINE_FEATURE_ICONS,
  education: MEDICINE_FEATURE_ICONS,
};

/** Returns the icon set for a given industry slug, with medicine fallback. */
export function featureIconsForIndustry(slug?: string): React.ReactNode[] {
  if (slug && INDUSTRY_FEATURE_ICONS[slug]) return INDUSTRY_FEATURE_ICONS[slug];
  return MEDICINE_FEATURE_ICONS;
}

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
    <div className="relative px-4 py-3.5 border border-line rounded-[14px] bg-[oklch(0.16_0.005_300)] transition-[border-color,background] duration-[200ms] flex items-center gap-3 hover:border-[var(--color-line-strong)] hover:bg-[oklch(0.18_0.005_300)] md:px-5 md:py-4 md:gap-4">
      <div className="w-8 h-8 shrink-0 rounded-lg bg-accent-12 text-accent-soft border border-accent-22 flex items-center justify-center md:w-9 md:h-9 [&>svg]:w-[18px] [&>svg]:h-[18px]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[12px] tracking-[0.04em] uppercase leading-tight text-ink mb-1 md:text-[13px]">
          {title}
        </div>
        {blurb ? (
          <div className="text-[11.5px] leading-[1.45] text-[var(--color-ink-dim)] line-clamp-1 [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium md:text-[12.5px]">
            {blurb}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function FeatureCard({ icon, title, items, bg }: Feature) {
  return (
    <div className="relative pt-[22px] px-5 pb-6 border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] flex flex-col gap-3.5 overflow-hidden isolate md:pt-7 md:px-[26px] md:pb-[30px] md:gap-[18px] after:content-[''] after:absolute after:inset-0 after:-z-[1] after:pointer-events-none after:transition-opacity after:duration-300 after:bg-[linear-gradient(180deg,oklch(0.12_0.005_300_/_0.78)_0%,oklch(0.12_0.005_300_/_0.92)_60%,oklch(0.12_0.005_300_/_0.96)_100%),radial-gradient(ellipse_80%_60%_at_70%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%)]">
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
      <ul className="flex flex-col gap-2.5 [&>li]:flex [&>li]:items-start [&>li]:gap-2.5 [&>li]:text-[12px] [&>li]:leading-[1.5] [&>li]:text-[var(--color-ink-dim)] [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium md:[&>li]:text-[13px]">
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


const SVC_H2_CLASSES =
  "font-display font-bold text-[clamp(26px,9vw,38px)] leading-none tracking-[-0.035em] text-ink text-balance max-w-full uppercase md:text-[clamp(34px,4.6vw,60px)] xl:max-w-[16ch] [&_em]:italic [&_em]:font-light [&_em]:normal-case [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_em]:inline-block [&_em]:pr-[0.12em] [&_em]:[margin-right:-0.04em]";

const SVC_HEADER_CLASSES =
  "grid grid-cols-1 gap-[22px] items-start pb-[22px] border-b border-line xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-14 xl:items-end xl:pb-7";

const SVC_SUB_BASE =
  "text-[13px] leading-[1.65] text-[var(--color-ink-dim)] text-pretty md:text-[15px] [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium";

export function Services({
  testimonialEyebrow = "ВІДГУК КЛІЄНТА",
  testimonialQuote = (
    <>
      Після запуску сайту ми почали отримувати в 3–4 рази більше
      заявок. Особливо виріс потік з Google. І найголовніше — ми тепер
      самі можемо змінювати все на сайті без розробників.
    </>
  ),
  testimonialAuthorInitials = "АП",
  testimonialAuthorName = "Анна П.",
  testimonialAuthorRole = "Засновниця клініки в Одесі",
  servicesHeading = (
    <>
      Що ми робимо для
      <br />
      <em>медичних</em> клінік
    </>
  ),
  servicesSub = (
    <>
      Не «ще один шаблонний медичний сайт». Кожен проєкт — під
      конкретну клініку, її спеціалізацію і регуляторні вимоги.
    </>
  ),
  features = [],
  integrationsHeading = (
    <>
      Підключаємо всі
      <br />
      <em>профільні</em> системи
    </>
  ),
  integrationsSub = (
    <>
      Заявка з сайту потрапляє одразу у вашу CRM. Адміністратор бачить
      запис у момент кліку. Лікар отримує сповіщення в Telegram. Пацієнт —
      SMS-підтвердження. Жодних втрачених лідів через листи у спамі або
      дзвінки в неробочий час.
    </>
  ),
  integrations = [],
  testimonialVisualSrc,
}: Partial<{
  testimonialEyebrow: string;
  testimonialQuote: React.ReactNode;
  testimonialAuthorInitials: string;
  testimonialAuthorName: string;
  testimonialAuthorRole: string;
  servicesHeading: React.ReactNode;
  servicesSub: React.ReactNode;
  features: Feature[];
  integrationsHeading: React.ReactNode;
  integrationsSub: React.ReactNode;
  integrations: string[];
  testimonialVisualSrc: string;
}> = {}) {
  const hasVisual = Boolean(testimonialVisualSrc);
  return (
    <section className="relative py-14 lg:py-[100px] px-[18px] md:px-8 xl:px-12 bg-bg overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_10%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.08),transparent_70%),radial-gradient(ellipse_40%_50%_at_95%_70%,oklch(from_var(--color-accent-2)_l_c_h_/_0.07),transparent_70%)]" />
      <div className="relative z-[2] max-w-container mx-auto">
        <div
          className={
            hasVisual
              ? "grid grid-cols-1 gap-[26px] items-center pb-12 mb-12 border-b border-line md:gap-9 md:pb-[72px] md:mb-[72px] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-[72px] xl:pb-[100px] xl:mb-[100px]"
              : "max-w-[820px] mx-auto text-center pb-12 mb-12 border-b border-line md:pb-[72px] md:mb-[72px] xl:pb-[100px] xl:mb-[100px]"
          }
        >
          {hasVisual ? (
            <div className="relative aspect-[16/10] rounded-[14px] max-w-[600px] border border-[var(--color-line-strong)] bg-[linear-gradient(135deg,oklch(0.18_0.005_300),oklch(0.13_0.006_300))] overflow-hidden shadow-[0_40px_80px_oklch(0_0_0_/_0.5)] md:rounded-[22px] xl:aspect-[5/4] xl:max-w-none before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.04)_1px,transparent_0)] before:bg-[length:24px_24px] after:content-['IMAGE_PLACEHOLDER'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:font-mono after:text-[11px] after:tracking-[0.15em] after:text-[oklch(1_0_0_/_0.18)]">
              <img
                src={testimonialVisualSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : null}
          <div className={hasVisual ? "flex flex-col" : "flex flex-col items-center"}>
            <div className={`inline-flex ${hasVisual ? "self-start" : ""} items-center gap-2.5 pl-2.5 pr-[11px] py-1.5 border border-[var(--color-line-strong)] rounded-full text-[9px] font-medium tracking-[0.12em] text-[var(--color-ink-dim)] bg-[oklch(1_0_0_/_0.025)] mb-[22px] md:pl-3 md:pr-3.5 md:py-[7px] md:text-[11px] md:mb-7`}>
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              <span>{testimonialEyebrow}</span>
            </div>
            <div className="font-display font-bold text-[44px] leading-none text-accent-soft mb-[18px] md:text-[56px]">
              &quot;
            </div>
            <p className="font-display font-normal text-[17px] leading-[1.45] tracking-[-0.015em] text-ink mb-[26px] text-pretty [&_em]:italic [&_em]:font-medium [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent md:text-[clamp(20px,2vw,26px)] md:mb-9">
              {testimonialQuote}
            </p>
            <div className="flex items-center gap-3.5">
              <div className="w-[38px] h-[38px] rounded-full bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.95)] font-display text-[12px] font-bold tracking-[0.02em] flex items-center justify-center shadow-[0_6px_18px_oklch(from_var(--color-accent)_l_c_h_/_0.4)] md:w-11 md:h-11 md:text-[14px]">
                {testimonialAuthorInitials}
              </div>
              <div className={hasVisual ? "" : "text-left"}>
                <div className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-ink md:text-[12px]">
                  {testimonialAuthorName}
                </div>
                <div className="text-[11px] text-[var(--color-ink-3)] mt-[3px] md:text-[12px]">
                  {testimonialAuthorRole}
                </div>
              </div>
            </div>
          </div>
        </div>

        <header className={`mb-10 xl:mb-14 ${SVC_HEADER_CLASSES}`}>
          <h2 className={SVC_H2_CLASSES}>{servicesHeading}</h2>
          <p className={`pb-2 ${SVC_SUB_BASE}`}>{servicesSub}</p>
        </header>

        {/* Primary services — top 3 as full cards. Secondary — the
            rest as compact rows. Splits the otherwise-uniform 6-card
            grid that read as AI-template rhythm. */}
        <div className="grid grid-cols-1 gap-3 mb-7 md:grid-cols-2 md:gap-4 md:mb-9 xl:grid-cols-3 xl:gap-5">
          {features.slice(0, 3).map((f, i) => (
            <FeatureCard key={`primary-${i}`} {...f} />
          ))}
        </div>
        {features.length > 3 ? (
          <div className="grid grid-cols-1 gap-2 mb-14 md:grid-cols-2 md:gap-2.5 md:mb-20 xl:grid-cols-3 xl:gap-3 xl:mb-[120px]">
            {features.slice(3).map((f, i) => (
              <SecondaryFeatureCard key={`secondary-${i}`} {...f} />
            ))}
          </div>
        ) : null}

        <header className={`mb-12 ${SVC_HEADER_CLASSES}`}>
          <h2 className={SVC_H2_CLASSES}>{integrationsHeading}</h2>
          <p className={`max-w-[78ch] pb-0 ${SVC_SUB_BASE}`}>{integrationsSub}</p>
        </header>

        <div className="grid grid-cols-2 gap-2 md:gap-2.5 md:grid-cols-4 xl:gap-3.5">
          {integrations.map((name, i) => (
            <div
              key={i}
              className="relative h-11 border border-line rounded-[10px] bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center font-display font-semibold text-[10px] tracking-[0.06em] uppercase text-[var(--color-ink-dim)] overflow-hidden md:h-[52px] md:text-[11px] md:tracking-[0.1em] [&>span]:relative [&>span]:z-[2]"
            >
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
