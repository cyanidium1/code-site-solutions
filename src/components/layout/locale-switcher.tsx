"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

import { resolveLocaleAlternate } from "@/constants/i18n-routes";
import { useI18nRegistry } from "./i18n-registry-provider";

// Native <details> dropdown — see component-level comment for why this
// replaced HeroUI's Dropdown. Tailwind 4 `group/locale` lets the chevron +
// trigger color react to [open] via `group-open/locale:*` modifiers.
//
// Mobile-first: pill trigger with 48px min height in the header bar; compact
// text-only control from `lg` up inside the desktop nav row. Desktop `-mx-1`
// neutralizes summary `px-1` so spacing matches adjacent nav links.
const localeDdClass =
  "group/locale relative self-stretch flex items-center shrink-0 lg:-mx-1";
const localeTriggerClass =
  "list-none inline-flex items-center gap-2 min-h-12 px-3.5 py-2.5 rounded-full " +
  " font-mono text-[13px] tracking-[0.14em] uppercase text-ink-dim cursor-pointer " +
  "transition-colors duration-200 select-none hover:text-ink [&::-webkit-details-marker]:hidden group-open/locale:text-ink " +
  "[&_svg]:opacity-70 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:shrink-0 group-open/locale:[&_svg]:rotate-180 " +
  "lg:min-h-11 lg:gap-[5px] lg:px-1 lg:py-0 lg:border-0 lg:rounded-none lg:bg-transparent lg:text-[11px] lg:tracking-[0.12em] " +
  "lg:max-2xl:text-[10.5px] lg:max-xl:text-[10px] lg:max-xl:tracking-[0.1em]";
const localeChevronClass = "w-3.5 h-3.5 lg:w-3 lg:h-3";
const localePanelClass =
  "hidden group-open/locale:flex absolute top-[calc(100%+12px)] right-0 min-w-[148px] p-2 border border-line rounded-[14px] " +
  "bg-[oklch(from_var(--color-bg)_l_c_h/0.95)] backdrop-blur-[16px] shadow-[0_18px_48px_oklch(0_0_0/0.35),0_0_0_1px_oklch(1_0_0/0.04)_inset] z-[60] flex-col gap-0.5 " +
  "lg:min-w-[132px] lg:p-1.5";
const localePanelItemBaseClass =
  "inline-flex items-center w-full min-h-12 px-4 py-2.5 rounded-[10px] font-mono text-[13px] tracking-[0.14em] uppercase text-ink-dim no-underline " +
  "cursor-pointer transition-[background,color] duration-150 hover:bg-[oklch(1_0_0/0.06)] hover:text-ink " +
  "lg:min-h-11 lg:px-3 lg:py-2 lg:text-[11px] lg:tracking-[0.12em]";
const localePanelItemActiveClass = "bg-[oklch(from_var(--color-accent)_l_c_h/0.12)] text-ink";
const localePanelItemDisabledClass =
  "text-ink-3 opacity-40 cursor-not-allowed pointer-events-none hover:bg-transparent hover:text-ink-3";

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

  const registry = useI18nRegistry();
  const { uk: ukHref, en: enHref } = resolveLocaleAlternate(pathname, registry);
  const currentLabel = locale === "en" ? t("en") : t("uk");
  // When the target locale has no counterpart for this pathname, the
  // button is rendered in a disabled state with a "coming soon" tooltip
  // — never silently bounce to /en or /.
  const ukDisabled = ukHref === null;
  const enDisabled = enHref === null;
  const comingSoon = "EN version coming soon";

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
    const target = key === "en" ? enHref : ukHref;
    if (!target) return; // disabled — guard against keyboard activation
    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${key}; path=/; max-age=31536000; samesite=lax`;
    }
    ref.current?.removeAttribute("open");
    router.push(target);
  };

  return (
    <details ref={ref} className={localeDdClass}>
      <summary
        className={localeTriggerClass}
        aria-label={t("ariaLabel")}
      >
        <span>{currentLabel}</span>
        <ChevronDown className={localeChevronClass} strokeWidth={2} aria-hidden />
      </summary>
      <div
        className={localePanelClass}
        role="menu"
        aria-label={t("ariaLabel")}
      >
        <a
          href={ukHref ?? "#"}
          role="menuitemradio"
          aria-checked={locale !== "en"}
          aria-disabled={ukDisabled || undefined}
          tabIndex={ukDisabled ? -1 : undefined}
          title={ukDisabled ? comingSoon : undefined}
          className={`${localePanelItemBaseClass}${locale !== "en" ? ` ${localePanelItemActiveClass}` : ""}${ukDisabled ? ` ${localePanelItemDisabledClass}` : ""}`}
          onClick={pick("uk")}
        >
          {t("uk")}
        </a>
        <a
          href={enHref ?? "#"}
          role="menuitemradio"
          aria-checked={locale === "en"}
          aria-disabled={enDisabled || undefined}
          tabIndex={enDisabled ? -1 : undefined}
          title={enDisabled ? comingSoon : undefined}
          className={`${localePanelItemBaseClass}${locale === "en" ? ` ${localePanelItemActiveClass}` : ""}${enDisabled ? ` ${localePanelItemDisabledClass}` : ""}`}
          onClick={pick("en")}
        >
          {t("en")}
        </a>
      </div>
    </details>
  );
}
