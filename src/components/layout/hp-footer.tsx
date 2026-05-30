"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Linkedin, Send, Instagram, Mail, Phone, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { hasEnIndustry } from "@/constants/i18n-routes";
import Logo from "./logo/logo";
import { headerBrandClass } from "./header-classes";
import { useI18nRegistry } from "./i18n-registry-provider";

// lucide has no brand WhatsApp glyph — wire-style outline (Tabler-derived) that
// matches the stroke weight of the lucide icons used for the other channels.
type WireIconProps = { size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>;
function WhatsAppIcon({ size = 14, strokeWidth = 1.6, ...rest }: WireIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
    </svg>
  );
}

type SocialDef = { icon: LucideIcon; href: string; label: string };
const DEFAULT_SOCIALS: SocialDef[] = [
  { icon: Linkedin, href: "https://linkedin.com/in/fedirdev", label: "LinkedIn" },
  { icon: Send, href: "https://t.me/fedirdev", label: "Telegram" },
  { icon: Instagram, href: "https://instagram.com/fedirdev", label: "Instagram" },
];

// Footer contact channels. Order mirrors the design reference:
// WhatsApp → Mail → Telegram → Phone. Each icon inherits text colour via
// `currentColor` so they fade/hover in sync with the label.
type ContactIcon = ComponentType<{ size?: number; strokeWidth?: number }>;
const FOOTER_CONTACTS: Array<{
  Icon: ContactIcon;
  href: string;
  label: string;
  external?: boolean;
}> = [
  { Icon: WhatsAppIcon, href: "https://wa.me/355689286136", label: "+355-68-928-6136", external: true },
  { Icon: Mail, href: "mailto:hi@code-site.art", label: "hi@code-site.art" },
  { Icon: Send, href: "https://t.me/fedirdev", label: "@fedirdev", external: true },
  { Icon: Phone, href: "tel:+380970068707", label: "+380-97-006-87-07" },
];

// All 8 industries have published Sanity pages and live UA links.
// EN availability is gated by the i18n registry (Sanity-derived, see
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
  "relative pt-12 lg:pt-16 px-6 sm:px-8 lg:px-12 pb-8 border-t border-line bg-[oklch(0_0_0_/_0.20)]";
// 5-col grid on both locales: brand spans 2fr, then Solutions / Company /
// Compare / Legal each get their own 1fr column. Mobile stacks to 2 cols
// with the brand cell spanning both.
const footerInnerClass =
  "mx-auto max-w-container grid grid-cols-2 [&>:first-child]:col-span-2 gap-6 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:[&>:first-child]:col-span-1";
const footerDescClass = "mt-4 text-[13.5px] leading-[1.55] text-ink-dim max-w-[320px]";
const footerContactsClass =
  "mt-5 font-mono text-[12px] leading-5 flex flex-col gap-1.5 [&>a]:inline-flex [&>a]:items-center [&>a]:gap-2 [&>a]:h-5 [&>a]:text-ink-dim [&>a]:no-underline [&>a]:transition-colors [&>a]:duration-200 [&>a:hover]:text-ink [&_svg]:shrink-0 [&_svg]:text-ink-3 [&>a:hover_svg]:text-accent-soft [&_svg]:transition-colors [&_svg]:duration-200";
const footerColHClass =
  "font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3";
const footerColListClass =
  "list-none mt-3 p-0 flex flex-col gap-1 [&_li]:h-5 [&_a]:inline-flex [&_a]:items-center [&_a]:h-5 [&_a]:leading-5 [&_a]:font-sans [&_a]:text-[13px] [&_a]:text-ink-dim [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-ink";
const footerDisabledClass =
  "inline-flex h-5 items-center font-sans text-[13px] leading-5 text-ink-3 cursor-default";
const footerBottomClass =
  "mx-auto max-w-container mt-10 pt-5 border-t border-line flex justify-between items-center flex-wrap gap-4";
const footerCopyClass = "font-mono text-[11px] text-ink-3";
// Social icon links: explicit `w-11 h-11 inline-flex` so each social anchor
// hits 44×44 even though the icon glyph itself is only 18px. The visible
// gap stays `gap-4` (16px) between siblings.
const footerSocialClass =
  "flex gap-4 [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:w-11 [&_a]:h-11 [&_a]:text-ink-3 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-ink";

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
  const registry = useI18nRegistry();
  const homeHref = isEn ? "/en" : "/";

  // Render rules:
  //   - UA: if the industry page is published, link to /sites-for/<slug>;
  //     otherwise render a disabled label so the column shows all 8 names.
  //   - EN: same, but the link only resolves when an EN translation also
  //     exists (per `useI18nRegistry`, derived from Sanity). Industries
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
    if (hasEnIndustry(slug, registry)) {
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
      <div className={footerInnerClass}>
        <div>
          <Logo href={homeHref} className={headerBrandClass} />
          <p className={footerDescClass}>{t("brandDesc")}</p>
          <div className={footerContactsClass}>
            {FOOTER_CONTACTS.map(({ Icon, href, label, external }) => (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <Icon size={14} strokeWidth={1.6} />
                <span>{label}</span>
              </a>
            ))}
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
          Compare + Legal each get their own column on both locales (5-col
          desktop grid). EN compare links get a `/en` prefix; legal pages
          are locale-agnostic.
        */}
        <div>
          <div className={footerColHClass}>{t("compareHeading")}</div>
          <ul className={footerColListClass}>
            {COMPARE_HREFS.map(({ key, href }) => (
              <li key={key}>
                <Link href={isEn ? `/en${href}` : href}>{tCmp(key)}</Link>
              </li>
            ))}
          </ul>
        </div>
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
