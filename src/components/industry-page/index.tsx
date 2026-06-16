import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HpHeader } from "@/components/layout/hp-header";
import { HeroEditorial } from "@/components/blocks/hero";
import { ImageText } from "@/components/blocks/image-text";
import { Reasons } from "@/components/blocks/reasons";
import {
  Services,
  featureIconsForIndustry,
} from "@/components/blocks/services";
import { Comparison } from "@/components/blocks/comparison";
import { StatsBar } from "@/components/blocks/stats-bar";
import { Case } from "@/components/blocks/case";
import {
  Outcome,
  MockImage,
  MockPages,
  MockBookingForm,
  MockAdmin,
} from "@/components/blocks/outcome";
import { FAQ, Audit, ClinicFooter } from "@/components/blocks/final";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { INDUSTRY_PAGE_BY_SLUG_QUERY } from "@/lib/server/sanity-queries";
import type {
  ComparisonSection,
  FaqSection,
  IndustryPageDoc,
  IndustrySection,
  Locale,
  OutcomeSection,
  ServicesSection,
} from "@/types/sanity";
import { loc } from "@/lib/shared/sanity-locale";
import {
  PortableText,
  PortableInline,
  plainPortable,
  formatLine,
} from "@/lib/shared/sanity-portable";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg } from "@/lib/shared/sanity-image";
import { pickRichText } from "@/lib/shared/pick-rich-text";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  buildReviewNodes,
  breadcrumbNode,
  webPageNode,
  definedTermNodes,
  type JsonLdNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { glossaryTerms } from "@/constants/glossary";
import { localizePath } from "@/constants/i18n-routes";
import { buildHrefWithParams } from "@/lib/shared/update-search-params";

function findSection<T extends IndustrySection>(
  sections: IndustrySection[] | undefined,
  type: T["_type"],
): T | undefined {
  return sections?.find((s): s is T => s._type === type);
}

function pathFor(slug: string, locale: Locale): string {
  return locale === "en" ? `/en/sites-for/${slug}` : `/sites-for/${slug}`;
}

/** Glossary keys to attach as DefinedTerm nodes on every industry page. */
const INDUSTRY_GLOSSARY_KEYS = [
  "seo",
  "coreWebVitals",
  "lcp",
  "nextjs",
  "headlessCms",
] as const;

function buildIndustryJsonLd(
  doc: IndustryPageDoc,
  locale: Locale,
): JsonLdNode {
  const path = pathFor(doc.slug, locale);
  const url = pageUrl(path);
  const title = loc(doc.title, locale);
  const description = loc(doc.seo?.description, locale) || undefined;

  const comparison = findSection<ComparisonSection>(
    doc.sections,
    "comparisonBlock",
  );
  const faq = findSection<FaqSection>(doc.sections, "faqBlock");
  const services = findSection<ServicesSection>(doc.sections, "servicesBlock");

  // Industry testimonial is about the studio overall — itemReviewed = Organization.
  const industryReview = services?.testimonial;
  const reviews = industryReview
    ? buildReviewNodes(
        [
          {
            body: loc(industryReview.quote, locale),
            authorName: industryReview.authorName ?? "",
            rating: industryReview.rating,
            datePublished: industryReview.reviewDate,
            headline: loc(industryReview.reviewHeadline, locale) || undefined,
          },
        ],
        ORG_ID,
      )
    : [];

  const offers =
    comparison?.tiers?.map((t) => {
      const priceStr = loc(t.price, locale);
      // First contiguous run of digits = numeric price (strips "$", "від", spaces, commas)
      const priceMatch = priceStr.match(/(\d[\d\s,]*\d|\d)/);
      const priceNumeric = priceMatch
        ? priceMatch[0].replace(/[\s,]/g, "")
        : "";
      return {
        "@type": "Offer",
        name: loc(t.title, locale).replace(/\n/g, " "),
        description:
          (t.includes ?? [])
            .slice(0, 3)
            .map((it) => loc(it, locale).replace(/\*/g, ""))
            .join(" · ") || undefined,
        price: priceNumeric || undefined,
        priceCurrency: locale === "en" ? "GBP" : "USD",
        url,
      };
    }) ?? [];

  const serviceNode: JsonLdNode | null = offers.length
    ? {
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
      }
    : null;

  const faqNode: JsonLdNode | null = faq?.items?.length
    ? {
        "@type": "FAQPage",
        mainEntity: faq.items.map((it) => ({
          "@type": "Question",
          name: loc(it.question, locale),
          acceptedAnswer: {
            "@type": "Answer",
            text: plainPortable(pickRichText(it.answer, it.answerEn, locale)),
          },
        })),
      }
    : null;

  return buildJsonLd([
    webPageNode({
      path,
      locale,
      title,
      description,
      speakableSelectors: [
        '[data-speakable="hero-title"]',
        '[data-speakable="hero-description"]',
      ],
    }),
    breadcrumbNode([
      {
        name: locale === "en" ? "Home" : "Головна",
        path: locale === "en" ? "/en" : "/",
      },
      {
        name: locale === "en" ? "Industry solutions" : "Рішення для галузей",
        path: locale === "en" ? "/en/#solutions" : "/#solutions",
      },
      { name: title, path },
    ]),
    serviceNode,
    faqNode,
    reviews,
    definedTermNodes(glossaryTerms(INDUSTRY_GLOSSARY_KEYS, locale), locale),
  ]);
}

