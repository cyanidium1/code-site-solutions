/**
 * Prices and terms for the uk-only medicine subpages
 * (/sites-for/medicine/{stomatolohiia,medychnyi-tsentr,dyzain,verstka,seo}).
 * Everything reads from the pricing config — copy interpolates these, it
 * never types a figure.
 *
 *  - private practice (1–2 chairs)   → «Сайт для бізнесу» package
 *  - clinic / medical centre         → the medicine industry package
 *  - multi-branch, insurance, CRM    → Custom
 */

import {
  packagePrice,
  formatPackagePrice,
  formatPackageTerm,
  industryPrice,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

const L = "uk" as const;

export const MED_OFFER_UK = {
  /** "$1 800" — the clinic package. */
  price: formatPrice(industryPrice("medicine", L), { locale: L }),
  priceNum: industryPrice("medicine", L),
  /** "14–21 робочий день". */
  term: formatPackageTerm("industry", L),
  /** "$1 000" — a single practitioner's site = the business package. */
  practice: formatPackagePrice("business", L),
  practiceNum: packagePrice("business", L),
  practiceTerm: formatPackageTerm("business", L),
  /** "від $4 000" — networks, insurance programmes, CRM builds. */
  custom: formatPackagePrice("custom", L),
  customTerm: formatPackageTerm("custom", L),
  /** "від $…" — monthly SEO retainer floor. */
  seoFrom: formatPrice(servicePrice("seoServicesFrom", L), { locale: L, withPrefix: true }),
  seoFromNum: servicePrice("seoServicesFrom", L),
  /** "$60" — hosting after the first (included) year. */
  hosting: formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L }),
} as const;
