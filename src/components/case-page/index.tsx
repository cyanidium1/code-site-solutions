/**
 * Sanity-driven case-study page renderer. Mirrors the layout of the
 * (now disabled) hardcoded NBYG / Efedra pages: header, hero, meta-strip,
 * sections via a section-mapper, related cases, footer CTA.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { CasePageHero } from "@/components/case-page/case-page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import {
  EfedraCaseGallery,
  type EfedraGalleryTile,
} from "@/components/portfolio/efedra-case-gallery";
import {
  HpHeader,
  HpFooter,
  PullQuote,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { btnClass } from "@/components/ui";
import {
  RelatedCard,
  casesGridClass,
} from "@/components/blocks/related-card";

import type {
  CaseStudyDoc,
  CaseStudySection,
  Locale,
  MediaGallerySection,
  QuoteSection,
  TestimonialSection,
} from "@/types/sanity";
import { loc } from "@/lib/shared/sanity-locale";
import { hasLocaleContent } from "@/lib/shared/locale-content";
import { DEFAULT_LOCALE, LOCALE_CONFIG } from "@/constants/locales";
import { localizePath, resolveRootHref } from "@/constants/i18n-routes";
import type { ReactNode } from "react";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg } from "@/lib/shared/sanity-image";
import { sanityCdn } from "@/lib/shared/sanity-cdn";
import {
  PortableInline,
  formatLine,
  plainPortable,
} from "@/lib/shared/sanity-portable";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  buildReviewNodes,
  breadcrumbNode,
  webPageNode,
  type JsonLdNode,
  type RawReview,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { pickLocalized } from "@/lib/shared/pick-localized";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass } from "@/components/homepage/shared";

/* ─── data layer ──────────────────────────────────────────────────────────
   Fetchers / metadata / locale helpers live in ./data.ts so data-only
   consumers (lib/server/fetch-homepage-cases.ts on the homepage) don't pull
   this component tree — and its route-scoped CSS — into their module graph.
   Re-exported here so page-level importers keep using the barrel. */

import {
  buildCaseStudyMetadata,
  fetchCaseStudies,
  fetchCaseStudy,
  pathFor,
} from "./data";

export {
  buildCaseStudyMetadata,
  fetchCaseStudies,
  fetchCaseStudy,
};

/* ─── JSON-LD ────────────────────────────────────────────────────────── */

/** Static UI strings, per locale. Adding a locale extends this record. */
const LABELS: Record<
  Locale,
  {
    home: string;
    portfolio: string;
    visitSite: string;
    caseEyebrow: string;
    relatedEyebrow: string;
    relatedLink: string;
  }
> = {
  uk: {
    home: "Головна",
    portfolio: "Портфоліо",
    visitSite: "Перейти на сайт",
    caseEyebrow: "КЕЙС",
    relatedEyebrow: "СУМІЖНІ КЕЙСИ",
    relatedLink: "Всі кейси",
  },
  en: {
    home: "Home",
    portfolio: "Portfolio",
    visitSite: "Visit site",
    caseEyebrow: "CASE STUDY",
    relatedEyebrow: "RELATED",
    relatedLink: "All cases",
  },
  ru: {
    home: "Главная",
    portfolio: "Портфолио",
    visitSite: "Перейти на сайт",
    caseEyebrow: "КЕЙС",
    relatedEyebrow: "СМЕЖНЫЕ КЕЙСЫ",
    relatedLink: "Все кейсы",
  },
};

/**
 * Keyword anchors for the "same niche" contextual link every case emits
 * back to its /sites-for page (uk — the SEO-bearing locale; en/ru fall
 * back to the industry title from the CMS).
 */
const NICHE_ANCHOR_UK: Record<string, string> = {
  medicine: "створення медичних сайтів",
  renovation: "розробка сайту для будівельної компанії",
  legal: "створення сайту для юридичної фірми",
  auto: "розробка сайту автосервісу",
  "real-estate": "створення сайту нерухомості",
  finance: "сайт для фінансової компанії",
  courses: "створення сайту для онлайн-курсів",
  ecommerce: "створення інтернет-магазину під ключ",
};

const NICHE_LEAD: Record<Locale, string> = {
  uk: "Потрібен схожий сайт?",
  en: "Need a similar website?",
  ru: "Нужен похожий сайт?",
};

const PRICING_ANCHOR: Record<Locale, string> = {
  uk: "вартість розробки сайту",
  en: "website development cost",
  ru: "стоимость разработки сайта",
};

