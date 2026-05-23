/**
 * Sanity-driven case-study page renderer. Mirrors the layout of the
 * (now disabled) hardcoded NBYG / Efedra pages: header, hero, meta-strip,
 * sections via a section-mapper, related cases, footer CTA.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
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
import "@/components/homepage/homepage.css";
import "@/components/blocks/buttons/buttons.css";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  CASE_STUDIES_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
} from "@/lib/server/sanity-queries";
import type {
  CaseStudyDoc,
  CaseStudyRef,
  CaseStudySection,
  Locale,
  MediaGallerySection,
  RichTextSimple,
} from "@/types/sanity";
import { loc } from "@/lib/shared/sanity-locale";
import { SanityImg } from "@/lib/shared/sanity-image";
import {
  PortableInline,
  formatLine,
  plainPortable,
} from "@/lib/shared/sanity-portable";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import { presentationForCase } from "@/lib/shared/case-presentation";

/* ─── locale / path helpers ───────────────────────────────────────────── */

function pathFor(slug: string, locale: Locale): string {
  return locale === "en"
    ? `/en/portfolio/${slug}`
    : `/portfolio/${slug}`;
}

function pickRichText(
  uk: RichTextSimple | undefined,
  en: RichTextSimple | undefined,
  locale: Locale,
): RichTextSimple | undefined {
  if (locale === "en") {
    if (en && en.length) return en;
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[pickRichText] missing EN translation; returning undefined");
    }
    return undefined;
  }
  return uk;
}

export function hasEnglishCaseContent(doc: CaseStudyDoc): boolean {
  return Boolean(doc.title?.en && doc.title.en.trim().length > 0);
}

/* ─── data fetchers ───────────────────────────────────────────────────── */

export async function fetchCaseStudy(
  slug: string,
): Promise<CaseStudyDoc | null> {
  return sanityFetch<CaseStudyDoc | null>({
    query: CASE_STUDY_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 3600,
    tags: [`caseStudy:${slug}`],
  });
}

export async function fetchCaseStudies(): Promise<CaseStudyRef[]> {
  return (
    (await sanityFetch<CaseStudyRef[]>({
      query: CASE_STUDIES_QUERY,
      revalidate: 3600,
      tags: ["caseStudy"],
    }).catch(() => [])) ?? []
  );
}

/* ─── metadata builder ────────────────────────────────────────────────── */

export async function buildCaseStudyMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  const doc = await fetchCaseStudy(slug);
  if (!doc) return {};

  const title =
    loc(doc.seo?.title, locale) || loc(doc.title, locale);
  const description = loc(doc.seo?.description, locale);
  const path = pathFor(slug, locale);
  const enAvailable = hasEnglishCaseContent(doc);

  const languages: Record<string, string> = {
    uk: `/portfolio/${slug}`,
  };
  if (enAvailable) {
    languages.en = `/en/portfolio/${slug}`;
    languages["x-default"] = `/portfolio/${slug}`;
  }

  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      locale: locale === "en" ? "en_US" : "uk_UA",
    },
  };
}

/* ─── JSON-LD ────────────────────────────────────────────────────────── */

function buildJsonLd(
  doc: CaseStudyDoc,
  locale: Locale,
): Record<string, unknown> {
  const url = pageUrl(pathFor(doc.slug, locale));
  const title = loc(doc.title, locale);
  const description = loc(doc.seo?.description, locale) || undefined;
  const ABOUT_URL = pageUrl("/about");

  const homeName = locale === "en" ? "Home" : "Головна";
  const homeUrl = locale === "en" ? `${SITE_ORIGIN}/en` : SITE_ORIGIN;
  const portfolioName = locale === "en" ? "Portfolio" : "Портфоліо";
  const portfolioUrl = `${SITE_ORIGIN}/portfolio`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeName, item: homeUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: portfolioName,
            item: portfolioUrl,
          },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        headline: title,
        description,
        inLanguage: locale === "en" ? "en" : "uk",
        datePublished: doc.date ?? `${doc.year ?? new Date().getFullYear()}-01-01`,
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
      },
    ],
  };
}

