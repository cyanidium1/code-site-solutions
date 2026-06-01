export type LeadValues = {
  name: string;
  contact: string;
  business: string;
  tier: string;
  description: string;
  budget: string;
  timeline: string;
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
};
