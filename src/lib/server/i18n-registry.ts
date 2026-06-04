import "server-only";
import { unstable_cache } from "next/cache";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  FALLBACK_REGISTRY,
  fromWire,
  toWire,
  type EnRegistry,
  type EnRegistryWire,
} from "@/lib/shared/i18n-registry-types";

// Re-export the shared shape + helpers for ergonomic server-side imports.
// Client modules should import them directly from
// `@/lib/shared/i18n-registry-types` instead of going through this file
// (which carries a `"server-only"` poison pill).
export {
  FALLBACK_REGISTRY,
  fromWire,
  toWire,
  type EnRegistry,
  type EnRegistryWire,
} from "@/lib/shared/i18n-registry-types";

// GROQ predicates MUST mirror the EN content gate used by the actual
// /en/<...> pages. Keep these in sync with:
//   - `hasEnglishContent()` in components/industry-page/index.tsx
//   - `hasEnglishCaseContent()` in components/case-page/index.tsx
//   - the `notFound()` guard in app/(en)/en/blog/[slug]/page.tsx
// If the gate diverges from the predicate, the registry over-reports
// availability and we re-introduce the "enabled but 404s" failure mode.
const INDUSTRY_EN_AVAILABLE_QUERY = /* groq */ `
*[_type == "industryPage" && status == "published" && defined(slug.current)
  && defined(title.en) && title.en != ""
].slug.current`;

const CASE_EN_AVAILABLE_QUERY = /* groq */ `
*[_type == "caseStudy" && status == "published" && defined(slug.current)
  && defined(title.en) && title.en != ""
].slug.current`;

const BLOG_EN_PAIRS_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && defined(slug.current)
  && defined(slugEn.current) && defined(titleEn) && titleEn != ""
  && defined(bodyEn) && count(bodyEn) > 0
]{ "ua": slug.current, "en": slugEn.current }`;

/**
 * Cached fetcher that returns the WIRE format (plain arrays + tuples).
 * `unstable_cache` JSON-serializes its return value, which destroys
 * `Set`/`Map` shapes — so we cache the wire format and let callers
 * reconstruct via `fromWire` on the cheap. ~50 strings; reconstruction
 * is microseconds and runs once per call site.
 *
 * One shared cache key across the build — every caller shares the same
 * fetch within the revalidate window. Tag "i18n-alternates" lets a
 * content-edit webhook invalidate this on demand
 * (`revalidateTag("i18n-alternates")` from a route handler).
 */
async function fetchRegistryWire(): Promise<EnRegistryWire> {
  try {
    const [industries, cases, blogPairs] = await Promise.all([
      sanityFetch<string[]>({ query: INDUSTRY_EN_AVAILABLE_QUERY, revalidate: 300, tags: ["i18n-alternates"] }),
      sanityFetch<string[]>({ query: CASE_EN_AVAILABLE_QUERY, revalidate: 300, tags: ["i18n-alternates"] }),
      sanityFetch<Array<{ ua: string; en: string }>>({ query: BLOG_EN_PAIRS_QUERY, revalidate: 300, tags: ["i18n-alternates"] }),
    ]);
    return {
      industries: industries ?? [],
      cases: cases ?? [],
      blogPairs: (blogPairs ?? []).map((p) => [p.ua, p.en] as [string, string]),
    };
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

const getEnRegistryWire = unstable_cache(
  fetchRegistryWire,
  ["i18n-en-registry"],
  { revalidate: 300, tags: ["i18n-alternates"] },
);

/** Server-side getter returning the Set/Map shape consumers expect. */
export async function getEnRegistry(): Promise<EnRegistry> {
  return fromWire(await getEnRegistryWire());
}

/**
 * Wraps `getEnRegistry` so a Sanity outage at build/runtime doesn't
 * fail the render — we fall back to `FALLBACK_REGISTRY` and emit a
 * one-line server log so the outage is visible in CI / Vercel logs.
 */
export async function getEnRegistrySafe(): Promise<EnRegistry> {
  try {
    return await getEnRegistry();
  } catch (err) {
    console.warn("[i18n-registry] Sanity fetch failed; using FALLBACK_REGISTRY.", err);
    return FALLBACK_REGISTRY;
  }
}
