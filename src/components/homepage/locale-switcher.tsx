"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
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

/**
 * Native `<details>` dropdown. We swapped off HeroUI's Dropdown after a
 * production bug where the menu would flash open for ~500ms and then
 * immediately collapse before the user could pick an option — likely an
 * overlay/blur race inside the React Aria pressable layer. The `<details>`
 * element has the same a11y story (button-like summary + region) without
 * the overlay machinery that was misfiring.
 */
export function LocaleSwitcher() {
  const ref = useRef<HTMLDetailsElement>(null);
  const locale = useLocale();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  const { uk: ukHref, en: enHref } = resolveAlternate(pathname);
  const currentLabel = locale === "en" ? t("en") : t("uk");

  // Close on route change (covers the locale switch we trigger ourselves)
  useEffect(() => {
    ref.current?.removeAttribute("open");
  }, [pathname]);

  // Close on outside click + ESC
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.open) return;
      if (ref.current.contains(e.target as Node)) return;
      ref.current.removeAttribute("open");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.open) {
        ref.current.removeAttribute("open");
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const pick = (key: "uk" | "en") => (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${key}; path=/; max-age=31536000; samesite=lax`;
    }
    ref.current?.removeAttribute("open");
    router.push(key === "en" ? enHref : ukHref);
  };

  return (
    <details ref={ref} className="hp-locale-dd">
      <summary
        className="hp-locale-trigger"
        aria-label={t("ariaLabel")}
      >
        <span>{currentLabel}</span>
        <ChevronDown size={12} strokeWidth={2} aria-hidden />
      </summary>
      <div
        className="hp-locale-panel"
        role="menu"
        aria-label={t("ariaLabel")}
      >
        <a
          href={ukHref}
          role="menuitemradio"
          aria-checked={locale !== "en"}
          className={`hp-locale-panel-item${locale !== "en" ? " is-active" : ""}`}
          onClick={pick("uk")}
        >
          {t("uk")}
        </a>
        <a
          href={enHref}
          role="menuitemradio"
          aria-checked={locale === "en"}
          className={`hp-locale-panel-item${locale === "en" ? " is-active" : ""}`}
          onClick={pick("en")}
        >
          {t("en")}
        </a>
      </div>
    </details>
  );
}
