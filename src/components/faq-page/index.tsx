import Link from "next/link";

import { HpHeader } from "@/components/layout/hp-header";
import { HpFooter } from "@/components/layout/hp-footer";
import { FaqAccordionItem } from "@/components/blocks/final/faq-item";
import { H1, btnClass } from "@/components/ui";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { FAQ_PAGE_COPY } from "@/content/faq-page";
import { localizePath } from "@/constants/i18n-routes";
import { ctaAttrs, ctaId } from "@/constants/conversion-ids";
import type { Locale } from "@/constants/locales";

/**
 * `/faq` — the questions that are the same whatever package you are buying.
 *
 * Grouped rather than one long accordion: eighteen rows in a single stack is
 * a scroll, not an answer. Every question renders in the server HTML (the
 * `<details>` is collapsed, not omitted) — content behind a control is
 * crawled, content that never renders is not, which is the mistake /pricing
 * made with thirteen of its eighteen answers.
 */

const ARROW = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function FaqPage({ locale }: { locale: Locale }) {
  const copy = FAQ_PAGE_COPY[locale];

  return (
    <>
      <HpHeader />

      <main>
        <section className="relative overflow-hidden bg-bg px-6 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12 lg:px-12 lg:pb-16 lg:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_12%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.12),transparent_70%)]"
          />
          <div className={hpInnerClass}>
            <nav aria-label="breadcrumb" className="mb-6">
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">
                <li>
                  <Link
                    href={localizePath("/", locale)}
                    className="text-ink-3 no-underline transition-colors duration-200 hover:text-accent-soft"
                  >
                    {copy.breadcrumb.home}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-ink-dim">
                  {copy.breadcrumb.faq}
                </li>
              </ol>
            </nav>

            {/* No eyebrow: the breadcrumb above already says "FAQ", and the
                two stacked read as a stutter. */}
            <H1 variant="page-hero" className="mt-1 max-w-[20ch] text-ink">
              {copy.headingLead}
              <em className="not-italic bg-brand-gradient bg-clip-text text-transparent">
                {copy.headingEm}
              </em>
            </H1>
            <p className="mt-5 max-w-[54ch] text-pretty font-sans text-[15px] leading-[1.65] text-ink-dim sm:text-[16px]">
              {copy.lede}
            </p>

            {/* In-page contents. Anchors double as shareable links an answer
                can be pointed at from a chat. */}
            <nav aria-label={copy.tocHeading} className="mt-8 border-t border-line pt-5">
              <p className="m-0 font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">
                {copy.tocHeading}
              </p>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                {copy.groups.map((g) => (
                  <li key={g.id}>
                    <a
                      href={`#${g.id}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-line-strong px-4 font-sans text-[13px] text-ink-dim no-underline transition-[color,border-color] duration-200 hover:border-accent-40 hover:text-accent-soft"
                    >
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <section className="bg-bg px-6 pb-12 sm:px-8 lg:px-12 lg:pb-20">
          <div className={`${hpInnerClass} flex flex-col gap-10 lg:gap-14`}>
            {copy.groups.map((g) => (
              <div key={g.id} id={g.id} className="scroll-mt-28">
                <h2 className="m-0 mb-5 font-actay text-[clamp(22px,3vw,32px)] font-bold uppercase leading-[1.1] tracking-[-0.025em] text-ink lg:mb-7">
                  {g.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {g.items.map((it) => (
                    <FaqAccordionItem key={it.q} item={it} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className="rounded-card border border-line bg-[oklch(1_0_0_/_0.02)] p-6 sm:p-9">
              <h2 className="m-0 font-actay text-[clamp(22px,3vw,32px)] font-bold uppercase leading-[1.1] tracking-[-0.025em] text-ink">
                {copy.ctaHeading}
              </h2>
              <p className="m-0 mt-3 max-w-[48ch] font-sans text-[14px] leading-[1.6] text-ink-dim sm:text-[15px]">
                {copy.ctaSub}
              </p>
              <div className="mt-6 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                <Link
                  href={localizePath("/contacts", locale)}
                  className={btnClass("primary")}
                  {...ctaAttrs(ctaId("faq", "lead"), { unique: true })}
                >
                  <span>{copy.ctaPrimary}</span>
                  {ARROW}
                </Link>
                <Link
                  href={localizePath("/calculator", locale)}
                  className={btnClass("ghost")}
                  {...ctaAttrs(ctaId("faq", "calc", "secondary"), { unique: true })}
                >
                  <span>{copy.ctaSecondary}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <HpFooter />
    </>
  );
}
