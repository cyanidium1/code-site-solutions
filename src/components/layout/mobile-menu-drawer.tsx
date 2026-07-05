"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { ChevronRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { localizePath, resolveServiceHref } from "@/constants/i18n-routes";
import { HEADER_NAV_LINKS, SERVICE_NAV_LINKS } from "@/constants/nav";
import Logo from "./logo/logo";
import { headerBrandClass } from "./header-classes";
import { useI18nRegistry } from "./i18n-registry-provider";
import { NavWorkLabel } from "./nav-work-label";

// HeroUI Drawer slot classes. `!`-prefixed where they override HeroUI's
// internal class precedence (background, max-width, border).
// The wrapper z-index is intentionally NOT overridden: HeroUI's own
// wrapper manages click-outside delegation, and forcing a higher z-index
// on the wrapper turned the backdrop into a sibling that swallowed
// pointer events without firing the close handler. `base` (the panel)
// keeps its z bump so it renders above the backdrop within HeroUI's
// own z-50 wrapper, while page content at z:1 (.blog-prose etc.) still
// renders below the wrapper itself.
const drawerClassNames = {
  base:
    "!bg-bg !bg-[linear-gradient(180deg,oklch(0.10_0.005_300)_0%,oklch(0.08_0.01_295)_100%)] " +
    "!border-l !border-line text-ink !max-w-[420px] !w-screen !rounded-none !m-0",
  backdrop: "!bg-[oklch(0.06_0.005_300/0.55)] !backdrop-blur-[8px]",
};

const drawerHeadClass =
  "flex items-center justify-between px-[22px] py-[18px] border-b border-line shrink-0";
const drawerCloseClass =
  "w-11 h-11 -mr-2.5 border-0 rounded-xl bg-transparent text-ink-dim cursor-pointer inline-flex items-center justify-center transition-[background,color] duration-150 hover:bg-[oklch(1_0_0/0.06)] hover:text-ink";
const drawerBodyClass =
  "!px-[22px] !pt-[22px] !pb-4 overflow-y-auto flex-1 flex flex-col gap-3.5";

const drawerSectionClass = "flex flex-col gap-2";
const drawerEyebrowClass =
  "font-mono text-[10px] tracking-[0.18em] uppercase text-ink-3 px-1";
const drawerListClass = "list-none m-0 p-0 flex flex-col gap-0.5";
const drawerLinkBaseClass =
  "flex items-center justify-between gap-3 min-h-11 px-3.5 py-3 rounded-xl " +
  "font-sans text-[15px] font-medium text-ink no-underline " +
  "transition-[background,color] duration-150 " +
  "hover:bg-[oklch(1_0_0/0.05)] active:bg-[oklch(1_0_0/0.08)] " +
  "[&_svg]:text-ink-3 [&_svg]:transition-[color,transform] [&_svg]:duration-150 " +
  "hover:[&_svg]:text-accent-soft hover:[&_svg]:translate-x-0.5";
const drawerLinkPrimaryClass =
  "!font-mono !text-[12px] !tracking-[0.12em] !uppercase";
const drawerLinkMutedClass =
  "!font-mono !text-[10px] !tracking-[0.14em] !uppercase !text-accent-soft";
const drawerLinkDisabledClass =
  "!text-ink-3 cursor-default opacity-55 hover:!bg-transparent";

const drawerDividerClass = "h-px bg-line my-1.5";

const drawerFootClass =
  "px-[22px] pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] border-t border-line shrink-0";
const drawerCtaClass =
  "block text-center w-full px-[22px] py-4 rounded-full bg-brand-gradient text-[oklch(1_0_0/0.98)] " +
  "font-sans font-semibold text-[13px] tracking-[0.06em] uppercase no-underline " +
  "shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h/0.3)] " +
  "transition-[transform,box-shadow] duration-[180ms] " +
  "hover:-translate-y-px hover:shadow-[0_16px_36px_oklch(from_var(--color-accent)_l_c_h/0.42)]";

// Stagger entrance applied per item. `--i` is set inline (one CSS var per
// element). Delay = i*55ms + 80ms. Animation token lives in @theme as
// `--animate-hp-drawer-in` so we get the `animate-hp-drawer-in` utility
// from Tailwind 4. `motion-reduce:` zeroes the animation for users with
// reduced-motion preference.
const drawerStaggerClass =
  "animate-hp-drawer-in [animation-delay:calc(var(--i,0)*55ms+80ms)] motion-reduce:animate-none";