const RELATED_HEADING: Record<Locale, ReactNode> = {
  uk: (
    <>
      Інші <em>кейси</em>
    </>
  ),
  en: (
    <>
      Other <em>case studies</em>
    </>
  ),
  ru: (
    <>
      Другие <em>кейсы</em>
    </>
  ),
};

function buildCaseJsonLd(doc: CaseStudyDoc, locale: Locale): JsonLdNode {
  const path = pathFor(doc.slug, locale);
  const url = pageUrl(path);
  const title = loc(doc.title, locale);
  const description = loc(doc.seo?.description, locale) || undefined;
  const ABOUT_URL = pageUrl("/about");
  const rawCaseImage =
    doc.seo?.ogImage?.url ??
    doc.hero?.heroImage?.asset?.url ??
    doc.coverImage?.asset?.url;
  const caseImageUrl = rawCaseImage
    ? sanityCdn(rawCaseImage, { w: 1200, q: 70 })
    : undefined;

  const homeName = LABELS[locale].home;
  const homePath = localizePath("/", locale);
  const portfolioName = LABELS[locale].portfolio;
  const portfolioPath = resolveRootHref("/portfolio", locale);

  // Pull testimonials embedded in the case sections. testimonialBlock is
  // always a review; quoteBlock only counts when its `isReview` flag is on
  // (it doubles as a press-quote / stat call-out otherwise).
  const reviewSeeds: RawReview[] = (doc.sections ?? []).flatMap((s) => {
    if (s._type === "testimonialBlock") {
      return [{
        body: loc(s.quote, locale),
        authorName: s.authorName ?? "",
        rating: s.rating,
        datePublished: s.reviewDate,
        headline: loc(s.reviewHeadline, locale) || undefined,
      }];
    }
    if (s._type === "quoteBlock" && s.isReview) {
      return [{
        body: loc(s.quote, locale),
        authorName: s.authorName ?? "",
        rating: s.rating,
        datePublished: s.reviewDate,
        headline: loc(s.reviewHeadline, locale) || undefined,
      }];
    }
    return [];
  });
  // SEO audit Aug 2026: this used to point at `${url}#article`, which claimed
  // the client had reviewed the case write-up rather than the studio's work.
  // Same reasoning as industry-page: the testimonial is about the studio.
  const reviews = buildReviewNodes(reviewSeeds, ORG_ID);

  return buildJsonLd([
    webPageNode({
      path,
      locale,
      title,
      description,
      type: "ItemPage",
    }),
    breadcrumbNode([
      { name: homeName, path: homePath },
      { name: portfolioName, path: portfolioPath },
      { name: title, path },
    ]),
    {
      "@type": "Article",
      "@id": `${url}#article`,
      url,
      headline: title,
      description,
      inLanguage: LOCALE_CONFIG[locale].bcp47,
      datePublished:
        doc.date ?? `${doc.year ?? new Date().getFullYear()}-01-01`,
      author: {
        "@type": "Person",
        "@id": `${ABOUT_URL}#fedir-alpatov`,
        name: "Fedir Alpatov",
        jobTitle: "Founder, Code-Site.Art",
        url: ABOUT_URL,
      },
      publisher: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Code-Site.Art",
      },
      // SEO audit Aug 2026: `image` is required on Article and was omitted on
      // every case page. Same source chain the OG tag uses.
      ...(caseImageUrl ? { image: [caseImageUrl] } : {}),
    },
    reviews,
  ]);
}

/* ─── YouTube walkthrough section ──────────────────────────────────────
   Rendered ABOVE the centered+horizontal OUTCOME block when `doc.youtubeId`
   is set. Standalone embed, NOT one of the OUTCOME side mockups. */

