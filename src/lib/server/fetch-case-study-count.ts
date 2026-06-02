import "server-only";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { CASE_STUDIES_COUNT_QUERY } from "@/lib/server/sanity-queries";

/**
 * Published `caseStudy` count for nav + portfolio index.
 * Predicate matches `CASE_STUDIES_QUERY` / `fetchCaseStudies()` (not EN
 * `title.en` gating — same list as `/portfolio` and `/en/portfolio` heroes).
 */
export async function fetchCaseStudyCount(): Promise<number> {
  const count = await sanityFetch<number>({
    query: CASE_STUDIES_COUNT_QUERY,
    revalidate: 3600,
    tags: ["caseStudy"],
  }).catch(() => 0);
  return typeof count === "number" ? count : 0;
}
