import Link from "next/link";

import type { Locale } from "@/constants/locales";
import type { TestimonialSlide } from "@/lib/server/fetch-testimonials";
import { SanityImg } from "@/lib/shared/sanity-image";
import {
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSectionHeadClass,
} from "@/components/homepage/shared";
import { cn } from "@/components/ui";

const TITLE: Record<Locale, string> = {
  uk: "Що кажуть клієнти",
  ru: "Что говорят клиенты",
  en: "What clients say",
};

const CASE_LINK: Record<Locale, string> = {
  uk: "Кейс →",
  ru: "Кейс →",
  en: "Case study →",
};

/**
 * Static testimonial cards (TZ v2 §3.12) for package pages, /rozrobka-saitiv
 * and the Ads landing. Reads the same Sanity feed as the homepage slider;
 * placeholders waiting for the client's text (`pending`) never reach here.
 */
export function TestimonialCards({
  slides,
  locale,
  limit,
  title,
  className,
}: {
  slides: TestimonialSlide[];
  locale: Locale;
  limit?: number;
  title?: string;
  className?: string;
}) {
  const items = typeof limit === "number" ? slides.slice(0, limit) : slides;
  if (!items.length) return null;
  return (
    <section className={cn(hpSectionClass, className)} id="testimonials">
      <div className={hpInnerClass}>
        <div className={hpSectionHeadClass}>
          <h2 className={hpH2Class}>{title ?? TITLE[locale]}</h2>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
          {items.map((s) => (
            <li
              key={s.key}
              className="flex flex-col gap-4 rounded-[18px] border border-line bg-[oklch(0.16_0.006_300)] p-5 md:p-6"
            >
              <blockquote className="m-0 flex-1 font-sans text-[15px] leading-[1.6] text-ink">
                «{s.quote}»
              </blockquote>
              <div className="flex items-center gap-3">
                {s.photo ? (
                  <SanityImg
                    image={s.photo.src}
                    alt={s.photo.alt || s.authorName}
                    width={44}
                    height={44}
                    sizes="44px"
                    widths={[88]}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-12 font-display text-[13px] font-bold text-accent-soft"
                  >
                    {s.authorInitials}
                  </span>
                )}
                <div className="flex min-w-0 flex-col">
                  <span className="text-[14px] font-semibold text-ink">{s.authorName}</span>
                  <span className="text-[12.5px] text-ink-3">
                    {[s.authorRole || s.company, s.country].filter(Boolean).join(" · ")}
                  </span>
                </div>
                {s.caseHref ? (
                  <Link
                    href={s.caseHref}
                    className="ml-auto whitespace-nowrap text-[12.5px] text-accent-soft no-underline hover:underline"
                  >
                    {CASE_LINK[locale]}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