function buildOutcomeMock(
  row: NonNullable<OutcomeSection["benefitRows"]>[number],
  locale: Locale,
) {
  const url = row.mockUrl ?? "";
  // A real uploaded screenshot overrides the CSS mock.
  if (row.image?.asset) {
    return <MockImage url={url} image={row.image} alt={loc(row.heading, locale)} />;
  }
  if (row.mockType === "booking") return <MockBookingForm url={url} locale={locale} />;
  if (row.mockType === "admin") return <MockAdmin url={url} />;
  // Default to "pages"
  const tags = row.mockTags?.map((t) => loc(t, locale)) ?? [];
  return <MockPages url={url} tags={tags} />;
}

/**
 * Returns true if the doc has English-language content. Used to conditionally
 * emit hreflang alternates and to 404 the EN route for industries that haven't
 * been translated yet.
 */
export function hasEnglishContent(doc: IndustryPageDoc): boolean {
  return Boolean(doc.title?.en && doc.title.en.trim().length > 0);
}

export async function fetchIndustryPage(
  slug: string,
): Promise<IndustryPageDoc | null> {
  return sanityFetch<IndustryPageDoc | null>({
    query: INDUSTRY_PAGE_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 3600,
    tags: [`industryPage:${slug}`],
  });
}

export async function buildIndustryMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  const page = await sanityFetch<IndustryPageDoc | null>({
    query: INDUSTRY_PAGE_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 3600,
  });
  if (!page) return {};

  const title = loc(page.seo?.title, locale) || loc(page.title, locale);
  const description = loc(page.seo?.description, locale);
  const path = pathFor(slug, locale);
  const enAvailable = hasEnglishContent(page);

  const languages: Record<string, string> = {
    uk: `/sites-for/${slug}`,
  };
  if (enAvailable) {
    languages.en = `/en/sites-for/${slug}`;
    languages["x-default"] = `/sites-for/${slug}`;
  }

  // OG image fallback: dedicated seo.ogImage → hero device mockup → site default
  // (handled by Next via app/opengraph-image.tsx when `images` is undefined).
  const ogImageUrl =
    page.seo?.ogImage?.url ?? page.hero?.deviceMockup?.asset?.url ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: locale === "en" ? "en_US" : "uk_UA",
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function SectionBlock({
  section,
  locale,
  slug,
}: {
  section: IndustrySection;
  locale: Locale;
  /** Industry slug used to pick the right feature-icon set. */
  slug: string;
}) {
  switch (section._type) {
    case "imageTextBlock":
      return (
        <ImageText
          variant={section.variant ?? "side"}
          imageVariant={section.imageVariant ?? "imageRight"}
          bulletIcon={section.bulletIcon ?? "check"}
          eyebrow={loc(section.eyebrow, locale) || undefined}
          heading={formatLine(loc(section.heading, locale)) ?? ""}
          body={
            <PortableInline
              value={pickRichText(section.body, section.bodyEn, locale)}
            />
          }
          bulletList={section.bulletList?.map((b) => loc(b, locale))}
          image={
            section.image?.asset ? (
              <SanityImg
                image={section.image}
                alt={loc(section.heading, locale)}
                fill
                sizes={IMG_SIZES.half}
                className="object-cover"
              />
            ) : null
          }
          cta={
            section.cta?.label
              ? {
                  label: loc(section.cta.label, locale),
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
              value: loc(m.value, locale),
              label: loc(m.label, locale),
            })) ?? []
          }
        />
      );

    case "reasonsBlock":
      return (
        <Reasons
          eyebrow={loc(section.eyebrow, locale) || undefined}
          eyebrowNum={loc(section.eyebrowNum, locale) || undefined}
          heading={formatLine(loc(section.heading, locale)) || undefined}
          metaRows={section.metaRows?.map((m) => loc(m, locale))}
          items={section.reasons?.map((r) => ({
            n: r.number ?? "",
            tag: loc(r.tag, locale),
            title: formatLine(loc(r.title, locale)),
            body: (
              <PortableInline value={pickRichText(r.text, r.textEn, locale)} />
            ),
            stat: {
              n: r.stat?.value ?? "",
              lbl: loc(r.stat?.label, locale),
              src: loc(r.stat?.source, locale),
            },
          }))}
          footText={
            formatLine(loc(section.footText, locale)) || undefined
          }
          footCtaLabel={
            loc(section.footCta?.label ?? section.footCtaLabel, locale) ||
            undefined
          }
          footCtaHref={section.footCta?.href || "#site-audit"}
          locale={locale === "en" ? "en" : "uk"}
        />
      );

    case "caseBlock":
      return (
        <Case
          eyebrow={loc(section.eyebrow, locale) || undefined}
          eyebrowEm={loc(section.eyebrowEm, locale) || undefined}
          heading={formatLine(loc(section.heading, locale)) || undefined}
          lede={formatLine(loc(section.lede, locale)) || undefined}
          meta={section.meta?.map((m) => ({
            strong: loc(m.strong, locale),
            text: loc(m.text, locale),
          }))}
          beforeNum={section.before?.num}
          beforeShotSrc={section.before?.image?.asset?.url}
          beforeShotUrl={section.before?.url}
          beforeShotAlt={loc(section.before?.alt, locale)}
          beforeTagline={loc(section.before?.tagline, locale)}
          beforeList={section.before?.items?.map((it) =>
            formatLine(loc(it, locale)),
          )}
          beforeFoot={
            formatLine(loc(section.before?.foot, locale)) || undefined
          }
          afterNum={section.after?.num}
          afterShotSrc={section.after?.image?.asset?.url}
          afterShotUrl={section.after?.url}
          afterShotAlt={loc(section.after?.alt, locale)}
          afterTagline={loc(section.after?.tagline, locale)}
          afterList={section.after?.items?.map((it) =>
            formatLine(loc(it, locale)),
          )}
          afterFoot={
            formatLine(loc(section.after?.foot, locale)) || undefined
          }
          results={section.results?.map((r) => ({
            n: loc(r.value, locale),
            lbl: loc(r.label, locale),
            tag: loc(r.tag, locale),
          }))}
          ctaText={formatLine(loc(section.ctaText, locale)) || undefined}
          ctaLabel={
            loc(section.cta?.label ?? section.ctaLabel, locale) || undefined
          }
          ctaHref={
            section.cta?.href ||
            buildHrefWithParams(localizePath("/portfolio", locale === "en"), {
              industry: slug,
            })
          }
          locale={locale === "en" ? "en" : "uk"}
        />
      );

    case "outcomeBlock":
      return (
        <Outcome
          recapEyebrow={loc(section.recap?.eyebrow, locale)}
          recapText={formatLine(loc(section.recap?.text, locale))}
          directionsEyebrow={loc(section.directions?.eyebrow, locale)}
          directionsTitle={formatLine(
            loc(section.directions?.title, locale),
          )}
          directionsLede={formatLine(loc(section.directions?.lede, locale))}
          replaceLabel={loc(section.directions?.replaceLabel, locale)}
          replaceItems={
            section.directions?.replaceItems?.map((it) =>
              formatLine(loc(it, locale)),
            ) ?? []
          }
          allowedLabel={loc(section.directions?.allowedLabel, locale)}
          allowedItems={
            section.directions?.allowedItems?.map((it) =>
              formatLine(loc(it, locale)),
            ) ?? []
          }
          benefitsHeading={formatLine(loc(section.benefitsHeading, locale))}
          benefitsSub={formatLine(loc(section.benefitsSub, locale))}
          benefitHeroValue={section.benefitHero?.value ?? ""}
          benefitHeroLede={formatLine(loc(section.benefitHero?.lede, locale))}
          benefitHeroSource={loc(section.benefitHero?.source, locale)}
          benefitHeroBullets={
            section.benefitHero?.bullets?.map((b) =>
              formatLine(loc(b, locale)),
            ) ?? []
          }
          benefitRows={
            section.benefitRows?.map((row) => ({
              feature: row.feature ?? "",
              heading: formatLine(loc(row.heading, locale)),
              items:
                row.items?.map((it) => formatLine(loc(it, locale))) ?? [],
              mock: buildOutcomeMock(row, locale),
            })) ?? []
          }
        />
      );

    case "servicesBlock":
      return (
        <Services
          testimonialEyebrow={
            loc(section.testimonialEyebrow, locale) || undefined
          }
          testimonialVisual={section.testimonial?.visual ?? undefined}
          testimonialQuote={
            formatLine(loc(section.testimonial?.quote, locale)) || undefined
          }
          testimonialAuthorName={section.testimonial?.authorName}
          testimonialAuthorInitials={
            section.testimonial?.authorInitials || undefined
          }
          testimonialAuthorRole={
            loc(section.testimonial?.authorRole, locale) || undefined
          }
          servicesHeading={
            formatLine(loc(section.heading, locale)) || undefined
          }
          servicesSub={formatLine(loc(section.sub, locale)) || undefined}
          features={section.features?.map((f, i) => {
            // Schema has no icon field; pick from per-industry set by index.
            const icons = featureIconsForIndustry(slug);
            return {
              icon: icons[i] ?? null,
              bg: f.image?.asset?.url ?? "",
              title: loc(f.title, locale),
              items: f.items?.map((it) => formatLine(loc(it, locale))) ?? [],
            };
          })}
          integrationsHeading={
            formatLine(loc(section.integrationsHeading, locale)) || undefined
          }
          integrationsSub={
            formatLine(loc(section.integrationsSub, locale)) || undefined
          }
          integrations={section.integrations?.map((it) => loc(it, locale))}
        />
      );

    case "comparisonBlock":
      return (
        <Comparison
          tableHeading={formatLine(loc(section.heading, locale)) || undefined}
          tableLabels={
            section.columns
              ? [
                  loc(section.columns.param, locale),
                  loc(section.columns.wp, locale),
                  loc(section.columns.wix, locale),
                  loc(section.columns.custom, locale),
                ]
              : undefined
          }
          rows={section.rows?.map((r) => ({
            param: loc(r.param, locale),
            wp: loc(r.wp, locale),
            wix: loc(r.wix, locale),
            custom: loc(r.custom, locale),
          }))}
          tableCtaPrimary={
            loc(section.primaryCta?.label ?? section.tableCtaPrimary, locale) ||
            undefined
          }
          tableCtaPrimaryHref={
            section.primaryCta?.href ||
            localizePath("/calculator", locale === "en")
          }
          tableCtaGhost={
            loc(section.ghostCta?.label ?? section.tableCtaGhost, locale) ||
            undefined
          }
          tableCtaGhostHref={
            section.ghostCta?.href ||
            localizePath("/vs-wordpress", locale === "en")
          }
          contactHeading={loc(section.contact?.heading, locale) || undefined}
          contactSub={loc(section.contact?.sub, locale) || undefined}
          contactName={
            loc(section.contact?.namePlaceholder, locale) || undefined
          }
          contactChannel={
            loc(section.contact?.channelPlaceholder, locale) || undefined
          }
          contactBrief={
            loc(section.contact?.briefPlaceholder, locale) || undefined
          }
          contactSubmit={
            loc(section.contact?.submitLabel, locale) || undefined
          }
          contactFoot={
            formatLine(loc(section.contact?.foot, locale)) || undefined
          }
          pricingHeading={
            formatLine(loc(section.pricingHeading, locale)) || undefined
          }
          tiers={section.tiers?.map((t) => ({
            name: formatLine(loc(t.title, locale)) ?? "",
            price: loc(t.price, locale),
            priceLabel: locale === "en" ? "from" : "від",
            weeks: loc(t.weeks, locale),
            popular: t.isPopular,
            popularLabel: loc(t.popularLabel, locale) || undefined,
            includes: {
              heading: loc(t.includesHeading, locale),
              items:
                t.includes?.map((it) => formatLine(loc(it, locale))) ?? [],
            },
            excludes:
              t.excludes && t.excludes.length > 0
                ? {
                    heading: loc(t.excludesHeading, locale) || undefined,
                    items: t.excludes.map((it) =>
                      formatLine(loc(it, locale)),
                    ),
                  }
                : undefined,
            ctaLabel: loc(t.ctaLabel, locale),
            ctaGhost: t.ctaGhost,
          }))}
        />
      );

    case "faqBlock": {
      const faqItems =
        section.items
          ?.map((it) => {
            const ans = pickRichText(it.answer, it.answerEn, locale);
            const text = plainPortable(ans);
            const q = loc(it.question, locale);
            if (!q) return null;
            return { q, a: text ? [text] : [] };
          })
          .filter((it): it is { q: string; a: string[] } => it !== null) ?? [];
      if (faqItems.length === 0) return null;
      return (
        <FAQ
          locale={locale === "en" ? "en" : "uk"}
          heading={loc(section.heading, locale) || undefined}
          items={faqItems}
        />
      );
    }

    case "auditBlock":
      return (
        <Audit
          heading={loc(section.heading, locale) || undefined}
          sub={formatLine(loc(section.sub, locale)) || undefined}
          list={section.list?.map((it) => formatLine(loc(it, locale)))}
          foot={loc(section.foot, locale) || undefined}
          inputName={
            loc(section.inputs?.namePlaceholder, locale) || undefined
          }
          inputContact={
            loc(section.inputs?.contactPlaceholder, locale) || undefined
          }
          inputPhone={
            loc(section.inputs?.phonePlaceholder, locale) || undefined
          }
          inputUrl={loc(section.inputs?.urlPlaceholder, locale) || undefined}
          submit={loc(section.submitLabel, locale) || undefined}
          disclaim={loc(section.disclaim, locale) || undefined}
        />
      );

    case "richTextBlock":
      return (
        <section className="py-16 px-5 bg-bg md:px-12">
          <div className="max-w-container-narrow mx-auto [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:text-ink-dim [&_h2]:font-display [&_h2]:text-[clamp(24px,3vw,36px)] [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mb-4 [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mb-3">
            <PortableText
              value={pickRichText(section.content, section.contentEn, locale)}
            />
          </div>
        </section>
      );

    default:
      return null;
  }
}

