"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { useDisclosure } from "@heroui/use-disclosure";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  localizePath,
  resolveLocaleAlternate,
  resolveServiceHref,
} from "@/constants/i18n-routes";
import { HEADER_NAV_LINKS, SERVICE_NAV_LINKS } from "@/constants/nav";

/** Animated 3-line → X morph. Pure CSS via data-open. */
function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="hp-burger-icon" data-open={open ? "true" : "false"} aria-hidden="true">
      <span className="hp-burger-line" />
      <span className="hp-burger-line" />
      <span className="hp-burger-line" />
    </span>
  );
}

export function MobileMenu() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const locale = useLocale();
  const isEn = locale === "en";

  const t = useTranslations("Nav");
  const tServices = useTranslations("ServiceNav");
  const tLocale = useTranslations("LocaleSwitcher");

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

  const { uk: ukHref, en: enHref } = resolveLocaleAlternate(pathname);
  const ukDisabled = ukHref === null;
  const enDisabled = enHref === null;
  const ctaHref = localizePath("/contacts", isEn);
  // Intentional discrepancy: "All industries" is an anchor that scrolls to
  // the Industries grid on the homepage, not a dedicated route. There is no
  // standalone /services page, so we keep it as a hash. From any non-home
  // page this triggers a full navigation to home + scroll.
  const allServicesHref = isEn ? "/en#solutions" : "/#solutions";

  const navLinks = HEADER_NAV_LINKS.map((link) => ({
    href: localizePath(link.uaHref, isEn),
    label: t(link.key),
  }));

  const switchLocale = (key: "uk" | "en") => {
    const target = key === "en" ? enHref : ukHref;
    if (!target) return; // disabled — no counterpart for this pathname
    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${key}; path=/; max-age=31536000; samesite=lax`;
    }
    router.push(target);
    onClose();
  };

  // Stagger indices, statically computed so DrawerContent's render-prop
  // can be invoked multiple times per cycle without accumulating a counter.
  // Order: services eyebrow, services 0..N-1, "all industries", nav 0..N-1,
  // locale block.
  const SERVICES_EYEBROW_I = 0;
  const SERVICES_BASE_I = 1;
  const ALL_SERVICES_I = SERVICES_BASE_I + SERVICE_NAV_LINKS.length;
  const NAV_BASE_I = ALL_SERVICES_I + 1;
  const LOCALE_I = NAV_BASE_I + navLinks.length;

  return (
    <>
      <button
        type="button"
        className="hp-burger-btn"
        aria-label={t("menuLabel")}
        aria-expanded={isOpen}
        onClick={onOpen}
      >
        <BurgerIcon open={isOpen} />
      </button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        size="full"
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "hp-drawer-base",
          backdrop: "hp-drawer-backdrop",
          wrapper: "hp-drawer-wrapper",
        }}
      >
        <DrawerContent>
          {(close) => (
            <>
              <div className="hp-drawer-head">
                <Link
                  href={isEn ? "/en" : "/"}
                  className="hp-header-brand"
                  onClick={close}
                >
                  <em>Code-Site</em>.art
                </Link>
                <button
                  type="button"
                  className="hp-drawer-close"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <X size={20} strokeWidth={1.6} />
                </button>
              </div>
              <DrawerBody className="hp-drawer-body">
                <div className="hp-drawer-section">
                  <div
                    className="hp-drawer-eyebrow hp-drawer-stagger"
                    style={{ ["--i" as string]: SERVICES_EYEBROW_I }}
                  >
                    {t("services")}
                  </div>
                  <ul className="hp-drawer-list">
                    {SERVICE_NAV_LINKS.map((s, idx) => (
                      <li
                        key={s.href}
                        className="hp-drawer-stagger"
                        style={{ ["--i" as string]: SERVICES_BASE_I + idx }}
                      >
                        {s.published ? (
                          <Link
                            href={resolveServiceHref(s.href, isEn)}
                            className="hp-drawer-link"
                            onClick={close}
                          >
                            <span>{tServices(s.key)}</span>
                            <ChevronRight size={14} strokeWidth={1.8} />
                          </Link>
                        ) : (
                          <span
                            className="hp-drawer-link is-disabled"
                            aria-disabled="true"
                          >
                            <span>{tServices(s.key)}</span>
                          </span>
                        )}
                      </li>
                    ))}
                    <li
                      className="hp-drawer-stagger"
                      style={{ ["--i" as string]: ALL_SERVICES_I }}
                    >
                      <Link
                        href={allServicesHref}
                        className="hp-drawer-link is-muted"
                        onClick={close}
                      >
                        <span>{t("allServicesFooter")}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="hp-drawer-divider" />

                <ul className="hp-drawer-list">
                  {navLinks.map((l, idx) => (
                    <li
                      key={l.href}
                      className="hp-drawer-stagger"
                      style={{ ["--i" as string]: NAV_BASE_I + idx }}
                    >
                      <Link
                        href={l.href}
                        className="hp-drawer-link is-primary"
                        onClick={close}
                      >
                        <span>{l.label}</span>
                        <ChevronRight size={14} strokeWidth={1.8} />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="hp-drawer-divider" />

                <details
                  className="hp-drawer-locale-dd hp-drawer-stagger"
                  style={{ ["--i" as string]: LOCALE_I }}
                >
                  <summary
                    className="hp-drawer-locale-trigger"
                    aria-label={tLocale("ariaLabel")}
                  >
                    <span>{isEn ? tLocale("en") : tLocale("uk")}</span>
                    <ChevronDown size={14} strokeWidth={2} aria-hidden />
                  </summary>
                  <div
                    className="hp-drawer-locale-panel"
                    role="menu"
                    aria-label={tLocale("ariaLabel")}
                  >
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={!isEn}
                      aria-disabled={ukDisabled || undefined}
                      disabled={ukDisabled}
                      className={`hp-drawer-locale-item${!isEn ? " is-active" : ""}${ukDisabled ? " is-disabled" : ""}`}
                      onClick={() => switchLocale("uk")}
                    >
                      {tLocale("uk")}
                    </button>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isEn}
                      aria-disabled={enDisabled || undefined}
                      disabled={enDisabled}
                      className={`hp-drawer-locale-item${isEn ? " is-active" : ""}${enDisabled ? " is-disabled" : ""}`}
                      onClick={() => switchLocale("en")}
                    >
                      {tLocale("en")}
                    </button>
                  </div>
                </details>
              </DrawerBody>

              <div className="hp-drawer-foot">
                <Link
                  href={ctaHref}
                  className="hp-drawer-cta"
                  onClick={close}
                >
                  {t("cta")}
                </Link>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

