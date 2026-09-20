import type { Metadata } from "next";

import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, webPageNode } from "@/lib/shared/jsonld";
import { plainRich } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import type { MoneyPageContent } from "@/types/money-page";
import { CORE_PACKAGES, PACKAGES, packagePrice } from "@/constants/pricing";
import { LOCALE_CURRENCY } from "@/lib/shared/format-price";
import { LOCALE_CONFIG, type Locale } from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";

/**
 * Shared metadata + JSON-LD builder for the city pages
 * (`/rozrobka-saitiv-{lviv,kyiv,odesa,dnipro,kharkiv}` and their `/ru` twins).
 *
 * The pages themselves are deliberately NOT generated from a template — each
 * one is hand-written around the cases we actually delivered in that city, per
 * the rule we published in `/blog/lokalni-storinky-chy-dorveii`. Only the
 * plumbing is shared, because the plumbing carries no content.
 *
 * Schema note: the service node uses `areaServed: City`, never `LocalBusiness`.
 * We have no physical address in any of these cities, and `LocalBusiness`
 * asserts one. This is the same rule we sell to clients on `/lokalne-seo`
 * ("LocalBusiness там, де є фізична адреса; Service — там, де тільки
 * доставка. Плутати їх не можна"), so breaking it here would be both a false
 * signal to Google and a contradiction of our own advice.
 */
type CityLocale = "uk" | "ru";

type CityPageParams = {
  content: MoneyPageContent;
  /** Ukrainian-rooted path, e.g. `/rozrobka-saitiv-lviv`. */
  uaPath: string;
  locale: CityLocale;
  /** City name in the page locale, e.g. "Львів" / "Львов". */
  cityName: string;
  /** Localized label for the parent service page in the breadcrumb trail. */
  parentLabel: string;
  /** Localized `Service.name`, e.g. "Розробка сайтів у Львові". */
  serviceName: string;
};

/**
 * One `Offer` per core package (landing / business / shop), prices from the
 * pricing config — the same fixed prices the cards show. Shared with
 * `/rozrobka-saitiv`.
 */
export function packageOffers(locale: Locale, url: string) {
  return CORE_PACKAGES.map((id) => ({
    "@type": "Offer",
    name: PACKAGES[id].name[locale],
    price: packagePrice(id, locale),
    priceCurrency: LOCALE_CURRENCY[locale],
    url,
  }));
}

/** Absolute path as served, i.e. `/ru`-prefixed for the RU locale. */
export function cityPath(uaPath: string, locale: CityLocale): string {
  return localizePath(uaPath, locale);
}

export function buildCityMetadata({
  content,
  uaPath,
  locale,
}: Pick<CityPageParams, "content" | "uaPath" | "locale">): Metadata {
  const url = pageUrl(cityPath(uaPath, locale));
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: buildAlternates({ locale, uaPath }),
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: "website",
      locale: LOCALE_CONFIG[locale].ogLocale,
      url,
      images: [OG_DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [OG_DEFAULT_IMAGE.url],
    },
  };
}

export function buildCityJsonLd({
  content,
  uaPath,
  locale,
  cityName,
  parentLabel,
  serviceName,
}: CityPageParams) {
  const path = cityPath(uaPath, locale);
  const url = pageUrl(path);
  const parentPath = localizePath("/rozrobka-saitiv", locale);

  return buildJsonLd([
    webPageNode({
      path,
      locale,
      title: content.metaTitle,
      description: content.metaDescription,
    }),
    breadcrumbNode([
      { name: content.breadcrumbHome, path: localizePath("/", locale) },
      { name: parentLabel, path: parentPath },
      { name: content.breadcrumbSelf, path },
    ]),
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: serviceName,
      description: content.metaDescription,
      provider: { "@id": ORG_ID },
      // City, not LocalBusiness — see the note at the top of this file.
      areaServed: { "@type": "City", name: cityName },
      offers: packageOffers(locale, url),
    },
    {
      "@type": "FAQPage",
      mainEntity: content.faq.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
      })),
    },
  ]);
}
