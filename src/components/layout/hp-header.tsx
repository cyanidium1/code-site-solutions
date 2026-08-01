"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localizePath, resolveRootHref, resolveServiceHref } from "@/constants/i18n-routes";
import type { Locale } from "@/constants/locales";
import { normalizePathname } from "@/lib/shared/normalize-pathname";
import { HEADER_NAV_LINKS, SERVICE_NAV_LINKS } from "@/constants/nav";
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
// offset. Below lg the nav + CTA pill hide; locale + burger stay in the
// main pill and the CTA lives in the drawer.
//
// Figma 1729:1953 — Montserrat 400 uppercase, 11px links / 12px Services
// trigger, tracking 1.32px, lh 16.5, white (92% base → 100% hover; the
// active gradient underline is a kept deviation — mockup shows none).
// Gap ladder compresses below the 1440 design width; 18px is the Figma value.
const headerNavClass = "hidden gap-3 lg:flex xl:gap-[18px]";
const navLinkBaseClass =
  "flex items-center font-nav text-[11px] leading-[16.5px] tracking-[1.32px] uppercase text-[oklch(1_0_0/0.92)] no-underline transition-colors duration-200 hover:text-ink";
const navLinkActiveClass =
  "text-ink relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-px after:bg-brand-gradient";

// <details>-based hover/click dropdown. `cursor-pointer + select-none` on
// summary + hiding the marker. Chevron rotates 180° when [open].
const navDdClass = "relative self-stretch flex items-center";
const navDdTriggerClass =
  "list-none flex items-center gap-1.5 cursor-pointer font-nav text-[12px] leading-[16.5px] tracking-[1.32px] uppercase text-[oklch(1_0_0/0.92)] transition-colors duration-200 select-none hover:text-ink [&::-webkit-details-marker]:hidden group-open/dd:text-ink";
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
  const pathname = normalizePathname(usePathname());
  const t = useTranslations("Nav");
  const tServices = useTranslations("ServiceNav");
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

  const servicesActive = SERVICE_NAV_LINKS.filter((s) => s.published).some((s) =>
    isActive(pathname, localizePath(s.href, locale)),
  );

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
          <CtaArrow className="size-9 shrink-0" />
        </button>
      </div>
    </header>
  );
}
