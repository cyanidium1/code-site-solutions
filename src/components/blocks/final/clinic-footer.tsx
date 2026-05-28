"use client";

import type * as React from "react";
import Link from "next/link";

import { SITE_CONTACT } from "@/constants/site";
import Logo from "@/components/layout/logo/logo";
import { headerBrandClass } from "@/components/layout/header-classes";
import { FOOTER_SOCIAL_HREFS, SocialIcon, type SocialKind } from "./social-icon";

// Hoisted footer class strings. Both target descendants of the
// container (>a or >li>a) and are reused across multiple column
// renders inside .map(). Module-level so React allocates the literal
// once per process rather than per-render.
const FOOTER_SOCIALS_CLASS =
  "flex gap-2 [&>a]:w-8 [&>a]:h-8 [&>a]:border [&>a]:border-line [&>a]:rounded-lg [&>a]:inline-flex [&>a]:items-center [&>a]:justify-center [&>a]:text-ink-dim [&>a]:transition-all [&>a]:duration-200 [&>a:hover]:text-accent-soft [&>a:hover]:border-accent-40";

const FOOTER_COL_LIST_CLASS =
  "list-none flex flex-col gap-1 [&>li]:h-5 [&>li>a]:inline-flex [&>li>a]:items-center [&>li>a]:h-5 [&>li>a]:leading-5 [&>li>a]:text-[12px] [&>li>a]:text-ink-dim [&>li>a]:no-underline [&>li>a]:tracking-[0.02em] [&>li>a]:uppercase [&>li>a]:transition-colors [&>li>a]:duration-200 [&>li>a:hover]:text-accent-soft [&>li_.nolink]:inline-flex [&>li_.nolink]:items-center [&>li_.nolink]:h-5 [&>li_.nolink]:leading-5 [&>li_.nolink]:text-[12px] [&>li_.nolink]:text-ink-dim [&>li_.nolink]:tracking-[0.02em] [&>li_.nolink]:uppercase";

export type FootColumn = {
  h: string;
  items: React.ReactNode[];
};

const DEFAULT_FOOT_COLS: FootColumn[] = [
  {
    h: SITE_CONTACT.phone,
    items: [
      <span key="phone-note" className="nolink">Для дзвінка</span>,
      <span key="email" className="nolink">Hi@code-site.art</span>,
      <span key="write-note" className="nolink">Для письмового зв&#39;язку</span>,
      <a
        key="tg-link"
        href="https://t.me/fedirdev"
        target="_blank"
        rel="noreferrer"
      >
        @fedirdev
      </a>,
      <span key="tg-note" className="nolink">Telegram — швидкий зв&#39;язок</span>,
    ],
  },
  {
    h: "Меню",
    items: [
      <Link key="portfolio" href="/portfolio">
        Портфоліо
      </Link>,
      <Link key="home" href="/">
        Головна
      </Link>,
      <Link key="services" href="/#solutions">
        Послуги
      </Link>,
      <Link key="blog" href="/blog">
        Блог
      </Link>,
      <Link key="contacts" href="/#contact">
        Контакти
      </Link>,
    ],
  },
  {
    h: "Юридичні дані",
    items: [
      <a key="public-contract" href="#">Публічний договір</a>,
      <a key="offer" href="#">Оферта</a>,
      <a key="privacy" href="#">Конфіденційність</a>,
    ],
  },
];

const EN_FOOT_COLS: FootColumn[] = [
  {
    h: SITE_CONTACT.phone,
    items: [
      <span key="phone-note" className="nolink">For calls</span>,
      <span key="email" className="nolink">Hi@code-site.art</span>,
      <span key="write-note" className="nolink">For written contact</span>,
      <a
        key="tg-link"
        href="https://t.me/fedirdev"
        target="_blank"
        rel="noreferrer"
      >
        @fedirdev
      </a>,
      <span key="tg-note" className="nolink">Telegram — fast channel</span>,
    ],
  },
  {
    h: "Menu",
    items: [
      <Link key="portfolio" href="/en/portfolio">Portfolio</Link>,
      <Link key="home" href="/en">Home</Link>,
      <Link key="services" href="/en#solutions">Services</Link>,
      <Link key="blog" href="/en/blog">Blog</Link>,
      <Link key="contacts" href="/en#contact">Contact</Link>,
    ],
  },
  {
    h: "Legal",
    items: [
      <a key="public-contract" href="#">Public contract</a>,
      <a key="offer" href="#">Terms of service</a>,
      <a key="privacy" href="#">Privacy policy</a>,
    ],
  },
];

export function ClinicFooter({
  brandName,
  brandDesc,
  socials = ["li", "ig", "tg"] as SocialKind[],
  cols,
  bottomText = "© Code-site.art, 2026",
  locale = "uk",
}: Partial<{
  brandName: React.ReactNode;
  brandDesc: string;
  socials: SocialKind[];
  cols: FootColumn[];
  bottomText: string;
  locale: "uk" | "en";
}> = {}) {
  const homeHref = locale === "en" ? "/en" : "/";
  const resolvedCols = cols ?? (locale === "en" ? EN_FOOT_COLS : DEFAULT_FOOT_COLS);
  const resolvedBrandDesc =
    brandDesc ??
    (locale === "en"
      ? "Code-Site.Art — boutique custom website studio. 50+ projects over 5 years across 7 regions: UA · EU · US · DK · ZA · UK · FR."
      : "Code-Site.Art — бутик-студія з розробки сайтів на замовлення. 50+ проєктів за 5 років у 7 країнах: UA · EU · US · DK · ZA · UK · FR.");
  const labels: Record<SocialKind, string> = {
    li: "LinkedIn",
    ig: "Instagram",
    tg: "Telegram",
    tt: "TikTok",
  };
  return (
    <footer className="bg-[oklch(0.10_0.005_300)] pt-12 px-[18px] pb-6 border-t border-line relative md:px-8 md:pb-8 lg:pt-16 xl:px-12">
      <div className="max-w-container mx-auto grid grid-cols-1 gap-6 mb-5 md:grid-cols-2 md:gap-7 md:mb-8 xl:grid-cols-[1.4fr_1fr_1fr_1fr] xl:gap-10">
        <div>
          <div className="mb-4">
            {brandName ?? (
              <Logo href={homeHref} className={headerBrandClass} />
            )}
          </div>
          <p className="text-[12px] leading-[1.65] text-ink-3 max-w-[30ch] mb-5">
            {resolvedBrandDesc}
          </p>
          <div className={FOOTER_SOCIALS_CLASS}>
            {socials.map((kind) => (
              <a
                key={kind}
                href={FOOTER_SOCIAL_HREFS[kind]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={labels[kind]}
              >
                <SocialIcon kind={kind} />
              </a>
            ))}
          </div>
        </div>
        {resolvedCols.map((col, i) => (
          <div key={i}>
            <div className="font-display text-[11px] font-bold tracking-[0.14em] uppercase text-ink mb-3">
              {col.h}
            </div>
            <ul className={FOOTER_COL_LIST_CLASS}>
              {col.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-container mx-auto pt-5 border-t border-line text-[11px] text-ink-3 tracking-[0.04em]">
        {bottomText}
      </div>
    </footer>
  );
}