export async function IndustryPageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const page = await fetchIndustryPage(slug);

  if (!page) notFound();
  // EN route 404s if the doc has no English translation
  if (locale === "en" && !hasEnglishContent(page)) notFound();

  const jsonLd = buildIndustryJsonLd(page, locale);
  const hero = page.hero;

  const eyebrowStr = loc(hero?.eyebrow, locale);
  const slashIdx = eyebrowStr.lastIndexOf(" / ");
  const eyebrowProp = eyebrowStr
    ? {
        label: slashIdx > -1 ? eyebrowStr.slice(0, slashIdx) : eyebrowStr,
        em: slashIdx > -1 ? eyebrowStr.slice(slashIdx + 3) : "",
      }
    : undefined;

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <main>
      <HeroEditorial
        eyebrow={eyebrowProp}
        h1Lines={
          hero?.heading
            ? loc(hero.heading, locale)
                .split("\n")
                .map((line) => formatLine(line))
            : undefined
        }
        h1Num={hero?.h1Num}
        h1NumLabel={
          hero?.h1NumLabel
            ? formatLine(loc(hero.h1NumLabel, locale))
            : undefined
        }
        lede={hero?.lede ? formatLine(loc(hero.lede, locale)) : undefined}
        features={
          hero?.features?.length
            ? hero.features.map((f) => {
                const str = loc(f, locale);
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
        ctaPrimaryLabel={loc(hero?.ctaPrimary, locale) || undefined}
        ctaPrimaryHref={localizePath("/contacts", locale === "en")}
        ctaSecondaryLabel={loc(hero?.ctaSecondary, locale) || undefined}
        ctaSecondaryHref={buildHrefWithParams(
          localizePath("/portfolio", locale === "en"),
          { industry: page.slug },
        )}
        stats={
          hero?.stats?.length
            ? hero.stats.map((s) => ({
                num: loc(s.value, locale),
                lbl: formatLine(loc(s.label, locale)),
              }))
            : undefined
        }
        tickerItems={
          hero?.tickerItems?.length
            ? hero.tickerItems.map((t) => loc(t, locale))
            : undefined
        }
        deviceTags={
          hero?.deviceTags?.length
            ? hero.deviceTags.map((dt) => ({
                kind: dt.kind ?? "default",
                primary: loc(dt.primary, locale),
                mini: dt.mini,
              }))
            : undefined
        }
        deviceMockupImage={hero?.deviceMockup ?? undefined}
        deviceMockupAlt={
          loc(hero?.deviceMockup?.alt, locale) ||
          loc(hero?.heading, locale) ||
          undefined
        }
      />

      {page.sections?.map((section) => (
        <SectionBlock
          key={section._key}
          section={section}
          locale={locale}
          slug={page.slug}
        />
      ))}
      </main>

      <ClinicFooter locale={locale === "en" ? "en" : "uk"} />
    </>
  );
}
