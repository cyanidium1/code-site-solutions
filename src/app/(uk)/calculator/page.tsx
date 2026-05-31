import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { WebsiteCalculator } from "@/components/calculator";
import { fetchCalculatorConfig } from "@/lib/server/fetch-calculator-config";

const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Calculator.meta");
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/calculator",
      languages: {
        uk: "/calculator",
        en: "/en/calculator",
        "x-default": "/calculator",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: "uk_UA",
      url: "/calculator",
    },
  };
}

export default async function CalculatorPage() {
  const [t, config] = await Promise.all([
    getTranslations("Calculator"),
    fetchCalculatorConfig("uk"),
  ]);
  const stats: { value: string; label: string }[] = ["projects", "range", "weeks", "warranty"].map((k) => ({
    value: t(`stats.${k}.value` as never),
    label: t(`stats.${k}.label` as never),
  }));
  return (
    <>
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: t("pageHero.breadcrumbHome"), href: "/" },
          { label: t("pageHero.breadcrumbSelf") },
        ]}
        eyebrow={t("pageHero.eyebrow")}
        headline={t.rich("pageHero.title", { em: emChunk })}
        sub={t("pageHero.sub")}
      />

      <StatsBar items={stats} />

      <WebsiteCalculator config={config} />
      <HpFooter />
    </>
  );
}