/* ─── asset placeholder for inline screenshots that haven't been
   uploaded yet (e.g. NBYG inline images, until founder supplies them). */

function ScreenshotPending({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, oklch(0.55 0.20 25 / 0.18) 0%, oklch(0.62 0.18 60 / 0.18) 100%)",
        color: "var(--ink-3)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: 24,
      }}
    >
      {label}
    </div>
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
        } satisfies EfedraGalleryTile;
      })
      .filter((t): t is EfedraGalleryTile => t !== null) ?? [];

  if (!tiles.length) return null;

  return <EfedraCaseGallery tiles={tiles} />;
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
          />
        ) : null;

        return (
          <ImageText
            variant="centered"
            centeredLayout={section.centeredLayout ?? "vertical"}
            bulletIcon={
              (section as { bulletIcon?: "check" | "cross" }).bulletIcon ??
              "check"
            }
            eyebrow={loc(section.eyebrow, locale) || undefined}
            heading={formatLine(loc(section.heading, locale)) ?? ""}
            body={
              <PortableInline
                value={pickRichText(section.body, section.bodyEn, locale)}
              />
            }
            bulletList={section.bulletList?.map((b) => loc(b, locale))}
            image={img1}
            secondImage={img2}
          />
        );
      }

      // Side / side-with-list variants — keep ScreenshotPending fallback here only.
      const imageNode: React.ReactNode = hasImage ? (
        <SanityImg
          image={section.image}
          alt={
            loc(section.image?.alt, locale) ||
            loc(section.heading, locale) ||
            loc(doc.title, locale)
          }
          fill
          className="object-cover"
        />
      ) : (
        <ScreenshotPending
          label={
            locale === "en"
              ? "Screenshot — coming soon"
              : "Скріншот — незабаром"
          }
        />
      );

      return (
        <ImageText
          variant={section.variant ?? "side"}
          imageVariant={section.imageVariant ?? "imageRight"}
          bulletIcon={
            (section as { bulletIcon?: "check" | "cross" }).bulletIcon ??
            "check"
          }
          eyebrow={loc(section.eyebrow, locale) || undefined}
          heading={formatLine(loc(section.heading, locale)) ?? ""}
          body={
            <PortableInline
              value={pickRichText(section.body, section.bodyEn, locale)}
            />
          }
          bulletList={section.bulletList?.map((b) => loc(b, locale))}
          image={imageNode}
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
    }

    case "statsBlock":
      return (
        <StatsBar
          items={
            section.items?.map((m) => ({
              value: m.value ?? "",
              label: loc(m.label, locale),
            })) ?? []
          }
        />
      );

    case "quoteBlock":
      return (
        <PullQuote
          quote={plainPortable([
            {
              _type: "block",
              children: [
                {
                  _type: "span",
                  text: loc(section.quote, locale),
                  marks: [],
                },
              ],
            },
          ])}
          name={section.authorName ?? ""}
          role={loc(section.authorRole, locale)}
          showAvatar={false}
        />
      );

    case "mediaGalleryBlock":
      return <GalleryRenderer section={section} locale={locale} />;

    /* TODO: render beforeAfterBlock / testimonialBlock / ctaBlock /
       richTextBlock once a case actually uses them. */
    default:
      return null;
  }
}

/* ─── related-cases card (Sanity-driven) ─────────────────────────────── */

function buildMetaLine(c: CaseStudyRef, locale: Locale, label: string): string {
  const region = loc(c.region, locale);
  const year = c.year ? String(c.year) : null;
  return [label, region, year].filter(Boolean).join(" · ");
}

