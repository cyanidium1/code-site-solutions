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
        <div className="grid grid-cols-[96px_1fr] items-center gap-5 sm:grid-cols-[140px_1fr] sm:gap-8 lg:grid-cols-[200px_1fr] lg:gap-12 max-w-[880px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line-strong">
            <AppImage
              src="/team/fedir.jpg"
              alt={c.alt}
              fill
              sizes="(min-width: 800px) 200px, (min-width: 640px) 140px, 96px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{c.eyebrow}</div>
            <h2 className="mt-2 mb-0 font-actay text-[18px] font-bold uppercase leading-[1.15] text-ink sm:text-[24px] lg:text-[32px]">
              {c.title}
            </h2>
            <p className="mt-3 mb-0 max-w-[520px] text-[14px] leading-[1.6] text-ink-dim sm:text-[15px] max-sm:hidden">
              {c.body}
            </p>
            <Link
              href={resolveRootHref("/about", locale)}
              className="mt-3 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-accent-soft no-underline hover:text-ink sm:mt-5"
            >
              {c.link}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <p className="col-span-2 m-0 text-[14px] leading-[1.6] text-ink-dim sm:hidden">{c.body}</p>
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
