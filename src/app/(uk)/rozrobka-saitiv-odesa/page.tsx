import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildCityJsonLd, buildCityMetadata } from "@/lib/shared/city-page";
import { CITY_ODESA_UK as CONTENT } from "@/content/uk/cities/odesa";

const UA_PATH = "/rozrobka-saitiv-odesa";

export const metadata: Metadata = buildCityMetadata({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
});

const jsonLd = buildCityJsonLd({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
  cityName: "Одеса",
  parentLabel: "Розробка сайтів",
  serviceName: "Розробка сайтів в Одесі",
});

export default function CityOdesaPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="uk" content={CONTENT} source="city-page-odesa" />
      <HpFooter />
    </>
  );
}
