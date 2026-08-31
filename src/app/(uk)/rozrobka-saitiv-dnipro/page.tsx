import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildCityJsonLd, buildCityMetadata } from "@/lib/shared/city-page";
import { CITY_DNIPRO_UK as CONTENT } from "@/content/uk/cities/dnipro";

const UA_PATH = "/rozrobka-saitiv-dnipro";

export const metadata: Metadata = buildCityMetadata({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
});

const jsonLd = buildCityJsonLd({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
  cityName: "Дніпро",
  parentLabel: "Розробка сайтів",
  serviceName: "Розробка сайтів у Дніпрі",
});

export default function CityDniproPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="uk" content={CONTENT} source="city-page-dnipro" />
      <HpFooter />
    </>
  );
}
