import { SanityImg } from "@/lib/shared/sanity-image";
import type { SanityImage } from "@/types/sanity";
import { type Feature, FeatureCard } from "./feature-card";

const SVC_H2_CLASSES =
  "font-display font-bold text-[clamp(26px,9vw,38px)] leading-none tracking-[-0.035em] text-ink text-balance max-w-full uppercase md:text-[clamp(34px,4.6vw,60px)] xl:max-w-[16ch] [&_em]:italic [&_em]:font-light [&_em]:normal-case [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_em]:inline-block [&_em]:pr-[0.12em] [&_em]:[margin-right:-0.04em]";

const SVC_HEADER_CLASSES =
  "grid grid-cols-1 gap-[22px] items-start pb-[22px] border-b border-line xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-14 xl:items-end xl:pb-7";

const SVC_SUB_BASE =
  "text-[13px] leading-[1.65] text-ink-dim text-pretty md:text-[15px] [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium";

export function Services({
  testimonialEyebrow = "",
  testimonialQuote,
  testimonialAuthorInitials,
  testimonialAuthorName,
  testimonialAuthorRole,
  servicesHeading,
  servicesSub,
  features = [],
  integrationsHeading,
  integrationsSub,
  integrations = [],
  testimonialVisual,
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
  testimonialVisual: SanityImage;
}> = {}) {
  const hasVisual = Boolean(testimonialVisual?.asset);
  const hasTestimonial = Boolean(testimonialQuote);
  const authorInitials =
    testimonialAuthorInitials ||
    (testimonialAuthorName
      ? testimonialAuthorName
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0] ?? "")
          .join("")
          .toUpperCase()
      : "");
  return (
    <section className="relative py-14 lg:py-[100px] px-[18px] md:px-8 xl:px-12 bg-bg overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_10%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.08),transparent_70%),radial-gradient(ellipse_40%_50%_at_95%_70%,oklch(from_var(--color-accent-2)_l_c_h_/_0.07),transparent_70%)]" />
      <div className="relative z-[2] max-w-container mx-auto">
        {hasTestimonial ? (
        <div
          className={
            hasVisual
              ? "grid grid-cols-1 gap-[26px] items-center pb-12 mb-12 border-b border-line md:gap-9 md:pb-[72px] md:mb-[72px] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-[72px] xl:pb-[100px] xl:mb-[100px]"
              : "max-w-[840px] mx-auto text-center pb-12 mb-12 border-b border-line md:pb-[72px] md:mb-[72px] xl:pb-[100px] xl:mb-[100px]"
          }
        >
          {hasVisual ? (
            <div className="relative aspect-[16/10] rounded-[14px] max-w-[600px] border border-line-strong bg-[linear-gradient(135deg,oklch(0.18_0.005_300),oklch(0.13_0.006_300))] overflow-hidden shadow-[0_40px_80px_oklch(0_0_0_/_0.5)] md:rounded-[22px] xl:aspect-[5/4] xl:max-w-none before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.04)_1px,transparent_0)] before:bg-[length:24px_24px]">
              <SanityImg
                image={testimonialVisual}
                alt=""
                sizes="(min-width: 1280px) 45vw, 92vw"
                fill
                className="object-cover"
              />
            </div>
          ) : null}
          <div className={hasVisual ? "flex flex-col" : "flex flex-col items-center"}>
            <div className={`inline-flex ${hasVisual ? "self-start" : ""} items-center gap-2.5 pl-2.5 pr-[11px] py-1.5 border border-line-strong rounded-full text-[9px] font-medium tracking-[0.12em] text-ink-dim bg-[oklch(1_0_0_/_0.025)] mb-[22px] md:pl-3 md:pr-3.5 md:py-[7px] md:text-[11px] md:mb-7`}>
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
                {authorInitials}
              </div>
              <div className={hasVisual ? "" : "text-left"}>
                <div className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-ink md:text-[12px]">
                  {testimonialAuthorName}
                </div>
                <div className="text-[11px] text-ink-3 mt-[3px] md:text-[12px]">
                  {testimonialAuthorRole}
                </div>
              </div>
            </div>
          </div>
        </div>
        ) : null}

        {servicesHeading || servicesSub ? (
          <header className={`mb-10 xl:mb-14 ${SVC_HEADER_CLASSES}`}>
            {servicesHeading ? (
              <h2 className={SVC_H2_CLASSES}>{servicesHeading}</h2>
            ) : null}
            {servicesSub ? (
              <p className={`pb-2 ${SVC_SUB_BASE}`}>{servicesSub}</p>
            ) : null}
          </header>
        ) : null}

        {/* All services rendered as full cards. */}
        {features.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 mb-14 md:grid-cols-2 md:gap-4 md:mb-20 xl:grid-cols-3 xl:gap-5 xl:mb-[120px]">
            {features.map((f, i) => (
              <FeatureCard key={`feature-${i}`} {...f} />
            ))}
          </div>
        ) : null}

        {integrations.length > 0 ? (
          <>
            {integrationsHeading || integrationsSub ? (
              <header className={`mb-12 ${SVC_HEADER_CLASSES}`}>
                {integrationsHeading ? (
                  <h2 className={SVC_H2_CLASSES}>{integrationsHeading}</h2>
                ) : null}
                {integrationsSub ? (
                  <p className={`max-w-[78ch] pb-0 ${SVC_SUB_BASE}`}>
                    {integrationsSub}
                  </p>
                ) : null}
              </header>
            ) : null}

            <div className="grid grid-cols-2 gap-2 md:gap-2.5 md:grid-cols-4 xl:gap-3.5">
              {integrations.map((name, i) => (
                <div
                  key={i}
                  className="relative h-11 border border-line rounded-[10px] bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center font-display font-semibold text-[10px] tracking-[0.06em] uppercase text-ink-dim overflow-hidden md:h-[52px] md:text-[11px] md:tracking-[0.1em] [&>span]:relative [&>span]:z-[2]"
                >
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export { MEDICINE_FEATURE_ICONS, featureIconsForIndustry } from "./icons";
export { type Feature, SecondaryFeatureCard, FeatureCard } from "./feature-card";
