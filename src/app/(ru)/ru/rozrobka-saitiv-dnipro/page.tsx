import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildCityJsonLd, buildCityMetadata } from "@/lib/shared/city-page";
import { CITY_DNIPRO_RU as CONTENT } from "@/content/ru/cities/dnipro";

const UA_PATH = "/rozrobka-saitiv-dnipro";

export const metadata: Metadata = buildCityMetadata({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "ru",
});

const jsonLd = buildCityJsonLd({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "ru",
  cityName: "Днепр",
  parentLabel: "Разработка сайтов",
  serviceName: "Разработка сайтов в Днепре",
});

export default function CityDniproRuPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="ru" content={CONTENT} source="city-page-dnipro-ru" />
      <HpFooter />
    </>
  );
}
