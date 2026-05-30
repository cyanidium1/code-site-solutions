/**
 * Pure types + wire conversions for the i18n registry. Safe to import
 * from both server and client modules (no `"server-only"` guard, no
 * Sanity client, no Next cache APIs).
 *
 * The actual Sanity-fetching `getEnRegistry()` / `getEnRegistrySafe()`
 * live in `@/lib/server/i18n-registry`. Keep that file server-only.
 */

export type EnRegistry = {
  /** UA industry slugs whose Sanity industryPage has non-empty `title.en`. */
  industries: ReadonlySet<string>;
  /** UA case slugs whose Sanity caseStudy has non-empty `title.en`. */
  cases: ReadonlySet<string>;
  /** UA blog slug → EN blog slug, for posts whose EN content gate passes. */
  blogUaToEn: ReadonlyMap<string, string>;
  /** Inverse of `blogUaToEn`. */
  blogEnToUa: ReadonlyMap<string, string>;
};

/**
 * Wire-format used when crossing the RSC server→client boundary. Maps
 * and Sets serialize unevenly across Next versions; arrays + tuples are
 * stable. The client provider reconstructs the runtime shape on hydration.
 */
export type EnRegistryWire = {
  industries: readonly string[];
  cases: readonly string[];
  blogPairs: ReadonlyArray<readonly [string, string]>;
};

export function toWire(reg: EnRegistry): EnRegistryWire {
  return {
    industries: [...reg.industries],
    cases: [...reg.cases],
    blogPairs: [...reg.blogUaToEn] as Array<[string, string]>,
  };
}

export function fromWire(wire: EnRegistryWire): EnRegistry {
  const blogUaToEn = new Map(wire.blogPairs);
  const blogEnToUa = new Map(wire.blogPairs.map(([ua, en]) => [en, ua] as const));
  return {
    industries: new Set(wire.industries),
    cases: new Set(wire.cases),
    blogUaToEn,
    blogEnToUa,
  };
}

/**
 * Last-known-good seed used when context is missing (tests, server
 * modules that haven't been migrated, Sanity outage). Mirrors the
 * 2026-05-30 Sanity state — translation-pass commit. Re-sync via
 * `Sanity/scripts/probe-en-availability.ts` if the live registry
 * diverges from this seed and you need to refresh the fallback.
 */
export const FALLBACK_REGISTRY: EnRegistry = fromWire({
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
});
