import { Check } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { FAQ } from "@/components/blocks/final";
import { SectionHead, SiblingServices, em } from "@/components/landing-page";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { localizePath } from "@/constants/i18n-routes";
import type { FAQItem } from "@/types/faq";
import { AuditForm } from "./audit-form";

/** Content shape for the free-audit page (`/audit`, `/ru/audit`). */
export type AuditPageContent = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbSelf: string;
  hero: {
    eyebrow: string;
    /** `[plain, em]` */
    headline: [string, string];
    sub: string;
    ctaLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  get: {
    heading: [string, string];
    sub: string;
    items: { title: string; body: string }[];
    /** The weekly cap, shown as a note under the list. */
    limit: string;
  };
  form: { heading: string; sub: string };
  steps: {
    heading: [string, string];
    items: { title: string; body: string }[];
  };
  faq: { heading: string; items: FAQItem[] };
};

export const AUDIT_FORM_ANCHOR = "audit-form";

export function AuditPageView({
  locale,
  content,
}: {
  locale: "uk" | "ru";
  content: AuditPageContent;
}) {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: content.breadcrumbHome, href: localizePath("/", locale) },
          { label: content.breadcrumbSelf },
        ]}
        eyebrow={content.hero.eyebrow}
        headline={em(content.hero.headline)}
        sub={content.hero.sub}
        actions={{
          primary: { label: content.hero.ctaLabel, href: `#${AUDIT_FORM_ANCHOR}` },
          secondary: { label: content.hero.secondaryLabel, href: content.hero.secondaryHref },
        }}
      />

      {/* What you get + the form side by side: the form is the page's job. */}
      <section className={hpSectionClass}>
        <div className={`${hpInnerClass} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16`}>
          <div>
            <SectionHead heading={content.get.heading} sub={content.get.sub} />
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {content.get.items.map((it) => (
                <li key={it.title} className="flex items-start gap-3">
                  <Check
                    size={20}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-accent-soft"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="m-0 font-sans text-[16px] font-semibold leading-[1.4] text-ink">
                      {it.title}
                    </p>
                    <p className="m-0 mt-1 font-sans text-[14.5px] leading-[1.6] text-ink-dim">
                      {it.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-8 inline-flex rounded-full border border-line-strong px-4 py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim">
              {content.get.limit}
            </p>
          </div>
          <div
            id={AUDIT_FORM_ANCHOR}
            className="scroll-mt-20 self-start rounded-2xl border border-line-strong bg-[oklch(0.13_0.005_300_/_0.85)] p-5 backdrop-blur-[8px] md:rounded-[22px] md:p-7"
          >
            <h2 className="m-0 font-actay text-[20px] font-bold uppercase leading-[1.15] text-ink">
              {content.form.heading}
            </h2>
            <p className="m-0 mt-2 mb-6 font-sans text-[14px] leading-[1.6] text-ink-dim">
              {content.form.sub}
            </p>
            <AuditForm locale={locale} />
          </div>
        </div>
      </section>

      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead heading={content.steps.heading} />
          <ol className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
            {content.steps.items.map((s, i) => (
              <li key={s.title} className="rounded-[18px] border border-line p-6">
                <span className="font-mono text-[12px] tracking-[0.08em] text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="m-0 mt-3 font-sans text-[17px] font-semibold text-ink">{s.title}</p>
                <p className="m-0 mt-2 font-sans text-[14.5px] leading-[1.6] text-ink-dim">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg">
        <FAQ heading={content.faq.heading} items={content.faq.items} locale={locale} />
      </section>

      <SiblingServices locale={locale} self="/audit" />
    </>
  );
}
