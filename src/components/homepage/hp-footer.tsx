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

import { hasEnIndustry } from "@/lib/i18n-routes";

type SocialDef = { icon: LucideIcon; href: string; label: string };
const DEFAULT_SOCIALS: SocialDef[] = [
  { icon: Linkedin, href: "https://linkedin.com/in/fedirdev", label: "LinkedIn" },
  { icon: Send, href: "https://t.me/fedirdev", label: "Telegram" },
  { icon: Instagram, href: "https://instagram.com/fedirdev", label: "Instagram" },
  { icon: Music2, href: "https://tiktok.com/@fedirdev", label: "TikTok" },
  { icon: Github, href: "https://github.com/fedirdev", label: "GitHub" },
];

const SOLUTIONS_HREFS: Array<{ key: string; href: string }> = [
  { key: "healthcare", href: "/sites-for/medicine" },
  { key: "legal", href: "/sites-for/legal" },
  { key: "accounting", href: "/sites-for/accounting" },
  { key: "ecommerce", href: "/sites-for/ecommerce" },
  { key: "saas", href: "/sites-for/saas" },
  { key: "realestate", href: "/sites-for/real-estate" },
  { key: "cosmetology", href: "/sites-for/cosmetology" },
  { key: "education", href: "/sites-for/education" },
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

  // EN footer: only industries with a translated landing page render as
  // links (currently medicine). The rest stay as disabled labels — same
  // pattern as the EN homepage industry cards. UA keeps everything linked.
  const renderSolutionItem = (key: string, href: string) => {
    if (!isEn) return <Link href={href}>{tSol(key)}</Link>;
    const slug = href.replace(/^\/sites-for\//, "");
    if (hasEnIndustry(slug)) {
      return <Link href={`/en/sites-for/${slug}`}>{tSol(key)}</Link>;
    }
    return <span className="hp-footer-disabled">{tSol(key)}</span>;
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
    <footer className="hp-footer" data-locale={locale}>
      <div className="hp-footer-inner">
        <div>
          <div className="hp-footer-brand">
            <em>Code-Site</em>.art
          </div>
          <p className="hp-footer-desc">{t("brandDesc")}</p>
          <div className="hp-footer-contacts">
            <a href="tel:+380970068707">+380-97-006-87-07</a>
            <a href="mailto:hi@code-site.art">hi@code-site.art</a>
            <a href="https://t.me/fedirdev" target="_blank" rel="noreferrer">
              @fedirdev
            </a>
          </div>
        </div>
        <div>
          <div className="hp-footer-col-h">{t("solutionsHeading")}</div>
          <ul className="hp-footer-col-list">
            {SOLUTIONS_HREFS.map(({ key, href }) => (
              <li key={key}>{renderSolutionItem(key, href)}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="hp-footer-col-h">{t("companyHeading")}</div>
          <ul className="hp-footer-col-list">
            {companyLinks.map((l) => (
              <li key={l.key}>
                <Link href={l.href}>{tCo(l.key)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="hp-footer-col-section">
            <div className="hp-footer-col-h">{t("compareHeading")}</div>
            <ul className="hp-footer-col-list">
              {COMPARE_HREFS.map(({ key, href }) => (
                <li key={key}>
                  <Link href={isEn ? `/en${href}` : href}>{tCmp(key)}</Link>
                </li>
              ))}
          </ul>
          </div>
        </div>
        <div>
          <div className="hp-footer-col-section">
            <div className="hp-footer-col-h">{t("legalHeading")}</div>
            <ul className="hp-footer-col-list">
              {LEGAL_HREFS.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href}>{tLeg(key)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="hp-footer-bottom">
        <span className="hp-footer-copy">{t("copy")}</span>
        <div className="hp-footer-social">
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
