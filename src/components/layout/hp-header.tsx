"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localizePath, resolveServiceHref } from "@/constants/i18n-routes";
import { HEADER_NAV_LINKS, SERVICE_NAV_LINKS } from "@/constants/nav";
import { useLeadModal } from "@/components/blocks/lead-modal";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import Logo from "./logo/logo";
import { headerBrandClass, headerEndClass } from "./header-classes";
import { useI18nRegistry } from "./i18n-registry-provider";
import { NavWorkLabel } from "./nav-work-label";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/" || href === "/en") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Header is sticky, backdrop-blurred. Responsive ladder grows the
// nav gap, link font size, and CTA padding lg→2xl to keep the bar
// on one row at desktop without wrapping. Below lg nav + CTA hide;
// locale + burger stay in the bar.
const headerClass =
  "sticky top-0 z-50 border-b border-line bg-[oklch(from_var(--color-bg)_l_c_h/0.7)] backdrop-blur-[14px] px-6 sm:px-8 lg:px-12";
const headerInnerClass =
  "mx-auto max-w-container flex items-center justify-between gap-4 py-[14px] xl:py-[18px]";
const headerNavClass =
  "hidden gap-4 lg:flex xl:gap-[22px] 2xl:gap-7";
// Trailing-colon variant builders for hover-active state on nav links.
const navLinkBaseClass =
  "flex items-center font-mono text-[10px] tracking-[0.1em] uppercase text-ink-dim no-underline transition-colors duration-200 hover:text-ink xl:text-[10.5px] xl:tracking-[0.12em] 2xl:text-[11px]";
const navLinkActiveClass =
  "text-ink relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-px after:bg-brand-gradient";
const headerCtaClass =
  "hidden items-center min-h-11 px-3.5 py-2 rounded-full border-0 bg-ink text-bg font-sans font-semibold text-[10.5px] tracking-[0.04em] uppercase no-underline transition-transform duration-200 hover:-translate-y-px lg:inline-flex xl:px-4 xl:py-[9px] xl:text-[11px] 2xl:px-[18px] 2xl:py-2.5 2xl:text-[12px] shrink-0";

// <details>-based hover/click dropdown. `cursor-pointer + select-none` on
// summary + hiding the marker. Chevron rotates 180° when [open].
const navDdClass = "relative self-stretch flex items-center";
const navDdTriggerClass =
  "list-none flex items-center gap-1.5 cursor-pointer font-mono text-[10px] tracking-[0.1em] uppercase text-ink-dim transition-colors duration-200 select-none hover:text-ink [&::-webkit-details-marker]:hidden group-open/dd:text-ink xl:text-[10.5px] xl:tracking-[0.12em] 2xl:text-[11px]";
const navDdChevronClass =
  "shrink-0 opacity-75 transition-transform duration-200 group-open/dd:rotate-180";
const navDdPanelClass =
  "absolute top-[calc(100%+12px)] left-0 min-w-[232px] p-2 rounded-[14px] border border-line bg-[oklch(from_var(--color-bg)_l_c_h/0.95)] backdrop-blur-[16px] shadow-[0_18px_48px_oklch(0_0_0/0.35),0_0_0_1px_oklch(1_0_0/0.04)_inset] z-[60]";
const navDdLinkBaseClass =
  "block px-3 py-2.5 rounded-[10px] font-sans text-[13px] font-medium normal-case text-ink-dim no-underline transition-[background,color] duration-150 hover:bg-[oklch(1_0_0/0.06)] hover:text-ink";
const navDdLinkActiveClass = "bg-[oklch(from_var(--color-accent)_l_c_h/0.1)] text-ink";
const navDdLinkDisabledClass =
  "text-ink-3 cursor-default opacity-55 hover:bg-transparent hover:text-ink-3";
const navDdFooterClass =
  "block mt-1 px-3 py-2.5 rounded-[10px] border-t border-line font-mono text-[10px] tracking-[0.1em] uppercase font-semibold text-accent-soft no-underline hover:bg-[oklch(from_var(--color-accent)_l_c_h/0.12)]";

export function HpHeader() {
  const ddRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const tServices = useTranslations("ServiceNav");
  const locale = useLocale();
  const isEn = locale === "en";
  const registry = useI18nRegistry();
  const { open: openLeadModal } = useLeadModal();

  useEffect(() => {
    ddRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeDd = () => ddRef.current?.removeAttribute("open");

  const navLinks = HEADER_NAV_LINKS.map((link) => ({
    href: localizePath(link.uaHref, isEn),
    label: t(link.key),
    key: link.key,
  }));

  const homeHref = localizePath("/", isEn);
  // Intentional discrepancy: "All industries" is an anchor that scrolls to
  // the Industries grid on the homepage, not a dedicated route. There is no
  // standalone /services page, so we keep it as a hash. From any non-home
  // page this triggers a full navigation to home + scroll.
  const allServicesHref = isEn ? "/en#solutions" : "/#solutions";

  const servicesActive = SERVICE_NAV_LINKS.filter((s) => s.published).some((s) =>
    isActive(pathname, isEn ? `/en${s.href}` : s.href),
  );

  return (
    <header className={headerClass}>
      <div className={headerInnerClass}>
        <Logo href={homeHref} className={headerBrandClass} onClick={closeDd} />
        <div className={headerEndClass}>
          <nav className={headerNavClass} aria-label={t("menuLabel")}>
          <details ref={ddRef} className={`group/dd ${navDdClass}`}>
            <summary
              className={`${navDdTriggerClass}${servicesActive ? ` ${navLinkActiveClass}` : ""}`}
              aria-current={servicesActive ? "page" : undefined}
            >
              {t("services")}
              <ChevronDown className={navDdChevronClass} size={14} strokeWidth={2} aria-hidden />
            </summary>
            <div className={navDdPanelClass}>
              {SERVICE_NAV_LINKS.map((item) => {
                if (!item.published) {
                  // No Sanity page yet — show the label but make it
                  // non-clickable so the dropdown lists the full industry
                  // line-up without leading visitors to a 404.
                  return (
                    <span
                      key={item.href}
                      className={`${navDdLinkBaseClass} ${navDdLinkDisabledClass}`}
                      aria-disabled="true"
                    >
                      {tServices(item.key)}
                    </span>
                  );
                }
                const target = resolveServiceHref(item.href, isEn, registry);
                const active = isActive(pathname, target);
                return (
                  <Link
                    key={item.href}
                    href={target}
                    className={`${navDdLinkBaseClass}${active ? ` ${navDdLinkActiveClass}` : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={closeDd}
                  >
                    {tServices(item.key)}
                  </Link>
                );
              })}
              <Link href={allServicesHref} className={navDdFooterClass} onClick={closeDd}>
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
                className={`${navLinkBaseClass}${active ? ` ${navLinkActiveClass}` : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={closeDd}
              >
                <NavWorkLabel label={item.label} linkKey={item.key} />
              </Link>
            );
          })}
          </nav>
          <LocaleSwitcher />
          <button
            type="button"
            className={headerCtaClass}
            onClick={() => {
              closeDd();
              openLeadModal({ source: "header", locale: isEn ? "en" : "uk" });
            }}
          >
            {t("cta")}
          </button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