function YouTubeSection({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  return (
    <section className="bg-bg px-6 sm:px-8 lg:px-12 pt-9 lg:pt-14">
      <div className="relative mx-auto aspect-[16/9] max-w-container-narrow overflow-hidden rounded-[18px] border border-line bg-[oklch(0_0_0/0.6)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </section>
  );
}

/* ─── mediaGalleryBlock rendering ─────────────────────────────────────── */

function GalleryRenderer({
  section,
  locale,
}: {
  section: MediaGallerySection;
  locale: Locale;
}) {
  const tiles: EfedraGalleryTile[] =
    section.images
      ?.map((img) => {
        const asset = img.asset;
        if (!asset?.url) return null;
        return {
          label: loc(img.caption, locale),
          src: asset.url,
          alt: loc(img.alt, locale),
          ...(img.fit ? { fit: img.fit } : {}),
        } satisfies EfedraGalleryTile;
      })
      .filter((t): t is EfedraGalleryTile => t !== null) ?? [];

  if (!tiles.length) return null;

  return <EfedraCaseGallery tiles={tiles} />;
}

/* ─── pull-quote from CMS testimonial / quote blocks ─────────────────── */

function CaseTestimonial({
  section,
  locale,
}: {
  section: QuoteSection | TestimonialSection;
  locale: Locale;
}) {
  const quoteText = loc(section.quote, locale)?.trim();
  if (!quoteText) return null;

  const name = section.authorName?.trim() ?? "";
  const role = loc(section.authorRole, locale)?.trim() ?? "";

  return (
    <PullQuote
      quote={plainPortable([
        {
          _type: "block",
          children: [{ _type: "span", text: quoteText, marks: [] }],
        },
      ])}
      name={name}
      role={role}
      showAvatar={false}
    />
  );
}

/* ─── section mapper ─────────────────────────────────────────────────── */

function SectionBlock({
  section,
  locale,
  doc,
}: {
  section: CaseStudySection;
  locale: Locale;
  doc: CaseStudyDoc;
}) {
  switch (section._type) {
    case "imageTextBlock": {
      const isCentered = section.variant === "centered";
      const hasImage = Boolean(section.image?.asset?.url);
      const hasImage2 = Boolean(section.image2?.asset?.url);

      if (isCentered) {
        // Centered OUTCOME: text in the middle with two real screenshots
        // floating on the sides. No YT embed / "Screenshot pending" fallback —
        // both images come from CMS. Falls back to vertical stack if either
        // image is missing or layout is "vertical".
        const img1 = hasImage ? (
          <SanityImg
            image={section.image}
            alt={
              loc(section.image?.alt, locale) ||
              loc(section.heading, locale) ||
              loc(doc.title, locale)
            }
            sizes={IMG_SIZES.prose}
          />
        ) : null;
        const img2 = hasImage2 ? (
          <SanityImg
            image={section.image2}
            alt={
              loc(section.image2?.alt, locale) ||
              loc(section.heading, locale) ||
              loc(doc.title, locale)
            }
            sizes={IMG_SIZES.prose}
          />
        ) : null;

        return (
          <>
            {doc.youtubeId ? (
              <YouTubeSection
                videoId={doc.youtubeId}
                title={`${loc(doc.title, locale)} — video walkthrough`}
              />
            ) : null}
            <ImageText
              variant="centered"
              centeredLayout={section.centeredLayout ?? "vertical"}
              bulletIcon={section.bulletIcon ?? "check"}
              eyebrow={loc(section.eyebrow, locale) || undefined}
              heading={formatLine(loc(section.heading, locale)) ?? ""}
              body={
                <PortableInline
                  value={pickLocalized(section.body, locale)}
                />
              }
              bulletList={section.bulletList
                ?.map((b) => loc(b, locale))
                .filter(Boolean)}
              image={img1}
              secondImage={img2}
            />
          </>
        );
      }

      const effectiveVariant =
        section.variant === "centered"
          ? "centered"
          : section.bulletList?.length
            ? "side-with-list"
            : (section.variant ?? "side");

      // "natural" fit: non-fill <img> keeps intrinsic width/height so the
      // block renders the full screenshot instead of cropping into 4:3.
      const isNaturalFit = section.imageFit === "natural";
      const imageAlt =
        loc(section.image?.alt, locale) ||
        loc(section.heading, locale) ||
        loc(doc.title, locale);
      const imageNode: React.ReactNode = hasImage ? (
        isNaturalFit ? (
          <SanityImg
            image={section.image}
            alt={imageAlt}
            sizes={IMG_SIZES.half}
          />
        ) : (
          <SanityImg
            image={section.image}
            alt={imageAlt}
            fill
            sizes={IMG_SIZES.half}
            className="object-cover"
          />
        )
      ) : null;

      return (
        <ImageText
          variant={effectiveVariant}
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
          bulletList={section.bulletList
            ?.map((b) => loc(b, locale))
            .filter(Boolean)}
          image={imageNode}
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
    }

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

    case "quoteBlock":
    case "testimonialBlock":
      return <CaseTestimonial section={section} locale={locale} />;

    case "mediaGalleryBlock":
      return <GalleryRenderer section={section} locale={locale} />;

    /* TODO: render beforeAfterBlock / ctaBlock / richTextBlock once a case
       actually uses them. */
    default:
      return null;
  }
}

/* ─── main page component ────────────────────────────────────────────── */

export async function CasePageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const doc = await fetchCaseStudy(slug);
  if (!doc) notFound();
  if (!hasLocaleContent(doc, locale)) notFound();

  const [allCases, registry] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
  ]);
  // Related cases ROTATE: take the three that follow this one in the shared
  // ordering, wrapping around. A plain `.slice(0, 3)` always surfaced the
  // same three cases site-wide, so every other case page received zero
  // in-body inbound links (measured: 22 of 25 cases sat at 1 inbound, their
  // only link coming from the /portfolio index). Rotating distributes three
  // inbound links to every case at no editorial cost.
  const pool = allCases.filter((c) => hasLocaleContent(c, locale));
  const self = pool.findIndex((c) => c.slug === doc.slug);
  const related =
    pool.length > 1
      ? Array.from(
          { length: Math.min(3, pool.length - 1) },
          (_, i) => pool[(Math.max(self, 0) + 1 + i) % pool.length],
        ).filter((c) => c.slug !== doc.slug)
      : [];

  const title = loc(doc.title, locale);
  const eyebrow = loc(doc.hero?.eyebrow, locale);
  const heading = formatLine(loc(doc.hero?.heading, locale));
  const sub = loc(doc.hero?.subheading, locale);
  const heroCta = doc.hero?.link?.href
    ? {
        label: loc(doc.hero.link.label, locale) || LABELS[locale].visitSite,
        href: doc.hero.link.href,
      }
    : undefined;

  const labels = LABELS[locale];
  const relatedHeading = RELATED_HEADING[locale];

  const heroImageNode = doc.hero?.heroImage?.asset?.url ? (
    <SanityImg
      image={doc.hero.heroImage}
      alt={loc(doc.hero.heroImage.alt, locale) || title}
      sizes="(max-width: 960px) 90vw, 40vw"
      priority
    />
  ) : null;

  return (
    <>
      <JsonLd data={buildCaseJsonLd(doc, locale)} />
      <HpHeader />

      <CasePageHero
        breadcrumbs={[
          { label: labels.home, href: localizePath("/", locale) },
          { label: labels.portfolio, href: "/portfolio" },
          { label: title },
        ]}
        eyebrow={eyebrow || labels.caseEyebrow}
        headline={heading ?? title}
        sub={sub}
        image={heroImageNode}
        cta={heroCta}
      />

      {doc.sections?.map((s) => (
        <SectionBlock key={s._key} section={s} locale={locale} doc={doc} />
      ))}

      {/* Contextual links: every case points at its niche page and at
          /pricing with keyword anchors (server-rendered). */}
      {doc.industry?.slug ? (
        <section className="bg-bg px-6 sm:px-8 lg:px-12 py-9">
          <p className="relative max-w-container mx-auto m-0 font-sans text-[15.5px] leading-[1.65] text-ink-dim">
            {NICHE_LEAD[locale]}{" "}
            <Link
              href={
                locale === DEFAULT_LOCALE ||
                registry.get(locale)?.industries.has(doc.industry.slug)
                  ? localizePath(`/sites-for/${doc.industry.slug}`, locale)
                  : `/sites-for/${doc.industry.slug}`
              }
              className="rich-link"
            >
              {locale === DEFAULT_LOCALE
                ? (NICHE_ANCHOR_UK[doc.industry.slug] ??
                  loc(doc.industry.title, locale))
                : loc(doc.industry.title, locale)}
            </Link>
            {" · "}
            <Link href={resolveRootHref("/pricing", locale)} className="rich-link">
              {PRICING_ANCHOR[locale]}
            </Link>
          </p>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className={hpSectionHeadClass}>
              <div className={hpEyebrowClass}>
                <span className={hpEyebrowDotClass} />
                <span>{labels.relatedEyebrow}</span>
              </div>
              <h2 className={hpH2Class}>{relatedHeading}</h2>
            </div>
            <div className={casesGridClass}>
              {related.map((r) => {
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
                        ? { src: item.coverImage, alt: item.coverImageAlt ?? item.name }
                        : undefined
                    }
                    gradient={item.gradient}
                    href={item.href}
                  />
                );
              })}
            </div>
            <Link
              href={resolveRootHref("/portfolio", locale)}
              className={btnClass("primary", "hp-section-cta")}
            >
              <span>{labels.relatedLink}</span>
              <ArrowUpRight size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </section>
      ) : null}

      <LaunchCta locale={locale} />

      <HpFooter />
    </>
  );
}
