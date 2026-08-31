import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildCityJsonLd, buildCityMetadata } from "@/lib/shared/city-page";
import { CITY_KYIV_RU as CONTENT } from "@/content/ru/cities/kyiv";

const UA_PATH = "/rozrobka-saitiv-kyiv";

export const metadata: Metadata = buildCityMetadata({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "ru",
});

const jsonLd = buildCityJsonLd({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "ru",
  cityName: "Киев",
  parentLabel: "Разработка сайтов",
  serviceName: "Разработка сайтов в Киеве",
});

export default function CityKyivRuPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="ru" content={CONTENT} source="city-page-kyiv-ru" />
      <HpFooter />
    </>
  );
}
