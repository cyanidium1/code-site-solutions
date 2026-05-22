"use client";

import type * as React from "react";
import Link from "next/link";

import { SITE_CONTACT } from "@/constants/site";
import { FOOTER_SOCIAL_HREFS, SocialIcon, type SocialKind } from "./social-icon";

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
      <Link key="portfolio" href="/portfolio">Portfolio</Link>,
      <Link key="home" href="/en">Home</Link>,
      <Link key="services" href="/en#solutions">Services</Link>,
      <Link key="blog" href="/blog">Blog</Link>,
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
  brandName = (
    <>
      <em>Code-Site</em>.Art
    </>
  ),
  brandDesc,
  socials = ["li", "ig", "tg", "tt"] as SocialKind[],
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
  const resolvedCols = cols ?? (locale === "en" ? EN_FOOT_COLS : DEFAULT_FOOT_COLS);
  const resolvedBrandDesc =
    brandDesc ??
    (locale === "en"
      ? "Code-site.art — boutique custom website studio. 47 projects in 3 years across 4 regions: UA · EU · US · DK."
      : "Code-site.art — кастомна розробка сайтів. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK.");
  const labels: Record<SocialKind, string> = {
    li: "LinkedIn",
    ig: "Instagram",
    tg: "Telegram",
    tt: "TikTok",
  };
  return (
    <footer className="bg-[oklch(0.10_0.005_300)] pt-14 px-12 pb-8 border-t border-line relative max-[1100px]:px-8 max-[700px]:pt-10 max-[700px]:px-[18px] max-[700px]:pb-6">
      <div className="max-w-container mx-auto grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mb-9 max-[1100px]:grid-cols-2 max-[1100px]:gap-8 max-[700px]:grid-cols-1 max-[700px]:gap-7 max-[700px]:mb-6">
        <div>
          <div className="font-display font-bold text-[15px] tracking-[0.18em] uppercase text-ink mb-[18px] [&_em]:not-italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
            {brandName}
          </div>
          <p className="text-[12px] leading-[1.65] text-[var(--ink-3)] max-w-[30ch] mb-5">
            {resolvedBrandDesc}
          </p>
          <div className="flex gap-2 [&>a]:w-8 [&>a]:h-8 [&>a]:border [&>a]:border-line [&>a]:rounded-lg [&>a]:inline-flex [&>a]:items-center [&>a]:justify-center [&>a]:text-[var(--ink-2)] [&>a]:transition-all [&>a]:duration-200 [&>a:hover]:text-accent-soft [&>a:hover]:border-[oklch(from_var(--accent)_l_c_h_/_0.4)]">
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
            <div className="font-display text-[11px] font-bold tracking-[0.14em] uppercase text-ink mb-3.5">
              {col.h}
            </div>
            <ul className="list-none flex flex-col gap-2 [&>li>a]:text-[12px] [&>li>a]:text-[var(--ink-2)] [&>li>a]:no-underline [&>li>a]:tracking-[0.02em] [&>li>a]:uppercase [&>li>a]:transition-colors [&>li>a]:duration-200 [&>li>a:hover]:text-accent-soft [&>li_.nolink]:text-[12px] [&>li_.nolink]:text-[var(--ink-2)] [&>li_.nolink]:tracking-[0.02em] [&>li_.nolink]:uppercase">
              {col.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-container mx-auto pt-[22px] border-t border-line text-[11px] text-[var(--ink-3)] tracking-[0.04em]">
        {bottomText}
      </div>
    </footer>
  );
}
