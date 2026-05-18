"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { hasEnIndustry } from "@/lib/i18n-routes";
import { SERVICE_NAV_LINKS } from "./header-services";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/" || href === "/en") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HpHeader() {
  const ddRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const tServices = useTranslations("ServiceNav");
  const locale = useLocale();
  const isEn = locale === "en";

  useEffect(() => {
    ddRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeDd = () => ddRef.current?.removeAttribute("open");

  // Top-level routes: UA pages until separate EN tickets ship. The Calculator
  // is already English-language so it works for both. Pricing/Process/About
  // etc. land on UA pages — the locale switcher in the header is the escape.
  const navLinks = [
    { href: "/about", label: t("about") },
    // /blog hidden until Sprint 2BC merges real listing + posts. Page
    // itself still resolves (returns "Скоро" stub) so any external link
    // doesn't 404.
    { href: "/calculator", label: t("calculator") },
    {
      href: isEn ? "/portfolio" : "/portfolio",
      label: t("work"),
    },
    { href: "/pricing", label: t("pricing") },
    { href: "/process", label: t("process") },
    {
      href: isEn ? "/en#contact" : "/contacts",
      label: t("contact"),
    },
  ];

  const homeHref = isEn ? "/en" : "/";
  const ctaHref = isEn ? "/en#contact" : "/contacts";
  const allServicesHref = isEn ? "/en#solutions" : "/#solutions";

  // EN dropdown items resolve to /en/sites-for/<slug> when an EN translation
  // exists, otherwise to the EN homepage's Solutions anchor. UA always links
  // to its own /sites-for/<slug>.
  const resolveServiceHref = (uaHref: string): string => {
    if (!isEn) return uaHref;
    const slug = uaHref.replace(/^\/sites-for\//, "");
    return hasEnIndustry(slug) ? `/en/sites-for/${slug}` : "/en#solutions";
  };

  const servicesActive = SERVICE_NAV_LINKS.filter((s) => s.published).some((s) =>
    isActive(pathname, isEn ? `/en${s.href}` : s.href),
  );

  return (
    <header className="hp-header">
      <div className="hp-header-inner">
        <Link href={homeHref} className="hp-header-brand" onClick={closeDd}>
          <em>Code-Site</em>.art
        </Link>
        <nav className="hp-header-nav" aria-label={t("menuLabel")}>
          <details ref={ddRef} className="hp-nav-dd">
            <summary
              className={`hp-nav-dd-trigger${servicesActive ? " active" : ""}`}
              aria-current={servicesActive ? "page" : undefined}
            >
              {t("services")}
              <ChevronDown className="hp-nav-dd-chevron" size={14} strokeWidth={2} aria-hidden />
            </summary>
            <div className="hp-nav-dd-panel">
              {SERVICE_NAV_LINKS.map((item) => {
                if (!item.published) {
                  // No Sanity page yet — show the label but make it
                  // non-clickable so the dropdown lists the full industry
                  // line-up without leading visitors to a 404.
                  return (
                    <span
                      key={item.href}
                      className="hp-nav-dd-link is-disabled"
                      aria-disabled="true"
                    >
                      {tServices(item.key)}
                    </span>
                  );
                }
                const target = resolveServiceHref(item.href);
                const active = isActive(pathname, target);
                return (
                  <Link
                    key={item.href}
                    href={target}
                    className={`hp-nav-dd-link${active ? " active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={closeDd}
                  >
                    {tServices(item.key)}
                  </Link>
                );
              })}
              <Link href={allServicesHref} className="hp-nav-dd-footer" onClick={closeDd}>
                {t("allServicesFooter")}
              </Link>
            </div>
          </details>
          {navLinks.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
                onClick={closeDd}
              >
                {item.label}
              </Link>
            );
          })}
          <LocaleSwitcher />
        </nav>
        <Link href={ctaHref} className="hp-header-cta" onClick={closeDd}>
          {t("cta")}
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
