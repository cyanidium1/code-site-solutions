"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  LOCALIZED_ROOTS,
  localizePath,
  resolveRootHref,
  resolveServiceHref,
} from "@/constants/i18n-routes";
import type { Locale } from "@/constants/locales";
import { normalizePathname } from "@/lib/shared/normalize-pathname";
import { HEADER_NAV_LINKS, SERVICE_NAV_LINKS, SERVICE_PAGE_LINKS } from "@/constants/nav";
import { useLeadModal } from "@/components/blocks/lead-modal";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import Logo from "./logo/logo";
import {
  headerBrandClass,
  headerEndClass,
  headerWrapClass,
  headerRowClass,
  headerPillClass,
  headerCtaPillClass,
  headerCtaTextClass,
  headerCtaArrowClass,
  headerDividerClass,
} from "./header-classes";
import { CtaArrow } from "./cta-arrow";
import { useI18nRegistry } from "./i18n-registry-provider";
import { NavWorkLabel } from "./nav-work-label";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/" || href === "/en") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Floating split glass pill (Figma «код сайт арт» 1729:1911; audit:
// docs/home-header-figma-audit.md). Two sibling pills — main (logo/nav/
// locale/burger) + CTA — in a transparent sticky wrapper, constant top
// offset. Below xl the nav + CTA pill hide; locale + burger stay in the
// main pill and the CTA lives in the drawer.
//
// Was Figma 1729:1953 — Montserrat 400 uppercase at 10–11px. The design
// audit (2026-09-06, H6) measured that row as unreadable chrome with a 17px
// tap target; it is now Manrope 500 at 12/13px, which is also narrower per
// character, so the row still fits the xl pill.
// Gap ladder compresses below the 1440 design width; 18px is the Figma value.
// Nav appears at xl (1100), not lg — see the breakpoint note in
// header-classes.ts: the Figma typography can't fit an 800px viewport.
const headerNavClass = "hidden gap-1.5 xl:flex 2xl:gap-[18px]";
const navLinkBaseClass =
  "flex items-center font-nav text-[12px] font-medium tracking-[0.04em] 2xl:text-[13px] leading-[18px] uppercase text-[oklch(1_0_0/0.92)] no-underline transition-colors duration-200 hover:text-ink";
const navLinkActiveClass =
  "text-ink relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-px after:bg-brand-gradient";

// <details>-based hover/click dropdown. `cursor-pointer + select-none` on
// summary + hiding the marker. Chevron rotates 180° when [open].
const navDdClass = "relative self-stretch flex items-center";
const navDdTriggerClass =
  "list-none flex items-center gap-1.5 cursor-pointer font-nav text-[12px] font-medium tracking-[0.04em] 2xl:text-[13px] leading-[18px] uppercase text-[oklch(1_0_0/0.92)] transition-colors duration-200 select-none hover:text-ink [&::-webkit-details-marker]:hidden group-open/dd:text-ink";
const navDdChevronClass =
  "shrink-0 opacity-75 transition-transform duration-200 group-open/dd:rotate-180";
// Panel offset clears the 60px pill: the <details> anchor is only as tall as
// the 17px nav row centered in the pill, so 100% + 34px lands the panel 12px
// below the pill's bottom edge (was +12px on the old flush bar).
// Two columns — service PAGES left, industries right (audit 2026-09-06, C4:
// the menu labelled "Послуги" listed only industries; the service pages
// were reachable from the footer alone).
const navDdPanelClass =
  "absolute top-[calc(100%+34px)] left-0 w-[max-content] min-w-[520px] p-2 rounded-[14px] border border-line bg-[oklch(from_var(--color-bg)_l_c_h/0.95)] backdrop-blur-[16px] shadow-[0_18px_48px_oklch(0_0_0/0.35),0_0_0_1px_oklch(1_0_0/0.04)_inset] z-[60] grid grid-cols-2 gap-x-2";
const navDdColClass = "flex min-w-[240px] flex-col";
const navDdColHeadClass =
  "px-3 pt-1.5 pb-1 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3";
