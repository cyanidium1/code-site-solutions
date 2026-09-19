export type LeadValues = {
  name: string;
  contact: string;
  /** Package the visitor needs — PackageId from `@/constants/pricing` or "unknown". */
  tier: string;
  budget: string;
  /** "no" | "yes" — whether they already have a site. */
  hasSite: string;
  siteUrl: string;
  description: string;
  /** Calculator configuration text (package, add-ons, total, term). */
  config: string;
  /** Legacy fields still sent by older call sites. */
  business?: string;
  timeline?: string;
  /** Honeypot — stays empty for real users; the server drops filled submissions. */
  hp: string;
};

/**
 * Visitor attribution captured client-side and attached to every lead so the
 * owner can see where the person came from and what they looked at before
 * reaching out. Persisted in sessionStorage for the duration of the visit.
 */
export type LeadAttribution = {
  /** External referrer host the visitor first arrived from (empty = direct). */
  referrer?: string;
  /** First path the visitor landed on this session. */
  landingPage?: string;
  /** UTM tags from the landing URL, if any. */
  utm?: Record<string, string>;
  /** Ordered list of paths visited this session (deduped, capped). */
  journey?: string[];
  /** ISO timestamp of the first page view this session. */
  firstVisit?: string;
  /** Google Ads click id from the landing URL (latest one wins). */
  gclid?: string;
};
