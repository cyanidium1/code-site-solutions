import Link from "next/link";

import { HpHeader } from "@/components/layout/hp-header";
import { HpFooter } from "@/components/layout/hp-footer";
import { H1, H2 } from "@/components/ui";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { CHANNELS_BY_LOCALE } from "@/content/contacts";
import { THANK_YOU_COPY } from "@/content/thank-you";
import { localizePath } from "@/constants/i18n-routes";
import { ctaAttrs, msgId, type ConversionChannel } from "@/constants/conversion-ids";
import type { Locale } from "@/constants/locales";

/**
 * `/thank-you` — where every submitted form lands (see `goToThankYou` in
 * blocks/lead-form). It is the Google Ads destination conversion, so the
 * route must stay reachable by a real page load and must never be linked
 * from navigation: the only way here is through a form.
 *
 * Deliberately quiet. The visitor has already converted, so there is no CTA
 * to a second form — just confirmation, what happens next, and the fastest
 * way to reach a human if 24 hours is too long.
 */

/** Only the channels worth offering to someone who already wrote to us. */
const FAST_CHANNELS: readonly ConversionChannel[] = [
  "telegram",
  "whatsapp",
  "viber",
  "phone",
];

const CHECK = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 12l5 5L20 6"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ThankYouPage({ locale }: { locale: Locale }) {
  const copy = THANK_YOU_COPY[locale];
  const channels = CHANNELS_BY_LOCALE[locale].filter((c) =>
    (FAST_CHANNELS as readonly string[]).includes(c.kind),
  );

  return (
    <>
      <HpHeader />

      <main>
        <section className="relative overflow-hidden bg-bg px-6 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:px-12 lg:pb-20 lg:pt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_18%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.14),transparent_70%)]"
          />
          <div className={hpInnerClass}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)]">
              {CHECK}
            </div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              {copy.eyebrow}
            </p>
            <H1 variant="page-hero" className="mt-4 max-w-[18ch] text-ink">
              {copy.headingLead}
              <em className="not-italic bg-brand-gradient bg-clip-text text-transparent">
                {copy.headingEm}
              </em>
            </H1>
            <p className="mt-5 max-w-[52ch] text-pretty font-sans text-[15px] leading-[1.65] text-ink-dim sm:text-[16px]">
              {copy.lede}
            </p>
          </div>
        </section>

        {/* What happens next — a ruled list, not cards: nothing here is
            interactive, and three filled panels would read as another offer. */}
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <H2 variant="hp" className="mt-0 text-ink">
              {copy.stepsHeading}
            </H2>
            <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-0 p-0 md:mt-10 md:grid-cols-3">
              {copy.steps.map((s, i) => (
                <li
                  key={s.when}
                  className={`border-t border-line py-5 md:py-6 ${
                    i > 0 ? "md:border-l md:pl-7" : ""
                  } ${i > 0 ? "md:pr-7" : "md:pr-7"}`}
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-accent-soft">
                    {s.when}
                  </span>
                  <h3 className="m-0 mt-3 font-actay text-[19px] font-bold uppercase leading-[1.15] tracking-[-0.02em] text-ink">
                    {s.title}
                  </h3>
                  <p className="m-0 mt-2.5 max-w-[42ch] text-pretty font-sans text-[14px] leading-[1.6] text-ink-dim">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-bg px-6 pb-11 sm:px-8 sm:pb-14 lg:px-12 lg:pb-20">
          <div className={hpInnerClass}>
            <div className="rounded-[20px] border border-line bg-[oklch(1_0_0_/_0.02)] p-6 sm:p-8">
              <h2 className="m-0 font-actay text-[22px] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-ink sm:text-[26px]">
                {copy.fasterHeading}
              </h2>
              <p className="m-0 mt-2.5 font-sans text-[14px] leading-[1.6] text-ink-dim">
                {copy.fasterSub}
              </p>
              <ul className="m-0 mt-5 flex list-none flex-wrap gap-2.5 p-0">
                {channels.map((c) => {
                  const Icon = c.icon;
                  return (
                    <li key={c.kind}>
                      <a
                        href={c.href}
                        target={c.external ? "_blank" : undefined}
                        rel={c.external ? "noreferrer" : undefined}
                        className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong px-4 font-sans text-[13.5px] font-medium text-ink no-underline transition-[border-color,background-color] duration-200 hover:border-accent-40 hover:bg-accent-8"
                        {...ctaAttrs(msgId(c.kind, "thank-you"), { unique: true })}
                      >
                        <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
                        <span>{c.label}</span>
                        <span className="text-ink-3">{c.handle}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-bg px-6 pb-14 sm:px-8 lg:px-12 lg:pb-24">
          <div className={hpInnerClass}>
            <h2 className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              {copy.nextHeading}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
              {copy.next.map((n, i) => (
                <Link
                  key={n.href}
                  href={localizePath(n.href, locale)}
                  className={`group/next block border-t border-line py-5 no-underline transition-colors duration-200 lg:py-6 ${
                    i > 0 ? "lg:border-l lg:pl-7" : ""
                  } lg:pr-7`}
                >
                  <span className="block font-actay text-[17px] font-bold uppercase tracking-[-0.02em] text-ink transition-colors duration-200 group-hover/next:text-accent-soft">
                    {n.label}
                  </span>
                  <span className="mt-1.5 block font-sans text-[13px] leading-[1.5] text-ink-3">
                    {n.sub}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href={localizePath("/", locale)}
              className="mt-8 inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline transition-[color,border-color] duration-200 hover:border-accent-40 hover:text-accent-soft"
            >
              {copy.homeLabel}
            </Link>
          </div>
        </section>
      </main>

      <HpFooter />
    </>
  );
}
