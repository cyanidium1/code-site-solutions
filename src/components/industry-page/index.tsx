import { Fragment } from "react";
import Link from "next/link";
import { buildAlternates } from "@/lib/shared/alternates";
import { DEFAULT_LOCALE, LOCALE_CONFIG } from "@/constants/locales";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HpHeader } from "@/components/layout/hp-header";
import { HpFooter } from "@/components/layout/hp-footer";
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
import { FAQ, Audit } from "@/components/blocks/final";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  INDUSTRY_PAGE_BY_SLUG_QUERY,
  INDUSTRY_PAGES_QUERY,
} from "@/lib/server/sanity-queries";
import type {
  ComparisonSection,
  FaqSection,
  IndustryPageDoc,
  IndustryPageRef,
  IndustrySection,
  Locale,
  OutcomeSection,
  ServicesSection,
} from "@/types/sanity";
import { loc } from "@/lib/shared/sanity-locale";
import { MedBookingDemo } from "@/components/industry-page/medicine/med-booking-demo";
import { MedPatientFlow } from "@/components/industry-page/medicine/med-patient-flow";
import { MedHero } from "@/components/industry-page/medicine/med-hero";
import { MedVitals } from "@/components/industry-page/medicine/med-vitals";
import { MedDiagnosis } from "@/components/industry-page/medicine/med-diagnosis";
import { MedCapabilities } from "@/components/industry-page/medicine/med-capabilities";
import { MiniCalc } from "@/components/landing-page/mini-calc";
import {
  industryCalcContent,
  industryCalcHeading,
} from "@/components/industry-page/industry-calcs";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { resolveBlogCover } from "@/lib/shared/blog-cover";
import {
  BLOG_POSTS_BY_CATEGORY_QUERY,
  CASE_STUDIES_QUERY,
} from "@/lib/server/sanity-queries";
import type { BlogPostListItem, CaseStudyRef } from "@/types/sanity";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import {
  PortableText,
  PortableInline,
  plainPortable,
  formatLine,
} from "@/lib/shared/sanity-portable";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg } from "@/lib/shared/sanity-image";
import { pickLocalized } from "@/lib/shared/pick-localized";
import { FROM_LABEL, LOCALE_CURRENCY } from "@/lib/shared/format-price";
import { ORG_ID, pageUrl, SITE_CONTACT } from "@/constants/site";
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
import { localizePath, resolveRootHref } from "@/constants/i18n-routes";
import { availableLocales, hasLocaleContent } from "@/lib/shared/locale-content";
import { buildHrefWithParams } from "@/lib/shared/update-search-params";

/** Static UI strings, per locale. Adding a locale extends this record. */
const LABELS: Record<
  Locale,
  {
    home: string;
    solutions: string;
    testimonialEyebrow: string;
    articlesEyebrow: string;
    articlesHeading: string;
    articlesAll: string;
    nicheCasesEyebrow: string;
    nicheCasesHeading: string;
    nicheCasesAll: string;
    minRead: (n: number) => string;
  }
> = {
  uk: {
    home: "Головна",
    solutions: "Рішення для галузей",
    testimonialEyebrow: "ВІДГУК КЛІЄНТА",
    articlesEyebrow: "КОРИСНЕ",
    articlesHeading: "Розбори по темі з нашого блогу",
    articlesAll: "Всі статті",
    nicheCasesEyebrow: "ПОРТФОЛІО",
    nicheCasesHeading: "Кейси в цій ніші",
    nicheCasesAll: "Всі кейси",
    minRead: (n) => `${n} хв читання`,
  },
  en: {
    home: "Home",
    solutions: "Industry solutions",
    testimonialEyebrow: "CLIENT TESTIMONIAL",
    articlesEyebrow: "USEFUL READING",
    articlesHeading: "Deep dives on this topic from our blog",
    articlesAll: "All articles",
    nicheCasesEyebrow: "PORTFOLIO",
    nicheCasesHeading: "Case studies in this niche",
    nicheCasesAll: "All case studies",
    minRead: (n) => `${n} min read`,
  },
  ru: {
    home: "Главная",
    solutions: "Решения для отраслей",
    testimonialEyebrow: "ОТЗЫВ КЛИЕНТА",
    articlesEyebrow: "ПОЛЕЗНОЕ",
    articlesHeading: "Разборы по теме из нашего блога",
    articlesAll: "Все статьи",
    nicheCasesEyebrow: "ПОРТФОЛИО",
    nicheCasesHeading: "Кейсы в этой нише",
    nicheCasesAll: "Все кейсы",
    minRead: (n) => `${n} мин чтения`,
  },
};