export function MobileMenuDrawer({
  isOpen,
  onOpenChange,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const locale = useLocale();
  const isEn = locale === "en";

  const t = useTranslations("Nav");
  const tServices = useTranslations("ServiceNav");

  // Close on route change. Track the pathname we opened on; when it changes,
  // close. Without this, clicking a link inside the drawer would navigate
  // but the drawer would stay open over the new page.
  const openedAt = useRef<string | null>(null);
  useEffect(() => {
    if (isOpen && openedAt.current === null) {
      openedAt.current = pathname;
    } else if (isOpen && openedAt.current !== pathname) {
      onClose();
      openedAt.current = null;
    } else if (!isOpen) {
      openedAt.current = null;
    }
  }, [isOpen, pathname, onClose]);

  const registry = useI18nRegistry();
  const ctaHref = localizePath("/contacts", isEn);
  // Intentional discrepancy: "All industries" is an anchor that scrolls to
  // the Industries grid on the homepage, not a dedicated route. There is no
  // standalone /services page, so we keep it as a hash. From any non-home
  // page this triggers a full navigation to home + scroll.
  const allServicesHref = isEn ? "/en#solutions" : "/#solutions";

  const navLinks = HEADER_NAV_LINKS.map((link) => ({
    href: localizePath(link.uaHref, isEn),
    label: t(link.key),
    key: link.key,
  }));

  // Stagger indices, statically computed so DrawerContent's render-prop
  // can be invoked multiple times per cycle without accumulating a counter.
  const SERVICES_EYEBROW_I = 0;
  const SERVICES_BASE_I = 1;
  const ALL_SERVICES_I = SERVICES_BASE_I + SERVICE_NAV_LINKS.length;
  const NAV_BASE_I = ALL_SERVICES_I + 1;

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="right"
      size="full"
      backdrop="blur"
      hideCloseButton
      classNames={drawerClassNames}
    >
      <DrawerContent>
        {(close) => (
          <>
            <div className={drawerHeadClass}>
              <Logo
                href={isEn ? "/en" : "/"}
                className={headerBrandClass}
                onClick={close}
              />
              <button
                type="button"
                className={drawerCloseClass}
                aria-label="Close menu"
                onClick={close}
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>
            <DrawerBody className={drawerBodyClass}>
              <div className={drawerSectionClass}>
                <div
                  className={`${drawerEyebrowClass} ${drawerStaggerClass}`}
                  // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                  style={{ "--i": SERVICES_EYEBROW_I } as CSSProperties}
                >
                  {t("services")}
                </div>
                <ul className={drawerListClass}>
                  {SERVICE_NAV_LINKS.map((s, idx) => (
                    <li
                      key={s.href}
                      className={drawerStaggerClass}
                      // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                      style={{ "--i": SERVICES_BASE_I + idx } as CSSProperties}
                    >
                      {s.published ? (
                        <Link
                          href={resolveServiceHref(s.href, isEn, registry)}
                          className={drawerLinkBaseClass}
                          onClick={close}
                        >
                          <span>{tServices(s.key)}</span>
                          <ChevronRight size={14} strokeWidth={1.8} />
                        </Link>
                      ) : (
                        <span
                          className={`${drawerLinkBaseClass} ${drawerLinkDisabledClass}`}
                          aria-disabled="true"
                        >
                          <span>{tServices(s.key)}</span>
                        </span>
                      )}
                    </li>
                  ))}
                  <li
                    className={drawerStaggerClass}
                    // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                    style={{ "--i": ALL_SERVICES_I } as CSSProperties}
                  >
                    <Link
                      href={allServicesHref}
                      className={`${drawerLinkBaseClass} ${drawerLinkMutedClass}`}
                      onClick={close}
                    >
                      <span>{t("allServicesFooter")}</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className={drawerDividerClass} />

              <ul className={drawerListClass}>
                {navLinks.map((l, idx) => (
                  <li
                    key={l.href}
                    className={drawerStaggerClass}
                    // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                    style={{ "--i": NAV_BASE_I + idx } as CSSProperties}
                  >
                    <Link
                      href={l.href}
                      className={`${drawerLinkBaseClass} ${drawerLinkPrimaryClass}`}
                      onClick={close}
                    >
                      <span>
                        <NavWorkLabel label={l.label} linkKey={l.key} />
                      </span>
                      <ChevronRight size={14} strokeWidth={1.8} />
                    </Link>
                  </li>
                ))}
              </ul>
            </DrawerBody>

            <div className={drawerFootClass}>
              <Link
                href={ctaHref}
                className={drawerCtaClass}
                onClick={close}
              >
                {t("cta")}
              </Link>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
