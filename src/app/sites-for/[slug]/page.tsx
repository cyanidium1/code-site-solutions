import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HpHeader } from "@/components/homepage/hp-header";
import "@/components/homepage/homepage.css";
import { HeroEditorial } from "@/components/blocks/hero";
import { ImageText } from "@/components/blocks/image-text";
import { Reasons } from "@/components/blocks/reasons";
import {
  Services,
  MEDICINE_FEATURE_ICONS,
} from "@/components/blocks/services";
import { Comparison } from "@/components/blocks/comparison";
import { StatsBar } from "@/components/blocks/stats-bar";
import { Case } from "@/components/blocks/case";
import {
  Outcome,
  MockPages,
  MockBookingForm,
  MockAdmin,
} from "@/components/blocks/outcome";
import { FAQ, Audit, ClinicFooter } from "@/components/blocks/final";

import { sanityFetch } from "@/lib/sanity/fetch";
import { INDUSTRY_PAGE_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import type {
  ComparisonSection,
  FaqSection,
  IndustryPageDoc,
  IndustrySection,
  OutcomeSection,
} from "@/lib/sanity/types";
import { loc } from "@/lib/sanity/locale";
import {
  PortableText,
  PortableInline,
  plainPortable,
  formatLine,
} from "@/lib/sanity/portable";
import { SanityImg } from "@/lib/sanity/image";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";

const LOCALE = "uk" as const;

function findSection<T extends IndustrySection>(
  sections: IndustrySection[] | undefined,
  type: T["_type"],
): T | undefined {
  return sections?.find((s): s is T => s._type === type);
}

function buildIndustryJsonLd(
  doc: IndustryPageDoc,
): Record<string, unknown> {
  const url = pageUrl(`/sites-for/${doc.slug}`);
  const title = loc(doc.title, LOCALE);
  const description = loc(doc.seo?.description, LOCALE) || undefined;

  const comparison = findSection<ComparisonSection>(
    doc.sections,
    "comparisonBlock",
  );
  const faq = findSection<FaqSection>(doc.sections, "faqBlock");

  const offers =
    comparison?.tiers?.map((t) => {
      const priceStr = loc(t.price, LOCALE);
      // First contiguous run of digits = numeric price (strips "$", "від", spaces)
      const priceMatch = priceStr.match(/(\d[\d\s]*\d|\d)/);
      const priceNumeric = priceMatch ? priceMatch[0].replace(/\s/g, "") : "";
      return {
        "@type": "Offer",
        name: loc(t.title, LOCALE).replace(/\n/g, " "),
        description:
          (t.includes ?? [])
            .slice(0, 3)
            .map((it) => loc(it, LOCALE).replace(/\*/g, ""))
            .join(" · ") || undefined,
        price: priceNumeric || undefined,
        priceCurrency: "USD",
        url,
      };
    }) ?? [];

  const graph: Record<string, unknown>[] = [];

  if (offers.length) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: title,
      description,
      provider: { "@id": ORG_ID },
      areaServed: ["UA", "EU", "US", "DK"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: title,
        itemListElement: offers,
      },
    });
  }

  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: SITE_ORIGIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: url,
      },
    ],
  });

  if (faq?.items?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.items.map((it) => ({
        "@type": "Question",
        name: loc(it.question, LOCALE),
        acceptedAnswer: {
          "@type": "Answer",
          text: plainPortable(it.answer),
        },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function buildOutcomeMock(row: NonNullable<OutcomeSection["benefitRows"]>[number]) {
  const url = row.mockUrl ?? "";
  if (row.mockType === "booking") return <MockBookingForm url={url} />;
  if (row.mockType === "admin") return <MockAdmin url={url} />;
  // Default to "pages"
  const tags = row.mockTags?.map((t) => loc(t, LOCALE)) ?? [];
  return <MockPages url={url} tags={tags} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await sanityFetch<IndustryPageDoc | null>({
    query: INDUSTRY_PAGE_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 3600,
  });
  if (!page) return {};

  const title = loc(page.seo?.title, LOCALE) || loc(page.title, LOCALE);
  const description = loc(page.seo?.description, LOCALE);

  return {
    title,
    description,
    alternates: { canonical: `/sites-for/${slug}` },
    openGraph: {
      title,
      description,
      url: `/sites-for/${slug}`,
      type: "website",
    },
  };
}

function SectionBlock({ section }: { section: IndustrySection }) {
  switch (section._type) {
    case "imageTextBlock":
      return (
        <ImageText
          variant={section.variant ?? "side"}
          imageVariant={section.imageVariant ?? "imageRight"}
          eyebrow={loc(section.eyebrow, LOCALE) || undefined}
          heading={formatLine(loc(section.heading, LOCALE)) ?? ""}
          body={<PortableInline value={section.body} />}
          bulletList={section.bulletList?.map((b) => loc(b, LOCALE))}
          image={
            section.image?.asset ? (
              <SanityImg
                image={section.image}
                alt={loc(section.heading, LOCALE)}
                fill
                className="object-cover"
              />
            ) : null
          }
          cta={
            section.cta?.label
              ? {
                  label: loc(section.cta.label, LOCALE),
                  href: section.cta.href ?? "#",
                }
              : undefined
          }
        />
      );

    case "statsBlock":
      return (
        <StatsBar
          items={
            section.items?.map((m) => ({
              value: m.value ?? "",
              label: loc(m.label, LOCALE),
            })) ?? []
          }
        />
      );

    case "reasonsBlock":
      return (
        <Reasons
          eyebrow={loc(section.eyebrow, LOCALE) || undefined}
          eyebrowNum={loc(section.eyebrowNum, LOCALE) || undefined}
          heading={formatLine(loc(section.heading, LOCALE)) || undefined}
          metaRows={section.metaRows?.map((m) => loc(m, LOCALE))}
          items={section.reasons?.map((r) => ({
            n: r.number ?? "",
            tag: loc(r.tag, LOCALE),
            title: formatLine(loc(r.title, LOCALE)),
            body: <PortableInline value={r.text} />,
            stat: {
              n: r.stat?.value ?? "",
              lbl: loc(r.stat?.label, LOCALE),
              src: loc(r.stat?.source, LOCALE),
            },
          }))}
          footText={
            formatLine(loc(section.footText, LOCALE)) || undefined
          }
          footCtaLabel={loc(section.footCtaLabel, LOCALE) || undefined}
        />
      );

    case "caseBlock":
      return (
        <Case
          eyebrow={loc(section.eyebrow, LOCALE) || undefined}
          eyebrowEm={loc(section.eyebrowEm, LOCALE) || undefined}
          heading={formatLine(loc(section.heading, LOCALE)) || undefined}
          lede={formatLine(loc(section.lede, LOCALE)) || undefined}
          meta={section.meta?.map((m) => ({
            strong: loc(m.strong, LOCALE),
            text: loc(m.text, LOCALE),
          }))}
          beforeNum={section.before?.num}
          beforeShotSrc={section.before?.image?.asset?.url}
          beforeShotUrl={section.before?.url}
          beforeShotAlt={loc(section.before?.alt, LOCALE)}
          beforeTagline={loc(section.before?.tagline, LOCALE)}
          beforeList={section.before?.items?.map((it) =>
            formatLine(loc(it, LOCALE)),
          )}
          beforeFoot={formatLine(loc(section.before?.foot, LOCALE)) || undefined}
          afterNum={section.after?.num}
          afterShotSrc={section.after?.image?.asset?.url}
          afterShotUrl={section.after?.url}
          afterShotAlt={loc(section.after?.alt, LOCALE)}
          afterTagline={loc(section.after?.tagline, LOCALE)}
          afterList={section.after?.items?.map((it) =>
            formatLine(loc(it, LOCALE)),
          )}
          afterFoot={formatLine(loc(section.after?.foot, LOCALE)) || undefined}
          results={section.results?.map((r) => ({
            n: r.value ?? "",
            lbl: loc(r.label, LOCALE),
            tag: loc(r.tag, LOCALE),
          }))}
          ctaText={formatLine(loc(section.ctaText, LOCALE)) || undefined}
          ctaLabel={loc(section.ctaLabel, LOCALE) || undefined}
        />
      );

    case "outcomeBlock":
      return (
        <Outcome
          recapEyebrow={loc(section.recap?.eyebrow, LOCALE)}
          recapText={formatLine(loc(section.recap?.text, LOCALE))}
          directionsEyebrow={loc(section.directions?.eyebrow, LOCALE)}
          directionsTitle={formatLine(
            loc(section.directions?.title, LOCALE),
          )}
          directionsLede={formatLine(loc(section.directions?.lede, LOCALE))}
          replaceLabel={loc(section.directions?.replaceLabel, LOCALE)}
          replaceItems={
            section.directions?.replaceItems?.map((it) =>
              formatLine(loc(it, LOCALE)),
            ) ?? []
          }
          allowedLabel={loc(section.directions?.allowedLabel, LOCALE)}
          allowedItems={
            section.directions?.allowedItems?.map((it) =>
              formatLine(loc(it, LOCALE)),
            ) ?? []
          }
          benefitsHeading={formatLine(loc(section.benefitsHeading, LOCALE))}
          benefitsSub={formatLine(loc(section.benefitsSub, LOCALE))}
          benefitHeroValue={section.benefitHero?.value ?? ""}
          benefitHeroLede={formatLine(loc(section.benefitHero?.lede, LOCALE))}
          benefitHeroSource={loc(section.benefitHero?.source, LOCALE)}
          benefitHeroBullets={
            section.benefitHero?.bullets?.map((b) =>
              formatLine(loc(b, LOCALE)),
            ) ?? []
          }
          benefitRows={
            section.benefitRows?.map((row) => ({
              feature: row.feature ?? "",
              heading: formatLine(loc(row.heading, LOCALE)),
              items:
                row.items?.map((it) => formatLine(loc(it, LOCALE))) ?? [],
              mock: buildOutcomeMock(row),
            })) ?? []
          }
        />
      );

    case "servicesBlock":
      return (
        <Services
          testimonialEyebrow={
            loc(section.testimonialEyebrow, LOCALE) || undefined
          }
          testimonialQuote={
            formatLine(loc(section.testimonial?.quote, LOCALE)) || undefined
          }
          testimonialAuthorName={section.testimonial?.authorName}
          testimonialAuthorInitials={
            section.testimonial?.authorInitials || undefined
          }
          testimonialAuthorRole={
            loc(section.testimonial?.authorRole, LOCALE) || undefined
          }
          servicesHeading={
            formatLine(loc(section.heading, LOCALE)) || undefined
          }
          servicesSub={formatLine(loc(section.sub, LOCALE)) || undefined}
          features={section.features?.map((f, i) => ({
            // Schema has no icon field; reuse the medicine defaults by index.
            icon: MEDICINE_FEATURE_ICONS[i] ?? null,
            bg: f.image?.asset?.url ?? "",
            title: loc(f.title, LOCALE),
            items: f.items?.map((it) => formatLine(loc(it, LOCALE))) ?? [],
          }))}
          integrationsHeading={
            formatLine(loc(section.integrationsHeading, LOCALE)) || undefined
          }
          integrationsSub={
            formatLine(loc(section.integrationsSub, LOCALE)) || undefined
          }
          integrations={section.integrations?.map((it) => loc(it, LOCALE))}
        />
      );

    case "comparisonBlock":
      return (
        <Comparison
          tableHeading={formatLine(loc(section.heading, LOCALE)) || undefined}
          tableLabels={
            section.columns
              ? [
                  loc(section.columns.param, LOCALE),
                  loc(section.columns.wp, LOCALE),
                  loc(section.columns.wix, LOCALE),
                  loc(section.columns.custom, LOCALE),
                ]
              : undefined
          }
          rows={section.rows?.map((r) => ({
            param: loc(r.param, LOCALE),
            wp: loc(r.wp, LOCALE),
            wix: loc(r.wix, LOCALE),
            custom: loc(r.custom, LOCALE),
          }))}
          tableCtaPrimary={
            loc(section.tableCtaPrimary, LOCALE) || undefined
          }
          tableCtaGhost={loc(section.tableCtaGhost, LOCALE) || undefined}
          contactHeading={loc(section.contact?.heading, LOCALE) || undefined}
          contactSub={loc(section.contact?.sub, LOCALE) || undefined}
          contactName={
            loc(section.contact?.namePlaceholder, LOCALE) || undefined
          }
          contactChannel={
            loc(section.contact?.channelPlaceholder, LOCALE) || undefined
          }
          contactBrief={
            loc(section.contact?.briefPlaceholder, LOCALE) || undefined
          }
          contactSubmit={
            loc(section.contact?.submitLabel, LOCALE) || undefined
          }
          contactFoot={
            formatLine(loc(section.contact?.foot, LOCALE)) || undefined
          }
          pricingHeading={
            formatLine(loc(section.pricingHeading, LOCALE)) || undefined
          }
          tiers={section.tiers?.map((t) => ({
            name: formatLine(loc(t.title, LOCALE)) ?? "",
            price: loc(t.price, LOCALE),
            weeks: loc(t.weeks, LOCALE),
            popular: t.isPopular,
            popularLabel: loc(t.popularLabel, LOCALE) || undefined,
            includes: {
              heading: loc(t.includesHeading, LOCALE),
              items:
                t.includes?.map((it) => formatLine(loc(it, LOCALE))) ?? [],
            },
            excludes:
              t.excludes && t.excludes.length > 0
                ? {
                    heading: loc(t.excludesHeading, LOCALE) || undefined,
                    items: t.excludes.map((it) =>
                      formatLine(loc(it, LOCALE)),
                    ),
                  }
                : undefined,
            ctaLabel: loc(t.ctaLabel, LOCALE),
            ctaGhost: t.ctaGhost,
          }))}
        />
      );

    case "faqBlock":
      return (
        <FAQ
          heading={loc(section.heading, LOCALE) || undefined}
          items={section.items?.map((it) => ({
            q: loc(it.question, LOCALE),
            a: plainPortable(it.answer) ? [plainPortable(it.answer)] : [],
          }))}
        />
      );

    case "auditBlock":
      return (
        <Audit
          heading={loc(section.heading, LOCALE) || undefined}
          sub={formatLine(loc(section.sub, LOCALE)) || undefined}
          list={section.list?.map((it) => formatLine(loc(it, LOCALE)))}
          foot={loc(section.foot, LOCALE) || undefined}
          inputName={
            loc(section.inputs?.namePlaceholder, LOCALE) || undefined
          }
          inputContact={
            loc(section.inputs?.contactPlaceholder, LOCALE) || undefined
          }
          inputPhone={
            loc(section.inputs?.phonePlaceholder, LOCALE) || undefined
          }
          inputUrl={loc(section.inputs?.urlPlaceholder, LOCALE) || undefined}
          submit={loc(section.submitLabel, LOCALE) || undefined}
          disclaim={loc(section.disclaim, LOCALE) || undefined}
        />
      );

    case "richTextBlock":
      return (
        <section className="py-16 px-12 bg-bg max-[700px]:px-5">
          <div className="max-w-[880px] mx-auto [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:text-[var(--ink-2)] [&_h2]:font-display [&_h2]:text-[clamp(24px,3vw,36px)] [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mb-4 [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mb-3">
            <PortableText value={section.content} />
          </div>
        </section>
      );

    default:
      return null;
  }
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await sanityFetch<IndustryPageDoc | null>({
    query: INDUSTRY_PAGE_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 3600,
    tags: [`industryPage:${slug}`],
  });

  if (!page) notFound();

  const jsonLd = buildIndustryJsonLd(page);
  const hero = page.hero;

  const eyebrowStr = loc(hero?.eyebrow, LOCALE);
  const slashIdx = eyebrowStr.lastIndexOf(" / ");
  const eyebrowProp = eyebrowStr
    ? {
        label: slashIdx > -1 ? eyebrowStr.slice(0, slashIdx) : eyebrowStr,
        em: slashIdx > -1 ? eyebrowStr.slice(slashIdx + 3) : "",
      }
    : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />
      <HeroEditorial
        eyebrow={eyebrowProp}
        h1Lines={
          hero?.heading
            ? loc(hero.heading, LOCALE)
                .split("\n")
                .map((line) => formatLine(line))
            : undefined
        }
        h1Num={hero?.h1Num}
        h1NumLabel={
          hero?.h1NumLabel
            ? formatLine(loc(hero.h1NumLabel, LOCALE))
            : undefined
        }
        lede={hero?.lede ? formatLine(loc(hero.lede, LOCALE)) : undefined}
        features={
          hero?.features?.length
            ? hero.features.map((f) => {
                const str = loc(f, LOCALE);
                const pipeIdx = str.indexOf(" | ");
                return pipeIdx > -1
                  ? {
                      label: str.slice(0, pipeIdx),
                      sub: str.slice(pipeIdx + 3),
                    }
                  : { label: str, sub: "" };
              })
            : undefined
        }
        ctaPrimaryLabel={loc(hero?.ctaPrimary, LOCALE) || undefined}
        ctaSecondaryLabel={loc(hero?.ctaSecondary, LOCALE) || undefined}
        stats={
          hero?.stats?.length
            ? hero.stats.map((s) => ({
                num: s.value ?? "",
                lbl: formatLine(loc(s.label, LOCALE)),
              }))
            : undefined
        }
        tickerItems={
          hero?.tickerItems?.length
            ? hero.tickerItems.map((t) => loc(t, LOCALE))
            : undefined
        }
        deviceTags={
          hero?.deviceTags?.length
            ? hero.deviceTags.map((dt) => ({
                kind: dt.kind ?? "default",
                primary: loc(dt.primary, LOCALE),
                mini: dt.mini,
              }))
            : undefined
        }
        deviceMockupSrc={hero?.deviceMockup?.asset?.url || undefined}
      />

      {page.sections?.map((section) => (
        <SectionBlock key={section._key} section={section} />
      ))}

      <ClinicFooter />
    </>
  );
}
