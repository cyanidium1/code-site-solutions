import "server-only";

// Import from the data layer, NOT the "@/components/case-page" barrel: the
// barrel pulls the whole case-page component tree (and its route-scoped CSS)
// into the homepage's module graph.
import { fetchCaseStudies } from "@/components/case-page/data";
import { sanityFetch } from "@/lib/server/sanity-fetch";
import { HOMEPAGE_CASES_QUERY } from "@/lib/server/sanity-queries";
import type {
  CaseStudyRef,
  HomepageCasesData,
  HomepageCasesQueryResult,
} from "@/types/sanity";

const EMPTY: HomepageCasesData = {
  default: [],
  legal: [],
  medicine: [],
  "real-estate": [],
};

/**
 * Drops nulls produced by GROQ dereferencing an unpublished/deleted
 * case-study reference. Returns up to 4 entries: three are shown on phones
 * and desktops, and the 4th only while the grid is two columns wide — a
 * tablet in portrait, where three cards leave a lone card in the second row
 * (owner, 2026-09-18). See `CardGrid` in homepage/cases-grid-and-filters.
 */
function normalize(list: CaseStudyRef[] | null | undefined): CaseStudyRef[] {
  if (!list) return [];
  return list.filter((c): c is CaseStudyRef => Boolean(c && c.slug)).slice(0, 4);
}

/**
 * Fetches the `homepageCases` singleton and shapes it into the four arrays
 * the homepage Cases section consumes. When `default` is empty (or the
 * singleton hasn't been published yet), falls back to the top 3 from
 * `fetchCaseStudies()` so the section keeps its current pre-curation
 * appearance.
 *
 * Cache tags: `["homepageCases", "caseStudy"]` so revalidating either a
 * case-study or the singleton refreshes this fetch.
 */
export async function fetchHomepageCases(): Promise<HomepageCasesData> {
  const raw = await sanityFetch<HomepageCasesQueryResult>({
    query: HOMEPAGE_CASES_QUERY,
    revalidate: 3600,
    tags: ["homepageCases", "caseStudy"],
  }).catch(() => null);

  const legal = normalize(raw?.legal);
  const medicine = normalize(raw?.medicine);
  const realEstate = normalize(raw?.realEstate);
  const def = normalize(raw?.default);

  const fallbackDefault =
    def.length === 0 ? (await fetchCaseStudies()).slice(0, 4) : def;

  return {
    ...EMPTY,
    default: fallbackDefault,
    legal,
    medicine,
    "real-estate": realEstate,
  };
}