const navDdLinkBaseClass =
  "block px-3 py-2.5 rounded-[10px] font-sans text-[13px] font-medium normal-case text-ink-dim no-underline transition-[background,color] duration-150 hover:bg-[oklch(1_0_0/0.06)] hover:text-ink";
const navDdLinkActiveClass = "bg-[oklch(from_var(--color-accent)_l_c_h/0.1)] text-ink";
const navDdLinkDisabledClass =
  "text-ink-3 cursor-default opacity-55 hover:bg-transparent hover:text-ink-3";
const navDdFooterClass =
  "block mt-1 px-3 py-2.5 rounded-[10px] border-t border-line font-mono text-[11px] tracking-[0.08em] uppercase font-semibold text-accent-soft no-underline hover:bg-[oklch(from_var(--color-accent)_l_c_h/0.12)]";

export function HpHeader() {
  const ddRef = useRef<HTMLDetailsElement>(null);
  const pathname = normalizePathname(usePathname());
  const t = useTranslations("Nav");
  const tServices = useTranslations("ServiceNav");
  const tPages = useTranslations("ServicePages");
  const locale = useLocale() as Locale;
  const registry = useI18nRegistry();
  const { open: openLeadModal } = useLeadModal();

  useEffect(() => {
    ddRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeDd = () => ddRef.current?.removeAttribute("open");

  // resolveRootHref (not localizePath): roots outside LOCALIZED_ROOTS for
  // the active locale fall back to the UA page instead of a /ru/... 404.
  const navLinks = HEADER_NAV_LINKS.map((link) => ({
    href: resolveRootHref(link.uaHref, locale),
    label: t(link.key),
    key: link.key,
  }));

  const homeHref = localizePath("/", locale);
  // Intentional discrepancy: "All industries" is an anchor that scrolls to
  // the Industries grid on the homepage, not a dedicated route. There is no
  // standalone /services page, so we keep it as a hash. From any non-home
  // page this triggers a full navigation to home + scroll.
  const allServicesHref = `${localizePath("/", locale)}#solutions`;

  // Service pages exist per locale only where LOCALIZED_ROOTS says so — a
  // UA-only page (audit, redesign, …) is simply omitted on /en rather than
  // linked to its UA twin.
  const servicePages = SERVICE_PAGE_LINKS.filter(
    (link) => locale === "uk" || LOCALIZED_ROOTS[locale].has(link.uaHref),
  ).map((link) => ({
    href: localizePath(link.uaHref, locale),
    label: tPages(link.key),
    key: link.key,
  }));

  const servicesActive =
    SERVICE_NAV_LINKS.filter((s) => s.published).some((s) =>
      isActive(pathname, localizePath(s.href, locale)),
    ) || servicePages.some((s) => isActive(pathname, s.href));

  return (
    <header className={headerWrapClass}>
      <div className={headerRowClass}>
        {/* Main pill: logo + nav + divider + locale (+ burger below lg) */}
        <div className={headerPillClass}>
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
                  <div className={navDdColClass}>
                    <div className={navDdColHeadClass}>{t("servicesHeading")}</div>
                    {servicePages.map((item) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={`${navDdLinkBaseClass}${active ? ` ${navDdLinkActiveClass}` : ""}`}
                          aria-current={active ? "page" : undefined}
                          onClick={closeDd}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className={navDdColClass}>
                  <div className={navDdColHeadClass}>{t("industriesHeading")}</div>
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
                    const target = resolveServiceHref(item.href, locale, registry);
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
            <span className={headerDividerClass} aria-hidden="true" />
            <LocaleSwitcher />
            <MobileMenu />
          </div>
        </div>
        {/* CTA pill: Figma right segment — text + white ↗ circle. Whole
            segment is one button → lead modal (behavior unchanged). */}
        <button
          type="button"
          className={headerCtaPillClass}
          onClick={() => {
            closeDd();
            openLeadModal({ source: "header", locale });
          }}
        >
          <span className={headerCtaTextClass}>{t("cta")}</span>
          <CtaArrow className={headerCtaArrowClass} />
        </button>
      </div>
    </header>
  );
}
