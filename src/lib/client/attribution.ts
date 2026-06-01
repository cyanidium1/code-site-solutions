import type { LeadAttribution } from "@/types/lead";

const KEY = "cs_attribution";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;
const MAX_JOURNEY = 25;

function safeParse(raw: string | null): LeadAttribution | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LeadAttribution;
  } catch {
    return null;
  }
}

function readReferrer(): string {
  if (typeof document === "undefined" || !document.referrer) return "";
  try {
    const url = new URL(document.referrer);
    // Drop our own host so internal navigations don't read as referrals.
    if (url.host === window.location.host) return "";
    return url.host;
  } catch {
    return "";
  }
}

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

/**
 * Records the current page view into the session-scoped attribution record,
 * seeding referrer/UTM/landing on the first call. Safe to call on every route
 * change. No-op on the server.
 */
export function recordPageView(path: string): void {
  if (typeof window === "undefined") return;
  const existing = safeParse(window.sessionStorage.getItem(KEY));

  if (!existing) {
    const seed: LeadAttribution = {
      referrer: readReferrer(),
      landingPage: path,
      utm: readUtm(),
      journey: [path],
      firstVisit: new Date().toISOString(),
    };
    window.sessionStorage.setItem(KEY, JSON.stringify(seed));
    return;
  }

  const journey = existing.journey ?? [];
  // Skip consecutive duplicates (e.g. shallow query-only changes).
  if (journey[journey.length - 1] !== path) {
    journey.push(path);
  }
  existing.journey = journey.slice(-MAX_JOURNEY);
  window.sessionStorage.setItem(KEY, JSON.stringify(existing));
}

/**
 * Returns the attribution record captured so far this session, or `undefined`
 * if nothing has been recorded yet (or running on the server).
 */
export function getAttribution(): LeadAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  return safeParse(window.sessionStorage.getItem(KEY)) ?? undefined;
}
