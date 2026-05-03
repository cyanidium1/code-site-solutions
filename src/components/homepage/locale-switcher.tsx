"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";

import { hasEnIndustry } from "@/lib/i18n-routes";

/**
 * Map the current pathname to its UA / EN counterpart.
 *
 * - `/`            ↔ `/en`
 * - `/en/<rest>`   ↔ `/<rest>`
 * - `/sites-for/<slug>` ↔ `/en/sites-for/<slug>` IFF the slug has an EN
 *   translation; otherwise the EN side falls back to `/en` (homepage)
 *   so the user doesn't land on a 404. UA→EN bouncing without this
 *   mapping was the bug — switching languages on the medicine page
 *   used to send you to `/en` instead of `/en/sites-for/medicine`.
 *
 * For paths we haven't localized yet (e.g. /pricing, /process), the EN
 * side returns `/en` — the user lands on the EN homepage rather than
 * a non-existent EN counterpart.
 */
function resolveAlternate(pathname: string): { uk: string; en: string } {
  if (pathname === "/" || pathname === "/en") {
    return { uk: "/", en: "/en" };
  }

  // EN → UA: strip the /en prefix
  if (pathname.startsWith("/en/")) {
    return { uk: pathname.slice(3), en: pathname };
  }

  // UA → EN: industry pages (only when an EN translation exists).
  // Tolerate an optional trailing slash so `/sites-for/medicine/` also
  // maps cleanly.
  const industryMatch = pathname.match(/^\/sites-for\/([^/]+)\/?$/);
  if (industryMatch && hasEnIndustry(industryMatch[1])) {
    const normalized = `/sites-for/${industryMatch[1]}`;
    return { uk: normalized, en: `/en${normalized}` };
  }

  // UA → EN: paths with no EN counterpart fall back to the EN homepage
  return { uk: pathname, en: "/en" };
}

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  const { uk: ukHref, en: enHref } = resolveAlternate(pathname);

  const currentLabel = locale === "en" ? t("en") : t("uk");

  return (
    <Dropdown
      backdrop="blur"
      placement="bottom-end"
      disableAnimation
      classNames={{
        content: "hp-locale-menu",
      }}
    >
      <DropdownTrigger>
        <button
          type="button"
          className="hp-locale-trigger"
          aria-label={t("ariaLabel")}
        >
          <span>{currentLabel}</span>
          <ChevronDown size={12} strokeWidth={2} aria-hidden />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("ariaLabel")}
        selectionMode="single"
        selectedKeys={new Set([locale])}
        disallowEmptySelection
        onAction={(key) => {
          const target = key === "en" ? enHref : ukHref;
          // Persist the manual choice so the auto-detect on `/` respects
          // it on the next visit. 1-year expiry, root path so it covers
          // every subroute.
          if (typeof document !== "undefined") {
            document.cookie = `NEXT_LOCALE=${key}; path=/; max-age=31536000; samesite=lax`;
          }
          router.push(target);
        }}
        itemClasses={{
          base: "hp-locale-item",
          title: "hp-locale-item-title",
          selectedIcon: "hp-locale-item-check",
        }}
      >
        <DropdownItem key="uk" hrefLang="uk">
          {t("uk")}
        </DropdownItem>
        <DropdownItem key="en" hrefLang="en">
          {t("en")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
