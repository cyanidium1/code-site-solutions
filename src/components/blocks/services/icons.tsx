function IcCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcDoctors() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 18c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcPrice() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcServices() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IcShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
export function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Default medicine-feature icons in the order used by `DEFAULT_FEATURES`.
 *  Re-exported so the CMS-driven `[slug]` page can reuse them by index — the
 *  industryPage schema doesn't carry an icon field. */
export const MEDICINE_FEATURE_ICONS: React.ReactNode[] = [
  <IcCalendar key="cal" />,
  <IcDoctors key="doc" />,
  <IcPrice key="price" />,
  <IcServices key="svc" />,
  <IcShield key="shield" />,
  <IcPin key="pin" />,
];

/**
 * Per-industry feature-icon sets. The 6 SVG primitives in this file are
 * intentionally generic (calendar, people, price-card, services-grid,
 * shield, pin) — they read as the right metaphor for medicine/renovation/
 * legal/etc. without being literal. Where a domain needs a *different*
 * 6-tuple we override below; otherwise it falls back to medicine.
 *
 * Slugs match the SERVICE_NAV_LINKS keys in `header-services.ts` and the
 * Sanity industry-page slug field. Add more rows as new industries ship.
 */
const INDUSTRY_FEATURE_ICONS: Record<string, React.ReactNode[]> = {
  medicine: MEDICINE_FEATURE_ICONS,
  // Renovation/Construction: visit booking, team, transparent estimate,
  // services catalog, warranty, location.  Reuses the same primitives —
  // they're already domain-neutral. Substitute domain-specific icons here
  // when commission-shooting them.
  renovation: MEDICINE_FEATURE_ICONS,
  legal: MEDICINE_FEATURE_ICONS,
  accounting: MEDICINE_FEATURE_ICONS,
  ecommerce: MEDICINE_FEATURE_ICONS,
  saas: MEDICINE_FEATURE_ICONS,
  cosmetology: MEDICINE_FEATURE_ICONS,
  education: MEDICINE_FEATURE_ICONS,
};

/** Returns the icon set for a given industry slug, with medicine fallback. */
export function featureIconsForIndustry(slug?: string): React.ReactNode[] {
  if (slug && INDUSTRY_FEATURE_ICONS[slug]) return INDUSTRY_FEATURE_ICONS[slug];
  return MEDICINE_FEATURE_ICONS;
}
