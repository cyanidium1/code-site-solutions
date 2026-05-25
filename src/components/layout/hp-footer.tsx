"use client";

import Link from "next/link";
import {
  Linkedin,
  Send,
  Instagram,
  Music2,
  Github,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { hasEnIndustry } from "@/constants/i18n-routes";

type SocialDef = { icon: LucideIcon; href: string; label: string };
const DEFAULT_SOCIALS: SocialDef[] = [
  { icon: Linkedin, href: "https://linkedin.com/in/fedirdev", label: "LinkedIn" },
  { icon: Send, href: "https://t.me/fedirdev", label: "Telegram" },
  { icon: Instagram, href: "https://instagram.com/fedirdev", label: "Instagram" },
  { icon: Music2, href: "https://tiktok.com/@fedirdev", label: "TikTok" },
  { icon: Github, href: "https://github.com/fedirdev", label: "GitHub" },
];

// All 8 industries have published Sanity pages and live UA links.
// EN availability is gated by `EN_INDUSTRY_SLUGS` in `lib/i18n-routes.ts`
// — industries not yet translated render as disabled on EN.
// Translation keys (`key`) live in `messages/{uk,en}.json` → `Footer.solutions`.
const SOLUTIONS_HREFS: Array<{ key: string; href: string; published: boolean }> = [
  { key: "healthcare", href: "/sites-for/medicine", published: true },
  { key: "renovation", href: "/sites-for/renovation", published: true },
  { key: "legal", href: "/sites-for/legal", published: true },
  { key: "finance", href: "/sites-for/finance", published: true },
  { key: "ecommerce", href: "/sites-for/ecommerce", published: true },
  { key: "auto", href: "/sites-for/auto", published: true },
  { key: "realEstate", href: "/sites-for/real-estate", published: true },
  { key: "courses", href: "/sites-for/courses", published: true },
];

// Only entries with a shipped page get rendered. Others would 404.
const COMPARE_HREFS: Array<{ key: string; href: string }> = [
  { key: "wordpress", href: "/vs-wordpress" },
  { key: "constructors", href: "/vs-constructors" },
  { key: "freelancers", href: "/vs-freelancers" },
];

const LEGAL_HREFS: Array<{ key: string; href: string }> = [
  { key: "privacy", href: "/policy" },
  { key: "terms", href: "/offer" },
  { key: "publicContract", href: "/public-contract" },
  { key: "legalData", href: "/legal" },
];

// Reusable utility-class strings — keeps the JSX below readable.
const footerClass =
  "relative pt-14 lg:pt-20 px-6 sm:px-8 lg:px-12 pb-8 border-t border-line bg-[oklch(0_0_0_/_0.20)]";
// 5-col grid on UA (with Compare + Legal split), collapses to 4 cols on EN.
// data-locale="en" selector replaced by conditional class.
const footerInnerUaClass =
  "mx-auto max-w-container grid grid-cols-2 [&>:first-child]:col-span-2 gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:[&>:first-child]:col-span-1";
const footerInnerEnClass =
  "mx-auto max-w-container grid grid-cols-2 [&>:first-child]:col-span-2 gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:[&>:first-child]:col-span-1";
const footerBrandClass =
  "font-sans text-[20px] font-bold tracking-[-0.01em] [&>em]:not-italic [&>em]:bg-brand-gradient [&>em]:bg-clip-text [&>em]:text-transparent";
const footerDescClass = "mt-4 text-[13.5px] leading-[1.55] text-ink-dim max-w-[320px]";
const footerContactsClass =
  "mt-5 font-mono text-[12px] flex flex-col gap-1.5 [&>a]:text-ink-dim [&>a]:no-underline [&>a]:transition-colors [&>a]:duration-200 hover:[&>a]:text-ink";
const footerColHClass =
  "font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3";
const footerColListClass =
  "list-none mt-4 p-0 flex flex-col gap-2.5 [&_a]:font-sans [&_a]:text-[13px] [&_a]:text-ink-dim [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-ink";
// Vertical gap between the Compare and Legal sub-columns when they're
// stacked inside the same grid cell on EN. The legacy CSS used
// `.hp-footer-col-section + .hp-footer-col-section { margin-top: 24px }`.
// Applied directly to the second sibling instead of via arbitrary `&+&`.
const footerColSectionGapClass = "mt-6";
const footerDisabledClass = "font-sans text-[13px] text-ink-3 cursor-default";
const footerBottomClass =
  "mx-auto max-w-container-max mt-12 pt-6 border-t border-line flex justify-between items-center flex-wrap gap-4";
const footerCopyClass = "font-mono text-[11px] text-ink-3";
const footerSocialClass =
  "flex gap-4 [&_a]:text-ink-3 [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-ink";

export function HpFooter({
  socials = DEFAULT_SOCIALS,
}: { socials?: SocialDef[] } = {}) {
  const t = useTranslations("Footer");
  const tSol = useTranslations("Footer.solutions");
  const tCo = useTranslations("Footer.company");
  const tCmp = useTranslations("Footer.compare");
  const tLeg = useTranslations("Footer.legal");
  const locale = useLocale();
  const isEn = locale === "en";

  // Render rules:
  //   - UA: if the industry page is published, link to /sites-for/<slug>;
  //     otherwise render a disabled label so the column shows all 8 names.
  //   - EN: same, but the link only resolves when an EN translation also
  //     exists (per `EN_INDUSTRY_SLUGS` in lib/i18n-routes.ts). Industries
  //     published only in UA still render as disabled on EN — same
  //     visual completeness as the homepage industry cards.
  const renderSolutionItem = (
    key: string,
    href: string,
    published: boolean,
  ) => {
    if (!published) return <span className={footerDisabledClass}>{tSol(key)}</span>;
    if (!isEn) return <Link href={href}>{tSol(key)}</Link>;
    const slug = href.replace(/^\/sites-for\//, "");
    if (hasEnIndustry(slug)) {
      return <Link href={`/en/sites-for/${slug}`}>{tSol(key)}</Link>;
    }
    return <span className={footerDisabledClass}>{tSol(key)}</span>;
  };

  // Company column: Process and Contact resolve to anchors on the EN
  // homepage instead of standalone UA pages.
  const companyLinks = [
    { key: "about", href: "/about" },
    { key: "process", href: isEn ? "/en#process" : "/#process" },
    { key: "pricing", href: "/pricing" },
    { key: "calculator", href: "/calculator" },
    { key: "portfolio", href: "/portfolio" },
    { key: "blog", href: "/blog" },
    { key: "contacts", href: isEn ? "/en#contact" : "/#contact" },
  ];

  return (
    <footer className={footerClass}>
      <div className={isEn ? footerInnerEnClass : footerInnerUaClass}>
        <div>
          <div className={footerBrandClass}>
            <em>Code-Site</em>.art
          </div>
          <p className={footerDescClass}>{t("brandDesc")}</p>
          <div className={footerContactsClass}>
            <a href="tel:+380970068707">+380-97-006-87-07</a>
            <a href="mailto:hi@code-site.art">hi@code-site.art</a>
            <a href="https://t.me/fedirdev" target="_blank" rel="noreferrer">
              @fedirdev
            </a>
          </div>
        </div>
        <div>
          <div className={footerColHClass}>{t("solutionsHeading")}</div>
          <ul className={footerColListClass}>
            {SOLUTIONS_HREFS.map(({ key, href, published }) => (
              <li key={key}>{renderSolutionItem(key, href, published)}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className={footerColHClass}>{t("companyHeading")}</div>
          <ul className={footerColListClass}>
            {companyLinks.map((l) => (
              <li key={l.key}>
                <Link href={l.href}>{tCo(l.key)}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/*
          Compare + Legal share the 4th grid cell on EN (4-col grid) and split
          across two cells on UA (5-col grid). The `[&+&]:mt-6` selector on the
          col-section class supplies the vertical margin when they're stacked.
        */}
        {isEn ? (
          <div>
            <div>
              <div className={footerColHClass}>{t("compareHeading")}</div>
              <ul className={footerColListClass}>
                {COMPARE_HREFS.map(({ key, href }) => (
                  <li key={key}>
                    <Link href={`/en${href}`}>{tCmp(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={footerColSectionGapClass}>
              <div className={footerColHClass}>{t("legalHeading")}</div>
              <ul className={footerColListClass}>
                {LEGAL_HREFS.map(({ key, href }) => (
                  <li key={key}>
                    <Link href={href}>{tLeg(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div>
                <div className={footerColHClass}>{t("compareHeading")}</div>
                <ul className={footerColListClass}>
                  {COMPARE_HREFS.map(({ key, href }) => (
                    <li key={key}>
                      <Link href={href}>{tCmp(key)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div>
                <div className={footerColHClass}>{t("legalHeading")}</div>
                <ul className={footerColListClass}>
                  {LEGAL_HREFS.map(({ key, href }) => (
                    <li key={key}>
                      <Link href={href}>{tLeg(key)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={footerBottomClass}>
        <span className={footerCopyClass}>{t("copy")}</span>
        <div className={footerSocialClass}>
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
              >
                <Icon size={18} strokeWidth={1.6} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
