import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Locale } from "@/constants/locales";
import { resolveRootHref } from "@/constants/i18n-routes";
import { AppImage } from "@/lib/shared/app-image";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

/**
 * One real face on the homepage. The studio sells "the developer builds your
 * site, not an account manager", yet the homepage had no person on it — the
 * reference site (code-site-frontend) carried a founder section, ours did
 * not (plan 2026-09-16, §4). Replaces nothing: the "Мінімум вашої участі"
 * card grid it sits near was removed as a repeat of the value stack.
 */
const COPY: Record<Locale, { eyebrow: string; title: string; body: string; link: string; alt: string }> = {
  uk: {
    eyebrow: "ХТО РОБИТЬ САЙТ",
    title: "Сайт пише розробник, а не акаунт-менеджер",
    body: "Федір Алпатов, засновник і техлід. На брифі, у Telegram і в коді — одна й та сама людина.",
    link: "Про студію і команду",
    alt: "Федір Алпатов, засновник Code-Site.Art",
  },
  ru: {
    eyebrow: "КТО ДЕЛАЕТ САЙТ",
    title: "Сайт пишет разработчик, а не аккаунт-менеджер",
    body: "Федор Алпатов, основатель и техлид. На брифе, в Telegram и в коде — один и тот же человек.",
    link: "О студии и команде",
    alt: "Федор Алпатов, основатель Code-Site.Art",
  },
  en: {
    eyebrow: "WHO BUILDS IT",
    title: "A developer builds your site, not an account manager",
    body: "Fedir Alpatov, founder and tech lead. The same person on the brief call, in chat and in the code.",
    link: "About the studio and team",
    alt: "Fedir Alpatov, founder of Code-Site.Art",
  },
};

export function FounderNote({ locale = "uk" }: { locale?: Locale }) {
  const c = COPY[locale];
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        {/* A full-width panel on the container grid: the text block used to
            stop at 880px and leave the right half of the row empty. The link
            becomes a button on the panel's right edge from lg. */}
        <div className="grid grid-cols-[96px_1fr] items-center gap-x-5 gap-y-4 rounded-[26px] border border-line bg-[oklch(1_0_0_/_0.02)] p-5 sm:grid-cols-[140px_1fr] sm:gap-x-8 sm:p-7 lg:grid-cols-[180px_1fr_auto] lg:gap-x-10 lg:p-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line-strong">
            <AppImage
              src="/team/fedir.jpg"
              alt={c.alt}
              fill
              sizes="(min-width: 800px) 180px, (min-width: 640px) 140px, 96px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{c.eyebrow}</div>
            <h2 className="mt-2 mb-0 font-actay text-[18px] font-bold uppercase leading-[1.15] text-ink sm:text-[24px] lg:text-[32px]">
              {c.title}
            </h2>
            <p className="mt-3 mb-0 max-w-[560px] text-[14px] leading-[1.6] text-ink-dim sm:text-[15px] max-sm:hidden">
              {c.body}
            </p>
            <Link
              href={resolveRootHref("/about", locale)}
              className="mt-5 hidden items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-accent-soft no-underline hover:text-ink sm:inline-flex lg:hidden"
            >
              {c.link}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <Link
            href={resolveRootHref("/about", locale)}
            className="hidden items-center gap-2 self-center whitespace-nowrap rounded-full border border-line px-5 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-ink no-underline transition-[border-color,color] duration-200 hover:border-accent-40 hover:text-accent-soft lg:inline-flex"
          >
            {c.link}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <p className="col-span-2 m-0 text-[14px] leading-[1.6] text-ink-dim sm:hidden">{c.body}</p>
          <Link
            href={resolveRootHref("/about", locale)}
            className="col-span-2 inline-flex items-center gap-2 whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.08em] text-accent-soft no-underline hover:text-ink sm:hidden"
          >
            {c.link}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const TRUST: Record<Locale, string[]> = {
  uk: ["Договір", "Фіксована ціна", "Неустойка за зрив терміну", "Рік підтримки", "Код і домен ваші"],
  ru: ["Договор", "Фиксированная цена", "Неустойка за срыв срока", "Год поддержки", "Код и домен ваши"],
  en: ["Contract", "Fixed price", "Penalty if we miss the deadline", "A year of support", "Code and domain are yours"],
};

/** One line of guarantees under the pricing tiers — replaces the six-card
    "why us" grid, whose points were already made elsewhere on the page. */
export function TrustStrip({ locale = "uk" }: { locale?: Locale }) {
  return (
    <ul className="m-0 mt-6 flex list-none flex-wrap justify-center gap-x-4 gap-y-2 p-0 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-3 lg:mt-10">
      {TRUST[locale].map((t) => (
        <li key={t} className="inline-flex items-center gap-2 before:h-1 before:w-1 before:rounded-full before:bg-accent before:content-['']">
          {t}
        </li>
      ))}
    </ul>
  );
}