function RelatedCard({
  c,
  locale,
}: {
  c: CaseStudyRef;
  locale: Locale;
}) {
  const pres = presentationForCase(c.slug, c.industrySlug);
  const href = pathFor(c.slug, locale);
  const name = loc(c.title, locale) || c.client || c.slug;
  const meta = buildMetaLine(c, locale, pres.label);
  const metrics = loc(c.metricsLine, locale);
  const industryLabel = pres.label;

  return (
    <Link href={href} className="hp-case-link">
      <div className="hp-case-cover">
        <div
          className="hp-case-cover-bg"
          style={{ background: pres.gradient }}
        />
        <div className="hp-case-cover-dots" />
        <div
          className="hp-case-shot"
          style={
            c.coverImage?.asset?.url
              ? { display: "flex", flexDirection: "column" }
              : undefined
          }
        >
          <div className="hp-case-shot-bar">
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
          </div>
          {c.coverImage?.asset?.url ? (
            <div
              className="hp-case-shot-body"
              style={{
                flex: 1,
                minHeight: 0,
                padding: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.coverImage.asset.url}
                alt={loc(c.coverImage.alt, locale) || name}
                className="absolute inset-0 block h-full w-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="hp-case-shot-body">
              <div className="hp-case-shot-line s1" />
              <div className="hp-case-shot-line s2" />
              <div className="hp-case-shot-line s3" />
            </div>
          )}
        </div>
      </div>
      <div className="hp-case-body">
        <div className="hp-case-chips">
          <span
            className="hp-case-chip"
            style={{
              color: pres.color,
              borderColor: `${pres.color}55`,
            }}
          >
            {industryLabel}
          </span>
          <span className="hp-case-chip">{pres.tech}</span>
        </div>
        <div className="hp-case-name-row">
          <h3 className="hp-case-name">{name}</h3>
          <ArrowUpRight
            size={20}
            strokeWidth={1.6}
            className="hp-case-arrow"
          />
        </div>
        <div className="hp-case-meta">{meta}</div>
        {metrics ? <div className="hp-case-metrics">{metrics}</div> : null}
      </div>
    </Link>
  );
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
  if (locale === "en" && !hasEnglishCaseContent(doc)) notFound();

  const allCases = await fetchCaseStudies();
  const related = allCases
    .filter((c) => c.slug !== doc.slug)
    .filter((c) => locale !== "en" || Boolean(c.title?.en))
    .slice(0, 3);

  const title = loc(doc.title, locale);
  const eyebrow = loc(doc.hero?.eyebrow, locale);
  const heading = formatLine(loc(doc.hero?.heading, locale));
  const sub = loc(doc.hero?.subheading, locale);

  const homeLabel = locale === "en" ? "Home" : "Головна";
  const portfolioLabel = locale === "en" ? "Portfolio" : "Портфоліо";

  const relatedHeading =
    locale === "en" ? (
      <>
        Other <em>case studies</em>
      </>
    ) : (
      <>
        Інші <em>кейси</em>
      </>
    );
  const relatedLink = locale === "en" ? "All cases" : "Всі кейси";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(doc, locale)),
        }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: homeLabel, href: locale === "en" ? "/en" : "/" },
          { label: portfolioLabel, href: "/portfolio" },
          { label: title },
        ]}
        eyebrow={eyebrow || (locale === "en" ? "CASE STUDY" : "КЕЙС")}
        headline={heading ?? title}
        sub={sub}
        image={heroImageNode}
      />

      {doc.sections?.map((s) => (
        <SectionBlock key={s._key} section={s} locale={locale} doc={doc} />
      ))}

      {related.length > 0 ? (
        <section className="hp-section">
          <div className="hp-inner">
            <div className="hp-section-head">
              <div className="hp-eyebrow">
                <span className="hp-eyebrow-dot" />
                <span>{locale === "en" ? "RELATED" : "СУМІЖНІ КЕЙСИ"}</span>
              </div>
              <h2 className="hp-h2">{relatedHeading}</h2>
            </div>
            <div className="hp-cases-grid">
              {related.map((r) => (
                <RelatedCard key={r._id} c={r} locale={locale} />
              ))}
            </div>
            <Link
              href={locale === "en" ? "/en/portfolio" : "/portfolio"}
              className="btn-primary hp-section-cta"
            >
              <span>{relatedLink}</span>
              <ArrowUpRight size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </section>
      ) : null}

      <LaunchCta locale={locale === "en" ? "en" : "uk"} />

      <HpFooter />
    </>
  );
}
