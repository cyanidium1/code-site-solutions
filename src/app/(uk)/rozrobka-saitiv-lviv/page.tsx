import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildCityJsonLd, buildCityMetadata } from "@/lib/shared/city-page";
import { CITY_LVIV_UK as CONTENT } from "@/content/uk/cities/lviv";

const UA_PATH = "/rozrobka-saitiv-lviv";

export const metadata: Metadata = buildCityMetadata({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
});

const jsonLd = buildCityJsonLd({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
  cityName: "Львів",
  parentLabel: "Розробка сайтів",
  serviceName: "Розробка сайтів у Львові",
});

export default function CityLvivPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="uk" content={CONTENT} source="city-page-lviv" />
      <HpFooter />
    </>
  );
}
