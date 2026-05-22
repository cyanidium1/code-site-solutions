"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localizePath, resolveServiceHref } from "@/constants/i18n-routes";
import { HEADER_NAV_LINKS, SERVICE_NAV_LINKS } from "@/constants/nav";
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

  const navLinks = HEADER_NAV_LINKS.map((link) => ({
    href: localizePath(link.uaHref, isEn),
    label: t(link.key),
  }));

  const homeHref = localizePath("/", isEn);
  const ctaHref = localizePath("/contacts", isEn);
  // Intentional discrepancy: "All industries" is an anchor that scrolls to
  // the Industries grid on the homepage, not a dedicated route. There is no
  // standalone /services page, so we keep it as a hash. From any non-home
  // page this triggers a full navigation to home + scroll.
  const allServicesHref = isEn ? "/en#solutions" : "/#solutions";

  const servicesActive = SERVICE_NAV_LINKS.filter((s) => s.published).some((s) =>
    isActive(pathname, isEn ? `/en${s.href}` : s.href),
  );

  return (
    <header className="hp-header">
      <div className="hp-header-inner">
        <Link href={homeHref} className="hp-header-brand" onClick={closeDd}>
          <em>Code-Site</em>.art
        </Link>
        <div className="hp-header-end">
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
                const target = resolveServiceHref(item.href, isEn);
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
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
