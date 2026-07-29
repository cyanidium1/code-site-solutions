/**
 * Pure types + wire conversions for the i18n content registry. Safe to
 * import from both server and client modules (no `"server-only"` guard,
 * no Sanity client, no Next cache APIs).
 *
 * The actual Sanity-fetching `getContentRegistry()` /
 * `getContentRegistrySafe()` live in `@/lib/server/i18n-registry`.
 * Keep that file server-only.
 */

import { SECONDARY_LOCALES, type SecondaryLocale } from "@/constants/locales";

/** Availability of translated CMS content for one secondary locale. */
export type LocaleContentSet = {
  /** UA industry slugs whose Sanity industryPage has a non-empty localized title. */
  industries: ReadonlySet<string>;
  /** UA case slugs whose Sanity caseStudy has a non-empty localized title. */
  cases: ReadonlySet<string>;
  /** Default-locale blog slug → localized blog slug (content gate passed). */
  blogFromUa: ReadonlyMap<string, string>;
  /** Inverse of `blogFromUa`. */
  blogToUa: ReadonlyMap<string, string>;
};

/** Per-secondary-locale content availability. */
export type ContentRegistry = ReadonlyMap<SecondaryLocale, LocaleContentSet>;

/**
 * Wire-format used when crossing the RSC server→client boundary. Maps
 * and Sets serialize unevenly across Next versions; arrays + tuples are
 * stable. The client provider reconstructs the runtime shape on hydration.
 */
export type LocaleContentWire = {
  industries: readonly string[];
  cases: readonly string[];
  blogPairs: ReadonlyArray<readonly [string, string]>;
};
export type ContentRegistryWire = Partial<Record<SecondaryLocale, LocaleContentWire>>;

export function toWire(reg: ContentRegistry): ContentRegistryWire {
  const out: ContentRegistryWire = {};
  for (const [l, s] of reg) {
    out[l] = {
      industries: [...s.industries],
      cases: [...s.cases],
      blogPairs: [...s.blogFromUa] as Array<[string, string]>,
    };
  }
  return out;
}

export function fromWire(wire: ContentRegistryWire): ContentRegistry {
  const m = new Map<SecondaryLocale, LocaleContentSet>();
  for (const l of SECONDARY_LOCALES) {
    const w = wire[l];
    if (!w) continue;
    m.set(l, {
      industries: new Set(w.industries),
      cases: new Set(w.cases),
      blogFromUa: new Map(w.blogPairs),
      blogToUa: new Map(w.blogPairs.map(([ua, loc]) => [loc, ua] as const)),
    });
  }
  return m;
}

/**
 * Last-known-good seed used when context is missing (tests, server
 * modules that haven't been migrated, Sanity outage). Mirrors the
 * 2026-05-30 Sanity state — translation-pass commit. Re-sync via
 * `Sanity/scripts/probe-en-availability.ts` if the live registry
 * diverges from this seed and you need to refresh the fallback.
 */
export const FALLBACK_REGISTRY: ContentRegistry = fromWire({
  en: {
    industries: [
      "auto",
      "courses",
      "ecommerce",
      "finance",
      "legal",
      "medicine",
      "real-estate",
      "renovation",
    ],
    cases: [
      "bravo",
      "efedra-clinic",
      "glimmer",
      "kondor-device",
      "le-muse-nature",
      "mono-pools",
      "nbyg-kobenhavn",
      "right-cars",
      "solide-renovation",
    ],
    blogPairs: [
      ["skilky-koshtuye-sayt-2026", "website-cost-2026-breakdown"],
      ["tilda-7200-za-3-roky", "tilda-7200-over-3-years"],
      ["dohovir-z-veb-studieyu-7-punktiv", "web-studio-contract-7-items"],
    ],
  },
});
