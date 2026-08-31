import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

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

const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Calculator.meta");
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates({ locale: "uk", uaPath: "/calculator" }),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: "uk_UA",
      url: "/calculator",
      images: [OG_DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [OG_DEFAULT_IMAGE.url],
    },
  };
}

export default async function CalculatorPage() {
  const [t, tMeta, config] = await Promise.all([
    getTranslations("Calculator"),
    getTranslations("Calculator.meta"),
    fetchCalculatorConfig("uk"),
  ]);
  const stats: { value: string; label: string }[] = ["projects", "range", "weeks", "warranty"].map((k) => ({
    value: t(`stats.${k}.value` as never),
    label: t(`stats.${k}.label` as never),
  }));
  const jsonLd = buildJsonLd([
    webPageNode({
      path: "/calculator",
      locale: "uk",
      title: tMeta("title"),
      description: tMeta("description"),
    }),
    breadcrumbNode([
      { name: t("pageHero.breadcrumbHome"), path: "/" },
      { name: t("pageHero.breadcrumbSelf"), path: "/calculator" },
    ]),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
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

      {/*
        GSC, 3 міс: калькулятор зібрав 2 313 показів, з них 1 061 — на цінових
        запитах на кшталт «створити сайт ціна», і стоїть по них на 62-й позиції.
        Причина в тому, що в HTML калькулятора немає жодної ціни, доки людина
        нічого не обрала, — відповісти на «скільки коштує» він не може. Частині
        відвідувачів потрібен не інструмент, а прайс; посилання відповідає і їм,
        і Google, який має бачити, що сторінка цін на сайті інша.
      */}
      <div className="px-6 sm:px-8 lg:px-12">
        <p className="mx-auto max-w-container-narrow text-center font-sans text-[14.5px] leading-[1.6] text-ink-dim">
          Потрібні готові цифри без розрахунку?{" "}
          <Link href="/pricing" className="text-ink underline underline-offset-[3px]">
            Дивіться прайс із фіксованими пакетами
          </Link>
           — лендінг від $800, корпоративний сайт від $2 500.
        </p>
      </div>


      <WebsiteCalculator config={config} />
      <HpFooter />
    </>
  );
}
