"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { SECONDARY_LOCALES, LOCALE_CONFIG, type SecondaryLocale } from "@/constants/locales";
import { resolveLocaleAlternate } from "@/constants/i18n-routes";
import { normalizePathname } from "@/lib/shared/normalize-pathname";
import { useI18nRegistry } from "./i18n-registry-provider";

/**
 * Dismissible "this site is also available in your language" bar.
 *
 * Replaces the Accept-Language redirect that used to fire on `/` (see
 * src/middleware.ts for the full rationale). Two hard requirements shape
 * this component:
 *
 *   1. It renders CLIENT-side only, from `navigator.language`. The server
 *      HTML is therefore byte-identical for every visitor, so `/` is not
 *      locale-adaptive and the CDN can cache a single variant without
 *      `Vary: Accept-Language`.
 *   2. It never redirects. The visitor clicks, or dismisses — Google
 *      recommends exactly this over automatic language switching.
 *
 * The dismissal is stored in a cookie (not localStorage) so it is shared
 * across the whole origin and survives navigation between locale trees.
 */

const COOKIE = "lang_banner_dismissed";
const COPY: Record<SecondaryLocale, { text: string; cta: string }> = {
  en: {
    text: "This site is also available in English.",
    cta: "Switch to English",
  },
  ru: {
    text: "Этот сайт также доступен на русском.",
    cta: "Перейти на русскую версию",
  },
};

/** First secondary locale matching the browser language, if any. */
function detectLocale(): SecondaryLocale | null {
  if (typeof navigator === "undefined") return null;
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const raw of langs) {
    const base = raw.toLowerCase().split("-")[0];
    // Ukrainian speakers stay where they are — this is the site's own language.
    if (base === "uk") return null;
    const hit = SECONDARY_LOCALES.find((l) => l === base);
    if (hit) return hit;
  }
  return null;
}

export function LanguageBanner() {
  const [locale, setLocale] = useState<SecondaryLocale | null>(null);
  const pathname = normalizePathname(usePathname());
  const registry = useI18nRegistry();

  useEffect(() => {
    if (document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`))) {
      return;
    }
    setLocale(detectLocale());
  }, []);

  if (!locale) return null;

  const dismiss = () => {
    document.cookie = `${COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
    setLocale(null);
  };

  // Same resolver the locale switcher uses: link to this page's twin when
  // one exists, otherwise fall back to that locale's homepage (never a 404).
  const alternate = resolveLocaleAlternate(pathname, registry)[locale];
  const href = alternate ?? LOCALE_CONFIG[locale].urlPrefix;

  return (
    <div
      role="region"
      aria-label={COPY[locale].text}
      className="relative z-[70] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-line bg-[oklch(1_0_0/0.04)] px-6 py-2.5 text-center"
    >
      <span className="font-sans text-[13.5px] leading-[1.5] text-ink-dim">
        {COPY[locale].text}
      </span>
      <Link
        href={href}
        hrefLang={LOCALE_CONFIG[locale].hreflang}
        onClick={dismiss}
        className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-accent-soft underline underline-offset-4 hover:text-ink"
      >
        {COPY[locale].cta}
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:text-ink"
      >
        <X size={15} strokeWidth={2} />
      </button>
    </div>
  );
}
