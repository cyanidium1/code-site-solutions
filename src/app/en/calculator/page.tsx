import type { Metadata } from "next";
import enMessages from "../../../../messages/en.json";

import { HpFooter, HpHeader } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { WebsiteCalculator } from "@/components/calculator";

const T = enMessages.Calculator;

function richTitle(value: string): React.ReactNode {
  // The /en/calculator page reads the JSON directly (no next-intl server
  // context), so it parses the static `<em>…</em>` tags out of the message
  // string by hand. The client-side calculator uses next-intl `t.rich`.
  const parts = value.split(/(<em>.*?<\/em>)/g).filter(Boolean);
  return parts.map((part, i) => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    return m ? <em key={i}>{m[1]}</em> : <span key={i}>{part}</span>;
  });
}

export const metadata: Metadata = {
  title: T.meta.title,
  description: T.meta.description,
  alternates: {
    canonical: "/en/calculator",
    languages: {
      uk: "/calculator",
      en: "/en/calculator",
      "x-default": "/calculator",
    },
  },
  openGraph: {
    title: T.meta.title,
    description: T.meta.description,
    type: "website",
    locale: "en_US",
    url: "/en/calculator",
  },
};

const stats = [
  { value: T.stats.projects.value, label: T.stats.projects.label },
  { value: T.stats.range.value, label: T.stats.range.label },
  { value: T.stats.weeks.value, label: T.stats.weeks.label },
  { value: T.stats.warranty.value, label: T.stats.warranty.label },
];

export default function CalculatorPageEn() {
  return (
    <>
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: T.pageHero.breadcrumbHome, href: "/en" },
          { label: T.pageHero.breadcrumbSelf },
        ]}
        eyebrow={T.pageHero.eyebrow}
        headline={richTitle(T.pageHero.title)}
        sub={T.pageHero.sub}
      />

      <StatsBar items={stats} />

      <WebsiteCalculator />
      <HpFooter />
    </>
  );
}