/**
 * Contact-section footnote, per locale. Channel emphasis differs by market:
 * the default locale leads with Telegram, secondary markets with WhatsApp.
 */
const CONTACT_FOOT: Record<
  Locale,
  (args: { phoneDigits: string; linkCls: string }) => React.ReactNode
> = {
  uk: ({ phoneDigits, linkCls }) => (
    <>
      Або одразу пишіть у Telegram:{" "}
      <a
        href={SITE_CONTACT.telegram}
        target="_blank"
        rel="noreferrer"
        className={linkCls}
      >
        {SITE_CONTACT.telegramHandle}
      </a>{" "}
      або у WhatsApp{" "}
      <a
        href={`https://wa.me/${phoneDigits}`}
        target="_blank"
        rel="noreferrer"
        className={linkCls}
      >
        {SITE_CONTACT.phoneDisplay}
      </a>
    </>
  ),
  en: ({ linkCls }) => (
    <>
      Or message us on WhatsApp:{" "}
      <a
        href={`https://wa.me/${SITE_CONTACT.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className={linkCls}
      >
        {SITE_CONTACT.whatsappDisplay}
      </a>
    </>
  ),
  ru: ({ phoneDigits, linkCls }) => (
    <>
      Или сразу пишите в Telegram:{" "}
      <a
        href={SITE_CONTACT.telegram}
        target="_blank"
        rel="noreferrer"
        className={linkCls}
      >
        {SITE_CONTACT.telegramHandle}
      </a>{" "}
      или в WhatsApp{" "}
      <a
        href={`https://wa.me/${phoneDigits}`}
        target="_blank"
        rel="noreferrer"
        className={linkCls}
      >
        {SITE_CONTACT.phoneDisplay}
      </a>
    </>
  ),
};

function findSection<T extends IndustrySection>(
  sections: IndustrySection[] | undefined,
  type: T["_type"],
): T | undefined {
  return sections?.find((s): s is T => s._type === type);
}

function pathFor(slug: string, locale: Locale): string {
  return localizePath(`/sites-for/${slug}`, locale);
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
        priceCurrency: LOCALE_CURRENCY[locale],
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
            text: plainPortable(pickLocalized(it.answer, locale)),
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
        name: LABELS[locale].home,
        path: localizePath("/", locale),
      },
      {
        name: LABELS[locale].solutions,
        path: `${localizePath("/", locale)}#solutions`,
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
  // A real uploaded screenshot overrides the CSS mock.
  if (row.image?.asset) {
    return (
      <MockImage
        image={row.image}
        alt={loc(row.image.alt, locale) || loc(row.heading, locale)}
      />
    );
  }
  if (row.mockType === "booking") return <MockBookingForm locale={locale} />;
  if (row.mockType === "admin") return <MockAdmin />;
  // Default to "pages"
  const tags = row.mockTags?.map((t) => loc(t, locale)) ?? [];
  return <MockPages tags={tags} />;
}

/**
 * Slugs of every published industry page, used by `generateStaticParams` so the
 * `/sites-for/[slug]` routes are prerendered and served from the edge cache.
 * Mirrors `fetchCaseStudies` in `@/components/case-page`.
 */
export async function fetchIndustryPages(): Promise<IndustryPageRef[]> {
  return (
    (await sanityFetch<IndustryPageRef[]>({
      query: INDUSTRY_PAGES_QUERY,
      revalidate: 3600,
      tags: ["industryPage"],
    }).catch(() => [])) ?? []
  );
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

  const alternates = buildAlternates({
    locale,
    uaPath: `/sites-for/${slug}`,
    available: availableLocales(page),
  });

  // OG image fallback: dedicated seo.ogImage → hero device mockup → site default
  // (handled by Next via app/opengraph-image.tsx when `images` is undefined).
  const ogImageUrl =
    page.seo?.ogImage?.url ?? page.hero?.deviceMockup?.asset?.url ?? undefined;

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: LOCALE_CONFIG[locale].ogLocale,
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
          imageFit={section.imageFit ?? "cover"}
          bulletIcon={section.bulletIcon ?? "check"}
          eyebrow={loc(section.eyebrow, locale) || undefined}
          heading={formatLine(loc(section.heading, locale)) ?? ""}
          body={
            <PortableInline
              value={pickLocalized(section.body, locale)}
            />
          }
          bulletList={section.bulletList?.map((b) => loc(b, locale))}
          image={
            section.image?.asset ? (
              section.imageFit === "natural" ? (
                <SanityImg
                  image={section.image}
                  alt={
                    loc(section.image?.alt, locale) ||
                    loc(section.heading, locale)
                  }
                  sizes={IMG_SIZES.half}
                />
              ) : (
                <SanityImg
                  image={section.image}
                  alt={
                    loc(section.image?.alt, locale) ||
                    loc(section.heading, locale)
                  }
                  fill
                  sizes={IMG_SIZES.half}
                  className="object-cover"
                />
              )
            ) : null
          }
          cta={
            section.cta?.label && section.cta?.href
              ? {
                  label: loc(section.cta.label, locale),
                  href: section.cta.href,
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

    case "reasonsBlock": {
      const reasonItems = section.reasons?.map((r) => ({
        n: r.number ?? "",
        tag: loc(r.tag, locale),
        title: formatLine(loc(r.title, locale)),
        body: <PortableInline value={pickLocalized(r.text, locale)} />,
        stat: {
          n: r.stat?.value ?? "",
          lbl: loc(r.stat?.label, locale),
          src: loc(r.stat?.source, locale),
        },
      }));

      // Medicine reads these as a diagnostic sheet, not a bento of cards.
      if (slug === "medicine") {
        return (
          <MedDiagnosis
            eyebrow={loc(section.eyebrow, locale) || undefined}
            eyebrowNum={loc(section.eyebrowNum, locale) || undefined}
            heading={formatLine(loc(section.heading, locale)) || undefined}
            metaRows={section.metaRows?.map((m) => loc(m, locale))}
            items={reasonItems}
            footText={formatLine(loc(section.footText, locale)) || undefined}
            footCtaLabel={
              loc(section.footCta?.label ?? section.footCtaLabel, locale) ||
              undefined
            }
            footCtaHref={section.footCta?.href || "#site-audit"}
          />
        );
      }

      return (
        <Reasons
          eyebrow={loc(section.eyebrow, locale) || undefined}
          eyebrowNum={loc(section.eyebrowNum, locale) || undefined}
          heading={formatLine(loc(section.heading, locale)) || undefined}
          metaRows={section.metaRows?.map((m) => loc(m, locale))}
          items={reasonItems}
          footText={
            formatLine(loc(section.footText, locale)) || undefined
          }
          footCtaLabel={
            loc(section.footCta?.label ?? section.footCtaLabel, locale) ||
            undefined
          }
          footCtaHref={section.footCta?.href || "#site-audit"}
          locale={locale}
        />
      );
    }

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
          beforeShotAlt={loc(section.before?.image?.alt, locale)}
          beforeTagline={loc(section.before?.tagline, locale)}
          beforeList={section.before?.items?.map((it) =>
            formatLine(loc(it, locale)),
          )}
          beforeFoot={
            formatLine(loc(section.before?.foot, locale)) || undefined
          }
          afterNum={section.after?.num}
          afterShotSrc={section.after?.image?.asset?.url}
          afterShotAlt={loc(section.after?.image?.alt, locale)}
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
            buildHrefWithParams(resolveRootHref("/portfolio", locale), {
              industry: slug,
            })
          }
          locale={locale}
          layout={section.layout}
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

    case "servicesBlock": {
      // Medicine reads capabilities as a ruled spec list beside real artwork,
      // and integrations as a directional bus.
      if (slug === "medicine") {
        const icons = featureIconsForIndustry(slug);
        return (
          <MedCapabilities
            locale={locale}
            heading={formatLine(loc(section.heading, locale)) || undefined}
            sub={formatLine(loc(section.sub, locale)) || undefined}
            capabilities={section.features?.map((f, i) => ({
              icon: icons[i] ?? null,
              title: loc(f.title, locale),
              items: f.items?.map((it) => formatLine(loc(it, locale))) ?? [],
            }))}
            testimonialEyebrow={
              loc(section.testimonialEyebrow, locale) ||
              LABELS[locale].testimonialEyebrow
            }
            testimonialQuote={
              formatLine(loc(section.testimonial?.quote, locale)) || undefined
            }
            testimonialAuthorName={section.testimonial?.authorName}
            testimonialAuthorRole={
              loc(section.testimonial?.authorRole, locale) || undefined
            }
            integrationsHeading={
              formatLine(loc(section.integrationsHeading, locale)) || undefined
            }
            integrationsSub={
              formatLine(loc(section.integrationsSub, locale)) || undefined
            }
            integrations={section.integrations?.map((it) => loc(it, locale))}
          />
        );
      }

      return (
        <Services
          testimonialEyebrow={
            loc(section.testimonialEyebrow, locale) || LABELS[locale].testimonialEyebrow
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
    }

    case "comparisonBlock":
      return (
        <Comparison
          locale={locale}
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
            resolveRootHref("/calculator", locale)
          }
          tableCtaGhost={
            loc(section.ghostCta?.label ?? section.tableCtaGhost, locale) ||
            undefined
          }
          tableCtaGhostHref={
            section.ghostCta?.href ||
            resolveRootHref("/vs-wordpress", locale)
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
          contactFoot={CONTACT_FOOT[locale]({
            phoneDigits: SITE_CONTACT.phoneRaw.replace(/[^\d]/g, ""),
            linkCls: "text-accent-soft no-underline font-semibold hover:underline",
          })}
          pricingHeading={
            formatLine(loc(section.pricingHeading, locale)) || undefined
          }
          tiers={section.tiers?.map((t) => ({
            name: formatLine(loc(t.title, locale)) ?? "",
            price: loc(t.price, locale),
            priceLabel: FROM_LABEL[locale],
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
            const ans = pickLocalized(it.answer, locale);
            const text = plainPortable(ans);
            const q = loc(it.question, locale);
            if (!q) return null;
            return { q, a: text ? [text] : [] };
          })
          .filter((it): it is { q: string; a: string[] } => it !== null) ?? [];
      if (faqItems.length === 0) return null;
      return (
        <FAQ
          locale={locale}
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

    case "richTextBlock": {
      // A block can legitimately carry copy for one locale only (e.g. an
      // EN-market section). Without this guard the wrapper still renders and
      // leaves an empty band of py-16 padding on the other locales.
      const richText = pickLocalized(section.content, locale);
      if (!richText?.length) return null;
      return (
        <section className="py-16 px-5 bg-bg md:px-12">
          <div className="max-w-container-narrow mx-auto [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:text-ink-dim [&_h2]:font-display [&_h2]:text-[clamp(24px,3vw,36px)] [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mb-4 [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mb-3">
            <PortableText value={richText} />
          </div>
        </section>
      );
    }

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
  if (!hasLocaleContent(page, locale)) notFound();

  const jsonLd = buildIndustryJsonLd(page, locale);
  const hero = page.hero;

  // Blog cluster for this industry (category slug == industry slug). Empty
  // for industries without a matching blog category — section is hidden.
  const clusterPosts = await sanityFetch<BlogPostListItem[] | null>({
    query: BLOG_POSTS_BY_CATEGORY_QUERY,
    params: { cat: page.slug },
    revalidate: 3600,
    tags: ["blogPost"],
  }).catch(() => null);
  const clusterPostsForLocale = (clusterPosts ?? []).filter((p) =>
    Boolean(p.slugs?.[locale]?.current && pickLocalized(p.title, locale)),
  );

  // "Cases in this niche": every /sites-for page links its portfolio
  // cases (and each case links back — see case-page/index.tsx).
  const [allCaseRefs, registry] = await Promise.all([
    sanityFetch<CaseStudyRef[] | null>({
      query: CASE_STUDIES_QUERY,
      revalidate: 3600,
      tags: ["caseStudy"],
    }).catch(() => null),
    getContentRegistrySafe(),
  ]);
  const nicheCases = (allCaseRefs ?? [])
    .filter((c) => c.industrySlug === page.slug)
    .filter((c) => hasLocaleContent(c, locale))
    .slice(0, 3);

  // Industry mini-calculator (reuses the site-type MiniCalc). Rendered right
  // after the pricing/comparison section when one exists, otherwise after
  // the last CMS section.
  const calcContent = industryCalcContent(page.slug, locale);
  const calcHeading = industryCalcHeading(page.slug, locale);
  const hasComparison = Boolean(
    page.sections?.some((sct) => sct._type === "comparisonBlock"),
  );
  const calcSection =
    calcContent && calcHeading ? (
      <section className="relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_44%_40%_at_20%_80%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%)]" />
        <div className="relative max-w-container mx-auto">
          <div className="mx-auto max-w-[640px] text-center mb-8">
            <h2 className="m-0 font-actay uppercase font-bold text-[clamp(22px,2.6vw,34px)] leading-[1.15] text-ink">
              {calcHeading.heading}
            </h2>
            <p className="mt-3 mb-0 font-sans text-[14.5px] leading-[1.6] text-ink-dim">
              {calcHeading.sub}
            </p>
          </div>
          <div className="mx-auto max-w-[620px]">
            <MiniCalc
              content={calcContent}
              locale={locale}
              source={`${page.slug}-calc-${locale}`}
            />
          </div>
        </div>
      </section>
    ) : null;

  // ── Medicine composition ────────────────────────────────────────────
  // The medicine page runs a bespoke hero and three extra sections; every
  // other industry keeps the shared blocks untouched.
  const isMedicine = page.slug === "medicine";

  /**
   * Splits the CMS headline into plain lines and the accented one. A line
   * carrying an `*em*` marker is the accent; the marker itself is stripped
   * because <MedHero> paints the whole line rather than an inline span.
   */
  const heroLines = (() => {
    const raw = hero?.heading ? loc(hero.heading, locale).split("\n") : [];
    const plain: React.ReactNode[] = [];
    let accent: React.ReactNode;
    raw.forEach((line, i) => {
      if (line.includes("*") && accent === undefined) {
        accent = line.replace(/\*+/g, "");
      } else {
        plain.push(<Fragment key={i}>{formatLine(line)}</Fragment>);
      }
    });
    return { plain, accent };
  })();

  const heroFeatures = hero?.features?.length
    ? hero.features.map((f) => {
        const str = loc(f, locale);
        const pipeIdx = str.indexOf(" | ");
        return pipeIdx > -1
          ? { label: str.slice(0, pipeIdx), sub: str.slice(pipeIdx + 3) }
          : { label: str, sub: "" };
      })
    : undefined;

  const heroStats = hero?.stats?.length
    ? hero.stats.map((s) => ({
        num: loc(s.value, locale),
        lbl: formatLine(loc(s.label, locale)),
      }))
    : undefined;

  const heroTicker = hero?.tickerItems?.length
    ? hero.tickerItems.map((t) => loc(t, locale))
    : undefined;

  const heroDeviceTags = hero?.deviceTags?.length
    ? hero.deviceTags.map((dt) => ({
        kind: dt.kind ?? "default",
        primary: loc(dt.primary, locale),
        mini: dt.mini,
      }))
    : undefined;

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
      {/* `med` scopes the medicine design layer (accents, streaks) AND drops
          the decorative italic on <em> across every shared CMS block on this
          one page — see medicine/medicine.css. */}
      <main className={isMedicine ? "med" : undefined}>
      {isMedicine ? (
        <MedHero
          eyebrow={eyebrowProp?.label}
          eyebrowEm={eyebrowProp?.em || undefined}
          h1Lines={heroLines.plain}
          h1Accent={heroLines.accent}
          kpiValue={hero?.h1Num}
          kpiLabel={
            hero?.h1NumLabel
              ? formatLine(loc(hero.h1NumLabel, locale))
              : undefined
          }
          lede={hero?.lede ? formatLine(loc(hero.lede, locale)) : undefined}
          features={heroFeatures}
          ctaPrimaryLabel={loc(hero?.ctaPrimary, locale) || undefined}
          ctaPrimaryHref={localizePath("/contacts", locale)}
          ctaSecondaryLabel={loc(hero?.ctaSecondary, locale) || undefined}
          ctaSecondaryHref={buildHrefWithParams(
            resolveRootHref("/portfolio", locale),
            { industry: page.slug },
          )}
          stats={heroStats}
          tickerItems={heroTicker}
          deviceTags={heroDeviceTags}
          deviceMockupImage={hero?.deviceMockup ?? undefined}
          deviceMockupAlt={
            loc(hero?.deviceMockup?.alt, locale) ||
            loc(hero?.heading, locale) ||
            undefined
          }
        />
      ) : (
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
        ctaPrimaryHref={localizePath("/contacts", locale)}
        ctaSecondaryLabel={loc(hero?.ctaSecondary, locale) || undefined}
        ctaSecondaryHref={buildHrefWithParams(
          resolveRootHref("/portfolio", locale),
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
      )}

      {isMedicine ? (
        <>
          <MedVitals locale={locale} />
          <MedBookingDemo locale={locale} />
          <MedPatientFlow locale={locale} />
          {locale === DEFAULT_LOCALE ? (
            /* Specialization subpages exist in the default locale only. */
            <section className="bg-bg px-6 sm:px-8 lg:px-12 py-8">
              <p className="max-w-container mx-auto m-0 font-sans text-[15.5px] leading-[1.65] text-ink-dim">
                Окремі рішення під вашу спеціалізацію:{" "}
                <Link
                  href="/sites-for/medicine/stomatolohiia"
                  className="rich-link"
                >
                  створення сайту для стоматології
                </Link>
                {" · "}
                <Link
                  href="/sites-for/medicine/medychnyi-tsentr"
                  className="rich-link"
                >
                  розробка сайту для медичного центру
                </Link>
              </p>
            </section>
          ) : null}
        </>
      ) : null}

      {page.sections?.map((section) => (
        <Fragment key={section._key}>
          <SectionBlock
            section={section}
            locale={locale}
            slug={page.slug}
          />
          {section._type === "comparisonBlock" ? calcSection : null}
        </Fragment>
      ))}
      {!hasComparison ? calcSection : null}

      {nicheCases.length > 0 ? (
        <section className="relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-bg">
          <div className="max-w-container mx-auto">
            <div className="mb-10">
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
                / {LABELS[locale].nicheCasesEyebrow}
              </div>
              <h2 className="mt-3 mb-0 font-actay uppercase font-bold text-[clamp(22px,2.6vw,34px)] leading-[1.15] text-ink">
                {LABELS[locale].nicheCasesHeading}
              </h2>
            </div>
            <div className={casesGridClass}>
              {nicheCases.map((r) => {
                const item = caseRefToCardItem(r, locale, registry);
                const metaLine = [item.industry, item.region, item.year]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <RelatedCard
                    key={r._id}
                    metrics={item.chips}
                    title={item.name}
                    eyebrow={metaLine || undefined}
                    sub={item.metrics || undefined}
                    coverImage={
                      item.coverImage
                        ? {
                            src: item.coverImage,
                            alt: item.coverImageAlt ?? item.name,
                          }
                        : undefined
                    }
                    gradient={item.gradient}
                    href={item.href}
                  />
                );
              })}
            </div>
            <a
              href={resolveRootHref("/portfolio", locale)}
              className="inline-flex items-center gap-2 min-h-11 py-2.5 px-5 border border-line-strong rounded-full font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-accent-40"
            >
              {LABELS[locale].nicheCasesAll}
            </a>
          </div>
        </section>
      ) : null}

      {clusterPostsForLocale.length > 0 ? (
        <section className="relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-bg">
          <div className="max-w-container mx-auto">
            <div className="mb-10">
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
                / {LABELS[locale].articlesEyebrow}
              </div>
              <h2 className="mt-3 mb-0 font-actay uppercase font-bold text-[clamp(22px,2.6vw,34px)] leading-[1.15] text-ink">
                {LABELS[locale].articlesHeading}
              </h2>
            </div>
            <div className={casesGridClass}>
              {clusterPostsForLocale.slice(0, 3).map((p) => {
                const pSlug = p.slugs?.[locale]?.current ?? "";
                const cover = resolveBlogCover(p, locale);
                const reading = p.readingTimeMinutes
                  ? LABELS[locale].minRead(p.readingTimeMinutes)
                  : undefined;
                return (
                  <RelatedCard
                    key={p._id}
                    category={loc(p.category?.name, locale) || undefined}
                    metrics={reading ? [reading] : []}
                    title={pickLocalized(p.title, locale) ?? pSlug}
                    sub={pickLocalized(p.lede, locale)}
                    coverImage={
                      cover.generic
                        ? undefined
                        : { src: cover.image, alt: cover.alt }
                    }
                    generatedCover={
                      cover.generic
                        ? {
                            title: pickLocalized(p.title, locale) ?? pSlug,
                            category: loc(p.category?.name, locale) || undefined,
                          }
                        : undefined
                    }
                    coverAspect="wide"
                    href={localizePath(`/blog/${pSlug}`, locale)}
                  />
                );
              })}
            </div>
            <a
              href={resolveRootHref("/blog", locale)}
              className="inline-flex items-center gap-2 min-h-11 py-2.5 px-5 border border-line-strong rounded-full font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-accent-40"
            >
              {LABELS[locale].articlesAll}
            </a>
          </div>
        </section>
      ) : null}
      </main>

      <HpFooter />
    </>
  );
}
