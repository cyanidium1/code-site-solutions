import "server-only";
import { unstable_cache } from "next/cache";

import { SECONDARY_LOCALES } from "@/constants/locales";
import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  FALLBACK_REGISTRY,
  fromWire,
  toWire,
  type ContentRegistry,
  type ContentRegistryWire,
} from "@/lib/shared/i18n-registry-types";

// Re-export the shared shape + helpers for ergonomic server-side imports.
// Client modules should import them directly from
// `@/lib/shared/i18n-registry-types` instead of going through this file
// (which carries a `"server-only"` poison pill).
export {
  FALLBACK_REGISTRY,
  fromWire,
  toWire,
  type ContentRegistry,
  type ContentRegistryWire,
} from "@/lib/shared/i18n-registry-types";

// GROQ predicates MUST mirror the localized-content gate used by the actual
// secondary-locale pages. Keep these in sync with:
//   - `hasLocaleContent()` in components/industry-page/index.tsx
//   - `hasLocaleCaseContent()` in components/case-page/index.tsx
//   - the `notFound()` guard in app/(en)/en/blog/[slug]/page.tsx
// If the gate diverges from the predicate, the registry over-reports
// availability and we re-introduce the "enabled but 404s" failure mode.
const INDUSTRY_AVAILABLE_QUERY = /* groq */ `
*[_type == "industryPage" && status == "published" && defined(slug.current)
  && defined(title[$locale]) && title[$locale] != ""
].slug.current`;

const CASE_AVAILABLE_QUERY = /* groq */ `
*[_type == "caseStudy" && status == "published" && defined(slug.current)
  && defined(title[$locale]) && title[$locale] != ""
].slug.current`;

// Transitional (until the blog schema migration lands and the old En-suffix
// arms are removed): coalesce() reads both the legacy flat fields
// (slug/slugEn/titleEn/bodyEn) and the new localized objects
// (slugs.*/title.*/body.*). The legacy arms only ever match for $locale=="en".
const BLOG_PAIRS_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published"
  && defined(coalesce(slugs.uk.current, slug.current))
  && defined(coalesce(slugs[$locale].current, slugEn.current))
  && defined(coalesce(title[$locale], titleEn)) && coalesce(title[$locale], titleEn) != ""
  && count(coalesce(body[$locale], bodyEn)) > 0
]{
  "ua": coalesce(slugs.uk.current, slug.current),
  "loc": coalesce(slugs[$locale].current, slugEn.current)
}`;

/**
 * Cached fetcher that returns the WIRE format (plain arrays + tuples).
 * `unstable_cache` JSON-serializes its return value, which destroys
 * `Set`/`Map` shapes — so we cache the wire format and let callers
 * reconstruct via `fromWire` on the cheap. ~50 strings per locale;
 * reconstruction is microseconds and runs once per call site.
 *
 * One shared cache key across the build — every caller shares the same
 * fetch within the revalidate window. Tag "i18n-alternates" lets a
 * content-edit webhook invalidate this on demand
 * (`revalidateTag("i18n-alternates")` from a route handler).
 */
async function fetchRegistryWire(): Promise<ContentRegistryWire> {
  try {
    const out: ContentRegistryWire = {};
    for (const locale of SECONDARY_LOCALES) {
      const params = { locale };
      const [industries, cases, blogPairs] = await Promise.all([
        sanityFetch<string[]>({ query: INDUSTRY_AVAILABLE_QUERY, params, revalidate: 300, tags: ["i18n-alternates"] }),
        sanityFetch<string[]>({ query: CASE_AVAILABLE_QUERY, params, revalidate: 300, tags: ["i18n-alternates"] }),
        sanityFetch<Array<{ ua: string; loc: string }>>({ query: BLOG_PAIRS_QUERY, params, revalidate: 300, tags: ["i18n-alternates"] }),
      ]);
      out[locale] = {
        industries: industries ?? [],
        cases: cases ?? [],
        blogPairs: (blogPairs ?? []).map((p) => [p.ua, p.loc] as [string, string]),
      };
    }
    return out;
  } catch (err) {
    // unstable_cache revalidates in the background — must not throw or Next
    // logs "[Error: Unauthorized - Session not found]" on every revalidate.
    console.warn(
      "[i18n-registry] Sanity fetch failed; using FALLBACK_REGISTRY for cache entry.",
      err,
    );
    return toWire(FALLBACK_REGISTRY);
  }
}

const getContentRegistryWire = unstable_cache(
  fetchRegistryWire,
  ["i18n-content-registry"],
  { revalidate: 300, tags: ["i18n-alternates"] },
);

/** Server-side getter returning the Set/Map shape consumers expect. */
export async function getContentRegistry(): Promise<ContentRegistry> {
  return fromWire(await getContentRegistryWire());
}

/**
 * Wraps `getContentRegistry` so a Sanity outage at build/runtime doesn't
 * fail the render — we fall back to `FALLBACK_REGISTRY` and emit a
 * one-line server log so the outage is visible in CI / Vercel logs.
 */
export async function getContentRegistrySafe(): Promise<ContentRegistry> {
  try {
    return await getContentRegistry();
  } catch (err) {
    console.warn("[i18n-registry] Sanity fetch failed; using FALLBACK_REGISTRY.", err);
    return FALLBACK_REGISTRY;
  }
}
