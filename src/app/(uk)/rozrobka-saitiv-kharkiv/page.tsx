import type { Metadata } from "next";

import { MoneyPageView } from "@/components/money-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildCityJsonLd, buildCityMetadata } from "@/lib/shared/city-page";
import { CITY_KHARKIV_UK as CONTENT } from "@/content/uk/cities/kharkiv";

const UA_PATH = "/rozrobka-saitiv-kharkiv";

export const metadata: Metadata = buildCityMetadata({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
});

const jsonLd = buildCityJsonLd({
  content: CONTENT,
  uaPath: UA_PATH,
  locale: "uk",
  cityName: "Харків",
  parentLabel: "Розробка сайтів",
  serviceName: "Розробка сайтів у Харкові",
});

export default function CityKharkivPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <MoneyPageView locale="uk" content={CONTENT} source="city-page-kharkiv" />
      <HpFooter />
    </>
  );
}
