import type { Metadata } from "next";
import ruMessages from "../../../../../messages/ru.json";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { WebsiteCalculator } from "@/components/calculator";
import { fetchCalculatorConfig } from "@/lib/server/fetch-calculator-config";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/shared/alternates";
import { OG_DEFAULT_IMAGE } from "@/constants/site";

const T = ruMessages.Calculator;

function richTitle(value: string): React.ReactNode {
  // Same as the EN route: this page reads the JSON directly (no next-intl
  // server context), so it parses the static `<em>…</em>` tags by hand.
  const parts = value.split(/(<em>.*?<\/em>)/g).filter(Boolean);
  return parts.map((part, i) => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    return m ? <em key={i}>{m[1]}</em> : <span key={i}>{part}</span>;
  });
}

export const metadata: Metadata = {
  title: T.meta.title,
  description: T.meta.description,
  alternates: buildAlternates({ locale: "ru", uaPath: "/calculator" }),
  openGraph: {
    title: T.meta.title,
    description: T.meta.description,
    type: "website",
    locale: "ru_UA",
    url: "/ru/calculator",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: T.meta.title,
    description: T.meta.description,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

const stats = [
  { value: T.stats.projects.value, label: T.stats.projects.label },
  { value: T.stats.range.value, label: T.stats.range.label },
  { value: T.stats.weeks.value, label: T.stats.weeks.label },
  { value: T.stats.warranty.value, label: T.stats.warranty.label },
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/ru/calculator",
    locale: "ru",
    title: T.meta.title,
    description: T.meta.description,
  }),
  breadcrumbNode([
    { name: T.pageHero.breadcrumbHome, path: "/ru" },
    { name: T.pageHero.breadcrumbSelf, path: "/ru/calculator" },
  ]),
]);

export default async function CalculatorPageRu() {
  const config = await fetchCalculatorConfig("ru");
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: T.pageHero.breadcrumbHome, href: "/ru" },
          { label: T.pageHero.breadcrumbSelf },
        ]}
        eyebrow={T.pageHero.eyebrow}
        headline={richTitle(T.pageHero.title)}
        sub={T.pageHero.sub}
      />

      <StatsBar items={stats} />

      <WebsiteCalculator config={config} />
      <HpFooter />
    </>
  );
}
