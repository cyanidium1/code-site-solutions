import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildCityJsonLd, buildCityMetadata } from "@/lib/shared/city-page";
import { CITY_LVIV_RU as CONTENT } from "@/content/ru/cities/lviv";

const UA_PATH = "/rozrobka-saitiv-lviv";

export const metadata: Metadata = buildCityMetadata({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "ru",
});

const jsonLd = buildCityJsonLd({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "ru",
  cityName: "Львов",
  parentLabel: "Разработка сайтов",
  serviceName: "Разработка сайтов во Львове",
});

export default function CityLvivRuPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="ru" content={CONTENT} source="city-page-lviv-ru" />
      <HpFooter />
    </>
  );
}
